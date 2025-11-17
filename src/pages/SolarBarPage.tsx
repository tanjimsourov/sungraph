// Page: SolarBarPage
// Description:
//   Displays a bar chart comparing monthly solar yield percentages across years.  Includes
//   Dutch and English translations and loads data from an external module with optional
//   API fallback.

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
import solarBarData from '../data/solarBarData';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Translation dictionaries
type TranslationShape = {
  title: string;
  subtitle: string;
};

const baseTranslations = {
  en: {
    title: 'Solar Panel Yield Per Month',
    subtitle: '(as % of the total annual yield) · 2015 – 2022',
  },
  nl: {
    title: 'Opbrengst Zonnepanelen Per Maand',
    subtitle: '(als % van de totale jaaropbrengst) · 2015 – 2022',
  },
};

type LangKey = keyof typeof baseTranslations;

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export interface SolarBarPageProps {
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
  return { ...base, ...override };
}

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

const SolarBarPage: React.FC<SolarBarPageProps> = ({
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

  const [data, setData] = useState(solarBarData);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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

  // Load data from API
  useEffect(() => {
    if (apiConfig.enabled && apiConfig.endpoint) {
      console.log('Fetching solar bar data from:', apiConfig.endpoint);
    }

    let cancelled = false;
    fetchBarData().then((d) => {
      if (!cancelled) setData(d);
    });
    return () => {
      cancelled = true;
    };
  }, [apiConfig.enabled, apiConfig.endpoint]);

  // Animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // 2025 Modern chart options with advanced animations
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeOutElastic',
      delay: (context: any) => context.dataIndex * 100,
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: { 
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 25,
          font: {
            size: 11,
            family: "'Geist', 'Inter', sans-serif",
            weight: '500'
          },
          color: 'rgba(15, 23, 42, 0.8)',
        },
        onHover: (e: any) => {
          e.native.target.style.cursor = 'pointer';
        },
        onLeave: (e: any) => {
          e.native.target.style.cursor = 'default';
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        padding: 16,
        cornerRadius: 12,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        titleFont: {
          family: "'Geist', 'Inter', sans-serif",
          size: 12,
          weight: '600'
        },
        bodyFont: {
          family: "'Geist', 'Inter', sans-serif",
          size: 11,
          weight: '500'
        },
        callbacks: { 
          label: (ctx: any) => `${ctx.dataset.label}: ${ctx.parsed.y}%`,
          title: (items: any) => `📅 ${items[0].label}`,
          labelTextColor: () => '#f8fafc',
        },
        displayColors: true,
        boxPadding: 6,
        usePointStyle: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { 
          callback: (v: any) => v + '%',
          font: {
            family: "'Geist', 'Inter', sans-serif",
            size: 10,
            weight: '500'
          },
          color: 'rgba(15, 23, 42, 0.6)',
          padding: 8,
        },
        grid: { 
          color: 'rgba(15, 23, 42, 0.03)',
          drawBorder: false,
          lineWidth: 1,
        },
        border: {
          dash: [4, 4],
        }
      },
      x: { 
        grid: { 
          display: false,
        },
        ticks: {
          font: {
            family: "'Geist', 'Inter', sans-serif",
            size: 10,
            weight: '500'
          },
          color: 'rgba(15, 23, 42, 0.7)',
        },
        border: {
          dash: [4, 4],
        }
      },
    },
    elements: {
      bar: {
        borderRadius: {
          topLeft: 12,
          topRight: 12,
          bottomLeft: 4,
          bottomRight: 4,
        },
        borderSkipped: false,
        borderWidth: 0,
        hoverBorderWidth: 2,
      }
    }
  };

  // Enhanced data with 2025 gradient system
  const enhancedData = {
    ...data,
    datasets: data.datasets.map((dataset, index) => {
      const colors = [
        ['#0061ff', '#60efff'], // Cyber Blue
        ['#ff1b6b', '#ff8e38'], // Neon Pink-Orange
        ['#40c9ff', '#e81cff'], // Electric Blue-Pink
        ['#f7ff00', '#db36a4'], // Neon Yellow-Pink
        ['#00ff87', '#60efff'], // Mint to Cyan
        ['#ff0f7b', '#f89b29'], // Hot Pink-Orange
        ['#00ffd1', '#00b3ff'], // Aqua to Blue
        ['#ff00cc', '#333399']  // Purple to Deep Blue
      ];
      
      const [color1, color2] = colors[index % colors.length];
      
      return {
        ...dataset,
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return color1;
          
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, color1);
          gradient.addColorStop(0.7, color2);
          gradient.addColorStop(1, color2);
          return gradient;
        },
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 0,
        hoverBackgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return color1;
          
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, `${color1}DD`);
          gradient.addColorStop(0.7, `${color2}DD`);
          gradient.addColorStop(1, `${color2}DD`);
          return gradient;
        },
        hoverBorderColor: 'rgba(255, 255, 255, 0.4)',
        hoverBorderWidth: 2,
        barPercentage: 0.75,
        categoryPercentage: 0.8,
      };
    })
  };

  return (
    <div 
      className="w-full h-full flex flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative"
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
        maxWidth: width,
        maxHeight: height,
      }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10"
            style={{
              width: Math.random() * 80 + 20,
              height: Math.random() * 80 + 20,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.1, 0.3, 0.1],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 15 + Math.random() * 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="w-full h-full flex flex-col gap-2 lg:gap-3 relative z-10 py-3 lg:py-4 px-3 lg:px-6">
        {/* Header */}
        <motion.header 
          className="relative z-10 w-full text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className={`font-bold bg-gradient-to-r from-cyan-300 via-white to-purple-300 bg-clip-text text-transparent mb-2 ${currentTextSize.title}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {t.title}
          </motion.h1>
          <motion.p 
            className={`text-cyan-200 font-light ${currentTextSize.subtitle}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {t.subtitle}
          </motion.p>
        </motion.header>

        {/* Chart Container */}
        <main className="relative z-10 flex-1 w-full overflow-hidden min-h-0">
          <motion.div
            className={`w-full h-full bg-white/90 backdrop-blur-lg rounded-xl lg:rounded-2xl border border-white/60 shadow-lg p-3 lg:p-4 flex flex-col transition-all duration-300 ${
              isHovered ? 'shadow-cyan-500/10' : 'shadow-blue-500/5'
            }`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Glass morphism border glow */}
            <div className="absolute inset-0 rounded-xl lg:rounded-2xl bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
            
            {/* Animated corner accents */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400/50 rounded-tl-lg" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-purple-400/50 rounded-tr-lg" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-blue-400/50 rounded-bl-lg" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-green-400/50 rounded-br-lg" />

            {/* Chart */}
            <div className="flex-1 min-h-0 relative rounded-lg overflow-hidden bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm border border-white/30">
              {/* Inner glow */}
              <div className="absolute inset-0 rounded-lg shadow-[inset_0_2px_20px_rgba(120,119,198,0.1)] pointer-events-none" />
              
              {/* Animated grid pattern overlay */}
              <div 
                className="absolute inset-0 opacity-[0.02]"
                style={{
                  backgroundImage: `
                    linear-gradient(90deg, transparent 95%, #0061ff 100%),
                    linear-gradient(180deg, transparent 95%, #0061ff 100%)
                  `,
                  backgroundSize: '20px 20px',
                }}
              />
              
              <Bar data={enhancedData} options={barOptions} />
            </div>

            {/* Footer */}
            <motion.div 
              className="mt-2 lg:mt-3 flex items-center justify-between flex-wrap gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 bg-white/60 rounded-full border border-white/40 shadow-sm">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full animate-pulse" />
                  <span className={`text-slate-700 font-medium tracking-wide ${currentTextSize.small}`}>
                    {activeLang === 'en' ? 'LIVE DATA' : 'LIVE DATA'}
                  </span>
                </div>
                
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 h-2 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"
                      animate={{
                        scaleY: [1, 1.8, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="text-right">
                <div className={`text-slate-500 font-mono tracking-wide bg-white/30 rounded-full px-2 py-1 border border-white/20 ${currentTextSize.small}`}>
                  {new Date().getFullYear()} • SOLAR ANALYTICS
                </div>
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>

      {/* Floating UI elements */}
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1.1, 0.9, 1.1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
      />
    </div>
  );
};

export default SolarBarPage;