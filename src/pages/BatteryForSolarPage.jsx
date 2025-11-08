// Page: BatteryForSolarPage
// Description:
//   A placeholder page for battery solutions combined with solar panels.  It
//   includes Dutch and English translations.  The layout is intentionally
//   minimal so that developers can later replace the placeholder content with
//   real product information.  Scaling preserves a 1280×720 aspect ratio.

import React, { useEffect, useState } from 'react';

const BASE_W = 1280;
const BASE_H = 720;

// Translation dictionaries
const translations = {
  nl: {
    title: 'Batterijen voor zonnepanelen',
    subtitle: 'Voorbeeldpagina voor batterijopslag gekoppeld aan zonnepanelen.',
    description: 'Vervang deze placeholder door echte inhoud van uw product of oplossing.',
  },
  en: {
    title: 'Batteries for solar panels',
    subtitle: 'Sample page for battery storage connected to solar panels.',
    description: 'Replace this placeholder with real content about your product or solution.',
  },
};

export default function BatteryForSolarPage() {
  const [scale, setScale] = useState(1);
  const lang =
    typeof navigator !== 'undefined' && navigator.language && navigator.language.toLowerCase().startsWith('en')
      ? 'en'
      : 'nl';
  const t = translations[lang];

  useEffect(() => {
    const handleResize = () => {
      const wScale = window.innerWidth / BASE_W;
      const hScale = window.innerHeight / BASE_H;
      setScale(Math.max(wScale, hScale));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden flex items-center justify-center">
      <div
        className="relative bg-white rounded-3xl shadow-lg p-12 flex flex-col items-center justify-center"
        style={{ width: BASE_W, height: BASE_H, transform: `scale(${scale})`, transformOrigin: 'center center' }}
      >
        <h1 className="text-[28px] font-bold text-slate-800 mb-3 text-center">{t.title}</h1>
        <p className="text-[16px] text-slate-600 mb-6 text-center max-w-xl">{t.subtitle}</p>
        <p className="text-[14px] text-slate-500 text-center max-w-lg">{t.description}</p>
      </div>
    </div>
  );
}