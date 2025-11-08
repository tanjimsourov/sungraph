// Page: SolarMonthlyPage
//   Shows a bar chart of monthly solar energy production for two years with
//   accompanying summary cards. Adds Dutch/English translations, external data,
//   and improved readability for right-side cards + chart axes.

import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { motion, AnimatePresence } from 'framer-motion';
import { solarMonthlyData } from '../data/solarMonthlyData';
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Attempt to fetch monthly data from API (fallback to local data)
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

// Translations
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
    typeof navigator !== 'undefined' &&
    navigator.language &&
    navigator.language.toLowerCase().startsWith('en')
      ? 'en'
      : 'nl';
  const t = translations[lang];

  // Local state for chart data
  const [chartData, setChartData] = useState(solarMonthlyData);
  const [isVisible, setIsVisible] = useState(false);
  const [activeBar, setActiveBar] = useState(null);
  const [energySaved, setEnergySaved] = useState(0);
  const chartRef = useRef();

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

  // Animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);

    // Animated energy counter
    const energyTimer = setInterval(() => {
      setEnergySaved((prev) => {
        const increment = Math.random() * 0.5 + 0.1;
        return prev + increment;
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(energyTimer);
    };
  }, []);

  // Enhanced chart data (gradients)
  const enhancedChartData = {
    ...chartData,
    datasets: chartData.datasets.map((dataset, index) => {
      const colors = [
        {
          main: '#00f5d4',
          light: '#00bbf9',
          gradient: ['#00f5d4', '#00bbf9'],
          shadow: '0 8px 32px rgba(0, 245, 212, 0.4)',
        }, // 2024
        {
          main: '#ff006e',
          light: '#ffbe0b',
          gradient: ['#ff006e', '#ffbe0b'],
          shadow: '0 8px 32px rgba(255, 0, 110, 0.4)',
        }, // 2023
      ];
      const colorSet = colors[index % colors.length];

      return {
        ...dataset,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return colorSet.main;
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.bottom,
            0,
            chartArea.top
          );
          gradient.addColorStop(0, colorSet.gradient[0]);
          gradient.addColorStop(0.7, colorSet.gradient[1]);
          gradient.addColorStop(1, colorSet.gradient[1] + '80');
          return gradient;
        },
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1,
        borderRadius: { topLeft: 12, topRight: 12, bottomLeft: 4, bottomRight: 4 },
        borderSkipped: false,
        hoverBackgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return colorSet.light;
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.bottom,
            0,
            chartArea.top
          );
          gradient.addColorStop(0, colorSet.gradient[0] + 'DD');
          gradient.addColorStop(0.7, colorSet.gradient[1] + 'DD');
          gradient.addColorStop(1, colorSet.gradient[1] + 'AA');
          return gradient;
        },
        hoverBorderColor: 'rgba(255, 255, 255, 0.6)',
        hoverBorderWidth: 2,
        barPercentage: 0.7,
        categoryPercentage: 0.8,
      };
    }),
  };

  // ====== FIX #1: clearer axes/legend text (only this options block changed) ======
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeOutElastic',
      delay: (context) => context.dataIndex * 100 + context.datasetIndex * 200,
    },
    interaction: { intersect: false, mode: 'index' },
    onHover: (event, elements) => {
      if (elements && elements.length > 0) {
        const element = elements[0];
        setActiveBar({
          datasetIndex: element.datasetIndex,
          index: element.index,
          value: element.element.$context.parsed.y,
          label: chartData.labels[element.index],
        });
      } else {
        setActiveBar(null);
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 14,
            family: "'Geist','Inter',system-ui,sans-serif",
            weight: '600',
          },
          color: '#E6F3FF', // brighter for dark bg
          usePointStyle: true,
          padding: 20,
          generateLabels: (chart) => {
            const original = ChartJS.defaults.plugins.legend.labels.generateLabels;
            const labels = original(chart);
            return labels.map((label) => ({
              ...label,
              pointStyle: 'circle',
              pointBackgroundColor: label.text.includes('2024')
                ? '#00f5d4'
                : '#ff006e',
            }));
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.98)',
        titleFont: {
          size: 13,
          family: "'Geist','Inter',system-ui,sans-serif",
          weight: '700',
        },
        bodyFont: {
          size: 12,
          family: "'Geist','Inter',system-ui,sans-serif",
          weight: '600',
        },
        padding: 16,
        cornerRadius: 16,
        borderColor: 'rgba(255,255,255,0.2)',
        borderWidth: 1,
        displayColors: true,
        boxPadding: 8,
        usePointStyle: true,
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y} kWh`,
          labelColor: (ctx) => {
            const colors = ['#00f5d4', '#ff006e'];
            return {
              borderColor: colors[ctx.datasetIndex],
              backgroundColor: colors[ctx.datasetIndex] + '40',
              borderWidth: 3,
              borderRadius: 8,
            };
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#E6F3FF',
          font: {
            size: 14,
            family: "'Geist','Inter',system-ui,sans-serif",
            weight: '700',
          },
        },
      },
      y: {
        grid: { color: 'rgba(230, 243, 255, 0.15)', drawBorder: false },
        ticks: {
          color: '#E6F3FF',
          font: {
            size: 14,
            family: "'Geist','Inter',system-ui,sans-serif",
            weight: '700',
          },
        },
        beginAtZero: true,
        title: {
          display: true,
          text: 'kWh',
          color: '#E6F3FF',
          font: {
            size: 14,
            family: "'Geist','Inter',system-ui,sans-serif",
            weight: '800',
          },
          padding: { top: 0, bottom: 10 },
        },
      },
    },
    elements: {
      bar: {
        borderRadius: { topLeft: 12, topRight: 12, bottomLeft: 4, bottomRight: 4 },
        borderSkipped: false,
        borderWidth: 1,
        hoverBorderWidth: 2,
      },
    },
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 overflow-hidden relative">
      {/* Animated cosmic background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float-cosmic"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${30 + Math.random() * 30}s`,
              background: `radial-gradient(circle, ${
                ['#00f5d4', '#00bbf9', '#ff006e', '#ffbe0b'][i % 4]
              } 0%, transparent 70%)`,
              filter: 'blur(1px)',
            }}
          />
        ))}

        {/* Large floating orbs */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-float-orb-1" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-orb-2" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-float-orb-3" />
      </div>

      {/* Animated grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(90deg, transparent 98%, #00f5d4 100%),
            linear-gradient(180deg, transparent 98%, #00f5d4 100%)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 40s linear infinite',
        }}
      />

      <div className="w-full h-full max-w-[1920px] mx-auto py-8 px-8 flex flex-col gap-6 relative z-10">
        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="flex items-center justify-between bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-2xl"
        >
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl shadow-2xl flex items-center justify-center">
                <div className="text-white text-2xl">⚡</div>
              </div>
              <div className="absolute -inset-1 bg-cyan-400/30 rounded-2xl blur-sm animate-pulse"></div>
            </motion.div>
            <div>
              <p className="text-cyan-200/80 text-sm font-semibold tracking-wider">
                {t.monitoring}
              </p>
              <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-200 via-white to-purple-200 bg-clip-text text-transparent leading-tight">
                {t.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Live energy counter */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: 'spring' }}
              className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl px-4 py-2 border border-green-500/30"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-200 text-sm font-bold tracking-wider">
                  LIVE: {energySaved.toFixed(1)} kWh
                </span>
              </div>
            </motion.div>

            <motion.span
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-sm text-cyan-100 text-sm font-semibold border border-white/20 shadow-lg"
            >
              {t.system}
            </motion.span>
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-sm text-purple-100 text-sm font-semibold border border-white/20 shadow-lg"
            >
              {t.location}
            </motion.span>
          </div>
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.8, type: 'spring', delay: 0.3 }}
          className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl flex-1 p-8 flex gap-8 relative overflow-hidden"
        >
          {/* Soft background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, #00f5d4 0%, transparent 50%),
                              radial-gradient(circle at 75% 75%, #ff006e 0%, transparent 50%)`,
                backgroundSize: '400px 400px',
              }}
            ></div>
          </div>

          {/* Chart section */}
          <div className="flex-[0.7] flex flex-col relative z-10">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="text-cyan-100/80 text-sm mb-6 font-medium leading-relaxed"
            >
              {t.description}
            </motion.p>

            {/* Active bar indicator */}
            <AnimatePresence>
              {activeBar && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="mb-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-200 font-semibold text-sm">
                      {activeBar.label} • {chartData.datasets[activeBar.datasetIndex].label}
                    </span>
                    <span className="text-white font-bold text-lg">
                      {activeBar.value} kWh
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 min-h-0 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-2xl backdrop-blur-sm border border-white/10 shadow-inner"></div>
              <Bar ref={chartRef} data={enhancedChartData} options={chartOptions} />
            </div>
          </div>

          {/* Right-side info */}
          <div className="flex-[0.3] flex flex-col gap-6 relative z-10">
            {/* ====== FIX #2: clearer text in right-side cards (only text classes changed) ====== */}
            {/* Total energy card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-xl rounded-3xl p-6 border border-cyan-400/30 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 w-8 h-8 bg-cyan-400/20 rounded-full animate-pulse"></div>
              <p className="text-cyan-50/90 text-sm font-semibold mb-2 drop-shadow-[0_1px_0_rgba(0,0,0,0.6)]">
                {t.total}
              </p>
              <p className="text-5xl font-black text-white leading-tight mb-3 drop-shadow-[0_1.5px_0_rgba(0,0,0,0.55)]">
                3.88 MWh
              </p>
              <p className="text-cyan-100/80 text-xs leading-relaxed">{t.expected}</p>

              {/* Progress */}
              <div className="mt-4 bg-white/10 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '78%' }}
                  transition={{ delay: 1.5, duration: 2, type: 'spring' }}
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-lg"
                ></motion.div>
              </div>
            </motion.div>

            {/* Best months card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-3xl p-6 border border-purple-400/30 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 w-8 h-8 bg-purple-400/20 rounded-full animate-pulse delay-500"></div>
              <p className="text-purple-50/90 text-sm font-semibold mb-4 drop-shadow-[0_1px_0_rgba(0,0,0,0.55)]">
                {t.bestMonths}
              </p>
              <ul className="space-y-3">
                {[
                  { month: t.monthsShort.Jun, value: 480, color: '#00f5d4' },
                  { month: t.monthsShort.Jul, value: 500, color: '#00bbf9' },
                  { month: t.monthsShort.Aug, value: 470, color: '#ff006e' },
                ].map((item, index) => (
                  <motion.li
                    key={item.month}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4 + index * 0.1 }}
                    className="flex items-center justify-between text-white"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full animate-pulse"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="font-semibold text-base drop-shadow-[0_1px_0_rgba(0,0,0,0.6)]">
                        {item.month}
                      </span>
                    </div>
                    <span className="font-extrabold text-2xl drop-shadow-[0_1px_0_rgba(0,0,0,0.6)]">
                      {item.value} kWh
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Note card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-3xl p-6 border border-blue-400/30 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 w-8 h-8 bg-blue-400/20 rounded-full animate-pulse delay-1000"></div>
              <p className="text-blue-50/90 text-sm font-semibold mb-3 drop-shadow-[0_1px_0_rgba(0,0,0,0.55)]">
                {t.noteTitle}
              </p>
              <p className="text-blue-50/85 text-sm leading-relaxed drop-shadow-[0_1px_0_rgba(0,0,0,0.5)]">
                {t.note}
              </p>

              {/* Decorative */}
              <div className="absolute bottom-2 left-2 text-4xl opacity-20">⚡</div>
              <div className="absolute top-2 right-2 text-2xl opacity-20">🌞</div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes float-cosmic {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0.7;
          }
          25% {
            transform: translate(100px, -50px) rotate(90deg);
            opacity: 1;
          }
          50% {
            transform: translate(50px, -100px) rotate(180deg);
            opacity: 0.7;
          }
          75% {
            transform: translate(-50px, -50px) rotate(270deg);
            opacity: 1;
          }
        }
        @keyframes float-orb-1 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(50px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-30px, 40px) scale(0.9);
          }
        }
        @keyframes float-orb-2 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-60px, 20px) scale(1.2);
          }
          66% {
            transform: translate(40px, -40px) scale(0.8);
          }
        }
        @keyframes float-orb-3 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -60px) scale(1.15);
          }
          66% {
            transform: translate(-20px, 30px) scale(0.85);
          }
        }
        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
        .animate-float-cosmic {
          animation: float-cosmic 60s ease-in-out infinite;
        }
        .animate-float-orb-1 {
          animation: float-orb-1 25s ease-in-out infinite;
        }
        .animate-float-orb-2 {
          animation: float-orb-2 30s ease-in-out infinite;
        }
        .animate-float-orb-3 {
          animation: float-orb-3 35s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
