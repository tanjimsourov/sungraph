// Page: SolarBarPage
// Description:
//   Displays a bar chart comparing monthly solar yield percentages across years.  Includes
//   Dutch and English translations and loads data from an external module with optional
//   API fallback.  Scaling preserves a 1200×600 aspect ratio within the viewport.

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
import solarBarData from '../data/solarBarData';
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const BASE_W = 1200;
const BASE_H = 600;

// Import dummy data


// Attempt to fetch bar data from API
async function fetchBarData() {
  try {
    const res = await fetch('/api/solarbar');
    if (!res.ok) throw new Error('network');
    const json = await res.json();
    return json;
  } catch (e) {
    return solarBarData;
  }
}

// Translations
const translations = {
  nl: {
    title: 'Opbrengst Zonnepanelen per maand',
    subtitle: '(als % van de totale jaaropbrengst) · 2015 – 2022',
  },
  en: {
    title: 'Solar panel yield per month',
    subtitle: '(as % of the total annual yield) · 2015 – 2022',
  },
};

export default function SolarBarPage() {
  const [scale, setScale] = useState(1);
  const [data, setData] = useState(solarBarData);

  // Determine language
  const lang =
    typeof navigator !== 'undefined' && navigator.language && navigator.language.toLowerCase().startsWith('en')
      ? 'en'
      : 'nl';
  const t = translations[lang];

  // Load data from API
  useEffect(() => {
    let cancelled = false;
    fetchBarData().then((d) => {
      if (!cancelled) setData(d);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const resize = () => {
      const w = window.innerWidth / BASE_W;
      const h = window.innerHeight / BASE_H;
      setScale(Math.min(w, h));
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Chart options remain unchanged
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' },
      tooltip: {
        callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}%` },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (v) => v + '%' },
        grid: { color: 'rgba(0,0,0,0.035)' },
      },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="w-screen h-screen bg-[#dfe3e7] overflow-hidden flex items-center justify-center">
      <div
        className="relative w-[1200px] h-[600px] bg-white rounded-[20px] shadow flex flex-col p-6"
        style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
      >
        <p className="text-[18px] font-semibold text-slate-800">{t.title}</p>
        <p className="text-[12px] text-slate-500 mb-3">{t.subtitle}</p>
        <div className="flex-1 min-h-0">
          <Bar data={data} options={barOptions} />
        </div>
      </div>
    </div>
  );
}