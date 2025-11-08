// Page: SolarDistributionPage
// Description:
//   Shows the distribution of solar panel yield across the months of the year.  This
//   implementation adds Dutch and English translations and loads data from an
//   external module with an optional API fallback.  The UI and layout match the
//   original design, preserving the same look and scaling behaviour.

import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import solarDistribution from '../data/solarDistributionData';
// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Base design dimensions used for scaling the page to fill the viewport.
const BASE_W = 1280;
const BASE_H = 720;

// Import dummy distribution data.  MONTHS is an array of month abbreviations
// and DISTRIBUTION contains the corresponding percentage share of annual
// production.  If you implement an API, the page will attempt to fetch data
// from `/api/solardistribution` and fall back to this module on error.


// Fetch distribution data from API; fall back to dummy data on failure.  The API
// should return an object with `MONTHS` and `DISTRIBUTION` arrays.
async function fetchDistribution() {
  try {
    const res = await fetch('/api/solardistribution');
    if (!res.ok) throw new Error('network');
    const json = await res.json();
    if (json && Array.isArray(json.MONTHS) && Array.isArray(json.DISTRIBUTION)) {
      return json;
    }
  } catch (e) {
    // ignore and use dummy
  }
  return solarDistribution;
}

// Translation dictionaries for Dutch and English.  Strings correspond to the
// labels and descriptive text used throughout the UI.  The chart tooltip
// callbacks and Y‑axis tick labels are also translated.
const translations = {
  nl: {
    analysis: 'Zonne-energie Analyse',
    title: 'Verdeling van zonne-opbrengst over het jaar',
    description:
      'In Nederland leveren zonnepanelen in de zomermaanden het grootste deel van de energie. De verdeling toont duidelijk de seizoensinvloed op de opbrengst, met pieken in juni en juli.',
    seasonsTitle: 'Seizoensprestaties',
    seasons: { summer: 'Zomer (Jun-Aug)', winter: 'Winter (Dec-Feb)' },
    source: 'Bron: Voorbeelddata',
    live: 'Live data',
    rightHeaderTitle: 'Maandelijkse Verdeling',
    rightHeaderSubtitle: 'Percentage van totale jaaropbrengst per maand',
    system: '3.3 kWp Systeem',
    topMonths: 'Top Maanden',
    lowMonths: 'Laagste Maanden',
    months: {
      junjul: 'Juni & Juli',
      aug: 'Augustus',
      mei: 'Mei',
      dec: 'December',
      jan: 'Januari',
      feb: 'Februari',
    },
    yLabel: (val) => `${val}%`,
    tooltipLabel: (val) => `${val}% van jaaropbrengst`,
    tooltipTitle: (label) => label,
    datasetLabel: '% van jaaropbrengst',
  },
  en: {
    analysis: 'Solar energy analysis',
    title: 'Distribution of solar yield over the year',
    description:
      'In the Netherlands solar panels generate most energy during the summer months. The distribution clearly shows the seasonal influence on yield, with peaks in June and July.',
    seasonsTitle: 'Seasonal performance',
    seasons: { summer: 'Summer (Jun-Aug)', winter: 'Winter (Dec-Feb)' },
    source: 'Source: Sample data',
    live: 'Live data',
    rightHeaderTitle: 'Monthly distribution',
    rightHeaderSubtitle: 'Percentage of total annual yield per month',
    system: '3.3 kWp system',
    topMonths: 'Top months',
    lowMonths: 'Lowest months',
    months: {
      junjul: 'June & July',
      aug: 'August',
      mei: 'May',
      dec: 'December',
      jan: 'January',
      feb: 'February',
    },
    yLabel: (val) => `${val}%`,
    tooltipLabel: (val) => `${val}% of annual yield`,
    tooltipTitle: (label) => label,
    datasetLabel: '% of annual yield',
  },
};

export default function SolarDistributionPage() {
  const [{ scale, width, height }, setView] = useState({ scale: 1, width: BASE_W, height: BASE_H });
  const [months, setMonths] = useState(solarDistribution.MONTHS);
  const [distribution, setDistribution] = useState(solarDistribution.DISTRIBUTION);

  // Determine current language (default to Dutch).  If the browser language
  // starts with 'en', use English translations; otherwise Dutch.
  const lang =
    typeof navigator !== 'undefined' && navigator.language && navigator.language.toLowerCase().startsWith('en')
      ? 'en'
      : 'nl';
  const t = translations[lang];

  // Load distribution data from API once on mount
  useEffect(() => {
    let cancelled = false;
    fetchDistribution().then((d) => {
      if (!cancelled) {
        setMonths(d.MONTHS);
        setDistribution(d.DISTRIBUTION);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Resize handler for scaling to fill the viewport
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

  // Build chart data and options using translations and loaded data
  const chartData = {
    labels: months,
    datasets: [
      {
        label: t.datasetLabel,
        data: distribution,
        backgroundColor: (context) => {
          const value = context.parsed.y;
          if (value >= 10) return 'rgba(34, 197, 94, 1)'; // high months
          if (value >= 7) return 'rgba(132, 204, 22, 1)'; // medium-high
          if (value >= 5) return 'rgba(234, 179, 8, 1)'; // medium
          return 'rgba(248, 113, 113, 1)'; // low months
        },
        borderRadius: 12,
        borderSkipped: false,
        barPercentage: 0.65,
        categoryPercentage: 0.8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: (ctx) => t.tooltipLabel(ctx.parsed.y),
          title: (ctx) => t.tooltipTitle(ctx[0].label),
        },
      },
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: {
          color: '#475569',
          font: { size: 13, weight: '500' },
        },
      },
      y: {
        beginAtZero: true,
        max: 14,
        ticks: {
          stepSize: 2,
          color: '#475569',
          font: { size: 12 },
          callback: (val) => t.yLabel(val),
        },
        grid: { color: 'rgba(100, 116, 139, 0.1)', drawBorder: false },
      },
    },
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      <div
        className="relative bg-white"
        style={{ width: width, height: height, transform: `scale(${scale})`, transformOrigin: 'top left' }}
      >
        {/* Main layout */}
        <div className="w-full h-full flex p-8 gap-8">
          {/* Left panel */}
          <div className="w-[420px] bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-8 flex flex-col shadow-2xl">
            <div className="mb-2">
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
              <p className="text-[12px] tracking-widest uppercase opacity-90 font-medium mb-2">{t.analysis}</p>
              <h1 className="text-[26px] leading-tight font-bold mb-6">{t.title}</h1>
            </div>
            <p className="text-[14px] leading-relaxed opacity-95 mb-6 flex-1">{t.description}</p>
            {/* Stats Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-white/20">
              <p className="font-semibold text-[15px] mb-3">{t.seasonsTitle}</p>
              <div className="grid grid-cols-2 gap-3 text-[13px]">
                <div>
                  <p className="opacity-80">{t.seasons.summer}</p>
                  <p className="text-lg font-bold text-emerald-200">35%</p>
                </div>
                <div>
                  <p className="opacity-80">{t.seasons.winter}</p>
                  <p className="text-lg font-bold text-amber-200">9%</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-[12px] opacity-80 mt-auto">
              <span>{t.source}</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                <span>{t.live}</span>
              </div>
            </div>
          </div>
          {/* Right panel */}
          <div className="flex-1 bg-white rounded-3xl flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-8 pb-6 border-b border-slate-100">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h2 className="text-[22px] font-bold text-slate-900 mb-1">{t.rightHeaderTitle}</h2>
                  <p className="text-[14px] text-slate-600">{t.rightHeaderSubtitle}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-[13px] font-semibold border border-emerald-200">
                    {t.system}
                  </div>
                  <button className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-colors">
                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            {/* Chart area */}
            <div className="flex-1 p-8 pt-6 min-h-0">
              <Bar data={chartData} options={chartOptions} />
            </div>
            {/* Bottom info cards */}
            <div className="p-8 pt-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                    <p className="font-bold text-[15px] text-slate-900">{t.topMonths}</p>
                  </div>
                  <div className="space-y-3 text-[14px]">
                    <div className="flex justify-between items-center">
                      <span>{t.months.junjul}</span>
                      <span className="font-bold text-slate-900">12% {lang === 'nl' ? 'elk' : 'each'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{t.months.aug}</span>
                      <span className="font-bold text-slate-900">11%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{t.months.mei}</span>
                      <span className="font-bold text-slate-900">11%</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-amber-500 rounded-full" />
                    <p className="font-bold text-[15px] text-slate-900">{t.lowMonths}</p>
                  </div>
                  <div className="space-y-3 text-[14px]">
                    <div className="flex justify-between items-center">
                      <span>{t.months.dec}</span>
                      <span className="font-bold text-slate-900">2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{t.months.jan}</span>
                      <span className="font-bold text-slate-900">3%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{t.months.feb}</span>
                      <span className="font-bold text-slate-900">4%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}