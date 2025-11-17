// pages/SolarLiveDashboard.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Translation dictionaries (base defaults)
const baseTranslations = {
  en: {
    title: 'Live Solar Energy Dashboard',
    subtitle: 'Real-time monitoring and performance analytics',
    totalProduction: 'Today produced',
    totalProductionValue: '24.8 kWh',
    equivalent: '= 124 km electric driving',
    info: {
      description: 'Real-time monitoring of your solar panel system with advanced visualizations and live performance metrics.',
      liveChip: '• Live Data',
      smartChip: '• Smart Analytics',
    },
    kpis: {
      currentPower: 'Current power',
      currentValue: '3.2 kW',
      dailyTarget: 'Daily target',
      targetValue: '28 kWh',
      efficiency: 'System efficiency',
      efficiencyValue: '94.2%',
    },
    leftCard: {
      title: 'Live Power Production',
      subtitle: 'Real-time power curve • peak performance',
      legend: {
        current: 'Current power',
        predicted: 'Predicted',
        optimal: 'Optimal curve',
      },
      footer: 'Data updates every 15 seconds • Cloud connected',
    },
    centerCard: {
      title: 'Energy Flow',
      note: 'Live animation of energy distribution',
    },
    rightCard: {
      title: 'Daily Performance',
      subtitle: 'Hour-by-hour production analysis',
      legend: {
        produced: 'Produced',
        consumed: 'Consumed',
        exported: 'Exported',
      },
      footer: 'Comparison with historical data',
    },
  },
  nl: {
    title: 'Live Zonne-energie Dashboard',
    subtitle: 'Realtime monitoring en prestatie analytics',
    totalProduction: 'Vandaag geproduceerd',
    totalProductionValue: '24.8 kWh',
    equivalent: '= 124 km elektrisch rijden',
    info: {
      description: 'Real-time monitoring van uw zonnepanelen systeem met geavanceerde visualisaties en live prestatie metrics.',
      liveChip: '• Live Data',
      smartChip: '• Smart Analytics',
    },
    kpis: {
      currentPower: 'Huidig vermogen',
      currentValue: '3.2 kW',
      dailyTarget: 'Dagelijkse target',
      targetValue: '28 kWh',
      efficiency: 'Systeem efficiëntie',
      efficiencyValue: '94.2%',
    },
    leftCard: {
      title: 'Live Productie Stroom',
      subtitle: 'Real-time vermogenscurve • piek prestatie',
      legend: {
        current: 'Huidig vermogen',
        predicted: 'Voorspeld',
        optimal: 'Optimale curve',
      },
      footer: 'Data update elke 15 seconden • Cloud connected',
    },
    centerCard: {
      title: 'Energie Stroom',
      note: 'Live animatie van energie distributie',
    },
    rightCard: {
      title: 'Dagelijkse Prestatie',
      subtitle: 'Uur-tot-uur productie analyse',
      legend: {
        produced: 'Geproduceerd',
        consumed: 'Verbruikt',
        exported: 'Geëxporteerd',
      },
      footer: 'Vergelijking met historische data',
    },
  },
};

type LangKey = keyof typeof baseTranslations;
type TranslationShape = (typeof baseTranslations)["en"];

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export interface SolarLiveDashboardProps {
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

// Animated Sun Component with responsive scaling
interface AnimatedSunProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const AnimatedSun = ({ size = 'lg' }: AnimatedSunProps) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14'
  };

  const [rotation, setRotation] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      animate={{ rotate: rotation }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className={`relative ${sizeMap[size]}`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <motion.circle
          cx="50"
          cy="50"
          r="20"
          fill="#FFD700"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.line
            key={i}
            x1="50"
            y1="15"
            x2="50"
            y2="25"
            stroke="#FF8C00"
            strokeWidth="3"
            transform={`rotate(${i * 30} 50 50)`}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
          />
        ))}
      </svg>
    </motion.div>
  );
};

// Power Meter Component with responsive scaling
interface PowerMeterProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const PowerMeter = ({ value, max = 5, size = 'lg' }: PowerMeterProps) => {
  const percentage = (value / max) * 100;
  const sizeMap = {
    sm: 'w-20 h-2',
    md: 'w-24 h-3',
    lg: 'w-28 h-3',
    xl: 'w-32 h-4'
  };

  const textSizeMap = {
    sm: 'text-[8px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-sm'
  };

  return (
    <div className={`relative ${sizeMap[size]} bg-gray-200/80 rounded-full overflow-hidden backdrop-blur-sm`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`font-bold text-gray-800 ${textSizeMap[size]} drop-shadow-sm`}>
          {value.toFixed(1)} kW
        </span>
      </div>
    </div>
  );
};

// Energy Flow Component with responsive scaling
interface EnergyFlowProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const EnergyFlow = ({ size = 'lg' }: EnergyFlowProps) => {
  const sizeMap = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-40 h-40',
    xl: 'w-48 h-48'
  };

  const [active, setActive] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActive(prev => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className={`relative ${sizeMap[size]} bg-gradient-to-br from-blue-50/80 to-cyan-100/80 rounded-2xl border-2 border-blue-200/50 backdrop-blur-sm shadow-xl flex items-center justify-center`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <svg viewBox="0 0 200 200" className="w-4/5 h-4/5">
        {/* Sun */}
        <motion.circle
          cx="100"
          cy="50"
          r="15"
          fill="#FFD700"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Solar Panel */}
        <motion.rect 
          x="75" 
          y="120" 
          width="50" 
          height="30" 
          fill="#2D3748"
          animate={{ y: [120, 118, 120] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <line x1="100" y1="120" x2="100" y2="110" stroke="#4A5568" strokeWidth="2" />
        
        {/* Energy Flow Lines */}
        <motion.path
          d="M100 65 L100 110"
          stroke="#FF8C00"
          strokeWidth="3"
          strokeDasharray="5,5"
          animate={{ strokeDashoffset: [0, -10] }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Consumption */}
        <motion.rect
          x="140"
          y="130"
          width="20"
          height="20"
          fill={active === 0 ? "#48BB78" : "#A0AEC0"}
          animate={{ 
            fill: active === 0 ? "#48BB78" : "#A0AEC0",
            scale: active === 0 ? [1, 1.1, 1] : 1
          }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Battery */}
        <motion.rect
          x="100"
          y="130"
          width="20"
          height="20"
          fill={active === 1 ? "#4299E1" : "#A0AEC0"}
          animate={{ 
            fill: active === 1 ? "#4299E1" : "#A0AEC0",
            scale: active === 1 ? [1, 1.1, 1] : 1
          }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Grid Export */}
        <motion.rect
          x="60"
          y="130"
          width="20"
          height="20"
          fill={active === 2 ? "#ED8936" : "#A0AEC0"}
          animate={{ 
            fill: active === 2 ? "#ED8936" : "#A0AEC0",
            scale: active === 2 ? [1, 1.1, 1] : 1
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Connection lines */}
        <motion.path
          d="M120 120 L140 140"
          stroke={active === 0 ? "#48BB78" : "#CBD5E0"}
          strokeWidth="2"
          animate={{ strokeWidth: active === 0 ? [2, 3, 2] : 2 }}
          transition={{ duration: 0.5 }}
        />
        <motion.path
          d="M100 110 L110 130"
          stroke={active === 1 ? "#4299E1" : "#CBD5E0"}
          strokeWidth="2"
          animate={{ strokeWidth: active === 1 ? [2, 3, 2] : 2 }}
          transition={{ duration: 0.5 }}
        />
        <motion.path
          d="M100 110 L90 130"
          stroke={active === 2 ? "#ED8936" : "#CBD5E0"}
          strokeWidth="2"
          animate={{ strokeWidth: active === 2 ? [2, 3, 2] : 2 }}
          transition={{ duration: 0.5 }}
        />
      </svg>
    </motion.div>
  );
};

const SolarLiveDashboard: React.FC<SolarLiveDashboardProps> = ({
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
  const [containerSize, setContainerSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');
  const [currentPower, setCurrentPower] = useState(3.2);
  const [totalProduction, setTotalProduction] = useState(24.8);

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

  // Mock data for daily production bars
  const dailyData = [25, 40, 60, 80, 95, 100, 85, 70, 55, 35, 20, 10];

  useEffect(() => {
    if (apiConfig.enabled && apiConfig.endpoint) {
      console.log('Fetching solar live data from:', apiConfig.endpoint);
    }

    const interval = setInterval(() => {
      setCurrentPower(prev => {
        const variation = (Math.random() - 0.5) * 0.4;
        return Math.max(0.5, Math.min(4.5, prev + variation));
      });
      
      setTotalProduction(prev => prev + (Math.random() * 0.1));
    }, 3000);
    
    return () => clearInterval(interval);
  }, [apiConfig.enabled, apiConfig.endpoint]);

  return (
    <div 
      className="w-full h-full flex flex-col overflow-hidden relative"
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
        maxWidth: width,
        maxHeight: height,
        background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.8) 0%, rgba(224,242,254,0.6) 40%, rgba(186,230,253,0.4) 100%)',
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-yellow-200/10 to-orange-200/5"
            style={{
              width: 30 + Math.random() * 60,
              height: 30 + Math.random() * 60,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -15, 0],
              x: [0, Math.random() * 8 - 4, 0],
            }}
            transition={{
              duration: 12 + Math.random() * 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Top bar */}
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
              className={`${containerSize === 'sm' ? 'w-8 h-8' : containerSize === 'md' ? 'w-10 h-10' : containerSize === 'lg' ? 'w-12 h-12' : 'w-14 h-14'} bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <svg className={`${containerSize === 'sm' ? 'w-4 h-4' : containerSize === 'md' ? 'w-5 h-5' : containerSize === 'lg' ? 'w-6 h-6' : 'w-7 h-7'} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </motion.div>
            <div className="flex-1 min-w-0">
              <motion.h1 
                className={`font-bold bg-gradient-to-r from-cyan-600 to-blue-800 bg-clip-text text-transparent leading-tight ${currentTextSize.title} truncate`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {t.title}
              </motion.h1>
              <motion.p 
                className={`text-cyan-600 mt-1 font-light ${currentTextSize.subtitle} truncate`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {t.subtitle}
              </motion.p>
            </div>
          </div>
        </div>

        {/* Hero metric card */}
        <motion.div 
          className="bg-white/90 backdrop-blur-lg border border-white/70 rounded-xl lg:rounded-2xl px-3 lg:px-4 py-2 lg:py-3 shadow-xl w-full lg:w-auto lg:min-w-[200px] xl:min-w-[240px] border-l-4 border-l-cyan-500 mt-2 lg:mt-0 lg:ml-3"
          initial={{ opacity: 0, scale: 0.9, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <div className="flex items-center gap-2 lg:gap-3">
            <AnimatedSun size={containerSize} />
            <div className="flex-1 min-w-0">
              <p className={`text-cyan-600 font-semibold uppercase tracking-wide ${currentTextSize.small}`}>{t.totalProduction}</p>
              <motion.p 
                className={`font-bold text-cyan-700 leading-none tracking-tight mt-1 ${currentTextSize.largeMetric}`}
                key={totalProduction.toFixed(1)}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
              >
                {totalProduction.toFixed(1)} kWh
              </motion.p>
              <motion.p 
                className={`text-cyan-600 font-medium mt-1 flex items-center gap-1 ${currentTextSize.small}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <svg viewBox="0 0 24 24" className={`${containerSize === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} text-cyan-500`} fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </motion.div>
                {t.equivalent}
              </motion.p>
            </div>
          </div>
        </motion.div>
      </motion.header>

      {/* Top info bar */}
      <motion.div 
        className="relative z-10 w-full px-3 lg:px-6 mt-2 lg:mt-3"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="w-full bg-white/80 backdrop-blur-lg border border-white/70 rounded-xl lg:rounded-2xl px-3 lg:px-4 py-2 lg:py-3 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2 lg:gap-4 shadow-lg">
          <p className={`text-cyan-800 leading-relaxed font-medium flex-1 ${currentTextSize.body} line-clamp-2`}>
            {t.info.description}
          </p>
          <div className="flex gap-1 lg:gap-2 flex-shrink-0">
            <motion.span 
              className="px-2 lg:px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 font-semibold border border-cyan-200/30 whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
            >
              <span className={currentTextSize.small}>{t.info.liveChip}</span>
            </motion.span>
            <motion.span 
              className="px-2 lg:px-3 py-1 rounded-full bg-teal-100 text-teal-700 font-semibold border border-teal-200/30 whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
            >
              <span className={currentTextSize.small}>{t.info.smartChip}</span>
            </motion.span>
          </div>
        </div>
      </motion.div>

      {/* KPI row */}
      <motion.div 
        className="relative z-10 w-full px-3 lg:px-6 mt-2 lg:mt-3 flex flex-wrap gap-1 lg:gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {[
          { label: t.kpis.currentPower, value: `${currentPower.toFixed(1)} kW`, color: 'cyan' },
          { label: t.kpis.dailyTarget, value: t.kpis.targetValue, color: 'teal' },
          { label: t.kpis.efficiency, value: t.kpis.efficiencyValue, color: 'green' },
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
            <span className={`font-bold text-cyan-800 ${currentTextSize.kpi} truncate`}>{kpi.value}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Main content */}
      <main className="relative z-10 flex-1 w-full px-3 lg:px-6 pb-2 lg:pb-3 pt-2 lg:pt-3 overflow-hidden min-h-0">
        <div className="w-full h-full grid grid-cols-1 xl:grid-cols-3 gap-2 lg:gap-4 xl:gap-6" style={{ height: '100%' }}>
          {/* Left Card - Live Power */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl border border-white/60 shadow-lg p-3 lg:p-4 flex flex-col min-h-0"
            style={{ height: '100%' }}
          >
            <div className="mb-2 lg:mb-3 flex-shrink-0">
              <p className={`font-bold text-cyan-800 mb-1 ${currentTextSize.cardTitle}`}>{t.leftCard.title}</p>
              <p className={`text-cyan-600 ${currentTextSize.cardSubtitle}`}>{t.leftCard.subtitle}</p>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center gap-3 lg:gap-4 mb-2 lg:mb-3 min-h-0">
              {/* Animated Power Meter */}
              <div className="text-center">
                <PowerMeter value={currentPower} size={containerSize} />
                <p className={`text-cyan-600 mt-2 ${currentTextSize.small}`}>Live Power Output</p>
              </div>

              {/* Animated Chart */}
              <div className="w-full h-20 lg:h-24 relative">
                <svg viewBox="0 0 300 100" className="w-full h-full">
                  {/* Grid lines */}
                  {[0, 25, 50, 75, 100].map((y) => (
                    <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="#E2E8F0" strokeWidth="1" />
                  ))}
                  
                  {/* Optimal curve */}
                  <motion.path
                    d="M0,80 C50,60 100,40 150,30 C200,20 250,25 300,30"
                    stroke="#CBD5E0"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="4,4"
                  />
                  
                  {/* Live curve */}
                  <motion.path
                    d="M0,75 C50,55 100,35 150,25 C200,15 250,20 300,25"
                    stroke="#0EA5E9"
                    strokeWidth="3"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                  
                  {/* Animated dot */}
                  <motion.circle
                    cx="150"
                    cy="25"
                    r="4"
                    fill="#0EA5E9"
                    animate={{ 
                      cx: [150, 200, 250, 300, 150],
                      cy: [25, 20, 25, 30, 25],
                    }}
                    transition={{ 
                      duration: 8, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </svg>
              </div>

              {/* Legend */}
              <div className="flex gap-2 lg:gap-3 flex-shrink-0">
                <div className="flex items-center gap-1">
                  <div className="w-2 lg:w-3 h-0.5 bg-cyan-500" />
                  <span className={`text-cyan-700 ${currentTextSize.small}`}>{t.leftCard.legend.current}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 lg:w-3 h-0.5 bg-gray-400" />
                  <span className={`text-gray-600 ${currentTextSize.small}`}>{t.leftCard.legend.optimal}</span>
                </div>
              </div>
            </div>
            
            <p className={`text-cyan-600 ${currentTextSize.small} text-center flex-shrink-0`}>{t.leftCard.footer}</p>
          </motion.div>

          {/* Center Card - Energy Flow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-white/60 backdrop-blur-lg rounded-xl lg:rounded-2xl border border-white/50 shadow-lg p-3 lg:p-4 flex flex-col items-center justify-center gap-2 lg:gap-3 min-h-0"
            style={{ height: '100%' }}
          >
            <p className={`font-semibold text-cyan-700 text-center ${currentTextSize.cardTitle}`}>{t.centerCard.title}</p>
            
            <EnergyFlow size={containerSize} />
            
            <div className="flex gap-1 lg:gap-2 flex-shrink-0">
              <div className="flex items-center gap-1">
                <div className={`${containerSize === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'} bg-green-500 rounded-full`} />
                <span className={currentTextSize.small}>Consumption</span>
              </div>
              <div className="flex items-center gap-1">
                <div className={`${containerSize === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'} bg-blue-500 rounded-full`} />
                <span className={currentTextSize.small}>Battery</span>
              </div>
              <div className="flex items-center gap-1">
                <div className={`${containerSize === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'} bg-orange-500 rounded-full`} />
                <span className={currentTextSize.small}>Grid</span>
              </div>
            </div>
            
            <p className={`text-cyan-600 text-center ${currentTextSize.small}`}>{t.centerCard.note}</p>
          </motion.div>

          {/* Right Card - Daily Performance */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl border border-white/60 shadow-lg p-3 lg:p-4 flex flex-col min-h-0"
            style={{ height: '100%' }}
          >
            <div className="mb-2 lg:mb-3 flex-shrink-0 text-center lg:text-right">
              <p className={`font-bold text-cyan-800 mb-1 ${currentTextSize.cardTitle}`}>{t.rightCard.title}</p>
              <p className={`text-cyan-600 ${currentTextSize.cardSubtitle}`}>{t.rightCard.subtitle}</p>
            </div>
            
            <div className="flex-1 flex items-center justify-center mb-2 lg:mb-3 min-h-0">
              <div className="w-full max-w-xs">
                {/* Animated bar chart */}
                <div className="flex items-end justify-between h-20 lg:h-24 gap-1">
                  {dailyData.map((height, index) => (
                    <motion.div
                      key={index}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ 
                        duration: 1, 
                        delay: index * 0.1,
                        ease: "easeOut"
                      }}
                      className="flex-1 bg-gradient-to-t from-cyan-500 to-cyan-300 rounded-t relative group"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="absolute -top-5 lg:-top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-gray-800 text-white px-1 lg:px-2 py-0.5 lg:py-1 rounded">
                          <span className={currentTextSize.small}>{height}%</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Time labels */}
                <div className="flex justify-between mt-1 lg:mt-2">
                  <span className={`text-cyan-600 ${currentTextSize.small}`}>06:00</span>
                  <span className={`text-cyan-600 ${currentTextSize.small}`}>12:00</span>
                  <span className={`text-cyan-600 ${currentTextSize.small}`}>18:00</span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-2 lg:gap-3 flex-shrink-0">
              <div className="flex items-center gap-1">
                <div className={`${containerSize === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} bg-cyan-400 rounded`} />
                <span className={`text-cyan-700 ${currentTextSize.small}`}>{t.rightCard.legend.produced}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className={`${containerSize === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} bg-green-400 rounded`} />
                <span className={`text-green-700 ${currentTextSize.small}`}>{t.rightCard.legend.consumed}</span>
              </div>
            </div>
            
            <p className={`text-cyan-600 ${currentTextSize.small} text-center lg:text-right mt-2 lg:mt-3 flex-shrink-0`}>
              {t.rightCard.footer}
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default SolarLiveDashboard;