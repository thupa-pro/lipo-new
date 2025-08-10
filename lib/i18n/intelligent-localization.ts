"use client";

import { geolocationService, LocationData } from '../location/geolocation-service';

export interface LocalizationData {
  locale: string;
  language: string;
  country: string;
  currency: string;
  currencySymbol: string;
  dateFormat: string;
  timeFormat: string;
  numberFormat: string;
  direction: 'ltr' | 'rtl';
  timezone: string;
}

export interface TranslationKeys {
  [key: string]: string | TranslationKeys;
}

class IntelligentLocalizationService {
  private static instance: IntelligentLocalizationService;
  private currentLocale: string = 'en-US';
  private translations: Map<string, TranslationKeys> = new Map();
  private localizationData: LocalizationData | null = null;
  private fallbackLocale = 'en-US';

  static getInstance(): IntelligentLocalizationService {
    if (!IntelligentLocalizationService.instance) {
      IntelligentLocalizationService.instance = new IntelligentLocalizationService();
    }
    return IntelligentLocalizationService.instance;
  }

  // Initialize with intelligent locale detection
  async initialize(): Promise<LocalizationData> {
    try {
      // Multi-layer locale detection
      const detectedLocale = await this.detectOptimalLocale();
      await this.setLocale(detectedLocale);
      
      return this.localizationData!;
    } catch (error) {
      console.warn('Localization initialization failed:', error);
      await this.setLocale(this.fallbackLocale);
      return this.localizationData!;
    }
  }

  // Intelligent locale detection using multiple signals
  private async detectOptimalLocale(): Promise<string> {
    const signals = await Promise.allSettled([
      this.getLocationBasedLocale(),
      this.getBrowserLocale(),
      this.getUserPreferenceLocale(),
      this.getIPBasedLocale()
    ]);

    // Score different locale sources
    const localeScores: Record<string, number> = {};

    signals.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        const locale = result.value;
        const weights = [0.4, 0.3, 0.2, 0.1]; // Location, Browser, User Pref, IP
        localeScores[locale] = (localeScores[locale] || 0) + weights[index];
      }
    });

    // Return highest scoring locale
    const bestLocale = Object.entries(localeScores)
      .sort(([, a], [, b]) => b - a)[0]?.[0];

    return bestLocale || this.fallbackLocale;
  }

  private async getLocationBasedLocale(): Promise<string> {
    try {
      const location = await geolocationService.getCurrentLocation();
      return location.locale || this.getLocaleFromCountry(location.countryCode || '');
    } catch (error) {
      throw new Error('Location-based locale detection failed');
    }
  }

  private getBrowserLocale(): string {
    return navigator.language || navigator.languages[0] || this.fallbackLocale;
  }

  private getUserPreferenceLocale(): string {
    return localStorage.getItem('loconomy_preferred_locale') || '';
  }

  private async getIPBasedLocale(): Promise<string> {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return this.getLocaleFromCountry(data.country_code);
    } catch (error) {
      throw new Error('IP-based locale detection failed');
    }
  }

  // Set locale and load localization data
  async setLocale(locale: string): Promise<void> {
    this.currentLocale = locale;
    
    // Load translations
    await this.loadTranslations(locale);
    
    // Generate localization data
    this.localizationData = this.generateLocalizationData(locale);
    
    // Store user preference
    localStorage.setItem('loconomy_preferred_locale', locale);
    
    // Update document language
    document.documentElement.lang = locale.split('-')[0];
    document.documentElement.dir = this.localizationData.direction;
    
    // Notify components about locale change
    this.notifyLocaleChange(locale);
  }

  // Generate comprehensive localization data
  private generateLocalizationData(locale: string): LocalizationData {
    const [language, country] = locale.split('-');
    const currencyData = this.getCurrencyData(country);
    
    return {
      locale,
      language,
      country: country || 'US',
      currency: currencyData.code,
      currencySymbol: currencyData.symbol,
      dateFormat: this.getDateFormat(locale),
      timeFormat: this.getTimeFormat(locale),
      numberFormat: this.getNumberFormat(locale),
      direction: this.getTextDirection(language),
      timezone: this.getTimezone(country)
    };
  }

  // Load translations dynamically
  private async loadTranslations(locale: string): Promise<void> {
    try {
      // Try to load specific locale
      const translations = await import(`../../messages/${locale}.json`);
      this.translations.set(locale, translations.default);
    } catch (error) {
      try {
        // Fallback to language only
        const language = locale.split('-')[0];
        const translations = await import(`../../messages/${language}.json`);
        this.translations.set(locale, translations.default);
      } catch (fallbackError) {
        // Use fallback locale
        if (locale !== this.fallbackLocale) {
          const fallbackTranslations = await import(`../../messages/${this.fallbackLocale}.json`);
          this.translations.set(locale, fallbackTranslations.default);
        }
      }
    }
  }

  // Intelligent translation with context awareness
  translate(
    key: string, 
    variables?: Record<string, any>,
    context?: 'formal' | 'casual' | 'business' | 'technical'
  ): string {
    const translations = this.translations.get(this.currentLocale);
    if (!translations) return key;

    // Support nested keys (e.g., 'common.buttons.save')
    const value = this.getNestedValue(translations, key);
    
    if (typeof value !== 'string') {
      // Handle contextual translations
      if (value && typeof value === 'object' && context) {
        const contextValue = (value as any)[context];
        if (contextValue) return this.interpolate(contextValue, variables);
      }
      return key;
    }

    return this.interpolate(value, variables);
  }

  // Format numbers according to locale
  formatNumber(
    number: number, 
    options?: Intl.NumberFormatOptions
  ): string {
    return new Intl.NumberFormat(this.currentLocale, options).format(number);
  }

  // Format currency with intelligent conversion
  async formatCurrency(
    amount: number, 
    currency?: string,
    convertToLocal = true
  ): Promise<string> {
    const targetCurrency = currency || this.localizationData?.currency || 'USD';
    
    let finalAmount = amount;
    
    if (convertToLocal && currency && currency !== this.localizationData?.currency) {
      finalAmount = await this.convertCurrency(amount, currency, this.localizationData?.currency || 'USD');
    }

    return new Intl.NumberFormat(this.currentLocale, {
      style: 'currency',
      currency: targetCurrency,
      minimumFractionDigits: this.getCurrencyDecimals(targetCurrency)
    }).format(finalAmount);
  }

  // Format dates with cultural awareness
  formatDate(
    date: Date, 
    style: 'full' | 'long' | 'medium' | 'short' = 'medium'
  ): string {
    return new Intl.DateTimeFormat(this.currentLocale, {
      dateStyle: style
    }).format(date);
  }

  // Format relative time (e.g., "2 hours ago")
  formatRelativeTime(date: Date): string {
    const rtf = new Intl.RelativeTimeFormat(this.currentLocale, { numeric: 'auto' });
    const diffInSeconds = Math.floor((date.getTime() - Date.now()) / 1000);
    
    const units: Array<[string, number]> = [
      ['year', 31536000],
      ['month', 2592000],
      ['week', 604800],
      ['day', 86400],
      ['hour', 3600],
      ['minute', 60],
      ['second', 1]
    ];

    for (const [unit, secondsInUnit] of units) {
      if (Math.abs(diffInSeconds) >= secondsInUnit) {
        const value = Math.floor(diffInSeconds / secondsInUnit);
        return rtf.format(value, unit as Intl.RelativeTimeFormatUnit);
      }
    }

    return rtf.format(0, 'second');
  }

  // Intelligent address formatting based on local conventions
  formatAddress(address: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  }): string {
    const country = address.country || this.localizationData?.country || 'US';
    const formats = this.getAddressFormats();
    const format = formats[country] || formats['default'];
    
    return format
      .replace('{street}', address.street || '')
      .replace('{city}', address.city || '')
      .replace('{state}', address.state || '')
      .replace('{postalCode}', address.postalCode || '')
      .replace('{country}', address.country || '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Smart pluralization
  pluralize(
    count: number, 
    singular: string, 
    plural?: string, 
    zero?: string
  ): string {
    if (count === 0 && zero) return zero;
    
    const pr = new Intl.PluralRules(this.currentLocale);
    const rule = pr.select(count);
    
    switch (rule) {
      case 'zero':
        return zero || plural || singular;
      case 'one':
        return singular;
      default:
        return plural || singular + 's';
    }
  }

  // Currency conversion with caching
  private async convertCurrency(
    amount: number, 
    fromCurrency: string, 
    toCurrency: string
  ): Promise<number> {
    try {
      const cacheKey = `${fromCurrency}-${toCurrency}`;
      const cached = this.getCachedExchangeRate(cacheKey);
      
      if (cached) {
        return amount * cached.rate;
      }

      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
      );
      const data = await response.json();
      const rate = data.rates[toCurrency];
      
      if (rate) {
        this.cacheExchangeRate(cacheKey, rate);
        return amount * rate;
      }
    } catch (error) {
      console.warn('Currency conversion failed:', error);
    }
    
    return amount; // Return original amount if conversion fails
  }

  // Helper methods
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private interpolate(template: string, variables?: Record<string, any>): string {
    if (!variables) return template;
    
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return variables[key]?.toString() || match;
    });
  }

  private getLocaleFromCountry(countryCode: string): string {
    const mapping: Record<string, string> = {
      'US': 'en-US', 'CA': 'en-CA', 'GB': 'en-GB', 'AU': 'en-AU',
      'DE': 'de-DE', 'FR': 'fr-FR', 'ES': 'es-ES', 'IT': 'it-IT',
      'JP': 'ja-JP', 'CN': 'zh-CN', 'KR': 'ko-KR', 'RU': 'ru-RU',
      'BR': 'pt-BR', 'MX': 'es-MX', 'IN': 'hi-IN', 'TR': 'tr-TR'
    };
    return mapping[countryCode] || 'en-US';
  }

  private getCurrencyData(country: string) {
    const currencies: Record<string, { code: string; symbol: string }> = {
      'US': { code: 'USD', symbol: '$' },
      'CA': { code: 'CAD', symbol: 'C$' },
      'GB': { code: 'GBP', symbol: '£' },
      'EU': { code: 'EUR', symbol: '€' },
      'JP': { code: 'JPY', symbol: '¥' },
      'IN': { code: 'INR', symbol: '₹' },
      'CN': { code: 'CNY', symbol: '¥' },
      'KR': { code: 'KRW', symbol: '₩' },
      'AU': { code: 'AUD', symbol: 'A$' },
      'BR': { code: 'BRL', symbol: 'R$' }
    };
    return currencies[country] || { code: 'USD', symbol: '$' };
  }

  private getDateFormat(locale: string): string {
    const formats: Record<string, string> = {
      'en-US': 'MM/dd/yyyy',
      'en-GB': 'dd/MM/yyyy',
      'de-DE': 'dd.MM.yyyy',
      'fr-FR': 'dd/MM/yyyy',
      'ja-JP': 'yyyy/MM/dd',
      'zh-CN': 'yyyy/MM/dd'
    };
    return formats[locale] || 'MM/dd/yyyy';
  }

  private getTimeFormat(locale: string): string {
    const formats: Record<string, string> = {
      'en-US': '12h',
      'en-GB': '24h',
      'de-DE': '24h',
      'fr-FR': '24h',
      'ja-JP': '24h'
    };
    return formats[locale] || '12h';
  }

  private getNumberFormat(locale: string): string {
    const formats: Record<string, string> = {
      'en-US': '1,234.56',
      'de-DE': '1.234,56',
      'fr-FR': '1 234,56',
      'hi-IN': '1,23,456.78'
    };
    return formats[locale] || '1,234.56';
  }

  private getTextDirection(language: string): 'ltr' | 'rtl' {
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    return rtlLanguages.includes(language) ? 'rtl' : 'ltr';
  }

  private getTimezone(country: string): string {
    const timezones: Record<string, string> = {
      'US': 'America/New_York',
      'CA': 'America/Toronto',
      'GB': 'Europe/London',
      'DE': 'Europe/Berlin',
      'FR': 'Europe/Paris',
      'JP': 'Asia/Tokyo',
      'AU': 'Australia/Sydney',
      'IN': 'Asia/Kolkata'
    };
    return timezones[country] || 'UTC';
  }

  private getAddressFormats(): Record<string, string> {
    return {
      'US': '{street}\n{city}, {state} {postalCode}',
      'CA': '{street}\n{city}, {state} {postalCode}',
      'GB': '{street}\n{city} {postalCode}',
      'DE': '{street}\n{postalCode} {city}',
      'FR': '{street}\n{postalCode} {city}',
      'JP': '{postalCode}\n{state}{city}\n{street}',
      'default': '{street}\n{city}, {state} {postalCode}'
    };
  }

  private getCurrencyDecimals(currency: string): number {
    const noDecimalCurrencies = ['JPY', 'KRW', 'VND'];
    return noDecimalCurrencies.includes(currency) ? 0 : 2;
  }

  private getCachedExchangeRate(key: string) {
    try {
      const cached = localStorage.getItem(`exchange_${key}`);
      if (cached) {
        const data = JSON.parse(cached);
        if (Date.now() - data.timestamp < 3600000) { // 1 hour
          return data;
        }
      }
    } catch (error) {
      console.warn('Failed to get cached exchange rate:', error);
    }
    return null;
  }

  private cacheExchangeRate(key: string, rate: number) {
    try {
      localStorage.setItem(`exchange_${key}`, JSON.stringify({
        rate,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Failed to cache exchange rate:', error);
    }
  }

  private notifyLocaleChange(locale: string) {
    window.dispatchEvent(new CustomEvent('localeChange', { detail: { locale } }));
  }

  // Getters
  getCurrentLocale(): string {
    return this.currentLocale;
  }

  getLocalizationData(): LocalizationData | null {
    return this.localizationData;
  }

  getSupportedLocales(): string[] {
    return [
      'en-US', 'en-GB', 'en-CA', 'en-AU',
      'es-ES', 'es-MX', 'fr-FR', 'de-DE',
      'it-IT', 'pt-BR', 'ja-JP', 'ko-KR',
      'zh-CN', 'zh-TW', 'hi-IN', 'ar-SA',
      'ru-RU', 'tr-TR', 'th-TH', 'vi-VN'
    ];
  }
}

export const localizationService = IntelligentLocalizationService.getInstance();

// React hook for using localization
export function useLocalization() {
  const [localizationData, setLocalizationData] = React.useState<LocalizationData | null>(
    localizationService.getLocalizationData()
  );

  React.useEffect(() => {
    const handleLocaleChange = (event: any) => {
      setLocalizationData(localizationService.getLocalizationData());
    };

    window.addEventListener('localeChange', handleLocaleChange);
    return () => window.removeEventListener('localeChange', handleLocaleChange);
  }, []);

  return {
    locale: localizationService.getCurrentLocale(),
    localizationData,
    translate: localizationService.translate.bind(localizationService),
    formatNumber: localizationService.formatNumber.bind(localizationService),
    formatCurrency: localizationService.formatCurrency.bind(localizationService),
    formatDate: localizationService.formatDate.bind(localizationService),
    formatRelativeTime: localizationService.formatRelativeTime.bind(localizationService),
    formatAddress: localizationService.formatAddress.bind(localizationService),
    pluralize: localizationService.pluralize.bind(localizationService),
    setLocale: localizationService.setLocale.bind(localizationService),
    supportedLocales: localizationService.getSupportedLocales()
  };
}

import React from 'react';
