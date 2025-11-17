// pages/AirQualityMonitor.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Translation dictionaries (base defaults)
type TranslationShape = {
  title: string;
  subtitle: string;
  airQuality: string;
  aqiValue: string;
  healthImpact: string;
  info: {
    description: string;
    liveChip: string;
    healthChip: string;
  };
  kpis: {
    pm25: string;
    pm25Value: string;
    pm10: string;
    pm10Value: string;
    no2: string;
    no2Value: string;
  };
  leftCard: {
    title: string;
    subtitle: string;
    legend: {
      good: string;
      moderate: string;
      poor: string;
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
    levels: {
      range: string;
      label: string;
      color: string;
    }[];
    footer: string;
  };
};
const baseTranslations = {
  en: {
    title: 'Urban Air Quality Monitor',
    subtitle: 'Real-time pollution tracking and health recommendations',
    airQuality: 'Air Quality Index',
    aqiValue: '75 - Moderate',
    healthImpact: 'Acceptable for most',
    info: {
      description: 'Live air quality monitoring with particulate matter tracking and personalized health recommendations.',
      liveChip: '• Live Data',
      healthChip: '• Health Alerts',
    },
    kpis: {
      pm25: 'PM2.5',
      pm25Value: '12.3 µg/m³',
      pm10: 'PM10', 
      pm10Value: '24.1 µg/m³',
      no2: 'NO₂',
      no2Value: '18.7 µg/m³',
    },
    leftCard: {
      title: 'Pollution Particles',
      subtitle: 'Real-time particulate matter visualization',
      legend: {
        good: 'Good',
        moderate: 'Moderate', 
        poor: 'Poor'
      },
      footer: 'Live particle tracking system'
    },
    centerCard: {
      title: 'Wind & Weather Impact',
      note: 'Wind patterns affect pollution dispersion',
    },
    rightCard: {
      title: 'Air Quality Index',
      subtitle: 'Current pollution levels and health impact',
      levels: [
        { range: '0-50', label: 'Good', color: '#10B981' },
        { range: '51-100', label: 'Moderate', color: '#F59E0B' },
        { range: '101+', label: 'Poor', color: '#EF4444' }
      ],
      footer: 'AQI Monitoring System'
    }
  },
  nl: {
    title: 'Stedelijke Luchtkwaliteit Monitor',
    subtitle: 'Real-time vervuiling tracking en gezondheidsadviezen',
    airQuality: 'Luchtkwaliteit Index',
    aqiValue: '75 - Matig',
    healthImpact: 'Acceptabel voor de meesten',
    info: {
      description: 'Live luchtkwaliteitsmonitoring met fijnstof tracking en gepersonaliseerde gezondheidsaanbevelingen.',
      liveChip: '• Live Data',
      healthChip: '• Gezondheids Waarschuwingen',
    },
    kpis: {
      pm25: 'PM2.5',
      pm25Value: '12.3 µg/m³',
      pm10: 'PM10',
      pm10Value: '24.1 µg/m³', 
      no2: 'NO₂',
      no2Value: '18.7 µg/m³',
    },
    leftCard: {
      title: 'Vervuilingsdeeltjes',
      subtitle: 'Real-time fijnstof visualisatie',
      legend: {
        good: 'Goed',
        moderate: 'Matig',
        poor: 'Slecht'
      },
      footer: 'Live deeltjes tracking systeem'
    },
    centerCard: {
      title: 'Wind & Weer Invloed',
      note: 'Windpatronen beïnvloeden vervuilingsverspreiding',
    },
    rightCard: {
      title: 'Luchtkwaliteit Index',
      subtitle: 'Huidige vervuilingsniveaus en gezondheidsimpact',
      levels: [
        { range: '0-50', label: 'Goed', color: '#10B981' },
        { range: '51-100', label: 'Matig', color: '#F59E0B' },
        { range: '101+', label: 'Slecht', color: '#EF4444' }
      ],
      footer: 'AQI Monitoring Systeem'
    }
  }
};


type LangKey = keyof typeof baseTranslations;


type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export interface AirQualityMonitorProps {
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
      levels: override.rightCard?.levels ? override.rightCard.levels as any : base.rightCard.levels
    },
  };
}

// Enhanced Particle Animation with different design
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  type: number;
  opacity: number;
}

const AirParticleAnimation = ({ size = 'lg' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  const sizeMap = {
    sm: 'w-32 h-24',
    md: 'w-40 h-28', 
    lg: 'w-48 h-32',
    xl: 'w-56 h-36'
  };

  const [particles, setParticles] = useState<Particle[]>([]);
  
  useEffect(() => {
    const newParticles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 5 + 2,
      speed: Math.random() * 3 + 1,
      type: Math.floor(Math.random() * 3),
      opacity: Math.random() * 0.6 + 0.4
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className={`relative ${sizeMap[size]} bg-gradient-to-br from-slate-50/80 to-blue-100/80 rounded-2xl border-2 border-blue-200/50 backdrop-blur-sm shadow-2xl overflow-hidden`}>
      {/* Animated background gradient */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-cyan-200/20 to-blue-300/10"
        animate={{
          background: [
            'linear-gradient(135deg, rgba(186,230,253,0.2) 0%, rgba(125,211,252,0.1) 100%)',
            'linear-gradient(135deg, rgba(125,211,252,0.2) 0%, rgba(56,189,248,0.1) 100%)',
            'linear-gradient(135deg, rgba(186,230,253,0.2) 0%, rgba(125,211,252,0.1) 100%)',
          ]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${
            particle.type === 0 ? 'bg-emerald-400' : 
            particle.type === 1 ? 'bg-amber-400' : 'bg-rose-500'
          } shadow-sm`}
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
          }}
          animate={{
            y: [particle.y, particle.y - 60, particle.y - 30],
            x: [particle.x, particle.x + (Math.random() * 30 - 15), particle.x + (Math.random() * 20 - 10)],
            opacity: [0, particle.opacity, 0],
            scale: [0, 1, 0.5],
          }}
          transition={{
            duration: particle.speed * 6,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Wind direction indicator with enhanced animation */}
      <motion.div
        className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full backdrop-blur-sm border border-blue-200 flex items-center justify-center shadow-lg"
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 12, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity }
        }}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#3B82F6" strokeWidth="2.5">
          <path d="M22 12l-4-4m4 4l-4 4m4-4H2" />
        </svg>
      </motion.div>

      {/* Floating city skyline silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-slate-800/30 to-transparent">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 bg-slate-700/40"
            style={{
              left: `${i * 12}%`,
              width: '8%',
              height: `${10 + Math.random() * 10}px`,
            }}
            animate={{
              height: [
                `${10 + Math.random() * 10}px`,
                `${12 + Math.random() * 12}px`, 
                `${10 + Math.random() * 10}px`
              ]
            }}
            transition={{ duration: 8 + i, repeat: Infinity }}
          />
        ))}
      </div>
    </div>
  );
};

// Enhanced Air Quality Dial with different design
interface AirQualityDialProps {
  aqi?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const AirQualityDial = ({ aqi = 75, size = 'lg' }: AirQualityDialProps) => {
  const sizeMap = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-36 h-36', 
    xl: 'w-44 h-44'
  };

  const getAQIColor = (value: number): string => {
    if (value <= 50) return '#10B981';
    if (value <= 100) return '#F59E0B';
    return '#EF4444';
  };

  const getAQIStatus = (value: number): string => {
    if (value <= 50) return 'Good';
    if (value <= 100) return 'Moderate';
    return 'Poor';
  };

  return (
    <motion.div 
      className={`relative ${sizeMap[size]} bg-gradient-to-br from-white to-blue-50 rounded-2xl border-2 border-blue-200/50 backdrop-blur-sm shadow-2xl flex items-center justify-center`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <svg viewBox="0 0 100 100" className="w-4/5 h-4/5">
        {/* Outer glow effect */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={getAQIColor(aqi)}
          strokeWidth="2"
          strokeOpacity="0.3"
          animate={{
            strokeOpacity: [0.2, 0.4, 0.2],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        {/* Main arc */}
        <motion.path
          d="M 15,80 A 35 35 0 1 1 85,80"
          fill="none"
          stroke={getAQIColor(aqi)}
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: aqi / 150 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
        />
        
        {/* Animated dots along the arc */}
        {[0, 25, 50, 75, 100, 125, 150].map((point, index) => (
          <motion.circle
            key={index}
            cx={50 + 35 * Math.cos((point / 150) * Math.PI - Math.PI / 2)}
            cy={50 + 35 * Math.sin((point / 150) * Math.PI - Math.PI / 2)}
            r="1.5"
            fill={aqi >= point ? getAQIColor(aqi) : '#E5E7EB'}
            animate={{
              fill: aqi >= point ? [getAQIColor(aqi), '#ffffff', getAQIColor(aqi)] : '#E5E7EB'
            }}
            transition={{ duration: 2, delay: index * 0.1 }}
          />
        ))}
        
        {/* Enhanced needle with glow */}
        <motion.g
          animate={{
            rotate: [0, (aqi / 150) * 180 - 90],
          }}
          transition={{ duration: 2.5, ease: "easeOut" }}
        >
          <line
            x1="50"
            y1="50"
            x2="50"
            y2="25"
            stroke="#1F2937"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="50" cy="50" r="4" fill="#1F2937" />
        </motion.g>
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-center"
        >
          <span className={`font-bold text-gray-800 ${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl'}`}>
            {aqi}
          </span>
          <span className="text-xs text-gray-600 block">AQI</span>
          <motion.span 
            className="text-[10px] font-semibold block mt-1"
            style={{ color: getAQIColor(aqi) }}
            key={getAQIStatus(aqi)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {getAQIStatus(aqi)}
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Weather Impact Component
const WeatherImpact = ({ size = 'lg' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  const textSizeMap = {
    sm: 'text-xs',
    md: 'text-sm', 
    lg: 'text-base',
    xl: 'text-lg'
  };

  return (
    <motion.div 
      className="bg-gradient-to-br from-cyan-50/80 to-blue-100/80 rounded-2xl border-2 border-cyan-200/50 backdrop-blur-sm shadow-2xl p-4 lg:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h3 className={`font-bold text-cyan-800 mb-3 lg:mb-4 ${textSizeMap[size]}`}>Weather Impact</h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className={`text-gray-600 ${textSizeMap[size]}`}>Wind Speed</span>
          <motion.span 
            className={`font-semibold text-gray-800 ${textSizeMap[size]}`}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            12 km/h
          </motion.span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className={`text-gray-600 ${textSizeMap[size]}`}>Humidity</span>
          <span className={`font-semibold text-gray-800 ${textSizeMap[size]}`}>65%</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className={`text-gray-600 ${textSizeMap[size]}`}>Pressure</span>
          <span className={`font-semibold text-gray-800 ${textSizeMap[size]}`}>1013 hPa</span>
        </div>
      </div>

      {/* Wind direction visualization */}
      <motion.div 
        className="mt-4 flex items-center justify-center gap-2"
        animate={{ x: [0, 5, 0, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        <svg className="w-6 h-6 text-cyan-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M2 12l4-4m-4 4l4 4m-4-4h20"/>
        </svg>
        <span className={`text-cyan-600 ${textSizeMap[size]}`}>NE Wind</span>
      </motion.div>
    </motion.div>
  );
};

const AirQualityMonitor: React.FC<AirQualityMonitorProps> = ({
  width,
  height,
  lang,
  texts,
  apiConfig = {
    enabled: false,
    endpoint: "",
  },
}) => {
  // Language detection like Climate component
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

  const [aqi, setAqi] = useState(75);
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
      console.log('Fetching data from:', apiConfig.endpoint);
    }

    const interval = setInterval(() => {
      setAqi(prev => Math.max(0, Math.min(150, prev + Math.random() * 8 - 4)));
    }, 4000);
    return () => clearInterval(interval);
  }, [apiConfig.enabled, apiConfig.endpoint]);

  const getAQIStatus = (value: number): string => {
    if (value <= 50) return activeLang === 'nl' ? 'Goed' : 'Good';
    if (value <= 100) return activeLang === 'nl' ? 'Matig' : 'Moderate';
    return activeLang === 'nl' ? 'Slecht' : 'Poor';
  };

  return (
    <div 
      className="w-full h-full flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 relative"
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
        maxWidth: width,
        maxHeight: height,
      }}
    >
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-200/20 to-cyan-300/10"
            style={{
              width: 30 + Math.random() * 70,
              height: 30 + Math.random() * 70,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -25, 0],
              x: [0, Math.random() * 8 - 4, 0],
            }}
            transition={{
              duration: 12 + Math.random() * 12,
              repeat: Infinity,
              ease: "linear",
            }}
          />
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
              className={`${containerSize === 'sm' ? 'w-8 h-8' : containerSize === 'md' ? 'w-10 h-10' : containerSize === 'lg' ? 'w-12 h-12' : 'w-14 h-14'} bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <svg className={`${containerSize === 'sm' ? 'w-4 h-4' : containerSize === 'md' ? 'w-5 h-5' : containerSize === 'lg' ? 'w-6 h-6' : 'w-7 h-7'} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </motion.div>
            <div className="flex-1 min-w-0">
              <motion.h1 
                className={`font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent leading-tight ${currentTextSize.title} truncate`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {t.title}
              </motion.h1>
              <motion.p 
                className={`text-blue-600 mt-1 font-light ${currentTextSize.subtitle} truncate`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {t.subtitle}
              </motion.p>
            </div>
          </div>

          {/* Info Bar */}
          <motion.div 
            className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl px-3 lg:px-4 py-2 lg:py-3 border border-white/70 shadow-lg w-full"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2 lg:gap-3">
              <p className={`text-blue-700 leading-relaxed font-medium flex-1 ${currentTextSize.body} line-clamp-2`}>
                {t.info.description}
              </p>
              <div className="flex gap-1 lg:gap-2 flex-shrink-0">
                <motion.span 
                  className="px-2 lg:px-3 py-1 rounded-full bg-blue-500/20 text-blue-700 font-semibold border border-blue-400/30 whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className={currentTextSize.small}>{t.info.liveChip}</span>
                </motion.span>
                <motion.span 
                  className="px-2 lg:px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-700 font-semibold border border-cyan-400/30 whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className={currentTextSize.small}>{t.info.healthChip}</span>
                </motion.span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Hero Metric Card */}
        <motion.div 
          className="bg-white/90 backdrop-blur-lg border border-white/70 rounded-xl lg:rounded-2xl px-3 lg:px-4 py-2 lg:py-3 shadow-xl w-full lg:w-auto lg:min-w-[200px] xl:min-w-[240px] border-l-4 border-l-blue-500 mt-2 lg:mt-0 lg:ml-3"
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
              <div className={`${containerSize === 'sm' ? 'w-8 h-8' : containerSize === 'md' ? 'w-10 h-10' : containerSize === 'lg' ? 'w-12 h-12' : 'w-14 h-14'} bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                <svg className={`${containerSize === 'sm' ? 'w-4 h-4' : containerSize === 'md' ? 'w-5 h-5' : containerSize === 'lg' ? 'w-6 h-6' : 'w-7 h-7'} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className={`text-blue-600 font-semibold uppercase tracking-wide ${currentTextSize.small}`}>{t.airQuality}</p>
              <motion.p 
                className={`font-bold text-blue-700 leading-none tracking-tight mt-1 ${currentTextSize.largeMetric}`}
                key={aqi}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
              >
                {aqi} - {getAQIStatus(aqi)}
              </motion.p>
              <motion.p 
                className={`text-green-600 font-medium mt-1 flex items-center gap-1 ${currentTextSize.small}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
                {t.healthImpact}
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
          { label: t.kpis.pm25, value: t.kpis.pm25Value, color: 'blue' },
          { label: t.kpis.pm10, value: t.kpis.pm10Value, color: 'cyan' },
          { label: t.kpis.no2, value: t.kpis.no2Value, color: 'indigo' },
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
            <span className={`font-bold text-blue-800 ${currentTextSize.kpi} truncate`}>{kpi.value}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 w-full px-3 lg:px-6 pb-2 lg:pb-3 pt-2 lg:pt-3 overflow-hidden min-h-0">
        <div className="w-full h-full grid grid-cols-1 xl:grid-cols-3 gap-2 lg:gap-4 xl:gap-6" style={{ height: '100%' }}>
          {/* Left Card - Particle Animation */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl border border-white/60 shadow-lg p-3 lg:p-4 flex flex-col min-h-0"
            style={{ height: '100%' }}
          >
            <div className="mb-2 lg:mb-3 flex-shrink-0">
              <p className={`font-bold text-blue-800 mb-1 ${currentTextSize.cardTitle}`}>{t.leftCard.title}</p>
              <p className={`text-blue-600 ${currentTextSize.cardSubtitle}`}>{t.leftCard.subtitle}</p>
            </div>
            
            <div className="flex-1 flex items-center justify-center mb-2 lg:mb-3 min-h-0">
              <AirParticleAnimation size={containerSize} />
            </div>
            
            <div className="flex gap-2 lg:gap-3 justify-center flex-shrink-0">
              {[
                { label: t.leftCard.legend.good, color: 'bg-emerald-400' },
                { label: t.leftCard.legend.moderate, color: 'bg-amber-400' },
                { label: t.leftCard.legend.poor, color: 'bg-rose-500' }
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
            <p className={`text-blue-400 text-center mt-2 ${currentTextSize.small}`}>{t.leftCard.footer}</p>
          </motion.div>

          {/* Center Column */}
          <div className="flex flex-col gap-2 lg:gap-3 xl:gap-4 min-h-0" style={{ height: '100%' }}>
            <WeatherImpact size={containerSize} />
            
            {/* AQI Dial Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl border border-white/60 shadow-lg p-3 lg:p-4 flex-1 flex flex-col min-h-0"
              style={{ height: '100%' }}
            >
              <div className="text-center mb-2 lg:mb-3 flex-shrink-0">
                <p className={`font-bold text-blue-800 mb-1 ${currentTextSize.cardTitle}`}>{t.rightCard.title}</p>
                <p className={`text-blue-600 ${currentTextSize.cardSubtitle}`}>{t.rightCard.subtitle}</p>
              </div>
              
              <div className="flex-1 flex items-center justify-center mb-2 lg:mb-3 min-h-0">
                <AirQualityDial aqi={aqi} size={containerSize} />
              </div>
              
              <div className="grid grid-cols-3 gap-1 lg:gap-2 flex-shrink-0">
                {t.rightCard.levels.map((level, index) => (
                  <motion.div
                    key={level.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="text-center p-1 lg:p-2 rounded-lg bg-white/60 border border-white/70"
                  >
                    <div 
                      className="w-2 lg:w-3 h-2 lg:h-3 rounded-full mx-auto mb-1"
                      style={{ backgroundColor: level.color }}
                    />
                    <div className={`font-medium text-gray-700 ${currentTextSize.small}`}>
                      {level.label}
                    </div>
                    <div className={`text-gray-500 ${currentTextSize.small}`}>
                      {level.range}
                    </div>
                  </motion.div>
                ))}
              </div>
              <p className={`text-blue-400 text-center mt-2 ${currentTextSize.small}`}>{t.rightCard.footer}</p>
            </motion.div>
          </div>

          {/* Right Card - Pollution Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white/80 backdrop-blur-lg rounded-xl lg:rounded-2xl border border-white/60 shadow-lg p-3 lg:p-4 min-h-0"
            style={{ height: '100%' }}
          >
            <div className="mb-2 lg:mb-3 flex-shrink-0">
              <p className={`font-bold text-blue-800 mb-1 ${currentTextSize.cardTitle}`}>Pollution Analytics</p>
              <p className={`text-blue-600 ${currentTextSize.cardSubtitle}`}>Detailed pollutant breakdown</p>
            </div>

            {/* Pollution Metrics */}
            <div className="space-y-2 lg:space-y-3 flex-1">
              {[
                { pollutant: 'PM2.5', value: '12.3 µg/m³', level: 'Moderate', color: 'amber', trend: '+0.2' },
                { pollutant: 'PM10', value: '24.1 µg/m³', level: 'Good', color: 'emerald', trend: '-0.5' },
                { pollutant: 'NO₂', value: '18.7 µg/m³', level: 'Good', color: 'emerald', trend: '-0.1' },
                { pollutant: 'O₃', value: '45.2 µg/m³', level: 'Moderate', color: 'amber', trend: '+1.2' },
                { pollutant: 'SO₂', value: '3.1 µg/m³', level: 'Good', color: 'emerald', trend: '0.0' },
                { pollutant: 'CO', value: '0.8 mg/m³', level: 'Good', color: 'emerald', trend: '-0.1' },
              ].map((item, index) => (
                <motion.div
                  key={item.pollutant}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="flex items-center justify-between p-2 rounded-lg bg-white/60 border border-white/70"
                >
                  <div className="flex-1">
                    <div className={`font-semibold text-gray-800 ${currentTextSize.small}`}>
                      {item.pollutant}
                    </div>
                    <div className={`text-gray-600 ${currentTextSize.small}`}>
                      {item.value}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-${item.color}-600 ${currentTextSize.small}`}>
                      {item.level}
                    </div>
                    <div className={`text-${item.trend.startsWith('+') ? 'red' : 'green'}-500 ${currentTextSize.small}`}>
                      {item.trend}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Health Recommendations */}
            <motion.div 
              className="mt-3 lg:mt-4 p-2 lg:p-3 bg-blue-50/50 rounded-lg border border-blue-200/50 flex-shrink-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <p className={`font-semibold text-blue-800 mb-1 lg:mb-2 ${currentTextSize.small}`}>
                {activeLang === 'nl' ? 'Gezondheidsadvies' : 'Health Advice'}
              </p>
              <p className={`text-blue-700 ${currentTextSize.small}`}>
                {activeLang === 'nl' 
                  ? 'Buitensporten is acceptabel voor de meeste mensen.'
                  : 'Outdoor exercise is acceptable for most people.'
                }
              </p>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AirQualityMonitor;