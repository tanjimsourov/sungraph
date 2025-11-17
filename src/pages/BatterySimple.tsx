// src/pages/BatterySimple.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export interface BatterySimpleProps {
  width?: number;
  height?: number;
  lang?: 'nl' | 'en';
  texts?: any;
  apiConfig?: { enabled?: boolean; endpoint?: string };
}

/* ----------------------------- translations ----------------------------- */
const baseTranslations = {
  nl: {
    badge: "Thuisbatterij",
    title: "Wandbatterij 10 kWh",
    desc: "Geschikt voor woningen met zonnepanelen, muurmontage, uitbreiding mogelijk.",
    specs: {
      capacity: "Capaciteit",
      coupling: "Koppeling",
      mounting: "Plaatsing",
      usecase: "Toepassing",
    },
    values: {
      capacity: "10 kWh",
      coupling: "Hybride / DC",
      mounting: "Muur",
      usecase: "Eigen verbruik",
    },
    cta: "Vraag offerte",
    datasheet: "Technische fiche →",
    batteryFace: "10 kWh",
  },
  en: {
    badge: "Home Battery",
    title: "Wall Battery 10 kWh",
    desc: "Ideal for solar-equipped homes; wall-mounted; expandable.",
    specs: {
      capacity: "Capacity",
      coupling: "Coupling",
      mounting: "Mounting",
      usecase: "Use case",
    },
    values: {
      capacity: "10 kWh",
      coupling: "Hybrid / DC",
      mounting: "Wall",
      usecase: "Self-consumption",
    },
    cta: "Request Quote",
    datasheet: "Data sheet →",
    batteryFace: "10 kWh",
  },
};

type LangKey = keyof typeof baseTranslations;
type TranslationShape = (typeof baseTranslations)["en"];

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

// Enhanced BatterySimple with proper typing
const BatterySimple: React.FC<BatterySimpleProps> = ({ 
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
  const t = baseTranslations[activeLang];

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

  // API data fetching
  useEffect(() => {
    if (apiConfig.enabled && apiConfig.endpoint) {
      // API fetch logic would go here
      console.log('Fetching battery data from:', apiConfig.endpoint);
    }
  }, [apiConfig.enabled, apiConfig.endpoint]);

  return (
    <div 
      className="w-full h-full flex flex-col overflow-hidden bg-slate-900 relative"
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
        maxWidth: width,
        maxHeight: height,
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-emerald-400/5 to-cyan-400/3"
            style={{
              width: 40 + Math.random() * 80,
              height: 40 + Math.random() * 80,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 15 - 7.5, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 15 + Math.random() * 15,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <motion.div
        className="relative w-full h-full bg-slate-950 text-slate-50 flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Image side */}
        <motion.div 
          className="w-[40%] h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center relative overflow-hidden"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Animated energy background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-cyan-400/5"
            animate={{
              opacity: [0.2, 0.4, 0.2],
              x: [-50, 50, -50],
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          
          {/* Battery drawing with animations */}
          <motion.div 
            className="w-28 h-32 relative"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div 
              className="w-20 h-28 bg-slate-100/10 border-2 border-emerald-200/40 rounded-xl relative flex items-center justify-center backdrop-blur-sm"
              animate={{
                boxShadow: [
                  '0 0 0px rgba(52, 211, 153, 0.3)',
                  '0 0 15px rgba(52, 211, 153, 0.5)',
                  '0 0 0px rgba(52, 211, 153, 0.3)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {/* Battery terminal */}
              <div className="w-6 h-2 bg-emerald-200/60 rounded absolute -top-2 left-1/2 -translate-x-1/2" />
              
              {/* Animated charge level */}
              <motion.div
                className="absolute bottom-2 left-2 right-2 h-6 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-md"
                initial={{ width: '30%' }}
                animate={{ width: ['30%', '80%', '30%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <motion.span 
                className="text-[10px] text-slate-100/80 font-medium relative z-10"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {t.batteryFace}
              </motion.span>
            </motion.div>

            {/* Floating energy particles */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-emerald-400/40 rounded-full"
                style={{
                  left: `${20 + i * 20}%`,
                  top: `${10 + i * 25}%`,
                }}
                animate={{
                  y: [0, -15, 0],
                  opacity: [0, 1, 0],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.8,
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Content side */}
        <motion.div 
          className="flex-1 p-7 flex flex-col gap-4"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Header section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.p 
              className={`text-slate-300 mb-1 ${currentTextSize.small}`}
              whileHover={{ color: '#10b981' }}
            >
              {t.badge}
            </motion.p>
            <motion.h1 
              className={`font-semibold text-white ${currentTextSize.title}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {t.title}
            </motion.h1>
            <motion.p 
              className={`text-slate-200/80 mt-1 leading-relaxed ${currentTextSize.body}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {t.desc}
            </motion.p>
          </motion.div>

          {/* Specs grid */}
          <motion.div 
            className="grid grid-cols-2 gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {[
              { label: t.specs.capacity, value: t.values.capacity },
              { label: t.specs.coupling, value: t.values.coupling },
              { label: t.specs.mounting, value: t.values.mounting },
              { label: t.specs.usecase, value: t.values.usecase },
            ].map((spec, index) => (
              <motion.div
                key={spec.label}
                className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-3 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.02,
                  borderColor: 'rgba(16, 185, 129, 0.3)',
                  transition: { type: "spring", stiffness: 300 }
                }}
              >
                <motion.p 
                  className={`text-slate-300 ${currentTextSize.small}`}
                  whileHover={{ color: '#cbd5e1' }}
                >
                  {spec.label}
                </motion.p>
                <motion.p 
                  className={`font-semibold text-emerald-300 ${currentTextSize.metric}`}
                  whileHover={{ color: '#34d399' }}
                >
                  {spec.value}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>

          {/* Action buttons */}
          <motion.div 
            className="flex gap-3 mt-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <motion.button 
              className="bg-emerald-400 text-slate-950 px-4 py-2 rounded-lg font-medium hover:bg-emerald-300 shadow-lg backdrop-blur-sm"
              whileHover={{ 
                scale: 1.05,
                transition: { type: "spring", stiffness: 400 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className={currentTextSize.small}>{t.cta}</span>
            </motion.button>
            <motion.button 
              className={`text-slate-200/70 hover:text-white ${currentTextSize.small} flex items-center gap-1`}
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {t.datasheet}
              <motion.span
                animate={{ x: [0, 2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BatterySimple;