// pages/BatteryForSolarPage.tsx
// Description:
//   A redesigned version of the battery‑for‑solar template.  It uses a
//   responsive layout that fills its container (100% width and height) and
//   applies a soft radial gradient backdrop with coloured floating shapes.
//   The component exposes optional props for width, height, language and
//   future API integration.  If apiConfig.enabled is true and an endpoint
//   string is supplied, a small note will appear beneath the body text.

import React from "react";

// Translation dictionaries.  Dutch and English share the same base content
// here.  Additional languages or overrides can be passed via the `texts`
// prop.  See the ClimateClassicModernPage for an example of deep overrides.
const translations = {
  nl: {
    title: "Batterijen voor zonnepanelen",
    subtitle: "Voorbeeldpagina voor batterijopslag gekoppeld aan zonnepanelen.",
    description:
      "Vervang deze placeholder door echte inhoud van uw product of oplossing.",
  },
  en: {
    title: "Batteries for solar panels",
    subtitle: "Sample page for battery storage connected to solar panels.",
    description:
      "Replace this placeholder with real content about your product or solution.",
  },
};

type LangKey = keyof typeof translations;
type TranslationShape = (typeof translations)["nl"];

// Utility type allowing partial overrides of nested translation objects.
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export interface BatteryForSolarPageProps {
  /** Optional maximum width to constrain the layout */
  width?: number;
  /** Optional maximum height to constrain the layout */
  height?: number;
  /** Active language for translations ("nl" or "en").  Defaults based on navigator */
  lang?: LangKey;
  /** Optional deep overrides for translation strings */
  texts?: Partial<Record<LangKey, DeepPartial<TranslationShape>>>;
  /** Future API configuration.  When enabled and a non‑empty endpoint is provided,
   *  a note is displayed indicating that data is sourced from an API. */
  apiConfig?: {
    enabled?: boolean;
    endpoint?: string;
  };
}

// Helper to merge a base translation object with any overrides.  The merge is
// shallow for this component because the translation objects are flat.
function mergeLang(
  base: TranslationShape,
  override?: DeepPartial<TranslationShape>
): TranslationShape {
  if (!override) return base;
  return { ...base, ...override };
}

const BatteryForSolarPage: React.FC<BatteryForSolarPageProps> = ({
  width,
  height,
  lang,
  texts,
  apiConfig,
}) => {
  // Determine default language from browser if none supplied
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

  const base = translations[activeLang];
  const overrides = (texts?.[activeLang] ?? {}) as DeepPartial<TranslationShape>;
  const t = mergeLang(base, overrides);

  const usingApi =
    !!apiConfig?.enabled && !!apiConfig?.endpoint && apiConfig.endpoint.trim();

  return (
    <div
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{
        width: "100%",
        height: "100%",
        background:
          "radial-gradient(circle at top, #f3e8ff 0%, #e5d4ff 45%, #dcd4ee 100%)",
        maxWidth: width,
        maxHeight: height,
      }}
    >
      {/* Floating accent shapes for depth and visual interest */}
      <div className="pointer-events-none absolute -top-16 -left-10 w-64 h-64 bg-[#e0c9ff] rounded-full opacity-60 blur-3xl" />
      <div className="pointer-events-none absolute top-20 right-5 w-52 h-52 bg-[#fde2ff] rounded-full opacity-60 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-[#d9d0ff] rounded-full opacity-30 blur-3xl" />

      {/* Main content card */}
      <div className="relative z-10 bg-white/90 backdrop-blur border border-white/70 rounded-2xl shadow-xl p-6 max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-[#4a2d71] mb-3">{t.title}</h1>
        <p className="text-lg text-[#6b4d8f] mb-4">{t.subtitle}</p>
        <p className="text-base text-[#7e5a9b]">{t.description}</p>
        {usingApi && (
          <p className="mt-3 text-xs italic text-[#8560a8]">
            Data source: API ({apiConfig?.endpoint})
          </p>
        )}
      </div>
    </div>
  );
};

export default BatteryForSolarPage;