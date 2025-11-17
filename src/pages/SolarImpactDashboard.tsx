// pages/SolarImpactDashboard.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Translation dictionaries (base defaults)
const baseTranslations = {
  en: {
    title: 'Solar Panels Impact Dashboard',
    subtitle: 'Real-time energy production and CO₂ savings visualization',
    totalProduction: 'Total production',
    totalProductionValue: '8,642 kWh',
    equivalent: '= consumption 2.8 households',
    info: {
      description: 'Dashboard shows the impact of your solar panel installation. Left shows current production, right shows cumulative savings since installation.',
      energyChip: '• Energy',
      savingsChip: '• Savings',
    },
    kpis: {
      todayProduction: 'Today',
      todayValue: '42 kWh produced',
      monthlySavings: 'Monthly savings',
      monthlyValue: '€187',
      systemSize: 'System',
      systemValue: '6.2 kWp',
    },
    leftCard: {
      title: 'Current Production',
      subtitle: 'Real-time performance • weather impact • efficiency',
      legend: {
        directConsumption: 'Direct consumption',
        gridFeed: 'Grid feed-in',
        batteryStorage: 'Battery storage',
        losses: 'System losses',
      },
      footer: 'Live data from inverter, updated every 5 minutes.',
    },
    centerCard: {
      title: 'Optimization Opportunities',
      note: 'Sun as visual element for energy production.',
    },
    rightCard: {
      title: 'Cumulative Savings',
      subtitle: 'Total yield since installation',
      legend: {
        energySavings: 'Energy savings',
        co2Reduction: 'CO₂ reduction',
        financialReturn: 'Financial return',
      },
      footer: 'Calculations based on local energy prices.',
    },
  },
  nl: {
    title: 'Zonnepanelen Impact Dashboard',
    subtitle: 'Realtime energieproductie en CO₂-besparing visualisatie',
    totalProduction: 'Totale productie',
    totalProductionValue: '8.642 kWh',
    equivalent: '= verbruik 2,8 huishoudens',
    info: {
      description: 'Dashboard toont de impact van uw zonnepanelen installatie. Links de huidige productie, rechts de cumulatieve besparing sinds installatie.',
      energyChip: '• Energie',
      savingsChip: '• Besparing',
    },
    kpis: {
      todayProduction: 'Vandaag',
      todayValue: '42 kWh geproduceerd',
      monthlySavings: 'Maandbesparing',
      monthlyValue: '€187',
      systemSize: 'Systeem',
      systemValue: '6.2 kWp',
    },
    leftCard: {
      title: 'Huidige Productie',
      subtitle: 'Realtime prestaties • weersinvloed • efficiëntie',
      legend: {
        directConsumption: 'Direct verbruik',
        gridFeed: 'Teruglevering net',
        batteryStorage: 'Batterij opslag',
        losses: 'Systeem verliezen',
      },
      footer: 'Live data van omvormer, bijgewerkt elke 5 minuten.',
    },
    centerCard: {
      title: 'Optimalisatie Kansen',
      note: 'Zon als visueel element voor energieproductie.',
    },
    rightCard: {
      title: 'Cumulatieve Besparing',
      subtitle: 'Totale opbrengst sinds installatie',
      legend: {
        energySavings: 'Energie besparing',
        co2Reduction: 'CO₂ reductie',
        financialReturn: 'Financieel rendement',
      },
      footer: 'Berekeningen gebaseerd op lokale energieprijzen.',
    },
  },
};

type LangKey = keyof typeof baseTranslations;
type TranslationShape = (typeof baseTranslations)["en"];

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export interface SolarImpactDashboardProps {
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

// Sun Icon Component with responsive scaling
interface SunIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SunIcon = ({ size = 'lg' }: SunIconProps) => {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  };

  return (
    <motion.div 
      className={`relative ${sizeMap[size]} bg-gradient-to-br from-amber-200 to-yellow-400 rounded-xl flex items-center justify-center shadow-lg`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <svg className="w-3/4 h-3/4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l1.41-1.41m9.9 9.9l1.41-1.41" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    </motion.div>
  );
};

// Donut Chart Component with responsive scaling
interface DonutChartProps {
  segments: { value: number; color: string; label: string }[];
  size?: 'sm' | 'md' | 'lg' | 'xl';
  title?: string;
  value?: string;
}

const DonutChart = ({ 
  segments, 
  size = 'lg',
  title = "current",
  value = "42 kWh"
}: DonutChartProps) => {
  const sizeMap = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-36 h-36',
    xl: 'w-44 h-44'
  };

  const textSizeMap = {
    sm: { title: 'text-[8px]', value: 'text-[10px]' },
    md: { title: 'text-[10px]', value: 'text-[12px]' },
    lg: { title: 'text-[11px]', value: 'text-[13px]' },
    xl: { title: 'text-[12px]', value: 'text-[14px]' }
  };

  const currentTextSize = textSizeMap[size];

  const buildConicGradient = () => {
    let currentPercent = 0;
    const gradientStops = segments.map(segment => {
      const stop = `${segment.color} ${currentPercent}% ${currentPercent + segment.value}%`;
      currentPercent += segment.value;
      return stop;
    });
    return `conic-gradient(${gradientStops.join(', ')})`;
  };

  return (
    <motion.div 
      className={`relative ${sizeMap[size]} bg-gradient-to-br from-white/80 to-amber-50/80 rounded-2xl border-2 border-amber-200/50 backdrop-blur-sm shadow-xl flex items-center justify-center`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="relative w-3/4 h-3/4">
        <div
          className="w-full h-full rounded-full"
          style={{
            background: buildConicGradient(),
          }}
        />
        <div className={`absolute inset-1/4 bg-white rounded-full`} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className={`${currentTextSize.title} text-amber-600`}>{title}</p>
          <p className={`${currentTextSize.value} font-semibold text-amber-700`}>{value}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Sun Illustration Component
const SunIllustration = ({ size = 'lg' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  const sizeMap = {
    sm: 'w-20 h-16',
    md: 'w-28 h-20',
    lg: 'w-36 h-24',
    xl: 'w-44 h-28'
  };

  return (
    <motion.div 
      className={`relative ${sizeMap[size]} bg-gradient-to-br from-amber-50/80 to-yellow-100/80 rounded-xl border-2 border-amber-200/50 backdrop-blur-sm shadow-lg flex items-center justify-center`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <svg
        viewBox="0 0 500 200"
        className="w-full h-full"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="250" cy="100" r="40" fill="#ffd700" stroke="none" />
        <path d="M250 60v-10M250 140v10M310 100h10M190 100h-10M285 75l7-7M215 125l-7 7M285 125l7 7M215 75l-7-7" />
        <path d="M80 150c20-25 60-25 80 0M140 150c20-25 60-25 80 0M200 150c20-25 60-25 80 0M260 150c20-25 60-25 80 0M320 150c20-25 60-25 80 0" />
      </svg>
    </motion.div>
  );
};

const SolarImpactDashboard: React.FC<SolarImpactDashboardProps> = ({
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
  const [totalProduction, setTotalProduction] = useState(8642);

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

  // Mock data for donut segments
  const leftSegments = [
    { value: 45, color: '#d4af37', label: t.leftCard.legend.directConsumption },
    { value: 30, color: '#ffd700', label: t.leftCard.legend.gridFeed },
    { value: 15, color: '#ffec99', label: t.leftCard.legend.batteryStorage },
    { value: 10, color: '#fff9db', label: t.leftCard.legend.losses },
  ];

  const rightSegments = [
    { value: 62, color: '#b8860b', label: t.rightCard.legend.energySavings },
    { value: 23, color: '#d4af37', label: t.rightCard.legend.co2Reduction },
    { value: 15, color: '#ffd700', label: t.rightCard.legend.financialReturn },
  ];

  useEffect(() => {
    if (apiConfig.enabled && apiConfig.endpoint) {
      console.log('Fetching solar impact data from:', apiConfig.endpoint);
      // Simulate API data updates
      const interval = setInterval(() => {
        setTotalProduction(prev => prev + Math.random() * 10);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [apiConfig.enabled, apiConfig.endpoint]);

  return (
    <div 
      className="w-full h-full flex flex-col overflow-hidden relative"
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
        maxWidth: width,
        maxHeight: height,
        background: 'radial-gradient(circle at top, #fef9e6 0%, #fff5d6 45%, #ffeaa7 100%)',
      }}
    >
      {/* Floating background accents */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-amber-200/10 to-yellow-200/5"
            style={{
              width: 40 + Math.random() * 80,
              height: 40 + Math.random() * 80,
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
            <SunIcon size={containerSize} />
            <div className="flex-1 min-w-0">
              <motion.h1 
                className={`font-bold text-[#b8860b] leading-tight drop-shadow-sm ${currentTextSize.title} truncate`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {t.title}
              </motion.h1>
              <motion.p 
                className={`text-amber-700 mt-1 ${currentTextSize.subtitle} truncate`}
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
          className="bg-white/90 backdrop-blur-md border border-white/70 rounded-xl lg:rounded-2xl px-3 lg:px-4 py-2 lg:py-3 shadow-xl w-full lg:w-auto lg:min-w-[200px] xl:min-w-[240px] mt-2 lg:mt-0 lg:ml-3"
          initial={{ opacity: 0, scale: 0.9, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <p className={`text-[#d4af37] font-semibold ${currentTextSize.small}`}>{t.totalProduction}</p>
          <motion.p 
            className={`font-bold text-[#d4af37] leading-none mt-1 tracking-tight ${currentTextSize.largeMetric}`}
            key={totalProduction}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
          >
            {totalProduction.toLocaleString()} kWh
          </motion.p>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex gap-[2px]">
              {Array.from({ length: 8 }).map((_, idx) => (
                <motion.svg 
                  key={idx} 
                  viewBox="0 0 24 24" 
                  className={`${containerSize === 'sm' ? 'w-3 h-3' : containerSize === 'md' ? 'w-4 h-4' : 'w-5 h-5'} text-[#d4af37]`}
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                  whileHover={{ scale: 1.1 }}
                >
                  <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l1.41-1.41m9.9 9.9l1.41-1.41" />
                  <circle cx="12" cy="12" r="4" />
                </motion.svg>
              ))}
            </div>
            <p className={`text-[#d4af37] italic ${currentTextSize.small}`}>{t.equivalent}</p>
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
        <div className="w-full bg-white/80 backdrop-blur-md border border-white/70 rounded-xl lg:rounded-2xl px-3 lg:px-4 py-2 lg:py-3 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2 lg:gap-4 shadow-sm">
          <p className={`text-amber-800 leading-relaxed flex-1 ${currentTextSize.body} line-clamp-2`}>
            {t.info.description}
          </p>
          <div className="flex gap-1 lg:gap-2 flex-shrink-0">
            <motion.span 
              className="px-2 lg:px-3 py-1 rounded-full bg-[#fff9db] text-[#b8860b] font-semibold border border-amber-200/30 whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
            >
              <span className={currentTextSize.small}>{t.info.energyChip}</span>
            </motion.span>
            <motion.span 
              className="px-2 lg:px-3 py-1 rounded-full bg-[#ffec99] text-[#d4af37] font-semibold border border-amber-300/30 whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
            >
              <span className={currentTextSize.small}>{t.info.savingsChip}</span>
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
          { label: t.kpis.todayProduction, value: t.kpis.todayValue, color: 'amber' },
          { label: t.kpis.monthlySavings, value: t.kpis.monthlyValue, color: 'amber' },
          { label: t.kpis.systemSize, value: t.kpis.systemValue, color: 'amber' },
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
            <span className={`font-bold text-amber-800 ${currentTextSize.kpi} truncate`}>{kpi.value}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Main content */}
      <main className="relative z-10 flex-1 w-full px-3 lg:px-6 pb-2 lg:pb-3 pt-2 lg:pt-3 overflow-hidden min-h-0">
        <div className="w-full h-full grid grid-cols-1 xl:grid-cols-3 gap-2 lg:gap-4 xl:gap-6" style={{ height: '100%' }}>
          {/* Left Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/90 backdrop-blur-md rounded-xl lg:rounded-2xl border border-white/70 shadow-lg p-3 lg:p-4 flex flex-col min-h-0"
            style={{ height: '100%' }}
          >
            <div className="mb-2 lg:mb-3 flex-shrink-0">
              <p className={`font-semibold text-[#b8860b] ${currentTextSize.cardTitle}`}>{t.leftCard.title}</p>
              <p className={`text-amber-600 ${currentTextSize.cardSubtitle}`}>{t.leftCard.subtitle}</p>
            </div>
            
            <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-3 lg:gap-4 mb-2 lg:mb-3 min-h-0">
              <DonutChart 
                segments={leftSegments} 
                size={containerSize}
                title={activeLang === 'nl' ? 'huidig' : 'current'}
                value="42 kWh"
              />
              
              {/* Legend */}
              <div className="flex flex-col gap-2 lg:gap-3 w-full lg:w-auto">
                {leftSegments.map((segment, index) => (
                  <motion.div
                    key={segment.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <span 
                      className={`mt-1 ${containerSize === 'sm' ? 'w-2 h-2' : 'w-3 h-3'} rounded-full flex-shrink-0`}
                      style={{ backgroundColor: segment.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-amber-800 ${currentTextSize.small}`}>{segment.label}</p>
                      <p className={`text-amber-600 ${currentTextSize.small}`}>{segment.value}%</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <p className={`text-amber-600 ${currentTextSize.small} flex-shrink-0`}>{t.leftCard.footer}</p>
          </motion.div>

          {/* Center Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-white/60 backdrop-blur-md rounded-xl lg:rounded-2xl border border-white/50 shadow-lg p-3 lg:p-4 flex flex-col items-center justify-center gap-2 lg:gap-3 min-h-0"
            style={{ height: '100%' }}
          >
            <p className={`font-semibold text-amber-700 text-center ${currentTextSize.cardTitle}`}>{t.centerCard.title}</p>
            
            <SunIllustration size={containerSize} />
            
            <p className={`text-amber-600 text-center ${currentTextSize.small}`}>{t.centerCard.note}</p>
          </motion.div>

          {/* Right Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white/90 backdrop-blur-md rounded-xl lg:rounded-2xl border border-white/70 shadow-lg p-3 lg:p-4 flex flex-col min-h-0"
            style={{ height: '100%' }}
          >
            <div className="mb-2 lg:mb-3 flex-shrink-0 text-center lg:text-right">
              <p className={`font-semibold text-[#b8860b] ${currentTextSize.cardTitle}`}>{t.rightCard.title}</p>
              <p className={`text-amber-600 ${currentTextSize.cardSubtitle}`}>{t.rightCard.subtitle}</p>
            </div>
            
            <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-3 lg:gap-4 mb-2 lg:mb-3 min-h-0">
              <DonutChart 
                segments={rightSegments} 
                size={containerSize}
                title={activeLang === 'nl' ? 'totaal' : 'total'}
                value="8.642 kWh"
              />
              
              {/* Legend */}
              <div className="flex flex-col gap-2 lg:gap-3 w-full lg:w-auto">
                {rightSegments.map((segment, index) => (
                  <motion.div
                    key={segment.label}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <span 
                      className={`mt-1 ${containerSize === 'sm' ? 'w-2 h-2' : 'w-3 h-3'} rounded-full flex-shrink-0`}
                      style={{ backgroundColor: segment.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-amber-800 ${currentTextSize.small}`}>{segment.label}</p>
                      <p className={`text-amber-600 ${currentTextSize.small}`}>{segment.value}%</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <p className={`text-amber-600 ${currentTextSize.small} text-right flex-shrink-0`}>{t.rightCard.footer}</p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default SolarImpactDashboard;