// src/pages/SustainableLivingDashboard.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Translation dictionaries
type TranslationShape = {
  title: string;
  subtitle: string;
  sustainabilityScore: string;
  impactMetrics: {
    waterSaved: string;
    wasteReduced: string;
    energySaved: string;
    treesPlanted: string;
  };
  activeChallenges: string;
  environmentalImpact: string;
  communityImpact: string;
  dailyTips: string;
  challenges: {
    meatFree: {
      title: string;
      description: string;
      impact: string;
    };
    zeroWaste: {
      title: string;
      description: string;
      impact: string;
    };
    energySaver: {
      title: string;
      description: string;
      impact: string;
    };
    waterWarrior: {
      title: string;
      description: string;
      impact: string;
    };
  };
  impactStats: {
    carbonReduced: string;
    carMiles: string;
    plasticPrevented: string;
  };
  communityStats: {
    ecoWarriors: string;
    totalCO2: string;
    treesPlanted: string;
  };
};

const baseTranslations = {
  en: {
    title: 'EcoLife Dashboard',
    subtitle: 'Your Sustainable Journey in Real-Time',
    sustainabilityScore: 'Sustainability Score',
    impactMetrics: {
      waterSaved: 'Water Saved',
      wasteReduced: 'Waste Reduced',
      energySaved: 'Energy Saved',
      treesPlanted: 'Trees Planted'
    },
    activeChallenges: 'Active Challenges',
    environmentalImpact: 'Environmental Impact',
    communityImpact: 'Community Impact',
    dailyTips: 'Daily Eco Tips',
    challenges: {
      meatFree: {
        title: 'Plant-Based Week',
        description: 'Embrace plant-based meals for 7 days',
        impact: '-15kg CO₂'
      },
      zeroWaste: {
        title: 'Zero Waste',
        description: 'Eliminate single-use plastics entirely',
        impact: '-8kg waste'
      },
      energySaver: {
        title: 'Energy Guardian',
        description: 'Reduce electricity consumption by 25%',
        impact: '-30kWh'
      },
      waterWarrior: {
        title: 'Water Guardian',
        description: 'Reduce shower time by 25%',
        impact: '-400L water'
      }
    },
    impactStats: {
      carbonReduced: 'Carbon Footprint Reduced',
      carMiles: 'Equivalent Car Miles',
      plasticPrevented: 'Ocean Plastic Prevented'
    },
    communityStats: {
      ecoWarriors: 'Eco Guardians',
      totalCO2: 'Total CO₂ Neutralized',
      treesPlanted: 'Forest Guardians'
    }
  },
  nl: {
    title: 'EcoLife Dashboard',
    subtitle: 'Jouw Duurzame Reis in Real-Time',
    sustainabilityScore: 'Duurzaamheidsscore',
    impactMetrics: {
      waterSaved: 'Water Bespaard',
      wasteReduced: 'Afval Verminderd',
      energySaved: 'Energie Bespaard',
      treesPlanted: 'Bomen Geplant'
    },
    activeChallenges: 'Actieve Uitdagingen',
    environmentalImpact: 'Milieu-impact',
    communityImpact: 'Gemeenschapsimpact',
    dailyTips: 'Dagelijkse Eco Tips',
    challenges: {
      meatFree: {
        title: 'Plantaardige Week',
        description: 'Eet 7 dagen plantaardige maaltijden',
        impact: '-15kg CO₂'
      },
      zeroWaste: {
        title: 'Zero Afval',
        description: 'Vermijd volledig wegwerpplastic',
        impact: '-8kg afval'
      },
      energySaver: {
        title: 'Energie Bewaker',
        description: 'Vermijd elektriciteitsverbruik met 25%',
        impact: '-30kWh'
      },
      waterWarrior: {
        title: 'Water Bewaker',
        description: 'Verkort douchetijd met 25%',
        impact: '-400L water'
      }
    },
    impactStats: {
      carbonReduced: 'CO₂-voetafdruk Verminderd',
      carMiles: 'Equivalente Autokilometers',
      plasticPrevented: 'Oceaanplastic Voorkomen'
    },
    communityStats: {
      ecoWarriors: 'Eco Bewakers',
      totalCO2: 'Totaal CO₂ Geneutraliseerd',
      treesPlanted: 'Bos Bewakers'
    }
  }
};

type LangKey = keyof typeof baseTranslations;

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export interface SustainableLivingDashboardProps {
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
    impactMetrics: { ...base.impactMetrics, ...(override.impactMetrics ?? {}) },
    challenges: {
      ...base.challenges,
      ...(override.challenges ?? {}),
      meatFree: { ...base.challenges.meatFree, ...(override.challenges?.meatFree ?? {}) },
      zeroWaste: { ...base.challenges.zeroWaste, ...(override.challenges?.zeroWaste ?? {}) },
      energySaver: { ...base.challenges.energySaver, ...(override.challenges?.energySaver ?? {}) },
      waterWarrior: { ...base.challenges.waterWarrior, ...(override.challenges?.waterWarrior ?? {}) }
    },
    impactStats: { ...base.impactStats, ...(override.impactStats ?? {}) },
    communityStats: { ...base.communityStats, ...(override.communityStats ?? {}) }
  };
}

// New Eco Score Gauge Component
const EcoScoreGauge = ({ score = 85, size = 'lg' }: { score?: number; size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  const sizeMap = {
    sm: 'w-20 h-20',
    md: 'w-24 h-24',
    lg: 'w-28 h-28',
    xl: 'w-32 h-32'
  };

  const getScoreColor = (value: number) => {
    if (value >= 80) return '#10B981';
    if (value >= 60) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div className={`relative ${sizeMap[size]} bg-gradient-to-br from-emerald-900/80 to-teal-900/80 rounded-2xl border border-emerald-500/30 shadow-2xl flex items-center justify-center`}>
      <svg viewBox="0 0 100 100" className="w-4/5 h-4/5">
        {/* Background Arc */}
        <path
          d="M 20,80 A 30 30 0 1 1 80,80"
          fill="none"
          stroke="#374151"
          strokeWidth="8"
          strokeLinecap="round"
        />
        
        {/* Score Arc */}
        <motion.path
          d="M 20,80 A 30 30 0 1 1 80,80"
          fill="none"
          stroke={getScoreColor(score)}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="188.4"
          strokeDashoffset={188.4 - (188.4 * score) / 100}
          initial={{ strokeDashoffset: 188.4 }}
          animate={{ strokeDashoffset: 188.4 - (188.4 * score) / 100 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        
        {/* Animated Leaf */}
        <motion.path
          d="M 45,60 Q 50,45 55,60 Q 50,75 45,60 Z"
          fill={getScoreColor(score)}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </svg>
      
      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="text-center"
        >
          <div className="text-lg font-bold text-white mb-1">{score}</div>
          <div className="text-xs text-emerald-200/80">Score</div>
        </motion.div>
      </div>
    </div>
  );
};

// New Impact Orb Component
const ImpactOrb = ({ 
  value, 
  label, 
  unit, 
  icon, 
  color = 'emerald',
  size = 'md' 
}: {
  value: number;
  label: string;
  unit: string;
  icon: string;
  color?: 'emerald' | 'teal' | 'green' | 'lime';
  size?: 'sm' | 'md' | 'lg';
}) => {
  const sizeMap = {
    sm: 'w-20 h-20',
    md: 'w-24 h-24',
    lg: 'w-28 h-28'
  };

  const colorMap = {
    emerald: 'from-emerald-500 to-teal-600',
    teal: 'from-teal-500 to-cyan-600',
    green: 'from-green-500 to-emerald-600',
    lime: 'from-lime-400 to-green-500'
  };

  return (
    <motion.div
      className={`${sizeMap[size]} bg-gradient-to-br ${colorMap[color]} rounded-2xl border border-white/20 shadow-2xl flex flex-col items-center justify-center p-3 relative overflow-hidden`}
      whileHover={{ scale: 1.05, y: -2 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"
        animate={{
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      
      <div className="text-xl mb-1 z-10">{icon}</div>
      <div className="text-lg font-bold text-white mb-1 z-10">
        {value.toLocaleString()}
        {unit && <span className="text-xs opacity-80 ml-1">{unit}</span>}
      </div>
      <div className="text-xs text-white/90 text-center z-10 leading-tight">{label}</div>
    </motion.div>
  );
};

// New Challenge Card Component
const ChallengeCard = ({ 
  title, 
  description, 
  impact, 
  progress, 
  isActive = false,
  onActivate 
}: {
  title: string;
  description: string;
  impact: string;
  progress: number;
  isActive?: boolean;
  onActivate: () => void;
}) => {
  return (
    <motion.div
      className={`p-3 rounded-xl border backdrop-blur-sm cursor-pointer transition-all duration-300 ${
        isActive 
          ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-400/50 shadow-lg' 
          : 'bg-white/10 border-emerald-200/30 hover:border-emerald-300/50'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onActivate}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className={`font-semibold text-sm ${isActive ? 'text-emerald-100' : 'text-gray-800'}`}>{title}</h4>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          isActive ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-700'
        }`}>
          {impact}
        </span>
      </div>
      <p className={`text-xs mb-2 ${isActive ? 'text-emerald-200/80' : 'text-gray-600'}`}>
        {description}
      </p>
      <div className="space-y-1">
        <div className="w-full bg-gray-300/30 rounded-full h-1.5">
          <motion.div
            className="h-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between text-xs">
          <span className={isActive ? 'text-emerald-200/70' : 'text-gray-500'}>Progress</span>
          <span className={isActive ? 'text-emerald-100' : 'text-gray-700'}>{progress}%</span>
        </div>
      </div>
    </motion.div>
  );
};

const SustainableLivingDashboard: React.FC<SustainableLivingDashboardProps> = ({
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

  const [metrics, setMetrics] = useState({
    waterSaved: 1250,
    wasteReduced: 45,
    energySaved: 320,
    treesPlanted: 12
  });
  const [sustainabilityScore, setSustainabilityScore] = useState(85);
  const [activeChallenge, setActiveChallenge] = useState(0);
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

  // Text size mapping - Same as WaterConservationDashboard
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
      console.log('Fetching sustainability data from:', apiConfig.endpoint);
    }

    const interval = setInterval(() => {
      setMetrics(prev => ({
        waterSaved: prev.waterSaved + Math.random() * 10,
        wasteReduced: Math.max(0, prev.wasteReduced + (Math.random() - 0.3) * 2),
        energySaved: prev.energySaved + Math.random() * 5,
        treesPlanted: prev.treesPlanted
      }));
      setSustainabilityScore(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.4) * 1)));
    }, 3000);

    return () => clearInterval(interval);
  }, [apiConfig.enabled, apiConfig.endpoint]);

  const challenges = [
    { 
      ...t.challenges.meatFree, 
      progress: 65 
    },
    { 
      ...t.challenges.zeroWaste, 
      progress: 40 
    },
    { 
      ...t.challenges.energySaver, 
      progress: 80 
    },
    { 
      ...t.challenges.waterWarrior, 
      progress: 55 
    }
  ];

  const dailyTips = [
    'Turn off lights when leaving rooms',
    'Use reusable water bottles',
    'Take shorter showers',
    'Unplug electronics when not in use',
    'Choose local and seasonal food'
  ];

  return (
    <div 
      className="w-full h-full flex flex-col overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-900 to-green-900 relative"
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
        maxWidth: width,
        maxHeight: height,
      }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-xl opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 15 - 7.5, 0],
              rotate: [0, 180, 360],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 15 + Math.random() * 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {i % 4 === 0 ? '🌿' : i % 4 === 1 ? '🍃' : i % 4 === 2 ? '🌱' : '🌍'}
          </motion.div>
        ))}
      </div>

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
              className={`${containerSize === 'sm' ? 'w-8 h-8' : containerSize === 'md' ? 'w-10 h-10' : containerSize === 'lg' ? 'w-12 h-12' : 'w-14 h-14'} bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <svg className={`${containerSize === 'sm' ? 'w-4 h-4' : containerSize === 'md' ? 'w-5 h-5' : containerSize === 'lg' ? 'w-6 h-6' : 'w-7 h-7'} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </motion.div>
            <div className="flex-1 min-w-0">
              <motion.h1 
                className={`font-bold bg-gradient-to-r from-emerald-300 to-teal-400 bg-clip-text text-transparent leading-tight ${currentTextSize.title} truncate`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {t.title}
              </motion.h1>
              <motion.p 
                className={`text-emerald-200 mt-1 font-light ${currentTextSize.subtitle} truncate`}
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
          className="bg-white/90 backdrop-blur-lg border border-white/70 rounded-xl lg:rounded-2xl px-3 lg:px-4 py-2 lg:py-3 shadow-xl w-full lg:w-auto lg:min-w-[200px] xl:min-w-[240px] border-l-4 border-l-emerald-500 mt-2 lg:mt-0 lg:ml-3"
          initial={{ opacity: 0, scale: 0.9, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <div className="flex items-center gap-2 lg:gap-3">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className={`${containerSize === 'sm' ? 'w-8 h-8' : containerSize === 'md' ? 'w-10 h-10' : containerSize === 'lg' ? 'w-12 h-12' : 'w-14 h-14'} bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                <svg className={`${containerSize === 'sm' ? 'w-4 h-4' : containerSize === 'md' ? 'w-5 h-5' : containerSize === 'lg' ? 'w-6 h-6' : 'w-7 h-7'} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className={`text-emerald-600 font-semibold uppercase tracking-wide ${currentTextSize.small}`}>Eco Score</p>
              <motion.p 
                className={`font-bold text-emerald-700 leading-none tracking-tight mt-1 ${currentTextSize.largeMetric}`}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {sustainabilityScore}
              </motion.p>
              <motion.p 
                className={`text-green-600 font-medium mt-1 flex items-center gap-1 ${currentTextSize.small}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
                {sustainabilityScore >= 80 ? 'Excellent! 🌟' : sustainabilityScore >= 60 ? 'Good job! 👍' : 'Keep going! 💪'}
              </motion.p>
            </div>
          </div>
        </motion.div>
      </motion.header>

      {/* KPI Row */}
      <motion.div 
        className="relative z-10 w-full px-3 lg:px-6 mt-2 lg:mt-3 flex flex-wrap gap-1 lg:gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {[
          { label: t.impactMetrics.waterSaved, value: metrics.waterSaved.toLocaleString(), unit: 'L', color: 'teal' },
          { label: t.impactMetrics.wasteReduced, value: metrics.wasteReduced.toLocaleString(), unit: 'kg', color: 'emerald' },
          { label: t.impactMetrics.energySaved, value: metrics.energySaved.toLocaleString(), unit: 'kWh', color: 'lime' },
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
            <span className={`font-bold text-emerald-800 ${currentTextSize.kpi} truncate`}>{kpi.value} {kpi.unit}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content - Fixed height to prevent scrolling */}
      <main className="relative z-10 flex-1 w-full px-3 lg:px-6 pb-2 lg:pb-3 pt-2 lg:pt-3 overflow-hidden min-h-0">
        <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 lg:gap-4 xl:gap-6" style={{ height: '100%' }}>
          
          {/* Left Card - Sustainability Score */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl border border-white/60 shadow-lg p-3 lg:p-4 flex flex-col min-h-0"
            style={{ height: '100%' }}
          >
            <div className="mb-2 lg:mb-3 flex-shrink-0">
              <p className={`font-bold text-emerald-800 mb-1 ${currentTextSize.cardTitle}`}>{t.sustainabilityScore}</p>
              <p className={`text-emerald-600 ${currentTextSize.cardSubtitle}`}>Real-time performance tracking</p>
            </div>
            
            <div className="flex-1 flex items-center justify-center mb-2 lg:mb-3 min-h-0">
              <EcoScoreGauge score={sustainabilityScore} size={containerSize} />
            </div>
            
            <div className="flex gap-2 lg:gap-3 justify-center flex-shrink-0">
              {[
                { label: 'Excellent', color: 'bg-emerald-400', range: '80-100' },
                { label: 'Good', color: 'bg-amber-400', range: '60-79' },
                { label: 'Improving', color: 'bg-rose-400', range: '0-59' }
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
            <p className={`text-emerald-400 text-center mt-2 ${currentTextSize.small}`}>Updated in real-time</p>
          </motion.div>

          {/* Center Column */}
          <div className="flex flex-col gap-2 lg:gap-3 xl:gap-4 min-h-0" style={{ height: '100%' }}>
            
            {/* Impact Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl border border-white/60 shadow-lg p-3 lg:p-4 flex-1 flex flex-col min-h-0"
              style={{ height: '100%' }}
            >
              <div className="text-center mb-2 lg:mb-3 flex-shrink-0">
                <p className={`font-bold text-emerald-800 mb-1 ${currentTextSize.cardTitle}`}>Impact Metrics</p>
                <p className={`text-emerald-600 ${currentTextSize.cardSubtitle}`}>Your environmental contributions</p>
              </div>
              
              <div className="flex-1 grid grid-cols-2 gap-3 lg:gap-4 items-center justify-center mb-2 lg:mb-3 min-h-0">
                <ImpactOrb
                  value={metrics.waterSaved}
                  label={t.impactMetrics.waterSaved}
                  unit="L"
                  icon="💧"
                  color="teal"
                  size={containerSize === 'sm' ? 'sm' : 'md'}
                />
                <ImpactOrb
                  value={metrics.wasteReduced}
                  label={t.impactMetrics.wasteReduced}
                  unit="kg"
                  icon="🗑️"
                  color="emerald"
                  size={containerSize === 'sm' ? 'sm' : 'md'}
                />
                <ImpactOrb
                  value={metrics.energySaved}
                  label={t.impactMetrics.energySaved}
                  unit="kWh"
                  icon="⚡"
                  color="lime"
                  size={containerSize === 'sm' ? 'sm' : 'md'}
                />
                <ImpactOrb
                  value={metrics.treesPlanted}
                  label={t.impactMetrics.treesPlanted}
                  unit=""
                  icon="🌳"
                  color="green"
                  size={containerSize === 'sm' ? 'sm' : 'md'}
                />
              </div>
            </motion.div>

            {/* Daily Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl border border-white/60 shadow-lg p-3 lg:p-4 flex flex-col min-h-0"
              style={{ height: '100%' }}
            >
              <div className="mb-2 lg:mb-3 flex-shrink-0">
                <p className={`font-bold text-emerald-800 mb-1 ${currentTextSize.cardTitle}`}>{t.dailyTips}</p>
                <p className={`text-emerald-600 ${currentTextSize.cardSubtitle}`}>Simple ways to be more sustainable</p>
              </div>

              <div className="flex-1 space-y-2 min-h-0">
                {dailyTips.map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="flex items-center gap-2 p-2 rounded-lg bg-white/60 border border-white/70"
                  >
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full flex-shrink-0" />
                    <span className={`text-gray-700 ${currentTextSize.small}`}>{tip}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Card - Challenges & Community */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl border border-white/60 shadow-lg p-3 lg:p-4 flex flex-col min-h-0"
            style={{ height: '100%' }}
          >
            <div className="mb-2 lg:mb-3 flex-shrink-0">
              <p className={`font-bold text-emerald-800 mb-1 ${currentTextSize.cardTitle}`}>{t.activeChallenges}</p>
              <p className={`text-emerald-600 ${currentTextSize.cardSubtitle}`}>Join challenges to boost your impact</p>
            </div>

            {/* Challenges */}
            <div className="flex-1 space-y-2 lg:space-y-3 mb-3 lg:mb-4 min-h-0">
              {challenges.map((challenge, index) => (
                <ChallengeCard
                  key={index}
                  title={challenge.title}
                  description={challenge.description}
                  impact={challenge.impact}
                  progress={challenge.progress}
                  isActive={activeChallenge === index}
                  onActivate={() => setActiveChallenge(index)}
                />
              ))}
            </div>

            {/* Community Impact */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-3 lg:p-4 text-white flex-shrink-0">
              <p className={`font-semibold mb-2 ${currentTextSize.small}`}>{t.communityImpact}</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <div className="text-lg font-bold">1,247</div>
                  <div className="text-xs opacity-80">{t.communityStats.ecoWarriors}</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">45.2K</div>
                  <div className="text-xs opacity-80">{t.communityStats.totalCO2}</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">892</div>
                  <div className="text-xs opacity-80">{t.communityStats.treesPlanted}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default SustainableLivingDashboard;