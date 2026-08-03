'use client';
import { useEffect } from 'react';
import { useProgressStore } from '@/lib/store';

export default function LanguageSync() {
  const language = useProgressStore((state) => state.language || 'en');

  useEffect(() => {
    const html = document.documentElement;
    html.lang = language;
    html.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  return null;
}
