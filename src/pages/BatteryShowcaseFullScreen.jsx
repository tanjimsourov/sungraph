// Page: BatteryShowcaseFullScreen
// Description:
//   Displays a full‑screen showcase of battery products.  The page scales to fill the
//   viewport while preserving a 1280×720 aspect ratio.  It supports Dutch and
//   English translations.  Battery data is loaded from an external module and
//   optionally replaced by data from a JSON API at `/api/batteries`.

import React, { useEffect, useState } from 'react';

// Import dummy battery data.  This file contains an array of battery objects
// with id, name, brand and tags.  If you implement an API, the page will
// attempt to fetch from `/api/batteries` and fall back to this data on error.
import batteriesData from '../data/batteries';

// Base design dimensions for scaling.
const BASE_W = 1280;
const BASE_H = 720;

// Translation dictionaries.  The Dutch (nl) entries mirror the original
// component text.  The English (en) entries provide appropriate translations.
const translations = {
  nl: {
    energyPortal: 'Energie Portal',
    tagline: 'Batterijen voor zonnepanelen',
    heroTitle: 'Energie opslaan wanneer de zon schijnt.',
    heroDesc:
      'Voorbeeldpagina om jouw batterij-oplossingen te tonen. Vervang de kaartinhoud door foto\'s van de klant. Geen scroll, geschikt voor narrowcasting.',
    standardBattery: 'Standaard batterij',
    capacityLabel: 'Capaciteit',
    couplingLabel: 'Koppeling',
    placementLabel: 'Plaatsing',
    whyTitle: 'Waarom?',
    whyDesc: "Verhoog eigen verbruik en gebruik zonnestroom 's avonds.",
    howTitle: 'Hoe?',
    howDesc: 'PV → huis en overschot → batterij → later teruglevering.',
    whoTitle: 'Voor wie?',
    whoDesc: 'Huishoudens met zonnepanelen of kleine bedrijfsinstallatie.',
    detailsBtn: 'Details bekijken →',
    placeholdersInfo: "Plaatshouders — vervang door echte foto's van installateur / leverancier",
  },
  en: {
    energyPortal: 'Energy Portal',
    tagline: 'Batteries for solar panels',
    heroTitle: 'Store energy when the sun shines.',
    heroDesc:
      'Example page to showcase your battery solutions. Replace the card content with customer photos. No scrolling, suitable for narrowcasting.',
    standardBattery: 'Standard battery',
    capacityLabel: 'Capacity',
    couplingLabel: 'Coupling',
    placementLabel: 'Placement',
    whyTitle: 'Why?',
    whyDesc: 'Increase self consumption and use solar power in the evening.',
    howTitle: 'How?',
    howDesc: 'PV → house and surplus → battery → back delivery later.',
    whoTitle: 'For whom?',
    whoDesc: 'Households with solar panels or small business installation.',
    detailsBtn: 'View details →',
    placeholdersInfo: 'Placeholders — replace with real photos of the installer / supplier',
  },
};

// Translation of battery tag labels.  Unknown tags fall back to the original text.
const tagTranslations = {
  nl: {
    Uitbreidbaar: 'Uitbreidbaar',
    Muur: 'Muur',
    Hybride: 'Hybride',
    Compact: 'Compact',
    Tussenwoning: 'Tussenwoning',
    'Schuur/bedrijf': 'Schuur/bedrijf',
    'IP-beschermd': 'IP-beschermd',
  },
  en: {
    Uitbreidbaar: 'Expandable',
    Muur: 'Wall',
    Hybride: 'Hybrid',
    Compact: 'Compact',
    Tussenwoning: 'Terraced house',
    'Schuur/bedrijf': 'Barn / commercial',
    'IP-beschermd': 'IP protected',
  },
};

// Simple battery thumbnail used in cards.
function BatteryThumb() {
  return (
    <div className="w-full h-full bg-gradient-to-b from-slate-700 to-slate-900 flex items-center justify-center">
      <div className="w-14 h-9 rounded-md border-2 border-slate-200/70 relative">
        <div className="w-2 h-4 bg-slate-200/70 rounded-sm absolute -right-2 top-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
}

export default function BatteryShowcaseFullScreen() {
  const [{ scale, width, height }, setView] = useState({
    scale: 1,
    width: BASE_W,
    height: BASE_H,
  });

  // Determine language at runtime.  Default to Dutch if the language does not start with 'en'.
  const lang =
    typeof navigator !== 'undefined' && navigator.language && navigator.language.toLowerCase().startsWith('en')
      ? 'en'
      : 'nl';
  const t = translations[lang];

  // Local state for batteries.  Load from API if available, otherwise use dummy data.
  const [batteries, setBatteries] = useState(batteriesData);

  useEffect(() => {
    const handleResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const scaleX = vw / BASE_W;
      const scaleY = vh / BASE_H;
      const s = Math.max(scaleX, scaleY);
      const newWidth = vw / s;
      const newHeight = vh / s;
      setView({ scale: s, width: newWidth, height: newHeight });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Attempt to fetch battery data from API on mount.  If the fetch fails or returns
  // invalid data, fall back to the imported dummy data.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('/api/batteries');
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        if (!cancelled && Array.isArray(data)) {
          setBatteries(data);
        }
      } catch (err) {
        // Swallow errors and keep dummy data
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-900 overflow-hidden">
      <div
        className="relative bg-slate-950 text-slate-50"
        style={{
          width: width,
          height: height,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {/* Top bar */}
        <div className="absolute top-0 inset-x-0 h-14 bg-slate-950/90 backdrop-blur flex items-center justify-between px-8 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-emerald-400 rounded-md flex items-center justify-center text-slate-950 text-sm font-bold">
              E
            </div>
            <span className="font-semibold text-sm">{t.energyPortal}</span>
            <span className="text-[10px] bg-emerald-500/15 border border-emerald-400/30 rounded-full px-2 ml-1">
              {t.tagline}
            </span>
          </div>
          <div className="text-[11px] text-slate-200/70 flex gap-4">
            <a href="/battery-solar" className="hover:text-white">
              Dashboard
            </a>
            <a href="/battery-showcase" className="text-white font-medium">
              {t.tagline.split(' ')[0] /* first word for nav label */}
            </a>
          </div>
        </div>

        {/* Content */}
        <div className="absolute inset-x-0 top-14 bottom-0 px-8 pt-6 pb-6 flex flex-col gap-5">
          {/* Hero */}
          <div className="flex justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-3xl font-semibold tracking-tight mb-2">{t.heroTitle}</h1>
              <p className="text-sm text-slate-200/80 max-w-xl">{t.heroDesc}</p>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl px-4 py-3 w-64 flex-shrink-0">
              <p className="text-xs text-slate-200/60 mb-2">{t.standardBattery}</p>
              <dl className="text-xs space-y-1">
                <div className="flex justify-between">
                  <dt>{t.capacityLabel}</dt>
                  <dd className="font-semibold">5 – 15 kWh</dd>
                </div>
                <div className="flex justify-between">
                  <dt>{t.couplingLabel}</dt>
                  <dd className="font-semibold">AC / DC</dd>
                </div>
                <div className="flex justify-between">
                  <dt>{t.placementLabel}</dt>
                  <dd className="font-semibold">Muur / vloer</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Three info cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-3">
              <p className="text-[13px] font-semibold mb-1">{t.whyTitle}</p>
              <p className="text-[11px] text-slate-200/70">{t.whyDesc}</p>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-3">
              <p className="text-[13px] font-semibold mb-1">{t.howTitle}</p>
              <p className="text-[11px] text-slate-200/70">{t.howDesc}</p>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-3">
              <p className="text-[13px] font-semibold mb-1">{t.whoTitle}</p>
              <p className="text-[11px] text-slate-200/70">{t.whoDesc}</p>
            </div>
          </div>

          {/* Four battery cards */}
          <div className="flex gap-4 flex-1 min-h-0">
            {batteries.map((b) => (
              <div
                key={b.id}
                className="flex-1 bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden flex flex-col min-h-0"
              >
                <div className="h-32 flex-shrink-0">
                  <BatteryThumb />
                </div>
                <div className="p-4 flex-1 flex flex-col min-h-0">
                  <p className="text-sm font-semibold">{b.name}</p>
                  <p className="text-[11px] text-slate-300 mb-2">{b.brand}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {b.tags.map((tag) => {
                      // Translate tag if available, otherwise fallback to original
                      const translatedTag = tagTranslations[lang][tag] ?? tag;
                      return (
                        <span
                          key={tag}
                          className="px-2 py-[2px] bg-slate-950/40 border border-slate-800 rounded-full text-[10px]"
                        >
                          {translatedTag}
                        </span>
                      );
                    })}
                  </div>
                  <button className="mt-auto text-[11px] text-emerald-200 hover:text-white w-fit">
                    {t.detailsBtn}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-slate-400 text-right flex-shrink-0">
            {t.placeholdersInfo}
          </div>
        </div>
      </div>
    </div>
  );
}