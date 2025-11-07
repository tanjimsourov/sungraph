// src/EnergyDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Line,
  Doughnut,
  Bar,
} from "react-chartjs-2";
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

// small cards data
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

const summaryLine = (values) => ({
  labels: values.map((_, i) => `P${i + 1}`),
  datasets: [
    {
      data: values,
      backgroundColor: "rgba(118,111,208,0.25)",
      borderColor: "rgb(118,111,208)",
      fill: true,
      tension: 0.4,
      pointRadius: 0,
    },
  ],
});

const donutData = {
  labels: ["Auto consumed", "Injected"],
  datasets: [
    {
      data: [60, 40],
      backgroundColor: ["#31c0c0", "#766fd0"],
      borderWidth: 0,
    },
  ],
};

const energyTrendData = {
  labels: ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"],
  datasets: [
    {
      label: "Consumption",
      data: [1.0, 1.2, 1.5, 2.0, 2.5, 3.0, 3.2, 3.0, 2.8, 2.5, 2.0, 1.5],
      borderColor: "#31c0c0",
      backgroundColor: "rgba(49,192,192,0.25)",
      fill: true,
      tension: 0.4,
    },
    {
      label: "PV output",
      data: [0, 0, 0.25, 1.5, 2.2, 2.8, 3.5, 3.2, 2.7, 1.4, 0.5, 0],
      borderColor: "#766fd0",
      backgroundColor: "rgba(118,111,208,0.15)",
      fill: true,
      tension: 0.4,
    },
  ],
};

const energyTrendOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      labels: { boxWidth: 12 },
    },
  },
  scales: {
    x: { ticks: { font: { size: 10 } } },
    y: { beginAtZero: true, ticks: { font: { size: 10 } } },
  },
};

const revenueTrendData = {
  labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"],
  datasets: [
    {
      label: "€",
      data: [20, 23, 18, 30, 28, 35, 32, 31, 29, 26, 24, 22, 27, 30],
      backgroundColor: "rgba(255,193,7,0.8)",
      borderRadius: 4,
    },
  ],
};

const revenueTrendOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: { ticks: { font: { size: 10 } } },
    y: { beginAtZero: true, ticks: { font: { size: 10 } } },
  },
};

// small card component
const SummaryCard = ({ icon, title, subtitle, value, subvalue, chart, chartData }) => (
  <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-2">
    <div className="flex items-start gap-3">
      <span className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-base">
        {icon}
      </span>
      <div>
        <p className="text-sm font-medium text-gray-700">{title}</p>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
    </div>
    <div>
      <p className="text-lg font-semibold text-gray-900 leading-tight">{value}</p>
      {subvalue ? <p className="text-xs text-gray-400">{subvalue}</p> : null}
    </div>
    <div className="h-16">
      {chart === "line" && <Line data={chartData} options={smallLineOptions} />}
      {chart === "doughnut" && (
        <Doughnut
          data={chartData}
          options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }}
        />
      )}
    </div>
  </div>
);

const EnergyDashboard = () => {
  // which screen to show: 0 = summary, 1 = detail
  const [screen, setScreen] = useState(0);

  // auto rotate like in video
  useEffect(() => {
    const t = setInterval(() => {
      setScreen((prev) => (prev === 0 ? 1 : 0));
    }, 7000); // 7s
    return () => clearInterval(t);
  }, []);

  return (
    // full viewport, no scroll
    <div className="w-screen h-screen bg-slate-200 flex items-center justify-center overflow-hidden">
      {/* fixed canvas like signage so it never scrolls */}
      <div className="relative w-[1280px] h-[720px] bg-gray-100 rounded-xl shadow-md overflow-hidden">
        {/* we just fade/swap screens */}
        {screen === 0 ? (
          <div className="absolute inset-0 p-6 flex flex-col gap-6 bg-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-emerald-200" />
              <div>
                <p className="text-sm text-gray-500">Solar Monitoring</p>
                <p className="text-lg font-semibold text-gray-800">Plant Overview</p>
              </div>
            </div>

            {/* 6 cards */}
            <div className="grid grid-cols-3 gap-4 flex-1">
              <SummaryCard
                icon="🔋"
                title="Total Energy Consumed"
                subtitle="Year to date"
                value="21,446.67 kWh"
                subvalue="1,179.90 €"
                chart="line"
                chartData={summaryLine([10, 12, 14, 16, 15, 17, 18])}
              />
              <SummaryCard
                icon="⚡"
                title="Total Electricity"
                subtitle="Year to date"
                value="3,304.51 kWh"
                subvalue="363.50 €"
                chart="line"
                chartData={summaryLine([3, 3.4, 3.2, 3.6, 3.8, 3.7, 3.9])}
              />
              <SummaryCard
                icon="🔥"
                title="Total Gas"
                subtitle="Year to date"
                value="18,142.16 kWh"
                subvalue="816.40 €"
                chart="line"
                chartData={summaryLine([8, 8.2, 8.4, 8.1, 8.5, 8.7, 8.3])}
              />
              <SummaryCard
                icon="☀️"
                title="Total Energy Produced"
                subtitle="Year to date"
                value="4,001.32 kWh"
                subvalue="390.5 € saved"
                chart="line"
                chartData={summaryLine([4, 4.5, 4.2, 4.8, 5, 4.9, 5.1])}
              />
              <SummaryCard
                icon="📊"
                title="Energy Produced & Injected"
                subtitle="Breakdown"
                value="Auto vs Injected"
                chart="doughnut"
                chartData={donutData}
              />
              <SummaryCard
                icon="🌳"
                title="Total Trees Equivalent"
                subtitle="Year to date"
                value="6.54"
                subvalue="215.83 kgCO₂"
                chart="line"
                chartData={summaryLine([1, 1.3, 1.1, 1.4, 1.6, 1.5, 1.7])}
              />
            </div>

            <p className="text-xs text-gray-400">Auto rotating… (screen 1/2)</p>
          </div>
        ) : (
          <div className="absolute inset-0 p-6 flex flex-col gap-4 bg-gray-100">
            {/* top metrics */}
            <div className="grid grid-cols-5 gap-3">
              {[
                ["Daily kWh", "189.03", "kWh"],
                ["Irradiance", "25.48", "W/m²"],
                ["CO₂ avoided", "462.43", "kg"],
                ["Array voltage", "220.00", "V"],
                ["Array current", "19.00", "A"],
              ].map(([label, val, unit]) => (
                <div key={label} className="bg-white rounded-lg p-3 flex flex-col gap-1 shadow-sm">
                  <p className="text-base font-semibold text-gray-800">
                    {val}
                    <span className="text-xs text-gray-400 ml-1">{unit}</span>
                  </p>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              ))}
            </div>

            {/* alerts */}
            <div className="flex gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-red-100 text-red-600">Critical 0</span>
              <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-600">Major 0</span>
              <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">Minor 0</span>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700">Warning 4</span>
            </div>

            {/* middle row: schematic + 2 charts */}
            <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
              {/* schematic */}
              <div className="bg-white rounded-lg p-4 shadow-sm flex flex-col gap-4">
                <p className="text-sm font-medium text-gray-700 mb-2">String layout</p>
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
                    <p className="text-xs text-gray-500">PV Array</p>
                    <p className="text-sm font-semibold text-gray-800">7.07 kW</p>
                  </div>
                  <span className="text-gray-400 text-lg">→</span>
                  <div className="bg-purple-50 border border-purple-200 rounded-md px-3 py-2">
                    <p className="text-xs text-gray-500">Inverter</p>
                    <p className="text-sm font-semibold text-gray-800">3.50 kW</p>
                  </div>
                  <span className="text-gray-400 text-lg">→</span>
                  <div className="bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                    <p className="text-xs text-gray-500">Grid</p>
                    <p className="text-sm font-semibold text-gray-800">3.56 kW</p>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-auto">Auto rotating… (screen 2/2)</p>
              </div>

              {/* energy trend */}
              <div className="bg-white rounded-lg p-4 shadow-sm col-span-1 h-full">
                <p className="text-sm font-medium text-gray-700 mb-2">Energy trend (day)</p>
                <div className="h-[180px]">
                  <Line data={energyTrendData} options={energyTrendOptions} />
                </div>
              </div>

              {/* revenue trend */}
              <div className="bg-white rounded-lg p-4 shadow-sm h-full">
                <p className="text-sm font-medium text-gray-700 mb-2">Revenue trend (€)</p>
                <div className="h-[160px]">
                  <Bar data={revenueTrendData} options={revenueTrendOptions} />
                </div>
              </div>
            </div>

            {/* bottom env */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-base font-semibold text-gray-800">184.97 <span className="text-xs text-gray-400">tons</span></p>
                <p className="text-xs text-gray-500">Standard coal saved</p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-base font-semibold text-gray-800">219.65 <span className="text-xs text-gray-400">tons</span></p>
                <p className="text-xs text-gray-500">CO₂ avoided</p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-base font-semibold text-gray-800">301</p>
                <p className="text-xs text-gray-500">Equivalent trees planted</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnergyDashboard;
