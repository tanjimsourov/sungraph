// Page: SolarMonthlyPage
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

// ... (previous types and translations remain the same)

type TranslationShape = {
  monitoring: string;
  title: string;
  system: string;
  location: string;
  description: string;
  total: string;
  expected: string;
  bestMonths: string;
  noteTitle: string;
  note: string;
  monthsShort: {
    Jun: string;
    Jul: string;
    Aug: string;
  };
};

const baseTranslations = {
  en: {
    monitoring: 'Solar Monitoring',
    title: 'Solar Panel Yield Per Month (kWh)',
    system: 'System: 3.3 kWp',
    location: 'Location: NL',
    description: 'Compare the monthly yield of this year with last year. Peaks in May–July show summer production.',
    total: 'Total 2024',
    expected: 'Expected annual yield based on current months.',
    bestMonths: 'Best Months',
    noteTitle: 'Note',
    note: 'With an east/west arrangement, peaks will be flatter but the spread throughout the day is better.',
    monthsShort: { Jun: 'Jun', Jul: 'Jul', Aug: 'Aug' },
  },
  nl: {
    monitoring: 'Solar Monitoring',
    title: 'Opbrengst Zonnepanelen Per Maand (kWh)',
    system: 'Systeem: 3.3 kWp',
    location: 'Locatie: NL',
    description: 'Vergelijk de maandelijkse opbrengst van dit jaar met vorig jaar. Pieken in mei–juli laten zomerse productie zien.',
    total: 'Totaal 2024',
    expected: 'Verwachte jaaropbrengst op basis van huidige maanden.',
    bestMonths: 'Beste Maanden',
    noteTitle: 'Opmerking',
    note: 'Bij oost/west-opstelling zullen pieken wat vlakker zijn maar spreiding over de dag is beter.',
    monthsShort: { Jun: 'Jun', Jul: 'Jul', Aug: 'Aug' },
  },
};

type LangKey = keyof typeof baseTranslations;

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export interface SolarMonthlyPageProps {
  width?: number;
  height?: number;
  lang?: LangKey;
  texts?: Partial<Record<LangKey, DeepPartial<TranslationShape>>>;
  apiConfig?: {
    enabled: boolean;
    endpoint: string;
  };
}

// Helper to merge translations
function mergeLang(
  base: TranslationShape,
  override?: DeepPartial<TranslationShape>
): TranslationShape {
  if (!override) return base;
  
  return {
    ...base,
    ...override,
    monthsShort: { ...base.monthsShort, ...(override.monthsShort ?? {}) }
  };
}

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

const SolarMonthlyPage: React.FC<SolarMonthlyPageProps> = ({
  width,
  height,
  lang,
  texts,
  apiConfig = {
    enabled: false,
    endpoint: "",
  },
}) => {
  // Language detection
  let autoLang: LangKey = "nl";
  if (
    typeof navigator !== "undefined" &&
    navigator.language &&
    navigator.language.toLowerCase().startsWith("en")
  ) {
    autoLang = "en";
  }

  const activeLang: LangKey = lang && (lang === "nl" || lang === "en") ? lang : autoLang;

  const base = baseTranslations[activeLang];
  const overrides = (texts?.[activeLang] ?? {}) as DeepPartial<TranslationShape>;
  const t = mergeLang(base, overrides);

  // Local state for chart data
  const [chartData, setChartData] = useState(solarMonthlyData);
  const [isVisible, setIsVisible] = useState(false);
  const [activeBar, setActiveBar] = useState<any>(null);
  const [energySaved, setEnergySaved] = useState(0);
  const [containerSize, setContainerSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');
  
  // FIXED: Properly typed chart ref
  const chartRef = useRef<ChartJS<"bar", number[], string>>(null);

  // Determine size based on container dimensions
  useEffect(() => {
    const updateSize = () => {
      const containerWidth = width || window.innerWidth;
      const containerHeight = height || window.innerHeight;
      
      const minDimension = Math.min(containerWidth, containerHeight);
      
      if (minDimension < 600) {
        setContainerSize('sm');
      } else if (minDimension < 900) {
        setContainerSize('md');
      } else if (minDimension < 1200) {
        setContainerSize('lg');
      } else {
        setContainerSize('xl');
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [width, height]);

  // Text size mapping - Same as other dashboards
  const textSizeMap = {
    sm: {
      title: 'text-xl lg:text-2xl',
      subtitle: 'text-xs lg:text-sm',
      cardTitle: 'text-sm lg:text-base',
      cardSubtitle: 'text-xs',
      body: 'text-xs lg:text-sm',
      small: 'text-xs',
      kpi: 'text-xs',
      metric: 'text-base lg:text-lg',
      largeMetric: 'text-xl lg:text-2xl'
    },
    md: {
      title: 'text-2xl lg:text-3xl',
      subtitle: 'text-sm lg:text-base',
      cardTitle: 'text-base lg:text-lg',
      cardSubtitle: 'text-xs lg:text-sm',
      body: 'text-sm lg:text-base',
      small: 'text-xs lg:text-sm',
      kpi: 'text-sm',
      metric: 'text-lg lg:text-xl',
      largeMetric: 'text-2xl lg:text-3xl'
    },
    lg: {
      title: 'text-3xl lg:text-4xl',
      subtitle: 'text-base lg:text-lg',
      cardTitle: 'text-lg lg:text-xl',
      cardSubtitle: 'text-sm lg:text-base',
      body: 'text-base lg:text-lg',
      small: 'text-sm lg:text-base',
      kpi: 'text-base',
      metric: 'text-xl lg:text-2xl',
      largeMetric: 'text-3xl lg:text-4xl'
    },
    xl: {
      title: 'text-4xl lg:text-5xl',
      subtitle: 'text-lg lg:text-xl',
      cardTitle: 'text-xl lg:text-2xl',
      cardSubtitle: 'text-base lg:text-lg',
      body: 'text-lg lg:text-xl',
      small: 'text-base lg:text-lg',
      kpi: 'text-lg',
      metric: 'text-2xl lg:text-3xl',
      largeMetric: 'text-4xl lg:text-5xl'
    }
  };

  const currentTextSize = textSizeMap[containerSize];

  // Load data from API on mount
  useEffect(() => {
    if (apiConfig.enabled && apiConfig.endpoint) {
      console.log('Fetching solar data from:', apiConfig.endpoint);
    }

    let cancelled = false;
    fetchMonthlyData().then((d) => {
      if (!cancelled) setChartData(d);
    });
    return () => {
      cancelled = true;
    };
  }, [apiConfig.enabled, apiConfig.endpoint]);

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
        backgroundColor: (context: any) => {
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
        hoverBackgroundColor: (context: any) => {
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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeOutElastic',
      delay: (context: any) => context.dataIndex * 100 + context.datasetIndex * 200,
    },
    interaction: { intersect: false, mode: 'index' },
    onHover: (event: any, elements: any) => {
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
          color: '#E6F3FF',
          usePointStyle: true,
          padding: 20,
          generateLabels: (chart: any) => {
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
          label: (ctx: any) => ` ${ctx.dataset.label}: ${ctx.parsed.y} kWh`,
          labelColor: (ctx: any) => {
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
    <div 
      className="w-full h-full flex flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 relative"
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
        maxWidth: width,
        maxHeight: height,
      }}
    >
      {/* Animated cosmic background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, ${
                ['#00f5d4', '#00bbf9', '#ff006e', '#ffbe0b'][i % 4]
              } 0%, transparent 70%)`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 15 + Math.random() * 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Large floating orbs */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      {/* Main Content - Fixed height to prevent scrolling */}
      <div className="w-full h-full flex flex-col gap-2 lg:gap-3 relative z-10 py-3 lg:py-4 px-3 lg:px-6">
        {/* Header */}
        <motion.header 
          className="relative z-10 w-full flex flex-col lg:flex-row items-start justify-between gap-3 lg:gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex-1 w-full lg:w-auto">
            <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
              {/* Logo */}
              <motion.div
                className={`${containerSize === 'sm' ? 'w-8 h-8' : containerSize === 'md' ? 'w-10 h-10' : containerSize === 'lg' ? 'w-12 h-12' : 'w-14 h-14'} bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-white text-lg">⚡</div>
              </motion.div>
              <div className="flex-1 min-w-0">
                <motion.h1 
                  className={`font-bold bg-gradient-to-r from-cyan-300 via-white to-purple-300 bg-clip-text text-transparent leading-tight ${currentTextSize.title} truncate`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {t.title}
                </motion.h1>
                <motion.p 
                  className={`text-cyan-200 mt-1 font-light ${currentTextSize.subtitle} truncate`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {t.monitoring}
                </motion.p>
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="flex gap-2 lg:gap-3 flex-wrap">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="px-3 lg:px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm text-cyan-100 text-sm font-semibold border border-white/20 shadow-lg"
            >
              {t.system}
            </motion.span>
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="px-3 lg:px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm text-purple-100 text-sm font-semibold border border-white/20 shadow-lg"
            >
              {t.location}
            </motion.span>
            {/* Live energy counter */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: 'spring' }}
              className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl px-3 lg:px-4 py-2 border border-green-500/30"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-200 text-sm font-bold tracking-wider">
                  LIVE: {energySaved.toFixed(1)} kWh
                </span>
              </div>
            </motion.div>
          </div>
        </motion.header>

        {/* Main Content Area */}
        <main className="relative z-10 flex-1 w-full overflow-hidden min-h-0">
          <div className="w-full h-full grid grid-cols-1 xl:grid-cols-3 gap-2 lg:gap-4 xl:gap-6" style={{ height: '100%' }}>
            
            {/* Left Column - Chart */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl border border-white/60 shadow-lg p-3 lg:p-4 flex flex-col min-h-0 xl:col-span-2"
              style={{ height: '100%' }}
            >
              <div className="mb-2 lg:mb-3 flex-shrink-0">
                <p className={`text-cyan-700 leading-relaxed font-medium flex-1 ${currentTextSize.body}`}>
                  {t.description}
                </p>
              </div>

              {/* Active bar indicator */}
              <AnimatePresence>
                {activeBar && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="mb-2 lg:mb-3 bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/70"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold text-cyan-800 ${currentTextSize.small}`}>
                        {activeBar.label} • {chartData.datasets[activeBar.datasetIndex].label}
                      </span>
                      <span className={`font-bold text-cyan-900 ${currentTextSize.metric}`}>
                        {activeBar.value} kWh
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex-1 min-h-0 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-xl backdrop-blur-sm border border-white/10"></div>
                {/* FIXED: Properly typed chart ref */}
                <Bar ref={chartRef} data={enhancedChartData} options={chartOptions} />
              </div>
            </motion.div>

            {/* Right Column - Info Cards */}
            <div className="flex flex-col gap-2 lg:gap-3 xl:gap-4 min-h-0" style={{ height: '100%' }}>
              
              {/* Total energy card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-xl rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-cyan-400/30 shadow-lg relative overflow-hidden flex-1 flex flex-col"
              >
                <div className="flex-shrink-0">
                  <p className={`text-cyan-50/90 font-semibold mb-2 ${currentTextSize.cardTitle}`}>
                    {t.total}
                  </p>
                  <p className={`font-black text-white leading-tight mb-2 ${currentTextSize.largeMetric}`}>
                    3.88 MWh
                  </p>
                  <p className={`text-cyan-100/80 leading-relaxed ${currentTextSize.small}`}>
                    {t.expected}
                  </p>
                </div>

                {/* Progress */}
                <div className="mt-3 bg-white/10 rounded-full h-2 flex-shrink-0">
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
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-purple-400/30 shadow-lg relative overflow-hidden flex-1 flex flex-col"
              >
                <div className="flex-shrink-0">
                  <p className={`text-purple-50/90 font-semibold mb-3 ${currentTextSize.cardTitle}`}>
                    {t.bestMonths}
                  </p>
                </div>
                <div className="flex-1 space-y-2 min-h-0">
                  {[
                    { month: t.monthsShort.Jun, value: 480, color: '#00f5d4' },
                    { month: t.monthsShort.Jul, value: 500, color: '#00bbf9' },
                    { month: t.monthsShort.Aug, value: 470, color: '#ff006e' },
                  ].map((item, index) => (
                    <motion.div
                      key={item.month}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1 + index * 0.1 }}
                      className="flex items-center justify-between text-white"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full animate-pulse"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className={`font-semibold ${currentTextSize.body}`}>
                          {item.month}
                        </span>
                      </div>
                      <span className={`font-extrabold ${currentTextSize.metric}`}>
                        {item.value} kWh
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Note card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 }}
                className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-blue-400/30 shadow-lg relative overflow-hidden flex-1 flex flex-col"
              >
                <div className="flex-shrink-0">
                  <p className={`text-blue-50/90 font-semibold mb-2 ${currentTextSize.cardTitle}`}>
                    {t.noteTitle}
                  </p>
                </div>
                <p className={`text-blue-50/85 leading-relaxed flex-1 ${currentTextSize.body}`}>
                  {t.note}
                </p>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SolarMonthlyPage;