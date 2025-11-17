// pages/SolarEnvironmentalImpact.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Translation dictionaries (base defaults)
const baseTranslations = {
  en: {
    title: 'Environmental Impact',
    subtitle: 'Real-time CO₂ Reduction & Sustainability Tracking',
    totalReduction: 'CO₂ Reduced',
    totalReductionValue: '38.6 tons',
    equivalent: 'Equivalent to 1,570 trees',
    info: {
      description: 'Live monitoring of environmental benefits from your solar installation with real-time impact visualization.',
      co2Chip: '• CO₂ Tracking',
      sustainabilityChip: '• Live Impact',
    },
    kpis: {
      annualReduction: 'Annual Reduction',
      annualValue: '4.2 tons CO₂',
      equivalentCars: 'Cars Off Road',
      carsValue: '0.9 vehicles',
      systemLifetime: 'System Life',
      lifetimeValue: '25+ years',
    },
    leftCard: {
      title: 'Carbon Footprint',
      subtitle: 'Real-time emission reduction tracking',
      legend: {
        operation: 'Energy Production',
        manufacturing: 'Manufacturing Offset',
        transport: 'Transport Saved',
        disposal: 'Waste Reduction',
      },
      footer: 'Live environmental impact monitoring',
    },
    centerCard: {
      title: 'Eco System Impact',
      note: 'Visualizing positive environmental contributions',
    },
    rightCard: {
      title: 'Fossil Fuel Displacement',
      subtitle: 'Traditional energy sources avoided',
      legend: {
        coalAvoided: 'Coal Power',
        gasAvoided: 'Natural Gas',
        oilAvoided: 'Oil Energy',
      },
      footer: 'Real-time fossil fuel displacement',
    },
  },
  nl: {
    title: 'Milieu Impact',
    subtitle: 'Real-time CO₂ Reductie & Duurzaamheid Tracking',
    totalReduction: 'CO₂ Gereduceerd',
    totalReductionValue: '38.6 ton',
    equivalent: 'Gelijk aan 1.570 bomen',
    info: {
      description: 'Live monitoring van milieuvoordelen van uw zonne-installatie met real-time impact visualisatie.',
      co2Chip: '• CO₂ Tracking',
      sustainabilityChip: '• Live Impact',
    },
    kpis: {
      annualReduction: 'Jaarlijkse Reductie',
      annualValue: '4.2 ton CO₂',
      equivalentCars: 'Auto\'s Van De Weg',
      carsValue: '0.9 voertuigen',
      systemLifetime: 'Systeem Levensduur',
      lifetimeValue: '25+ jaar',
    },
    leftCard: {
      title: 'Carbon Voetafdruk',
      subtitle: 'Real-time emissie reductie tracking',
      legend: {
        operation: 'Energie Productie',
        manufacturing: 'Productie Compensatie',
        transport: 'Transport Bespaard',
        disposal: 'Afval Reductie',
      },
      footer: 'Live milieu impact monitoring',
    },
    centerCard: {
      title: 'Eco Systeem Impact',
      note: 'Visualisatie van positieve milieu bijdragen',
    },
    rightCard: {
      title: 'Fossiele Brandstof Vervanging',
      subtitle: 'Vermeden traditionele energiebronnen',
      legend: {
        coalAvoided: 'Kolen Stroom',
        gasAvoided: 'Aardgas',
        oilAvoided: 'Olie Energie',
      },
      footer: 'Real-time fossiele brandstof vervanging',
    },
  },
};

type LangKey = keyof typeof baseTranslations;
type TranslationShape = (typeof baseTranslations)["en"];

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export interface SolarEnvironmentalImpactProps {
  width?: number;
  height?: number;
  lang?: LangKey;
  texts?: Partial<Record<LangKey, DeepPartial<TranslationShape>>>;
  apiConfig?: {
    enabled: boolean;
    endpoint: string;
  };
}

// Helper to merge base + overrides
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

// 3D Earth Icon Component
const Earth3DIcon = ({ size = 'lg' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  };

  return (
    <motion.div
      className={`relative ${sizeMap[size]} rounded-full`}
      animate={{ 
        rotateY: [0, 180, 360],
        rotateX: [0, 10, 0]
      }}
      transition={{ 
        duration: 8, 
        repeat: Infinity, 
        ease: "linear" 
      }}
    >
      {/* Earth sphere */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-green-400 to-blue-600 rounded-full shadow-2xl" />
      
      {/* Cloud 1 */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-4 h-2 bg-white/80 rounded-full"
        animate={{ x: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      
      {/* Cloud 2 */}
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-5 h-2 bg-white/80 rounded-full"
        animate={{ x: [0, -3, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      />
      
      {/* Land mass 1 */}
      <div className="absolute top-2/5 left-1/3 w-6 h-4 bg-green-500 rounded-full" />
      
      {/* Land mass 2 */}
      <div className="absolute bottom-1/4 right-1/3 w-5 h-3 bg-green-600 rounded-full" />
      
      {/* Shine effect */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/40 rounded-full blur-sm" />
    </motion.div>
  );
};

// 3D Tree Icon Component
const Tree3DIcon = ({ size = 'lg' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  };

  return (
    <motion.div
      className={`relative ${sizeMap[size]}`}
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 3, repeat: Infinity }}
    >
      {/* Trunk */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-8 bg-yellow-800 rounded-t-lg" />
      
      {/* Leaves layer 1 */}
      <motion.div
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-green-500 rounded-full"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Leaves layer 2 */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-10 h-6 bg-green-400 rounded-full"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
      />
      
      {/* Leaves layer 3 */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-green-300 rounded-full"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
      />
      
      {/* Floating leaves */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-green-400 rounded-full"
          style={{
            left: `${30 + i * 20}%`,
            top: `${20 + i * 10}%`,
          }}
          animate={{
            y: [0, -8, 0],
            x: [0, 3, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.8,
          }}
        />
      ))}
    </motion.div>
  );
};

// 3D Car Icon Component
const Car3DIcon = ({ size = 'lg' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  };

  return (
    <motion.div
      className={`relative ${sizeMap[size]}`}
      animate={{ x: [0, 5, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      {/* Car body */}
      <div className="absolute bottom-0 inset-x-2 h-6 bg-red-500 rounded-lg" />
      
      {/* Car top */}
      <div className="absolute bottom-4 inset-x-4 h-4 bg-red-400 rounded-t-lg" />
      
      {/* Windows */}
      <div className="absolute bottom-6 left-5 w-3 h-2 bg-blue-300 rounded" />
      <div className="absolute bottom-6 right-5 w-3 h-2 bg-blue-300 rounded" />
      
      {/* Wheels */}
      <div className="absolute bottom-0 left-3 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-600" />
      <div className="absolute bottom-0 right-3 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-600" />
      
      {/* Exhaust */}
      <motion.div
        className="absolute top-2 right-0 w-2 h-1 bg-gray-400 rounded-full"
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </motion.div>
  );
};

// 3D Solar Panel Icon Component
const SolarPanel3DIcon = ({ size = 'lg' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  };

  return (
    <motion.div
      className={`relative ${sizeMap[size]}`}
      animate={{ rotateY: [0, 5, 0] }}
      transition={{ duration: 4, repeat: Infinity }}
    >
      {/* Panel base */}
      <div className="absolute inset-2 bg-gradient-to-br from-blue-800 to-blue-600 rounded shadow-lg" />
      
      {/* Solar cells */}
      <div className="absolute inset-3 grid grid-cols-3 grid-rows-3 gap-1">
        {Array.from({ length: 9 }).map((_, i) => (
          <motion.div
            key={i}
            className="bg-blue-400 rounded-sm"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              delay: i * 0.1 
            }}
          />
        ))}
      </div>
      
      {/* Frame */}
      <div className="absolute inset-0 border-2 border-gray-300 rounded-lg" />
      
      {/* Shine reflection */}
      <motion.div
        className="absolute top-1 right-2 w-4 h-1 bg-white/50 rounded-full blur-sm"
        animate={{ x: [0, 8, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </motion.div>
  );
};

// Floating Particle System
const ParticleSystem = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-green-300 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 40 - 20, 0],
            scale: [0, 1, 0],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

// Carbon Reduction Gauge
const CarbonGauge = ({ reduction = 38.6, size = 'lg' }: { reduction?: number; size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  const sizeMap = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-36 h-36',
    xl: 'w-44 h-44'
  };

  const percentage = Math.min(100, (reduction / 50) * 100);

  return (
    <motion.div 
      className={`relative ${sizeMap[size]} bg-gradient-to-br from-green-50/80 to-emerald-100/80 rounded-2xl border-2 border-green-200/50 backdrop-blur-sm shadow-xl flex items-center justify-center`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="relative w-4/5 h-4/5">
        {/* Background circle */}
        <div className="absolute inset-0 rounded-full bg-gray-200" />
        
        {/* Progress arc */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
          style={{
            clipPath: `conic-gradient(transparent 0%, currentColor 0% ${percentage}%, transparent ${percentage}% 100%)`,
          }}
          initial={{ rotate: -90 }}
          animate={{ rotate: [-90, 270] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Center content */}
        <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
          <motion.span 
            className="text-lg font-bold text-green-700"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {reduction.toFixed(1)}
          </motion.span>
          <span className="text-xs text-green-600">tons CO₂</span>
        </div>
      </div>
    </motion.div>
  );
};

// Environmental Impact Cards
const ImpactCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color = 'green',
  size = 'lg' 
}: { 
  title: string; 
  value: string; 
  subtitle: string; 
  icon: React.ReactNode;
  color?: 'green' | 'blue' | 'emerald';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) => {
  const colorMap = {
    green: 'from-green-500 to-emerald-600',
    blue: 'from-blue-500 to-cyan-600',
    emerald: 'from-emerald-500 to-teal-600'
  };

  const sizeMap = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
    xl: 'p-6'
  };

  const textSizeMap = {
    sm: { title: 'text-xs', value: 'text-sm', subtitle: 'text-xs' },
    md: { title: 'text-sm', value: 'text-base', subtitle: 'text-xs' },
    lg: { title: 'text-base', value: 'text-lg', subtitle: 'text-sm' },
    xl: { title: 'text-lg', value: 'text-xl', subtitle: 'text-base' }
  };

  const currentTextSize = textSizeMap[size];

  return (
    <motion.div
      className={`bg-gradient-to-br ${colorMap[color]} rounded-2xl ${sizeMap[size]} text-white shadow-xl backdrop-blur-sm border border-white/20`}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {icon}
          <h3 className={`font-semibold ${currentTextSize.title}`}>{title}</h3>
        </div>
      </div>
      <p className={`font-bold ${currentTextSize.value} mb-2`}>{value}</p>
      <p className={`${currentTextSize.subtitle} text-white/80`}>{subtitle}</p>
    </motion.div>
  );
};

// Fossil Fuel Displacement Visualization
const FossilDisplacement = () => {
  const [displacement, setDisplacement] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplacement(prev => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-24 bg-gradient-to-r from-red-500 via-orange-500 to-green-500 rounded-2xl overflow-hidden shadow-lg">
      {/* Fossil fuels fading out */}
      <motion.div
        className="absolute inset-0 bg-red-500"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 - displacement / 100 }}
      />
      
      {/* Renewable energy growing */}
      <motion.div
        className="absolute inset-0 bg-green-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: displacement / 100 }}
      />
      
      {/* Progress indicator */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 px-4 py-2 rounded-full text-sm font-bold text-green-700 shadow-lg"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {displacement}% Clean Energy
      </motion.div>
    </div>
  );
};

const SolarEnvironmentalImpact: React.FC<SolarEnvironmentalImpactProps> = ({
  width,
  height,
  lang,
  texts,
  apiConfig = {
    enabled: false,
    endpoint: "",
  },
}) => {
  // Determine language
  let autoLang: LangKey = "nl";
  if (typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("en")) {
    autoLang = "en";
  }
  const activeLang: LangKey = lang && (lang === "nl" || lang === "en") ? lang : autoLang;
  const base = baseTranslations[activeLang];
  const overrides = (texts?.[activeLang] ?? {}) as DeepPartial<TranslationShape>;
  const t = mergeLang(base, overrides);
  const [containerSize, setContainerSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');
  const [co2Reduction, setCo2Reduction] = useState(38.6);
  const [treesEquivalent, setTreesEquivalent] = useState(1570);

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

  // Text size mapping - optimized for no cropping
  const textSizeMap = {
    sm: {
      title: 'text-lg lg:text-xl',
      subtitle: 'text-xs',
      cardTitle: 'text-sm',
      cardSubtitle: 'text-xs',
      body: 'text-xs',
      small: 'text-xs',
      kpi: 'text-xs',
      metric: 'text-sm',
      largeMetric: 'text-lg'
    },
    md: {
      title: 'text-xl lg:text-2xl',
      subtitle: 'text-xs lg:text-sm',
      cardTitle: 'text-sm lg:text-base',
      cardSubtitle: 'text-xs',
      body: 'text-xs lg:text-sm',
      small: 'text-xs',
      kpi: 'text-xs lg:text-sm',
      metric: 'text-base lg:text-lg',
      largeMetric: 'text-xl lg:text-2xl'
    },
    lg: {
      title: 'text-2xl lg:text-3xl',
      subtitle: 'text-sm lg:text-base',
      cardTitle: 'text-base lg:text-lg',
      cardSubtitle: 'text-xs lg:text-sm',
      body: 'text-sm lg:text-base',
      small: 'text-xs lg:text-sm',
      kpi: 'text-sm lg:text-base',
      metric: 'text-lg lg:text-xl',
      largeMetric: 'text-2xl lg:text-3xl'
    },
    xl: {
      title: 'text-3xl lg:text-4xl',
      subtitle: 'text-base lg:text-lg',
      cardTitle: 'text-lg lg:text-xl',
      cardSubtitle: 'text-sm lg:text-base',
      body: 'text-base lg:text-lg',
      small: 'text-sm lg:text-base',
      kpi: 'text-base lg:text-lg',
      metric: 'text-xl lg:text-2xl',
      largeMetric: 'text-3xl lg:text-4xl'
    }
  };

  const currentTextSize = textSizeMap[containerSize];

  useEffect(() => {
    if (apiConfig.enabled && apiConfig.endpoint) {
      console.log('Fetching environmental data from:', apiConfig.endpoint);
      // Simulate API data updates
      const interval = setInterval(() => {
        setCo2Reduction(prev => prev + Math.random() * 0.1);
        setTreesEquivalent(prev => prev + Math.random());
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [apiConfig.enabled, apiConfig.endpoint]);

  return (
    <div 
      className="w-full h-full flex flex-col overflow-hidden relative min-h-0"
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
        maxWidth: width,
        maxHeight: height,
        background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 25%, #6ee7b7 50%, #34d399 75%, #10b981 100%)',
      }}
    >
      <ParticleSystem />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(containerSize === 'sm' ? 3 : 6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/20"
            style={{
              width: containerSize === 'sm' ? 40 : 80 + Math.random() * 80,
              height: containerSize === 'sm' ? 40 : 80 + Math.random() * 80,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Header - Compact */}
      <motion.header 
        className="relative z-10 w-full px-3 lg:px-6 pt-3 lg:pt-4 flex-shrink-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-3 lg:mb-4">
          <div className="flex items-center justify-center mb-2 lg:mb-3">
            <Earth3DIcon size={containerSize} />
          </div>
          <motion.h1 
            className={`font-black text-white mb-1 lg:mb-2 ${currentTextSize.title} drop-shadow-lg`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {t.title}
          </motion.h1>
          <motion.p 
            className={`text-white/90 ${currentTextSize.subtitle} font-light`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {t.subtitle}
          </motion.p>
        </div>

        {/* Main Impact Cards - Responsive grid */}
        <div className={`grid grid-cols-1 ${containerSize === 'sm' ? 'gap-2' : 'gap-3 lg:gap-4'} mb-3 lg:mb-4`}>
          <ImpactCard
            title={t.totalReduction}
            value={t.totalReductionValue}
            subtitle={t.equivalent}
            icon={<CarbonGauge size={containerSize} reduction={co2Reduction} />}
            color="green"
            size={containerSize}
          />
          <ImpactCard
            title={t.kpis.annualReduction}
            value={t.kpis.annualValue}
            subtitle="Continuous environmental benefit"
            icon={<Tree3DIcon size={containerSize} />}
            color="emerald"
            size={containerSize}
          />
          <ImpactCard
            title={t.kpis.equivalentCars}
            value={t.kpis.carsValue}
            subtitle="Road emissions eliminated"
            icon={<Car3DIcon size={containerSize} />}
            color="blue"
            size={containerSize}
          />
        </div>
      </motion.header>

      {/* Main Content - Optimized for no cropping */}
      <main className="relative z-10 flex-1 w-full px-3 lg:px-6 pb-3 lg:pb-4 overflow-hidden min-h-0">
        <div className="w-full h-full grid grid-cols-1 xl:grid-cols-2 gap-3 lg:gap-4 min-h-0">
          {/* Left Column - Environmental Metrics */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3 lg:space-y-4 min-h-0"
          >
            {/* Real-time Impact Visualization */}
            <motion.div
              className="bg-white/90 backdrop-blur-xl rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-xl border border-white/20 flex flex-col min-h-0"
              whileHover={{ scale: 1.01 }}
            >
              <h2 className={`font-bold text-gray-800 ${currentTextSize.cardTitle} mb-2 lg:mb-3 text-center`}>
                {t.leftCard.title}
              </h2>
              <div className="grid grid-cols-2 gap-2 lg:gap-3 flex-1">
                {[
                  { label: t.leftCard.legend.operation, value: '72%', color: '#10B981', icon: <SolarPanel3DIcon size="sm" /> },
                  { label: t.leftCard.legend.manufacturing, value: '16%', color: '#34D399', icon: '🏭' },
                  { label: t.leftCard.legend.transport, value: '8%', color: '#6EE7B7', icon: '🚚' },
                  { label: t.leftCard.legend.disposal, value: '4%', color: '#A7F3D0', icon: '♻️' },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="p-2 lg:p-3 rounded-xl lg:rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 text-center flex flex-col items-center justify-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="text-lg lg:text-xl mb-1 lg:mb-2">{item.icon}</div>
                    <div className={`font-bold mb-1 ${currentTextSize.metric}`} style={{ color: item.color }}>
                      {item.value}
                    </div>
                    <div className={`text-gray-600 ${currentTextSize.small}`}>{item.label}</div>
                  </motion.div>
                ))}
              </div>
              <p className={`text-gray-500 text-center mt-2 lg:mt-3 ${currentTextSize.small}`}>
                {t.leftCard.footer}
              </p>
            </motion.div>

            {/* Tree Equivalent Counter */}
            <motion.div
              className="bg-white/90 backdrop-blur-xl rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-xl border border-white/20 text-center flex-shrink-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className={`font-bold text-gray-800 ${currentTextSize.cardTitle} mb-2 lg:mb-3`}>
                {t.equivalent}
              </h3>
              <motion.div
                className={`font-black text-green-600 mb-1 lg:mb-2 ${currentTextSize.largeMetric}`}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {treesEquivalent.toLocaleString()}
              </motion.div>
              <p className={`text-gray-600 ${currentTextSize.small}`}>Trees actively cleaning our atmosphere</p>
            </motion.div>
          </motion.div>

          {/* Right Column - Fossil Fuel Displacement */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3 lg:space-y-4 min-h-0"
          >
            {/* Energy Transition */}
            <motion.div
              className="bg-white/90 backdrop-blur-xl rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-xl border border-white/20 flex flex-col min-h-0"
              whileHover={{ scale: 1.01 }}
            >
              <h2 className={`font-bold text-gray-800 ${currentTextSize.cardTitle} mb-2 lg:mb-3`}>
                {t.rightCard.title}
              </h2>
              <p className={`text-gray-600 ${currentTextSize.cardSubtitle} mb-3 lg:mb-4`}>
                {t.rightCard.subtitle}
              </p>
              
              <div className="flex-1 flex items-center justify-center mb-3 lg:mb-4">
                <FossilDisplacement />
              </div>
              
              <div className="grid grid-cols-3 gap-2 lg:gap-3 flex-shrink-0">
                {[
                  { type: t.rightCard.legend.coalAvoided, amount: '18.2 tons', color: '#8B4513' },
                  { type: t.rightCard.legend.gasAvoided, amount: '12.8 tons', color: '#DC2626' },
                  { type: t.rightCard.legend.oilAvoided, amount: '7.6 tons', color: '#CA8A04' },
                ].map((fuel, index) => (
                  <motion.div
                    key={index}
                    className="text-center p-2 rounded-lg border-2"
                    style={{ borderColor: fuel.color }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <div className={`font-semibold text-gray-800 ${currentTextSize.small}`}>{fuel.type}</div>
                    <div className={`font-bold ${currentTextSize.metric}`} style={{ color: fuel.color }}>
                      {fuel.amount}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <p className={`text-gray-500 text-center mt-2 lg:mt-3 ${currentTextSize.small}`}>
                {t.rightCard.footer}
              </p>
            </motion.div>

            {/* Environmental Achievement */}
            <motion.div
              className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl lg:rounded-2xl p-3 lg:p-4 text-white text-center shadow-xl flex-shrink-0"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              <h3 className={`font-bold mb-1 lg:mb-2 ${currentTextSize.cardTitle}`}>
                🌍 Environmental Achievement
              </h3>
              <p className={`mb-2 lg:mb-3 ${currentTextSize.body}`}>
                Your solar system has prevented
              </p>
              <motion.div
                className={`font-black mb-1 lg:mb-2 ${currentTextSize.largeMetric}`}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {co2Reduction.toFixed(1)} tons CO₂
              </motion.div>
              <p className={currentTextSize.small}>
                from entering our atmosphere
              </p>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default SolarEnvironmentalImpact;