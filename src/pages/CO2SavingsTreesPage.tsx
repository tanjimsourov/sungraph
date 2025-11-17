// src/pages/CO2SavingsTreesPage.tsx
import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';
import savingsData from '../data/co2Savings';

ChartJS.register(ArcElement, Tooltip, Legend);

// Conversion factor: kilograms of CO₂ saved per tree per year.
const TREE_CO2_KG = 22;

// Color palette
const colorMap = {
  ev: '#22c55e',
  pv: '#0ea5e9',
  insulate: '#f59e0b',
  diet: '#a855f7',
  heatpump: '#ef4444',
};

// Translation dictionaries
const baseTranslations = {
  nl: {
    analysisTitle: 'CO₂ Besparing',
    subtitle: 'Omgerekend naar bomen',
    oneTree: `1 boom ≈ ${TREE_CO2_KG} kg CO₂/jaar`,
    totalSaving: 'Totale jaarlijkse besparing',
    treeEquivalent: 'Bomen-equivalent',
    measureTitle: 'Jaarlijkse CO₂-besparingen per maatregel',
    measureSubtitle: 'Verdeling en bomen-equivalent per maatregel',
    totalTreesLabel: 'bomen totaal',
    conversionNote: 'Indicatieve conversie',
    liveInsight: 'Live inzicht',
    visual: 'Visualisatie bomen-equivalent',
    extraTrees: 'extra bomen niet getoond',
    measures: {
      ev: 'Elektrisch rijden',
      pv: 'Zonnepanelen',
      insulate: 'Isolatie',
      diet: 'Minder vlees/zuivel',
      heatpump: 'Warmtepomp',
    },
    impact: 'Impact',
    savings: 'Besparingen',
    environment: 'Milieu',
  },
  en: {
    analysisTitle: 'CO₂ Saving',
    subtitle: 'Converted to trees',
    oneTree: `1 tree ≈ ${TREE_CO2_KG} kg CO₂/year`,
    totalSaving: 'Total annual saving',
    treeEquivalent: 'Tree equivalent',
    measureTitle: 'Annual CO₂ savings per measure',
    measureSubtitle: 'Distribution and tree equivalent per measure',
    totalTreesLabel: 'trees total',
    conversionNote: 'Indicative conversion',
    liveInsight: 'Live insight',
    visual: 'Tree equivalent visualisation',
    extraTrees: 'extra trees not shown',
    measures: {
      ev: 'Electric driving',
      pv: 'Solar panels',
      insulate: 'Insulation',
      diet: 'Less meat/dairy',
      heatpump: 'Heat pump',
    },
    impact: 'Impact',
    savings: 'Savings',
    environment: 'Environment',
  },
};

type LangKey = keyof typeof baseTranslations;

export interface CO2SavingsTreesPageProps {
  width?: number;
  height?: number;
  lang?: LangKey;
  apiConfig?: {
    enabled: boolean;
    endpoint: string;
  };
}

// API data fetching function
async function fetchSavingsData(endpoint: string) {
  try {
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    if (Array.isArray(data)) {
      return data;
    }
    return savingsData;
  } catch (e) {
    return savingsData;
  }
}

const CO2SavingsTreesPage: React.FC<CO2SavingsTreesPageProps> = ({
  width,
  height,
  lang,
  apiConfig = {
    enabled: false,
    endpoint: "",
  },
}) => {
  const [savings, setSavings] = useState(savingsData);
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

  // Text size mapping - Smaller for better fit
  const textSizeMap = {
    sm: {
      title: 'text-sm',
      subtitle: 'text-xs',
      cardTitle: 'text-xs',
      body: 'text-xs',
      small: 'text-[10px]',
      metric: 'text-lg',
      kpi: 'text-[9px]',
      chartCenter: 'text-xs'
    },
    md: {
      title: 'text-base',
      subtitle: 'text-sm',
      cardTitle: 'text-sm',
      body: 'text-sm',
      small: 'text-xs',
      metric: 'text-xl',
      kpi: 'text-xs',
      chartCenter: 'text-sm'
    },
    lg: {
      title: 'text-lg',
      subtitle: 'text-base',
      cardTitle: 'text-base',
      body: 'text-base',
      small: 'text-sm',
      metric: 'text-2xl',
      kpi: 'text-sm',
      chartCenter: 'text-base'
    },
    xl: {
      title: 'text-xl',
      subtitle: 'text-lg',
      cardTitle: 'text-lg',
      body: 'text-lg',
      small: 'text-base',
      metric: 'text-3xl',
      kpi: 'text-base',
      chartCenter: 'text-lg'
    }
  };

  const currentTextSize = textSizeMap[containerSize];

  // API data fetching
  useEffect(() => {
    let cancelled = false;
    
    const loadData = async () => {
      if (apiConfig.enabled && apiConfig.endpoint) {
        const data = await fetchSavingsData(apiConfig.endpoint);
        if (!cancelled) {
          setSavings(data);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [apiConfig.enabled, apiConfig.endpoint]);

  // Animation for measures
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMeasure(prev => (prev + 1) % savings.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [savings.length]);

  // Compute total saved kilograms and tree equivalent
  const totalSavedKg = savings.reduce((sum, item) => sum + item.savedKg, 0);
  const totalTrees = Math.floor(totalSavedKg / TREE_CO2_KG);

  // Chart data for the donut
  const donutData = {
    labels: savings.map((i) => t.measures[i.key as keyof typeof t.measures]),
    datasets: [
      {
        data: savings.map((i) => i.savedKg),
        backgroundColor: savings.map((i) => colorMap[i.key as keyof typeof colorMap] || '#94a3b8'),
        borderWidth: 0,
        cutout: '60%', // Smaller cutout for more space
        borderRadius: 4,
        spacing: 0,
      },
    ],
  };

  // Chart options with smaller fonts
  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { 
        backgroundColor: 'rgba(15,23,42,0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        cornerRadius: 6,
        padding: 8,
        titleFont: {
          size: containerSize === 'sm' ? 10 : 12
        },
        bodyFont: {
          size: containerSize === 'sm' ? 9 : 11
        }
      },
    },
  };

  // Generate limited tree glyph array - Much smaller for better fit
  const maxTreesToShow = containerSize === 'sm' ? 16 : containerSize === 'md' ? 36 : 64;
  const treeCountToShow = Math.min(totalTrees, maxTreesToShow);
  const treesArray = Array.from({ length: treeCountToShow });

  // Format numbers based on locale
  function formatNumber(n: number) {
    return new Intl.NumberFormat(activeLang === 'nl' ? 'nl-NL' : 'en-US').format(n);
  }

  // Static Tree Component - No animations, smaller
  const Tree = () => (
    <div className="aspect-square rounded-md bg-emerald-50 border border-emerald-100 flex items-center justify-center">
      <svg 
        viewBox="0 0 24 24" 
        className={`${containerSize === 'sm' ? 'w-2 h-2' : 'w-3 h-3'}`}
        fill="none" 
        stroke="#059669" 
        strokeWidth="2"
      >
        <path d="M12 2c-3 0-5 2.5-5 5.5S9 13 12 13s5-2.5 5-5.5S15 2 12 2Z" fill="#34d399" stroke="none" />
        <path d="M12 13v7" />
        <path d="M8 16h8" />
      </svg>
    </div>
  );

  return (
    <div 
      className="w-full h-full bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 overflow-hidden"
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100vh',
        maxWidth: width,
        maxHeight: height,
      }}
    >
      <div className="relative z-10 w-full h-full flex flex-col lg:flex-row p-2 gap-2">
        {/* Left Panel - Compact */}
        <motion.div 
          className="w-full lg:w-80 xl:w-96 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-xl p-4 flex flex-col shadow-lg flex-shrink-0"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-2">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p className={`tracking-widest uppercase opacity-90 font-medium mb-1 ${currentTextSize.small}`}>
              {t.analysisTitle}
            </p>
            <h1 className={`leading-tight font-bold mb-1 ${currentTextSize.title}`}>
              {t.subtitle}
            </h1>
            <p className={`opacity-95 ${currentTextSize.small}`}>
              {t.oneTree}
            </p>
          </div>

          {/* KPI Card - Compact */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 mb-4 flex-1">
            <p className={`opacity-90 mb-1 ${currentTextSize.small}`}>{t.totalSaving}</p>
            <p className={`font-bold text-emerald-200 leading-none mb-2 ${currentTextSize.metric}`}>
              {formatNumber(totalSavedKg)} kg
            </p>
            <p className={`opacity-90 mb-1 ${currentTextSize.small}`}>{t.treeEquivalent}</p>
            <p className={`font-bold text-white leading-none ${currentTextSize.metric}`}>
              {formatNumber(totalTrees)}
            </p>
          </div>

          {/* Info Cards - Compact */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: t.impact, value: '87%', color: 'bg-green-400' },
              { label: t.savings, value: '3.7t', color: 'bg-blue-400' },
              { label: t.environment, value: 'A+', color: 'bg-emerald-400' }
            ].map((item, index) => (
              <div
                key={item.label}
                className="bg-white/20 rounded-lg p-1 text-center border border-white/30"
              >
                <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${item.color}`} />
                <div className={`font-bold text-white ${currentTextSize.kpi}`}>{item.value}</div>
                <div className={`text-white/80 ${currentTextSize.kpi}`}>{item.label}</div>
              </div>
            ))}
          </div>

          {/* Conversion note */}
          <div className="flex items-center justify-between opacity-80 mt-auto pt-2 border-t border-white/20">
            <span className={currentTextSize.small}>{t.conversionNote}</span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span className={currentTextSize.small}>{t.liveInsight}</span>
            </div>
          </div>
        </motion.div>

        {/* Right Panel - Compact */}
        <motion.div 
          className="flex-1 bg-white rounded-xl flex flex-col shadow-lg overflow-hidden min-h-0"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header - Compact */}
          <div className="p-4 border-b border-slate-100 flex-shrink-0">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h2 className={`font-bold text-slate-900 mb-1 ${currentTextSize.title}`}>
                  {t.measureTitle}
                </h2>
                <p className={`text-slate-600 ${currentTextSize.subtitle}`}>
                  {t.measureSubtitle}
                </p>
              </div>
              <div className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg font-semibold border border-emerald-200 flex-shrink-0">
                <span className={currentTextSize.small}>
                  {formatNumber(totalTrees)} {t.totalTreesLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Content Area - Compact */}
          <div className="flex-1 p-4 min-h-0 flex flex-col lg:flex-row gap-4">
            {/* Donut and Legend - Compact */}
            <div className="lg:w-2/5 flex flex-col min-h-0">
              <div className="relative w-full aspect-square max-w-64 mx-auto mb-4 flex-shrink-0">
                <Doughnut data={donutData} options={donutOptions} />
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-2">
                  <p className={`text-slate-500 mb-0.5 ${currentTextSize.small}`}>{t.totalSaving}</p>
                  <p className={`font-semibold text-slate-800 text-center leading-tight ${currentTextSize.chartCenter}`}>
                    {formatNumber(totalSavedKg)} kg
                  </p>
                </div>
              </div>

              {/* Legend - Compact */}
              <div className="space-y-2 flex-1 min-h-0">
                {savings.map((item, index) => {
                  const trees = Math.floor(item.savedKg / TREE_CO2_KG);
                  const percentage = (item.savedKg / totalSavedKg) * 100;
                  
                  return (
                    <div
                      key={item.key}
                      className={`p-2 rounded-lg border transition-colors ${
                        index === activeMeasure 
                          ? 'bg-blue-50 border-blue-300' 
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span 
                          className="mt-0.5 w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: colorMap[item.key as keyof typeof colorMap] || '#94a3b8' }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold text-slate-800 mb-0.5 ${currentTextSize.body}`}>
                            {t.measures[item.key as keyof typeof t.measures]}
                          </p>
                          <p className={`text-slate-600 mb-1 ${currentTextSize.small}`}>
                            {formatNumber(item.savedKg)} kg → {formatNumber(trees)} {activeLang === 'nl' ? 'bomen' : 'trees'}
                          </p>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: colorMap[item.key as keyof typeof colorMap] || '#94a3b8',
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tree Grid - Compact */}
            <div className="lg:w-3/5 flex flex-col min-h-0">
              <div className="mb-2 flex-shrink-0">
                <p className={`text-slate-600 mb-1 ${currentTextSize.body}`}>
                  {t.visual}
                </p>
                <p className={`text-slate-500 ${currentTextSize.small}`}>
                  {treeCountToShow} {activeLang === 'nl' ? 'bomen getoond' : 'trees shown'} • {formatNumber(totalTrees)} {activeLang === 'nl' ? 'totaal' : 'total'}
                </p>
              </div>
              
              {/* Tree grid - Very compact */}
              <div className={`grid grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-1 flex-1 min-h-0 content-start`}>
                {treesArray.map((_, idx) => (
                  <Tree key={idx} />
                ))}
              </div>
              
              {/* Extra trees notice */}
              {totalTrees > treeCountToShow && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 mt-2 flex-shrink-0">
                  <p className={`text-amber-800 text-center ${currentTextSize.small}`}>
                    + {formatNumber(totalTrees - treeCountToShow)} {t.extraTrees}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CO2SavingsTreesPage;