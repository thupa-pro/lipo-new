/**
 * Temporary stub for i18n functions to fix build issues
 * Replace with actual next-intl implementation when ready
 */

export function useTranslations(namespace?: string) {
  return (key: string, params?: Record<string, any>) => {
    // Simple fallback - return the key as the translation
    if (params) {
      let result = key;
      Object.entries(params).forEach(([paramKey, value]) => {
        result = result.replace(`{${paramKey}}`, String(value));
      });
      return result;
    }
    return key;
  };
}

export function useLocale() {
  return 'en';
}

export function NextIntlClientProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}