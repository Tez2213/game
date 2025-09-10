import React, { useState } from 'react';
import { useTranslation, languageNames, languageFlags } from '../utils/useTranslation';

interface LanguageSelectorProps {
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '' }) => {
  const { locale, changeLanguage, availableLocales } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (newLocale: string) => {
    changeLanguage(newLocale);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors min-w-[120px]"
        aria-label="Select language"
      >
        <span className="text-lg">{languageFlags[locale]}</span>
        <span className="flex-1 text-left">{languageNames[locale]}</span>
        <span className="text-xs text-gray-500">{isOpen ? '▲' : '▼'}</span>
      </button>
      
      {isOpen && (
        <>
          {/* Backdrop to close dropdown when clicking outside */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown menu */}
          <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20 min-w-[120px] overflow-hidden">
            {availableLocales.map((localeCode) => (
              <button
                key={localeCode}
                onClick={() => handleLanguageChange(localeCode)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                  locale === localeCode 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-700'
                }`}
              >
                <span className="text-lg">{languageFlags[localeCode]}</span>
                <span>{languageNames[localeCode]}</span>
                {locale === localeCode && (
                  <span className="ml-auto text-blue-600">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
