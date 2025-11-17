// pages/SolarSystemPerformance.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Translation dictionaries (base defaults)
const baseTranslations = {
  en: {
    title: 'System Performance Analysis',
    subtitle: 'Technical efficiency and component performance',
    systemEfficiency: 'System efficiency',
    efficiencyValue: '92.4%',
    optimal: '= optimal performance',
    info: {
      description: 'Technical analysis of your solar panel system. Left shows component efficiency, right shows system performance under different conditions.',
      technicalChip: '• Technical',
      performanceChip: '• Performance',
    },
    kpis: {
      panelEfficiency: 'Panel efficiency',
      panelValue: '21.8%',
      inverterEfficiency: 'Inverter efficiency',
      inverterValue: '97.2%',
      temperature: 'Temperature coefficient',
      tempValue: '-0.34%/°C',
    },
    leftCard: {
      title: 'Component Efficiency',
      subtitle: 'Energy loss analysis • performance metrics',
      legend: {
        panels: 'Solar panels',
        inverter: 'Inverter',
        wiring: 'Wiring',
        degradation: 'Annual degradation',
      },
      footer: 'Measured under standard test conditions (STC).',
    },
    centerCard: {
      title: 'Performance Curve',
      note: 'IV-curve of solar panels under different light conditions.',
    },
    rightCard: {
      title: 'System Performance',
      subtitle: 'Performance under different conditions',
      legend: {
        optimal: 'Optimal conditions',
        cloudy: 'Cloudy weather',
        highTemp: 'High temperature',
        lowLight: 'Low light',
      },
      footer: 'Data collected over past 12 months.',
    },
  },
  nl: {
    title: 'Systeem Prestatie Analyse',
    subtitle: 'Technische efficiëntie en componentprestaties',
    systemEfficiency: 'Systeem efficiëntie',
    efficiencyValue: '92.4%',
    optimal: '= optimale prestatie',
    info: {
      description: 'Technische analyse van uw zonnepanelen systeem. Links de component efficiëntie, rechts de systeemprestaties onder verschillende condities.',
      technicalChip: '• Technisch',
      performanceChip: '• Prestatie',
    },
    kpis: {
      panelEfficiency: 'Paneel efficiëntie',
      panelValue: '21.8%',
      inverterEfficiency: 'Omvormer efficiëntie',
      inverterValue: '97.2%',
      temperature: 'Temperatuur coëfficiënt',
      tempValue: '-0.34%/°C',
    },
    leftCard: {
      title: 'Component Efficiëntie',
      subtitle: 'Energieverlies analyse • prestatie metrics',
      legend: {
        panels: 'Zonnepanelen',
        inverter: 'Omvormer',
        wiring: 'Bedrading',
        degradation: 'Jaarlijkse degradatie',
      },
      footer: 'Gemeten onder standaard testcondities (STC).',
    },
    centerCard: {
      title: 'Prestatie Curve',
      note: 'IV-curve van zonnepanelen onder verschillende lichtcondities.',
    },
    rightCard: {
      title: 'Systeem Prestaties',
      subtitle: 'Prestatie onder verschillende omstandigheden',
      legend: {
        optimal: 'Optimale condities',
        cloudy: 'Bewolkt weer',
        highTemp: 'Hoge temperatuur',
        lowLight: 'Laag licht',
      },
      footer: 'Data verzameld over afgelopen 12 maanden.',
    },
  },
};

type LangKey = keyof typeof baseTranslations;
type TranslationShape = (typeof baseTranslations)["en"];

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export interface SolarSystemPerformanceProps {
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

// Performance Curve Component with responsive scaling
interface PerformanceCurveProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const PerformanceCurve = ({ size = 'lg' }: PerformanceCurveProps) => {
  const sizeMap = {
    sm: 'w-20 h-16',
    md: 'w-28 h-20',
    lg: 'w-36 h-24',
    xl: 'w-44 h-28'
  };

  return (
    <motion.div 
      className={`relative ${sizeMap[size]} bg-gradient-to-br from-gray-50/80 to-slate-100/80 rounded-xl border-2 border-gray-200/50 backdrop-blur-sm shadow-lg flex items-center justify-center`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <svg
        viewBox="0 0 500 200"
        className="w-full h-full"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <path 
          d="M50 150 L80 140 L110 120 L140 100 L170 85 L200 75 L230 70 L260 75 L290 85 L320 100 L350 120 L380 140 L410 150" 
          stroke="#495057" 
          strokeWidth="3"
        />
        <path 
          d="M50 150 L80 130 L110 100 L140 70 L170 50 L200 40 L230 45 L260 60 L290 80 L320 105 L350 125 L380 140 L410 150" 
          stroke="#6c757d" 
          strokeWidth="2" 
          strokeDasharray="4 4"
        />
        <path 
          d="M50 150 L80 120 L110 80 L140 50 L170 30 L200 25 L230 30 L260 45 L290 65 L320 90 L350 110 L380 125 L410 135" 
          stroke="#adb5bd" 
          strokeWidth="2" 
          strokeDasharray="2 2"
        />
      </svg>
    </motion.div>
  );
};

// Efficiency Donut Component with responsive scaling
interface EfficiencyDonutProps {
  efficiency?: number;
  segments: { value: number; color: string; label: string }[];
  size?: 'sm' | 'md' | 'lg' | 'xl';
  title?: string;
  value?: string;
}

const EfficiencyDonut = ({ 
  efficiency = 92.4, 
  segments, 
  size = 'lg',
  title = "efficiency",
  value = "92.4%"
}: EfficiencyDonutProps) => {
  const sizeMap = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-40 h-40',
    xl: 'w-48 h-48'
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
      className={`relative ${sizeMap[size]} bg-gradient-to-br from-white/80 to-gray-50/80 rounded-2xl border-2 border-gray-200/50 backdrop-blur-sm shadow-xl flex items-center justify-center`}
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
          <p className={`${currentTextSize.title} text-gray-500`}>{title}</p>
          <p className={`${currentTextSize.value} font-semibold text-gray-700`}>{value}</p>
        </div>
      </div>
    </motion.div>
  );
};

const SolarSystemPerformance: React.FC<SolarSystemPerformanceProps> = ({
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
  const [systemEfficiency, setSystemEfficiency] = useState(92.4);

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
    { value: 78, color: '#495057', label: t.leftCard.legend.panels },
    { value: 14, color: '#6c757d', label: t.leftCard.legend.inverter },
    { value: 5, color: '#adb5bd', label: t.leftCard.legend.wiring },
    { value: 3, color: '#dee2e6', label: t.leftCard.legend.degradation },
  ];

  const rightSegments = [
    { value: 38, color: '#28a745', label: t.rightCard.legend.optimal },
    { value: 27, color: '#20c997', label: t.rightCard.legend.cloudy },
    { value: 20, color: '#ffc107', label: t.rightCard.legend.highTemp },
    { value: 15, color: '#fd7e14', label: t.rightCard.legend.lowLight },
  ];

  useEffect(() => {
    if (apiConfig.enabled && apiConfig.endpoint) {
      console.log('Fetching solar data from:', apiConfig.endpoint);
      // Simulate API data updates
      const interval = setInterval(() => {
        setSystemEfficiency(prev => Math.max(85, Math.min(98, prev + (Math.random() * 2 - 1))));
      }, 5000);
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
        background: 'radial-gradient(circle at top, #f8f9fa 0%, #e9ecef 45%, #dee2e6 100%)',
      }}
    >
      {/* Floating background accents */}
      <div className="pointer-events-none absolute -top-16 -left-10 w-60 h-60 bg-[#e9ecef] rounded-full opacity-60 blur-3xl" />
      <div className="pointer-events-none absolute top-20 right-5 w-52 h-52 bg-[#dee2e6] rounded-full opacity-60 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-[#ced4da] rounded-full opacity-30 blur-3xl" />

      {/* Top bar */}
      <motion.header 
        className="relative z-10 w-full px-3 lg:px-6 pt-3 lg:pt-4 flex flex-col lg:flex-row items-start justify-between gap-3 lg:gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex-1 w-full lg:w-auto">
          <motion.h1 
            className={`font-bold text-[#495057] leading-tight drop-shadow-sm ${currentTextSize.title}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {t.title}
          </motion.h1>
          <motion.p 
            className={`text-gray-600 mt-1 ${currentTextSize.subtitle}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {t.subtitle}
          </motion.p>
        </div>

        {/* Hero metric card */}
        <motion.div 
          className="bg-white/90 backdrop-blur-md border border-white/70 rounded-xl lg:rounded-2xl px-3 lg:px-4 py-2 lg:py-3 shadow-lg w-full lg:w-auto lg:min-w-[200px] xl:min-w-[240px]"
          initial={{ opacity: 0, scale: 0.9, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <p className={`text-[#6c757d] font-semibold ${currentTextSize.small}`}>{t.systemEfficiency}</p>
          <motion.p 
            className={`font-bold text-[#495057] leading-none mt-1 tracking-tight ${currentTextSize.largeMetric}`}
            key={systemEfficiency.toFixed(1)}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
          >
            {systemEfficiency.toFixed(1)}%
          </motion.p>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex gap-[2px]">
              {Array.from({ length: 8 }).map((_, idx) => (
                <motion.svg 
                  key={idx} 
                  viewBox="0 0 24 24" 
                  className={`${containerSize === 'sm' ? 'w-3 h-3' : containerSize === 'md' ? 'w-4 h-4' : 'w-5 h-5'} text-[#495057]`}
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                  whileHover={{ scale: 1.1 }}
                >
                  <path d="M12 20V10M18 20V4M6 20v-4" />
                </motion.svg>
              ))}
            </div>
            <p className={`text-[#495057] italic ${currentTextSize.small}`}>{t.optimal}</p>
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
          <p className={`text-gray-700 leading-relaxed flex-1 ${currentTextSize.body}`}>
            {t.info.description}
          </p>
          <div className="flex gap-1 lg:gap-2 flex-shrink-0">
            <motion.span 
              className="px-2 lg:px-3 py-1 rounded-full bg-[#e9ecef] text-[#495057] font-semibold border border-gray-300/30 whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
            >
              <span className={currentTextSize.small}>{t.info.technicalChip}</span>
            </motion.span>
            <motion.span 
              className="px-2 lg:px-3 py-1 rounded-full bg-[#dee2e6] text-[#6c757d] font-semibold border border-gray-400/30 whitespace-nowrap"
              whileHover={{ scale: 1.05 }}
            >
              <span className={currentTextSize.small}>{t.info.performanceChip}</span>
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
          { label: t.kpis.panelEfficiency, value: t.kpis.panelValue, color: 'gray' },
          { label: t.kpis.inverterEfficiency, value: t.kpis.inverterValue, color: 'gray' },
          { label: t.kpis.temperature, value: t.kpis.tempValue, color: 'gray' },
        ].map((kpi, index) => (
          <motion.div
            key={kpi.label}
            className="px-2 lg:px-3 py-1 lg:py-2 bg-white/40 backdrop-blur-md rounded-lg border border-white/50 shadow flex items-center gap-1 lg:gap-2 flex-1 min-w-[100px] lg:min-w-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className={`w-1.5 lg:w-2 h-1.5 lg:h-2 rounded-full bg-${kpi.color}-400 animate-pulse flex-shrink-0`} />
            <span className={`font-medium ${currentTextSize.kpi} truncate`}>{kpi.label}:</span>
            <span className={`font-bold text-gray-800 ${currentTextSize.kpi} truncate`}>{kpi.value}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Main content */}
      <main className="relative z-10 flex-1 w-full px-3 lg:px-6 pb-2 lg:pb-3 pt-2 lg:pt-3 overflow-hidden min-h-0">
        <div className="w-full h-full grid grid-cols-1 xl:grid-cols-3 gap-2 lg:gap-3 xl:gap-4" style={{ height: '100%' }}>
          {/* Left card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/90 backdrop-blur-md rounded-xl lg:rounded-2xl border border-white/70 shadow-lg p-3 lg:p-4 flex flex-col min-h-0"
            style={{ height: '100%' }}
          >
            <div className="mb-2 lg:mb-3 flex-shrink-0">
              <p className={`font-semibold text-[#495057] ${currentTextSize.cardTitle}`}>{t.leftCard.title}</p>
              <p className={`text-gray-500 ${currentTextSize.cardSubtitle}`}>{t.leftCard.subtitle}</p>
            </div>
            
            <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-3 lg:gap-4 mb-2 lg:mb-3 min-h-0">
              <EfficiencyDonut 
                segments={leftSegments} 
                size={containerSize}
                title={activeLang === 'nl' ? 'efficiëntie' : 'efficiency'}
                value="92.4%"
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
                      <p className={`font-semibold text-gray-700 ${currentTextSize.small}`}>{segment.label}</p>
                      <p className={`text-gray-500 ${currentTextSize.small}`}>{segment.value}%</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <p className={`text-gray-500 ${currentTextSize.small} flex-shrink-0`}>{t.leftCard.footer}</p>
          </motion.div>

          {/* Center card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white/60 backdrop-blur-md rounded-xl lg:rounded-2xl border border-white/50 shadow-lg p-3 lg:p-4 flex flex-col items-center justify-center gap-2 lg:gap-3 min-h-0"
            style={{ height: '100%' }}
          >
            <p className={`text-gray-600 ${currentTextSize.cardTitle}`}>{t.centerCard.title}</p>
            <PerformanceCurve size={containerSize} />
            <p className={`text-gray-500 text-center ${currentTextSize.small}`}>{t.centerCard.note}</p>
          </motion.div>

          {/* Right card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white/90 backdrop-blur-md rounded-xl lg:rounded-2xl border border-white/70 shadow-lg p-3 lg:p-4 flex flex-col min-h-0"
            style={{ height: '100%' }}
          >
            <div className="mb-2 lg:mb-3 flex-shrink-0 text-right lg:text-left">
              <p className={`font-semibold text-[#495057] ${currentTextSize.cardTitle}`}>{t.rightCard.title}</p>
              <p className={`text-gray-500 ${currentTextSize.cardSubtitle}`}>{t.rightCard.subtitle}</p>
            </div>
            
            <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-3 lg:gap-4 mb-2 lg:mb-3 min-h-0">
              <EfficiencyDonut 
                segments={rightSegments} 
                size={containerSize}
                title={activeLang === 'nl' ? 'prestatie' : 'performance'}
                value="variable"
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
                      <p className={`font-semibold text-gray-700 ${currentTextSize.small}`}>{segment.label}</p>
                      <p className={`text-gray-500 ${currentTextSize.small}`}>{segment.value}%</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <p className={`text-gray-500 ${currentTextSize.small} text-right flex-shrink-0`}>{t.rightCard.footer}</p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default SolarSystemPerformance;