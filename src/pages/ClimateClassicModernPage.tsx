import React from "react";

// Translation dictionaries (base defaults)
const baseTranslations = {
  nl: {
    title: "Impactmeting Climate Classic 2021",
    subtitle: "Gevisualiseerde CO₂-footprint met en zonder transport",
    totalFootprint: "Totale footprint",
    totalFootprintEq: "43.089 kg CO₂ eq.",
    householdsEq: "= verbruik 11,3 huishoudens/jaar",
    info: {
      description:
        "Dit overzicht koppelt de activiteit aan de CO₂-uitstoot. Links de uitstoot mét transport, rechts dezelfde activiteit zonder transport. Handig om de impact van mobiliteit los te trekken.",
      climateChip: "• Klimaat",
      transportChip: "• Transport",
    },
    kpis: {
      largestShare: "Grootste aandeel: ",
      largestValue: "deelnemer transport (51%)",
      withoutTransport: "Zonder transport: ",
      withoutValue: "voedsel (73%)",
      method: "Methode: ",
      methodValue: "LCA (ReCiPe)",
    },
    leftCard: {
      title: "Uitstoot inclusief transport",
      subtitle: "Evenement • deelnemer • voeding • accommodatie",
      legend: {
        participantTransport: "Deelnemer transport",
        eventTransport: "Evenement transport",
        food: "Voedsel",
        accommodation: "Accommodatie (energie)",
      },
      footer:
        "Berekeningen door Copper8 op basis van LCA (ReCiPe methodiek).",
    },
    centerCard: {
      title: "Transport is de grootste hefboom",
      note: "Fiets als visueel element voor event/mobiliteit.",
    },
    rightCard: {
      title: "Uitstoot exclusief transport",
      subtitle: "Activiteit zonder mobiliteitscomponent",
      legend: {
        food: "Voedsel",
        accommodation: "Accommodatie (energie)",
        clothing: "Kleding",
      },
      footer: "Copper8",
    },
  },
  en: {
    title: "Impact measurement Climate Classic 2021",
    subtitle: "Visualised CO₂ footprint with and without transport",
    totalFootprint: "Total footprint",
    totalFootprintEq: "43,089 kg CO₂ eq.",
    householdsEq: "= consumption 11.3 households/year",
    info: {
      description:
        "This overview links the activity to the CO₂ emissions. On the left the emissions with transport, on the right the same activity without transport. Useful for separating the impact of mobility.",
      climateChip: "• Climate",
      transportChip: "• Transport",
    },
    kpis: {
      largestShare: "Largest share: ",
      largestValue: "participant transport (51%)",
      withoutTransport: "Without transport: ",
      withoutValue: "food (73%)",
      method: "Method: ",
      methodValue: "LCA (ReCiPe)",
    },
    leftCard: {
      title: "Emissions including transport",
      subtitle: "Event • participant • food • accommodation",
      legend: {
        participantTransport: "Participant transport",
        eventTransport: "Event transport",
        food: "Food",
        accommodation: "Accommodation (energy)",
      },
      footer:
        "Calculations by Copper8 based on the LCA (ReCiPe method).",
    },
    centerCard: {
      title: "Transport is the biggest lever",
      note: "Bicycle as a visual element for event/mobility.",
    },
    rightCard: {
      title: "Emissions excluding transport",
      subtitle: "Activity without mobility component",
      legend: {
        food: "Food",
        accommodation: "Accommodation (energy)",
        clothing: "Clothing",
      },
      footer: "Copper8",
    },
  },
};

type LangKey = keyof typeof baseTranslations;
type TranslationShape = (typeof baseTranslations)["nl"];

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export interface ClimateClassicModernPageProps {
  width?: number;
  height?: number;
  /** which language to render; if not provided, falls back to browser language (nl/en) */
  lang?: LangKey;
  /**
   * Optional overrides for any text in the template, per language.
   * Example:
   * {
   *   nl: { title: "Mijn aangepaste titel" },
   *   en: { info: { description: "Custom English copy" } }
   * }
   */
  texts?: Partial<Record<LangKey, DeepPartial<TranslationShape>>>;
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
    leftCard: { ...base.leftCard, ...(override.leftCard ?? {}) },
    centerCard: { ...base.centerCard, ...(override.centerCard ?? {}) },
    rightCard: { ...base.rightCard, ...(override.rightCard ?? {}) },
  };
}

const ClimateClassicModernPage: React.FC<ClimateClassicModernPageProps> = ({
  width,
  height,
  lang,
  texts,
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

  return (
    <div
      className="relative flex flex-col overflow-hidden"
      style={{
        width: "100%",
        height: "100%",
        background:
          "radial-gradient(circle at top, #f4f7fb 0%, #e3edf5 45%, #d7e3ee 100%)",
        maxWidth: width,
        maxHeight: height,
      }}
    >
      {/* Floating background accents */}
      <div className="pointer-events-none absolute -top-16 -left-10 w-60 h-60 bg-[#e6f1ff] rounded-full opacity-60 blur-3xl" />
      <div className="pointer-events-none absolute top-20 right-5 w-52 h-52 bg-[#ffe3e3] rounded-full opacity-60 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-[#d7e2f1] rounded-full opacity-30 blur-3xl" />

      {/* Top bar */}
      <header className="relative z-10 w-full px-8 pt-6 flex items-start justify-between gap-6">
        <div>
          <h1 className="text-[34px] font-bold text-[#062f53] leading-tight drop-shadow-sm">
            {t.title}
          </h1>
          <p className="text-sm text-slate-500 mt-1">{t.subtitle}</p>
        </div>

        {/* Hero metric card */}
        <div className="bg-white/90 backdrop-blur-md border border-white/70 rounded-2xl px-6 py-4 shadow-[0_20px_45px_rgba(15,23,42,0.08)] min-w-[290px]">
          <p className="text-sm text-[#c93334] font-semibold">
            {t.totalFootprint}
          </p>
          <p className="text-[30px] font-bold text-[#c93334] leading-none mt-1 tracking-tight">
            {t.totalFootprintEq}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex gap-[3px]">
              {Array.from({ length: 8 }).map((_, idx) => (
                <svg
                  key={idx}
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  fill="none"
                  stroke="#c93334"
                  strokeWidth="1.5"
                >
                  <path d="M4 11.5 12 5l8 6.5" />
                  <path d="M7 11V19h4v-4h2.5V19H18v-8" />
                </svg>
              ))}
            </div>
            <p className="text-[10.5px] text-[#c93334] italic">
              {t.householdsEq}
            </p>
          </div>
        </div>
      </header>

      {/* Top info bar */}
      <div className="relative z-10 w-full px-8 mt-4">
        <div className="w-full bg-white/80 backdrop-blur-md border border-white/70 rounded-2xl px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <p className="text-sm text-slate-600 max-w-[55rem] leading-relaxed">
            {t.info.description}
          </p>
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full bg-[#e3f1ff] text-[#062f53] text-xs font-semibold">
              {t.info.climateChip}
            </span>
            <span className="px-3 py-1 rounded-full bg-[#ffe1e1] text-[#c93334] text-xs font-semibold">
              {t.info.transportChip}
            </span>
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="relative z-10 w-full px-8 mt-3 flex gap-3 flex-wrap">
        <div className="px-3 py-2 bg-white/40 rounded-xl text-xs text-slate-500 border border-white/50">
          {t.kpis.largestShare}
          <span className="font-semibold text-[#c93334]">
            {t.kpis.largestValue}
          </span>
        </div>
        <div className="px-3 py-2 bg-white/40 rounded-xl text-xs text-slate-500 border border-white/50">
          {t.kpis.withoutTransport}
          <span className="font-semibold text-[#062f53]">
            {t.kpis.withoutValue}
          </span>
        </div>
        <div className="px-3 py-2 bg-white/40 rounded-xl text-xs text-slate-500 border border-white/50">
          {t.kpis.method}
          <span className="font-semibold">{t.kpis.methodValue}</span>
        </div>
      </div>

      {/* Main content */}
      <main className="relative z-10 flex-1 w-full px-8 pb-6 pt-4 overflow-hidden">
        <div className="w-full h-full grid grid-cols-1 xl:grid-cols-[1.05fr_0.8fr_1.05fr] gap-5">
          {/* Left card */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-white/70 shadow-[0_16px_40px_rgba(15,23,42,0.04)] p-6 flex flex-col">
            <div className="mb-3">
              <p className="text-[15px] font-semibold text-[#062f53]">
                {t.leftCard.title}
              </p>
              <p className="text-[11px] text-slate-400">
                {t.leftCard.subtitle}
              </p>
            </div>
            <div className="flex items-center gap-6 flex-1">
              {/* Donut */}
              <div className="relative w-[230px] h-[230px]">
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background:
                      "conic-gradient(#c93334 0% 51%, #f5a9b0 51% 93%, #dfe5ef 93% 98%, #7d93d1 98% 100%)",
                  }}
                />
                <div className="absolute inset-9 bg-white rounded-full" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-[11px] text-slate-400">totaal</p>
                  <p className="text-[13px] font-semibold text-[#062f53]">
                    incl. tr.
                  </p>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-col gap-4 text-[13px]">
                <div className="flex items-start gap-2">
                  <span className="mt-1 w-3 h-3 rounded-full bg-[#c93334]" />
                  <div>
                    <p className="font-semibold text-slate-700">
                      {t.leftCard.legend.participantTransport}
                    </p>
                    <p className="text-[11px] text-slate-500">51%</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 w-3 h-3 rounded-full bg-[#f5a9b0]" />
                  <div>
                    <p className="font-semibold text-slate-700">
                      {t.leftCard.legend.eventTransport}
                    </p>
                    <p className="text-[11px] text-slate-500">42%</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 w-3 h-3 rounded-full bg-[#dfe5ef]" />
                  <div>
                    <p className="font-semibold text-slate-700">
                      {t.leftCard.legend.food}
                    </p>
                    <p className="text-[11px] text-slate-500">5%</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 w-3 h-3 rounded-full bg-[#7d93d1]" />
                  <div>
                    <p className="font-semibold text-slate-700">
                      {t.leftCard.legend.accommodation}
                    </p>
                    <p className="text-[11px] text-slate-500">2%</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-6">
              {t.leftCard.footer}
            </p>
          </div>

          {/* Center card */}
          <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-[0_16px_40px_rgba(15,23,42,0.02)] p-6 flex flex-col items-center justify-center gap-4">
            <p className="text-[13px] text-slate-500">
              {t.centerCard.title}
            </p>
            <svg
              viewBox="0 0 500 200"
              className="w-full max-w-[320px] h-[140px]"
              fill="none"
              stroke="#c1c8d0"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="130" cy="120" r="55" />
              <circle cx="370" cy="120" r="55" />
              <line x1="130" y1="120" x2="230" y2="55" />
              <line x1="230" y1="55" x2="350" y2="55" />
              <line x1="350" y1="55" x2="370" y2="120" />
              <line x1="230" y1="55" x2="260" y2="135" />
              <line x1="260" y1="135" x2="370" y2="120" />
              <line x1="260" y1="135" x2="130" y2="120" />
              <line x1="350" y1="55" x2="385" y2="30" />
            </svg>
            <p className="text-[11px] text-slate-400 text-center max-w-[190px]">
              {t.centerCard.note}
            </p>
          </div>

          {/* Right card */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-white/70 shadow-[0_16px_40px_rgba(15,23,42,0.04)] p-6 flex flex-col">
            <div className="mb-3">
              <p className="text-[15px] font-semibold text-[#062f53] text-right xl:text-left">
                {t.rightCard.title}
              </p>
              <p className="text-[11px] text-slate-400 text-right xl:text-left">
                {t.rightCard.subtitle}
              </p>
            </div>
            <div className="flex items-center gap-6 flex-1 justify-end xl:justify-start">
              {/* Donut */}
              <div className="relative w-[230px] h-[230px]">
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    background:
                      "conic-gradient(#062f53 0% 73%, #3c6ca8 73% 97%, #d5e0ee 97% 100%)",
                  }}
                />
                <div className="absolute inset-9 bg-white rounded-full" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <p className="text-[11px] text-slate-400">totaal</p>
                  <p className="text-[13px] font-semibold text-[#062f53]">
                    excl. tr.
                  </p>
                </div>
              </div>
              {/* Legend */}
              <div className="flex flex-col gap-4 text-[13px]">
                <div className="flex items-start gap-2">
                  <span className="mt-1 w-3 h-3 rounded-full bg-[#062f53]" />
                  <div>
                    <p className="font-semibold text-slate-700">
                      {t.rightCard.legend.food}
                    </p>
                    <p className="text-[11px] text-slate-500">73%</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 w-3 h-3 rounded-full bg-[#3c6ca8]" />
                  <div>
                    <p className="font-semibold text-slate-700">
                      {t.rightCard.legend.accommodation}
                    </p>
                    <p className="text-[11px] text-slate-500">24%</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 w-3 h-3 rounded-full bg-[#d5e0ee]" />
                  <div>
                    <p className="font-semibold text-slate-700">
                      {t.rightCard.legend.clothing}
                    </p>
                    <p className="text-[11px] text-slate-500">3%</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-6 text-right">
              {t.rightCard.footer}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClimateClassicModernPage;


