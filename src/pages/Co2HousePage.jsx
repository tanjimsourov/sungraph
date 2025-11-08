// Page: Co2HousePage
// Description:
//   Illustrates a stylised house with CO₂ statistics for a household and a neighbourhood.
//   Text elements are translated between Dutch and English.  Scaling maintains the
//   original fixed aspect ratio.

import React, { useEffect, useState } from 'react';

const BASE_WIDTH = 1200;
const BASE_HEIGHT = 650;

// Translation dictionary
const translations = {
  nl: {
    measures: ['Isolatie en optimalisatie CV', 'Zonnepanelen', "Deelauto's", 'TOTAAL'],
    tonLabel: 'ton CO₂:',
    household: 'Huishouden',
    neighbourhood: 'Soesterkwartier',
  },
  en: {
    measures: ['Insulation and central heating optimisation', 'Solar panels', 'Car sharing', 'TOTAL'],
    tonLabel: 'tonnes CO₂:',
    household: 'Household',
    neighbourhood: 'Soester quarter',
  },
};

export default function Co2HousePage() {
  const [scale, setScale] = useState(1);
  const lang =
    typeof navigator !== 'undefined' && navigator.language && navigator.language.toLowerCase().startsWith('en')
      ? 'en'
      : 'nl';
  const t = translations[lang];

  useEffect(() => {
    const handleResize = () => {
      const wScale = window.innerWidth / BASE_WIDTH;
      const hScale = window.innerHeight / BASE_HEIGHT;
      setScale(Math.min(wScale, hScale));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-screen h-screen bg-[#cfe3f5] overflow-hidden flex items-center justify-center">
      {/* scene wrapper */}
      <div
        className="relative w-[1200px] h-[650px]"
        style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
      >
        {/* sky bg */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#cfe3f5] to-[#a6d0f0]" />

        {/* sun */}
        <div className="absolute top-6 right-10 w-16 h-16 rounded-full bg-[#ffd54f] border-4 border-yellow-200 shadow-lg" />

        {/* ground */}
        <div className="absolute -left-20 -right-20 bottom-0 h-[170px] bg-[#35a668] rounded-t-[100px]" />

        {/* left text lines */}
        <div className="absolute top-48 left-8 flex flex-col gap-5">
          {t.measures.map((line, idx) => (
            <p key={idx} className={`text-[15px] font-semibold text-[#0f4585]${idx === t.measures.length - 1 ? ' mt-2' : ''}`}>
              {line}
            </p>
          ))}
        </div>

        {/* trees left */}
        <div className="absolute bottom-[165px] left-[150px] w-[90px] h-[90px] rounded-full bg-[#3aab63] shadow" />
        <div className="absolute bottom-[100px] left-[188px] w-[10px] h-[80px] bg-[#4c784f] rounded" />
        <div className="absolute bottom-[145px] left-[205px] w-[50px] h-[50px] rounded-full bg-[#7ad58e] shadow" />
        <div className="absolute bottom-[100px] left-[228px] w-[8px] h-[60px] bg-[#4c784f] rounded" />

        {/* trees right */}
        <div className="absolute bottom-[160px] right-[180px] w-[95px] h-[95px] rounded-full bg-[#3aab63] shadow" />
        <div className="absolute bottom-[98px] right-[218px] w-[10px] h-[80px] bg-[#4c784f] rounded" />
        <div className="absolute bottom-[140px] right-[120px] w-[60px] h-[60px] rounded-full bg-[#7ad58e] shadow" />
        <div className="absolute bottom-[98px] right-[145px] w-[8px] h-[60px] bg-[#4c784f] rounded" />

        {/* house body */}
        <div className="absolute top-[130px] left-1/2 -translate-x-1/2 w-[520px] h-[360px] bg-white/95 rounded-[12px] shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-white/60">
          {/* chimney */}
          <div className="absolute -top-[65px] left-[50px] w-[50px] h-[80px] bg-[#252f38] rounded-t-[12px]" />
          {/* roof */}
          <div className="absolute -top-[35px] -left-[30px] w-[560px] h-[8px] bg-[#0f1820] rounded-full" />
          {/* solar */}
          <div className="absolute -top-[27px] right-[90px] w-[100px] h-[5px] rounded-full bg-[#1e65ff]" />
          <div className="absolute -top-[17px] right-[72px] w-[100px] h-[5px] rounded-full bg-[#78a6ff]" />

          {/* title */}
          <div className="pt-10 text-center">
            <p className="text-[20px] font-semibold text-[#0080c1] leading-tight">{t.tonLabel}</p>
            <div className="flex justify-center gap-20 mt-1">
              <p className="text-[#059669] font-semibold text-[15px]">{t.household}</p>
              <p className="text-[#0f77c5] font-semibold text-[15px]">{t.neighbourhood}</p>
            </div>
          </div>

          {/* rows */}
          <div className="mt-8 flex flex-col gap-3 items-center">
            {/* row 1 */}
            <div className="w-[70%] flex justify-between items-center">
              <span className="text-[#059669] font-semibold text-[15px]">2.2</span>
              <span className="text-[#0f77c5] font-semibold text-[15px]">13 000</span>
            </div>
            {/* row 2 */}
            <div className="w-[70%] flex justify-between items-center">
              <span className="text-[#059669] font-semibold text-[15px]">1.3</span>
              <span className="text-[#0f77c5] font-semibold text-[15px]">1 500</span>
            </div>
            {/* row 3 */}
            <div className="w-[70%] flex justify-between items-center">
              <span className="text-[#059669] font-semibold text-[15px]">0.2 / jaar</span>
              <span className="text-[#0f77c5] font-semibold text-[15px]">15 / jaar</span>
            </div>
            {/* divider */}
            <div className="w-[70%] border-t border-dotted border-[#0f4585]/40 mt-1 pt-2 flex justify-between items-center">
              <span className="text-[#059669] font-bold text-[17px]">3.7</span>
              <span className="text-[#0f77c5] font-bold text-[17px]">14 515</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}