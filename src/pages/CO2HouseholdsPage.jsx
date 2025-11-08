// Page: CO2HouseholdsPage
// Description:
//   Visualises household CO₂ emissions per category using a bar chart and summary cards.
//   Provides Dutch and English translations and uses external data with fallback to
//   dummy values.  The page scales to fill the viewport similar to other pages.

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
import co2SourcesData from '../data/co2Sources';
// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Base dimensions for scaling
const BASE_W = 1280;
const BASE_H = 720;

// Import dummy data for CO₂ sources.  Each object has a key, co2 value (kg/year) and color.


// Translations for static text and category names.  Keys correspond to category keys
// defined in co2SourcesData.  The structure is nested to group related phrases.
const translations = {
  nl: {
    categories: {
      heating: 'Verwarming',
      electricity: 'Elektriciteit',
      transport: 'Vervoer',
      food: 'Voeding',
      waste: 'Afval',
      other: 'Overig',
    },
    ui: {
      left: {
        analysis: 'CO₂ Analyse',
        title: 'Huishoudelijke CO₂ Uitstoot',
        description: 'Inzicht in uw ecologische voetafdruk per categorie.',
        totalLabel: 'Totale jaarlijkse uitstoot',
        totalValue: '6,500 kg',
        totalUnit: 'CO₂ equivalent',
        average: 'Gemiddeld NL huishouden',
        yourSaving: 'Uw besparing',
        distributionTitle: 'Verdeling per categorie',
        distributionDesc: 'Vervoer is de grootste bron, daarna voeding en verwarming.',
        source: 'Bron: Voorbeelddata',
        live: 'Live inzicht',
      },
      right: {
        headerTitle: 'Gedetailleerde Analyse',
        headerSubtitle: 'Uitstoot per categorie en vergelijkingen',
        chartTitle: 'Uitstoot per categorie',
        chartSubTitle: 'Jaarlijkse CO₂ uitstoot in kilogram',
        highest: 'Hoogste uitstoot',
        savingPotential: 'Besparingspotentieel',
        impact: 'Milieu-impact',
        transport: 'Vervoer',
        food: 'Voeding',
        heating: 'Verwarming',
        electricDriving: 'Elektrisch rijden',
        solarPanels: 'Zonnepanelen',
        insulation: 'Isolatie',
        co2PerPerson: 'CO₂ per persoon',
        euTarget: 'EU doel 2030',
        climateNeutral: 'Klimaatneutraal',
      },
    },
    chart: {
      datasetLabel: 'CO₂ Uitstoot (kg)',
      tooltipLabel: (val) => `${val} kg CO₂ per jaar`,
      yAxisCallback: (val) => `${val} kg`,
    },
  },
  en: {
    categories: {
      heating: 'Heating',
      electricity: 'Electricity',
      transport: 'Transport',
      food: 'Food',
      waste: 'Waste',
      other: 'Other',
    },
    ui: {
      left: {
        analysis: 'CO₂ Analysis',
        title: 'Household CO₂ Emissions',
        description: 'Insight into your ecological footprint per category.',
        totalLabel: 'Total annual emissions',
        totalValue: '6,500 kg',
        totalUnit: 'CO₂ equivalent',
        average: 'Average NL household',
        yourSaving: 'Your saving',
        distributionTitle: 'Distribution by category',
        distributionDesc: 'Transport is the largest source, followed by food and heating.',
        source: 'Source: Sample data',
        live: 'Live insight',
      },
      right: {
        headerTitle: 'Detailed analysis',
        headerSubtitle: 'Emissions per category and comparisons',
        chartTitle: 'Emissions by category',
        chartSubTitle: 'Annual CO₂ emissions in kilograms',
        highest: 'Highest emissions',
        savingPotential: 'Saving potential',
        impact: 'Environmental impact',
        transport: 'Transport',
        food: 'Food',
        heating: 'Heating',
        electricDriving: 'Electric driving',
        solarPanels: 'Solar panels',
        insulation: 'Insulation',
        co2PerPerson: 'CO₂ per person',
        euTarget: 'EU target 2030',
        climateNeutral: 'Climate neutral',
      },
    },
    chart: {
      datasetLabel: 'CO₂ Emissions (kg)',
      tooltipLabel: (val) => `${val} kg CO₂ per year`,
      yAxisCallback: (val) => `${val} kg`,
    },
  },
};

export default function CO2HouseholdsPage() {
  const [{ scale, width, height }, setView] = useState({ scale: 1, width: BASE_W, height: BASE_H });

  // Determine language
  const lang =
    typeof navigator !== 'undefined' && navigator.language && navigator.language.toLowerCase().startsWith('en')
      ? 'en'
      : 'nl';
  const t = translations[lang];

  // Local state for data, loaded from API if possible
  const [co2Sources, setCo2Sources] = useState(co2SourcesData);

  // Compose bar chart data using translated category labels
  const barData = {
    labels: co2Sources.map((s) => t.categories[s.key]),
    datasets: [
      {
        label: t.chart.datasetLabel,
        data: co2Sources.map((s) => s.co2),
        backgroundColor: co2Sources.map((s) => s.color),
        borderRadius: 12,
        borderSkipped: false,
        barPercentage: 0.7,
        categoryPercentage: 0.8,
      },
    ],
  };

  // Chart options with translated tooltip and axis labels
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15,23,42,0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: (ctx) => t.chart.tooltipLabel(ctx.parsed.y),
        },
      },
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: {
          color: '#475569',
          font: { size: 11, weight: '500' },
        },
      },
      y: {
        beginAtZero: true,
        max: 2500,
        ticks: {
          stepSize: 500,
          color: '#475569',
          font: { size: 11 },
          callback: (val) => t.chart.yAxisCallback(val),
        },
        grid: { color: 'rgba(100,116,139,0.1)', drawBorder: false },
      },
    },
  };

  // Resize handler for scaling
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

  // Load data from API if available
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('/api/co2sources');
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        // Expecting array of objects with key, co2, color
        if (!cancelled && Array.isArray(data)) {
          setCo2Sources(data);
        }
      } catch (e) {
        // ignore and keep dummy data
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      <div
        className="relative bg-white"
        style={{
          width: width,
          height: height,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <div className="w-full h-full flex p-8 gap-8">
          {/* Left panel */}
          <div className="w-[420px] bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 text-white rounded-3xl px-8 pt-7 pb-6 flex flex-col shadow-2xl">
            <div className="mb-5">
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
              <p className="text-[12px] tracking-widest uppercase opacity-90 font-medium mb-1">{t.ui.left.analysis}</p>
              <h1 className="text-[25px] leading-tight font-bold mb-3">{t.ui.left.title}</h1>
              <p className="text-[13px] leading-relaxed opacity-95">{t.ui.left.description}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 mb-4 border border-white/15">
              <p className="text-[12px] opacity-80 mb-2">{t.ui.left.totalLabel}</p>
              <p className="text-[34px] font-bold text-emerald-200 leading-none mb-2">{t.ui.left.totalValue}</p>
              <p className="text-[10px] opacity-70 mb-4">{t.ui.left.totalUnit}</p>
              <div className="flex justify-between text-[12px] gap-3">
                <div>
                  <p className="opacity-70">{t.ui.left.average}</p>
                  <p className="font-semibold">6.500 kg</p>
                </div>
                <div className="text-right">
                  <p className="opacity-70">{t.ui.left.yourSaving}</p>
                  <p className="font-semibold text-emerald-200">0.0%</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-2xl px-5 py-4 border border-white/10 mb-4">
              <p className="text-[12px] font-semibold mb-1">{t.ui.left.distributionTitle}</p>
              <p className="text-[10px] opacity-70">{t.ui.left.distributionDesc}</p>
            </div>

            <div className="flex items-center justify-between text-[11px] opacity-80 mt-auto">
              <span>{t.ui.left.source}</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-300 rounded-full"></div>
                <span>{t.ui.left.live}</span>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="flex-1 bg-white rounded-3xl flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-8 pb-6 border-b border-slate-100">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h2 className="text-[22px] font-bold text-slate-900 mb-1">{t.ui.right.headerTitle}</h2>
                  <p className="text-[14px] text-slate-600">{t.ui.right.headerSubtitle}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-xl text-[13px] font-semibold border border-purple-200">
                    CO₂ Footprint
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
            <div className="flex-1 p-8 pt-6 min-h-0 flex flex-col">
              <div className="mb-4">
                <h3 className="text-[15px] font-bold text-slate-900 mb-1">{t.ui.right.chartTitle}</h3>
                <p className="text-[11px] text-slate-600">{t.ui.right.chartSubTitle}</p>
              </div>
              <div className="flex-1 min-h-0">
                <div className="h-full max-h-[250px]">
                  <Bar data={barData} options={barOptions} />
                </div>
              </div>
            </div>

            {/* Bottom cards */}
            <div className="p-8 pt-4">
              <div className="grid grid-cols-3 gap-6">
                {/* Highest emissions */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <p className="font-bold text-[15px] text-slate-900">{t.ui.right.highest}</p>
                  </div>
                  <div className="space-y-3 text-[14px]">
                    <div className="flex justify-between items-center">
                      <span>{t.ui.right.transport}</span>
                      <span className="font-bold text-slate-900">2.200 kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{t.ui.right.food}</span>
                      <span className="font-bold text-slate-900">1.500 kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{t.ui.right.heating}</span>
                      <span className="font-bold text-slate-900">1.250 kg</span>
                    </div>
                  </div>
                </div>

                {/* Saving potential */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <p className="font-bold text-[15px] text-slate-900">{t.ui.right.savingPotential}</p>
                  </div>
                  <div className="space-y-3 text-[14px]">
                    <div className="flex justify-between items-center">
                      <span>{t.ui.right.electricDriving}</span>
                      <span className="font-bold text-slate-900">-60%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{t.ui.right.solarPanels}</span>
                      <span className="font-bold text-slate-900">-40%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{t.ui.right.insulation}</span>
                      <span className="font-bold text-slate-900">-30%</span>
                    </div>
                  </div>
                </div>

                {/* Environmental impact */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <p className="font-bold text-[15px] text-slate-900">{t.ui.right.impact}</p>
                  </div>
                  <div className="space-y-3 text-[14px]">
                    <div className="flex justify-between items-center">
                      <span>{t.ui.right.co2PerPerson}</span>
                      <span className="font-bold text-slate-900">1.600 kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{t.ui.right.euTarget}</span>
                      <span className="font-bold text-slate-900">2.500 kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{t.ui.right.climateNeutral}</span>
                      <span className="font-bold text-slate-900">0 kg</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* End bottom cards */}
          </div>
        </div>
      </div>
    </div>
  );
}