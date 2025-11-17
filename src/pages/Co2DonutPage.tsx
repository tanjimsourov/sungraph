// src/pages/Co2DonutPage.tsx
import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { motion, AnimatePresence } from 'framer-motion';
import donutData from '../data/co2DonutData';
ChartJS.register(ArcElement, Tooltip, Legend);

// Import dummy donut data


// Translation dictionaries
const baseTranslations = {
  nl: {
    title: 'CO₂-uitstoot per jaar van een Nederlands huishouden',
    source: 'Bron: Milieu Centraal (2022)',
    centerLines: ['CO₂-uitstoot per jaar', 'van een Nederlands', 'huishouden'],
  },
  en: {
    title: 'Annual CO₂ emissions of a Dutch household',
    source: 'Source: Milieu Centraal (2022)',
    centerLines: ['Annual CO₂ emissions', 'of a Dutch', 'household'],
  },
};

const labelTranslations = {
  nl: [
    'Voeding en dranken 22%',
    'Huis energie 19%',
    'Auto, fiets, openbaar vervoer 18%',
    'Kleding en goederen 11%',
    'Vliegen 9%',
    'Huis (buiten, binnen) 8%',
    'Collectieve voorzieningen 7%',
    'Recreatie, sport, cultuur 6%',
  ],
  en: [
    'Food and drinks 22%',
    'Home energy 19%',
    'Car, bike, public transport 18%',
    'Clothing and goods 11%',
    'Flying 9%',
    'House (exterior, interior) 8%',
    'Collective facilities 7%',
    'Recreation, sport, culture 6%',
  ],
};

type LangKey = keyof typeof baseTranslations;

export interface Co2DonutPageProps {
  width?: number;
  height?: number;
  lang?: LangKey;
  apiConfig?: {
    enabled: boolean;
    endpoint: string;
  };
}

// Attempt to fetch donut data from API; fallback to local data if not available
async function fetchDonutData(endpoint: string) {
  try {
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error('network');
    const json = await res.json();
    return json;
  } catch (e) {
    return donutData;
  }
}

const Co2DonutPage: React.FC<Co2DonutPageProps> = ({
  width,
  height,
  lang,
  apiConfig = {
    enabled: false,
    endpoint: "",
  },
}) => {
  const [data, setData] = useState(donutData);
  const [containerSize, setContainerSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');

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
  const t = baseTranslations[activeLang];
  const labels = labelTranslations[activeLang];

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

  // Text size mapping based on container size
  const textSizeMap = {
    sm: {
      title: 'text-sm',
      subtitle: 'text-xs',
      centerText: 'text-[8px]',
      label: 'text-[10px]',
      legend: 'text-[9px]'
    },
    md: {
      title: 'text-base',
      subtitle: 'text-xs',
      centerText: 'text-[10px]',
      label: 'text-[11px]',
      legend: 'text-[10px]'
    },
    lg: {
      title: 'text-lg',
      subtitle: 'text-sm',
      centerText: 'text-[12px]',
      label: 'text-[13px]',
      legend: 'text-[12px]'
    },
    xl: {
      title: 'text-xl',
      subtitle: 'text-base',
      centerText: 'text-[14px]',
      label: 'text-[14px]',
      legend: 'text-[13px]'
    }
  };

  const currentTextSize = textSizeMap[containerSize];

  // Chart size mapping
  const chartSizeMap = {
    sm: { width: 200, height: 200, centerWidth: 80 },
    md: { width: 280, height: 280, centerWidth: 100 },
    lg: { width: 350, height: 350, centerWidth: 120 },
    xl: { width: 420, height: 420, centerWidth: 140 }
  };

  const currentChartSize = chartSizeMap[containerSize];

  // API data fetching
  useEffect(() => {
    let cancelled = false;
    
    const loadData = async () => {
      if (apiConfig.enabled && apiConfig.endpoint) {
        const newData = await fetchDonutData(apiConfig.endpoint);
        if (!cancelled) {
          setData(newData);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [apiConfig.enabled, apiConfig.endpoint]);

  // Chart options
  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: `${currentChartSize.centerWidth}px`,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15,23,42,0.85)',
        titleFont: {
          size: containerSize === 'sm' ? 10 : 12
        },
        bodyFont: {
          size: containerSize === 'sm' ? 9 : 11
        }
      },
    },
  };

  // Use translated labels but keep numeric data and colors
  const chartData = {
    labels: labels,
    datasets: [{
      ...data.datasets[0],
      backgroundColor: data.datasets[0].backgroundColor,
      borderWidth: 0
    }],
  };

  return (
    <div 
      className="w-full h-full bg-white overflow-hidden flex items-center justify-center p-4"
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100vh',
        maxWidth: width,
        maxHeight: height,
      }}
    >
      <motion.div 
        className="w-full h-full flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Chart block */}
        <motion.div 
          className="flex flex-col items-center lg:items-start flex-shrink-0"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-4 text-center lg:text-left">
            <motion.h1 
              className={`font-semibold text-slate-800 mb-1 ${currentTextSize.title}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {t.title}
            </motion.h1>
            <motion.p 
              className={`text-slate-500 ${currentTextSize.subtitle}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {t.source}
            </motion.p>
          </div>

          <div className="relative" style={{ width: currentChartSize.width, height: currentChartSize.height }}>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
            >
              <Doughnut data={chartData} options={donutOptions} />
            </motion.div>
            
            {/* Center text */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-semibold text-slate-800 leading-tight pointer-events-none"
              style={{ width: currentChartSize.centerWidth }}
            >
              <AnimatePresence mode="wait">
                {t.centerLines.map((line, index) => (
                  <motion.div
                    key={line}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <span className={currentTextSize.centerText}>{line}</span>
                    {index < t.centerLines.length - 1 && <br />}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Labels block */}
        <motion.div 
          className="flex-1 w-full max-w-md"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className={`grid grid-cols-1 ${containerSize === 'sm' ? 'gap-1' : 'gap-2'} ${containerSize === 'sm' ? 'max-h-48' : containerSize === 'md' ? 'max-h-56' : 'max-h-64'} overflow-y-auto`}>
            <AnimatePresence>
              {chartData.labels.map((label, idx) => (
                <motion.div
                  key={label}
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-50 transition-colors"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + idx * 0.1 }}
                  whileHover={{ 
                    scale: 1.02,
                    backgroundColor: 'rgba(248, 250, 252, 0.8)',
                    transition: { type: "spring", stiffness: 400 }
                  }}
                >
                  <motion.span
                    className="w-3 h-3 rounded-sm flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: chartData.datasets[0].backgroundColor[idx] }}
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  />
                  <span className={`text-slate-700 ${currentTextSize.legend}`}>{label}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Additional info */}
          <motion.div 
            className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <p className={`text-slate-600 ${currentTextSize.subtitle} text-center`}>
              {activeLang === 'nl' 
                ? '💡 Tip: Verminder je uitstoot door bewuste keuzes' 
                : '💡 Tip: Reduce emissions through conscious choices'
              }
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Co2DonutPage;