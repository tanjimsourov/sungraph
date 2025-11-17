// src/pages/SmartHomeDashboard.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Translation dictionaries (base defaults)
const baseTranslations = {
  en: {
    title: 'Smart Home Energy',
    subtitle: 'Real-time energy monitoring and control',
    energyOverview: 'Energy Overview',
    energyUsage: 'Energy Usage',
    solarProduction: 'Solar Production',
    batteryStorage: 'Battery Storage',
    capacity: '65 kWh Capacity',
    connectedDevices: 'Connected Devices',
    active: 'Active',
    standby: 'Standby',
    solar: 'Solar',
    battery: 'Battery',
    home: 'Home',
    info: {
      description: 'Intelligent energy management with real-time monitoring and automated control.',
      smartChip: '• Smart Monitoring',
      aiChip: '• AI Optimization',
    },
    kpis: {
      usage: 'Usage',
      production: 'Production',
      storage: 'Storage',
    }
  },
  nl: {
    title: 'Slimme Huis Energie',
    subtitle: 'Real-time energie monitoring en controle',
    energyOverview: 'Energie Overzicht',
    energyUsage: 'Energie Verbruik',
    solarProduction: 'Zonne-opbrengst',
    batteryStorage: 'Batterij Opslag',
    capacity: '65 kWh Capaciteit',
    connectedDevices: 'Aangesloten Apparaten',
    active: 'Actief',
    standby: 'Standby',
    solar: 'Zon',
    battery: 'Batterij',
    home: 'Huis',
    info: {
      description: 'Intelligente energiebeheer met real-time monitoring en geautomatiseerde controle.',
      smartChip: '• Slimme Monitoring',
      aiChip: '• AI Optimalisatie',
    },
    kpis: {
      usage: 'Verbruik',
      production: 'Productie',
      storage: 'Opslag',
    }
  }
};

type LangKey = keyof typeof baseTranslations;
type TranslationShape = (typeof baseTranslations)["en"];

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export interface SmartHomeDashboardProps {
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

// Enhanced Battery Component with responsive scaling
interface BatteryStatusProps {
  level?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const BatteryStatus = ({ level = 65, size = 'lg' }: BatteryStatusProps) => {
  const sizeMap = {
    sm: 'w-20 h-20',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
  };

  return (
    <motion.div 
      className={`relative ${sizeMap[size]} bg-gradient-to-br from-gray-50/80 to-gray-100/80 rounded-2xl border-2 border-gray-200/50 backdrop-blur-sm shadow-lg flex items-center justify-center`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <svg viewBox="0 0 100 100" className="w-3/4 h-3/4">
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="#374151"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="url(#batteryGradient)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${level * 2.51} 251`}
          transform="rotate(-90 50 50)"
          className="transition-all duration-1000"
        />
        <defs>
          <linearGradient id="batteryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#34d399" />
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
            className={`font-bold text-gray-800 drop-shadow-sm ${
              size === 'sm' ? 'text-lg' : 
              size === 'md' ? 'text-xl' : 
              size === 'lg' ? 'text-2xl' : 'text-3xl'
            }`}
            key={level}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {level}%
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Energy Flow Animation Component
const EnergyFlowAnimation = ({ size = 'lg' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  const textSizeMap = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  return (
    <motion.div 
      className="bg-gradient-to-br from-purple-50/80 to-blue-100/80 rounded-xl lg:rounded-2xl border-2 border-purple-200/50 backdrop-blur-sm shadow-lg p-3 lg:p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        <div className="text-center">
          <div className={`${size === 'sm' ? 'w-12 h-12' : size === 'md' ? 'w-14 h-14' : size === 'lg' ? 'w-16 h-16' : 'w-20 h-20'} bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-2`}>
            <span className={`${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : size === 'lg' ? 'text-2xl' : 'text-3xl'}`}>☀️</span>
          </div>
          <p className={`text-amber-700 ${textSizeMap[size]}`}>Solar</p>
        </div>
        
        <div className="flex-1 h-1 bg-gradient-to-r from-amber-500 to-emerald-500 mx-2 lg:mx-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse w-20 h-full skew-x-45" />
        </div>
        
        <div className="text-center">
          <div className={`${size === 'sm' ? 'w-12 h-12' : size === 'md' ? 'w-14 h-14' : size === 'lg' ? 'w-16 h-16' : 'w-20 h-20'} bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2`}>
            <span className={`${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : size === 'lg' ? 'text-2xl' : 'text-3xl'}`}>🔋</span>
          </div>
          <p className={`text-emerald-700 ${textSizeMap[size]}`}>Battery</p>
        </div>
        
        <div className="flex-1 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 mx-2 lg:mx-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse w-20 h-full skew-x-45 animation-delay-1000" />
        </div>
        
        <div className="text-center">
          <div className={`${size === 'sm' ? 'w-12 h-12' : size === 'md' ? 'w-14 h-14' : size === 'lg' ? 'w-16 h-16' : 'w-20 h-20'} bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2`}>
            <span className={`${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : size === 'lg' ? 'text-2xl' : 'text-3xl'}`}>🏠</span>
          </div>
          <p className={`text-blue-700 ${textSizeMap[size]}`}>Home</p>
        </div>
      </div>
    </motion.div>
  );
};

const SmartHomeDashboard: React.FC<SmartHomeDashboardProps> = ({
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
  
  const [energyUsage, setEnergyUsage] = useState(0);
  const [solarProduction, setSolarProduction] = useState(0);
  const [batteryLevel, setBatteryLevel] = useState(65);
  const [devices, setDevices] = useState([
    { id: 1, name: 'Air Conditioner', power: 1500, active: true },
    { id: 2, name: 'Refrigerator', power: 200, active: true },
    { id: 3, name: 'Lighting', power: 300, active: false },
    { id: 4, name: 'Entertainment', power: 400, active: true },
  ]);
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

  useEffect(() => {
    if (apiConfig.enabled && apiConfig.endpoint) {
      console.log('Fetching smart home data from:', apiConfig.endpoint);
    }

    const interval = setInterval(() => {
      setEnergyUsage(prev => Math.min(prev + Math.random() * 0.5, 100));
      setSolarProduction(prev => Math.min(prev + Math.random() * 0.3, 100));
      setBatteryLevel(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 2)));
    }, 2000);

    return () => clearInterval(interval);
  }, [apiConfig.enabled, apiConfig.endpoint]);

  const toggleDevice = (id: number) => {
    setDevices(devices.map(device => 
      device.id === id ? { ...device, active: !device.active } : device
    ));
  };

  return (
    <div 
      className="w-full h-full flex flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative"
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
        maxWidth: width,
        maxHeight: height,
      }}
    >
      {/* Simplified Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-purple-500/20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: 40 + Math.random() * 80,
              height: 40 + Math.random() * 80,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 10 - 5, 0],
              opacity: [0.1, 0.2, 0.1],
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
              className={`${containerSize === 'sm' ? 'w-8 h-8' : containerSize === 'md' ? 'w-10 h-10' : containerSize === 'lg' ? 'w-12 h-12' : 'w-14 h-14'} bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <svg className={`${containerSize === 'sm' ? 'w-4 h-4' : containerSize === 'md' ? 'w-5 h-5' : containerSize === 'lg' ? 'w-6 h-6' : 'w-7 h-7'} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </motion.div>
            <div className="flex-1 min-w-0">
              <motion.h1 
                className={`font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent leading-tight ${currentTextSize.title} truncate`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {t.title}
              </motion.h1>
              <motion.p 
                className={`text-purple-200 mt-1 font-light ${currentTextSize.subtitle} truncate`}
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
            className="bg-white/10 backdrop-blur-lg rounded-xl lg:rounded-2xl px-3 lg:px-4 py-2 lg:py-3 border border-white/20 shadow-lg w-full"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2 lg:gap-3">
              <p className={`text-purple-200 leading-relaxed font-medium flex-1 ${currentTextSize.body} line-clamp-2`}>
                {t.info.description}
              </p>
              <div className="flex gap-1 lg:gap-2 flex-shrink-0">
                <motion.span 
                  className="px-2 lg:px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 font-semibold border border-purple-400/30 whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className={currentTextSize.small}>{t.info.smartChip}</span>
                </motion.span>
                <motion.span 
                  className="px-2 lg:px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 font-semibold border border-blue-400/30 whitespace-nowrap"
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
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl lg:rounded-2xl px-3 lg:px-4 py-2 lg:py-3 shadow-xl w-full lg:w-auto lg:min-w-[200px] xl:min-w-[240px] border-l-4 border-l-purple-500 mt-2 lg:mt-0 lg:ml-3"
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
              <div className={`${containerSize === 'sm' ? 'w-8 h-8' : containerSize === 'md' ? 'w-10 h-10' : containerSize === 'lg' ? 'w-12 h-12' : 'w-14 h-14'} bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                <svg className={`${containerSize === 'sm' ? 'w-4 h-4' : containerSize === 'md' ? 'w-5 h-5' : containerSize === 'lg' ? 'w-6 h-6' : 'w-7 h-7'} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className={`text-purple-300 font-semibold uppercase tracking-wide ${currentTextSize.small}`}>Current Usage</p>
              <motion.p 
                className={`font-bold text-white leading-none tracking-tight mt-1 ${currentTextSize.largeMetric}`}
                key={energyUsage}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
              >
                {energyUsage.toFixed(1)} kWh
              </motion.p>
              <motion.p 
                className={`text-purple-300 font-medium mt-1 flex items-center gap-1 ${currentTextSize.small}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse flex-shrink-0" />
                {solarProduction.toFixed(1)} kW solar
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
          { label: t.kpis.usage, value: `${energyUsage.toFixed(1)} kWh`, color: 'cyan' },
          { label: t.kpis.production, value: `${solarProduction.toFixed(1)} kW`, color: 'amber' },
          { label: t.kpis.storage, value: `${batteryLevel}%`, color: 'emerald' },
        ].map((kpi, index) => (
          <motion.div
            key={kpi.label}
            className="px-2 lg:px-3 py-1 lg:py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow flex items-center gap-1 lg:gap-2 flex-1 min-w-[100px] lg:min-w-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className={`w-1.5 lg:w-2 h-1.5 lg:h-2 rounded-full bg-${kpi.color}-400 animate-pulse flex-shrink-0`} />
            <span className={`font-medium text-purple-200 ${currentTextSize.kpi} truncate`}>{kpi.label}:</span>
            <span className={`font-bold text-white ${currentTextSize.kpi} truncate`}>{kpi.value}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 w-full px-3 lg:px-6 pb-2 lg:pb-3 pt-2 lg:pt-3 overflow-hidden min-h-0">
        <div className="w-full h-full grid grid-cols-1 xl:grid-cols-3 gap-3 lg:gap-4 xl:gap-6" style={{ height: '100%' }}>
          {/* Left Column - Energy Overview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="xl:col-span-2 bg-white/10 backdrop-blur-lg rounded-xl lg:rounded-2xl border border-white/20 shadow-lg p-3 lg:p-4 flex flex-col min-h-0"
            style={{ height: '100%' }}
          >
            <div className="mb-2 lg:mb-3 flex-shrink-0">
              <p className={`font-bold text-white mb-1 ${currentTextSize.cardTitle}`}>{t.energyOverview}</p>
              <p className={`text-purple-200 ${currentTextSize.cardSubtitle}`}>Real-time energy metrics</p>
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 min-h-0">
              {/* Energy Usage */}
              <motion.div 
                className="bg-black/30 rounded-xl lg:rounded-2xl p-3 lg:p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <p className="text-cyan-200 text-sm mb-2">{t.energyUsage}</p>
                <div className="flex items-end gap-2 mb-3">
                  <div className={`font-bold text-white ${currentTextSize.largeMetric}`}>{energyUsage.toFixed(1)}</div>
                  <div className="text-cyan-200 mb-1 ${currentTextSize.small}">kWh</div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div 
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${energyUsage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </motion.div>

              {/* Solar Production */}
              <motion.div 
                className="bg-black/30 rounded-xl lg:rounded-2xl p-3 lg:p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <p className="text-amber-200 text-sm mb-2">{t.solarProduction}</p>
                <div className="flex items-end gap-2 mb-3">
                  <div className={`font-bold text-white ${currentTextSize.largeMetric}`}>{solarProduction.toFixed(1)}</div>
                  <div className="text-amber-200 mb-1 ${currentTextSize.small}">kWh</div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div 
                    className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${solarProduction}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Energy Flow */}
            <div className="mt-3 lg:mt-4 flex-shrink-0">
              <EnergyFlowAnimation size={containerSize} />
            </div>
          </motion.div>

          {/* Right Column - Battery & Devices */}
          <div className="flex flex-col gap-3 lg:gap-4 min-h-0" style={{ height: '100%' }}>
            {/* Battery Status */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl lg:rounded-2xl border border-white/20 shadow-lg p-3 lg:p-4 flex flex-col min-h-0"
              style={{ height: '100%' }}
            >
              <div className="text-center mb-2 lg:mb-3 flex-shrink-0">
                <p className={`font-bold text-white mb-1 ${currentTextSize.cardTitle}`}>{t.batteryStorage}</p>
                <p className={`text-purple-200 ${currentTextSize.cardSubtitle}`}>{t.capacity}</p>
              </div>
              
              <div className="flex-1 flex items-center justify-center mb-2 lg:mb-3 min-h-0">
                <BatteryStatus level={batteryLevel} size={containerSize} />
              </div>
            </motion.div>

            {/* Connected Devices */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl lg:rounded-2xl border border-white/20 shadow-lg p-3 lg:p-4 flex-1 flex flex-col min-h-0"
              style={{ height: '100%' }}
            >
              <div className="mb-2 lg:mb-3 flex-shrink-0">
                <p className={`font-bold text-white mb-1 ${currentTextSize.cardTitle}`}>{t.connectedDevices}</p>
                <p className={`text-purple-200 ${currentTextSize.cardSubtitle}`}>Power consumption control</p>
              </div>
              
              <div className="flex-1 grid grid-cols-1 gap-2 lg:gap-3 min-h-0 overflow-y-auto">
                {devices.map((device, index) => (
                  <motion.div
                    key={device.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className={`p-3 rounded-xl transition-all duration-300 cursor-pointer ${
                      device.active 
                        ? 'bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-400/30' 
                        : 'bg-gray-800/50 border border-gray-700/50'
                    }`}
                    onClick={() => toggleDevice(device.id)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`w-2 h-2 rounded-full ${
                        device.active ? 'bg-green-400 animate-pulse' : 'bg-gray-500'
                      }`} />
                      <span className={`text-purple-200 ${currentTextSize.small}`}>{device.power}W</span>
                    </div>
                    <h3 className={`font-semibold text-white mb-1 ${currentTextSize.body}`}>{device.name}</h3>
                    <p className={`text-xs ${
                      device.active ? 'text-green-300' : 'text-gray-400'
                    }`}>
                      {device.active ? t.active : t.standby}
                    </p>
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

export default SmartHomeDashboard;