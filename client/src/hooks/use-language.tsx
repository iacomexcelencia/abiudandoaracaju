import { useState, useEffect } from "react";
import type { TouristSpot } from "@shared/schema";

export type Language = 'pt' | 'en' | 'es';

interface LocalizedTouristSpot {
  id: string;
  name: string;
  description: string;
  category: string;
  latitude: string;
  longitude: string;
  address: string | null;
  images: string[] | null;
  qrCode: string | null;
  isActive: boolean | null;
  features: unknown;
  createdAt: string | null;
  updatedAt: string | null;
}

export function useLanguage() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('pt');

  useEffect(() => {
    // Get language from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang') as Language;
    const savedLang = localStorage.getItem('preferredLanguage') as Language;
    
    if (langParam && ['pt', 'en', 'es'].includes(langParam)) {
      setCurrentLanguage(langParam);
      localStorage.setItem('preferredLanguage', langParam);
    } else if (savedLang && ['pt', 'en', 'es'].includes(savedLang)) {
      setCurrentLanguage(savedLang);
    }
  }, []);

  const changeLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferredLanguage', language);
    
    // Update URL without reload
    const url = new URL(window.location.href);
    url.searchParams.set('lang', language);
    window.history.replaceState({}, '', url.toString());
  };

  const localizeSpot = (spot: TouristSpot): LocalizedTouristSpot => {
    const nameField = `name_${currentLanguage}` as keyof TouristSpot;
    const descField = `description_${currentLanguage}` as keyof TouristSpot;
    
    return {
      ...spot,
      name: (spot[nameField] as string) || spot.name_pt,
      description: (spot[descField] as string) || spot.description_pt,
    };
  };

  const getLocalizedText = (translations: { pt: string; en: string; es: string }) => {
    return translations[currentLanguage] || translations.pt;
  };

  return {
    currentLanguage,
    changeLanguage,
    localizeSpot,
    getLocalizedText
  };
}

export default useLanguage;