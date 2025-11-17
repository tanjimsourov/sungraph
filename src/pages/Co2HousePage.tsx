// src/pages/Co2HousePage.tsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Translation dictionary
const baseTranslations = {
  nl: {
    measures: ['Isolatie en optimalisatie CV', 'Zonnepanelen', "Deelauto's", 'TOTAAL'],
    tonLabel: 'ton CO₂:',
    household: 'Huishouden',
    neighbourhood: 'Soesterkwartier',
    subtitle: 'CO₂ Reductie Overzicht',
    description: 'Vergelijking van CO₂ besparingen tussen huishouden en buurt',
    impact: 'Impact',
    savings: 'Besparingen',
    environment: 'Milieu',
  },
  en: {
    measures: ['Insulation and central heating optimisation', 'Solar panels', 'Car sharing', 'TOTAL'],
    tonLabel: 'tonnes CO₂:',
    household: 'Household',
    neighbourhood: 'Soester quarter',
    subtitle: 'CO₂ Reduction Overview',
    description: 'Comparison of CO₂ savings between household and neighborhood',
    impact: 'Impact',
    savings: 'Savings',
    environment: 'Environment',
  },
};

type LangKey = keyof typeof baseTranslations;

export interface Co2HousePageProps {
  width?: number;
  height?: number;
  lang?: LangKey;
  apiConfig?: {
    enabled: boolean;
    endpoint: string;
  };
}

const Co2HousePage: React.FC<Co2HousePageProps> = ({
  width,
  height,
  lang,
  apiConfig = {
    enabled: false,
    endpoint: "",
  },
}) => {
  const [containerSize, setContainerSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');
  const [activeMeasure, setActiveMeasure] = useState(0);

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
      title: 'text-sm',
      subtitle: 'text-xs',
      body: 'text-xs',
      small: 'text-[10px]',
      metric: 'text-xs',
      kpi: 'text-[9px]'
    },
    md: {
      title: 'text-base',
      subtitle: 'text-xs',
      body: 'text-xs',
      small: 'text-xs',
      metric: 'text-sm',
      kpi: 'text-xs'
    },
    lg: {
      title: 'text-lg',
      subtitle: 'text-sm',
      body: 'text-sm',
      small: 'text-xs',
      metric: 'text-base',
      kpi: 'text-sm'
    },
    xl: {
      title: 'text-xl',
      subtitle: 'text-base',
      body: 'text-base',
      small: 'text-sm',
      metric: 'text-lg',
      kpi: 'text-base'
    }
  };

  const currentTextSize = textSizeMap[containerSize];

  // Animation for measures
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMeasure(prev => (prev + 1) % t.measures.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [t.measures.length]);

  // Data for CO2 savings
  const co2Data = [
    { household: '2.2', neighborhood: '13 000', color: '#059669' },
    { household: '1.3', neighborhood: '1 500', color: '#0ea5e9' },
    { household: '0.2 / jaar', neighborhood: '15 / jaar', color: '#8b5cf6' },
    { household: '3.7', neighborhood: '14 515', color: '#dc2626', isTotal: true }
  ];

  return (
    <div 
      className="w-full h-full bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50 overflow-hidden relative"
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100vh',
        maxWidth: width,
        maxHeight: height,
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-200/20"
            style={{
              width: Math.random() * 80 + 20,
              height: Math.random() * 80 + 20,
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

      <div className="relative z-10 w-full h-full flex flex-col lg:flex-row p-4 gap-4">
        {/* Left Panel - Measures */}
        <motion.div 
          className="w-full lg:w-80 bg-white/90 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-xl border border-white/60 flex flex-col"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6">
            <motion.h2 
              className={`font-bold text-blue-900 mb-2 ${currentTextSize.title}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {t.subtitle}
            </motion.h2>
            <motion.p 
              className={`text-blue-700/80 ${currentTextSize.subtitle}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {t.description}
            </motion.p>
          </div>

          <div className="space-y-3 flex-1">
            {t.measures.map((measure, index) => (
              <motion.div
                key={measure}
                className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                  index === activeMeasure 
                    ? 'bg-blue-50 border-blue-400 shadow-md' 
                    : 'bg-white/50 border-blue-200/50'
                } ${index === t.measures.length - 1 ? 'bg-emerald-50 border-emerald-300' : ''}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    className={`w-3 h-3 rounded-full ${
                      index === activeMeasure ? 'scale-125' : 'scale-100'
                    } transition-transform duration-300`}
                    style={{
                      backgroundColor: index === t.measures.length - 1 ? '#dc2626' : 
                                    index === 0 ? '#059669' : 
                                    index === 1 ? '#0ea5e9' : '#8b5cf6'
                    }}
                    animate={{
                      scale: index === activeMeasure ? [1, 1.2, 1] : 1,
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className={`font-semibold ${
                    index === t.measures.length - 1 ? 'text-red-700' : 'text-blue-900'
                  } ${currentTextSize.body}`}>
                    {measure}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { label: t.impact, value: '87%', color: 'bg-green-500' },
              { label: t.savings, value: '3.7t', color: 'bg-blue-500' },
              { label: t.environment, value: 'A+', color: 'bg-emerald-500' }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                className="bg-white/80 rounded-lg p-2 text-center border border-white/60"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${item.color}`} />
                <div className={`font-bold text-blue-900 ${currentTextSize.small}`}>{item.value}</div>
                <div className={`text-blue-700/70 ${currentTextSize.kpi}`}>{item.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Visualization */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* House Visualization */}
          <motion.div 
            className="flex-1 bg-gradient-to-br from-blue-100/80 to-cyan-100/80 rounded-2xl p-4 lg:p-6 shadow-xl border border-white/60 relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Sky Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-sky-100 to-blue-200" />
            
            {/* Animated Sun */}
            <motion.div
              className="absolute top-4 right-6 w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-yellow-400 border-4 border-yellow-300 shadow-lg"
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity }
              }}
            />
            
            {/* Ground */}
            <div className="absolute left-0 right-0 bottom-0 h-24 lg:h-32 bg-gradient-to-t from-emerald-600 to-emerald-500 rounded-t-[60px]" />

            {/* Animated Trees */}
            {[
              { left: '10%', bottom: '6rem', size: 'w-16 h-16 lg:w-20 lg:h-20' },
              { left: '15%', bottom: '5rem', size: 'w-12 h-12 lg:w-16 lg:h-16' },
              { right: '10%', bottom: '6rem', size: 'w-16 h-16 lg:w-20 lg:h-20' },
              { right: '15%', bottom: '5rem', size: 'w-12 h-12 lg:w-16 lg:h-16' },
            ].map((tree, index) => (
              <motion.div
                key={index}
                className={`absolute ${tree.size} rounded-full bg-emerald-600 shadow-lg`}
                style={{ [tree.left ? 'left' : 'right']: tree.left || tree.right, bottom: tree.bottom }}
                animate={{
                  y: [0, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.5,
                }}
              />
            ))}

            {/* Main House */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md lg:max-w-lg">
              {/* House Body */}
              <motion.div
                className="relative bg-white/95 rounded-2xl shadow-2xl border border-white/80 mx-auto"
                style={{ width: '90%', height: '200px' }}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                {/* Chimney with smoke */}
                <div className="absolute -top-8 left-1/4 w-6 h-10 bg-gray-800 rounded-t-lg">
                  <motion.div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white/30 rounded-full"
                    animate={{
                      y: [-10, -30, -50],
                      opacity: [1, 0.5, 0],
                      scale: [1, 1.5, 2],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                </div>

                {/* Solar Panels */}
                <motion.div
                  className="absolute -top-4 right-1/4 w-20 h-3 bg-gradient-to-r from-blue-600 to-blue-400 rounded shadow-lg"
                  animate={{
                    boxShadow: [
                      '0 0 0px rgba(59, 130, 246, 0.5)',
                      '0 0 20px rgba(59, 130, 246, 0.8)',
                      '0 0 0px rgba(59, 130, 246, 0.5)',
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                {/* Title Section */}
                <div className="pt-6 text-center">
                  <motion.p 
                    className={`font-bold text-blue-800 ${currentTextSize.title}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    {t.tonLabel}
                  </motion.p>
                  <div className="flex justify-center gap-8 lg:gap-16 mt-2">
                    <motion.p 
                      className="text-emerald-600 font-semibold flex items-center gap-1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <span className={currentTextSize.body}>{t.household}</span>
                    </motion.p>
                    <motion.p 
                      className="text-blue-600 font-semibold flex items-center gap-1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className={currentTextSize.body}>{t.neighbourhood}</span>
                    </motion.p>
                  </div>
                </div>

                {/* CO2 Data Rows */}
                <div className="mt-6 px-4 lg:px-8 space-y-3">
                  {co2Data.map((row, index) => (
                    <motion.div
                      key={index}
                      className="flex justify-between items-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      <motion.span 
                        className={`font-bold ${row.isTotal ? 'text-red-600' : 'text-emerald-600'} ${currentTextSize.metric}`}
                        whileHover={{ scale: 1.1 }}
                      >
                        {row.household}
                      </motion.span>
                      <motion.span 
                        className={`font-bold ${row.isTotal ? 'text-red-600' : 'text-blue-600'} ${currentTextSize.metric}`}
                        whileHover={{ scale: 1.1 }}
                      >
                        {row.neighborhood}
                      </motion.span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Bottom Info Bar */}
          <motion.div 
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 lg:p-4 shadow-xl border border-white/60 mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-2 text-center lg:text-left">
              <div className="flex items-center gap-2">
                <motion.div 
                  className="w-3 h-3 bg-green-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className={`text-green-700 font-semibold ${currentTextSize.small}`}>
                  {activeLang === 'nl' ? 'Actieve CO₂ Reductie' : 'Active CO₂ Reduction'}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-blue-600 ${currentTextSize.small}`}>
                  {t.measures[activeMeasure]}
                </span>
                <motion.div 
                  className="flex gap-1"
                  key={activeMeasure}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 h-1 rounded-full ${
                        i === activeMeasure % 3 ? 'bg-blue-500' : 'bg-blue-300'
                      }`}
                    />
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Co2HousePage;