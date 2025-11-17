// Page: Solar3DVisualization
// Description: 3D-like solar panel visualization with interactive elements

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Translation dictionaries
type TranslationShape = {
  title: string;
  subtitle: string;
  systemCapacity: string;
  systemCapacityValue: string;
  roofPotential: string;
  info: {
    description: string;
    interactiveChip: string;
    simulationChip: string;
  };
  kpis: {
    roofArea: string;
    roofValue: string;
    panelCount: string;
    panelValue: string;
    annualYield: string;
    yieldValue: string;
  };
  leftCard: {
    title: string;
    subtitle: string;
    legend: {
      optimal: string;
      good: string;
      partial: string;
    };
    footer: string;
  };
  centerCard: {
    title: string;
    note: string;
  };
  rightCard: {
    title: string;
    subtitle: string;
    legend: {
      spring: string;
      summer: string;
      autumn: string;
      winter: string;
    };
    footer: string;
  };
};

const baseTranslations = {
  en: {
    title: '3D Solar Panels Visualization',
    subtitle: 'Interactive installation simulator and yield analysis',
    systemCapacity: 'System Capacity',
    systemCapacityValue: '6.4 kWp',
    roofPotential: '92% roof area utilized',
    info: {
      description: 'Interactive 3D visualization of your solar panel installation with real-time shadow analysis and yield simulation.',
      interactiveChip: '• Interactive',
      simulationChip: '• Simulation',
    },
    kpis: {
      roofArea: 'Roof area',
      roofValue: '42 m²',
      panelCount: 'Panel count',
      panelValue: '16 units',
      annualYield: 'Annual yield',
      yieldValue: '5,800 kWh',
    },
    leftCard: {
      title: 'Panel Configuration',
      subtitle: 'Optimal placement • orientation • tilt angle',
      legend: {
        optimal: 'Optimal zone',
        good: 'Good zone',
        partial: 'Partial zone',
      },
      footer: 'AI-optimized panel placement',
    },
    centerCard: {
      title: 'Live Shadow Analysis',
      note: 'Real-time shadow impact simulation',
    },
    rightCard: {
      title: 'Seasonal Performance',
      subtitle: 'Annual yield per season',
      legend: {
        spring: 'Spring',
        summer: 'Summer',
        autumn: 'Autumn',
        winter: 'Winter',
      },
      footer: 'Based on local weather data',
    },
  },
  nl: {
    title: '3D Zonnepanelen Visualisatie',
    subtitle: 'Interactieve installatie simulator en rendementsanalyse',
    systemCapacity: 'Systeem Capaciteit',
    systemCapacityValue: '6.4 kWp',
    roofPotential: '92% dakoppervlak benut',
    info: {
      description: 'Interactieve 3D visualisatie van uw zonnepanelen installatie met real-time schaduwanalyse en opbrengstsimulatie.',
      interactiveChip: '• Interactief',
      simulationChip: '• Simulatie',
    },
    kpis: {
      roofArea: 'Dakoppervlak',
      roofValue: '42 m²',
      panelCount: 'Aantal panelen',
      panelValue: '16 stuks',
      annualYield: 'Jaaropbrengst',
      yieldValue: '5.800 kWh',
    },
    leftCard: {
      title: 'Paneel Configuratie',
      subtitle: 'Optimale plaatsing • oriëntatie • hellingshoek',
      legend: {
        optimal: 'Optimale zone',
        good: 'Goede zone',
        partial: 'Gedeeltelijke zone',
      },
      footer: 'AI-geoptimaliseerde paneelplaatsing',
    },
    centerCard: {
      title: 'Live Schaduw Analyse',
      note: 'Real-time schaduwimpact simulatie',
    },
    rightCard: {
      title: 'Seizoens Prestatie',
      subtitle: 'Jaarlijkse opbrengst per seizoen',
      legend: {
        spring: 'Lente',
        summer: 'Zomer',
        autumn: 'Herfst',
        winter: 'Winter',
      },
      footer: 'Gebaseerd op lokale weersdata',
    },
  },
};

type LangKey = keyof typeof baseTranslations;

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export interface Solar3DVisualizationProps {
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
    info: { ...base.info, ...(override.info ?? {}) },
    kpis: { ...base.kpis, ...(override.kpis ?? {}) },
    leftCard: { 
      ...base.leftCard, 
      ...(override.leftCard ?? {}),
      legend: { ...base.leftCard.legend, ...(override.leftCard?.legend ?? {}) }
    },
    centerCard: { ...base.centerCard, ...(override.centerCard ?? {}) },
    rightCard: { 
      ...base.rightCard, 
      ...(override.rightCard ?? {}),
      legend: { ...base.rightCard.legend, ...(override.rightCard?.legend ?? {}) }
    },
  };
}

const SolarPanel3D = ({ isActive, index }: { isActive: boolean; index: number }) => {
  return (
    <motion.div
      className="relative w-6 h-10 lg:w-8 lg:h-12 cursor-pointer"
      animate={{ 
        rotateX: isActive ? 15 : 0,
        scale: isActive ? 1.1 : 1,
        y: isActive ? -5 : 0
      }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 rounded-md shadow-lg transform skew-y-3">
        <div className="absolute inset-0.5 bg-gradient-to-br from-gray-800 to-gray-900 rounded-sm">
          {/* Panel grid */}
          <div className="absolute inset-0.5 grid grid-cols-3 grid-rows-4 gap-0.5 p-0.5">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xs"
                animate={{ 
                  opacity: isActive ? [0.4, 0.9, 0.4] : 0.4,
                  scale: isActive ? [1, 1.1, 1] : 1
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  delay: (i + index) * 0.1,
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Reflection */}
      <motion.div
        className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-md"
        animate={{ opacity: isActive ? [0, 0.4, 0] : 0 }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </motion.div>
  );
};

const RoofVisualization = () => {
  const [timeOfDay, setTimeOfDay] = useState(0);
  const [activePanel, setActivePanel] = useState<number | null>(null);
  const [hoveredPanel, setHoveredPanel] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOfDay(prev => (prev + 1) % 100);
      setActivePanel(prev => prev === null ? 0 : (prev + 1) % 16);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const sunPosition = {
    x: 50 + 40 * Math.cos((timeOfDay / 100) * 2 * Math.PI),
    y: 50 + 30 * Math.sin((timeOfDay / 100) * 2 * Math.PI),
  };

  return (
    <div className="relative w-40 h-32 lg:w-48 lg:h-36 bg-gradient-to-br from-orange-100 to-amber-50 rounded-lg border-2 border-amber-200 overflow-hidden shadow-xl">
      {/* Animated background sky */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-sky-300 to-sky-100"
        animate={{
          background: [
            'linear-gradient(to bottom, #7DD3FC 0%, #BAE6FD 100%)',
            'linear-gradient(to bottom, #38BDF8 0%, #7DD3FC 100%)',
            'linear-gradient(to bottom, #7DD3FC 0%, #BAE6FD 100%)',
          ]
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      
      {/* Sun */}
      <motion.div
        className="absolute w-4 h-4 lg:w-5 lg:h-5 bg-yellow-400 rounded-full shadow-2xl z-10"
        style={{
          left: `${sunPosition.x}%`,
          top: `${sunPosition.y}%`,
        }}
        animate={{
          scale: [1, 1.2, 1],
          boxShadow: [
            '0 0 20px #F59E0B',
            '0 0 40px #F59E0B, 0 0 60px #FBBF24',
            '0 0 20px #F59E0B'
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      {/* Roof */}
      <div className="absolute bottom-0 left-0 right-0 h-14 lg:h-16 bg-gradient-to-br from-gray-400 to-gray-600 transform skew-y-3">
        {/* Roof tiles pattern */}
        <div className="absolute inset-0 grid grid-cols-8 gap-1 p-2">
          {Array.from({ length: 32 }).map((_, i) => (
            <motion.div
              key={i}
              className="bg-gradient-to-br from-gray-500 to-gray-700 rounded-sm"
              animate={{ opacity: [0.7, 0.9, 0.7] }}
              transition={{ duration: 4, delay: i * 0.1, repeat: Infinity }}
            />
          ))}
        </div>
        
        {/* Solar panels grid */}
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-1 p-2 lg:p-3">
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.div
              key={i}
              className="flex items-center justify-center"
              onMouseEnter={() => setHoveredPanel(i)}
              onMouseLeave={() => setHoveredPanel(null)}
            >
              <SolarPanel3D 
                isActive={i === activePanel || i === hoveredPanel} 
                index={i}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sun rays */}
      <motion.div
        className="absolute pointer-events-none z-0"
        style={{
          left: `${sunPosition.x}%`,
          top: `${sunPosition.y}%`,
        }}
        animate={{
          opacity: [0, 0.3, 0],
          scale: [1, 2, 1],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-yellow-200 rounded-full blur-xl" />
      </motion.div>
    </div>
  );
};

const SeasonWheel = () => {
  const [activeSeason, setActiveSeason] = useState(0);
  const seasons = ['spring', 'summer', 'autumn', 'winter'];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSeason(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getSeasonData = (season: string) => {
    const data: Record<string, { yield: string; color: string; icon: string }> = {
      spring: { yield: '2.1 kWh/day', color: '#10B981', icon: '🌱' },
      summer: { yield: '3.2 kWh/day', color: '#F59E0B', icon: '☀️' },
      autumn: { yield: '1.8 kWh/day', color: '#EA580C', icon: '🍂' },
      winter: { yield: '0.7 kWh/day', color: '#3B82F6', icon: '❄️' }
    };
    return data[season];
  };

  return (
    <div className="relative w-32 h-32 lg:w-36 lg:h-36">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Background circle */}
        <circle cx="100" cy="100" r="80" fill="#F3F4F6" />
        
        {/* Season segments */}
        {seasons.map((season, index) => {
          const startAngle = (index * 90) - 45;
          const endAngle = ((index + 1) * 90) - 45;
          const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
          
          const x1 = 100 + 80 * Math.cos(startAngle * Math.PI / 180);
          const y1 = 100 + 80 * Math.sin(startAngle * Math.PI / 180);
          const x2 = 100 + 80 * Math.cos(endAngle * Math.PI / 180);
          const y2 = 100 + 80 * Math.sin(endAngle * Math.PI / 180);

          const seasonData = getSeasonData(season);

          return (
            <motion.path
              key={season}
              d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
              fill={seasonData.color}
              initial={{ scale: 0.8, opacity: 0.6 }}
              animate={{ 
                scale: index === activeSeason ? 1.1 : 0.8,
                opacity: index === activeSeason ? 1 : 0.6,
              }}
              transition={{ duration: 0.5 }}
            />
          );
        })}

        {/* Rotating center */}
        <motion.circle
          cx="100"
          cy="100"
          r="35"
          fill="white"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </svg>

      {/* Season info */}
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSeason}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="text-center"
          >
            <motion.div
              className="text-lg lg:text-xl mb-1"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {getSeasonData(seasons[activeSeason]).icon}
            </motion.div>
            <div className="text-xs lg:text-sm font-bold text-gray-800 capitalize">
              {seasons[activeSeason]}
            </div>
            <div className="text-[10px] lg:text-xs text-gray-600 font-semibold">
              {getSeasonData(seasons[activeSeason]).yield}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const EfficiencyMeter = ({ efficiency = 92 }: { efficiency?: number }) => {
  return (
    <div className="relative w-20 h-20 lg:w-24 lg:h-24">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Background circle */}
        <circle cx="50" cy="50" r="45" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="2" />
        
        {/* Efficiency arc */}
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="url(#efficiencyGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="251.2"
          strokeDashoffset={251.2 - (251.2 * efficiency) / 100}
          initial={{ strokeDashoffset: 251.2 }}
          animate={{ strokeDashoffset: 251.2 - (251.2 * efficiency) / 100 }}
          transition={{ duration: 2, ease: "easeOut" }}
          transform="rotate(-90 50 50)"
        />
        
        <defs>
          <linearGradient id="efficiencyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
        
        {/* Center text */}
        <text x="50" y="50" textAnchor="middle" dy="5" fontSize="12" fontWeight="bold" fill="#1F2937">
          {efficiency}%
        </text>
      </svg>
      
      {/* Pulsing effect */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-green-400"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
};

const ShadowAnalysis = () => {
  return (
    <div className="relative w-32 h-32 lg:w-36 lg:h-36">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Building shadows */}
        <motion.rect
          x="30"
          y="80"
          width="40"
          height="60"
          fill="#9CA3AF"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.rect
          x="130"
          y="60"
          width="30"
          height="80"
          fill="#9CA3AF"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
        
        {/* Moving shadow */}
        <motion.rect
          x="50"
          y="140"
          width="100"
          height="20"
          fill="#000000"
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            x: [50, 70, 50],
            width: [100, 80, 100]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        {/* Sun */}
        <motion.circle
          cx="160"
          cy="40"
          r="15"
          fill="#F59E0B"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </svg>
    </div>
  );
};

const Solar3DVisualization: React.FC<Solar3DVisualizationProps> = ({
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

  const [efficiency, setEfficiency] = useState(92);
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

  useEffect(() => {
    if (apiConfig.enabled && apiConfig.endpoint) {
      console.log('Fetching solar 3D data from:', apiConfig.endpoint);
    }

    const interval = setInterval(() => {
      setEfficiency(prev => {
        const variation = Math.random() * 2 - 1;
        return Math.max(85, Math.min(98, prev + variation));
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [apiConfig.enabled, apiConfig.endpoint]);

  return (
    <div 
      className="w-full h-full flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 relative"
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
        maxWidth: width,
        maxHeight: height,
      }}
    >
      {/* Animated background elements */}
      <motion.div
        className="pointer-events-none absolute top-10 left-10 w-16 h-16 lg:w-20 lg:h-20 bg-blue-200 rounded-full opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="pointer-events-none absolute top-32 right-5 lg:right-20 w-12 h-12 lg:w-16 lg:h-16 bg-purple-200 rounded-full opacity-30"
        animate={{
          scale: [1.1, 0.9, 1.1],
          opacity: [0.3, 0.2, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
      />

      {/* Header */}
      <motion.header 
        className="relative z-10 w-full px-3 lg:px-6 pt-3 lg:pt-4 flex flex-col lg:flex-row items-start justify-between gap-3 lg:gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex-1 w-full lg:w-auto">
          <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
            {/* Logo */}
            <motion.div
              className={`${containerSize === 'sm' ? 'w-8 h-8' : containerSize === 'md' ? 'w-10 h-10' : containerSize === 'lg' ? 'w-12 h-12' : 'w-14 h-14'} bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <svg className={`${containerSize === 'sm' ? 'w-4 h-4' : containerSize === 'md' ? 'w-5 h-5' : containerSize === 'lg' ? 'w-6 h-6' : 'w-7 h-7'} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84h6.38a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" />
                <rect x="8" y="12" width="8" height="8" rx="2" />
              </svg>
            </motion.div>
            <div className="flex-1 min-w-0">
              <motion.h1 
                className={`font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight ${currentTextSize.title} truncate`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {t.title}
              </motion.h1>
              <motion.p 
                className={`text-blue-600 mt-1 font-light ${currentTextSize.subtitle} truncate`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {t.subtitle}
              </motion.p>
            </div>
          </div>
        </div>

        {/* Hero Metric Card */}
        <motion.div 
          className="bg-white/90 backdrop-blur-lg border border-white/70 rounded-xl lg:rounded-2xl px-3 lg:px-4 py-2 lg:py-3 shadow-xl w-full lg:w-auto lg:min-w-[200px] xl:min-w-[240px] border-l-4 border-l-blue-500 mt-2 lg:mt-0 lg:ml-3"
          initial={{ opacity: 0, scale: 0.9, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <div className="flex items-center gap-2 lg:gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className={`${containerSize === 'sm' ? 'w-8 h-8' : containerSize === 'md' ? 'w-10 h-10' : containerSize === 'lg' ? 'w-12 h-12' : 'w-14 h-14'} bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                <svg className={`${containerSize === 'sm' ? 'w-4 h-4' : containerSize === 'md' ? 'w-5 h-5' : containerSize === 'lg' ? 'w-6 h-6' : 'w-7 h-7'} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84h6.38a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" />
                  <rect x="8" y="12" width="8" height="8" rx="2" />
                </svg>
              </div>
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className={`text-blue-600 font-semibold uppercase tracking-wide ${currentTextSize.small}`}>{t.systemCapacity}</p>
              <motion.p 
                className={`font-bold text-blue-700 leading-none tracking-tight mt-1 ${currentTextSize.largeMetric}`}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {t.systemCapacityValue}
              </motion.p>
              <motion.p 
                className={`text-green-600 font-medium mt-1 flex items-center gap-1 ${currentTextSize.small}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
                {t.roofPotential}
              </motion.p>
            </div>
          </div>
        </motion.div>
      </motion.header>

      {/* Info Bar */}
      <motion.div 
        className="relative z-10 w-full px-3 lg:px-6 mt-2 lg:mt-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="w-full bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl px-3 lg:px-4 py-2 lg:py-3 border border-white/70 shadow-lg">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2 lg:gap-3">
            <p className={`text-blue-700 leading-relaxed font-medium flex-1 ${currentTextSize.body} line-clamp-2`}>
              {t.info.description}
            </p>
            <div className="flex gap-1 lg:gap-2 flex-shrink-0">
              <motion.span 
                className="px-2 lg:px-3 py-1 rounded-full bg-blue-500/20 text-blue-700 font-semibold border border-blue-400/30 whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
              >
                <span className={currentTextSize.small}>{t.info.interactiveChip}</span>
              </motion.span>
              <motion.span 
                className="px-2 lg:px-3 py-1 rounded-full bg-purple-500/20 text-purple-700 font-semibold border border-purple-400/30 whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
              >
                <span className={currentTextSize.small}>{t.info.simulationChip}</span>
              </motion.span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI Row */}
      <motion.div 
        className="relative z-10 w-full px-3 lg:px-6 mt-2 lg:mt-3 flex flex-wrap gap-1 lg:gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {[
          { label: t.kpis.roofArea, value: t.kpis.roofValue, color: 'blue' },
          { label: t.kpis.panelCount, value: t.kpis.panelValue, color: 'purple' },
          { label: t.kpis.annualYield, value: t.kpis.yieldValue, color: 'green' }
        ].map((kpi, index) => (
          <motion.div
            key={kpi.label}
            className="px-2 lg:px-3 py-1 lg:py-2 bg-white/60 backdrop-blur-md rounded-lg border border-white/50 shadow flex items-center gap-1 lg:gap-2 flex-1 min-w-[100px] lg:min-w-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className={`w-1.5 lg:w-2 h-1.5 lg:h-2 rounded-full bg-${kpi.color}-400 animate-pulse flex-shrink-0`} />
            <span className={`font-medium ${currentTextSize.kpi} truncate`}>{kpi.label}:</span>
            <span className={`font-bold text-blue-800 ${currentTextSize.kpi} truncate`}>{kpi.value}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 w-full px-3 lg:px-6 pb-2 lg:pb-3 pt-2 lg:pt-3 overflow-hidden min-h-0">
        <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 lg:gap-4 xl:gap-6" style={{ height: '100%' }}>
          
          {/* Left Card - Panel Configuration */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl border border-white/60 shadow-lg p-3 lg:p-4 flex flex-col min-h-0"
            style={{ height: '100%' }}
          >
            <div className="mb-2 lg:mb-3 flex-shrink-0">
              <p className={`font-bold text-blue-800 mb-1 ${currentTextSize.cardTitle}`}>{t.leftCard.title}</p>
              <p className={`text-blue-600 ${currentTextSize.cardSubtitle}`}>{t.leftCard.subtitle}</p>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center gap-3 lg:gap-4 mb-2 lg:mb-3 min-h-0">
              <RoofVisualization />
              
              <div className="text-center">
                <EfficiencyMeter efficiency={efficiency} />
                <p className={`text-blue-600 mt-2 font-medium ${currentTextSize.small}`}>System Efficiency</p>
              </div>
            </div>
            
            <div className="flex gap-2 lg:gap-3 justify-center flex-shrink-0">
              {[
                { label: t.leftCard.legend.optimal, color: 'bg-green-500' },
                { label: t.leftCard.legend.good, color: 'bg-yellow-500' },
                { label: t.leftCard.legend.partial, color: 'bg-red-500' }
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-1"
                >
                  <div className={`w-2 lg:w-3 h-2 lg:h-3 rounded-full ${item.color}`} />
                  <span className={`text-gray-600 ${currentTextSize.small}`}>{item.label}</span>
                </motion.div>
              ))}
            </div>
            <p className={`text-blue-400 text-center mt-2 ${currentTextSize.small}`}>{t.leftCard.footer}</p>
          </motion.div>

          {/* Center Card - Shadow Analysis */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-white/60 backdrop-blur-lg rounded-xl lg:rounded-2xl border border-white/50 shadow-xl p-3 lg:p-4 flex flex-col items-center justify-center gap-3 lg:gap-4"
          >
            <p className={`font-semibold text-blue-700 text-center ${currentTextSize.cardTitle}`}>{t.centerCard.title}</p>
            
            <ShadowAnalysis />
            
            <motion.div
              className="text-center"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className={`text-blue-600 mb-1 font-medium ${currentTextSize.small}`}>Shadow Impact</div>
              <div className={`font-bold text-red-500 bg-red-50 px-2 lg:px-3 py-1 lg:py-2 rounded-lg border border-red-100 ${currentTextSize.body}`}>
                -12% Efficiency
              </div>
            </motion.div>
            
            <p className={`text-blue-600 text-center ${currentTextSize.small}`}>{t.centerCard.note}</p>
          </motion.div>

          {/* Right Card - Seasonal Performance */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl border border-white/60 shadow-lg p-3 lg:p-4 flex flex-col min-h-0"
            style={{ height: '100%' }}
          >
            <div className="mb-2 lg:mb-3 flex-shrink-0">
              <p className={`font-bold text-blue-800 mb-1 text-center lg:text-right xl:text-left ${currentTextSize.cardTitle}`}>{t.rightCard.title}</p>
              <p className={`text-blue-600 text-center lg:text-right xl:text-left ${currentTextSize.cardSubtitle}`}>{t.rightCard.subtitle}</p>
            </div>
            
            <div className="flex-1 flex items-center justify-center mb-2 lg:mb-3 min-h-0">
              <SeasonWheel />
            </div>

            {/* Season Details */}
            <div className="grid grid-cols-2 gap-2 lg:gap-3 flex-shrink-0">
              {['spring', 'summer', 'autumn', 'winter'].map((season, index) => {
                const data: Record<string, { yield: string; color: string }> = {
                  spring: { yield: '2.1 kWh', color: '#10B981' },
                  summer: { yield: '3.2 kWh', color: '#F59E0B' },
                  autumn: { yield: '1.8 kWh', color: '#EA580C' },
                  winter: { yield: '0.7 kWh', color: '#3B82F6' }
                };
                return (
                  <motion.div
                    key={season}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 p-2 lg:p-3 rounded-xl bg-white/60 border border-white/70"
                  >
                    <div 
                      className="w-2 lg:w-3 h-2 lg:h-3 rounded-full shadow-sm"
                      style={{ backgroundColor: data[season].color }}
                    />
                    <div className="flex-1">
                      <div className={`font-semibold text-gray-700 capitalize ${currentTextSize.small}`}>
                        {t.rightCard.legend[season as keyof typeof t.rightCard.legend]}
                      </div>
                      <div className={`text-gray-600 font-medium ${currentTextSize.small}`}>
                        {data[season].yield}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            <p className={`text-blue-400 text-center mt-2 ${currentTextSize.small}`}>{t.rightCard.footer}</p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Solar3DVisualization;