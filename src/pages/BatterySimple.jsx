// src/pages/BatterySimple.jsx
import React, { useEffect, useState } from "react";

const W = 900;
const H = 520;

/* ----------------------------- translations ----------------------------- */
const i18n = {
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

const BatterySimple = () => {
  const [{ scale, width, height }, setView] = useState({
    scale: 1,
    width: W,
    height: H,
  });

  // Determine language (EN if navigator starts with 'en', otherwise NL)
  const lang =
    typeof navigator !== "undefined" &&
    navigator.language &&
    navigator.language.toLowerCase().startsWith("en")
      ? "en"
      : "nl";
  const t = i18n[lang];

  useEffect(() => {
    const onResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const scaleX = vw / W;
      const scaleY = vh / H;
      const s = Math.max(scaleX, scaleY);

      const newWidth = vw / s;
      const newHeight = vh / s;

      setView({
        scale: s,
        width: newWidth,
        height: newHeight,
      });
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="w-screen h-screen bg-slate-900 overflow-hidden">
      <div
        className="relative bg-slate-950 text-slate-50 border border-slate-800"
        style={{
          width: width,
          height: height,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <div className="flex h-full">
          {/* image side */}
          <div className="w-[40%] h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
            {/* inline battery drawing */}
            <div className="w-28 h-18">
              <div className="w-20 h-28 bg-slate-100/10 border border-slate-200/40 rounded-xl relative flex items-center justify-center">
                <div className="w-6 h-2 bg-slate-200/40 rounded absolute -top-2 left-1/2 -translate-x-1/2" />
                <span className="text-[10px] text-slate-100/80">
                  {t.batteryFace}
                </span>
              </div>
            </div>
          </div>
          {/* content side */}
          <div className="flex-1 p-7 flex flex-col gap-4">
            <div>
              <p className="text-[11px] text-slate-300 mb-1">{t.badge}</p>
              <h1 className="text-2xl font-semibold">{t.title}</h1>
              <p className="text-[11.5px] text-slate-200/80 mt-1">{t.desc}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-3">
                <p className="text-slate-300">{t.specs.capacity}</p>
                <p className="text-sm font-semibold">{t.values.capacity}</p>
              </div>
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-3">
                <p className="text-slate-300">{t.specs.coupling}</p>
                <p className="text-sm font-semibold">{t.values.coupling}</p>
              </div>
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-3">
                <p className="text-slate-300">{t.specs.mounting}</p>
                <p className="text-sm font-semibold">{t.values.mounting}</p>
              </div>
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-3">
                <p className="text-slate-300">{t.specs.usecase}</p>
                <p className="text-sm font-semibold">{t.values.usecase}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-auto">
              <button className="bg-emerald-400 text-slate-950 text-xs px-4 py-2 rounded-lg font-medium hover:bg-emerald-300">
                {t.cta}
              </button>
              <button className="text-xs text-slate-200/70 hover:text-white">
                {t.datasheet}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatterySimple;
