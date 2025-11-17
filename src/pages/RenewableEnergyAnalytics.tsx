// src/pages/RenewableEnergyAnalytics.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Translation dictionaries (base defaults)
const baseTranslations = {
  en: {
    title: 'Renewable Energy Analytics',
    subtitle: 'Real-time monitoring of clean energy production',
    energyOverview: 'Energy Overview',
    totalProduction: 'Total Energy Production',
    systemEfficiency: 'System Efficiency',
    carbonOffset: 'Carbon Offset',
    productionTimeline: 'Production Timeline',
    environmentalImpact: 'Environmental Impact',
    forestEquivalent: 'Forest Equivalent',
    carsOffRoad: 'Cars Off Road',
    homesPowered: 'Homes Powered',
    increase: 'increase from last month',
    tonsAvoided: 'tons CO₂ avoided',
    equivalentTo: 'equivalent to',
    carsOffRoadText: 'cars off the road',
    ofTotal: 'of total',
    acres: 'acres',
    equivalentVehicles: 'equivalent vehicles removed',
    averageHouseholds: 'average households',
    timeFrames: {
      live: 'Live',
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      yearly: 'Yearly'
    },
    info: {
      description: 'Comprehensive renewable energy monitoring with real-time analytics and environmental impact tracking.',
      smartChip: '• Real-time Analytics',
      aiChip: '• Environmental Impact',
    },
    kpis: {
      solar: 'Solar',
      wind: 'Wind',
      hydro: 'Hydro',
      biomass: 'Biomass',
      efficiency: 'Efficiency',
      offset: 'Carbon Offset'
    }
  },
  nl: {
    title: 'Hernieuwbare Energie Analyse',
    subtitle: 'Real-time monitoring van schone energieproductie',
    energyOverview: 'Energie Overzicht',
    totalProduction: 'Totale Energieproductie',
    systemEfficiency: 'Systeem Efficiëntie',
    carbonOffset: 'CO₂ Reductie',
    productionTimeline: 'Productie Tijdlijn',
    environmentalImpact: 'Milieu Impact',
    forestEquivalent: 'Bos Equivalent',
    carsOffRoad: 'Auto\'s Van De Weg',
    homesPowered: 'Huizen Voorzien',
    increase: 'toename ten opzichte van vorige maand',
    tonsAvoided: 'ton CO₂ vermeden',
    equivalentTo: 'gelijk aan',
    carsOffRoadText: 'auto\'s van de weg',
    ofTotal: 'van totaal',
    acres: 'acres',
    equivalentVehicles: 'equivalente voertuigen verwijderd',
    averageHouseholds: 'gemiddelde huishoudens',
    timeFrames: {
      live: 'Live',
      daily: 'Dagelijks',
      weekly: 'Wekelijks',
      monthly: 'Maandelijks',
      yearly: 'Jaarlijks'
    },
    info: {
      description: 'Uitgebreide monitoring van hernieuwbare energie met real-time analytics en milieu-impact tracking.',
      smartChip: '• Real-time Analytics',
      aiChip: '• Milieu Impact',
    },
    kpis: {
      solar: 'Zonne-energie',
      wind: 'Wind',
      hydro: 'Waterkracht',
      biomass: 'Biomassa',
      efficiency: 'Efficiëntie',
      offset: 'CO₂ Reductie'
    }
  }
};

type LangKey = keyof typeof baseTranslations;
type TranslationShape = (typeof baseTranslations)["en"];

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export interface RenewableEnergyAnalyticsProps {
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
    timeFrames: { ...base.timeFrames, ...(override.timeFrames ?? {}) },
  };
}

// Enhanced Efficiency Gauge with responsive scaling
interface EfficiencyGaugeProps {
  efficiency?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const EfficiencyGauge = ({ efficiency = 87, size = 'lg' }: EfficiencyGaugeProps) => {
  const sizeMap = {
    sm: 'w-20 h-20',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
  };

  return (
    <motion.div 
      className={`relative ${sizeMap[size]} bg-gradient-to-br from-blue-50/80 to-indigo-100/80 rounded-2xl border-2 border-blue-200/50 backdrop-blur-sm shadow-lg flex items-center justify-center`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <svg viewBox="0 0 100 100" className="w-3/4 h-3/4">
        <circle cx="50" cy="50" r="40" stroke="#374151" strokeWidth="8" fill="none" />
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="url(#efficiencyGradient)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${efficiency * 2.51} 251`}
          transform="rotate(-90 50 50)"
          className="transition-all duration-1000"
        />
        <defs>
          <linearGradient id="efficiencyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#3b82f6" />
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
            className={`font-bold text-blue-800 drop-shadow-sm ${
              size === 'sm' ? 'text-lg' : 
              size === 'md' ? 'text-xl' : 
              size === 'lg' ? 'text-2xl' : 'text-3xl'
            }`}
            key={efficiency}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {efficiency}%
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
};

const RenewableEnergyAnalytics: React.FC<RenewableEnergyAnalyticsProps> = ({
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
  
  const [energyData, setEnergyData] = useState({
    solar: 65,
    wind: 35,
    hydro: 25,
    biomass: 15
  });
  const [efficiency, setEfficiency] = useState(87);
  const [timeFrame, setTimeFrame] = useState('monthly');
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

  const totalProduction = Object.values(energyData).reduce((a, b) => a + b, 0);

  useEffect(() => {
    if (apiConfig.enabled && apiConfig.endpoint) {
      console.log('Fetching renewable energy data from:', apiConfig.endpoint);
    }

    const interval = setInterval(() => {
      setEnergyData(prev => ({
        solar: Math.max(0, prev.solar + (Math.random() - 0.5) * 4),
        wind: Math.max(0, prev.wind + (Math.random() - 0.5) * 3),
        hydro: Math.max(0, prev.hydro + (Math.random() - 0.5) * 2),
        biomass: Math.max(0, prev.biomass + (Math.random() - 0.5) * 1)
      }));
      setEfficiency(prev => Math.max(80, Math.min(95, prev + (Math.random() - 0.5) * 2)));
    }, 2500);

    return () => clearInterval(interval);
  }, [apiConfig.enabled, apiConfig.endpoint]);

  return (
    <div 
      className="w-full h-full flex flex-col overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 relative"
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
        maxWidth: width,
        maxHeight: height,
      }}
    >
      {/* Simplified Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
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
              className={`${containerSize === 'sm' ? 'w-8 h-8' : containerSize === 'md' ? 'w-10 h-10' : containerSize === 'lg' ? 'w-12 h-12' : 'w-14 h-14'} bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <svg className={`${containerSize === 'sm' ? 'w-4 h-4' : containerSize === 'md' ? 'w-5 h-5' : containerSize === 'lg' ? 'w-6 h-6' : 'w-7 h-7'} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </motion.div>
            <div className="flex-1 min-w-0">
              <motion.h1 
                className={`font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent leading-tight ${currentTextSize.title} truncate`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {t.title}
              </motion.h1>
              <motion.p 
                className={`text-blue-200 mt-1 font-light ${currentTextSize.subtitle} truncate`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {t.subtitle}
              </motion.p>
            </div>
          </div>

          {/* Time Frame Selector */}
          <motion.div 
            className="flex gap-1 lg:gap-2 mb-3 lg:mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {['live', 'daily', 'weekly', 'monthly', 'yearly'].map((frame) => (
              <motion.button
                key={frame}
                onClick={() => setTimeFrame(frame)}
                className={`px-2 lg:px-3 py-1 lg:py-2 rounded-lg font-medium transition-all ${
                  timeFrame === frame
                    ? 'bg-white text-blue-900 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                } ${currentTextSize.small}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t.timeFrames[frame as keyof typeof t.timeFrames]}
              </motion.button>
            ))}
          </motion.div>

          {/* Compact Info Bar */}
          <motion.div 
            className="bg-white/10 backdrop-blur-lg rounded-xl lg:rounded-2xl px-3 lg:px-4 py-2 lg:py-3 border border-white/20 shadow-lg w-full"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2 lg:gap-3">
              <p className={`text-blue-200 leading-relaxed font-medium flex-1 ${currentTextSize.body} line-clamp-2`}>
                {t.info.description}
              </p>
              <div className="flex gap-1 lg:gap-2 flex-shrink-0">
                <motion.span 
                  className="px-2 lg:px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 font-semibold border border-blue-400/30 whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className={currentTextSize.small}>{t.info.smartChip}</span>
                </motion.span>
                <motion.span 
                  className="px-2 lg:px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 font-semibold border border-indigo-400/30 whitespace-nowrap"
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
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl lg:rounded-2xl px-3 lg:px-4 py-2 lg:py-3 shadow-xl w-full lg:w-auto lg:min-w-[200px] xl:min-w-[240px] border-l-4 border-l-blue-500 mt-2 lg:mt-0 lg:ml-3"
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
              <div className={`${containerSize === 'sm' ? 'w-8 h-8' : containerSize === 'md' ? 'w-10 h-10' : containerSize === 'lg' ? 'w-12 h-12' : 'w-14 h-14'} bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                <svg className={`${containerSize === 'sm' ? 'w-4 h-4' : containerSize === 'md' ? 'w-5 h-5' : containerSize === 'lg' ? 'w-6 h-6' : 'w-7 h-7'} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className={`text-blue-300 font-semibold uppercase tracking-wide ${currentTextSize.small}`}>{t.totalProduction}</p>
              <motion.p 
                className={`font-bold text-white leading-none tracking-tight mt-1 ${currentTextSize.largeMetric}`}
                key={totalProduction}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
              >
                {totalProduction.toFixed(0)} MWh
              </motion.p>
              <motion.p 
                className={`text-blue-300 font-medium mt-1 flex items-center gap-1 ${currentTextSize.small}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse flex-shrink-0" />
                12.5% {t.increase}
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
        transition={{ delay: 0.6 }}
      >
        {[
          { label: t.kpis.solar, value: `${energyData.solar.toFixed(0)} MWh`, color: 'yellow' },
          { label: t.kpis.wind, value: `${energyData.wind.toFixed(0)} MWh`, color: 'blue' },
          { label: t.kpis.hydro, value: `${energyData.hydro.toFixed(0)} MWh`, color: 'cyan' },
          { label: t.kpis.biomass, value: `${energyData.biomass.toFixed(0)} MWh`, color: 'green' },
        ].map((kpi, index) => (
          <motion.div
            key={kpi.label}
            className="px-2 lg:px-3 py-1 lg:py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow flex items-center gap-1 lg:gap-2 flex-1 min-w-[100px] lg:min-w-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className={`w-1.5 lg:w-2 h-1.5 lg:h-2 rounded-full bg-${kpi.color}-400 animate-pulse flex-shrink-0`} />
            <span className={`font-medium text-blue-200 ${currentTextSize.kpi} truncate`}>{kpi.label}:</span>
            <span className={`font-bold text-white ${currentTextSize.kpi} truncate`}>{kpi.value}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 w-full px-3 lg:px-6 pb-2 lg:pb-3 pt-2 lg:pt-3 overflow-hidden min-h-0">
        <div className="w-full h-full grid grid-cols-1 xl:grid-cols-3 gap-3 lg:gap-4 xl:gap-6" style={{ height: '100%' }}>
          {/* Left Column - Main Metrics */}
          <div className="xl:col-span-2 flex flex-col gap-3 lg:gap-4 min-h-0" style={{ height: '100%' }}>
            {/* Energy Sources Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl lg:rounded-2xl border border-white/20 shadow-lg p-3 lg:p-4 flex-1 flex flex-col min-h-0"
              style={{ height: '100%' }}
            >
              <div className="mb-2 lg:mb-3 flex-shrink-0">
                <p className={`font-bold text-white mb-1 ${currentTextSize.cardTitle}`}>{t.energyOverview}</p>
                <p className={`text-blue-200 ${currentTextSize.cardSubtitle}`}>Renewable energy sources</p>
              </div>
              
              <div className="flex-1 grid grid-cols-2 gap-3 lg:gap-4 min-h-0">
                {Object.entries(energyData).map(([source, value]) => (
                  <motion.div
                    key={source}
                    className="bg-white/5 rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + Object.keys(energyData).indexOf(source) * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-2 lg:mb-3">
                      <h3 className={`font-semibold text-white capitalize ${currentTextSize.body}`}>
                        {t.kpis[source as keyof typeof t.kpis]}
                      </h3>
                      <div className={`w-2 lg:w-3 h-2 lg:h-3 rounded-full ${
                        source === 'solar' ? 'bg-yellow-400 animate-pulse' :
                        source === 'wind' ? 'bg-blue-400' :
                        source === 'hydro' ? 'bg-cyan-400' : 'bg-green-400'
                      }`} />
                    </div>
                    <div className={`font-bold text-white mb-2 ${currentTextSize.largeMetric}`}>
                      {value.toFixed(0)} MWh
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1 lg:h-2">
                      <motion.div 
                        className={`h-1 lg:h-2 rounded-full transition-all duration-1000 ${
                          source === 'solar' ? 'bg-yellow-400' :
                          source === 'wind' ? 'bg-blue-400' :
                          source === 'hydro' ? 'bg-cyan-400' : 'bg-green-400'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(value / 100) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                    <p className={`text-blue-200 mt-1 lg:mt-2 ${currentTextSize.small}`}>
                      {((value / totalProduction) * 100).toFixed(1)}% {t.ofTotal}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Production Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl lg:rounded-2xl border border-white/20 shadow-lg p-3 lg:p-4 flex-shrink-0"
            >
              <div className="mb-2 lg:mb-3 flex-shrink-0">
                <p className={`font-bold text-white mb-1 ${currentTextSize.cardTitle}`}>{t.productionTimeline}</p>
                <p className={`text-blue-200 ${currentTextSize.cardSubtitle}`}>24-hour production overview</p>
              </div>
              
              <div className="h-32 lg:h-40 flex items-end justify-between gap-1 lg:gap-2">
                {[...Array(24)].map((_, hour) => (
                  <div key={hour} className="flex-1 flex flex-col items-center">
                    <motion.div 
                      className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t transition-all duration-1000 hover:from-blue-400 hover:to-cyan-300 cursor-pointer"
                      style={{ 
                        height: `${20 + Math.sin(hour / 4) * 30 + Math.random() * 10}%`,
                        minHeight: '10px'
                      }}
                      whileHover={{ scale: 1.05 }}
                    />
                    <span className={`text-blue-200 mt-1 ${currentTextSize.small}`}>{hour}:00</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Efficiency & Impact */}
          <div className="flex flex-col gap-3 lg:gap-4 min-h-0" style={{ height: '100%' }}>
            {/* System Efficiency */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl lg:rounded-2xl border border-white/20 shadow-lg p-3 lg:p-4 flex flex-col min-h-0"
              style={{ height: '100%' }}
            >
              <div className="text-center mb-2 lg:mb-3 flex-shrink-0">
                <p className={`font-bold text-white mb-1 ${currentTextSize.cardTitle}`}>{t.systemEfficiency}</p>
                <p className={`text-blue-200 ${currentTextSize.cardSubtitle}`}>Overall system performance</p>
              </div>
              
              <div className="flex-1 flex items-center justify-center mb-2 lg:mb-3 min-h-0">
                <EfficiencyGauge efficiency={efficiency} size={containerSize} />
              </div>
            </motion.div>

            {/* Carbon Offset */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl lg:rounded-2xl border border-white/20 shadow-lg p-3 lg:p-4 flex flex-col min-h-0"
              style={{ height: '100%' }}
            >
              <div className="text-center mb-2 lg:mb-3 flex-shrink-0">
                <p className={`font-bold text-white mb-1 ${currentTextSize.cardTitle}`}>{t.carbonOffset}</p>
                <p className={`text-blue-200 ${currentTextSize.cardSubtitle}`}>Environmental impact</p>
              </div>
              
              <div className="flex-1 flex flex-col justify-center items-center mb-2 lg:mb-3 min-h-0">
                <div className={`font-bold text-green-400 mb-2 ${currentTextSize.largeMetric}`}>
                  {(totalProduction * 0.5).toFixed(0)}
                </div>
                <p className={`text-blue-200 text-center mb-3 lg:mb-4 ${currentTextSize.small}`}>
                  {t.tonsAvoided}
                </p>
                <div className="bg-green-500/20 rounded-xl p-2 lg:p-3 w-full">
                  <p className={`text-green-300 text-center ${currentTextSize.small}`}>
                    {t.equivalentTo} {Math.round((totalProduction * 0.5) / 2.3)} {t.carsOffRoadText}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Environmental Impact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl lg:rounded-2xl border border-white/20 shadow-lg p-3 lg:p-4 flex-shrink-0"
            >
              <div className="mb-2 lg:mb-3 flex-shrink-0">
                <p className={`font-bold text-white mb-1 ${currentTextSize.cardTitle}`}>{t.environmentalImpact}</p>
                <p className={`text-blue-200 ${currentTextSize.cardSubtitle}`}>Positive contributions</p>
              </div>
              
              <div className="grid grid-cols-1 gap-2 lg:gap-3">
                {[
                  { icon: '🌳', title: t.forestEquivalent, value: (totalProduction * 1.2).toFixed(0), unit: t.acres, color: 'from-green-500 to-emerald-600' },
                  { icon: '🚗', title: t.carsOffRoad, value: Math.round((totalProduction * 0.5) / 2.3), unit: t.equivalentVehicles, color: 'from-orange-500 to-red-500' },
                  { icon: '🏠', title: t.homesPowered, value: Math.round(totalProduction * 100), unit: t.averageHouseholds, color: 'from-purple-500 to-pink-500' },
                ].map((impact, index) => (
                  <motion.div
                    key={impact.title}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.1 + index * 0.1 }}
                    className={`bg-gradient-to-br ${impact.color} rounded-xl lg:rounded-2xl p-3 text-white`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`${containerSize === 'sm' ? 'text-lg' : containerSize === 'md' ? 'text-xl' : 'text-2xl'}`}>{impact.icon}</div>
                      <h3 className={`font-semibold ${currentTextSize.body}`}>{impact.title}</h3>
                    </div>
                    <p className={`font-bold ${currentTextSize.largeMetric}`}>{impact.value}</p>
                    <p className={`opacity-90 ${currentTextSize.small}`}>{impact.unit}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RenewableEnergyAnalytics;