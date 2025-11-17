// pages/BatteryShowcaseFullScreen.tsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import dummy battery data
import batteriesData from '../data/batteries';

// Translation dictionaries
const baseTranslations = {
  nl: {
    energyPortal: 'Energie Portal',
    tagline: 'Batterijen voor zonnepanelen',
    heroTitle: 'Energie opslaan wanneer de zon schijnt.',
    heroDesc: 'Voorbeeldpagina om jouw batterij-oplossingen te tonen. Vervang de kaartinhoud door foto\'s van de klant. Geen scroll, geschikt voor narrowcasting.',
    standardBattery: 'Standaard batterij',
    capacityLabel: 'Capaciteit',
    couplingLabel: 'Koppeling',
    placementLabel: 'Plaatsing',
    whyTitle: 'Waarom?',
    whyDesc: "Verhoog eigen verbruik en gebruik zonnestroom 's avonds.",
    howTitle: 'Hoe?',
    howDesc: 'PV → huis en overschot → batterij → later teruglevering.',
    whoTitle: 'Voor wie?',
    whoDesc: 'Huishoudens met zonnepanelen of kleine bedrijfsinstallatie.',
    detailsBtn: 'Details bekijken →',
    placeholdersInfo: "Plaatshouders — vervang door echte foto's van installateur / leverancier",
  },
  en: {
    energyPortal: 'Energy Portal',
    tagline: 'Batteries for solar panels',
    heroTitle: 'Store energy when the sun shines.',
    heroDesc: 'Example page to showcase your battery solutions. Replace the card content with customer photos. No scrolling, suitable for narrowcasting.',
    standardBattery: 'Standard battery',
    capacityLabel: 'Capacity',
    couplingLabel: 'Coupling',
    placementLabel: 'Placement',
    whyTitle: 'Why?',
    whyDesc: 'Increase self consumption and use solar power in the evening.',
    howTitle: 'How?',
    howDesc: 'PV → house and surplus → battery → back delivery later.',
    whoTitle: 'For whom?',
    whoDesc: 'Households with solar panels or small business installation.',
    detailsBtn: 'View details →',
    placeholdersInfo: 'Placeholders — replace with real photos of the installer / supplier',
  },
};

// Translation of battery tag labels with proper TypeScript typing
interface TagTranslations {
  [key: string]: string;
}

const tagTranslations: Record<string, TagTranslations> = {
  nl: {
    Uitbreidbaar: 'Uitbreidbaar',
    Muur: 'Muur',
    Hybride: 'Hybride',
    Compact: 'Compact',
    Tussenwoning: 'Tussenwoning',
    'Schuur/bedrijf': 'Schuur/bedrijf',
    'IP-beschermd': 'IP-beschermd',
  },
  en: {
    Uitbreidbaar: 'Expandable',
    Muur: 'Wall',
    Hybride: 'Hybrid',
    Compact: 'Compact',
    Tussenwoning: 'Terraced house',
    'Schuur/bedrijf': 'Barn / commercial',
    'IP-beschermd': 'IP protected',
  },
};

type LangKey = keyof typeof baseTranslations;
type TranslationShape = (typeof baseTranslations)["en"];

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export interface BatteryShowcaseFullScreenProps {
  width?: number;
  height?: number;
  lang?: LangKey;
  texts?: Partial<Record<LangKey, DeepPartial<TranslationShape>>>;
  apiConfig?: {
    enabled: boolean;
    endpoint: string;
  };
}

// Enhanced Battery Thumbnail with animations
function BatteryThumb() {
  return (
    <motion.div 
      className="w-full h-full bg-gradient-to-b from-slate-700 to-slate-900 flex items-center justify-center relative overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Animated energy background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-cyan-400/5"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          x: [-100, 100, -100],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      
      <motion.div
        className="w-14 h-9 rounded-md border-2 border-emerald-200/70 relative bg-slate-800/50 backdrop-blur-sm"
        animate={{
          boxShadow: [
            '0 0 0px rgba(52, 211, 153, 0.3)',
            '0 0 20px rgba(52, 211, 153, 0.6)',
            '0 0 0px rgba(52, 211, 153, 0.3)',
          ],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        {/* Battery terminals */}
        <div className="w-2 h-4 bg-emerald-200/70 rounded-sm absolute -right-2 top-1/2 -translate-y-1/2" />
        
        {/* Animated battery charge level */}
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-sm ml-1 mr-1 mt-1 mb-1"
          initial={{ width: '30%' }}
          animate={{ width: ['30%', '80%', '30%'] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Floating energy particles */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 bg-emerald-400/50 rounded-full"
          style={{
            left: `${15 + i * 25}%`,
            top: `${20 + i * 15}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0, 1, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.6,
          }}
        />
      ))}
    </motion.div>
  );
}

// Animated Battery Card
const AnimatedBatteryCard = ({ battery, lang, index }: { battery: any; lang: LangKey; index: number }) => {
  const getTranslatedTag = (tag: string): string => {
    const langTranslations = tagTranslations[lang];
    return langTranslations?.[tag] ?? tag;
  };

  return (
    <motion.div
      key={battery.id}
      className="flex-1 bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden flex flex-col min-h-0 shadow-2xl"
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: 0.3 + index * 0.1, 
        type: "spring", 
        stiffness: 100,
        damping: 15 
      }}
      whileHover={{ 
        scale: 1.02, 
        y: -4,
        transition: { type: "spring", stiffness: 400 }
      }}
    >
      <div className="h-32 flex-shrink-0">
        <BatteryThumb />
      </div>
      <div className="p-4 flex-1 flex flex-col min-h-0">
        <motion.p 
          className="text-sm font-semibold text-white mb-1"
          whileHover={{ color: '#10b981' }}
        >
          {battery.name}
        </motion.p>
        <motion.p 
          className="text-[11px] text-slate-300 mb-2"
          whileHover={{ color: '#cbd5e1' }}
        >
          {battery.brand}
        </motion.p>
        <div className="flex flex-wrap gap-1 mb-2">
          {battery.tags?.map((tag: string, tagIndex: number) => (
            <motion.span
              key={tag}
              className="px-2 py-[2px] bg-slate-950/40 border border-slate-800 rounded-full text-[10px] text-emerald-300 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + tagIndex * 0.05 }}
              whileHover={{ 
                scale: 1.1, 
                backgroundColor: 'rgba(16, 185, 129, 0.3)',
                transition: { type: "spring", stiffness: 400 }
              }}
            >
              {getTranslatedTag(tag)}
            </motion.span>
          ))}
        </div>
        <motion.button 
          className="mt-auto text-[11px] text-emerald-200 hover:text-white w-fit flex items-center gap-1 group"
          whileHover={{ x: 3 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {baseTranslations[lang].detailsBtn}
          <motion.span
            animate={{ x: [0, 2, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </motion.button>
      </div>
    </motion.div>
  );
};

// Animated Info Block
const AnimatedInfoBlock = ({ title, description, delay }: { title: string; description: string; delay: number }) => {
  return (
    <motion.div
      className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-3 shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ 
        scale: 1.02,
        borderColor: 'rgba(16, 185, 129, 0.3)',
        transition: { type: "spring", stiffness: 300 }
      }}
    >
      <motion.p 
        className="text-[13px] font-semibold mb-1 text-white"
        whileHover={{ color: '#10b981' }}
      >
        {title}
      </motion.p>
      <motion.p 
        className="text-[11px] text-slate-200/70 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.2 }}
      >
        {description}
      </motion.p>
    </motion.div>
  );
};

const BatteryShowcaseFullScreen: React.FC<BatteryShowcaseFullScreenProps> = ({
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

  const [batteries, setBatteries] = useState(batteriesData);
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

  // API data fetching function
  const loadBatteryData = async () => {
    if (apiConfig.enabled && apiConfig.endpoint) {
      try {
        const res = await fetch(apiConfig.endpoint);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        if (Array.isArray(data)) {
          setBatteries(data);
        }
      } catch (err) {
        console.error('Failed to fetch battery data:', err);
      }
    }
  };

  // API data fetching
  useEffect(() => {
    let cancelled = false;
    
    const loadData = async () => {
      await loadBatteryData();
    };

    if (!cancelled) {
      loadData();
    }

    return () => {
      cancelled = true;
    };
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
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-emerald-400/5 to-cyan-400/3"
            style={{
              width: 60 + Math.random() * 100,
              height: 60 + Math.random() * 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 20 - 10, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <motion.div
        className="relative w-full h-full bg-slate-950 text-slate-50 flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Top bar */}
        <motion.div 
          className="h-14 bg-slate-950/90 backdrop-blur flex items-center justify-between px-8 border-b border-slate-800 flex-shrink-0"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              className="w-7 h-7 bg-emerald-400 rounded-md flex items-center justify-center text-slate-950 text-sm font-bold"
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              E
            </motion.div>
            <span className="font-semibold text-sm">{t.energyPortal}</span>
            <motion.span 
              className="text-[10px] bg-emerald-500/15 border border-emerald-400/30 rounded-full px-2 ml-1"
              whileHover={{ scale: 1.1 }}
            >
              {t.tagline}
            </motion.span>
          </motion.div>
          <motion.div 
            className="text-[11px] text-slate-200/70 flex gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <a href="/battery-solar" className="hover:text-white transition-colors">
              Dashboard
            </a>
            <a href="/battery-showcase" className="text-white font-medium">
              {t.tagline.split(' ')[0]}
            </a>
          </motion.div>
        </motion.div>

        {/* Content area */}
        <div className="flex-1 px-8 pt-6 pb-6 flex flex-col gap-5 overflow-hidden min-h-0">
          {/* Hero section */}
          <motion.div 
            className="flex justify-between gap-8 flex-shrink-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex-1">
              <motion.h1 
                className={`font-semibold tracking-tight mb-2 text-white ${currentTextSize.title}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {t.heroTitle}
              </motion.h1>
              <motion.p 
                className={`text-slate-200/80 max-w-xl leading-relaxed ${currentTextSize.body}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {t.heroDesc}
              </motion.p>
            </div>
            
            <motion.div 
              className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl px-4 py-3 w-64 flex-shrink-0 shadow-xl"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
            >
              <motion.p 
                className={`text-slate-200/60 mb-2 ${currentTextSize.small}`}
                whileHover={{ color: '#10b981' }}
              >
                {t.standardBattery}
              </motion.p>
              <dl className={`space-y-1 ${currentTextSize.small}`}>
                {[
                  { label: t.capacityLabel, value: '5 – 15 kWh' },
                  { label: t.couplingLabel, value: 'AC / DC' },
                  { label: t.placementLabel, value: activeLang === 'nl' ? 'Muur / vloer' : 'Wall / floor' },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    className="flex justify-between"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <dt className="text-slate-300/70">{item.label}</dt>
                    <dd className="font-semibold text-emerald-300">{item.value}</dd>
                  </motion.div>
                ))}
              </dl>
            </motion.div>
          </motion.div>

          {/* Three info cards */}
          <motion.div 
            className="grid grid-cols-3 gap-4 flex-shrink-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <AnimatedInfoBlock title={t.whyTitle} description={t.whyDesc} delay={0.6} />
            <AnimatedInfoBlock title={t.howTitle} description={t.howDesc} delay={0.7} />
            <AnimatedInfoBlock title={t.whoTitle} description={t.whoDesc} delay={0.8} />
          </motion.div>

          {/* Four battery cards */}
          <motion.div 
            className="flex gap-4 flex-1 min-h-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <AnimatePresence>
              {batteries.map((battery, index) => (
                <AnimatedBatteryCard 
                  key={battery.id}
                  battery={battery}
                  lang={activeLang}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Placeholders info */}
          <motion.p 
            className={`text-slate-400 text-right flex-shrink-0 ${currentTextSize.small}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            {t.placeholdersInfo}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default BatteryShowcaseFullScreen;