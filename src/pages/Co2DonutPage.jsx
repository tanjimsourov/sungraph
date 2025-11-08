// Page: Co2DonutPage
// Description:
//   Shows a donut chart of a Dutch household's CO₂ emissions distribution by consumption category.
//   Includes translations for Dutch and English and pulls data from a module with fallback API support.

import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import donutData from '../data/co2DonutData';
ChartJS.register(ArcElement, Tooltip, Legend);

// Base size for scaling
const BASE_W = 1200;
const BASE_H = 600;

// Import dummy donut data


// Translation dictionaries
const translations = {
  nl: {
    title: 'CO₂-uitstoot per jaar van een Nederlands huishouden',
    source: 'Bron: Milieu Centraal (2022)',
    centerLines: ['CO₂-uitstoot per jaar', 'van een Nederlands', 'huishouden'],
    labels: donutData.labels,
  },
  en: {
    title: 'Annual CO₂ emissions of a Dutch household',
    source: 'Source: Milieu Centraal (2022)',
    centerLines: ['Annual CO₂ emissions', 'of a Dutch', 'household'],
    labels: [
      'Food and drinks 22%',
      'Home energy 19%',
      'Car, bike, public transport 18%',
      'Clothing and goods 11%',
      'Flying 9%',
      'House (exterior, interior) 8%',
      'Collective facilities 7%',
      'Recreation, sport, culture 6%',
    ],
  },
};

// Attempt to fetch donut data from API; fallback to local data if not available
async function fetchDonutData() {
  try {
    const res = await fetch('/api/co2donut');
    if (!res.ok) throw new Error('network');
    const json = await res.json();
    return json;
  } catch (e) {
    return donutData;
  }
}

export default function Co2DonutPage() {
  const [scale, setScale] = useState(1);
  const [data, setData] = useState(donutData);

  // Determine language
  const lang =
    typeof navigator !== 'undefined' && navigator.language && navigator.language.toLowerCase().startsWith('en')
      ? 'en'
      : 'nl';
  const t = translations[lang];

  // On mount, attempt to load data from API
  useEffect(() => {
    let cancelled = false;
    fetchDonutData().then((d) => {
      if (!cancelled) {
        setData(d);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Chart options; disable legend (we draw our own legend) and set tooltip theme
  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15,23,42,0.85)',
      },
    },
  };

  // Resize handler for scaling
  useEffect(() => {
    const handleResize = () => {
      const wScale = window.innerWidth / BASE_W;
      const hScale = window.innerHeight / BASE_H;
      setScale(Math.min(wScale, hScale));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Use translated labels but keep numeric data and colors
  const chartData = {
    labels: t.labels,
    datasets: data.datasets,
  };

  return (
    <div className="w-screen h-screen bg-white overflow-hidden flex items-center justify-center">
      <div
        className="relative w-[1200px] h-[600px] flex items-center gap-10"
        style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
      >
        {/* Chart block */}
        <div className="relative w-[420px] h-[420px]">
          <Doughnut data={chartData} options={donutOptions} />
          {/* Center text, translated into separate lines */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-[14px] font-semibold text-slate-800 leading-tight w-[160px] pointer-events-none">
            {t.centerLines.map((line) => (
              <React.Fragment key={line}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Labels block */}
        <div className="flex-1">
          <h1 className="text-[26px] font-semibold text-slate-800 mb-1">{t.title}</h1>
          <p className="text-slate-500 text-[13px] mb-6">{t.source}</p>

          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-[14px]">
            {chartData.labels.map((label, idx) => (
              <div key={label} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: chartData.datasets[0].backgroundColor[idx] }}
                />
                <span className="text-slate-700">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}