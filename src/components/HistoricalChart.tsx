"use client";

import React from 'react';
import { AreaChart, TrendingUp, Info } from 'lucide-react';

interface Props {
  currentPrice: number;
  label: string;
}

export default function HistoricalChart({ currentPrice, label }: Props) {
  // Simüle edilmiş son 24 saatlik veri (Gerçek veri DB'de biriktikçe buraya çekilecek)
  // Şimdilik Bigpara tarzı bir "Hisse Grafiği" görünümü veriyoruz
  const generateData = () => {
    const points = [];
    const base = currentPrice * 0.98;
    for (let i = 0; i < 20; i++) {
      points.push(base + Math.random() * (currentPrice * 0.04));
    }
    points.push(currentPrice); // Son nokta güncel fiyat
    return points;
  };

  const data = generateData();
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  
  // SVG koordinatları (100x40 genişliğinde minik bir sparkline)
  const width = 300;
  const height = 100;
  const padding = 10;
  
  const points = data.map((p, i) => {
    const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - ((p - min) / range) * (height - padding * 2) - padding;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 overflow-hidden relative">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gold-primary/10 rounded-xl">
            <AreaChart size={20} className="text-gold-primary" />
          </div>
          <div>
            <h3 className="font-bold text-white tracking-tight">{label} Performansı</h3>
            <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Son 24 Saatlik Değişim</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-black bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
          <TrendingUp size={14} />
          <span>Canlı Takip</span>
        </div>
      </div>

      {/* Modern SVG Chart */}
      <div className="relative h-32 w-full flex items-end">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full stroke-gold-primary stroke-[2] fill-transparent drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(212,175,55,0.3)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path 
            d={`M ${padding},${height} ${points.split(' ').map((p, i) => (i === 0 ? 'M' : 'L') + ' ' + p).join(' ')} L ${width - padding},${height} Z`} 
            fill="url(#gradient)" 
            stroke="none"
          />
          <polyline points={points} fill="none" />
        </svg>
      </div>

      <div className="mt-6 flex justify-between text-[10px] font-black text-gray-600 tracking-widest border-t border-white/5 pt-4">
        <span>09:00</span>
        <span>12:00</span>
        <span>15:00</span>
        <span>18:00</span>
        <span>GÜNCEL</span>
      </div>

      <div className="absolute top-0 right-0 p-4">
        <div className="group relative">
           <Info size={14} className="text-gray-700 hover:text-gray-400 transition-colors cursor-help" />
           <div className="absolute top-6 right-0 w-48 bg-black border border-white/10 p-3 rounded-xl text-[10px] text-gray-400 leading-relaxed invisible group-hover:visible z-50 shadow-2xl">
             Bu grafik deneme amaçlı simüle edilmiş veriler içermektedir. Gerçek arşiv verileri sitemizde biriktikçe kesinleşecektir.
           </div>
        </div>
      </div>
    </div>
  );
}
