// src/EnergyDashboard.jsx
import React, { useEffect, useState } from "react";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// separate data/options file
import {
  SUMMARY_CARD_DATA,
  ENERGY_TRENDS,
  REVENUE_TRENDS,
  chartOptions,
  fetchLiveDashboardData,
} from "./dashboardData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
);

/* ------------------------ small chart for summary ------------------------ */
const smallLineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    // enable tooltip so hover will show properly
    tooltip: {
      enabled: true,
      backgroundColor: "rgba(0,0,0,0.75)",
      titleFont: { size: 10, weight: "600", family: "Inter, system-ui, sans-serif" },
      bodyFont: { size: 10, family: "Inter, system-ui, sans-serif" },
      padding: 6,
      displayColors: false,
    },
  },
  animation: {
    duration: 1400,
    easing: "easeInOutCubic",
  },
  scales: { x: { display: false }, y: { display: false } },
};
const makeSummaryLine = (vals) => ({
  labels: vals.map((_, i) => `P${i + 1}`),
  datasets: [
    {
      data: vals,
      backgroundColor: "rgba(118,111,208,0.28)",
      borderColor: "#766fd0",
      fill: true,
      tension: 0.45,
      pointRadius: 0,
    },
  ],
});

/* ------------------------ small reusable card ------------------------ */
const SummaryMetricCard = ({ title, subtitle, value, subvalue, chart }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.4 }}
    className="bg-white rounded-[20px] p-6 flex flex-col transition-all duration-200 hover:shadow-lg hover:-translate-y-[3px] cursor-pointer"
  >
    <div className="flex justify-between mb-4">
      <div>
        <p className="text-[15px] text-gray-700 leading-tight">{title}</p>
        <p className="text-[12px] text-gray-400">{subtitle}</p>
      </div>
      <div className="w-9 h-9 rounded-xl bg-[#ece4ff] flex items-center justify-center text-[16px] text-[#766fd0]">
        {/* use an icon-like symbol */}
        📄
      </div>
    </div>
    <p className="text-[26px] font-semibold text-gray-900 leading-tight mb-1 tracking-tight">{value}</p>
    {subvalue ? <p className="text-[12.5px] text-gray-500 mb-4">{subvalue}</p> : null}
    <div className="h-[70px] mt-auto">{chart}</div>
  </motion.div>
);

/* ------------------------ animated arrows between devices ------------------------ */
const AnimatedArrow = ({ direction = "right" }) => (
  <motion.span
    className="text-gray-400 text-[38px] select-none"
    animate={{
      opacity: [0.35, 1, 0.35],
      x: direction === "right" ? [0, 10, 0] : [0, -10, 0],
    }}
    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
  >
    {direction === "right" ? "→" : "←"}
  </motion.span>
);

/* ------------------------ tiny alarm pill ------------------------ */
const AlarmPill = ({ color, label, value }) => (
  <div className="flex items-center gap-2">
    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
    <span className="text-gray-600 text-[12.5px]">{label}</span>
    <span className="text-gray-900 text-[12.5px] font-medium">{value}</span>
  </div>
);

const EnergyDashboard = () => {
  const [screen, setScreen] = useState(0);
  const [energyTab, setEnergyTab] = useState("month");
  const [revenueTab, setRevenueTab] = useState("month");
  const [liveData, setLiveData] = useState(null);

  // 10s first page, 20s second page
  useEffect(() => {
    const t = setTimeout(() => setScreen((p) => (p === 0 ? 1 : 0)), screen === 0 ? 10000 : 20000);
    return () => clearTimeout(t);
  }, [screen]);

  // auto cycle on second screen
  useEffect(() => {
    if (screen !== 1) return;
    const eOrder = ["day", "month", "year", "lifetime"];
    const rOrder = ["month", "year", "lifetime"];
    const int = setInterval(() => {
      setEnergyTab((prev) => eOrder[(eOrder.indexOf(prev) + 1) % eOrder.length]);
      setRevenueTab((prev) => rOrder[(rOrder.indexOf(prev) + 1) % rOrder.length]);
    }, 4000);
    return () => clearInterval(int);
  }, [screen]);

  // fetch live
  useEffect(() => {
    (async () => {
      const data = await fetchLiveDashboardData();
      if (data) setLiveData(data);
    })();
  }, []);

  const { energyTrendOptions, revenueTrendOptions } = chartOptions;

  const TabPill = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={
        active
          ? "px-3 py-1 rounded-md bg-[#0f62fe] text-white text-[12px] tab-pulse shadow-sm"
          : "px-3 py-1 rounded-md bg-slate-100 text-gray-600 text-[12px] hover:bg-slate-200 transition-colors"
      }
    >
      {children}
    </button>
  );

  return (
    <>
      <style>{`
        @keyframes tabFlash {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .tab-pulse { animation: tabFlash .35s ease-out; }
      `}</style>

      <div
        className="w-screen h-screen bg-[#dfe3e7] overflow-hidden"
        style={{
          fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <div className="w-full h-full max-w-[1920px] mx-auto flex flex-col gap-4 py-4 px-4">
          {screen === 0 ? (
            <>
              {/* logo (no white bg) */}
              <div className="px-1 py-1 shrink-0">
                <img
                  src="/assets/logo.png"
                  alt="logo"
                  className="w-[58px] h-[58px] rounded-full object-contain shadow-sm"
                />
              </div>

              {/* summary grid */}
              <div className="grid grid-cols-3 grid-rows-2 gap-4 flex-1 min-h-0">
                {SUMMARY_CARD_DATA.map((card) => (
                  <SummaryMetricCard
                    key={card.id}
                    title={card.title}
                    subtitle={card.subtitle}
                    value={liveData?.summary?.[card.id]?.value || card.value}
                    subvalue={liveData?.summary?.[card.id]?.subvalue || card.subvalue}
                    chart={<Line data={makeSummaryLine(card.spark)} options={smallLineOptions} />}
                  />
                ))}
                {/* doughnut card */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-[20px] p-6 flex flex-col transition-all hover:shadow-lg hover:-translate-y-[3px] cursor-pointer"
                >
                  <div className="flex justify-between mb-4">
                    <div>
                      <p className="text-[15px] text-gray-700">Energy Produced &amp; Injected</p>
                      <p className="text-[12px] text-gray-400">Year to date</p>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-[#ece4ff] flex items-center justify-center text-[16px] text-[#766fd0]">
                      📊
                    </div>
                  </div>
                  <div className="flex-1 min-h-0">
                    <Doughnut
                      data={{
                        labels: ["Auto Consumed", "Injected"],
                        datasets: [
                          { data: [68, 32], backgroundColor: ["#766fd0", "#35bfd0"], borderWidth: 0 },
                        ],
                      }}
                      options={{
                        maintainAspectRatio: false,
                        animation: { animateRotate: true, animateScale: true, duration: 1200 },
                        plugins: { legend: { display: false } },
                      }}
                    />
                  </div>
                  <div className="flex justify-center gap-4 mt-3 text-[11.5px] text-gray-500">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#766fd0]" /> Auto Consumed
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#35bfd0]" /> Injected
                    </div>
                  </div>
                </motion.div>
                {/* trees card */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.35 }}
                  className="bg-white rounded-[20px] p-6 flex flex-col transition-all hover:shadow-lg hover:-translate-y-[3px] cursor-pointer"
                >
                  <p className="text-[15px] text-gray-700">Total Trees Equivalent</p>
                  <p className="text-[12px] text-gray-400 mb-4">Year to date</p>
                  <div className="flex gap-10 mb-6">
                    <div>
                      <p className="text-[23px] font-semibold text-gray-900">6.54</p>
                      <p className="text-[12px] text-gray-400">Trees</p>
                    </div>
                    <div>
                      <p className="text-[23px] font-semibold text-gray-900">215.83</p>
                      <p className="text-[12px] text-gray-400">kgCO₂eq</p>
                    </div>
                  </div>
                  <div className="flex gap-5 items-end mt-auto">
                    <img src="/assets/tree.png" alt="Tree" className="w-[78px] h-[78px]" />
                    <img src="/assets/tree.png" alt="Tree" className="w-[78px] h-[78px]" />
                    <img src="/assets/tree.png" alt="Tree" className="w-[78px] h-[78px]" />
                  </div>
                </motion.div>
              </div>
            </>
          ) : (
            <>
              {/* logo (no bg) */}
              <div className="px-1 py-1 shrink-0">
                <img
                  src="/assets/logo.png"
                  alt="logo"
                  className="w-[58px] h-[58px] rounded-full object-contain shadow-sm"
                />
              </div>

              {/* main 2-column layout */}
              <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
                {/* LEFT COLUMN */}
                <div className="flex flex-col h-full gap-4 min-h-0">
                  {/* 20% top block */}
                  <div
                    style={{ flexBasis: "20%", minHeight: 0 }}
                    className="h-full bg-white rounded-[20px] px-[2.5rem] py-4 flex flex-col justify-center transition-all hover:shadow-md"
                  >
                    <div className="flex gap-8 flex-wrap">
                      {[
                        ["189.03", "kWh", "Yield today"],
                        ["25.48", "€", "Revenue today"],
                        ["462.43", "kWh", "Total yield"],
                        ["220.00", "kW", "Inverter rated power"],
                        ["19.00", "kWh", "Supply from grid today"],
                      ].map(([v, u, l]) => (
                        <div key={l}>
                          <p className="text-[21px] font-semibold text-gray-900">
                            {v} <span className="text-[12px] text-gray-400">{u}</span>
                          </p>
                          <p className="text-[12.5px] text-gray-500">{l}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 50% middle flow block */}
                  <div
                    style={{ flexBasis: "50%", minHeight: 0 }}
                    className="h-full bg-white rounded-[20px] px-6 py-4 flex flex-col gap-3 transition-all hover:shadow-md"
                  >
                    <div className="flex gap-6 flex-wrap">
                      <AlarmPill color="#f44336" label="Critical" value="0" />
                      <AlarmPill color="#ff9800" label="Major" value="0" />
                      <AlarmPill color="#ffc107" label="Minor" value="0" />
                      <AlarmPill color="#1976d2" label="Warning" value="4" />
                    </div>
                    <div className="flex-1 flex items-center justify-between pb-2">
                      <motion.div
                        initial={{ y: 12, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.45 }}
                        className="flex flex-col items-center gap-2"
                      >
                        <motion.img
                          src="/assets/grid.png"
                          alt="Grid"
                          className="w-[118px] h-[118px] object-contain"
                          animate={{ y: [0, -7, 0] }}
                          transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                        />
                        <p className="text-[13px] text-gray-500">Grid</p>
                        <p className="text-[15.5px] font-semibold text-gray-900">3.530 kW</p>
                        <p className="text-[11.5px] text-gray-400">Current power</p>
                      </motion.div>
                      <AnimatedArrow direction="right" />
                      <motion.div
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.45, delay: 0.12 }}
                        className="flex flex-col items-center gap-2"
                      >
                        <motion.img
                          src="/assets/inverter.png"
                          alt="Load"
                          className="w-[118px] h-[118px] object-contain"
                          animate={{ rotate: [0, 1.6, 0, -1.6, 0] }}
                          transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
                        />
                        <p className="text-[13px] text-gray-500">Load</p>
                        <p className="text-[15.5px] font-semibold text-gray-900">7.077 kW</p>
                        <p className="text-[11.5px] text-gray-400">Consumption power</p>
                      </motion.div>
                      <AnimatedArrow direction="left" />
                      <motion.div
                        initial={{ y: -12, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.45, delay: 0.22 }}
                        className="flex flex-col items-center gap-2"
                      >
                        <motion.img
                          src="/assets/pv.png"
                          alt="PV"
                          className="w-[118px] h-[118px] object-contain"
                          animate={{ scale: [1, 1.048, 1] }}
                          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                        />
                        <p className="text-[13px] text-gray-500">PV</p>
                        <p className="text-[15.5px] font-semibold text-gray-900">3.547 kW</p>
                        <p className="text-[11.5px] text-gray-400">Output power</p>
                      </motion.div>
                    </div>
                  </div>

                  {/* bottom block */}
                  <div style={{ flexBasis: "26%", minHeight: 0 }} className="flex flex-col h-full">
                    <p className="text-[14px] font-medium text-gray-700 mb-2">Environmental Benefits</p>
                    <div className="bg-white rounded-[20px] px-6 py-3 flex items-center gap-10 flex-1 transition-all hover:shadow-md">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-[#e6f7ed] flex items-center justify-center">
                          <span className="text-[20px] text-green-600">✔</span>
                        </div>
                        <div>
                          <p className="text-[16px] font-semibold text-gray-900">
                            184.97 <span className="text-[12px] text-gray-400">tons</span>
                          </p>
                          <p className="text-[11.5px] text-gray-500">Standard coal saved</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-[#eaf1ff] flex items-center justify-center">
                          <span className="text-[20px] text-[#3b82f6]">🏢</span>
                        </div>
                        <div>
                          <p className="text-[16px] font-semibold text-gray-900">
                            219.65 <span className="text-[12px] text-gray-400">tons</span>
                          </p>
                          <p className="text-[11.5px] text-gray-500">CO₂ avoided</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-[#def7e0] flex items-center justify-center">
                          <span className="text-[20px]">✨</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-[16px] font-semibold text-gray-900">301</p>
                            <p className="text-[11.5px] text-gray-500">Equivalent trees planted</p>
                          </div>
                          <div className="flex gap-1">
                            <img src="/assets/tree.png" alt="Tree" className="w-7 h-7" />
                            <img src="/assets/tree.png" alt="Tree" className="w-7 h-7" />
                            <img src="/assets/tree.png" alt="Tree" className="w-7 h-7" />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1" />
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="flex flex-col h-full gap-4 min-h-0">
                  {/* energy trend */}
                  <div className="bg-white rounded-[20px] px-5 pt-4 pb-3 flex flex-col flex-1 min-h-0 transition-all hover:shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[15px] font-medium text-gray-700">Energy Trend</p>
                      <div className="flex gap-2">
                        <TabPill active={energyTab === "day"} onClick={() => setEnergyTab("day")}>
                          Day
                        </TabPill>
                        <TabPill active={energyTab === "month"} onClick={() => setEnergyTab("month")}>
                          Month
                        </TabPill>
                        <TabPill active={energyTab === "year"} onClick={() => setEnergyTab("year")}>
                          Year
                        </TabPill>
                        <TabPill active={energyTab === "lifetime"} onClick={() => setEnergyTab("lifetime")}>
                          Lifetime
                        </TabPill>
                      </div>
                    </div>
                    <p className="text-[11.5px] text-gray-500 mb-2">
                      Yield: <span className="text-gray-800 font-medium">189.03 kWh</span> · Consumption:{" "}
                      <span className="text-gray-800 font-medium">29.03 kWh</span>
                    </p>
                    <div className="flex-1 min-h-0">
                      <Line data={ENERGY_TRENDS[energyTab]} options={energyTrendOptions} />
                    </div>
                  </div>

                  {/* revenue trend */}
                  <div className="bg-white rounded-[20px] px-5 pt-4 pb-3 flex flex-col flex-1 min-h-0 transition-all hover:shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[15px] font-medium text-gray-700">Revenue Trend</p>
                      <div className="flex gap-2">
                        <TabPill active={revenueTab === "month"} onClick={() => setRevenueTab("month")}>
                          Month
                        </TabPill>
                        <TabPill active={revenueTab === "year"} onClick={() => setRevenueTab("year")}>
                          Year
                        </TabPill>
                        <TabPill active={revenueTab === "lifetime"} onClick={() => setRevenueTab("lifetime")}>
                          Lifetime
                        </TabPill>
                      </div>
                    </div>
                    <p className="text-[11.5px] text-gray-500 mb-2">
                      Total revenue: <span className="text-gray-800 font-medium">2.03K €</span>
                    </p>
                    <div className="flex-1 min-h-0">
                      <Bar data={REVENUE_TRENDS[revenueTab]} options={revenueTrendOptions} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default EnergyDashboard;
