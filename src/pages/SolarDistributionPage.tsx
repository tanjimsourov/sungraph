// Page: SolarDistributionPage
// Description:
//   Shows the distribution of solar panel yield across the months of the year.

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
import { motion } from 'framer-motion';
import solarDistribution from '../data/solarDistributionData';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Translation dictionaries
type TranslationShape = {
  analysis: string;
  title: string;
  description: string;
  seasonsTitle: string;
  seasons: {
    summer: string;
    winter: string;
  };
  source: string;
  live: string;
  rightHeaderTitle: string;
  rightHeaderSubtitle: string;
  system: string;
  topMonths: string;
  lowMonths: string;
  months: {
    junjul: string;
    aug: string;
    mei: string;
    dec: string;
    jan: string;
    feb: string;
  };
  datasetLabel: string;
};

const baseTranslations = {
  en: {
    analysis: 'Solar Energy Analysis',
    title: 'Distribution of Solar Yield Over the Year',
    description: 'In the Netherlands solar panels generate most energy during the summer months. The distribution clearly shows the seasonal influence on yield, with peaks in June and July.',
    seasonsTitle: 'Seasonal Performance',
    seasons: { summer: 'Summer (Jun-Aug)', winter: 'Winter (Dec-Feb)' },
    source: 'Source: Sample Data',
    live: 'Live Data',
    rightHeaderTitle: 'Monthly Distribution',
    rightHeaderSubtitle: 'Percentage of total annual yield per month',
    system: '3.3 kWp System',
    topMonths: 'Top Months',
    lowMonths: 'Lowest Months',
    months: {
      junjul: 'June & July',
      aug: 'August',
      mei: 'May',
      dec: 'December',
      jan: 'January',
      feb: 'February',
    },
    datasetLabel: '% of Annual Yield',
  },
  nl: {
    analysis: 'Zonne-energie Analyse',
    title: 'Verdeling van Zonne-opbrengst over het Jaar',
    description: 'In Nederland leveren zonnepanelen in de zomermaanden het grootste deel van de energie. De verdeling toont duidelijk de seizoensinvloed op de opbrengst, met pieken in juni en juli.',
    seasonsTitle: 'Seizoensprestaties',
    seasons: { summer: 'Zomer (Jun-Aug)', winter: 'Winter (Dec-Feb)' },
    source: 'Bron: Voorbeelddata',
    live: 'Live Data',
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
    datasetLabel: '% van Jaaropbrengst',
  },
};

type LangKey = keyof typeof baseTranslations;

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export interface SolarDistributionPageProps {
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
    seasons: { ...base.seasons, ...(override.seasons ?? {}) },
    months: { ...base.months, ...(override.months ?? {}) }
  };
}

// Fetch distribution data from API; fall back to dummy data on failure.
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

const SolarDistributionPage: React.FC<SolarDistributionPageProps> = ({
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

  const [months, setMonths] = useState(solarDistribution.MONTHS);
  const [distribution, setDistribution] = useState(solarDistribution.DISTRIBUTION);
  const [containerSize, setContainerSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');

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

  // Load distribution data from API once on mount
  useEffect(() => {
    if (apiConfig.enabled && apiConfig.endpoint) {
      console.log('Fetching solar distribution data from:', apiConfig.endpoint);
    }

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
  }, [apiConfig.enabled, apiConfig.endpoint]);

  // Build chart data and options using translations and loaded data
  const chartData = {
    labels: months,
    datasets: [
      {
        label: t.datasetLabel,
        data: distribution,
        backgroundColor: (context: any) => {
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
          label: (ctx: any) => `${ctx.parsed.y}% of annual yield`,
          title: (ctx: any) => ctx[0].label,
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
          callback: (val: any) => `${val}%`,
        },
        grid: { color: 'rgba(100, 116, 139, 0.1)', drawBorder: false },
      },
    },
  };

  return (
    <div 
      className="w-full h-full flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 relative"
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
        maxWidth: width,
        maxHeight: height,
      }}
    >
      {/* Main Content */}
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
                className={`${containerSize === 'sm' ? 'w-8 h-8' : containerSize === 'md' ? 'w-10 h-10' : containerSize === 'lg' ? 'w-12 h-12' : 'w-14 h-14'} bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <svg className={`${containerSize === 'sm' ? 'w-4 h-4' : containerSize === 'md' ? 'w-5 h-5' : containerSize === 'lg' ? 'w-6 h-6' : 'w-7 h-7'} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </motion.div>
              <div className="flex-1 min-w-0">
                <motion.h1 
                  className={`font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent leading-tight ${currentTextSize.title} truncate`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {t.title}
                </motion.h1>
                <motion.p 
                  className={`text-emerald-600 mt-1 font-light ${currentTextSize.subtitle} truncate`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {t.analysis}
                </motion.p>
              </div>
            </div>
          </div>

          {/* System Info */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg border border-white/70 rounded-xl lg:rounded-2xl px-3 lg:px-4 py-2 lg:py-3 shadow-xl w-full lg:w-auto lg:min-w-[200px] xl:min-w-[240px] border-l-4 border-l-emerald-500 mt-2 lg:mt-0 lg:ml-3"
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <div className="flex items-center gap-2 lg:gap-3">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className={`${containerSize === 'sm' ? 'w-8 h-8' : containerSize === 'md' ? 'w-10 h-10' : containerSize === 'lg' ? 'w-12 h-12' : 'w-14 h-14'} bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <svg className={`${containerSize === 'sm' ? 'w-4 h-4' : containerSize === 'md' ? 'w-5 h-5' : containerSize === 'lg' ? 'w-6 h-6' : 'w-7 h-7'} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className={`text-emerald-600 font-semibold uppercase tracking-wide ${currentTextSize.small}`}>System</p>
                <motion.p 
                  className={`font-bold text-emerald-700 leading-none tracking-tight mt-1 ${currentTextSize.largeMetric}`}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {t.system}
                </motion.p>
                <motion.p 
                  className={`text-green-600 font-medium mt-1 flex items-center gap-1 ${currentTextSize.small}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
                  {t.live}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </motion.header>

        {/* Main Content Area */}
        <main className="relative z-10 flex-1 w-full overflow-hidden min-h-0">
          <div className="w-full h-full grid grid-cols-1 xl:grid-cols-3 gap-2 lg:gap-4 xl:gap-6" style={{ height: '100%' }}>
            
            {/* Left Panel - Info Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-xl lg:rounded-2xl p-4 lg:p-6 flex flex-col shadow-lg xl:col-span-1"
              style={{ height: '100%' }}
            >
              <div className="mb-3 lg:mb-4 flex-shrink-0">
                <p className={`font-bold mb-2 ${currentTextSize.cardTitle}`}>{t.rightHeaderTitle}</p>
                <p className={`text-emerald-100/80 ${currentTextSize.cardSubtitle}`}>{t.rightHeaderSubtitle}</p>
              </div>

              <p className={`text-emerald-100/90 leading-relaxed mb-4 lg:mb-6 flex-1 ${currentTextSize.body}`}>
                {t.description}
              </p>

              {/* Stats Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-4 mb-4 lg:mb-6 border border-white/20 flex-shrink-0">
                <p className={`font-semibold mb-2 ${currentTextSize.cardTitle}`}>{t.seasonsTitle}</p>
                <div className="grid grid-cols-2 gap-2 lg:gap-3">
                  <div>
                    <p className={`text-emerald-200/80 ${currentTextSize.small}`}>{t.seasons.summer}</p>
                    <p className={`font-bold text-emerald-200 ${currentTextSize.metric}`}>35%</p>
                  </div>
                  <div>
                    <p className={`text-amber-200/80 ${currentTextSize.small}`}>{t.seasons.winter}</p>
                    <p className={`font-bold text-amber-200 ${currentTextSize.metric}`}>9%</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-emerald-200/80 mt-auto flex-shrink-0">
                <span className={currentTextSize.small}>{t.source}</span>
                <div className="flex items-center gap-1 lg:gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className={currentTextSize.small}>{t.live}</span>
                </div>
              </div>
            </motion.div>

            {/* Right Panel - Chart and Info */}
            <div className="flex flex-col gap-2 lg:gap-3 xl:gap-4 min-h-0 xl:col-span-2" style={{ height: '100%' }}>
              
              {/* Chart Container */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl border border-white/60 shadow-lg p-3 lg:p-4 flex-1 flex flex-col min-h-0"
                style={{ height: '100%' }}
              >
                <div className="flex-1 min-h-0 relative">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </motion.div>

              {/* Bottom Info Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3 flex-shrink-0">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                  className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-white/60 shadow-lg"
                >
                  <div className="flex items-center gap-2 mb-2 lg:mb-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <p className={`font-bold text-slate-800 ${currentTextSize.cardTitle}`}>{t.topMonths}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={currentTextSize.small}>{t.months.junjul}</span>
                      <span className={`font-bold text-slate-800 ${currentTextSize.small}`}>
                        12% {activeLang === 'nl' ? 'elk' : 'each'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={currentTextSize.small}>{t.months.aug}</span>
                      <span className={`font-bold text-slate-800 ${currentTextSize.small}`}>11%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={currentTextSize.small}>{t.months.mei}</span>
                      <span className={`font-bold text-slate-800 ${currentTextSize.small}`}>11%</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 }}
                  className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-white/60 shadow-lg"
                >
                  <div className="flex items-center gap-2 mb-2 lg:mb-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                    <p className={`font-bold text-slate-800 ${currentTextSize.cardTitle}`}>{t.lowMonths}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={currentTextSize.small}>{t.months.dec}</span>
                      <span className={`font-bold text-slate-800 ${currentTextSize.small}`}>2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={currentTextSize.small}>{t.months.jan}</span>
                      <span className={`font-bold text-slate-800 ${currentTextSize.small}`}>3%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={currentTextSize.small}>{t.months.feb}</span>
                      <span className={`font-bold text-slate-800 ${currentTextSize.small}`}>4%</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SolarDistributionPage;