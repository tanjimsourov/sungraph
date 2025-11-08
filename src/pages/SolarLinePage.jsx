// Page: SolarLinePage
// Description:
//   Displays a line chart comparing minimum, average and maximum monthly solar
//   yields as percentages of the annual total.  Provides Dutch and English
//   translations and loads data from an external module with optional API
//   fallback.  The layout and styling remain identical to the original.

import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import solarLineData from '../data/solarLineData';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

// Base dimensions for scaling.  The chart is designed for a 1200×600 area.
const BASE_W = 1200;
const BASE_H = 600;

// Import dummy data.  Each dataset represents a curve for a measurement type.


// Fetch line data from API; fallback to dummy data on failure.  The API is
// expected to return the same shape as the dummy: { labels, datasets }.
async function fetchLineData() {
  try {
    const res = await fetch('/api/solarline');
    if (!res.ok) throw new Error('network');
    const json = await res.json();
    if (json && Array.isArray(json.labels) && Array.isArray(json.datasets)) {
      return json;
    }
  } catch (e) {
    // ignore
  }
  return solarLineData;
}

// Translations for titles and dataset labels.  The datasets in the dummy data
// use Dutch labels; the English translation will map these to their
// equivalents.  Unknown labels are passed through unchanged.
const translations = {
  nl: {
    title: 'Opbrengst Zonnepanelen per maand',
    subtitle: '(als % van de totale opbrengst per jaar 2015–2022)',
    datasetLabels: {
      gemiddeld: 'gemiddeld',
      minimum: 'minimum',
      maximum: 'maximum',
    },
  },
  en: {
    title: 'Solar panel yield per month',
    subtitle: '(as % of total annual yield 2015–2022)',
    datasetLabels: {
      gemiddeld: 'Average',
      minimum: 'Minimum',
      maximum: 'Maximum',
    },
  },
};

export default function SolarLinePage() {
  const [scale, setScale] = useState(1);
  const [data, setData] = useState(solarLineData);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activePoint, setActivePoint] = useState(null);
  const chartRef = useRef();

  // Determine language
  const lang =
    typeof navigator !== 'undefined' && navigator.language && navigator.language.toLowerCase().startsWith('en')
      ? 'en'
      : 'nl';
  const t = translations[lang];

  // Load data from API once on mount
  useEffect(() => {
    let cancelled = false;
    fetchLineData().then((d) => {
      if (!cancelled) setData(d);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Resize scaling
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

  // Enhanced hover effects
  const handleHover = (event, chartElements) => {
    if (chartElements && chartElements.length > 0) {
      const point = chartElements[0];
      setActivePoint({
        datasetIndex: point.datasetIndex,
        index: point.index,
        value: point.element.$context.parsed.y
      });
    } else {
      setActivePoint(null);
    }
  };

  // Translate dataset labels when rendering
  const translatedData = {
    labels: data.labels,
    datasets: data.datasets.map((ds, index) => {
      // Define gradient colors for each line with glow effects
      const lineColors = [
        { 
          main: '#0066ff', 
          light: '#00f2fe', 
          glow: '#0066ff40',
          gradient: ['#0066ff25', '#00f2fe05'],
          shadow: '0 0 20px #0066ff40'
        }, // Average - Electric Blue
        { 
          main: '#ff2b6b', 
          light: '#ff8e38', 
          glow: '#ff2b6b40',
          gradient: ['#ff2b6b25', '#ff8e3805'],
          shadow: '0 0 20px #ff2b6b40'
        }, // Minimum - Neon Pink-Orange
        { 
          main: '#00ff95', 
          light: '#00e4ff', 
          glow: '#00ff9540',
          gradient: ['#00ff9525', '#00e4ff05'],
          shadow: '0 0 20px #00ff9540'
        }, // Maximum - Mint to Cyan
      ];
      
      const colors = lineColors[index % lineColors.length];
      
      return {
        ...ds,
        label: t.datasetLabels[ds.label] || ds.label,
        borderColor: colors.main,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return colors.main;
          
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, colors.gradient[0]);
          gradient.addColorStop(1, colors.gradient[1]);
          return gradient;
        },
        pointBackgroundColor: colors.main,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 3,
        pointRadius: 8,
        pointHoverRadius: 14,
        pointHoverBackgroundColor: colors.light,
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 4,
        borderWidth: 5,
        tension: 0.4,
        fill: true,
        cubicInterpolationMode: 'monotone',
        // Enhanced hover effects
        pointStyle: 'circle',
        pointHitRadius: 20,
        // Glow effect on hover
        hoverBackgroundColor: colors.light,
        hoverBorderColor: '#ffffff',
        hoverBorderWidth: 4,
      };
    }),
  };

  // Enhanced line chart options with advanced animations and hover effects
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2500,
      easing: 'easeOutElastic',
      delay: (context) => {
        return context.dataIndex * 80 + context.datasetIndex * 400;
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    onHover: (event, elements) => {
      handleHover(event, elements);
    },
    plugins: {
      legend: {
        position: 'right',
        labels: { 
          usePointStyle: true, 
          boxWidth: 12,
          padding: 25,
          font: {
            size: 13,
            family: "'Geist', 'Inter', sans-serif",
            weight: '600'
          },
          color: 'rgba(15, 23, 42, 0.9)',
          generateLabels: (chart) => {
            const original = ChartJS.defaults.plugins.legend.labels.generateLabels;
            const labels = original(chart);
            return labels.map(label => ({
              ...label,
              pointStyle: 'rectRounded',
              borderRadius: 6,
            }));
          }
        },
        onHover: (e) => {
          e.native.target.style.cursor = 'pointer';
          e.native.target.style.transform = 'scale(1.05)';
        },
        onLeave: (e) => {
          e.native.target.style.cursor = 'default';
          e.native.target.style.transform = 'scale(1)';
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.98)',
        padding: 18,
        cornerRadius: 16,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        titleFont: {
          family: "'Geist', 'Inter', sans-serif",
          size: 13,
          weight: '700'
        },
        bodyFont: {
          family: "'Geist', 'Inter', sans-serif",
          size: 12,
          weight: '600'
        },
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            const icons = ['📊', '📉', '📈'];
            return `${icons[context.datasetIndex]} ${context.dataset.label}: ${value}%`;
          },
          labelTextColor: (context) => {
            const colors = ['#0066ff', '#ff2b6b', '#00ff95'];
            return colors[context.datasetIndex];
          },
          labelColor: (context) => {
            const colors = ['#0066ff', '#ff2b6b', '#00ff95'];
            return {
              borderColor: colors[context.datasetIndex],
              backgroundColor: colors[context.datasetIndex] + '20',
              borderWidth: 2,
              borderRadius: 6,
            };
          }
        },
        displayColors: true,
        boxPadding: 8,
        usePointStyle: true,
        bodySpacing: 8,
        titleSpacing: 6,
        footerSpacing: 6,
        // Enhanced tooltip animations
        animation: {
          duration: 300,
          easing: 'easeOutQuart'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { 
          color: 'rgba(15, 23, 42, 0.04)',
          drawBorder: false,
          lineWidth: 1,
          drawTicks: false,
        },
        border: {
          dash: [4, 4],
          color: 'rgba(15, 23, 42, 0.1)',
        },
        ticks: { 
          callback: (v) => v + '%',
          max: 20, 
          stepSize: 2,
          font: {
            family: "'Geist', 'Inter', sans-serif",
            size: 11,
            weight: '600'
          },
          color: 'rgba(15, 23, 42, 0.7)',
          padding: 12,
          backdropColor: 'rgba(255, 255, 255, 0.8)',
          backdropPadding: 4,
        },
      },
      x: { 
        grid: { 
          display: false,
        },
        ticks: {
          font: {
            family: "'Geist', 'Inter', sans-serif",
            size: 11,
            weight: '600'
          },
          color: 'rgba(15, 23, 42, 0.8)',
          padding: 8,
        },
        border: {
          dash: [4, 4],
          color: 'rgba(15, 23, 42, 0.1)',
        }
      },
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: 5,
        borderCapStyle: 'round',
        borderJoinStyle: 'round',
      },
      point: {
        radius: 8,
        hoverRadius: 14,
        backgroundColor: '#ffffff',
        borderWidth: 3,
        hoverBorderWidth: 4,
        hitRadius: 30,
        hoverShadowOffsetX: 0,
        hoverShadowOffsetY: 0,
        hoverShadowBlur: 15,
      }
    },
    // Enhanced hover effects
    hover: {
      animationDuration: 300,
      mode: 'index',
      intersect: false,
    },
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-950 via-blue-950/80 to-purple-900/80 overflow-hidden flex items-center justify-center p-4 relative">
      {/* Animated background particles with glow */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: Math.random() * 120 + 30,
              height: Math.random() * 120 + 30,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${25 + Math.random() * 25}s`,
              background: `radial-gradient(circle, ${
                ['#0066ff20', '#ff2b6b20', '#00ff9520'][i % 3]
              } 0%, transparent 70%)`,
              filter: 'blur(25px)',
            }}
          />
        ))}
      </div>

      {/* Animated grid overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(90deg, transparent 98%, #00f2fe 100%),
            linear-gradient(180deg, transparent 98%, #00f2fe 100%)
          `,
          backgroundSize: '60px 60px',
          animation: 'gridMove 20s linear infinite',
        }}
      />

      {/* Floating value indicator */}
      {activePoint && (
        <div 
          className="absolute z-50 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-xl text-white px-4 py-3 rounded-2xl border border-white/10 shadow-2xl transform transition-all duration-300"
          style={{
            left: '50%',
            top: '20%',
            transform: 'translateX(-50)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse"></div>
            <span className="text-sm font-semibold text-cyan-200">
              {data.labels[activePoint.index]}: {activePoint.value}%
            </span>
          </div>
        </div>
      )}

      <div
        className={`relative w-[1200px] h-[600px] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-4xl shadow-2xl flex flex-col p-10 border border-white/20 transition-all duration-1000 ease-out ${
          isHovered ? 'shadow-cyan-500/20 glow-effect' : 'shadow-blue-500/10'
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
        {/* Animated border glow */}
        <div className="absolute inset-0 rounded-4xl bg-gradient-to-r from-cyan-500/10 via-purple-500/5 to-blue-500/10 animate-border-glow pointer-events-none" />
        
        {/* Neon corner accents */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-400 rounded-tl-2xl animate-pulse-slow" />
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-purple-400 rounded-tr-2xl animate-pulse-slow delay-1000" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-blue-400 rounded-bl-2xl animate-pulse-slow delay-2000" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-green-400 rounded-br-2xl animate-pulse-slow delay-3000" />

        {/* Header with animated gradient text */}
        <div className="text-center mb-8 relative">
          {/* Floating particles around title */}
          <div className="absolute -top-4 -left-4 w-3 h-3 bg-cyan-400 rounded-full animate-bounce opacity-60"></div>
          <div className="absolute -top-2 -right-4 w-2 h-2 bg-purple-400 rounded-full animate-bounce opacity-60 delay-500"></div>
          
          <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 transition-all duration-1000 tracking-tight drop-shadow-lg">
            {t.title}
          </h1>
          <p className="text-lg text-cyan-100/80 font-semibold tracking-wider transition-all duration-1000 delay-300 bg-white/5 rounded-2xl py-3 px-6 inline-block border border-cyan-500/20 backdrop-blur-sm">
            ✨ {t.subtitle} ✨
          </p>
        </div>

        {/* Chart container with advanced glass effect */}
        <div className="flex-1 min-h-0 relative rounded-3xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-cyan-500/20 shadow-2xl">
          {/* Inner animated glow */}
          <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_80px_rgba(0,242,254,0.1)] animate-glow-slow pointer-events-none" />
          
          {/* Animated grid pattern */}
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `
                linear-gradient(90deg, transparent 98%, #00f2fe 100%),
                linear-gradient(180deg, transparent 98%, #00f2fe 100%)
              `,
              backgroundSize: '40px 40px',
              animation: 'gridMove 15s linear infinite',
            }}
          />
          
          <Line 
            ref={chartRef}
            data={translatedData} 
            options={lineOptions} 
          />
        </div>

        {/* Interactive footer with live data */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl border border-cyan-500/30 backdrop-blur-sm">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-4 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full animate-wave"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
              <span className="text-sm text-cyan-100 font-bold tracking-wider drop-shadow-lg">
                {lang === 'en' ? 'LIVE TRACKING' : 'LIVE VOLGING'}
              </span>
            </div>
            
            {/* Data indicators */}
            <div className="flex items-center gap-4">
              {translatedData.datasets.map((dataset, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full animate-pulse"
                    style={{
                      background: `linear-gradient(45deg, ${
                        ['#0066ff', '#ff2b6b', '#00ff95'][index]
                      }, ${
                        ['#00f2fe', '#ff8e38', '#00e4ff'][index]
                      })`,
                      boxShadow: `0 0 10px ${
                        ['#0066ff', '#ff2b6b', '#00ff95'][index]
                      }`
                    }}
                  />
                  <span className="text-xs text-cyan-100/80 font-semibold">
                    {dataset.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm text-cyan-100/60 font-mono font-bold tracking-widest bg-white/5 rounded-2xl px-4 py-2 border border-cyan-500/10 backdrop-blur-sm">
              SOLAR AI • {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced floating UI elements */}
      <div className="absolute top-1/4 left-1/6 w-40 h-40 bg-cyan-500/15 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-1/3 right-1/5 w-32 h-32 bg-purple-500/15 rounded-full blur-3xl animate-float-slow delay-2000" />
      <div className="absolute top-1/2 left-1/3 w-28 h-28 bg-blue-500/15 rounded-full blur-3xl animate-float-slow delay-4000" />

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg) scale(1); 
          }
          33% { 
            transform: translateY(-40px) rotate(120deg) scale(1.1); 
          }
          66% { 
            transform: translateY(20px) rotate(240deg) scale(0.9); 
          }
        }
        
        @keyframes wave {
          0%, 60%, 100% { 
            transform: scaleY(1); 
          }
          30% { 
            transform: scaleY(2); 
          }
        }
        
        @keyframes glow-slow {
          0%, 100% { 
            box-shadow: inset 0 0 80px rgba(0, 242, 254, 0.1);
          }
          50% { 
            box-shadow: inset 0 0 100px rgba(0, 242, 254, 0.15);
          }
        }
        
        @keyframes border-glow {
          0%, 100% { 
            opacity: 0.5;
          }
          50% { 
            opacity: 1;
          }
        }
        
        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(60px, 60px);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% { 
            opacity: 0.3;
          }
          50% { 
            opacity: 1;
          }
        }
        
        .animate-float-slow {
          animation: float-slow 18s ease-in-out infinite;
        }
        
        .animate-wave {
          animation: wave 0.8s ease-in-out infinite;
        }
        
        .animate-glow-slow {
          animation: glow-slow 4s ease-in-out infinite;
        }
        
        .animate-border-glow {
          animation: border-glow 3s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        
        .glow-effect {
          box-shadow: 
            0 0 80px rgba(0, 242, 254, 0.3),
            0 0 120px rgba(0, 102, 255, 0.2),
            0 0 160px rgba(147, 51, 234, 0.1) !important;
        }
        
        .rounded-4xl {
          border-radius: 2.5rem;
        }
      `}</style>
    </div>
  );
}