// Page: BatterySearchPage
// Description:
//   A simple search interface for finding battery products.  Currently
//   implemented as a placeholder with translation support.  Developers can
//   enhance this page to actually query products from an API or database.
//   The page uses the same responsive scaling approach as other pages.

import React, { useEffect, useState } from 'react';

const BASE_W = 1280;
const BASE_H = 720;

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

export default function BatterySearchPage() {
  const [scale, setScale] = useState(1);
  const lang =
    typeof navigator !== 'undefined' && navigator.language && navigator.language.toLowerCase().startsWith('en')
      ? 'en'
      : 'nl';
  const t = translations[lang];

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
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden flex items-center justify-center">
      <div
        className="relative bg-white rounded-3xl shadow-lg p-12 flex flex-col items-center justify-center gap-6"
        style={{ width: BASE_W, height: BASE_H, transform: `scale(${scale})`, transformOrigin: 'center center' }}
      >
        <h1 className="text-[28px] font-bold text-slate-800 text-center">{t.title}</h1>
        <div className="flex flex-col items-center w-full max-w-md">
          <input
            type="text"
            placeholder={t.placeholder}
            className="w-full p-3 border border-slate-300 rounded-lg text-[14px] focus:outline-none focus:ring focus:ring-emerald-300"
          />
          <button className="mt-4 px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-[14px]">
            {t.button}
          </button>
          <p className="mt-3 text-[12px] text-slate-500 text-center">{t.hint}</p>
        </div>
      </div>
    </div>
  );
}