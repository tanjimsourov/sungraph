// Page: SolarMonthlyPage
// Description:
//   Shows a bar chart of monthly solar energy production for two years with
//   accompanying summary cards.  This implementation introduces Dutch and
//   English translations and reads data from an external module with an
//   optional API fallback.  The layout matches the original design exactly.

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { motion } from 'framer-motion';
import { solarMonthlyData } from '../data/solarMonthlyData';
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Import dummy data.  The exported object contains MONTHS and datasets with
// labels and values.  See ../data/solarMonthlyData.js for details.


// Attempt to fetch monthly data from API.  The API should return an object
// with the same shape as the dummy data: { labels, datasets }.
async function fetchMonthlyData() {
  try {
    const res = await fetch('/api/solarmonthly');
    if (!res.ok) throw new Error('network');
    const json = await res.json();
    if (json && Array.isArray(json.labels) && Array.isArray(json.datasets)) {
      return json;
    }
  } catch (e) {
    // ignore
  }
  return solarMonthlyData;
}

// Translation dictionaries for static text.  The chart itself uses the
// dataset labels directly (years), so no translation is needed there.
const translations = {
  nl: {
    monitoring: 'Solar Monitoring',
    title: 'Opbrengst zonnepanelen per maand (kWh)',
    system: 'Systeem: 3.3 kWp',
    location: 'Locatie: NL',
    description:
      'Vergelijk de maandelijkse opbrengst van dit jaar met vorig jaar. Pieken in mei–juli laten zomerse productie zien.',
    total: 'Totaal 2024',
    expected: 'Verwachte jaaropbrengst op basis van huidige maanden.',
    bestMonths: 'Beste maanden',
    noteTitle: 'Opmerking',
    note:
      'Bij oost/west-opstelling zullen pieken wat vlakker zijn maar spreiding over de dag is beter.',
    monthsShort: { Jun: 'Jun', Jul: 'Jul', Aug: 'Aug' },
  },
  en: {
    monitoring: 'Solar Monitoring',
    title: 'Solar panel yield per month (kWh)',
    system: 'System: 3.3 kWp',
    location: 'Location: NL',
    description:
      'Compare the monthly yield of this year with last year. Peaks in May–July show summer production.',
    total: 'Total 2024',
    expected: 'Expected annual yield based on current months.',
    bestMonths: 'Best months',
    noteTitle: 'Note',
    note:
      'With an east/west arrangement, peaks will be flatter but the spread throughout the day is better.',
    monthsShort: { Jun: 'Jun', Jul: 'Jul', Aug: 'Aug' },
  },
};

export default function SolarMonthlyPage() {
  // Determine language
  const lang =
    typeof navigator !== 'undefined' && navigator.language && navigator.language.toLowerCase().startsWith('en')
      ? 'en'
      : 'nl';
  const t = translations[lang];

  // Local state for chart data
  const [chartData, setChartData] = useState(solarMonthlyData);

  // Load data from API on mount
  useEffect(() => {
    let cancelled = false;
    fetchMonthlyData().then((d) => {
      if (!cancelled) setChartData(d);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Chart options mirror the original; axis labels remain numeric so no translation needed.
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 11, family: 'Inter, system-ui, sans-serif' },
          color: '#0f172a',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15,23,42,0.92)',
        titleFont: { size: 12, family: 'Inter, system-ui, sans-serif' },
        bodyFont: { size: 11, family: 'Inter, system-ui, sans-serif' },
        padding: 8,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(148,163,184,0.18)' },
        ticks: { color: '#475569', font: { size: 11 } },
        beginAtZero: true,
        title: {
          display: true,
          text: 'kWh',
          color: '#475569',
          font: { size: 11 },
        },
      },
    },
  };

  return (
    <div className="w-screen h-screen bg-[#dfe3e7] overflow-hidden">
      <div className="w-full h-full max-w-[1920px] mx-auto py-5 px-5 flex flex-col gap-5">
        {/* top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/logo.png"
              alt="logo"
              className="w-[56px] h-[56px] rounded-full object-contain shadow-sm"
            />
            <div>
              <p className="text-[14px] text-slate-500 leading-none">{t.monitoring}</p>
              <h1 className="text-[18.5px] font-semibold text-slate-900 leading-tight">{t.title}</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full bg-white text-[12px] text-slate-600 shadow-sm">{t.system}</span>
            <span className="px-3 py-1 rounded-full bg-white text-[12px] text-slate-600 shadow-sm">{t.location}</span>
          </div>
        </div>
        {/* main card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white rounded-[22px] shadow-sm flex-1 p-5 flex gap-6"
        >
          <div className="flex-[0.7] flex flex-col">
            <p className="text-[13px] text-slate-500 mb-3">{t.description}</p>
            <div className="flex-1 min-h-0">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
          {/* side info */}
          <div className="flex-[0.3] flex flex-col gap-4">
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-[12px] text-slate-500">{t.total}</p>
              <p className="text-[25px] font-semibold text-slate-900 leading-tight mb-2">3.88 MWh</p>
              <p className="text-[11.5px] text-slate-500">{t.expected}</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-[12px] text-slate-500 mb-2">{t.bestMonths}</p>
              <ul className="text-[12px] text-slate-700 space-y-1">
                <li>
                  <span className="inline-block w-16">{t.monthsShort.Jun}</span> 480 kWh
                </li>
                <li>
                  <span className="inline-block w-16">{t.monthsShort.Jul}</span> 500 kWh
                </li>
                <li>
                  <span className="inline-block w-16">{t.monthsShort.Aug}</span> 470 kWh
                </li>
              </ul>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-[12px] text-slate-500 mb-2">{t.noteTitle}</p>
              <p className="text-[11.5px] text-slate-600">{t.note}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}