// Page: SolarLinePage
// Description:
//   Displays a line chart comparing minimum, average and maximum monthly solar
//   yields as percentages of the annual total.  Provides Dutch and English
//   translations and loads data from an external module with optional API
//   fallback.  The layout and styling remain identical to the original.

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import solarLineData from '../data/solarLineData';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

// Base dimensions for scaling.  The chart is designed for a 1200×600 area.
const BASE_W = 1200;
const BASE_H = 600;

// Import dummy data.  Each dataset represents a curve for a measurement type.


// Fetch line data from API; fallback to dummy data on failure.  The API is
// expected to return the same shape as the dummy: { labels, datasets }.
async function fetchLineData() {
  try {
    const res = await fetch('/api/solarline');
    if (!res.ok) throw new Error('network');
    const json = await res.json();
    if (json && Array.isArray(json.labels) && Array.isArray(json.datasets)) {
      return json;
    }
  } catch (e) {
    // ignore
  }
  return solarLineData;
}

// Translations for titles and dataset labels.  The datasets in the dummy data
// use Dutch labels; the English translation will map these to their
// equivalents.  Unknown labels are passed through unchanged.
const translations = {
  nl: {
    title: 'Opbrengst Zonnepanelen per maand',
    subtitle: '(als % van de totale opbrengst per jaar 2015–2022)',
    datasetLabels: {
      gemiddeld: 'gemiddeld',
      minimum: 'minimum',
      maximum: 'maximum',
    },
  },
  en: {
    title: 'Solar panel yield per month',
    subtitle: '(as % of total annual yield 2015–2022)',
    datasetLabels: {
      gemiddeld: 'Average',
      minimum: 'Minimum',
      maximum: 'Maximum',
    },
  },
};

export default function SolarLinePage() {
  const [scale, setScale] = useState(1);
  const [data, setData] = useState(solarLineData);

  // Determine language
  const lang =
    typeof navigator !== 'undefined' && navigator.language && navigator.language.toLowerCase().startsWith('en')
      ? 'en'
      : 'nl';
  const t = translations[lang];

  // Load data from API once on mount
  useEffect(() => {
    let cancelled = false;
    fetchLineData().then((d) => {
      if (!cancelled) setData(d);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Resize scaling
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

  // Translate dataset labels when rendering
  const translatedData = {
    labels: data.labels,
    datasets: data.datasets.map((ds) => ({
      ...ds,
      label: t.datasetLabels[ds.label] || ds.label,
    })),
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { usePointStyle: true, boxWidth: 8 },
      },
      tooltip: { backgroundColor: 'rgba(15,23,42,0.85)' },
    },
    scales: {
      y: {
        grid: { color: 'rgba(0,0,0,0.04)' },
        ticks: { callback: (v) => v + '%', max: 20, stepSize: 2 },
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
          <Line data={translatedData} options={lineOptions} />
        </div>
      </div>
    </div>
  );
}