// Page: EVChargingStationsPage
// Description:
//   Displays a list of electric vehicle charging stations with real‑time availability and
//   a usage chart.  Supports Dutch and English translations and loads data from
//   external modules with an optional API fallback.  Scaling follows the
//   pattern of other pages to maintain a 1280×720 aspect ratio while filling
//   the viewport.

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
import chargingStationsData from '../data/chargingStations';
import { usageHours as defaultUsageHours, hourLabels as defaultHourLabels } from '../data/chargingUsage';
// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const BASE_W = 1280;
const BASE_H = 720;

// Dummy data imports


// Translations
const translations = {
  nl: {
    listTitle: 'Laadpalen overzicht',
    stationsTitle: 'Beschikbare laadstations',
    availableLabel: 'Beschikbaar:',
    powerLabel: 'Vermogen:',
    priceLabel: 'Prijs:',
    systemOverview: 'Systeem overzicht',
    totalStations: 'Totaal stations',
    avgOccupancy: 'Gem. bezetting',
    realtime: 'Real-time bezetting en gebruikspatronen',
    station: {
      available: 'Beschikbaar',
      full: 'Vol',
    },
    stationDetails: 'Station Details',
    performance: 'Prestaties',
    connectorType: 'Type connector',
    maxPower: 'Max vermogen',
    currentPrice: 'Actuele prijs',
    avgOccupancyCard: 'Gem. bezetting',
    peakUsage: 'Piek gebruik',
    chargedToday: 'Vandaag geladen',
    units: {
      percentOccupancy: (v) => `${v}% bezetting`,
      hourTitle: (label) => `${label}:00 uur`,
    },
  },
  en: {
    listTitle: 'Charging stations overview',
    stationsTitle: 'Available charging stations',
    availableLabel: 'Available:',
    powerLabel: 'Power:',
    priceLabel: 'Price:',
    systemOverview: 'System overview',
    totalStations: 'Total stations',
    avgOccupancy: 'Avg occupancy',
    realtime: 'Real-time occupancy and usage patterns',
    station: {
      available: 'Available',
      full: 'Full',
    },
    stationDetails: 'Station Details',
    performance: 'Performance',
    connectorType: 'Connector type',
    maxPower: 'Max power',
    currentPrice: 'Current price',
    avgOccupancyCard: 'Avg occupancy',
    peakUsage: 'Peak usage',
    chargedToday: 'Charged today',
    units: {
      percentOccupancy: (v) => `${v}% occupancy`,
      hourTitle: (label) => `${label}:00 hours`,
    },
  },
};

export default function EVChargingStationsPage() {
  const [{ scale, width, height }, setView] = useState({ scale: 1, width: BASE_W, height: BASE_H });

  // Determine language
  const lang =
    typeof navigator !== 'undefined' && navigator.language && navigator.language.toLowerCase().startsWith('en')
      ? 'en'
      : 'nl';
  const t = translations[lang];

  // Local state for stations and usage
  const [stations, setStations] = useState(chargingStationsData);
  const [selectedStation, setSelectedStation] = useState(0);
  const [usageHours, setUsageHours] = useState(defaultUsageHours);
  const [hourLabels, setHourLabels] = useState(defaultHourLabels);

  // Chart data configured based on usageHours
  const chartData = {
    labels: hourLabels,
    datasets: [
      {
        label: t.units.percentOccupancy.name ?? '',
        data: usageHours,
        borderRadius: 999,
        borderSkipped: false,
        barPercentage: 0.55,
        categoryPercentage: 0.8,
        backgroundColor: (ctx) => {
          const v = ctx.parsed.y;
          if (v >= 80) return 'rgba(16,185,129,1)';
          if (v >= 70) return 'rgba(132,204,22,1)';
          if (v >= 60) return 'rgba(234,179,8,1)';
          return 'rgba(248,113,113,1)';
        },
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
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
        cornerRadius: 8,
        padding: 10,
        callbacks: {
          label: (ctx) => t.units.percentOccupancy(ctx.parsed.y),
          title: (ctx) => t.units.hourTitle(ctx[0].label),
        },
      },
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: {
          color: '#94a3b8',
          font: { size: 11, weight: '500' },
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 25,
          color: '#94a3b8',
          font: { size: 10 },
          callback: (val) => `${val}%`,
        },
        grid: { color: 'rgba(148, 163, 184, 0.15)', drawBorder: false },
      },
    },
  };

  // Scaling
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

  // Fetch stations from API and usage from API if available
  useEffect(() => {
    let cancelled = false;
    async function loadStations() {
      try {
        const res = await fetch('/api/chargingstations');
        if (!res.ok) throw new Error('Bad');
        const data = await res.json();
        if (!cancelled && Array.isArray(data)) {
          setStations(data);
        }
      } catch (e) {
        // ignore
      }
    }
    async function loadUsage() {
      try {
        const res = await fetch('/api/chargingusage');
        if (!res.ok) throw new Error('Bad');
        const data = await res.json();
        if (!cancelled && data && Array.isArray(data.usage) && Array.isArray(data.labels)) {
          setUsageHours(data.usage);
          setHourLabels(data.labels);
        }
      } catch (e) {
        // ignore
      }
    }
    loadStations();
    loadUsage();
    return () => {
      cancelled = true;
    };
  }, []);

  const station = stations[selectedStation] || stations[0];

  const getAvailabilityColor = (available, total) => {
    const p = (available / total) * 100;
    if (p >= 50) return 'text-emerald-400';
    if (p >= 25) return 'text-amber-300';
    return 'text-red-300';
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      {/* hide scrollbar for left list */}
      <style>{`
        .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
      <div
        className="relative bg-white"
        style={{ width: width, height: height, transform: `scale(${scale})`, transformOrigin: 'top left' }}
      >
        <div className="w-full h-full flex p-8 gap-8">
          {/* Left panel */}
          <div className="w-[420px] bg-gradient-to-br from-[#1F62E6] to-[#2436C9] text-white rounded-3xl p-8 flex flex-col shadow-2xl">
            <div className="mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                  />
                </svg>
              </div>
              <p className="text-[12px] tracking-widest uppercase opacity-90 font-medium mb-2">{t.listTitle}</p>
              <h1 className="text-[26px] leading-tight font-bold mb-6">{t.stationsTitle}</h1>
            </div>

            {/* Scrollable station list */}
            <div className="flex-1 space-y-4 mb-6 overflow-y-auto hide-scrollbar">
              {stations.map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedStation(idx)}
                  className={`bg-white/10 backdrop-blur-sm rounded-2xl p-5 border-2 cursor-pointer transition-all ${
                    selectedStation === idx ? 'border-white/40 bg-white/20' : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-[16px]">{s.name}</h3>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${
                        s.type === 'SNELLADER'
                          ? 'bg-green-500/20 text-green-200'
                          : s.type === 'CCS'
                          ? 'bg-purple-500/20 text-purple-200'
                          : 'bg-blue-500/20 text-blue-200'
                      }`}
                    >
                      {s.type}
                    </span>
                  </div>
                  <div className="space-y-2 text-[13px]">
                    <div className="flex justify-between">
                      <span className="opacity-80">{t.availableLabel}</span>
                      <span className={`font-bold ${getAvailabilityColor(s.available, s.total)}`}>
                        {s.available}/{s.total}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-80">{t.powerLabel}</span>
                      <span className="font-bold">{s.power} kW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-80">{t.priceLabel}</span>
                      <span className="font-bold">€{s.price.toFixed(2)}/kWh</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer stats */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 mt-auto">
              <p className="font-semibold text-[15px] mb-3">{t.systemOverview}</p>
              <div className="grid grid-cols-2 gap-4 text-[13px]">
                <div>
                  <p className="opacity-80">{t.totalStations}</p>
                  <p className="text-lg font-bold text-white">{stations.length}</p>
                </div>
                <div>
                  <p className="opacity-80">{t.avgOccupancy}</p>
                  <p className="text-lg font-bold text-emerald-100">68%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="flex-1 bg-white rounded-3xl flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-8 pb-6 border-b border-slate-100">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h2 className="text-[22px] font-bold text-slate-900 mb-1">{station.name}</h2>
                  <p className="text-[14px] text-slate-600">{t.realtime}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`px-4 py-2 rounded-xl text-[13px] font-semibold border ${
                      station.available > 0
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}
                  >
                    {station.available > 0 ? t.station.available : t.station.full}
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
                {/* Station details */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-sky-500 rounded-full"></div>
                    <p className="font-bold text-[15px] text-slate-900">{t.stationDetails}</p>
                  </div>
                  <div className="space-y-3 text-[14px]">
                    <div className="flex justify-between items-center">
                      <span>{t.connectorType}</span>
                      <span className="font-bold text-slate-900">{station.type}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{t.maxPower}</span>
                      <span className="font-bold text-slate-900">{station.power} kW</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{t.currentPrice}</span>
                      <span className="font-bold text-slate-900">€{station.price.toFixed(2)}/kWh</span>
                    </div>
                  </div>
                </div>

                {/* Performance */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <p className="font-bold text-[15px] text-slate-900">{t.performance}</p>
                  </div>
                  <div className="space-y-3 text-[14px]">
                    <div className="flex justify-between items-center">
                      <span>{t.avgOccupancyCard}</span>
                      <span className="font-bold text-slate-900">68%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{t.peakUsage}</span>
                      <span className="font-bold text-slate-900">18:00-20:00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{t.chargedToday}</span>
                      <span className="font-bold text-slate-900">42 auto's</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* End right panel */}
        </div>
      </div>
    </div>
  );
}