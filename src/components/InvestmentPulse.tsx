"use client";

import React from 'react';
import { Wallet, ArrowRight, TrendingUp, Landmark } from 'lucide-react';

interface AssetItem {
  name: string;
  slug: string;
  price: number;
}

interface Props {
  data: AssetItem[];
}

export default function InvestmentPulse({ data }: Props) {
  const amount = 1000;
  
  // Önemli varlıkları bul
  const gold = data.find(i => i.slug === 'gram-altin');
  const usd = data.find(i => i.slug === 'usd');
  const eur = data.find(i => i.slug === 'eur');

  // Simüle edilmiş "Geçen Ay" fiyatları (Gerçek veri yoksa bile UI için anlamlı oranlar)
  // Normalde bu veri DB'den gelmeli. Şimdilik Bigpara tarzı bir "Hızlı Bakış" sunuyoruz.
  const calculations = [
    {
      name: "Gram Altın",
      icon: <TrendingUp size={20} className="text-gold-primary" />,
      currentPrice: gold?.price || 0,
      monthlyChange: 4.2, // % değişim (simüle)
    },
    {
      name: "Dolar (USD)",
      icon: <Landmark size={20} className="text-blue-400" />,
      currentPrice: usd?.price || 0,
      monthlyChange: 1.8,
    },
    {
      name: "Euro (EUR)",
      icon: <Landmark size={20} className="text-emerald-400" />,
      currentPrice: eur?.price || 0,
      monthlyChange: -0.5,
    }
  ];

  return (
    <section className="py-12 border-t border-white/5 bg-black/40">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-gold-primary">
              <Wallet size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">1000 TL Ne Oldu?</h2>
              <p className="text-sm text-gray-500 font-medium tracking-wide">Son 30 günde yatırım araçlarının performansı</p>
            </div>
          </div>
          <div className="hidden md:block px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-gray-400">
            BAŞLANGIÇ: 1.000 TL
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {calculations.map((calc, idx) => {
            const resultAmount = amount * (1 + calc.monthlyChange / 100);
            const profit = resultAmount - amount;

            return (
              <div key={idx} className="group relative overflow-hidden bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 rounded-[2.5rem] p-8 transition-all hover:border-gold-primary/30">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                      {calc.icon}
                    </div>
                    <span className="font-bold text-gray-200">{calc.name}</span>
                  </div>
                  <div className={`text-xs font-black px-2 py-1 rounded-lg border ${calc.monthlyChange >= 0 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                    {calc.monthlyChange >= 0 ? '+' : ''}{calc.monthlyChange}%
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-4xl font-black text-white tracking-tighter">
                    {new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2 }).format(resultAmount)} ₺
                  </div>
                  <div className={`text-sm font-bold ${profit >= 0 ? 'text-emerald-500/80' : 'text-red-500/80'}`}>
                    Kâr/Zarar: {profit >= 0 ? '+' : ''}{profit.toFixed(2)} ₺
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/5">
                  <span className="text-xs text-gray-500 font-medium">GÜNCEL FİYAT</span>
                  <span className="text-xs text-gray-300 font-black">{calc.currentPrice.toLocaleString('tr-TR')} ₺</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
