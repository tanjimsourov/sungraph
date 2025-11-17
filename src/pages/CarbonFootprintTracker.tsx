// src/pages/CarbonFootprintTracker.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Translation dictionaries
const baseTranslations = {
  nl: {
    title: 'Carbon Footprint Tracker',
    subtitle: 'Monitor en verminder je milieu-impact',
    totalFootprint: 'Totale Carbon Footprint',
    unit: 'kg CO₂/maand',
    breakdown: 'Uitsplitsing per Categorie',
    carbonSavings: 'Carbon Besparingen',
    savedThisMonth: 'Deze maand bespaard',
    goalProgress: 'Doelvoortgang',
    reduceFootprint: 'Verminder Je Footprint',
    positiveImpact: 'Positieve Impact',
    treesEquivalent: 'Bomen Equivalent',
    carMilesOffset: 'Auto Kilometers Gecompenseerd',
    energySaved: 'Energie Bespaard',
    apply: 'Toepassen',
    transportation: 'Transport',
    energy: 'Energie',
    food: 'Voeding',
    shopping: 'Winkelen'
  },
  en: {
    title: 'Carbon Footprint Tracker',
    subtitle: 'Monitor and reduce your environmental impact',
    totalFootprint: 'Total Carbon Footprint',
    unit: 'kg CO₂/month',
    breakdown: 'Breakdown by Category',
    carbonSavings: 'Carbon Savings',
    savedThisMonth: 'Saved this month',
    goalProgress: 'Goal Progress',
    reduceFootprint: 'Reduce Your Footprint',
    positiveImpact: 'Positive Impact',
    treesEquivalent: 'Trees Equivalent',
    carMilesOffset: 'Car Miles Offset',
    energySaved: 'Energy Saved',
    apply: 'Apply',
    transportation: 'Transportation',
    energy: 'Energy',
    food: 'Food',
    shopping: 'Shopping'
  }
};

const actionTranslations = {
  nl: [
    { icon: '🚗', action: 'Gebruik openbaar vervoer', impact: '-5kg' },
    { icon: '💡', action: 'Schakel over op LED-lampen', impact: '-3kg' },
    { icon: '🥦', action: 'Plantaardige maaltijden', impact: '-8kg' },
    { icon: '🛒', action: 'Koop lokale producten', impact: '-4kg' }
  ],
  en: [
    { icon: '🚗', action: 'Use public transport', impact: '-5kg' },
    { icon: '💡', action: 'Switch to LED bulbs', impact: '-3kg' },
    { icon: '🥦', action: 'Plant-based meals', impact: '-8kg' },
    { icon: '🛒', action: 'Buy local products', impact: '-4kg' }
  ]
};

type LangKey = keyof typeof baseTranslations;

export interface CarbonFootprintTrackerProps {
  width?: number;
  height?: number;
  lang?: LangKey;
  apiConfig?: {
    enabled: boolean;
    endpoint: string;
  };
}

// CSS styles as a constant
const blobStyles = `
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob-0 { animation: blob 7s infinite; }
.animate-blob-1 { animation: blob 7s infinite 2s; }
.animate-blob-2 { animation: blob 7s infinite 4s; }
`;

const CarbonFootprintTracker: React.FC<CarbonFootprintTrackerProps> = ({
  width,
  height,
  lang,
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
  const actions = actionTranslations[activeLang];

  const [footprint, setFootprint] = useState({
    transportation: 45,
    energy: 30,
    food: 15,
    shopping: 10
  });
  const [savings, setSavings] = useState(0);
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

  // Text size mapping based on container size - Optimized for no scroll
  const textSizeMap = {
    sm: {
      title: 'text-lg',
      subtitle: 'text-xs',
      sectionTitle: 'text-sm',
      metric: 'text-xl',
      body: 'text-xs',
      small: 'text-xs',
      kpi: 'text-xs',
      button: 'text-xs'
    },
    md: {
      title: 'text-xl',
      subtitle: 'text-sm',
      sectionTitle: 'text-base',
      metric: 'text-2xl',
      body: 'text-sm',
      small: 'text-xs',
      kpi: 'text-sm',
      button: 'text-xs'
    },
    lg: {
      title: 'text-2xl',
      subtitle: 'text-base',
      sectionTitle: 'text-lg',
      metric: 'text-3xl',
      body: 'text-base',
      small: 'text-sm',
      kpi: 'text-base',
      button: 'text-sm'
    },
    xl: {
      title: 'text-3xl',
      subtitle: 'text-lg',
      sectionTitle: 'text-xl',
      metric: 'text-4xl',
      body: 'text-lg',
      small: 'text-base',
      kpi: 'text-lg',
      button: 'text-base'
    }
  };

  const currentTextSize = textSizeMap[containerSize];

  // API data fetching function
  const loadFootprintData = async () => {
    if (apiConfig.enabled && apiConfig.endpoint) {
      try {
        const res = await fetch(apiConfig.endpoint);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        if (data.footprint && data.savings !== undefined) {
          setFootprint(data.footprint);
          setSavings(data.savings);
        }
      } catch (err) {
        console.error('Failed to fetch footprint data:', err);
      }
    }
  };

  useEffect(() => {
    // Add styles to document head
    const styleSheet = document.createElement('style');
    styleSheet.innerText = blobStyles;
    document.head.appendChild(styleSheet);

    let interval: NodeJS.Timeout;
    let cancelled = false;

    const loadData = async () => {
      if (apiConfig.enabled) {
        await loadFootprintData();
      }
      
      if (!cancelled) {
        interval = setInterval(() => {
          setFootprint(prev => ({
            transportation: Math.max(0, prev.transportation + (Math.random() - 0.5) * 2),
            energy: Math.max(0, prev.energy + (Math.random() - 0.5) * 1.5),
            food: Math.max(0, prev.food + (Math.random() - 0.5) * 1),
            shopping: Math.max(0, prev.shopping + (Math.random() - 0.5) * 0.8)
          }));
          setSavings(prev => prev + Math.random() * 0.1);
        }, 3000);
      }
    };

    loadData();

    return () => {
      cancelled = true;
      clearInterval(interval);
      // Clean up styles
      const style = document.querySelector('style');
      if (style && style.innerText.includes('blob')) {
        document.head.removeChild(style);
      }
    };
  }, [apiConfig.enabled, apiConfig.endpoint]);

  const totalFootprint = Object.values(footprint).reduce((a, b) => a + b, 0);

  // Animated Progress Circle - Optimized sizes
  const AnimatedProgressCircle = ({ value }: { value: number }) => {
    const circumference = 45 * 2 * Math.PI;
    const strokeDasharray = `${(value / 100) * circumference} ${circumference}`;

    const circleSize = containerSize === 'sm' ? 'w-32 h-32' : 
                      containerSize === 'md' ? 'w-40 h-40' : 
                      containerSize === 'lg' ? 'w-48 h-48' : 
                      'w-56 h-56';

    return (
      <motion.div 
        className={`relative ${circleSize}`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <motion.circle 
            cx="50" 
            cy="50" 
            r="45" 
            stroke="#e5e7eb" 
            strokeWidth="8" 
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke="url(#footprintGradient)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            transform="rotate(-90 50 50)"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (value / 100) * circumference }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="footprintGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            className={`font-bold text-gray-800 ${currentTextSize.metric}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {totalFootprint.toFixed(0)}
          </motion.span>
          <motion.span 
            className="text-gray-500 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            kg CO₂
          </motion.span>
        </div>
      </motion.div>
    );
  };

  // Animated Progress Bar - Optimized width
  const AnimatedProgressBar = ({ value, delay = 0 }: { value: number; delay?: number }) => (
    <motion.div 
      className={`${containerSize === 'sm' ? 'w-16' : 'w-24'} bg-gray-200 rounded-full h-2 flex-shrink-0`}
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ delay, duration: 0.8 }}
    >
      <motion.div 
        className="bg-emerald-500 h-2 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ delay: delay + 0.3, duration: 1, ease: "easeOut" }}
      />
    </motion.div>
  );

  // Animated Action Card - Compact layout
  const AnimatedActionCard = ({ item, index }: { item: any; index: number }) => (
    <motion.div 
      key={index}
      className="flex items-center gap-2 p-2 rounded-xl hover:bg-emerald-50 transition-colors cursor-pointer group border border-transparent hover:border-emerald-200 min-w-0"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8 + index * 0.1 }}
      whileHover={{ 
        scale: 1.02,
        transition: { type: "spring", stiffness: 400 }
      }}
    >
      <motion.span 
        className="text-lg flex-shrink-0"
        whileHover={{ scale: 1.2 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        {item.icon}
      </motion.span>
      <div className="flex-1 min-w-0">
        <motion.p 
          className={`font-medium text-gray-700 truncate ${currentTextSize.small}`}
          whileHover={{ color: '#059669' }}
        >
          {item.action}
        </motion.p>
        <motion.p 
          className={`text-emerald-600 ${currentTextSize.small}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 + index * 0.1 }}
        >
          {item.impact}
        </motion.p>
      </div>
      <motion.button 
        className={`px-2 py-1 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors flex-shrink-0 ${currentTextSize.button}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {t.apply}
      </motion.button>
    </motion.div>
  );

  return (
    <div 
      className="w-full h-full bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-3 overflow-hidden"
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100vh',
        maxWidth: width,
        maxHeight: height,
      }}
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob-0"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 7, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-1/3 right-1/4 w-32 h-32 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob-1"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 7, repeat: Infinity, delay: 2 }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-1/2 w-32 h-32 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob-2"
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.35, 0.2]
          }}
          transition={{ duration: 7, repeat: Infinity, delay: 4 }}
        />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Header - Compact */}
        <motion.header 
          className="text-center mb-2 flex-shrink-0"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className={`font-bold text-gray-800 mb-1 ${currentTextSize.title}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {t.title}
          </motion.h1>
          <motion.p 
            className={`text-gray-600 ${currentTextSize.subtitle}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {t.subtitle}
          </motion.p>
        </motion.header>

        {/* Main Dashboard - Optimized grid with proper heights */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-3 min-h-0 overflow-hidden">
          {/* Left Column - Overview */}
          <div className="xl:col-span-2 flex flex-col gap-3 min-h-0">
            {/* Total Footprint - Fixed height */}
            <motion.div 
              className="bg-white rounded-2xl p-4 shadow-xl border border-emerald-100 flex-shrink-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-3">
                <motion.h2 
                  className={`font-bold text-gray-800 ${currentTextSize.sectionTitle}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {t.totalFootprint}
                </motion.h2>
                <motion.span 
                  className={`text-gray-500 ${currentTextSize.small}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {t.unit}
                </motion.span>
              </div>
              <div className="text-center">
                <AnimatedProgressCircle value={totalFootprint} />
              </div>
            </motion.div>

            {/* Category Breakdown - Flexible height */}
            <motion.div 
              className="bg-white rounded-2xl p-4 shadow-xl border border-emerald-100 flex-1 min-h-0 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.h3 
                className={`font-semibold text-gray-800 mb-3 ${currentTextSize.sectionTitle}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {t.breakdown}
              </motion.h3>
              <div className="space-y-2 h-[calc(100%-2rem)] overflow-y-auto">
                {Object.entries(footprint).map(([category, value], index) => (
                  <motion.div 
                    key={category} 
                    className="flex items-center justify-between gap-2 min-w-0"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <motion.span 
                      className={`capitalize text-gray-600 flex-shrink-0 ${currentTextSize.body} w-16`}
                      whileHover={{ color: '#059669' }}
                    >
                      {t[category as keyof typeof t]}
                    </motion.span>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <AnimatedProgressBar value={value} delay={0.9 + index * 0.1} />
                      <motion.span 
                        className={`font-semibold text-gray-700 flex-shrink-0 ${currentTextSize.small} w-8 text-right`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 + index * 0.1 }}
                      >
                        {value.toFixed(1)}%
                      </motion.span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Details & Actions - Fixed height container */}
          <div className="flex flex-col gap-3 min-h-0">
            {/* Carbon Savings */}
            <motion.div 
              className="bg-white rounded-2xl p-4 shadow-xl border border-emerald-100 flex-shrink-0"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <motion.h3 
                className={`font-semibold text-gray-800 mb-2 ${currentTextSize.sectionTitle}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {t.carbonSavings}
              </motion.h3>
              <div className="text-center">
                <motion.div 
                  className={`font-bold text-emerald-600 mb-1 ${currentTextSize.metric}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.9 }}
                >
                  {savings.toFixed(1)} kg
                </motion.div>
                <motion.p 
                  className={`text-gray-600 ${currentTextSize.small}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  {t.savedThisMonth}
                </motion.p>
              </div>
              <motion.div 
                className="mt-2 bg-emerald-50 rounded-xl p-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <div className="flex items-center justify-between text-sm">
                  <motion.span 
                    className="text-emerald-700"
                    whileHover={{ scale: 1.05 }}
                  >
                    {t.goalProgress}
                  </motion.span>
                  <motion.span 
                    className="text-emerald-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    20%
                  </motion.span>
                </div>
                <div className="w-full bg-emerald-200 rounded-full h-2 mt-1">
                  <motion.div 
                    className="bg-emerald-500 h-2 rounded-full w-1/5"
                    initial={{ width: 0 }}
                    animate={{ width: '20%' }}
                    transition={{ delay: 1.3, duration: 1, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Quick Actions - Flexible height */}
            <motion.div 
              className="bg-white rounded-2xl p-4 shadow-xl border border-emerald-100 flex-1 min-h-0 overflow-hidden"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.h3 
                className={`font-semibold text-gray-800 mb-2 ${currentTextSize.sectionTitle}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                {t.reduceFootprint}
              </motion.h3>
              <div className="space-y-1 h-[calc(100%-2rem)] overflow-y-auto">
                <AnimatePresence>
                  {actions.map((item, index) => (
                    <AnimatedActionCard key={index} item={item} index={index} />
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Environmental Impact */}
            <motion.div 
              className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-4 text-white flex-shrink-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <motion.h3 
                className={`font-semibold mb-2 ${currentTextSize.sectionTitle}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                {t.positiveImpact}
              </motion.h3>
              <div className="space-y-1">
                {[
                  { key: 'trees', label: t.treesEquivalent, value: (savings / 21).toFixed(1) + ' trees' },
                  { key: 'miles', label: t.carMilesOffset, value: (savings / 0.4).toFixed(0) + ' miles' },
                  { key: 'energy', label: t.energySaved, value: (savings * 2.5).toFixed(0) + ' kWh' }
                ].map((item, index) => (
                  <motion.div 
                    key={item.key}
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                  >
                    <span className={currentTextSize.small}>{item.label}</span>
                    <motion.span 
                      className={`font-bold ${currentTextSize.small}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 1.3 + index * 0.1 }}
                    >
                      {item.value}
                    </motion.span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarbonFootprintTracker;