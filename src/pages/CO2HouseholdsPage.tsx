// src/pages/CO2HouseholdsPage.tsx
import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import co2SourcesData from '../data/co2Sources';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Type definitions
interface CO2Source {
  key: string;
  co2: number;
  color: string;
}

interface TranslationCategories {
  heating: string;
  electricity: string;
  transport: string;
  food: string;
  waste: string;
  other: string;
}

interface LeftUITranslations {
  analysis: string;
  title: string;
  description: string;
  totalLabel: string;
  totalValue: string;
  totalUnit: string;
  average: string;
  yourSaving: string;
  distributionTitle: string;
  distributionDesc: string;
  source: string;
  live: string;
}

interface RightUITranslations {
  headerTitle: string;
  headerSubtitle: string;
  chartTitle: string;
  chartSubTitle: string;
  highest: string;
  savingPotential: string;
  impact: string;
  transport: string;
  food: string;
  heating: string;
  electricDriving: string;
  solarPanels: string;
  insulation: string;
  co2PerPerson: string;
  euTarget: string;
  climateNeutral: string;
}

interface ChartTranslations {
  datasetLabel: string;
  tooltipLabel: string;
}

interface UITranslations {
  left: LeftUITranslations;
  right: RightUITranslations;
}

interface Translation {
  categories: TranslationCategories;
  ui: UITranslations;
  chart: ChartTranslations;
}

// Translation dictionaries
const baseTranslations: Record<string, Translation> = {
  nl: {
    categories: {
      heating: 'Verwarming',
      electricity: 'Elektriciteit',
      transport: 'Vervoer',
      food: 'Voeding',
      waste: 'Afval',
      other: 'Overig',
    },
    ui: {
      left: {
        analysis: 'CO₂ Analyse',
        title: 'Huishoudelijke CO₂ Uitstoot',
        description: 'Inzicht in uw ecologische voetafdruk per categorie.',
        totalLabel: 'Totale jaarlijkse uitstoot',
        totalValue: '6,500 kg',
        totalUnit: 'CO₂ equivalent',
        average: 'Gemiddeld NL huishouden',
        yourSaving: 'Uw besparing',
        distributionTitle: 'Verdeling per categorie',
        distributionDesc: 'Vervoer is de grootste bron, daarna voeding en verwarming.',
        source: 'Bron: Voorbeelddata',
        live: 'Live inzicht',
      },
      right: {
        headerTitle: 'Gedetailleerde Analyse',
        headerSubtitle: 'Uitstoot per categorie en vergelijkingen',
        chartTitle: 'Uitstoot per categorie',
        chartSubTitle: 'Jaarlijkse CO₂ uitstoot in kilogram',
        highest: 'Hoogste uitstoot',
        savingPotential: 'Besparingspotentieel',
        impact: 'Milieu-impact',
        transport: 'Vervoer',
        food: 'Voeding',
        heating: 'Verwarming',
        electricDriving: 'Elektrisch rijden',
        solarPanels: 'Zonnepanelen',
        insulation: 'Isolatie',
        co2PerPerson: 'CO₂ per persoon',
        euTarget: 'EU doel 2030',
        climateNeutral: 'Klimaatneutraal',
      },
    },
    chart: {
      datasetLabel: 'CO₂ Uitstoot (kg)',
      tooltipLabel: 'kg CO₂ per jaar',
    },
  },
  en: {
    categories: {
      heating: 'Heating',
      electricity: 'Electricity',
      transport: 'Transport',
      food: 'Food',
      waste: 'Waste',
      other: 'Other',
    },
    ui: {
      left: {
        analysis: 'CO₂ Analysis',
        title: 'Household CO₂ Emissions',
        description: 'Insight into your ecological footprint per category.',
        totalLabel: 'Total annual emissions',
        totalValue: '6,500 kg',
        totalUnit: 'CO₂ equivalent',
        average: 'Average NL household',
        yourSaving: 'Your saving',
        distributionTitle: 'Distribution by category',
        distributionDesc: 'Transport is the largest source, followed by food and heating.',
        source: 'Source: Sample data',
        live: 'Live insight',
      },
      right: {
        headerTitle: 'Detailed analysis',
        headerSubtitle: 'Emissions per category and comparisons',
        chartTitle: 'Emissions by category',
        chartSubTitle: 'Annual CO₂ emissions in kilograms',
        highest: 'Highest emissions',
        savingPotential: 'Saving potential',
        impact: 'Environmental impact',
        transport: 'Transport',
        food: 'Food',
        heating: 'Heating',
        electricDriving: 'Electric driving',
        solarPanels: 'Solar panels',
        insulation: 'Insulation',
        co2PerPerson: 'CO₂ per person',
        euTarget: 'EU target 2030',
        climateNeutral: 'Climate neutral',
      },
    },
    chart: {
      datasetLabel: 'CO₂ Emissions (kg)',
      tooltipLabel: 'kg CO₂ per year',
    },
  },
};

type LangKey = keyof typeof baseTranslations;

export interface CO2HouseholdsPageProps {
  width?: number;
  height?: number;
  lang?: LangKey;
  apiConfig?: {
    enabled: boolean;
    endpoint: string;
  };
}

// API data fetching function
async function fetchCO2Data(endpoint: string): Promise<CO2Source[]> {
  try {
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    if (Array.isArray(data)) {
      return data;
    }
    return co2SourcesData;
  } catch (e) {
    return co2SourcesData;
  }
}

const CO2HouseholdsPage: React.FC<CO2HouseholdsPageProps> = ({
  width,
  height,
  lang,
  apiConfig = {
    enabled: false,
    endpoint: "",
  },
}) => {
  const [co2Sources, setCo2Sources] = useState<CO2Source[]>(co2SourcesData);
  const [containerSize, setContainerSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');

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

  // Text size mapping based on container size
  const textSizeMap = {
    sm: {
      title: 'text-lg',
      subtitle: 'text-xs',
      cardTitle: 'text-sm',
      body: 'text-xs',
      small: 'text-[10px]',
      metric: 'text-xl',
      kpi: 'text-xs'
    },
    md: {
      title: 'text-xl',
      subtitle: 'text-sm',
      cardTitle: 'text-base',
      body: 'text-sm',
      small: 'text-xs',
      metric: 'text-2xl',
      kpi: 'text-sm'
    },
    lg: {
      title: 'text-2xl',
      subtitle: 'text-base',
      cardTitle: 'text-lg',
      body: 'text-base',
      small: 'text-sm',
      metric: 'text-3xl',
      kpi: 'text-base'
    },
    xl: {
      title: 'text-3xl',
      subtitle: 'text-lg',
      cardTitle: 'text-xl',
      body: 'text-lg',
      small: 'text-base',
      metric: 'text-4xl',
      kpi: 'text-lg'
    }
  };

  const currentTextSize = textSizeMap[containerSize];

  // API data fetching
  useEffect(() => {
    let cancelled = false;
    
    const loadData = async () => {
      if (apiConfig.enabled && apiConfig.endpoint) {
        const data = await fetchCO2Data(apiConfig.endpoint);
        if (!cancelled) {
          setCo2Sources(data);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [apiConfig.enabled, apiConfig.endpoint]);

  // Compose bar chart data using translated category labels
  const barData = {
    labels: co2Sources.map((s) => t.categories[s.key as keyof TranslationCategories]),
    datasets: [
      {
        label: t.chart.datasetLabel,
        data: co2Sources.map((s) => s.co2),
        backgroundColor: co2Sources.map((s) => s.color),
        borderRadius: 8,
        borderSkipped: false,
        barPercentage: 0.7,
        categoryPercentage: 0.8,
      },
    ],
  };

  // Chart options with translated tooltip and axis labels
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15,23,42,0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: (context: any) => {
            return `${context.parsed.y} ${t.chart.tooltipLabel}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: {
          color: '#475569',
          font: { 
            size: containerSize === 'sm' ? 10 : containerSize === 'md' ? 11 : 12, 
            weight: '500' 
          },
        },
      },
      y: {
        beginAtZero: true,
        max: 2500,
        ticks: {
          stepSize: 500,
          color: '#475569',
          font: { 
            size: containerSize === 'sm' ? 10 : containerSize === 'md' ? 11 : 12 
          },
          callback: (val: any) => `${val} kg`,
        },
        grid: { color: 'rgba(100,116,139,0.1)', drawBorder: false },
      },
    },
  };

  return (
    <div 
      className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden"
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100vh',
        maxWidth: width,
        maxHeight: height,
      }}
    >
      <div className="w-full h-full flex flex-col lg:flex-row p-2 lg:p-4 gap-2 lg:gap-4">
        {/* Left panel - Full height */}
        <motion.div 
          className="w-full lg:w-[400px] xl:w-[450px] bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 text-white rounded-2xl p-4 lg:p-6 flex flex-col shadow-2xl flex-shrink-0"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 lg:mb-6">
            <motion.div
              className="w-8 h-8 lg:w-10 lg:h-10 bg-white/20 rounded-xl flex items-center justify-center mb-2 lg:mb-3"
              whileHover={{ scale: 1.05 }}
            >
              <svg className="w-4 h-4 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </motion.div>
            <motion.p 
              className={`tracking-widest uppercase opacity-90 font-medium mb-1 ${currentTextSize.small}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {t.ui.left.analysis}
            </motion.p>
            <motion.h1 
              className={`leading-tight font-bold mb-2 lg:mb-3 ${currentTextSize.title}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {t.ui.left.title}
            </motion.h1>
            <motion.p 
              className={`leading-relaxed opacity-95 ${currentTextSize.body}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {t.ui.left.description}
            </motion.p>
          </div>

          <motion.div 
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 lg:p-4 mb-3 lg:mb-4 border border-white/15 flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className={`opacity-80 mb-2 ${currentTextSize.small}`}>{t.ui.left.totalLabel}</p>
            <motion.p 
              className={`font-bold text-emerald-200 leading-none mb-2 ${currentTextSize.metric}`}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {t.ui.left.totalValue}
            </motion.p>
            <p className={`opacity-70 mb-3 ${currentTextSize.small}`}>{t.ui.left.totalUnit}</p>
            <div className="flex justify-between gap-3 mt-4">
              <div>
                <p className={`opacity-70 ${currentTextSize.small}`}>{t.ui.left.average}</p>
                <p className={`font-semibold ${currentTextSize.small}`}>6.500 kg</p>
              </div>
              <div className="text-right">
                <p className={`opacity-70 ${currentTextSize.small}`}>{t.ui.left.yourSaving}</p>
                <p className={`font-semibold text-emerald-200 ${currentTextSize.small}`}>0.0%</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-white/10 rounded-2xl p-3 lg:p-4 border border-white/10 mb-3 lg:mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className={`font-semibold mb-1 ${currentTextSize.small}`}>{t.ui.left.distributionTitle}</p>
            <p className={`opacity-70 ${currentTextSize.small}`}>{t.ui.left.distributionDesc}</p>
          </motion.div>

          <motion.div 
            className="flex items-center justify-between opacity-80 mt-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <span className={currentTextSize.small}>{t.ui.left.source}</span>
            <div className="flex items-center gap-2">
              <motion.div 
                className="w-2 h-2 bg-emerald-300 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className={currentTextSize.small}>{t.ui.left.live}</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right panel - Full height */}
        <motion.div 
          className="flex-1 bg-white rounded-2xl flex flex-col shadow-2xl overflow-hidden min-h-0"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="p-4 lg:p-6 border-b border-slate-100 flex-shrink-0">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 lg:gap-4">
              <div className="flex-1">
                <motion.h2 
                  className={`font-bold text-slate-900 mb-1 ${currentTextSize.title}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {t.ui.right.headerTitle}
                </motion.h2>
                <motion.p 
                  className={`text-slate-600 ${currentTextSize.subtitle}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {t.ui.right.headerSubtitle}
                </motion.p>
              </div>
              <div className="flex items-center gap-2 lg:gap-3">
                <motion.div 
                  className="bg-purple-50 text-purple-700 px-3 py-2 rounded-xl font-semibold border border-purple-200"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <span className={currentTextSize.small}>CO₂ Footprint</span>
                </motion.div>
                <motion.button 
                  className="w-8 h-8 lg:w-10 lg:h-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-4 h-4 lg:w-5 lg:h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Chart area */}
          <div className="flex-1 p-4 lg:p-6 min-h-0 flex flex-col">
            <div className="mb-3 lg:mb-4 flex-shrink-0">
              <motion.h3 
                className={`font-bold text-slate-900 mb-1 ${currentTextSize.cardTitle}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {t.ui.right.chartTitle}
              </motion.h3>
              <motion.p 
                className={`text-slate-600 ${currentTextSize.small}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {t.ui.right.chartSubTitle}
              </motion.p>
            </div>
            <div className="flex-1 min-h-0">
              <motion.div 
                className="h-full max-h-[180px] lg:max-h-[220px] xl:max-h-[250px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Bar data={barData} options={barOptions} />
              </motion.div>
            </div>
          </div>

          {/* Bottom cards */}
          <div className="p-4 lg:p-6 flex-shrink-0">
            <div className={`grid grid-cols-1 ${containerSize === 'sm' ? 'gap-3' : 'lg:grid-cols-3 gap-3 lg:gap-4'}`}>
              {/* Highest emissions */}
              <motion.div 
                className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-3 lg:p-4 border border-slate-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
                  <motion.div 
                    className="w-3 h-3 bg-red-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <p className={`font-bold text-slate-900 ${currentTextSize.cardTitle}`}>{t.ui.right.highest}</p>
                </div>
                <div className={`space-y-2 ${currentTextSize.kpi}`}>
                  {[
                    { label: t.ui.right.transport, value: '2.200 kg' },
                    { label: t.ui.right.food, value: '1.500 kg' },
                    { label: t.ui.right.heating, value: '1.250 kg' },
                  ].map((item, index) => (
                    <motion.div 
                      key={item.label}
                      className="flex justify-between items-center"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      <span>{item.label}</span>
                      <span className="font-bold text-slate-900">{item.value}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Saving potential */}
              <motion.div 
                className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-3 lg:p-4 border border-slate-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
                  <motion.div 
                    className="w-3 h-3 bg-emerald-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  />
                  <p className={`font-bold text-slate-900 ${currentTextSize.cardTitle}`}>{t.ui.right.savingPotential}</p>
                </div>
                <div className={`space-y-2 ${currentTextSize.kpi}`}>
                  {[
                    { label: t.ui.right.electricDriving, value: '-60%' },
                    { label: t.ui.right.solarPanels, value: '-40%' },
                    { label: t.ui.right.insulation, value: '-30%' },
                  ].map((item, index) => (
                    <motion.div 
                      key={item.label}
                      className="flex justify-between items-center"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                    >
                      <span>{item.label}</span>
                      <span className="font-bold text-slate-900">{item.value}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Environmental impact */}
              <motion.div 
                className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-3 lg:p-4 border border-slate-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-2 lg:gap-3 mb-2 lg:mb-3">
                  <motion.div 
                    className="w-3 h-3 bg-blue-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                  />
                  <p className={`font-bold text-slate-900 ${currentTextSize.cardTitle}`}>{t.ui.right.impact}</p>
                </div>
                <div className={`space-y-2 ${currentTextSize.kpi}`}>
                  {[
                    { label: t.ui.right.co2PerPerson, value: '1.600 kg' },
                    { label: t.ui.right.euTarget, value: '2.500 kg' },
                    { label: t.ui.right.climateNeutral, value: '0 kg' },
                  ].map((item, index) => (
                    <motion.div 
                      key={item.label}
                      className="flex justify-between items-center"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.0 + index * 0.1 }}
                    >
                      <span>{item.label}</span>
                      <span className="font-bold text-slate-900">{item.value}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CO2HouseholdsPage;