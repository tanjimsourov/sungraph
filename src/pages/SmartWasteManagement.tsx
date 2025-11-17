// pages/SmartWasteManagement.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Translation dictionaries (base defaults)
const baseTranslations = {
  en: {
    title: 'Smart Waste Management',
    subtitle: 'AI-powered recycling optimization & collection routes',
    weeklyWaste: 'Weekly Waste',
    weeklyValue: '24.3 kg',
    recyclingRate: '68% recycling rate',
    info: {
      description: 'Intelligent waste monitoring with optimal collection scheduling and recycling guidance.',
      aiChip: '• AI Routing',
      smartChip: '• Smart Bins',
    },
    kpis: {
      plastic: 'Plastic',
      plasticValue: '8.2 kg',
      organic: 'Organic',
      organicValue: '6.1 kg',
      paper: 'Paper',
      paperValue: '5.3 kg',
    }
  },
  nl: {
    title: 'Slimme Afvalbeheer',
    subtitle: 'AI-gestuurde recycling optimalisatie & inzamelroutes',
    weeklyWaste: 'Wekelijks Afval',
    weeklyValue: '24.3 kg',
    recyclingRate: '68% recycling percentage',
    info: {
      description: 'Intelligente afvalmonitoring met optimale inzamelplanning en recycling begeleiding.',
      aiChip: '• AI Routeplanning',
      smartChip: '• Slimme Bakken',
    },
    kpis: {
      plastic: 'Plastic',
      plasticValue: '8.2 kg',
      organic: 'Organisch',
      organicValue: '6.1 kg',
      paper: 'Papier',
      paperValue: '5.3 kg',
    }
  }
};

type LangKey = keyof typeof baseTranslations;
type TranslationShape = (typeof baseTranslations)["en"];

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export interface SmartWasteManagementProps {
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

// Define the valid types for the waste bin
type WasteBinType = 'mixed' | 'plastic' | 'organic' | 'paper';

interface WasteBinAnimationProps {
  fillLevel?: number;
  type?: WasteBinType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const WasteBinAnimation = ({ fillLevel = 65, type = 'mixed', size = 'lg' }: WasteBinAnimationProps) => {
  const sizeMap = {
    sm: 'w-12 h-16',
    md: 'w-14 h-18',
    lg: 'w-16 h-20',
    xl: 'w-20 h-24'
  };

  const colors: Record<WasteBinType, string> = {
    mixed: 'from-gray-400 to-gray-600',
    plastic: 'from-blue-400 to-blue-600',
    organic: 'from-green-400 to-green-600',
    paper: 'from-yellow-400 to-yellow-600'
  };

  return (
    <motion.div 
      className={`relative ${sizeMap[size]} bg-gradient-to-br from-gray-50/80 to-gray-100/80 rounded-xl border-2 border-gray-200/50 backdrop-blur-sm shadow-lg`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Bin body */}
      <div className="absolute inset-1 bg-gradient-to-b from-gray-300 to-gray-400 rounded-lg border-2 border-gray-400">
        {/* Fill level */}
        <motion.div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-b ${colors[type]} rounded-b-lg`}
          initial={{ height: '0%' }}
          animate={{ height: `${fillLevel}%` }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        
        {/* Bin lid */}
        <motion.div
          className="absolute -top-1 left-0 right-0 h-2 bg-gray-500 rounded-t-lg"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>
      
      {/* Floating particles */}
      <AnimatePresence>
        {fillLevel > 80 && (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -20 }}
            exit={{ opacity: 0, y: -40 }}
            className="absolute top-0 left-1/2 w-1 h-1 bg-red-500 rounded-full"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface RecyclingRouteMapProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const RecyclingRouteMap = ({ size = 'lg' }: RecyclingRouteMapProps) => {
  const [activeRoute, setActiveRoute] = useState(0);
  
  const sizeMap = {
    sm: 'w-24 h-24',
    md: 'w-28 h-28',
    lg: 'w-32 h-32',
    xl: 'w-36 h-36'
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRoute(prev => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className={`relative ${sizeMap[size]} bg-gradient-to-br from-green-50/80 to-emerald-100/80 rounded-2xl border-2 border-green-200/50 backdrop-blur-sm shadow-lg`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Map background */}
      <div className="absolute inset-2 bg-white/50 rounded-lg" />
      
      {/* Routes */}
      {[0, 1, 2].map((route) => (
        <motion.div
          key={route}
          className="absolute inset-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: activeRoute === route ? 1 : 0.3 }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <motion.path
              d="M 20,20 L 50,40 L 80,60 L 60,80 L 30,70 L 20,20"
              fill="none"
              stroke={route === 0 ? "#10B981" : route === 1 ? "#3B82F6" : "#F59E0B"}
              strokeWidth="2"
              strokeDasharray="5,5"
              animate={{
                pathLength: activeRoute === route ? [0, 1] : 0,
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </svg>
        </motion.div>
      ))}
      
      {/* Collection points */}
      {[20, 50, 80].map((x, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-green-500 rounded-full border-2 border-white"
          style={{ left: `${x}%`, top: `${20 + i * 20}%` }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}
    </motion.div>
  );
};

const SmartWasteManagement: React.FC<SmartWasteManagementProps> = ({
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
  const [binData, setBinData] = useState([
    { type: 'plastic' as WasteBinType, fillLevel: 75 },
    { type: 'organic' as WasteBinType, fillLevel: 45 },
    { type: 'paper' as WasteBinType, fillLevel: 60 },
    { type: 'mixed' as WasteBinType, fillLevel: 85 }
  ]);
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
      console.log('Fetching waste data from:', apiConfig.endpoint);
      // Simulate API data fetching
      const interval = setInterval(() => {
        setBinData(prev => prev.map(bin => ({
          ...bin,
          fillLevel: Math.max(10, Math.min(95, bin.fillLevel + (Math.random() * 10 - 5)))
        })));
      }, 8000);
      return () => clearInterval(interval);
    }
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
      {/* Simplified Background */}
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
                  <span className={currentTextSize.small}>{t.info.aiChip}</span>
                </motion.span>
                <motion.span 
                  className="px-2 lg:px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 font-semibold border border-emerald-400/30 whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className={currentTextSize.small}>{t.info.smartChip}</span>
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
              <p className={`text-green-600 font-semibold uppercase tracking-wide ${currentTextSize.small}`}>{t.weeklyWaste}</p>
              <motion.p 
                className={`font-bold text-green-700 leading-none tracking-tight mt-1 ${currentTextSize.largeMetric}`}
                key={t.weeklyValue}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
              >
                {t.weeklyValue}
              </motion.p>
              <motion.p 
                className={`text-emerald-600 font-medium mt-1 flex items-center gap-1 ${currentTextSize.small}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse flex-shrink-0" />
                {t.recyclingRate}
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
          { label: t.kpis.plastic, value: t.kpis.plasticValue, color: 'blue' },
          { label: t.kpis.organic, value: t.kpis.organicValue, color: 'green' },
          { label: t.kpis.paper, value: t.kpis.paperValue, color: 'yellow' },
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
        <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 xl:gap-6" style={{ height: '100%' }}>
          {/* Left card - Waste Bins */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl border border-white/60 shadow-lg p-3 lg:p-4 flex flex-col min-h-0"
            style={{ height: '100%' }}
          >
            <div className="mb-2 lg:mb-3 flex-shrink-0">
              <p className={`font-bold text-green-800 mb-1 ${currentTextSize.cardTitle}`}>Smart Bin Status</p>
              <p className={`text-green-600 ${currentTextSize.cardSubtitle}`}>Real-time fill levels and alerts</p>
            </div>
            
            <div className="flex-1 flex items-center justify-center mb-2 lg:mb-3 min-h-0">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 w-full">
                {binData.map((bin, index) => (
                  <motion.div
                    key={bin.type}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <WasteBinAnimation 
                      fillLevel={bin.fillLevel} 
                      type={bin.type}
                      size={containerSize}
                    />
                    <div className="text-center">
                      <p className={`font-semibold text-gray-700 capitalize ${currentTextSize.small}`}>
                        {bin.type}
                      </p>
                      <p className={`text-gray-600 ${currentTextSize.small}`}>
                        {bin.fillLevel}% full
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bin Status Indicators */}
            <div className="grid grid-cols-2 gap-1 lg:gap-2 flex-shrink-0">
              {[
                { status: 'Optimal', color: 'green', count: 2 },
                { status: 'Warning', color: 'yellow', count: 1 },
                { status: 'Critical', color: 'red', count: 1 },
                { status: 'Empty', color: 'gray', count: 0 }
              ].map((status, index) => (
                <motion.div
                  key={status.status}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-center gap-1 lg:gap-2 p-1 lg:p-2 rounded-lg bg-white/60 border border-white/70 shadow-sm"
                >
                  <div className={`w-2 lg:w-3 h-2 lg:h-3 rounded-full bg-${status.color}-400`} />
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold text-gray-800 ${currentTextSize.small}`}>
                      {status.status}
                    </div>
                    <div className={`font-bold text-gray-900 ${currentTextSize.metric}`}>
                      {status.count}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right card - Recycling Routes */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl border border-white/60 shadow-lg p-3 lg:p-4 flex flex-col min-h-0"
            style={{ height: '100%' }}
          >
            <div className="mb-2 lg:mb-3 flex-shrink-0">
              <p className={`font-bold text-green-800 mb-1 ${currentTextSize.cardTitle}`}>Optimized Collection Routes</p>
              <p className={`text-green-600 ${currentTextSize.cardSubtitle}`}>AI-powered route planning</p>
            </div>
            
            <div className="flex-1 flex items-center justify-center mb-2 lg:mb-3 min-h-0">
              <RecyclingRouteMap size={containerSize} />
            </div>

            {/* Route info */}
            <div className="grid grid-cols-3 gap-1 lg:gap-2 flex-shrink-0">
              {[
                { color: '#10B981', label: 'Plastic', efficiency: '92%' },
                { color: '#3B82F6', label: 'Organic', efficiency: '88%' },
                { color: '#F59E0B', label: 'Paper', efficiency: '85%' }
              ].map((route, index) => (
                <motion.div
                  key={route.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex flex-col items-center p-1 lg:p-2 rounded-lg bg-white/60 border border-white/70"
                >
                  <div className="flex items-center gap-1 lg:gap-2 mb-1">
                    <div 
                      className="w-2 lg:w-3 h-2 lg:h-3 rounded-full"
                      style={{ backgroundColor: route.color }}
                    />
                    <span className={`font-medium text-gray-700 ${currentTextSize.small}`}>
                      {route.label}
                    </span>
                  </div>
                  <span className={`font-bold text-green-800 ${currentTextSize.metric}`}>
                    {route.efficiency}
                  </span>
                  <span className={`text-gray-600 ${currentTextSize.small}`}>efficiency</span>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <motion.div 
              className="mt-2 lg:mt-3 p-2 lg:p-3 bg-green-50/50 rounded-lg border border-green-200/50 flex-shrink-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              <p className={`font-semibold text-green-800 mb-1 lg:mb-2 ${currentTextSize.small}`}>Collection Schedule</p>
              <div className="grid grid-cols-2 gap-1">
                {['Schedule Pickup', 'Optimize Route', 'Generate Report', 'Alert Team'].map((action, index) => (
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

export default SmartWasteManagement;