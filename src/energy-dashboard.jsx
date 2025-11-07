// src/EnergyDashboard.jsx
import React, { useEffect, useState } from "react";
import { Line, Doughnut, Bar } from "react-chartjs-2";
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

// ---------- common tiny line for 1st screen ----------
const smallLineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
  scales: {
    x: { display: false },
    y: { display: false },
  },
};

const makeSummaryLine = (vals) => ({
  labels: vals.map((_, i) => `P${i + 1}`),
  datasets: [
    {
      data: vals,
      backgroundColor: "rgba(137,126,225,0.28)",
      borderColor: "#766fd0",
      tension: 0.4,
      pointRadius: 0,
      fill: true,
    },
  ],
});

// ---------- 2nd screen charts like screenshot ----------
const energyTrendData = {
  labels: [
    "00:00",
    "02:00",
    "04:00",
    "06:00",
    "08:00",
    "10:00",
    "12:00",
    "14:00",
    "16:00",
    "18:00",
    "20:00",
    "22:00",
  ],
  datasets: [
    {
      label: "PV output",
      data: [0, 0, 15, 55, 95, 130, 160, 150, 120, 80, 35, 0],
      borderColor: "#2dad5c",
      backgroundColor: "rgba(45,173,92,0.3)",
      tension: 0.4,
      fill: true,
    },
    {
      label: "Power from grid",
      data: [35, 38, 40, 44, 47, 50, 52, 50, 48, 44, 41, 38],
      borderColor: "#565e64",
      backgroundColor: "rgba(86,94,100,0.1)",
      tension: 0.4,
      fill: false,
    },
    {
      label: "Consumption power",
      data: [42, 45, 48, 60, 72, 90, 108, 105, 100, 90, 75, 65],
      borderColor: "#d9534f",
      backgroundColor: "rgba(217,83,79,0.1)",
      tension: 0.4,
      fill: false,
    },
  ],
};

const energyTrendOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "bottom", labels: { boxWidth: 10 } },
  },
  scales: {
    x: {
      ticks: { font: { size: 9 } },
      grid: { display: false },
    },
    y: {
      beginAtZero: true,
      ticks: { font: { size: 9 } },
      grid: { color: "rgba(0,0,0,0.03)" },
    },
  },
};

const revenueTrendData = {
  labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
  datasets: [
    {
      label: "PV Benefit",
      data: [
        60, 90, 120, 110, 150, 130, 180, 100, 90, 140,
        170, 160, 180, 120, 140, 150, 130, 160, 120, 150,
        110, 130, 150, 100, 90, 120, 140, 130, 95, 100,
      ],
      backgroundColor: "#f4b000",
      borderRadius: 4,
    },
  ],
};

const revenueTrendOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { ticks: { font: { size: 8 } }, grid: { display: false } },
    y: { beginAtZero: true, ticks: { font: { size: 8 } } },
  },
};

// ---------- 1st screen cards ----------
const TopCard = ({ title, value, euro, chartData }) => (
  <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col">
    <div className="flex justify-between items-start mb-3">
      <div>
        <p className="text-[12px] text-gray-500">{title}</p>
        <p className="text-[10px] text-gray-400">Year to date</p>
      </div>
      <div className="w-8 h-8 rounded-lg bg-[#f0eefe] flex items-center justify-center text-xs text-[#766fd0]">
        📄
      </div>
    </div>
    <p className="text-lg font-semibold text-gray-900">{value}</p>
    <p className="text-[11px] text-gray-500 mb-2">{euro}</p>
    <div className="h-[60px] mt-auto">
      <Line data={chartData} options={smallLineOptions} />
    </div>
  </div>
);

const ProducedCard = () => {
  const chartData = makeSummaryLine([4, 4.1, 4.4, 4.6, 4.9, 5.1, 5.2]);
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-[12px] text-gray-500">Total Energy Produced</p>
          <p className="text-[10px] text-gray-400">Year to date</p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-[#fff4d8] flex items-center justify-center">
          ☀️
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div>
          <p className="text-[12px] font-semibold text-gray-900">4,001.32</p>
          <p className="text-[10px] text-gray-400">kWh</p>
          <p className="text-[10px] text-gray-400">390.53 €</p>
          <p className="text-[10px] text-gray-400">Total Saved</p>
        </div>
        <div>
          <p className="text-[12px] font-semibold text-gray-900">1,240.41</p>
          <p className="text-[10px] text-gray-400">kWh</p>
          <p className="text-[10px] text-gray-400">86.83 €</p>
          <p className="text-[10px] text-gray-400">Total Injected</p>
        </div>
        <div>
          <p className="text-[12px] font-semibold text-gray-900">2,760.91</p>
          <p className="text-[10px] text-gray-400">kWh</p>
          <p className="text-[10px] text-gray-400">303.70 €</p>
          <p className="text-[10px] text-gray-400">Total Auto</p>
        </div>
      </div>
      <div className="h-[50px] mt-auto">
        <Line data={chartData} options={smallLineOptions} />
      </div>
    </div>
  );
};

const TreeCard = () => (
  <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col">
    <p className="text-[12px] text-gray-500">Total Trees Equivalent</p>
    <p className="text-[10px] text-gray-400 mb-3">Year to date</p>
    <div className="flex gap-6 mb-4">
      <div>
        <p className="text-lg font-semibold text-gray-900">6.54</p>
        <p className="text-[11px] text-gray-400">Trees</p>
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900">215.83</p>
        <p className="text-[11px] text-gray-400">kgCO₂eq</p>
      </div>
    </div>
    <div className="flex gap-3 mt-auto">
      {[0, 1, 2].map((i) => (
        <div
            key={i}
            className="w-16 h-16 bg-[#e6f5e8] rounded-2xl flex items-center justify-center"
        >
          <img src="/assets/tree.png" alt="Tree" className="w-10 h-10 object-contain" />
        </div>
      ))}
    </div>
  </div>
);

// asset boxes in energy flow
const EnergyBlock = ({ color, label, value }) => (
  <div className="flex flex-col items-center gap-2">
    <div
      className="w-20 h-20 rounded-lg flex items-center justify-center text-white text-2xl"
      style={{ backgroundColor: color }}
    >
      –
    </div>
    <div className="text-center leading-tight">
      <p className="text-[11px] text-gray-500">{label}</p>
      <p className="text-[12px] font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

const EnergyDashboard = () => {
  const [screen, setScreen] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setScreen((prev) => (prev === 0 ? 1 : 0));
    }, 7000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="w-screen h-screen bg-[#dcdde1] flex items-center justify-center overflow-hidden">
      <div className="relative w-[1280px] h-[720px] bg-[#e7eaee] rounded-xl shadow-md overflow-hidden">
        {screen === 0 ? (
          // --------------- SCREEN 1 (6 cards) ---------------
          <div className="absolute inset-0 p-6 flex flex-col bg-[#e7eaee]">
            <div className="mb-4">
              <img src="/assets/logo.png" alt="logo" className="w-12 h-12 rounded-full" />
            </div>
            <div className="grid grid-cols-3 grid-rows-2 gap-4 flex-1 min-h-0">
              <TopCard
                title="Total Energy Consumed"
                value="21,446.67 kWh"
                euro="1,179.90 €"
                chartData={makeSummaryLine([8, 8.2, 8.4, 9, 10, 11, 11.2])}
              />
              <TopCard
                title="Total Electricity Consumed"
                value="3,304.51 kWh"
                euro="363.50 €"
                chartData={makeSummaryLine([3, 3.1, 3.5, 3.6, 3.8, 3.9, 4])}
              />
              <TopCard
                title="Total Gas Consumed"
                value="18,142.16 kWh"
                euro="816.40 €"
                chartData={makeSummaryLine([7.2, 7.5, 7.4, 7.9, 8.1, 8.3, 8.7])}
              />
              <ProducedCard />
              <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-[12px] text-gray-500">Energy Produced &amp; Injected</p>
                    <p className="text-[10px] text-gray-400">Year to date</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-[#f0eefe] flex items-center justify-center text-xs text-[#766fd0]">
                    📊
                  </div>
                </div>
                <div className="flex-1 min-h-0">
                  <Doughnut
                    data={{
                      labels: ["Auto Consumed", "Injected"],
                      datasets: [
                        {
                          data: [60, 40],
                          backgroundColor: ["#766fd0", "#35bfd0"],
                          borderWidth: 0,
                        },
                      ],
                    }}
                    options={{
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                    }}
                  />
                </div>
                <div className="flex justify-center gap-4 mt-2 text-[10px] text-gray-500">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#766fd0]" /> Auto Consumed
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#35bfd0]" /> Injected
                  </div>
                </div>
              </div>
              <TreeCard />
            </div>
          </div>
        ) : (
          // --------------- SCREEN 2 (MATCH TEMPLATE) ---------------
          <div className="absolute inset-0 p-6 flex flex-col gap-3 bg-[#e7eaee]">
            {/* top bar */}
            <div className="bg-white rounded-2xl px-5 py-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <img src="/assets/logo.png" alt="logo" className="w-11 h-11 rounded-full" />
                <div>
                  <p className="text-[11px] text-gray-400">Real-time view</p>
                  <p className="text-base font-semibold text-gray-800">
                    Solar Monitoring Dashboard
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                {[
                  ["189.03", "kWh", "Yield today"],
                  ["25.48", "€", "Revenue today"],
                  ["462.43", "MWh", "Total yield"],
                  ["220.00", "kW", "Inverter rated power"],
                  ["19.00", "kWh", "Supply from grid"],
                ].map(([val, unit, label]) => (
                  <div key={label} className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {val} <span className="text-xs text-gray-400">{unit}</span>
                    </p>
                    <p className="text-[11px] text-gray-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* status row */}
            <div className="flex gap-5 text-[12px]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#f44336] rounded-full" />
                <span className="text-gray-500">Critical</span>
                <span className="text-gray-900">0</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#ff9800] rounded-full" />
                <span className="text-gray-500">Major</span>
                <span className="text-gray-900">0</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#ffc107] rounded-full" />
                <span className="text-gray-500">Minor</span>
                <span className="text-gray-900">0</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#1976d2] rounded-full" />
                <span className="text-gray-500">Warning</span>
                <span className="text-gray-900">4</span>
              </div>
            </div>

            {/* middle content */}
            <div className="flex gap-4 flex-1 min-h-0">
              {/* left big energy flow */}
              <div className="bg-white rounded-2xl shadow-sm p-5 flex-1 flex flex-col">
                <p className="text-sm font-medium text-gray-700 mb-6">Energy flow</p>
                <div className="flex items-center gap-10">
                  <EnergyBlock color="#0d9488" label="Grid" value="3.530 kW" />
                  <span className="text-gray-400 text-xl">→</span>
                  <EnergyBlock color="#795548" label="Load" value="7.077 kW" />
                  <span className="text-gray-400 text-xl">←</span>
                  <EnergyBlock color="#0f9cf5" label="PV" value="3.547 kW" />
                </div>
              </div>

              {/* right column: energy trend + revenue */}
              <div className="flex flex-col gap-4 w-[470px]">
                <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700">Energy Trend</p>
                    <div className="flex gap-1 text-[10px]">
                      <span className="px-2 py-[2px] bg-[#0f62fe] text-white rounded-md">Day</span>
                      <span className="px-2 py-[2px] bg-slate-100 text-gray-500 rounded-md">
                        Month
                      </span>
                      <span className="px-2 py-[2px] bg-slate-100 text-gray-500 rounded-md">
                        Year
                      </span>
                      <span className="px-2 py-[2px] bg-slate-100 text-gray-500 rounded-md">
                        Lifetime
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500 mb-1">
                    Yield: <span className="text-gray-700 font-medium">189.03 kWh</span> ·
                    Consumption: <span className="text-gray-700 font-medium">29.03 kWh</span>
                  </p>
                  <div className="h-[190px]">
                    <Line data={energyTrendData} options={energyTrendOptions} />
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700">Revenue Trend</p>
                    <div className="flex gap-1 text-[10px]">
                      <span className="px-2 py-[2px] bg-[#0f62fe] text-white rounded-md">
                        Month
                      </span>
                      <span className="px-2 py-[2px] bg-slate-100 text-gray-500 rounded-md">
                        Year
                      </span>
                      <span className="px-2 py-[2px] bg-slate-100 text-gray-500 rounded-md">
                        Lifetime
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500 mb-1">
                    Total revenue: <span className="font-medium text-gray-700">2.03K €</span>
                  </p>
                  <div className="h-[150px]">
                    <Bar data={revenueTrendData} options={revenueTrendOptions} />
                  </div>
                </div>
              </div>
            </div>

            {/* bottom strip */}
            <div className="bg-white rounded-2xl shadow-sm px-5 py-3 flex gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ffe6ef] flex items-center justify-center">
                  📱
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">
                    184.97 <span className="text-xs text-gray-400">tons</span>
                  </p>
                  <p className="text-[11px] text-gray-500">Standard coal saved</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#e1f5f2] flex items-center justify-center">
                  ♻️
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">
                    219.65 <span className="text-xs text-gray-400">tons</span>
                  </p>
                  <p className="text-[11px] text-gray-500">CO₂ avoided</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#d2f6d9] flex items-center justify-center">
                  <img src="/assets/tree.png" alt="Tree" className="w-6 h-6 object-contain" />
                </div>
                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-base font-semibold text-gray-900">301</p>
                    <p className="text-[11px] text-gray-500">Equivalent trees planted</p>
                  </div>
                  {/* 3 small trees like screenshot */}
                  <div className="flex gap-1">
                    <img src="/assets/tree.png" alt="Tree" className="w-6 h-6 object-contain" />
                    <img src="/assets/tree.png" alt="Tree" className="w-6 h-6 object-contain" />
                    <img src="/assets/tree.png" alt="Tree" className="w-6 h-6 object-contain" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnergyDashboard;
