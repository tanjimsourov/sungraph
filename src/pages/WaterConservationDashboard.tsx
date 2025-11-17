// pages/WaterConservationDashboard.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Translation dictionaries (base defaults)
type TranslationShape = {
  title: string;
  subtitle: string;
  dailyUsage: string;
  dailyValue: string;
  savingsGoal: string;
  info: {
    description: string;
    liveChip: string;
    aiChip: string;
  };
  kpis: {
    shower: string;
    showerValue: string;
    kitchen: string;
    kitchenValue: string;
    garden: string;
    gardenValue: string;
  };
  leftCard: {
    title: string;
    subtitle: string;
    legend: {
      high: string;
      medium: string;
      low: string;
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
      current: string;
      average: string;
      goal: string;
    };
    footer: string;
  };
};

const baseTranslations = {
  en: {
    title: 'AquaFlow Analytics',
    subtitle: 'Smart Water Management & Conservation',
    dailyUsage: 'Daily Usage',
    dailyValue: '142 L',
    savingsGoal: '45% Target Achieved',
    info: {
      description: 'Advanced water monitoring with predictive analytics and intelligent conservation insights.',
      liveChip: '• Live Tracking',
      aiChip: '• AI Insights',
    },
    kpis: {
      shower: 'Shower',
      showerValue: '68 L',
      kitchen: 'Kitchen',
      kitchenValue: '28 L',
      garden: 'Garden',
      gardenValue: '46 L',
    },
    leftCard: {
      title: 'Flow Dynamics',
      subtitle: 'Real-time water distribution',
      legend: {
        high: 'High Flow',
        medium: 'Medium',
        low: 'Low Flow',
      },
      footer: 'Smart leak detection active',
    },
    centerCard: {
      title: 'Conservation Progress',
      note: 'Towards sustainable water usage',
    },
    rightCard: {
      title: 'Usage Patterns',
      subtitle: 'Annual consumption trends',
      legend: {
        current: 'Current',
        average: 'Average',
        goal: 'Target',
      },
      footer: 'AI-powered trend analysis',
    },
  },
  nl: {
    title: 'AquaFlow Analytics',
    subtitle: 'Slim Waterbeheer & Besparing',
    dailyUsage: 'Dagelijks Verbruik',
    dailyValue: '142 L',
    savingsGoal: '45% Doel Bereikt',
    info: {
      description: 'Geavanceerde watermonitoring met voorspellende analyses en intelligente besparingsinzichten.',
      liveChip: '• Live Tracking',
      aiChip: '• AI Inzichten',
    },
    kpis: {
      shower: 'Douche',
      showerValue: '68 L',
      kitchen: 'Keuken',
      kitchenValue: '28 L',
      garden: 'Tuin',
      gardenValue: '46 L',
    },
    leftCard: {
      title: 'Stroom Dynamiek',
      subtitle: 'Real-time waterdistributie',
      legend: {
        high: 'Hoge Stroom',
        medium: 'Gemiddeld',
        low: 'Lage Stroom',
      },
      footer: 'Slimme lekkagedetectie actief',
    },
    centerCard: {
      title: 'Besparings Voortgang',
      note: 'Richting duurzaam watergebruik',
    },
    rightCard: {
      title: 'Gebruikspatronen',
      subtitle: 'Jaarlijkse verbruikstrends',
      legend: {
        current: 'Huidig',
        average: 'Gemiddeld',
        goal: 'Doel',
      },
      footer: 'AI-gestuurde trendanalyse',
    },
  },
};

type LangKey = keyof typeof baseTranslations;

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export interface WaterConservationDashboardProps {
  width?: number;
  height?: number;
  lang?: LangKey;
  texts?: Partial<Record<LangKey, DeepPartial<TranslationShape>>>;
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

// New Water Flow Visualization - Modern Pipe System
const ModernFlowSystem = ({ size = 'lg' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  const sizeMap = {
    sm: 'w-32 h-32',
    md: 'w-40 h-40', 
    lg: 'w-48 h-48',
    xl: 'w-56 h-56'
  };

  const [activeFlow, setActiveFlow] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFlow(prev => (prev + 1) % 4);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative ${sizeMap[size]} bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 rounded-3xl border border-cyan-500/30 overflow-hidden shadow-2xl`}>
      {/* Animated background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-purple-500/10"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      
      {/* Central reservoir */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full border-4 border-cyan-300/50 shadow-lg"
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              '0 0 20px rgba(6, 182, 212, 0.3)',
              '0 0 40px rgba(6, 182, 212, 0.6)',
              '0 0 20px rgba(6, 182, 212, 0.3)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {/* Water surface animation */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-cyan-300/80 to-transparent rounded-t-full"
            animate={{
              y: [0, 2, 0],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </div>

      {/* Flowing pipes */}
      {[0, 1, 2, 3].map((index) => (
        <motion.div
          key={index}
          className={`absolute w-3 h-12 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full ${
            activeFlow === index ? 'opacity-100' : 'opacity-30'
          }`}
          style={{
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) rotate(${index * 90}deg) translateY(-40px)`,
            transformOrigin: 'center',
          }}
          animate={{
            height: activeFlow === index ? [48, 56, 48] : 48,
          }}
          transition={{ duration: 1.5 }}
        >
          {/* Water flow effect */}
          <motion.div
            className="w-full h-4 bg-cyan-300 rounded-full"
            animate={{
              y: activeFlow === index ? [0, 48, 0] : 0,
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.3,
            }}
          />
        </motion.div>
      ))}

      {/* Floating droplets */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-cyan-400 rounded-full"
          initial={{ y: -10, opacity: 0 }}
          animate={{
            y: [0, 60, 0],
            opacity: [0, 1, 0],
            x: 20 + i * 12,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.8,
          }}
        />
      ))}
    </div>
  );
};

// New Water Progress - Circular Wave Meter
const CircularWaveMeter = ({ progress = 75, size = 'lg' }: { progress?: number; size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  const sizeMap = {
    sm: 'w-20 h-20',
    md: 'w-24 h-24',
    lg: 'w-28 h-28',
    xl: 'w-32 h-32'
  };

  return (
    <div className={`relative ${sizeMap[size]} bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-cyan-500/30 shadow-2xl flex items-center justify-center`}>
      <svg viewBox="0 0 100 100" className="w-4/5 h-4/5">
        {/* Background */}
        <circle cx="50" cy="50" r="45" fill="url(#meterGradient)" stroke="#0E7490" strokeWidth="2" />
        
        {/* Animated waves */}
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          fill="url(#waterWave)"
          opacity="0.8"
          animate={{
            r: [38, 42, 38],
            opacity: [0.6, 0.9, 0.6],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        {/* Progress ring */}
        <motion.circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke="#06D6A0"
          strokeWidth="4"
          strokeDasharray="239"
          strokeDashoffset={239 - (239 * progress) / 100}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          initial={{ strokeDashoffset: 239 }}
          animate={{ strokeDashoffset: 239 - (239 * progress) / 100 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        
        <defs>
          <linearGradient id="meterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id="waterWave" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        
        {/* Center text */}
        <text x="50" y="55" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#E2E8F0">
          {progress}%
        </text>
      </svg>
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl border border-cyan-400/30"
        animate={{
          boxShadow: [
            '0 0 20px rgba(6, 182, 212, 0.3)',
            '0 0 40px rgba(6, 182, 212, 0.6)',
            '0 0 20px rgba(6, 182, 212, 0.3)',
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </div>
  );
};

// New Seasonal Chart - Modern Waveform
const ModernWaveChart = ({ size = 'lg' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  const sizeMap = {
    sm: 'w-28 h-28',
    md: 'w-32 h-32',
    lg: 'w-36 h-36',
    xl: 'w-40 h-40'
  };

  const [activeSeason, setActiveSeason] = useState(0);
  const seasons = ['Winter', 'Spring', 'Summer', 'Autumn'];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSeason(prev => (prev + 1) % 4);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative ${sizeMap[size]} bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-cyan-500/30 shadow-2xl overflow-hidden`}>
      {/* Animated waveform */}
      <svg viewBox="0 0 200 100" className="w-full h-full">
        <motion.path
          d="M 0,50 
             C 40,30 60,70 100,40 
             C 140,10 160,90 200,50"
          fill="none"
          stroke="url(#waveGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          animate={{
            d: [
              "M 0,50 C 40,30 60,70 100,40 C 140,10 160,90 200,50",
              "M 0,50 C 40,20 60,80 100,30 C 140,60 160,40 200,50",
              "M 0,50 C 40,30 60,70 100,40 C 140,10 160,90 200,50",
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="50%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#06D6A0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Floating indicators */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 rounded-full ${
            i === activeSeason ? 'bg-cyan-400' : 'bg-slate-600'
          }`}
          style={{
            left: `${25 + i * 25}%`,
            bottom: i % 2 === 0 ? '30%' : '60%',
          }}
          animate={{
            scale: i === activeSeason ? [1, 1.5, 1] : 1,
            boxShadow: i === activeSeason ? 
              '0 0 10px rgba(34, 211, 238, 0.8)' : 'none',
          }}
          transition={{ duration: 2 }}
        />
      ))}

      {/* Season indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSeason}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center"
          >
            <div className="text-xs font-bold text-cyan-300">
              {seasons[activeSeason]}
            </div>
            <div className="text-[10px] text-slate-400">
              {['Peak', 'Moderate', 'High', 'Moderate'][activeSeason]}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const WaterConservationDashboard: React.FC<WaterConservationDashboardProps> = ({
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

  const activeLang: LangKey =
    lang && (lang === "nl" || lang === "en") ? lang : autoLang;

  const base = baseTranslations[activeLang];
  const overrides = (texts?.[activeLang] ?? {}) as DeepPartial<TranslationShape>;
  const t = mergeLang(base, overrides);

  const [savingsProgress, setSavingsProgress] = useState(45);
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

  // Text size mapping
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
      console.log('Fetching water data from:', apiConfig.endpoint);
    }

    const interval = setInterval(() => {
      setSavingsProgress(prev => Math.min(95, Math.max(5, prev + Math.random() * 2 - 1)));
    }, 3000);
    return () => clearInterval(interval);
  }, [apiConfig.enabled, apiConfig.endpoint]);

  return (
    <div 
      className="w-full h-full flex flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 relative"
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
        maxWidth: width,
        maxHeight: height,
      }}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-cyan-500/10"
            style={{
              width: Math.random() * 60 + 10,
              height: Math.random() * 60 + 10,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header 
        className="relative z-10 w-full px-4 lg:px-8 pt-4 lg:pt-6 flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 lg:gap-4 mb-3 lg:mb-4">
            {/* Animated Logo */}
            <motion.div
              className={`${containerSize === 'sm' ? 'w-10 h-10' : containerSize === 'md' ? 'w-12 h-12' : containerSize === 'lg' ? 'w-14 h-14' : 'w-16 h-16'} bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl border border-cyan-400/30`}
              whileHover={{ scale: 1.05 }}
              animate={{
                boxShadow: [
                  '0 0 20px rgba(6, 182, 212, 0.4)',
                  '0 0 40px rgba(6, 182, 212, 0.8)',
                  '0 0 20px rgba(6, 182, 212, 0.4)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <svg className={`${containerSize === 'sm' ? 'w-5 h-5' : containerSize === 'md' ? 'w-6 h-6' : containerSize === 'lg' ? 'w-7 h-7' : 'w-8 h-8'} text-white`} fill="currentColor" viewBox="0 0 24 24">
                <path d="M2 12l4-4m-4 4l4 4m-4-4h20"/>
              </svg>
            </motion.div>
            
            <div className="flex-1">
              <motion.h1 
                className={`font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent leading-tight ${currentTextSize.title}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {t.title}
              </motion.h1>
              <motion.p 
                className={`text-cyan-300/80 mt-1 font-light ${currentTextSize.subtitle}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {t.subtitle}
              </motion.p>
            </div>
          </div>

          {/* Enhanced Info Bar */}
          <motion.div 
            className="bg-slate-800/60 backdrop-blur-xl rounded-2xl px-4 lg:px-6 py-3 lg:py-4 border border-cyan-500/20 shadow-2xl"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 lg:gap-4">
              <p className={`text-cyan-100 leading-relaxed font-medium flex-1 ${currentTextSize.body}`}>
                {t.info.description}
              </p>
              <div className="flex gap-2 lg:gap-3 flex-shrink-0">
                <motion.span 
                  className="px-3 lg:px-4 py-2 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-400/30 backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  animate={{
                    boxShadow: [
                      '0 0 10px rgba(34, 211, 238, 0.3)',
                      '0 0 20px rgba(34, 211, 238, 0.6)',
                      '0 0 10px rgba(34, 211, 238, 0.3)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className={currentTextSize.small}>{t.info.liveChip}</span>
                </motion.span>
                <motion.span 
                  className="px-3 lg:px-4 py-2 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-400/30 backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  animate={{
                    boxShadow: [
                      '0 0 10px rgba(59, 130, 246, 0.3)',
                      '0 0 20px rgba(59, 130, 246, 0.6)',
                      '0 0 10px rgba(59, 130, 246, 0.3)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  <span className={currentTextSize.small}>{t.info.aiChip}</span>
                </motion.span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Hero Metric Card */}
        <motion.div 
          className="bg-slate-800/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl px-4 lg:px-6 py-3 lg:py-4 shadow-2xl w-full lg:w-auto lg:min-w-[220px] xl:min-w-[260px] mt-4 lg:mt-0"
          initial={{ opacity: 0, scale: 0.9, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <div className="flex items-center gap-3 lg:gap-4">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className={`${containerSize === 'sm' ? 'w-10 h-10' : containerSize === 'md' ? 'w-12 h-12' : containerSize === 'lg' ? 'w-14 h-14' : 'w-16 h-16'} bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl border border-cyan-400/30`}>
                <svg className={`${containerSize === 'sm' ? 'w-5 h-5' : containerSize === 'md' ? 'w-6 h-6' : containerSize === 'lg' ? 'w-7 h-7' : 'w-8 h-8'} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </motion.div>
            <div className="flex-1">
              <p className={`text-cyan-300 font-semibold uppercase tracking-wider ${currentTextSize.small}`}>{t.dailyUsage}</p>
              <motion.p 
                className={`font-bold text-cyan-100 leading-none tracking-tight mt-1 ${currentTextSize.largeMetric}`}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {t.dailyValue}
              </motion.p>
              <motion.p 
                className={`text-emerald-400 font-medium mt-1 flex items-center gap-2 ${currentTextSize.small}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse flex-shrink-0" />
                {t.savingsGoal}
              </motion.p>
            </div>
          </div>
        </motion.div>
      </motion.header>

      {/* KPI Row - Enhanced */}
      <motion.div 
        className="relative z-10 w-full px-4 lg:px-8 mt-4 lg:mt-6 flex flex-wrap gap-2 lg:gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {[
          { label: t.kpis.shower, value: t.kpis.showerValue, color: 'cyan', icon: '🚿' },
          { label: t.kpis.kitchen, value: t.kpis.kitchenValue, color: 'blue', icon: '🍳' },
          { label: t.kpis.garden, value: t.kpis.gardenValue, color: 'emerald', icon: '🌿' },
        ].map((kpi, index) => (
          <motion.div
            key={kpi.label}
            className="px-3 lg:px-4 py-2 lg:py-3 bg-slate-800/60 backdrop-blur-lg rounded-xl border border-slate-700/50 shadow-lg flex items-center gap-2 lg:gap-3 flex-1 min-w-[120px] lg:min-w-0 group hover:border-cyan-500/30 transition-all duration-300"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="text-lg lg:text-xl">{kpi.icon}</div>
            <div className="flex-1 min-w-0">
              <div className={`font-semibold text-slate-300 ${currentTextSize.kpi}`}>{kpi.label}</div>
              <div className={`font-bold text-cyan-100 ${currentTextSize.metric}`}>{kpi.value}</div>
            </div>
            <motion.div
              className={`w-2 h-2 rounded-full bg-${kpi.color}-400`}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content - Enhanced Layout */}
      <main className="relative z-10 flex-1 w-full px-4 lg:px-8 pb-4 lg:pb-6 pt-4 lg:pt-6 overflow-hidden min-h-0">
        <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 xl:gap-8" style={{ height: '100%' }}>
          
          {/* Left Card - Flow Dynamics */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-cyan-500/20 shadow-2xl p-4 lg:p-6 flex flex-col min-h-0 group hover:border-cyan-500/40 transition-all duration-500"
            style={{ height: '100%' }}
          >
            <div className="mb-4 lg:mb-6 flex-shrink-0">
              <p className={`font-bold text-cyan-300 mb-2 ${currentTextSize.cardTitle}`}>{t.leftCard.title}</p>
              <p className={`text-cyan-300/70 ${currentTextSize.cardSubtitle}`}>{t.leftCard.subtitle}</p>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center gap-4 lg:gap-6 mb-4 lg:mb-6 min-h-0">
              <ModernFlowSystem size={containerSize} />
              
              <div className="text-center">
                <CircularWaveMeter progress={savingsProgress} size={containerSize} />
                <p className={`text-cyan-300/80 mt-3 font-medium ${currentTextSize.small}`}>Conservation Progress</p>
              </div>
            </div>
            
            <div className="flex gap-3 lg:gap-4 justify-center flex-shrink-0">
              {[
                { label: t.leftCard.legend.high, color: 'bg-red-400' },
                { label: t.leftCard.legend.medium, color: 'bg-amber-400' },
                { label: t.leftCard.legend.low, color: 'bg-emerald-400' }
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div className={`w-3 h-3 rounded-full ${item.color} shadow-lg`} />
                  <span className={`text-slate-300 ${currentTextSize.small}`}>{item.label}</span>
                </motion.div>
              ))}
            </div>
            <p className={`text-cyan-400/60 text-center mt-3 ${currentTextSize.small}`}>{t.leftCard.footer}</p>
          </motion.div>

          {/* Center Card - Conservation Progress */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 backdrop-blur-xl rounded-2xl border border-cyan-500/30 shadow-2xl p-4 lg:p-6 flex flex-col items-center justify-center gap-4 lg:gap-6 group hover:border-cyan-400/50 transition-all duration-500"
          >
            <p className={`font-bold text-cyan-300 text-center ${currentTextSize.cardTitle}`}>{t.centerCard.title}</p>
            
            {/* Enhanced Goal Visualization */}
            <div className="relative">
              <motion.div
                className="w-24 h-24 lg:w-32 lg:h-32 rounded-full border-4 border-cyan-500/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-4 lg:inset-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
                <motion.span 
                  className="text-white font-bold text-sm lg:text-lg"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Goal
                </motion.span>
              </div>
              
              {/* Orbiting indicators */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-cyan-400 rounded-full"
                  animate={{
                    rotate: [0, 360],
                    x: [0, 50, 0],
                    y: [0, 25, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 1.3,
                  }}
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              ))}
            </div>
            
            <p className={`text-cyan-300/80 text-center ${currentTextSize.small}`}>{t.centerCard.note}</p>
          </motion.div>

          {/* Right Card - Usage Patterns */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-cyan-500/20 shadow-2xl p-4 lg:p-6 flex flex-col min-h-0 group hover:border-cyan-500/40 transition-all duration-500"
            style={{ height: '100%' }}
          >
            <div className="mb-4 lg:mb-6 flex-shrink-0">
              <p className={`font-bold text-cyan-300 mb-2 text-center lg:text-right xl:text-left ${currentTextSize.cardTitle}`}>{t.rightCard.title}</p>
              <p className={`text-cyan-300/70 text-center lg:text-right xl:text-left ${currentTextSize.cardSubtitle}`}>{t.rightCard.subtitle}</p>
            </div>
            
            <div className="flex-1 flex items-center justify-center mb-4 lg:mb-6 min-h-0">
              <ModernWaveChart size={containerSize} />
            </div>

            <div className="grid grid-cols-3 gap-2 lg:gap-3 flex-shrink-0">
              {[
                { label: t.rightCard.legend.current, color: 'bg-cyan-400' },
                { label: t.rightCard.legend.average, color: 'bg-blue-400' },
                { label: t.rightCard.legend.goal, color: 'bg-emerald-400' }
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="text-center p-2 lg:p-3 rounded-xl bg-slate-700/50 border border-slate-600/50 backdrop-blur-sm"
                >
                  <div 
                    className="w-3 h-3 rounded-full mx-auto mb-2 shadow-lg"
                    style={{ backgroundColor: item.color.includes('cyan') ? '#22D3EE' : item.color.includes('blue') ? '#3B82F6' : '#34D399' }}
                  />
                  <div className={`font-medium text-slate-200 ${currentTextSize.small}`}>
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </div>
            <p className={`text-cyan-400/60 text-center mt-3 ${currentTextSize.small}`}>{t.rightCard.footer}</p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default WaterConservationDashboard;