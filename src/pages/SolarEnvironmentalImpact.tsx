// pages/SolarEnvironmentalImpact.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// =====================
// Base translations
// =====================
const baseTranslations = {
  en: {
    title: "Environmental Impact",
    subtitle: "Real-time CO₂ Reduction & Sustainability Tracking",
    totalReduction: "CO₂ Reduced",
    totalReductionValue: "38.6 tons",
    equivalent: "Equivalent to 1,570 trees",
    info: {
      description:
        "Live monitoring of environmental benefits from your solar installation with real-time impact visualization.",
      co2Chip: "• CO₂ Tracking",
      sustainabilityChip: "• Live Impact",
    },
    kpis: {
      annualReduction: "Annual Reduction",
      annualValue: "4.2 tons CO₂",
      equivalentCars: "Cars Off Road",
      carsValue: "0.9 vehicles",
      systemLifetime: "System Life",
      lifetimeValue: "25+ years",
    },
    leftCard: {
      title: "Carbon Footprint",
      subtitle: "Real-time emission reduction tracking",
      legend: {
        operation: "Energy Production",
        manufacturing: "Manufacturing Offset",
        transport: "Transport Saved",
        disposal: "Waste Reduction",
      },
      footer: "Live environmental impact monitoring",
    },
    centerCard: {
      title: "Eco System Impact",
      note: "Visualizing positive environmental contributions",
    },
    rightCard: {
      title: "Fossil Fuel Displacement",
      subtitle: "Traditional energy sources avoided",
      legend: {
        coalAvoided: "Coal Power",
        gasAvoided: "Natural Gas",
        oilAvoided: "Oil Energy",
      },
      footer: "Real-time fossil fuel displacement",
    },
  },
  nl: {
    title: "Milieu Impact",
    subtitle: "Real-time CO₂ Reductie & Duurzaamheid Tracking",
    totalReduction: "CO₂ Gereduceerd",
    totalReductionValue: "38.6 ton",
    equivalent: "Gelijk aan 1.570 bomen",
    info: {
      description:
        "Live monitoring van milieuvoordelen van uw zonne-installatie met real-time impact visualisatie.",
      co2Chip: "• CO₂ Tracking",
      sustainabilityChip: "• Live Impact",
    },
    kpis: {
      annualReduction: "Jaarlijkse Reductie",
      annualValue: "4.2 ton CO₂",
      equivalentCars: "Auto's Van De Weg",
      carsValue: "0.9 voertuigen",
      systemLifetime: "Systeem Levensduur",
      lifetimeValue: "25+ jaar",
    },
    leftCard: {
      title: "Carbon Voetafdruk",
      subtitle: "Real-time emissie reductie tracking",
      legend: {
        operation: "Energie Productie",
        manufacturing: "Productie Compensatie",
        transport: "Transport Bespaard",
        disposal: "Afval Reductie",
      },
      footer: "Live milieu impact monitoring",
    },
    centerCard: {
      title: "Eco Systeem Impact",
      note: "Visualisatie van positieve milieu bijdragen",
    },
    rightCard: {
      title: "Fossiele Brandstof Vervanging",
      subtitle: "Vermeden traditionele energiebronnen",
      legend: {
        coalAvoided: "Kolen Stroom",
        gasAvoided: "Aardgas",
        oilAvoided: "Olie Energie",
      },
      footer: "Real-time fossiele brandstof vervanging",
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

// Base design size (for scaling to fit canvas)
const BASE_WIDTH = 1280;
const BASE_HEIGHT = 720;

// Merge translations
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
      legend: { ...base.leftCard.legend, ...(override.leftCard?.legend ?? {}) },
    },
    centerCard: { ...base.centerCard, ...(override.centerCard ?? {}) },
    rightCard: {
      ...base.rightCard,
      ...(override.rightCard ?? {}),
      legend: { ...base.rightCard.legend, ...(override.rightCard?.legend ?? {}) },
    },
  };
}

// --- Simple API data shape & fetch helper ---
type EnvironmentalData = {
  co2Reduction?: number;
  treesEquivalent?: number;
};

async function fetchEnvironmentalData(
  endpoint?: string
): Promise<EnvironmentalData | null> {
  try {
    const url = endpoint || "/api/solarenvironmental";
    const res = await fetch(url);
    if (!res.ok) throw new Error("network");
    const json = await res.json();
    const data: EnvironmentalData = {};
    if (typeof json.co2Reduction === "number") data.co2Reduction = json.co2Reduction;
    if (typeof json.treesEquivalent === "number")
      data.treesEquivalent = json.treesEquivalent;
    return data;
  } catch (e) {
    return null;
  }
}

// =====================
// Small components
// =====================
const Earth3DIcon = ({ size = "lg" }: { size?: "sm" | "md" | "lg" | "xl" }) => {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  };

  return (
    <motion.div
      className={`relative ${sizeMap[size]} rounded-full`}
      animate={{ rotateY: [0, 180, 360] }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-green-400 to-blue-600 rounded-full shadow-lg" />
      <div className="absolute top-1/4 left-1/4 w-2 h-1 bg-white/80 rounded-full" />
      <div className="absolute bottom-1/3 right-1/4 w-3 h-1 bg-white/80 rounded-full" />
      <div className="absolute top-2/5 left-1/3 w-4 h-3 bg-green-500 rounded-full" />
      <div className="absolute bottom-1/4 right-1/3 w-3 h-2 bg-green-600 rounded-full" />
    </motion.div>
  );
};

const Tree3DIcon = ({ size = "lg" }: { size?: "sm" | "md" | "lg" | "xl" }) => {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  };

  return (
    <motion.div
      className={`relative ${sizeMap[size]}`}
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 3, repeat: Infinity }}
    >
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-5 bg-yellow-800 rounded-t" />
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-green-500 rounded-full"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
};

const Car3DIcon = ({ size = "lg" }: { size?: "sm" | "md" | "lg" | "xl" }) => {
  const sizeMap = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  };

  return (
    <motion.div
      className={`relative ${sizeMap[size]}`}
      animate={{ x: [0, 3, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <div className="absolute bottom-0 inset-x-1 h-4 bg-red-500 rounded" />
      <div className="absolute bottom-3 inset-x-2 h-3 bg-red-400 rounded-t" />
      <div className="absolute bottom-0 left-2 w-3 h-3 bg-gray-800 rounded-full" />
      <div className="absolute bottom-0 right-2 w-3 h-3 bg-gray-800 rounded-full" />
    </motion.div>
  );
};

const ParticleSystem = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(15)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-green-300 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -50, 0],
          x: [0, Math.random() * 20 - 10, 0],
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

const CarbonGauge = ({
  reduction = 38.6,
  size = "lg",
}: {
  reduction?: number;
  size?: "sm" | "md" | "lg" | "xl";
}) => {
  const sizeMap = {
    sm: "w-16 h-16",
    md: "w-20 h-20",
    lg: "w-24 h-24",
    xl: "w-28 h-28",
  };

  return (
    <motion.div
      className={`relative ${sizeMap[size]} bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200 backdrop-blur-sm shadow-lg flex items-center justify-center`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="text-center">
        <motion.div
          className="text-lg font-bold text-green-700"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {reduction.toFixed(1)}
        </motion.div>
        <div className="text-xs text-green-600">tons CO₂</div>
      </div>
    </motion.div>
  );
};

const CompactImpactCard = ({
  title,
  value,
  subtitle,
  icon,
  color = "green",
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color?: "green" | "blue" | "emerald";
}) => {
  const colorMap = {
    green: "from-green-500 to-emerald-600",
    blue: "from-blue-500 to-cyan-600",
    emerald: "from-emerald-500 to-teal-600",
  };

  return (
    <motion.div
      className={`bg-gradient-to-br ${colorMap[color]} rounded-xl p-3 text-white shadow-lg backdrop-blur-sm border border-white/20`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center space-x-2 mb-2">
        {icon}
        <h3 className="text-sm font-semibold truncate">{title}</h3>
      </div>
      <p className="text-base font-bold mb-1">{value}</p>
      <p className="text-xs text-white/80 truncate">{subtitle}</p>
    </motion.div>
  );
};

const CompactFossilDisplacement = () => {
  const [displacement, setDisplacement] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setDisplacement((prev) => (prev + 1) % 100),
      100
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-16 bg-gradient-to-r from-red-500 to-green-500 rounded-xl overflow-hidden shadow">
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-green-700"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {displacement}% Clean
      </motion.div>
    </div>
  );
};

// =====================
// Main component
// =====================
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
  // Language
  let autoLang: LangKey = "nl";
  if (
    typeof navigator !== "undefined" &&
    navigator.language?.toLowerCase().startsWith("en")
  ) {
    autoLang = "en";
  }
  const activeLang: LangKey =
    lang && (lang === "nl" || lang === "en") ? lang : autoLang;
  const base = baseTranslations[activeLang];
  const overrides = (texts?.[activeLang] ?? {}) as DeepPartial<TranslationShape>;
  const t = mergeLang(base, overrides);

  // Responsiveness + scale
  const [containerSize, setContainerSize] = useState<"sm" | "md" | "lg" | "xl">(
    "lg"
  );
  const [scale, setScale] = useState(1);
  const [co2Reduction, setCo2Reduction] = useState(38.6);
  const [treesEquivalent, setTreesEquivalent] = useState(1570);

  useEffect(() => {
    const updateSize = () => {
      const containerWidth = width || window.innerWidth;
      const containerHeight = height || window.innerHeight;

      const minDimension = Math.min(containerWidth, containerHeight);

      if (minDimension < 600) {
        setContainerSize("sm");
      } else if (minDimension < 900) {
        setContainerSize("md");
      } else if (minDimension < 1200) {
        setContainerSize("lg");
      } else {
        setContainerSize("xl");
      }

      const sx = containerWidth / BASE_WIDTH;
      const sy = containerHeight / BASE_HEIGHT;
      const s = Math.min(sx, sy);
      setScale(s > 0 ? s : 1);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [width, height]);

  const textSizeMap = {
    sm: {
      title: "text-xl lg:text-2xl",
      subtitle: "text-xs lg:text-sm",
      cardTitle: "text-sm lg:text-base",
      cardSubtitle: "text-xs",
      body: "text-xs lg:text-sm",
      small: "text-xs",
      kpi: "text-xs",
      metric: "text-base lg:text-lg",
      largeMetric: "text-xl lg:text-2xl",
    },
    md: {
      title: "text-2xl lg:text-3xl",
      subtitle: "text-sm lg:text-base",
      cardTitle: "text-base lg:text-lg",
      cardSubtitle: "text-xs lg:text-sm",
      body: "text-sm lg:text-base",
      small: "text-xs lg:text-sm",
      kpi: "text-sm",
      metric: "text-lg lg:text-xl",
      largeMetric: "text-2xl lg:text-3xl",
    },
    lg: {
      title: "text-3xl lg:text-4xl",
      subtitle: "text-base lg:text-lg",
      cardTitle: "text-lg lg:text-xl",
      cardSubtitle: "text-sm lg:text-base",
      body: "text-base lg:text-lg",
      small: "text-sm lg:text-base",
      kpi: "text-base",
      metric: "text-xl lg:text-2xl",
      largeMetric: "text-3xl lg:text-4xl",
    },
    xl: {
      title: "text-4xl lg:text-5xl",
      subtitle: "text-lg lg:text-xl",
      cardTitle: "text-xl lg:text-2xl",
      cardSubtitle: "text-base lg:text-lg",
      body: "text-lg lg:text-xl",
      small: "text-base lg:text-lg",
      kpi: "text-lg",
      metric: "text-2xl lg:text-3xl",
      largeMetric: "text-4xl lg:text-5xl",
    },
  };

  const currentTextSize = textSizeMap[containerSize];

  // API data
  useEffect(() => {
    let cancelled = false;

    if (apiConfig.enabled) {
      fetchEnvironmentalData(apiConfig.endpoint).then((data) => {
        if (!cancelled && data) {
          if (typeof data.co2Reduction === "number") {
            setCo2Reduction(data.co2Reduction);
          }
          if (typeof data.treesEquivalent === "number") {
            setTreesEquivalent(data.treesEquivalent);
          }
        }
      });
    }

    return () => {
      cancelled = true;
    };
  }, [apiConfig.enabled, apiConfig.endpoint]);

  useEffect(() => {
    if (!apiConfig.enabled) return;
    const interval = setInterval(() => {
      setCo2Reduction((prev) => prev + Math.random() * 0.1);
      setTreesEquivalent((prev) => prev + Math.random());
    }, 5000);
    return () => clearInterval(interval);
  }, [apiConfig.enabled]);

  // ========== Layouts (unchanged design) ==========
  const renderMobileLayout = () => (
    <div className="w-full h-full flex flex-col overflow-hidden relative">
      <ParticleSystem />

      <motion.header
        className="relative z-10 w-full px-3 pt-3 flex-shrink-0"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-3">
          <div className="flex justify-center mb-2">
            <Earth3DIcon size="sm" />
          </div>
          <motion.h1 className="font-bold text-white text-lg mb-1 drop-shadow">
            {t.title}
          </motion.h1>
          <motion.p className="text-white/80 text-xs">{t.subtitle}</motion.p>
        </div>

        <div className="space-y-2">
          <CompactImpactCard
            title={t.totalReduction}
            value={t.totalReductionValue}
            subtitle={t.equivalent}
            icon={<CarbonGauge size="sm" reduction={co2Reduction} />}
            color="green"
          />
          <CompactImpactCard
            title={t.kpis.annualReduction}
            value={t.kpis.annualValue}
            subtitle="Yearly environmental benefit"
            icon={<Tree3DIcon size="sm" />}
            color="emerald"
          />
          <CompactImpactCard
            title={t.kpis.equivalentCars}
            value={t.kpis.carsValue}
            subtitle="Road emissions eliminated"
            icon={<Car3DIcon size="sm" />}
            color="blue"
          />
        </div>
      </motion.header>

      <main className="flex-1 overflow-y-auto px-3 pb-3">
        <div className="space-y-3">
          <motion.div className="bg-white/90 rounded-xl p-3 shadow border border-white/20">
            <h3 className="font-semibold text-gray-800 text-sm mb-2 text-center">
              {t.leftCard.title}
            </h3>
            <div className="grid grid-cols-2 gap-2 text-center">
              {[
                { label: t.leftCard.legend.operation, value: "72%", color: "#10B981" },
                {
                  label: t.leftCard.legend.manufacturing,
                  value: "16%",
                  color: "#34D399",
                },
                { label: t.leftCard.legend.transport, value: "8%", color: "#6EE7B7" },
                { label: t.leftCard.legend.disposal, value: "4%", color: "#A7F3D0" },
              ].map((item, index) => (
                <div key={index} className="p-2 rounded-lg bg-gray-50">
                  <div
                    className="text-xs font-bold mb-1"
                    style={{ color: item.color }}
                  >
                    {item.value}
                  </div>
                  <div className="text-xs text-gray-600">{item.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className="bg-white/90 rounded-xl p-3 shadow border border-white/20 text-center">
            <h3 className="font-semibold text-gray-800 text-sm mb-2">
              {t.equivalent}
            </h3>
            <div className="text-xl font-black text-green-600 mb-1">
              {treesEquivalent.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600">Trees cleaning atmosphere</p>
          </motion.div>

          <motion.div className="bg-white/90 rounded-xl p-3 shadow border border-white/20">
            <h3 className="font-semibold text-gray-800 text-sm mb-2">
              {t.rightCard.title}
            </h3>
            <CompactFossilDisplacement />
            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              {[
                {
                  type: t.rightCard.legend.coalAvoided,
                  amount: "18.2t",
                  color: "#8B4513",
                },
                {
                  type: t.rightCard.legend.gasAvoided,
                  amount: "12.8t",
                  color: "#DC2626",
                },
                {
                  type: t.rightCard.legend.oilAvoided,
                  amount: "7.6t",
                  color: "#CA8A04",
                },
              ].map((fuel, index) => (
                <div key={index} className="text-xs">
                  <div className="font-semibold text-gray-800">{fuel.type}</div>
                  <div className="font-bold" style={{ color: fuel.color }}>
                    {fuel.amount}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-3 text-white text-center shadow">
            <div className="text-sm font-bold mb-1">🌍 Environmental Achievement</div>
            <div className="text-lg font-black mb-1">
              {co2Reduction.toFixed(1)} tons CO₂
            </div>
            <div className="text-xs">prevented from atmosphere</div>
          </motion.div>
        </div>
      </main>
    </div>
  );

  const renderDesktopLayout = () => (
    <div className="w-full h-full flex flex-col overflow-hidden relative">
      <ParticleSystem />

      <motion.header
        className="relative z-10 w-full px-6 pt-6 flex-shrink-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <Earth3DIcon size="xl" />
          </div>
          <motion.h1
            className={`font-black text-white ${currentTextSize.title} mb-2 drop-shadow-2xl`}
          >
            {t.title}
          </motion.h1>
          <motion.p
            className={`text-white/90 ${currentTextSize.subtitle} font-light`}
          >
            {t.subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <CompactImpactCard
            title={t.totalReduction}
            value={t.totalReductionValue}
            subtitle={t.equivalent}
            icon={<CarbonGauge size="lg" reduction={co2Reduction} />}
            color="green"
          />
          <CompactImpactCard
            title={t.kpis.annualReduction}
            value={t.kpis.annualValue}
            subtitle="Continuous environmental benefit"
            icon={<Tree3DIcon size="lg" />}
            color="emerald"
          />
          <CompactImpactCard
            title={t.kpis.equivalentCars}
            value={t.kpis.carsValue}
            subtitle="Road emissions eliminated"
            icon={<Car3DIcon size="lg" />}
            color="blue"
          />
        </div>
      </motion.header>

      {/* No internal scroll now; entire thing is scaled to fit */}
      <main className="flex-1 px-6 pb-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6 flex flex-col">
            <motion.div className="bg-white/90 rounded-2xl p-6 shadow-xl border border-white/20">
              <h3
                className={`font-bold text-gray-800 ${currentTextSize.cardTitle} mb-4 text-center`}
              >
                {t.leftCard.title}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: t.leftCard.legend.operation,
                    value: "72%",
                    color: "#10B981",
                    icon: "⚡",
                  },
                  {
                    label: t.leftCard.legend.manufacturing,
                    value: "16%",
                    color: "#34D399",
                    icon: "🏭",
                  },
                  {
                    label: t.leftCard.legend.transport,
                    value: "8%",
                    color: "#6EE7B7",
                    icon: "🚚",
                  },
                  {
                    label: t.leftCard.legend.disposal,
                    value: "4%",
                    color: "#A7F3D0",
                    icon: "♻️",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="p-4 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 text-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div
                      className={`font-bold mb-1 ${currentTextSize.metric}`}
                      style={{ color: item.color }}
                    >
                      {item.value}
                    </div>
                    <div className={`text-gray-600 ${currentTextSize.small}`}>
                      {item.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div className="bg-white/90 rounded-2xl p-6 shadow-xl border border-white/20 text-center">
              <h3
                className={`font-bold text-gray-800 ${currentTextSize.cardTitle} mb-4`}
              >
                {t.equivalent}
              </h3>
              <div
                className={`font-black text-green-600 mb-2 ${currentTextSize.largeMetric}`}
              >
                {treesEquivalent.toLocaleString()}
              </div>
              <p className={`text-gray-600 ${currentTextSize.body}`}>
                Trees actively cleaning our atmosphere
              </p>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6 flex flex-col">
            <motion.div className="bg-white/90 rounded-2xl p-6 shadow-xl border border-white/20">
              <h3
                className={`font-bold text-gray-800 ${currentTextSize.cardTitle} mb-4`}
              >
                {t.rightCard.title}
              </h3>
              <CompactFossilDisplacement />
              <div className="grid grid-cols-3 gap-4 mt-6 text-center">
                {[
                  {
                    type: t.rightCard.legend.coalAvoided,
                    amount: "18.2 tons",
                    color: "#8B4513",
                  },
                  {
                    type: t.rightCard.legend.gasAvoided,
                    amount: "12.8 tons",
                    color: "#DC2626",
                  },
                  {
                    type: t.rightCard.legend.oilAvoided,
                    amount: "7.6 tons",
                    color: "#CA8A04",
                  },
                ].map((fuel, index) => (
                  <motion.div
                    key={index}
                    className="p-3 rounded-xl border-2"
                    style={{ borderColor: fuel.color }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div
                      className={`font-semibold text-gray-800 ${currentTextSize.small}`}
                    >
                      {fuel.type}
                    </div>
                    <div
                      className={`font-bold ${currentTextSize.metric}`}
                      style={{ color: fuel.color }}
                    >
                      {fuel.amount}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white text-center shadow-xl">
              <h3 className={`font-bold mb-3 ${currentTextSize.cardTitle}`}>
                🌍 Environmental Achievement
              </h3>
              <div className={`font-black mb-2 ${currentTextSize.largeMetric}`}>
                {co2Reduction.toFixed(1)} tons CO₂
              </div>
              <p className={currentTextSize.body}>from entering our atmosphere</p>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );

  // =====================
  // Scaled wrapper
  // =====================
  return (
    <div
      className="flex items-center justify-center overflow-hidden"
      style={{
        width: width ? `${width}px` : "100%",
        height: height ? `${height}px` : "100%",
        maxWidth: width,
        maxHeight: height,
        background:
          "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 25%, #6ee7b7 50%, #34d399 75%, #10b981 100%)",
      }}
    >
      <div
        className="relative origin-top-left"
        style={{
          width: BASE_WIDTH,
          height: BASE_HEIGHT,
          transform: `scale(${scale})`,
        }}
      >
        {containerSize === "sm" ? renderMobileLayout() : renderDesktopLayout()}
      </div>
    </div>
  );
};

export default SolarEnvironmentalImpact;
