// src/pages/EVChargingStationsPage.tsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Translation dictionaries (base defaults)
const baseTranslations = {
  en: {
    listTitle: 'Charging stations overview',
    stationsTitle: 'Available charging stations',
    availableLabel: 'Available:',
    powerLabel: 'Power:',
    priceLabel: 'Price:',
    systemOverview: 'System overview',
    totalStations: 'Total stations',
    avgOccupancy: 'Avg occupancy',
    realtime: 'Real-time occupancy and usage patterns',
    station: {
      available: 'Available',
      full: 'Full',
    },
    stationDetails: 'Station Details',
    performance: 'Performance',
    connectorType: 'Connector type',
    maxPower: 'Max power',
    currentPrice: 'Current price',
    avgOccupancyCard: 'Avg occupancy',
    peakUsage: 'Peak usage',
    chargedToday: 'Charged today',
    units: {
      percentOccupancy: (v: number) => `${v}% occupancy`,
      hourTitle: (label: string) => `${label}:00 hours`,
    },
    info: {
      description: 'Real-time electric vehicle charging station monitoring with availability tracking and usage analytics.',
      smartChip: '• Real-time Data',
      aiChip: '• Smart Routing',
    },
    kpis: {
      availability: 'Availability',
      power: 'Power',
      price: 'Price',
      occupancy: 'Occupancy'
    }
  },
  nl: {
    listTitle: 'Laadpalen overzicht',
    stationsTitle: 'Beschikbare laadstations',
    availableLabel: 'Beschikbaar:',
    powerLabel: 'Vermogen:',
    priceLabel: 'Prijs:',
    systemOverview: 'Systeem overzicht',
    totalStations: 'Totaal stations',
    avgOccupancy: 'Gem. bezetting',
    realtime: 'Real-time bezetting en gebruikspatronen',
    station: {
      available: 'Beschikbaar',
      full: 'Vol',
    },
    stationDetails: 'Station Details',
    performance: 'Prestaties',
    connectorType: 'Type connector',
    maxPower: 'Max vermogen',
    currentPrice: 'Actuele prijs',
    avgOccupancyCard: 'Gem. bezetting',
    peakUsage: 'Piek gebruik',
    chargedToday: 'Vandaag geladen',
    units: {
      percentOccupancy: (v: number) => `${v}% bezetting`,
      hourTitle: (label: string) => `${label}:00 uur`,
    },
    info: {
      description: 'Real-time monitoring van elektrische voertuig laadstations met beschikbaarheid tracking en gebruik analytics.',
      smartChip: '• Real-time Data',
      aiChip: '• Slimme Routeplanning',
    },
    kpis: {
      availability: 'Beschikbaarheid',
      power: 'Vermogen',
      price: 'Prijs',
      occupancy: 'Bezetting'
    }
  }
};

type LangKey = keyof typeof baseTranslations;
type TranslationShape = (typeof baseTranslations)["en"];

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export interface EVChargingStationsPageProps {
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
    station: { ...base.station, ...(override.station ?? {}) },
    units: { ...base.units, ...(override.units ?? {}) },
  };
}

// Mock data (replace with actual imports)
const mockChargingStationsData = [
  { id: 1, name: 'City Center Station', type: 'SNELLADER', available: 3, total: 4, power: 150, price: 0.45 },
  { id: 2, name: 'Shopping Mall Chargers', type: 'CCS', available: 1, total: 6, power: 50, price: 0.38 },
  { id: 3, name: 'Highway Rest Stop', type: 'SNELLADER', available: 2, total: 4, power: 150, price: 0.52 },
  { id: 4, name: 'Office Park Charging', type: 'TYPE2', available: 4, total: 8, power: 22, price: 0.35 },
  { id: 5, name: 'Airport Parking', type: 'CCS', available: 0, total: 4, power: 50, price: 0.48 },
];

const mockUsageHours = [65, 58, 42, 35, 28, 32, 45, 68, 75, 82, 88, 85, 78, 72, 65, 58, 62, 75, 89, 92, 85, 78, 72, 65];
const mockHourLabels = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];

const EVChargingStationsPage: React.FC<EVChargingStationsPageProps> = ({
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
  
  const [stations, setStations] = useState(mockChargingStationsData);
  const [selectedStation, setSelectedStation] = useState(0);
  const [usageHours, setUsageHours] = useState(mockUsageHours);
  const [hourLabels, setHourLabels] = useState(mockHourLabels);
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

  // Chart data configured based on usageHours
  const chartData = {
    labels: hourLabels,
    datasets: [
      {
        label: '',
        data: usageHours,
        borderRadius: 999,
        borderSkipped: false,
        barPercentage: 0.55,
        categoryPercentage: 0.8,
        backgroundColor: (ctx: any) => {
          const v = ctx.parsed.y;
          if (v >= 80) return 'rgba(16,185,129,1)';
          if (v >= 70) return 'rgba(132,204,22,1)';
          if (v >= 60) return 'rgba(234,179,8,1)';
          return 'rgba(248,113,113,1)';
        },
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
        cornerRadius: 8,
        padding: 10,
        callbacks: {
          label: (ctx: any) => t.units.percentOccupancy(ctx.parsed.y),
          title: (ctx: any) => t.units.hourTitle(ctx[0].label),
        },
      },
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: {
          color: '#94a3b8',
          font: { size: 11, weight: '500' },
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 25,
          color: '#94a3b8',
          font: { size: 10 },
          callback: (val: any) => `${val}%`,
        },
        grid: { color: 'rgba(148, 163, 184, 0.15)', drawBorder: false },
      },
    },
  };

  // Fetch stations from API and usage from API if available
  useEffect(() => {
    if (apiConfig.enabled && apiConfig.endpoint) {
      console.log('Fetching charging station data from:', apiConfig.endpoint);
      
      let cancelled = false;
      async function loadStations() {
        try {
          const res = await fetch('/api/chargingstations');
          if (!res.ok) throw new Error('Bad');
          const data = await res.json();
          if (!cancelled && Array.isArray(data)) {
            setStations(data);
          }
        } catch (e) {
          // ignore, fall back to mock data
        }
      }
      async function loadUsage() {
        try {
          const res = await fetch('/api/chargingusage');
          if (!res.ok) throw new Error('Bad');
          const data = await res.json();
          if (!cancelled && data && Array.isArray(data.usage) && Array.isArray(data.labels)) {
            setUsageHours(data.usage);
            setHourLabels(data.labels);
          }
        } catch (e) {
          // ignore, fall back to mock data
        }
      }
      loadStations();
      loadUsage();
      return () => {
        cancelled = true;
      };
    }
  }, [apiConfig.enabled, apiConfig.endpoint]);

  const station = stations[selectedStation] || stations[0];

  const getAvailabilityColor = (available: number, total: number) => {
    const p = (available / total) * 100;
    if (p >= 50) return 'text-emerald-400';
    if (p >= 25) return 'text-amber-300';
    return 'text-red-300';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SNELLADER': return 'bg-green-500/20 text-green-200';
      case 'CCS': return 'bg-purple-500/20 text-purple-200';
      case 'TYPE2': return 'bg-blue-500/20 text-blue-200';
      default: return 'bg-gray-500/20 text-gray-200';
    }
  };

  return (
    <div 
      className="w-full h-full flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 relative"
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
        maxWidth: width,
        maxHeight: height,
      }}
    >
      {/* Simplified Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-200/20"
            style={{
              width: 40 + Math.random() * 80,
              height: 40 + Math.random() * 80,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 10 - 5, 0],
            }}
            transition={{
              duration: 15 + Math.random() * 15,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 w-full p-3 lg:p-6 flex flex-col lg:flex-row gap-4 lg:gap-6 min-h-0">
        {/* Left Panel */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-[400px] xl:w-[450px] bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl lg:rounded-2xl p-4 lg:p-6 flex flex-col shadow-lg"
        >
          {/* Header */}
          <div className="mb-4 lg:mb-6">
            <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
              <motion.div
                className={`${containerSize === 'sm' ? 'w-8 h-8' : containerSize === 'md' ? 'w-10 h-10' : containerSize === 'lg' ? 'w-12 h-12' : 'w-14 h-14'} bg-white/20 rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <svg className={`${containerSize === 'sm' ? 'w-4 h-4' : containerSize === 'md' ? 'w-5 h-5' : containerSize === 'lg' ? 'w-6 h-6' : 'w-7 h-7'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                  />
                </svg>
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className={`tracking-wide uppercase opacity-90 font-medium mb-1 ${currentTextSize.small}`}>
                  {t.listTitle}
                </p>
                <h1 className={`font-bold leading-tight ${currentTextSize.title}`}>
                  {t.stationsTitle}
                </h1>
              </div>
            </div>

            {/* Info Bar */}
            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-xl p-3 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2">
                <p className={`leading-relaxed font-medium flex-1 ${currentTextSize.body} line-clamp-2`}>
                  {t.info.description}
                </p>
                <div className="flex gap-1 lg:gap-2 flex-shrink-0">
                  <motion.span 
                    className="px-2 lg:px-3 py-1 rounded-full bg-blue-500/30 text-blue-100 font-semibold border border-blue-400/30 whitespace-nowrap"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className={currentTextSize.small}>{t.info.smartChip}</span>
                  </motion.span>
                  <motion.span 
                    className="px-2 lg:px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-100 font-semibold border border-indigo-400/30 whitespace-nowrap"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className={currentTextSize.small}>{t.info.aiChip}</span>
                  </motion.span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Scrollable Station List */}
          <div className="flex-1 space-y-3 lg:space-y-4 mb-4 lg:mb-6 overflow-y-auto hide-scrollbar">
            {stations.map((s, idx) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                onClick={() => setSelectedStation(idx)}
                className={`bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-4 border-2 cursor-pointer transition-all ${
                  selectedStation === idx ? 'border-white/40 bg-white/20' : 'border-white/10 hover:border-white/20'
                }`}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-start mb-2 lg:mb-3">
                  <h3 className={`font-bold ${currentTextSize.body} truncate`}>{s.name}</h3>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ${getTypeColor(s.type)}`}
                  >
                    {s.type}
                  </span>
                </div>
                <div className="space-y-1 lg:space-y-2">
                  <div className="flex justify-between">
                    <span className={`opacity-80 ${currentTextSize.small}`}>{t.availableLabel}</span>
                    <span className={`font-bold ${getAvailabilityColor(s.available, s.total)} ${currentTextSize.small}`}>
                      {s.available}/{s.total}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`opacity-80 ${currentTextSize.small}`}>{t.powerLabel}</span>
                    <span className={`font-bold ${currentTextSize.small}`}>{s.power} kW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`opacity-80 ${currentTextSize.small}`}>{t.priceLabel}</span>
                    <span className={`font-bold ${currentTextSize.small}`}>€{s.price.toFixed(2)}/kWh</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer Stats */}
          <motion.div 
            className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-white/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <p className={`font-semibold mb-2 lg:mb-3 ${currentTextSize.body}`}>{t.systemOverview}</p>
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              <div>
                <p className={`opacity-80 ${currentTextSize.small}`}>{t.totalStations}</p>
                <p className={`font-bold text-white ${currentTextSize.metric}`}>{stations.length}</p>
              </div>
              <div>
                <p className={`opacity-80 ${currentTextSize.small}`}>{t.avgOccupancy}</p>
                <p className={`font-bold text-emerald-100 ${currentTextSize.metric}`}>68%</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Panel */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 bg-white rounded-xl lg:rounded-2xl flex flex-col shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 lg:p-6 border-b border-slate-100">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h2 className={`font-bold text-slate-900 mb-1 ${currentTextSize.cardTitle} truncate`}>
                  {station.name}
                </h2>
                <p className={`text-slate-600 ${currentTextSize.cardSubtitle}`}>{t.realtime}</p>
              </div>
              <div className="flex items-center gap-2 lg:gap-3 ml-3">
                <div
                  className={`px-3 lg:px-4 py-1 lg:py-2 rounded-lg text-xs lg:text-sm font-semibold border ${
                    station.available > 0
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}
                >
                  {station.available > 0 ? t.station.available : t.station.full}
                </div>
                <motion.button 
                  className={`${containerSize === 'sm' ? 'w-8 h-8' : containerSize === 'md' ? 'w-9 h-9' : 'w-10 h-10'} bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className={`${containerSize === 'sm' ? 'w-4 h-4' : containerSize === 'md' ? 'w-4 h-4' : 'w-5 h-5'} text-slate-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          {/* Chart Area */}
          <div className="flex-1 p-4 lg:p-6 min-h-0">
            <Bar data={chartData} options={chartOptions} />
          </div>

          {/* Bottom Info Cards */}
          <div className="p-4 lg:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {/* Station Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-slate-50 rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-slate-200"
              >
                <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
                  <div className="w-2 lg:w-3 h-2 lg:h-3 bg-sky-500 rounded-full"></div>
                  <p className={`font-bold text-slate-900 ${currentTextSize.body}`}>{t.stationDetails}</p>
                </div>
                <div className="space-y-2 lg:space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={currentTextSize.small}>{t.connectorType}</span>
                    <span className={`font-bold text-slate-900 ${currentTextSize.small}`}>{station.type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={currentTextSize.small}>{t.maxPower}</span>
                    <span className={`font-bold text-slate-900 ${currentTextSize.small}`}>{station.power} kW</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={currentTextSize.small}>{t.currentPrice}</span>
                    <span className={`font-bold text-slate-900 ${currentTextSize.small}`}>€{station.price.toFixed(2)}/kWh</span>
                  </div>
                </div>
              </motion.div>

              {/* Performance */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-slate-50 rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-slate-200"
              >
                <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
                  <div className="w-2 lg:w-3 h-2 lg:h-3 bg-emerald-500 rounded-full"></div>
                  <p className={`font-bold text-slate-900 ${currentTextSize.body}`}>{t.performance}</p>
                </div>
                <div className="space-y-2 lg:space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={currentTextSize.small}>{t.avgOccupancyCard}</span>
                    <span className={`font-bold text-slate-900 ${currentTextSize.small}`}>68%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={currentTextSize.small}>{t.peakUsage}</span>
                    <span className={`font-bold text-slate-900 ${currentTextSize.small}`}>18:00-20:00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={currentTextSize.small}>{t.chargedToday}</span>
                    <span className={`font-bold text-slate-900 ${currentTextSize.small}`}>42 auto's</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hide scrollbar styles */}
      <style>{`
        .hide-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default EVChargingStationsPage;