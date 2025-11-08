// Page: CO2SavingsTreesPage
// Description:
//   Converts annual CO₂ savings from various measures into a tree equivalent and
//   displays them with a donut chart and a simple tree grid visual.  This page
//   supports Dutch and English translations and loads data from an external
//   module with an optional API fallback.  The overall layout is inspired by
//   other full‑screen pages in the project, with a left panel showing summary
//   information and a right panel containing the chart and tree grid.

import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import savingsData from '../data/co2Savings';
ChartJS.register(ArcElement, Tooltip, Legend);

// Base dimensions for scaling to fill the viewport.
const BASE_W = 1280;
const BASE_H = 720;

// Conversion factor: kilograms of CO₂ saved per tree per year.  Adjust if a
// different factor is more appropriate for your region.
const TREE_CO2_KG = 22;

// Import dummy savings data.  Each object has a `key` identifying the
// measure and a `savedKg` value for annual CO₂ savings.  See
// ../data/co2Savings.js for details.


// Attempt to fetch savings data from API.  The API should return an array of
// objects with keys and savedKg values similar to the dummy data.
async function fetchSavingsData() {
  try {
    const res = await fetch('/api/co2savings');
    if (!res.ok) throw new Error('network');
    const json = await res.json();
    if (Array.isArray(json)) {
      return json;
    }
  } catch (e) {
    // ignore
  }
  return savingsData;
}

// Colour palette used for the donut chart and legend.  Each key corresponds
// with a measure in the data array.
const colorMap = {
  ev: '#22c55e',
  pv: '#0ea5e9',
  insulate: '#f59e0b',
  diet: '#a855f7',
  heatpump: '#ef4444',
};

// Translation dictionaries for UI text.  Functions allow interpolation of
// numeric values into strings.
const translations = {
  nl: {
    analysisTitle: 'CO₂ Besparing',
    subtitle: 'Omgerekend naar bomen',
    oneTree: () => `1 boom ≈ ${TREE_CO2_KG} kg CO₂/jaar`,
    totalSaving: 'Totale jaarlijkse besparing',
    treeEquivalent: 'Bomen-equivalent',
    measureTitle: 'Jaarlijkse CO₂-besparingen per maatregel',
    measureSubtitle: 'Verdeling en bomen-equivalent per maatregel',
    totalTreesLabel: (n) => `${n} bomen totaal`,
    conversionNote: 'Indicatieve conversie',
    liveInsight: 'Live inzicht',
    visual: (max) => `Visualisatie bomen-equivalent (max. ${max})`,
    extraTrees: (n) => `+ ${n} extra bomen niet getoond`,
    measures: {
      ev: 'Elektrisch rijden (i.p.v. benzine)',
      pv: 'Zonnepanelen (eigen verbruik)',
      insulate: 'Isolatie + lage temp. verwarming',
      diet: 'Minder vlees/zuivel',
      heatpump: 'Hybride warmtepomp',
    },
  },
  en: {
    analysisTitle: 'CO₂ saving',
    subtitle: 'Converted to trees',
    oneTree: () => `1 tree ≈ ${TREE_CO2_KG} kg CO₂/year`,
    totalSaving: 'Total annual saving',
    treeEquivalent: 'Tree equivalent',
    measureTitle: 'Annual CO₂ savings per measure',
    measureSubtitle: 'Distribution and tree equivalent per measure',
    totalTreesLabel: (n) => `${n} trees total`,
    conversionNote: 'Indicative conversion',
    liveInsight: 'Live insight',
    visual: (max) => `Tree equivalent visualisation (max. ${max})`,
    extraTrees: (n) => `+ ${n} extra trees not shown`,
    measures: {
      ev: 'Electric driving (instead of petrol)',
      pv: 'Solar panels (self consumption)',
      insulate: 'Insulation + low temp. heating',
      diet: 'Less meat/dairy',
      heatpump: 'Hybrid heat pump',
    },
  },
};

export default function CO2SavingsTreesPage() {
  const [{ scale, width, height }, setView] = useState({ scale: 1, width: BASE_W, height: BASE_H });
  const [savings, setSavings] = useState(savingsData);

  // Determine language; default to Dutch
  const lang =
    typeof navigator !== 'undefined' && navigator.language && navigator.language.toLowerCase().startsWith('en')
      ? 'en'
      : 'nl';
  const t = translations[lang];

  // Load data from API on mount
  useEffect(() => {
    let cancelled = false;
    fetchSavingsData().then((d) => {
      if (!cancelled) setSavings(d);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Compute total saved kilograms and tree equivalent
  const totalSavedKg = savings.reduce((sum, item) => sum + item.savedKg, 0);
  const totalTrees = Math.floor(totalSavedKg / TREE_CO2_KG);

  // Chart data for the donut
  const donutData = {
    labels: savings.map((i) => t.measures[i.key] || i.key),
    datasets: [
      {
        data: savings.map((i) => i.savedKg),
        backgroundColor: savings.map((i) => colorMap[i.key] || '#94a3b8'),
        borderWidth: 0,
        cutout: '58%',
      },
    ],
  };

  // Chart options; no legend since we render our own legend list
  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: 'rgba(15,23,42,0.92)' },
    },
  };

  // Generate limited tree glyph array for the visual.  Cap at 120 for clarity.
  const maxTreesToShow = 120;
  const treeCountToShow = Math.min(totalTrees, maxTreesToShow);
  const treesArray = Array.from({ length: treeCountToShow });

  // Responsive scaling similar to other pages
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

  // Format numbers based on locale
  function formatNumber(n) {
    return new Intl.NumberFormat(lang === 'nl' ? 'nl-NL' : 'en-US').format(n);
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      <div
        className="relative bg-white"
        style={{ width: width, height: height, transform: `scale(${scale})`, transformOrigin: 'top left' }}
      >
        <div className="w-full h-full flex p-8 gap-8">
          {/* Left panel */}
          <div className="w-[420px] bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-8 flex flex-col shadow-2xl">
            <div className="mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <p className="text-[12px] tracking-widest uppercase opacity-90 font-medium mb-2">{t.analysisTitle}</p>
              <h1 className="text-[26px] leading-tight font-bold">{t.subtitle}</h1>
              <p className="text-[12px] opacity-95 mt-2">{t.oneTree()}</p>
            </div>
            {/* KPI card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 mb-4">
              <p className="text-[12px] opacity-90 mb-1">{t.totalSaving}</p>
              <p className="text-[34px] font-bold text-emerald-200 leading-none mb-2">{formatNumber(totalSavedKg)} kg</p>
              <p className="text-[12px] opacity-90 mb-1">{t.treeEquivalent}</p>
              <p className="text-[30px] font-bold text-white leading-none">{formatNumber(totalTrees)}</p>
            </div>
            {/* Conversion note */}
            <div className="flex items-center justify-between text-[12px] opacity-80 mt-auto">
              <span>{t.conversionNote}</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                <span>{t.liveInsight}</span>
              </div>
            </div>
          </div>
          {/* Right panel */}
          <div className="flex-1 bg-white rounded-3xl flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-8 pb-6 border-b border-slate-100">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h2 className="text-[22px] font-bold text-slate-900 mb-1">{t.measureTitle}</h2>
                  <p className="text-[14px] text-slate-600">{t.measureSubtitle}</p>
                </div>
                <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-[13px] font-semibold border border-emerald-200">
                  {t.totalTreesLabel(formatNumber(totalTrees))}
                </div>
              </div>
            </div>
            {/* Content area */}
            <div className="flex-1 grid grid-cols-10 gap-6 p-8 pt-6 min-h-0">
              {/* Donut and legend */}
              <div className="col-span-4 flex flex-col">
                <div className="relative w-full aspect-square max-w-[380px]">
                  <Doughnut data={donutData} options={donutOptions} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-[12px] text-slate-500">{t.totalSaving}</p>
                    <p className="text-[20px] font-semibold text-slate-800">{formatNumber(totalSavedKg)} kg</p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-1 gap-3 text-[13px]">
                  {savings.map((i) => {
                    const trees = Math.floor(i.savedKg / TREE_CO2_KG);
                    return (
                      <div key={i.key} className="flex items-start gap-3">
                        <span className="mt-1 w-3 h-3 rounded-full" style={{ backgroundColor: colorMap[i.key] || '#94a3b8' }} />
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800">{t.measures[i.key] || i.key}</p>
                          <p className="text-slate-600">
                            {formatNumber(i.savedKg)} kg → {formatNumber(trees)} {lang === 'nl' ? 'bomen' : 'trees'}
                          </p>
                          <div className="w-full h-2 bg-slate-100 rounded mt-2 overflow-hidden">
                            <div
                              className="h-full rounded"
                              style={{
                                width: `${(i.savedKg / totalSavedKg) * 100}%`,
                                backgroundColor: colorMap[i.key] || '#94a3b8',
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Tree grid */}
              <div className="col-span-6">
                <div className="mb-3">
                  <p className="text-[14px] text-slate-600">{t.visual(treeCountToShow)}</p>
                </div>
                <div className="grid grid-cols-12 gap-2 pr-2 overflow-hidden">
                  {treesArray.map((_, idx) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-md bg-emerald-50 border border-emerald-100 flex items-center justify-center"
                      title={lang === 'nl' ? '1 boom' : '1 tree'}
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#059669" strokeWidth="1.8">
                        <path d="M12 2c-3 0-5 2.5-5 5.5S9 13 12 13s5-2.5 5-5.5S15 2 12 2Z" fill="#34d399" stroke="none" />
                        <path d="M12 13v7" />
                        <path d="M8 16h8" />
                      </svg>
                    </div>
                  ))}
                </div>
                {totalTrees > treeCountToShow && (
                  <p className="text-[12px] text-slate-500 mt-3">{t.extraTrees(formatNumber(totalTrees - treeCountToShow))}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}