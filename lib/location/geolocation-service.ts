"use client";

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  city?: string;
  state?: string;
  country?: string;
  countryCode?: string;
  timezone?: string;
  currency?: string;
  locale?: string;
  postalCode?: string;
  region?: string;
}

export interface LocationPreferences {
  radius: number; // in kilometers
  categories: string[];
  priceRange: [number, number];
  currency: string;
  language: string;
}

class GeolocationService {
  private static instance: GeolocationService;
  private locationCache: LocationData | null = null;
  private watchId: number | null = null;
  private locationCallbacks: ((location: LocationData) => void)[] = [];

  static getInstance(): GeolocationService {
    if (!GeolocationService.instance) {
      GeolocationService.instance = new GeolocationService();
    }
    return GeolocationService.instance;
  }

  // Get user's current location with enhanced accuracy
  async getCurrentLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      // Check if we have cached location (valid for 10 minutes)
      if (this.locationCache && this.isLocationFresh()) {
        resolve(this.locationCache);
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 600000 // 10 minutes
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const locationData = await this.enhanceLocationData(position);
          this.locationCache = locationData;
          this.notifyLocationCallbacks(locationData);
          resolve(locationData);
        },
        (error) => {
          // Fallback to IP-based location
          this.getLocationFromIP()
            .then(resolve)
            .catch(() => reject(this.handleLocationError(error)));
        },
        options
      );
    });
  }

  // Enhanced location data with reverse geocoding and intelligent features
  private async enhanceLocationData(position: GeolocationPosition): Promise<LocationData> {
    const { latitude, longitude, accuracy } = position.coords;
    
    try {
      // Use multiple geocoding services for better accuracy
      const [reverseGeoData, timezoneData] = await Promise.all([
        this.reverseGeocode(latitude, longitude),
        this.getTimezoneData(latitude, longitude)
      ]);

      const locationData: LocationData = {
        latitude,
        longitude,
        accuracy,
        ...reverseGeoData,
        ...timezoneData
      };

      // Store in localStorage for offline access
      this.storeLocationData(locationData);
      
      return locationData;
    } catch (error) {
      console.warn('Failed to enhance location data:', error);
      return { latitude, longitude, accuracy };
    }
  }

  // Intelligent reverse geocoding with multiple fallbacks
  private async reverseGeocode(lat: number, lng: number) {
    const endpoints = [
      // Primary: MapBox (most accurate for cities)
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`,
      // Fallback: OpenStreetMap Nominatim (free)
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        
        if (endpoint.includes('mapbox')) {
          return this.parseMapboxResponse(data);
        } else {
          return this.parseNominatimResponse(data);
        }
      } catch (error) {
        console.warn(`Geocoding endpoint failed: ${endpoint}`, error);
        continue;
      }
    }

    return {};
  }

  private parseMapboxResponse(data: any) {
    const feature = data.features?.[0];
    if (!feature) return {};

    const context = feature.context || [];
    const properties = feature.properties || {};

    return {
      city: this.extractFromContext(context, 'place') || feature.text,
      state: this.extractFromContext(context, 'region'),
      country: this.extractFromContext(context, 'country'),
      countryCode: this.extractFromContext(context, 'country', 'short_code'),
      postalCode: this.extractFromContext(context, 'postcode'),
      region: this.extractFromContext(context, 'region')
    };
  }

  private parseNominatimResponse(data: any) {
    const address = data.address || {};
    
    return {
      city: address.city || address.town || address.village,
      state: address.state,
      country: address.country,
      countryCode: address.country_code?.toUpperCase(),
      postalCode: address.postcode,
      region: address.region
    };
  }

  private extractFromContext(context: any[], type: string, property = 'text') {
    const item = context.find(item => item.id?.includes(type));
    return item?.[property];
  }

  // Get timezone and currency data
  private async getTimezoneData(lat: number, lng: number) {
    try {
      const response = await fetch(
        `https://api.timezonedb.com/v2.1/get-time-zone?key=${process.env.NEXT_PUBLIC_TIMEZONE_API_KEY}&format=json&by=position&lat=${lat}&lng=${lng}`
      );
      const data = await response.json();

      // Get currency from country code
      const currency = this.getCurrencyFromCountry(data.countryCode);
      const locale = this.getLocaleFromCountry(data.countryCode);

      return {
        timezone: data.zoneName,
        currency,
        locale
      };
    } catch (error) {
      return {};
    }
  }

  // IP-based location fallback
  private async getLocationFromIP(): Promise<LocationData> {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();

      return {
        latitude: data.latitude,
        longitude: data.longitude,
        accuracy: 1000, // Lower accuracy for IP-based location
        city: data.city,
        state: data.region,
        country: data.country_name,
        countryCode: data.country_code,
        timezone: data.timezone,
        currency: data.currency,
        locale: this.getLocaleFromCountry(data.country_code),
        postalCode: data.postal
      };
    } catch (error) {
      throw new Error('Failed to get location from IP');
    }
  }

  // Watch location changes (useful for delivery tracking, etc.)
  watchLocation(callback: (location: LocationData) => void): number {
    this.locationCallbacks.push(callback);

    if (!this.watchId) {
      this.watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const locationData = await this.enhanceLocationData(position);
          this.locationCache = locationData;
          this.notifyLocationCallbacks(locationData);
        },
        (error) => console.warn('Location watch error:', error),
        {
          enableHighAccuracy: true,
          maximumAge: 30000, // 30 seconds
          timeout: 10000
        }
      );
    }

    return this.locationCallbacks.length - 1;
  }

  // Stop watching location
  stopWatching(callbackId?: number): void {
    if (callbackId !== undefined) {
      this.locationCallbacks.splice(callbackId, 1);
    } else {
      this.locationCallbacks = [];
    }

    if (this.locationCallbacks.length === 0 && this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Calculate distance between two points (Haversine formula)
  calculateDistance(
    lat1: number, 
    lng1: number, 
    lat2: number, 
    lng2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Find nearby services within radius
  async findNearbyServices(
    services: any[], 
    radius: number = 10,
    userLocation?: LocationData
  ) {
    const location = userLocation || await this.getCurrentLocation();
    
    return services
      .map(service => ({
        ...service,
        distance: this.calculateDistance(
          location.latitude,
          location.longitude,
          service.latitude,
          service.longitude
        )
      }))
      .filter(service => service.distance <= radius)
      .sort((a, b) => a.distance - b.distance);
  }

  // Intelligent location suggestions based on user behavior
  async getLocationSuggestions(query: string): Promise<any[]> {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&types=place,locality,neighborhood&limit=5`
      );
      const data = await response.json();
      
      return data.features.map((feature: any) => ({
        id: feature.id,
        name: feature.place_name,
        coordinates: feature.center,
        context: feature.context
      }));
    } catch (error) {
      console.warn('Location suggestions failed:', error);
      return [];
    }
  }

  // Helper methods
  private toRad(value: number): number {
    return value * Math.PI / 180;
  }

  private isLocationFresh(): boolean {
    return this.locationCache && 
           Date.now() - (this.locationCache as any).timestamp < 600000; // 10 minutes
  }

  private notifyLocationCallbacks(location: LocationData): void {
    this.locationCallbacks.forEach(callback => {
      try {
        callback(location);
      } catch (error) {
        console.warn('Location callback error:', error);
      }
    });
  }

  private storeLocationData(location: LocationData): void {
    try {
      const dataWithTimestamp = {
        ...location,
        timestamp: Date.now()
      };
      localStorage.setItem('loconomy_location', JSON.stringify(dataWithTimestamp));
    } catch (error) {
      console.warn('Failed to store location data:', error);
    }
  }

  private getCachedLocationData(): LocationData | null {
    try {
      const cached = localStorage.getItem('loconomy_location');
      if (cached) {
        const data = JSON.parse(cached);
        if (Date.now() - data.timestamp < 3600000) { // 1 hour
          return data;
        }
      }
    } catch (error) {
      console.warn('Failed to get cached location:', error);
    }
    return null;
  }

  private handleLocationError(error: GeolocationPositionError): Error {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return new Error('Location access denied. Please enable location services.');
      case error.POSITION_UNAVAILABLE:
        return new Error('Location information unavailable.');
      case error.TIMEOUT:
        return new Error('Location request timed out.');
      default:
        return new Error('An unknown location error occurred.');
    }
  }

  // Currency and locale mapping
  private getCurrencyFromCountry(countryCode: string): string {
    const currencyMap: Record<string, string> = {
      'US': 'USD', 'CA': 'CAD', 'GB': 'GBP', 'EU': 'EUR', 'DE': 'EUR', 'FR': 'EUR',
      'JP': 'JPY', 'AU': 'AUD', 'IN': 'INR', 'CN': 'CNY', 'BR': 'BRL', 'MX': 'MXN',
      'RU': 'RUB', 'KR': 'KRW', 'SG': 'SGD', 'HK': 'HKD', 'CH': 'CHF', 'SE': 'SEK',
      'NO': 'NOK', 'DK': 'DKK', 'NZ': 'NZD', 'ZA': 'ZAR', 'TH': 'THB', 'MY': 'MYR'
    };
    return currencyMap[countryCode] || 'USD';
  }

  private getLocaleFromCountry(countryCode: string): string {
    const localeMap: Record<string, string> = {
      'US': 'en-US', 'CA': 'en-CA', 'GB': 'en-GB', 'AU': 'en-AU', 'NZ': 'en-NZ',
      'DE': 'de-DE', 'FR': 'fr-FR', 'ES': 'es-ES', 'IT': 'it-IT', 'PT': 'pt-PT',
      'JP': 'ja-JP', 'KR': 'ko-KR', 'CN': 'zh-CN', 'TW': 'zh-TW', 'HK': 'zh-HK',
      'IN': 'hi-IN', 'BR': 'pt-BR', 'MX': 'es-MX', 'RU': 'ru-RU', 'TR': 'tr-TR',
      'SE': 'sv-SE', 'NO': 'nb-NO', 'DK': 'da-DK', 'FI': 'fi-FI', 'NL': 'nl-NL'
    };
    return localeMap[countryCode] || 'en-US';
  }
}

export const geolocationService = GeolocationService.getInstance();
