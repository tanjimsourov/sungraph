// pages/SolarLinePage.tsx
import React, { useEffect, useState, useRef } from 'react';
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
import { motion, AnimatePresence } from 'framer-motion';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

// Dummy data structure
const solarLineData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'gemiddeld',
      data: [5.2, 7.8, 12.4, 15.6, 18.2, 19.8, 20.1, 18.7, 15.3, 10.8, 6.4, 4.2],
    },
    {
      label: 'minimum',
      data: [3.1, 5.2, 9.8, 12.4, 15.1, 16.8, 17.2, 15.9, 12.8, 8.6, 4.9, 2.8],
    },
    {
      label: 'maximum',
      data: [7.8, 10.5, 15.2, 18.9, 21.4, 22.8, 23.5, 21.8, 18.2, 13.4, 8.9, 6.1],
    },
  ],
};

// Translation dictionaries
const baseTranslations = {
  en: {
    title: 'Solar Panel Yield Analysis',
    subtitle: 'Monthly performance as percentage of annual total (2015-2022)',
    datasetLabels: {
      gemiddeld: 'Average',
      minimum: 'Minimum', 
      maximum: 'Maximum',
    },
    kpis: {
      currentMonth: 'Current Month',
      averageYield: 'Average Yield',
      peakPerformance: 'Peak Performance',
    },
    info: {
      description: 'Comprehensive analysis of solar panel performance across different weather conditions and seasons.',
      analyticsChip: '• Advanced Analytics',
      trendChip: '• Trend Analysis',
    }
  },
  nl: {
    title: 'Zonnepaneel Opbrengst Analyse',
    subtitle: 'Maandelijkse prestatie als percentage van jaarlijks totaal (2015-2022)',
    datasetLabels: {
      gemiddeld: 'Gemiddeld',
      minimum: 'Minimum',
      maximum: 'Maximum',
    },
    kpis: {
      currentMonth: 'Huidige Maand',
      averageYield: 'Gemiddelde Opbrengst',
      peakPerformance: 'Piek Prestatie',
    },
    info: {
      description: 'Uitgebreide analyse van zonnepaneel prestaties onder verschillende weersomstandigheden en seizoenen.',
      analyticsChip: '• Geavanceerde Analyse',
      trendChip: '• Trend Analyse',
    }
  },
};

type LangKey = keyof typeof baseTranslations;
type TranslationShape = (typeof baseTranslations)["en"];

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export interface SolarLinePageProps {
  width?: number;
  height?: number;
  lang?: LangKey;
  texts?: Partial<Record<LangKey, DeepPartial<TranslationShape>>>;
  apiConfig?: {
    enabled: boolean;
    endpoint: string;
  };
}

// Helper to merge base + overrides
function mergeLang(
  base: TranslationShape,
  override?: DeepPartial<TranslationShape>
): TranslationShape {
  if (!override) return base;
  return {
    ...base,
    ...override,
    datasetLabels: { ...base.datasetLabels, ...(override.datasetLabels ?? {}) },
    kpis: { ...base.kpis, ...(override.kpis ?? {}) },
    info: { ...base.info, ...(override.info ?? {}) },
  };
}

// Fetch line data from API
async function fetchLineData(endpoint: string) {
  try {
    const res = await fetch(endpoint);
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

const SolarLinePage: React.FC<SolarLinePageProps> = ({
  width,
  height,
  lang,
  texts,
  apiConfig = {
    enabled: false,
    endpoint: "",
  },
}) => {
  const [data, setData] = useState(solarLineData);
  const [isVisible, setIsVisible] = useState(false);
  const [containerSize, setContainerSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');
  const [isHovered, setIsHovered] = useState(false);
  const [activePoint, setActivePoint] = useState<{ datasetIndex: number; index: number; value: number } | null>(null);
  const chartRef = useRef<ChartJS<'line'>>(null);

  // Determine language
  let autoLang: LangKey = "nl";
  if (typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("en")) {
    autoLang = "en";
  }
  const activeLang: LangKey = lang && (lang === "nl" || lang === "en") ? lang : autoLang;
  const base = baseTranslations[activeLang];
  const overrides = (texts?.[activeLang] ?? {}) as DeepPartial<TranslationShape>;
  const t = mergeLang(base, overrides);

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

  // Load data from API once on mount
  useEffect(() => {
    let cancelled = false;
    if (apiConfig.enabled && apiConfig.endpoint) {
      fetchLineData(apiConfig.endpoint).then((d) => {
        if (!cancelled) setData(d);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [apiConfig.enabled, apiConfig.endpoint]);

  // Animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Enhanced hover effects
  const handleHover = (event: any, chartElements: any[]) => {
    if (chartElements && chartElements.length > 0) {
      const point = chartElements[0];
      setActivePoint({
        datasetIndex: point.datasetIndex,
        index: point.index,
        value: point.element.$context.parsed.y
      });
    } else {
      setActivePoint(null);
    }
  };

  // Translate dataset labels when rendering
  const translatedData = {
    labels: data.labels,
    datasets: data.datasets.map((ds, index) => {
      // Define gradient colors for each line with glow effects
      const lineColors = [
        { 
          main: '#0066ff', 
          light: '#00f2fe', 
          glow: '#0066ff40',
          gradient: ['#0066ff25', '#00f2fe05'],
          shadow: '0 0 20px #0066ff40'
        }, // Average - Electric Blue
        { 
          main: '#ff2b6b', 
          light: '#ff8e38', 
          glow: '#ff2b6b40',
          gradient: ['#ff2b6b25', '#ff8e3805'],
          shadow: '0 0 20px #ff2b6b40'
        }, // Minimum - Neon Pink-Orange
        { 
          main: '#00ff95', 
          light: '#00e4ff', 
          glow: '#00ff9540',
          gradient: ['#00ff9525', '#00e4ff05'],
          shadow: '0 0 20px #00ff9540'
        }, // Maximum - Mint to Cyan
      ];
      
      const colors = lineColors[index % lineColors.length];
      
      return {
        ...ds,
        label: t.datasetLabels[ds.label as keyof typeof t.datasetLabels] || ds.label,
        borderColor: colors.main,
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return colors.main;
          
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, colors.gradient[0]);
          gradient.addColorStop(1, colors.gradient[1]);
          return gradient;
        },
        pointBackgroundColor: colors.main,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 3,
        pointRadius: containerSize === 'sm' ? 4 : containerSize === 'md' ? 6 : 8,
        pointHoverRadius: containerSize === 'sm' ? 8 : containerSize === 'md' ? 10 : 14,
        pointHoverBackgroundColor: colors.light,
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 4,
        borderWidth: containerSize === 'sm' ? 3 : containerSize === 'md' ? 4 : 5,
        tension: 0.4,
        fill: true,
        cubicInterpolationMode: 'monotone',
        pointStyle: 'circle',
        pointHitRadius: 20,
        hoverBackgroundColor: colors.light,
        hoverBorderColor: '#ffffff',
        hoverBorderWidth: 4,
      };
    }),
  };

  // Enhanced line chart options with responsive scaling
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2500,
      easing: 'easeOutElastic',
      delay: (context: any) => {
        return context.dataIndex * 80 + context.datasetIndex * 400;
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    onHover: (event: any, elements: any[]) => {
      handleHover(event, elements);
    },
    plugins: {
      legend: {
        position: containerSize === 'sm' ? 'top' : 'right',
        labels: { 
          usePointStyle: true, 
          boxWidth: containerSize === 'sm' ? 8 : 12,
          padding: containerSize === 'sm' ? 15 : 25,
          font: {
            size: containerSize === 'sm' ? 11 : containerSize === 'md' ? 12 : 13,
            family: "'Geist', 'Inter', sans-serif",
            weight: '600'
          },
          color: 'rgba(15, 23, 42, 0.9)',
          generateLabels: (chart: any) => {
            const original = ChartJS.defaults.plugins.legend.labels.generateLabels;
            const labels = original(chart);
            return labels.map(label => ({
              ...label,
              pointStyle: 'rectRounded',
              borderRadius: 6,
            }));
          }
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.98)',
        padding: containerSize === 'sm' ? 12 : 18,
        cornerRadius: 16,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        titleFont: {
          family: "'Geist', 'Inter', sans-serif",
          size: containerSize === 'sm' ? 11 : containerSize === 'md' ? 12 : 13,
          weight: '700'
        },
        bodyFont: {
          family: "'Geist', 'Inter', sans-serif",
          size: containerSize === 'sm' ? 10 : containerSize === 'md' ? 11 : 12,
          weight: '600'
        },
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y;
            const icons = ['📊', '📉', '📈'];
            return `${icons[context.datasetIndex]} ${context.dataset.label}: ${value}%`;
          },
          labelTextColor: (context: any) => {
            const colors = ['#0066ff', '#ff2b6b', '#00ff95'];
            return colors[context.datasetIndex];
          },
          labelColor: (context: any) => {
            const colors = ['#0066ff', '#ff2b6b', '#00ff95'];
            return {
              borderColor: colors[context.datasetIndex],
              backgroundColor: colors[context.datasetIndex] + '20',
              borderWidth: 2,
              borderRadius: 6,
            };
          }
        },
        displayColors: true,
        boxPadding: 8,
        usePointStyle: true,
        bodySpacing: 8,
        titleSpacing: 6,
        footerSpacing: 6,
        animation: {
          duration: 300,
          easing: 'easeOutQuart'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { 
          color: 'rgba(15, 23, 42, 0.04)',
          drawBorder: false,
          lineWidth: 1,
          drawTicks: false,
        },
        border: {
          dash: [4, 4],
          color: 'rgba(15, 23, 42, 0.1)',
        },
        ticks: { 
          callback: (v: any) => v + '%',
          max: 20, 
          stepSize: 2,
          font: {
            family: "'Geist', 'Inter', sans-serif",
            size: containerSize === 'sm' ? 9 : containerSize === 'md' ? 10 : 11,
            weight: '600'
          },
          color: 'rgba(15, 23, 42, 0.7)',
          padding: containerSize === 'sm' ? 8 : 12,
          backdropColor: 'rgba(255, 255, 255, 0.8)',
          backdropPadding: 4,
        },
      },
      x: { 
        grid: { 
          display: false,
        },
        ticks: {
          font: {
            family: "'Geist', 'Inter', sans-serif",
            size: containerSize === 'sm' ? 9 : containerSize === 'md' ? 10 : 11,
            weight: '600'
          },
          color: 'rgba(15, 23, 42, 0.8)',
          padding: containerSize === 'sm' ? 6 : 8,
        },
        border: {
          dash: [4, 4],
          color: 'rgba(15, 23, 42, 0.1)',
        }
      },
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: containerSize === 'sm' ? 3 : containerSize === 'md' ? 4 : 5,
        borderCapStyle: 'round',
        borderJoinStyle: 'round',
      },
      point: {
        radius: containerSize === 'sm' ? 4 : containerSize === 'md' ? 6 : 8,
        hoverRadius: containerSize === 'sm' ? 8 : containerSize === 'md' ? 10 : 14,
        backgroundColor: '#ffffff',
        borderWidth: 3,
        hoverBorderWidth: 4,
        hitRadius: 30,
        hoverShadowOffsetX: 0,
        hoverShadowOffsetY: 0,
        hoverShadowBlur: 15,
      }
    },
    hover: {
      animationDuration: 300,
      mode: 'index',
      intersect: false,
    },
  };

  return (
    <div 
      className="w-full h-full flex flex-col overflow-hidden relative"
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
        maxWidth: width,
        maxHeight: height,
        background: 'radial-gradient(circle at top, #0f172a 0%, #1e293b 50%, #334155 100%)',
      }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(containerSize === 'sm' ? 15 : 25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * (containerSize === 'sm' ? 60 : 120) + 30,
              height: Math.random() * (containerSize === 'sm' ? 60 : 120) + 30,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, ${
                ['#0066ff20', '#ff2b6b20', '#00ff9520'][i % 3]
              } 0%, transparent 70%)`,
              filter: 'blur(25px)',
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 10 - 5, 0],
            }}
            transition={{
              duration: 15 + Math.random() * 15,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Floating value indicator */}
      <AnimatePresence>
        {activePoint && (
          <motion.div 
            className="absolute z-50 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-xl text-white px-3 lg:px-4 py-2 lg:py-3 rounded-2xl border border-white/10 shadow-2xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              left: '50%',
              top: '15%',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="w-2 lg:w-3 h-2 lg:h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse" />
              <span className={`text-cyan-200 font-semibold ${currentTextSize.small}`}>
                {data.labels[activePoint.index]}: {activePoint.value}%
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header - Compact */}
      <motion.header 
        className="relative z-10 w-full px-3 lg:px-6 pt-3 lg:pt-4 flex flex-col items-center justify-center gap-2 lg:gap-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1 
          className={`font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent text-center tracking-tight ${currentTextSize.title}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {t.title}
        </motion.h1>
        <motion.p 
          className={`text-cyan-100/80 font-semibold tracking-wider text-center ${currentTextSize.subtitle}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {t.subtitle}
        </motion.p>
      </motion.header>

      {/* Main Chart Area - Takes most of the screen */}
      <main className="relative z-10 flex-1 w-full px-3 lg:px-6 pb-3 lg:pb-4 pt-2 lg:pt-3 overflow-hidden min-h-0">
        <motion.div
          className={`relative w-full h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-2xl lg:rounded-3xl shadow-2xl flex flex-col p-3 lg:p-4 xl:p-6 border border-cyan-500/20 ${
            isHovered ? 'shadow-cyan-500/20' : 'shadow-blue-500/10'
          }`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Chart container - Full height */}
          <div className="flex-1 min-h-0 relative rounded-xl lg:rounded-2xl overflow-hidden">
            <Line 
              ref={chartRef}
              data={translatedData} 
              options={lineOptions} 
            />
          </div>

          {/* Compact Footer */}
          <div className="mt-3 lg:mt-4 flex flex-col lg:flex-row items-center justify-between gap-2 lg:gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-2 lg:px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/30 backdrop-blur-sm">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 h-3 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"
                      animate={{ scaleY: [1, 2, 1] }}
                      transition={{ duration: 0.8, delay: i * 0.1, repeat: Infinity }}
                    />
                  ))}
                </div>
                <span className={`text-cyan-100 font-bold tracking-wider ${currentTextSize.small}`}>
                  {activeLang === 'en' ? 'LIVE' : 'LIVE'}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className={`text-cyan-100/60 font-mono font-bold tracking-widest ${currentTextSize.small}`}>
                SOLAR AI • {new Date().getFullYear()}
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default SolarLinePage;