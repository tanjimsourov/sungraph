// Page: SolarBarPage
// Description:
//   Displays a bar chart comparing monthly solar yield percentages across years.  Includes
//   Dutch and English translations and loads data from an external module with optional
//   API fallback.  Scaling preserves a 1200×600 aspect ratio within the viewport.

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import solarBarData from '../data/solarBarData';
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const BASE_W = 1200;
const BASE_H = 600;

// Attempt to fetch bar data from API
async function fetchBarData() {
  try {
    const res = await fetch('/api/solarbar');
    if (!res.ok) throw new Error('network');
    const json = await res.json();
    return json;
  } catch (e) {
    return solarBarData;
  }
}

// Translations
const translations = {
  nl: {
    title: 'Opbrengst Zonnepanelen per maand',
    subtitle: '(als % van de totale jaaropbrengst) · 2015 – 2022',
  },
  en: {
    title: 'Solar panel yield per month',
    subtitle: '(as % of the total annual yield) · 2015 – 2022',
  },
};

export default function SolarBarPage() {
  const [scale, setScale] = useState(1);
  const [data, setData] = useState(solarBarData);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Determine language
  const lang =
    typeof navigator !== 'undefined' && navigator.language && navigator.language.toLowerCase().startsWith('en')
      ? 'en'
      : 'nl';
  const t = translations[lang];

  // Load data from API
  useEffect(() => {
    let cancelled = false;
    fetchBarData().then((d) => {
      if (!cancelled) setData(d);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const resize = () => {
      const w = window.innerWidth / BASE_W;
      const h = window.innerHeight / BASE_H;
      setScale(Math.min(w, h));
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // 2025 Modern chart options with advanced animations
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeOutElastic',
      delay: (context) => context.dataIndex * 100,
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: { 
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 25,
          font: {
            size: 11,
            family: "'Geist', 'Inter', sans-serif",
            weight: '500'
          },
          color: 'rgba(15, 23, 42, 0.8)',
        },
        onHover: (e) => {
          e.native.target.style.cursor = 'pointer';
        },
        onLeave: (e) => {
          e.native.target.style.cursor = 'default';
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        padding: 16,
        cornerRadius: 12,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        titleFont: {
          family: "'Geist', 'Inter', sans-serif",
          size: 12,
          weight: '600'
        },
        bodyFont: {
          family: "'Geist', 'Inter', sans-serif",
          size: 11,
          weight: '500'
        },
        callbacks: { 
          label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}%`,
          title: (items) => `📅 ${items[0].label}`,
          labelTextColor: () => '#f8fafc',
        },
        displayColors: true,
        boxPadding: 6,
        usePointStyle: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { 
          callback: (v) => v + '%',
          font: {
            family: "'Geist', 'Inter', sans-serif",
            size: 10,
            weight: '500'
          },
          color: 'rgba(15, 23, 42, 0.6)',
          padding: 8,
        },
        grid: { 
          color: 'rgba(15, 23, 42, 0.03)',
          drawBorder: false,
          lineWidth: 1,
        },
        border: {
          dash: [4, 4],
        }
      },
      x: { 
        grid: { 
          display: false,
        },
        ticks: {
          font: {
            family: "'Geist', 'Inter', sans-serif",
            size: 10,
            weight: '500'
          },
          color: 'rgba(15, 23, 42, 0.7)',
        },
        border: {
          dash: [4, 4],
        }
      },
    },
    elements: {
      bar: {
        borderRadius: {
          topLeft: 12,
          topRight: 12,
          bottomLeft: 4,
          bottomRight: 4,
        },
        borderSkipped: false,
        borderWidth: 0,
        hoverBorderWidth: 2,
      }
    }
  };

  // Enhanced data with 2025 gradient system
  const enhancedData = {
    ...data,
    datasets: data.datasets.map((dataset, index) => {
      const colors = [
        ['#0061ff', '#60efff'], // Cyber Blue
        ['#ff1b6b', '#ff8e38'], // Neon Pink-Orange
        ['#40c9ff', '#e81cff'], // Electric Blue-Pink
        ['#f7ff00', '#db36a4'], // Neon Yellow-Pink
        ['#00ff87', '#60efff'], // Mint to Cyan
        ['#ff0f7b', '#f89b29'], // Hot Pink-Orange
        ['#00ffd1', '#00b3ff'], // Aqua to Blue
        ['#ff00cc', '#333399']  // Purple to Deep Blue
      ];
      
      const [color1, color2] = colors[index % colors.length];
      
      return {
        ...dataset,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return color1;
          
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, color1);
          gradient.addColorStop(0.7, color2);
          gradient.addColorStop(1, color2);
          return gradient;
        },
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 0,
        hoverBackgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return color1;
          
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, `${color1}DD`);
          gradient.addColorStop(0.7, `${color2}DD`);
          gradient.addColorStop(1, `${color2}DD`);
          return gradient;
        },
        hoverBorderColor: 'rgba(255, 255, 255, 0.4)',
        hoverBorderWidth: 2,
        barPercentage: 0.75,
        categoryPercentage: 0.8,
      };
    })
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900 overflow-hidden flex items-center justify-center p-4 relative">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 animate-float"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 20}s`,
              filter: 'blur(40px)',
            }}
          />
        ))}
      </div>

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      <div
        className={`relative w-[1200px] h-[600px] bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-2xl rounded-4xl shadow-2xl flex flex-col p-10 border border-white/20 transition-all duration-1000 ease-out ${
          isHovered ? 'shadow-cyan-500/10' : 'shadow-blue-500/5'
        }`}
        style={{ 
          transform: `scale(${scale})`, 
          transformOrigin: 'center center',
          opacity: isVisible ? 1 : 0,
          transform: `scale(${scale}) ${isVisible ? 'translateY(0) rotateX(0)' : 'translateY(20px) rotateX(5deg)'}`,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Glass morphism border glow */}
        <div className="absolute inset-0 rounded-4xl bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
        
        {/* Animated corner accents */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-400/50 rounded-tl-2xl" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-purple-400/50 rounded-tr-2xl" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-blue-400/50 rounded-bl-2xl" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-green-400/50 rounded-br-2xl" />

        {/* Header with 2025 typography */}
        <div className="text-center mb-8 relative">
          {/* Animated title underline */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-60" />
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 bg-clip-text text-transparent mb-3 transition-all duration-700 tracking-tight">
            {t.title}
          </h1>
          <p className="text-sm text-slate-600 font-medium tracking-wide transition-all duration-700 delay-150 bg-white/50 rounded-full py-1.5 px-4 inline-block border border-white/30">
            {t.subtitle}
          </p>
        </div>

        {/* Chart container with advanced glass effect */}
        <div className="flex-1 min-h-0 relative rounded-3xl overflow-hidden bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm border border-white/30 shadow-inner">
          {/* Inner glow */}
          <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_40px_rgba(120,119,198,0.1)] pointer-events-none" />
          
          {/* Animated grid pattern overlay */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `
                linear-gradient(90deg, transparent 95%, #0061ff 100%),
                linear-gradient(180deg, transparent 95%, #0061ff 100%)
              `,
              backgroundSize: '30px 30px',
            }}
          />
          
          <Bar data={enhancedData} options={barOptions} />
        </div>

        {/* Futuristic footer */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 rounded-full border border-white/40 shadow-sm">
              <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full animate-pulse" />
              <span className="text-xs text-slate-700 font-medium tracking-wide">
                {lang === 'en' ? 'LIVE DATA STREAM' : 'LIVE DATA STREAM'}
              </span>
            </div>
            
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-3 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full animate-wave"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-500 font-mono tracking-wide bg-white/30 rounded-full px-3 py-1 border border-white/20">
              {new Date().getFullYear()} • SOLAR ANALYTICS v2.0
            </div>
          </div>
        </div>
      </div>

      {/* Floating UI elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-3xl animate-float-slow delay-2000" />
      <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-blue-500/10 rounded-full blur-3xl animate-float-slow delay-4000" />

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg) scale(1); 
          }
          33% { 
            transform: translateY(-30px) rotate(120deg) scale(1.1); 
          }
          66% { 
            transform: translateY(15px) rotate(240deg) scale(0.9); 
          }
        }
        
        @keyframes wave {
          0%, 60%, 100% { 
            transform: scaleY(1); 
          }
          30% { 
            transform: scaleY(1.8); 
          }
        }
        
        .animate-float-slow {
          animation: float-slow 15s ease-in-out infinite;
        }
        
        .animate-wave {
          animation: wave 1.5s ease-in-out infinite;
        }
        
        .rounded-4xl {
          border-radius: 2rem;
        }
      `}</style>
    </div>
  );
}