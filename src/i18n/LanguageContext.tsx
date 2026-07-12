import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from './en';
import { ja } from './ja';

export type Language = 'en' | 'ja';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // LocalStorageから取得、なければブラウザの言語、それもなければ 'en' をデフォルトにする
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('sp_lang') as Language;
    if (saved === 'en' || saved === 'ja') return saved;
    
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'ja' ? 'ja' : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('sp_lang', lang);
  };

  useEffect(() => {
    // HTMLのlang属性とbodyのクラスを更新
    document.documentElement.lang = language;
    
    document.body.classList.remove('lang-en', 'lang-ja');
    document.body.classList.add(`lang-${language}`);
  }, [language]);

  const t = (path: string): string => {
    const dictionary = language === 'ja' ? ja : en;
    const keys = path.split('.');
    
    let current: any = dictionary;
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return path; // キーが見つからない場合はパスをそのまま返す
      }
    }
    
    return typeof current === 'string' ? current : path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
