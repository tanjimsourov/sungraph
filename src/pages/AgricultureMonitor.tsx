// pages/AgricultureMonitor.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Translation dictionaries (base defaults)
// Add to baseTranslations object
const baseTranslations = {
  en: {
    title: 'Sustainable Agriculture Monitor',
    subtitle: 'Smart farming with real-time crop health tracking',
    cropHealth: 'Crop Health',
    healthValue: '87% Optimal',
    yieldForecast: '+12% yield forecast',
    info: {
      description: 'Advanced crop monitoring with soil analysis, growth tracking, and yield prediction.',
      smartChip: '• Smart Sensors',
      aiChip: '• AI Analysis',
    },
    kpis: {
      moisture: 'Soil Moisture',
      moistureValue: '65%',
      temperature: 'Temperature',
      temperatureValue: '22°C',
      nutrients: 'Nutrients',
      nutrientsValue: 'Optimal',
    }
  },
  nl: {
    title: 'Duurzame Landbouw Monitor',
    subtitle: 'Smart farming met real-time gewasgezondheid tracking',
    cropHealth: 'Gewasgezondheid',
    healthValue: '87% Optimaal',
    yieldForecast: '+12% opbrengst prognose',
    info: {
      description: 'Geavanceerde gewasmonitoring met bodemanalyse, groeitracking en opbrengstvoorspelling.',
      smartChip: '• Slimme Sensoren',
      aiChip: '• AI Analyse',
    },
    kpis: {
      moisture: 'Bodemvocht',
      moistureValue: '65%',
      temperature: 'Temperatuur',
      temperatureValue: '22°C',
      nutrients: 'Voedingsstoffen',
      nutrientsValue: 'Optimaal',
    }
  }
};


type LangKey = keyof typeof baseTranslations;
type TranslationShape = (typeof baseTranslations)["en"];

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export interface AgricultureMonitorProps {
  width?: number;
  height?: number;
  /** which language to render; if not provided, falls back to English */
  lang?: LangKey;
  /**
   * Optional overrides for any text in the template, per language.
   * Example:
   * {
   *   en: { title: "My Custom Title" },
   * }
   */
  texts?: Partial<Record<LangKey, DeepPartial<TranslationShape>>>;
  /** API configuration for dynamic data */
  apiConfig?: {
    enabled: boolean;
    endpoint: string;
  };
}

// Helper to merge base + overrides deeply for a single language
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
  };
}

// Enhanced Plant Growth Animation with responsive scaling
interface PlantGrowthAnimationProps {
  growthStage?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const PlantGrowthAnimation = ({ growthStage = 0, size = 'lg' }: PlantGrowthAnimationProps) => {
  const sizeMap = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28', 
    lg: 'w-36 h-36',
    xl: 'w-44 h-44'
  };

  const getPlantPath = (stage: number): string => {
    const paths = [
      "M 50,85 C 45,80 55,80 50,85",
      "M 50,85 L 50,70 Q 45,65 50,60 Q 55,65 50,70",
      "M 50,85 L 50,55 Q 40,50 50,45 Q 60,50 50,55 M 45,65 L 35,60 M 55,65 L 65,60",
      "M 50,85 L 50,40 Q 35,35 50,30 Q 65,35 50,40 M 45,60 L 30,55 M 55,60 L 70,55 M 40,70 L 25,65 M 60,70 L 75,65"
    ];
    return paths[stage];
  };

  return (
    <motion.div 
      className={`relative ${sizeMap[size]} bg-gradient-to-br from-green-50/80 to-emerald-100/80 rounded-2xl border-2 border-green-200/50 backdrop-blur-sm shadow-2xl`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-green-400/30 rounded-full"
            initial={{ 
              x: Math.random() * 200, 
              y: Math.random() * 200,
              opacity: 0 
            }}
            animate={{ 
              y: [null, -20, 0],
              opacity: [0, 0.5, 0]
            }}
            transition={{ 
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5
            }}
          />
        ))}
      </div>

      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="soilGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8B4513" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#5D4037" stopOpacity="0.9" />
          </linearGradient>
          <filter id="shadow">
            <feDropShadow dx="1" dy="2" stdDeviation="2" />
          </filter>
        </defs>
        
        <motion.rect 
          x="25" y="80" width="50" height="20" 
          fill="url(#soilGradient)"
          initial={{ y: 85 }}
          animate={{ y: 80 }}
          transition={{ duration: 1 }}
        />
        
        <motion.path
          d={getPlantPath(growthStage)}
          stroke="#22C55E"
          strokeWidth={2 + growthStage * 0.5}
          fill="none"
          filter="url(#shadow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        
        <motion.g
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="80" cy="20" r="10" fill="#F59E0B" />
        </motion.g>
      </svg>
      
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
        <AnimatePresence mode="wait">
          <motion.div
            key={growthStage}
            initial={{ opacity: 0, y: 5, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.8 }}
            className="px-2 py-1 bg-green-500/20 backdrop-blur-sm rounded-full border border-green-400/30"
          >
            <span className="text-xs font-semibold text-green-800 whitespace-nowrap">
              {['Seed', 'Sprout', 'Growing', 'Mature'][growthStage]}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Enhanced Soil Moisture Gauge with responsive scaling
interface SoilMoistureGaugeProps {
  moisture?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SoilMoistureGauge = ({ moisture = 65, size = 'lg' }: SoilMoistureGaugeProps) => {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
  };

  return (
    <motion.div 
      className={`relative ${sizeMap[size]} bg-gradient-to-br from-blue-50/80 to-cyan-100/80 rounded-2xl border-2 border-blue-200/50 backdrop-blur-sm shadow-2xl flex items-center justify-center`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-blue-400/20"
          style={{ height: `${moisture}%` }}
          animate={{
            height: [`${moisture}%`, `${moisture + 5}%`, `${moisture}%`],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      <svg viewBox="0 0 100 100" className="w-3/4 h-3/4 relative z-10">
        <motion.path
          d="M 50,25 C 25,45 35,70 50,80 C 65,70 75,45 50,25 Z"
          fill="url(#moistureGradient)"
          animate={{
            d: [
              "M 50,25 C 25,45 35,70 50,80 C 65,70 75,45 50,25 Z",
              "M 50,20 C 30,45 35,75 50,80 C 65,75 70,45 50,20 Z",
              "M 50,25 C 25,45 35,70 50,80 C 65,70 75,45 50,25 Z"
            ],
            scale: [1, 1.02, 1],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        <defs>
          <linearGradient id="moistureGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#1D4ED8" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="text-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.span
            className="text-base font-bold text-blue-800 drop-shadow-sm"
            key={moisture}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {moisture}%
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Weather and Environment Component with responsive scaling
const WeatherEnvironment = ({ size = 'lg' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  const textSizeMap = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  const [temperature, setTemperature] = useState(22);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTemperature(prev => Math.max(18, Math.min(28, prev + (Math.random() * 2 - 1))));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="bg-gradient-to-br from-amber-50/80 to-orange-100/80 rounded-xl lg:rounded-2xl border-2 border-amber-200/50 backdrop-blur-sm shadow-lg p-3 lg:p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h3 className={`font-bold text-amber-800 mb-2 lg:mb-3 ${textSizeMap[size]}`}>Weather Conditions</h3>
      
      <div className="flex items-center justify-between mb-2 lg:mb-3">
        <motion.div
          className={`font-bold text-amber-600 ${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl'}`}
          key={temperature}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
        >
          {temperature.toFixed(1)}°C
        </motion.div>
        <motion.div
          animate={{ rotate: [0, 5, 0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className={size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-6 h-6' : 'w-7 h-7'}
        >
          <svg className="w-full h-full text-amber-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 8a6 6 0 0112 0c0 3.5-6 9-6 9s-6-5.5-6-9z"/>
          </svg>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-1 lg:gap-2">
        <div className="flex items-center gap-1 lg:gap-2">
          <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-blue-400 rounded-full animate-pulse flex-shrink-0" />
          <span className={`text-gray-600 ${textSizeMap[size]}`}>Humidity</span>
          <span className={`font-semibold text-gray-800 ml-auto ${textSizeMap[size]}`}>68%</span>
        </div>
        <div className="flex items-center gap-1 lg:gap-2">
          <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
          <span className={`text-gray-600 ${textSizeMap[size]}`}>Wind</span>
          <span className={`font-semibold text-gray-800 ml-auto ${textSizeMap[size]}`}>12km/h</span>
        </div>
      </div>
    </motion.div>
  );
};

const AgricultureMonitor: React.FC<AgricultureMonitorProps> = ({
  width,
  height,
  lang,
  texts,
  apiConfig = {
    enabled: false,
    endpoint: "",
  },
}) => {
  // Determine language (default to Dutch, or English if browser is en-*)
  let autoLang: LangKey = "nl";
  if (
    typeof navigator !== "undefined" &&
    navigator.language &&
    navigator.language.toLowerCase().startsWith("en")
  ) {
    autoLang = "en";
  }

  const activeLang: LangKey =
    lang && (lang === "nl" || lang === "en") ? lang : autoLang;

  const base = baseTranslations[activeLang];
  const overrides = (texts?.[activeLang] ?? {}) as DeepPartial<TranslationShape>;
  const t = mergeLang(base, overrides);
  const [growthStage, setGrowthStage] = useState(0);
  const [moisture, setMoisture] = useState(65);
  const [containerSize, setContainerSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');

  // Determine size based on container dimensions
  useEffect(() => {
    const updateSize = () => {
      const containerWidth = width || window.innerWidth;
      const containerHeight = height || window.innerHeight;
      
      // Consider both width and height for size calculation
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

  // Text size mapping based on container size - optimized for no cropping
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
      console.log('Fetching data from:', apiConfig.endpoint);
    }

    const interval = setInterval(() => {
      setGrowthStage(prev => (prev + 1) % 4);
      setMoisture(prev => Math.max(30, Math.min(90, prev + Math.random() * 10 - 5)));
    }, 4000);
    return () => clearInterval(interval);
  }, [apiConfig.enabled, apiConfig.endpoint]);

  return (
    <div 
      className="w-full h-full flex flex-col overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 relative"
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
        maxWidth: width,
        maxHeight: height,
      }}
    >
      {/* Simplified Background to reduce overhead */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-green-200/20 to-emerald-300/10"
            style={{
              width: 40 + Math.random() * 80,
              height: 40 + Math.random() * 80,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
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

      {/* Compact Header */}
      <motion.header 
        className="relative z-10 w-full px-3 lg:px-6 pt-3 lg:pt-4 flex flex-col lg:flex-row items-start justify-between gap-3 lg:gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex-1 w-full lg:w-auto">
          <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
            {/* Compact Logo */}
            <motion.div
              className={`${containerSize === 'sm' ? 'w-8 h-8' : containerSize === 'md' ? 'w-10 h-10' : containerSize === 'lg' ? 'w-12 h-12' : 'w-14 h-14'} bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <svg className={`${containerSize === 'sm' ? 'w-4 h-4' : containerSize === 'md' ? 'w-5 h-5' : containerSize === 'lg' ? 'w-6 h-6' : 'w-7 h-7'} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
              </svg>
            </motion.div>
            <div className="flex-1 min-w-0">
              <motion.h1 
                className={`font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent leading-tight ${currentTextSize.title} truncate`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {t.title}
              </motion.h1>
              <motion.p 
                className={`text-green-600 mt-1 font-light ${currentTextSize.subtitle} truncate`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {t.subtitle}
              </motion.p>
            </div>
          </div>

          {/* Compact Info Bar */}
          <motion.div 
            className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl px-3 lg:px-4 py-2 lg:py-3 border border-white/70 shadow-lg w-full"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2 lg:gap-3">
              <p className={`text-green-700 leading-relaxed font-medium flex-1 ${currentTextSize.body} line-clamp-2`}>
                {t.info.description}
              </p>
              <div className="flex gap-1 lg:gap-2 flex-shrink-0">
                <motion.span 
                  className="px-2 lg:px-3 py-1 rounded-full bg-green-500/20 text-green-700 font-semibold border border-green-400/30 whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className={currentTextSize.small}>{t.info.smartChip}</span>
                </motion.span>
                <motion.span 
                  className="px-2 lg:px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 font-semibold border border-emerald-400/30 whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className={currentTextSize.small}>{t.info.aiChip}</span>
                </motion.span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Compact Hero Metric Card */}
        <motion.div 
          className="bg-white/90 backdrop-blur-lg border border-white/70 rounded-xl lg:rounded-2xl px-3 lg:px-4 py-2 lg:py-3 shadow-xl w-full lg:w-auto lg:min-w-[200px] xl:min-w-[240px] border-l-4 border-l-green-500 mt-2 lg:mt-0 lg:ml-3"
          initial={{ opacity: 0, scale: 0.9, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <div className="flex items-center gap-2 lg:gap-3">
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className={`${containerSize === 'sm' ? 'w-8 h-8' : containerSize === 'md' ? 'w-10 h-10' : containerSize === 'lg' ? 'w-12 h-12' : 'w-14 h-14'} bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                <svg className={`${containerSize === 'sm' ? 'w-4 h-4' : containerSize === 'md' ? 'w-5 h-5' : containerSize === 'lg' ? 'w-6 h-6' : 'w-7 h-7'} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className={`text-green-600 font-semibold uppercase tracking-wide ${currentTextSize.small}`}>{t.cropHealth}</p>
              <motion.p 
                className={`font-bold text-green-700 leading-none tracking-tight mt-1 ${currentTextSize.largeMetric}`}
                key={t.healthValue}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
              >
                {t.healthValue}
              </motion.p>
              <motion.p 
                className={`text-emerald-600 font-medium mt-1 flex items-center gap-1 ${currentTextSize.small}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse flex-shrink-0" />
                {t.yieldForecast}
              </motion.p>
            </div>
          </div>
        </motion.div>
      </motion.header>

      {/* Compact KPI Row */}
      <motion.div 
        className="relative z-10 w-full px-3 lg:px-6 mt-2 lg:mt-3 flex flex-wrap gap-1 lg:gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {[
          { label: t.kpis.moisture, value: t.kpis.moistureValue, color: 'blue' },
          { label: t.kpis.temperature, value: t.kpis.temperatureValue, color: 'amber' },
          { label: t.kpis.nutrients, value: t.kpis.nutrientsValue, color: 'purple' },
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
            <span className={`font-bold text-green-800 ${currentTextSize.kpi} truncate`}>{kpi.value}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content - Optimized for no cropping */}
      <main className="relative z-10 flex-1 w-full px-3 lg:px-6 pb-2 lg:pb-3 pt-2 lg:pt-3 overflow-hidden min-h-0">
        <div className="w-full h-full grid grid-cols-1 xl:grid-cols-3 gap-2 lg:gap-4 xl:gap-6" style={{ height: '100%' }}>
          {/* Left Card - Plant Growth */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl border border-white/60 shadow-lg p-3 lg:p-4 flex flex-col min-h-0"
            style={{ height: '100%' }}
          >
            <div className="mb-2 lg:mb-3 flex-shrink-0">
              <p className={`font-bold text-green-800 mb-1 ${currentTextSize.cardTitle}`}>Crop Growth Analytics</p>
              <p className={`text-green-600 ${currentTextSize.cardSubtitle}`}>Real-time plant development tracking</p>
            </div>
            
            <div className="flex-1 flex items-center justify-center mb-2 lg:mb-3 min-h-0">
              <PlantGrowthAnimation growthStage={growthStage} size={containerSize} />
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 lg:gap-2 flex-shrink-0">
              {['Seed', 'Sprout', 'Growing', 'Mature'].map((stage, index) => (
                <motion.div
                  key={stage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className={`text-center p-1 lg:p-2 rounded-lg border transition-all duration-300 ${
                    growthStage === index 
                      ? 'bg-green-500/20 border-green-400 shadow scale-105' 
                      : 'bg-white/50 border-white/70'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={`font-semibold text-gray-800 ${currentTextSize.small}`}>
                    {stage}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Center Column */}
          <div className="flex flex-col gap-2 lg:gap-3 xl:gap-4 min-h-0" style={{ height: '100%' }}>
            <WeatherEnvironment size={containerSize} />
            
            {/* Soil Conditions Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl border border-white/60 shadow-lg p-3 lg:p-4 flex-1 flex flex-col min-h-0"
              style={{ height: '100%' }}
            >
              <div className="text-center mb-2 lg:mb-3 flex-shrink-0">
                <p className={`font-bold text-green-800 mb-1 ${currentTextSize.cardTitle}`}>Soil Health Monitor</p>
                <p className={`text-green-600 ${currentTextSize.cardSubtitle}`}>Soil analysis and moisture levels</p>
              </div>
              
              <div className="flex-1 flex items-center justify-center mb-2 lg:mb-3 min-h-0">
                <SoilMoistureGauge moisture={moisture} size={containerSize} />
              </div>
              
              <div className="grid grid-cols-2 gap-1 lg:gap-2 flex-shrink-0">
                {[
                  { label: t.kpis.moisture, value: `${moisture}%`, color: '#3B82F6' },
                  { label: 'pH Level', value: '6.8', color: '#10B981' },
                  { label: t.kpis.nutrients, value: t.kpis.nutrientsValue, color: '#8B5CF6' },
                  { label: t.kpis.temperature, value: t.kpis.temperatureValue, color: '#F59E0B' }
                ].map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="flex items-center gap-1 lg:gap-2 p-1 lg:p-2 rounded-lg bg-white/60 border border-white/70 shadow-sm"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div 
                      className="w-2 lg:w-3 h-2 lg:h-3 rounded-full shadow-sm flex-shrink-0"
                      style={{ backgroundColor: metric.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold text-gray-800 truncate ${currentTextSize.small}`}>
                        {metric.label}
                      </div>
                      <div className={`font-bold text-gray-900 ${currentTextSize.metric}`}>
                        {metric.value}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Card - Performance */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl border border-white/60 shadow-lg p-3 lg:p-4 min-h-0"
            style={{ height: '100%' }}
          >
            <div className="mb-2 lg:mb-3 flex-shrink-0">
              <p className={`font-bold text-green-800 mb-1 ${currentTextSize.cardTitle}`}>Farm Performance</p>
              <p className={`text-green-600 ${currentTextSize.cardSubtitle}`}>Yield predictions and optimization</p>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-2 lg:space-y-3 flex-1">
              {[
                { metric: 'Water Efficiency', value: '78%', progress: 78, color: 'blue' },
                { metric: 'Fertilizer Usage', value: 'Optimal', progress: 85, color: 'green' },
                { metric: 'Energy Consumption', value: '62 kWh', progress: 62, color: 'amber' },
                { metric: 'Crop Yield', value: '+12%', progress: 88, color: 'emerald' },
              ].map((item, index) => (
                <motion.div
                  key={item.metric}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="space-y-1"
                >
                  <div className="flex justify-between">
                    <span className={`text-gray-700 font-medium ${currentTextSize.small}`}>{item.metric}</span>
                    <span className={`font-bold text-${item.color}-600 ${currentTextSize.small}`}>{item.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 lg:h-2">
                    <motion.div
                      className={`h-1.5 lg:h-2 rounded-full bg-${item.color}-500`}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      transition={{ duration: 1, delay: 1.1 + index * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <motion.div 
              className="mt-3 lg:mt-4 p-2 lg:p-3 bg-green-50/50 rounded-lg border border-green-200/50 flex-shrink-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <p className={`font-semibold text-green-800 mb-1 lg:mb-2 ${currentTextSize.small}`}>Quick Actions</p>
              <div className="grid grid-cols-2 gap-1">
                {['Irrigate', 'Monitor', 'Analyze', 'Report'].map((action, index) => (
                  <motion.button
                    key={action}
                    className="px-1 lg:px-2 py-1 bg-white rounded text-green-700 border border-green-200 hover:bg-green-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className={currentTextSize.small}>{action}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AgricultureMonitor;