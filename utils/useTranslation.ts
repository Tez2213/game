import { useRouter } from 'next/router';
import en from '../locales/en.json';
import hi from '../locales/hi.json';
import or from '../locales/or.json';

// Type for our translation structure
type TranslationKeys = typeof en;

// Available translations
const translations: Record<string, TranslationKeys> = {
  en,
  hi,
  or
};

// Custom hook for translations
export function useTranslation() {
  const router = useRouter();
  const { locale = 'en' } = router;

  // Get the current translation object
  const t = translations[locale] || translations.en;

  // Translation function with dot notation support
  const translate = (key: string, params?: Record<string, string | number>): string => {
    // Split the key by dots to navigate nested objects
    const keys = key.split('.');
    let value: any = t;

    // Navigate through the nested object
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found
        value = getNestedValue(translations.en, keys);
        break;
      }
    }

    // If value is not a string, return the key as fallback
    if (typeof value !== 'string') {
      console.warn(`Translation key "${key}" not found or is not a string`);
      return key;
    }

    // Replace parameters if provided
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }

    return value;
  };

  // Function to change language
  const changeLanguage = (newLocale: string) => {
    router.push(router.asPath, router.asPath, { locale: newLocale });
  };

  return {
    t: translate,
    locale,
    changeLanguage,
    availableLocales: Object.keys(translations)
  };
}

// Helper function to get nested value from object
function getNestedValue(obj: any, keys: string[]): any {
  let value = obj;
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return undefined;
    }
  }
  return value;
}

// Language display names
export const languageNames: Record<string, string> = {
  en: 'English',
  hi: 'हिन्दी',
  or: 'ଓଡ଼ିଆ'
};

// Language flags
export const languageFlags: Record<string, string> = {
  en: '🇺🇸',
  hi: '🇮🇳',
  or: '🇮🇳'
};
