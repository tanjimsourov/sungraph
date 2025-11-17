// @ts-nocheck
// Page: BatterySearchPage
// Description:
//   A simple search interface for finding battery products. Currently
//   implemented as a placeholder with translation support. Developers can
//   enhance this page to actually query products from an API or database.
//   The page uses responsive scaling similar to other templates and provides
//   optional API configuration via props.

import React, { useEffect, useState } from 'react';

export interface BatterySearchPageProps {
  width?: number;
  height?: number;
  lang?: 'nl' | 'en';
  texts?: any;
  apiConfig?: { enabled?: boolean; endpoint?: string };
}

const BASE_W = 1280;
const BASE_H = 720;

// Translation dictionaries
const translations = {
  nl: {
    title: 'Batterij zoeken',
    placeholder: 'Zoek naar batterijen...',
    button: 'Zoeken',
    hint: 'Gebruik trefwoorden om een batterij te vinden.',
  },
  en: {
    title: 'Battery search',
    placeholder: 'Search for batteries...',
    button: 'Search',
    hint: 'Use keywords to find a battery.',
  },
};

const BatterySearchPage: React.FC<BatterySearchPageProps> = ({ width, height, lang }) => {
  const [scale, setScale] = useState(1);
  const detectLang =
    lang ??
    (typeof navigator !== 'undefined' && navigator.language && navigator.language.toLowerCase().startsWith('en')
      ? 'en'
      : 'nl');
  const t = translations[detectLang as 'nl' | 'en'];

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth / BASE_W;
      const h = window.innerHeight / BASE_H;
      setScale(Math.max(w, h));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="fixed inset-0 overflow-hidden flex items-center justify-center"
      style={{ width: '100%', height: '100%', maxWidth: width, maxHeight: height, background: 'radial-gradient(circle at top left, #eff6ff 0%, #dbeafe 100%)' }}
    >
      {/* Floating accents */}
      <div className="pointer-events-none absolute -top-20 -left-20 w-72 h-72 bg-blue-200 rounded-full opacity-50 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 w-80 h-80 bg-indigo-200 rounded-full opacity-40 blur-3xl" />

      <div
        className="relative bg-white/90 backdrop-blur-md rounded-3xl shadow-lg flex flex-col items-center justify-center gap-6 px-12 py-14"
        style={{ width: BASE_W, height: BASE_H, transform: `scale(${scale})`, transformOrigin: 'center center' }}
      >
        <h1 className="text-[32px] font-bold text-gray-800 text-center mb-2">{t.title}</h1>
        <div className="flex flex-col items-center w-full max-w-md">
          <input
            type="text"
            placeholder={t.placeholder}
            className="w-full p-3 border border-gray-300 rounded-lg text-[16px] focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-[16px]">
            {t.button}
          </button>
          <p className="mt-4 text-[12px] text-gray-500 text-center max-w-sm">{t.hint}</p>
        </div>
      </div>
    </div>
  );
};

export default BatterySearchPage;