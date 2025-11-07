// src/dashboardData.js

// summary cards for screen 0
export const SUMMARY_CARD_DATA = [
  {
    id: "total-energy",
    title: "Total Energy Consumed",
    subtitle: "Year to date",
    value: "21,446.67 kWh",
    subvalue: "1,179.90 €",
    spark: [2, 3, 4, 5.5, 6, 6.2, 6.6],
  },
  {
    id: "total-electricity",
    title: "Total Electricity Consumed",
    subtitle: "Year to date",
    value: "3,304.51 kWh",
    subvalue: "363.50 €",
    spark: [1, 1.7, 2, 2.3, 2.6, 2.5, 2.9],
  },
  {
    id: "total-gas",
    title: "Total Gas Consumed",
    subtitle: "Year to date",
    value: "18,142.16 kWh",
    subvalue: "816.40 €",
    spark: [1, 1.1, 1.4, 2, 2.4, 2.7, 3.1],
  },
  {
    id: "total-produced",
    title: "Total Energy Produced",
    subtitle: "Year to date",
    value: "4,001.32 kWh",
    subvalue: "390.53 € saved",
    spark: [1.5, 1.8, 2.2, 2.6, 3, 3.4, 3.5],
  },
];

export const ENERGY_TRENDS = {
  day: {
    labels: ["00:00","02:00","04:00","06:00","08:00","10:00","12:00","14:00","16:00","18:00","20:00","22:00"],
    datasets: [
      {
        label: "PV output",
        data: [0, 0, 10, 40, 80, 120, 155, 148, 120, 80, 35, 0],
        borderColor: "#2daf5d",
        backgroundColor: "rgba(45,175,93,0.30)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Power from grid",
        data: [35, 38, 40, 43, 45, 48, 50, 48, 46, 44, 42, 40],
        borderColor: "#4b5563",
        backgroundColor: "rgba(75,85,99,0.03)",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Consumption power",
        data: [40, 43, 45, 55, 65, 82, 100, 98, 92, 85, 75, 65],
        borderColor: "#d9534f",
        backgroundColor: "rgba(217,83,79,0.05)",
        tension: 0.4,
        fill: false,
      },
    ],
  },
  month: {
    labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
    datasets: [
      {
        label: "PV output",
        data: [
          15, 20, 25, 35, 60, 80, 95, 105, 120, 140,
          150, 140, 135, 130, 128, 122, 118, 115, 110, 105,
          100, 95, 90, 85, 80, 78, 76, 73, 70, 68,
        ],
        borderColor: "#2daf5d",
        backgroundColor: "rgba(45,175,93,0.30)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Power from grid",
        data: Array.from({ length: 30 }, () => 55),
        borderColor: "#4b5563",
        backgroundColor: "rgba(75,85,99,0.03)",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Consumption power",
        data: [
          50, 55, 58, 60, 75, 82, 90, 100, 110, 115,
          120, 118, 115, 112, 110, 109, 108, 106, 104, 102,
          100, 98, 95, 93, 90, 88, 85, 84, 83, 80,
        ],
        borderColor: "#d9534f",
        backgroundColor: "rgba(217,83,79,0.05)",
        tension: 0.4,
        fill: false,
      },
    ],
  },
  year: {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    datasets: [
      {
        label: "PV output",
        data: [40, 60, 80, 120, 160, 180, 200, 195, 170, 140, 90, 50],
        borderColor: "#2daf5d",
        backgroundColor: "rgba(45,175,93,0.30)",
        tension: 0.35,
        fill: true,
      },
      {
        label: "Power from grid",
        data: [70, 68, 67, 66, 65, 64, 64, 64, 65, 66, 67, 68],
        borderColor: "#4b5563",
        backgroundColor: "rgba(75,85,99,0.03)",
        tension: 0.35,
        fill: false,
      },
      {
        label: "Consumption power",
        data: [80, 85, 90, 100, 120, 130, 140, 138, 130, 120, 105, 90],
        borderColor: "#d9534f",
        backgroundColor: "rgba(217,83,79,0.05)",
        tension: 0.35,
        fill: false,
      },
    ],
  },
  lifetime: {
    labels: ["2019","2020","2021","2022","2023","2024","2025"],
    datasets: [
      {
        label: "PV output",
        data: [50, 90, 140, 200, 260, 300, 335],
        borderColor: "#2daf5d",
        backgroundColor: "rgba(45,175,93,0.30)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Power from grid",
        data: [80, 78, 74, 70, 68, 65, 63],
        borderColor: "#4b5563",
        backgroundColor: "rgba(75,85,99,0.03)",
        tension: 0.3,
        fill: false,
      },
      {
        label: "Consumption power",
        data: [90, 100, 120, 150, 180, 200, 210],
        borderColor: "#d9534f",
        backgroundColor: "rgba(217,83,79,0.05)",
        tension: 0.3,
        fill: false,
      },
    ],
  },
};

export const REVENUE_TRENDS = {
  month: {
    labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
    datasets: [
      {
        label: "PV Benefit",
        data: [
          50, 90, 130, 110, 145, 95, 160, 135, 122, 148,
          172, 112, 180, 132, 145, 150, 128, 160, 125, 140,
          155, 168, 138, 112, 98, 122, 150, 132, 100, 92,
        ],
        backgroundColor: "#f4b000",
        borderRadius: 4,
      },
    ],
  },
  year: {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    datasets: [
      {
        label: "PV Benefit",
        data: [300, 420, 500, 620, 720, 810, 900, 870, 760, 680, 550, 430],
        backgroundColor: "#f4b000",
        borderRadius: 4,
      },
    ],
  },
  lifetime: {
    labels: ["2019","2020","2021","2022","2023","2024","2025"],
    datasets: [
      {
        label: "PV Benefit",
        data: [1200, 1600, 2100, 2600, 3300, 4100, 4650],
        backgroundColor: "#f4b000",
        borderRadius: 4,
      },
    ],
  },
};

// chart options that can be reused
export const chartOptions = {
  energyTrendOptions: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom", labels: { boxWidth: 12 } },
      tooltip: { enabled: true },
    },
    interaction: { mode: "nearest", intersect: false },
    animation: { duration: 450, easing: "easeOutQuad" },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.04)" },
        ticks: { font: { size: 11 } },
      },
    },
  },
  revenueTrendOptions: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    interaction: { mode: "index", intersect: false },
    animation: { duration: 450, easing: "easeOutQuad" },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10 } } },
      y: { beginAtZero: true, ticks: { font: { size: 10 } } },
    },
  },
};

// optional live API fetcher
export async function fetchLiveDashboardData() {
  try {
    const res = await fetch("/api/energy-dashboard");
    if (!res.ok) throw new Error("Failed to fetch dashboard data");
    return await res.json();
  } catch (err) {
    console.warn("Live dashboard endpoint not available, using static data", err);
    return null;
  }
}
