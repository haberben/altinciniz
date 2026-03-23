"use client";

import { useState, useMemo } from "react";
import type { AssetItem } from "@/lib/api";
import { ArrowRightLeft, Calculator } from "lucide-react";

export default function Converter({ items }: { items: AssetItem[] }) {
  const [amount, setAmount] = useState<number | string>(1);
  const [selectedAsset, setSelectedAsset] = useState<string>("gram-altin");

  const activeAsset = useMemo(() => items.find(i => i.slug === selectedAsset) || items[0], [items, selectedAsset]);
  
  const totalValue = useMemo(() => {
    const numAmount = parseFloat(amount.toString());
    if (isNaN(numAmount) || numAmount < 0) return 0;
    return numAmount * activeAsset.price;
  }, [amount, activeAsset]);

  const formattedTotal = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(totalValue);

  return (
    <div className="w-full bg-gradient-to-br from-surface to-black border border-[#333] rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
      {/* Background glow specific to converter */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold-primary/10 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <Calculator className="text-gold-primary" size={28} />
        <h2 className="text-xl font-bold text-white tracking-wide">Piyasa Hesaplama Aracı</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center relative z-10 bg-[#0a0a0a] p-4 rounded-2xl border border-[#222]">
        
        {/* Adet (Miktar) Girişi */}
        <div className="w-full md:w-1/4">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Miktar / Adet</label>
          <input 
            type="number" 
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-[#111] text-white text-lg font-bold border border-[#333] rounded-xl px-4 py-3 focus:outline-none focus:border-gold-primary transition-colors"
          />
        </div>

        <ArrowRightLeft className="text-gray-600 hidden md:block mt-6" size={24} />

        {/* Seçim Kutusu */}
        <div className="w-full md:w-2/4">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Varlık Türü</label>
          <select 
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            className="w-full bg-[#111] text-white text-lg font-bold border border-[#333] rounded-xl px-4 py-3 focus:outline-none focus:border-gold-primary transition-colors appearance-none cursor-pointer"
          >
            <optgroup label="Altınlar">
              {items.filter(i => i.type === 'gold').map(g => (
                <option key={g.slug} value={g.slug}>{g.name}</option>
              ))}
            </optgroup>
            <optgroup label="Döviz">
              {items.filter(i => i.type === 'currency').map(c => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Sonuç Alanı */}
        <div className="w-full md:w-auto md:ml-auto flex flex-col items-center md:items-end bg-gold-primary/5 px-6 py-3 rounded-xl border border-gold-primary/20">
          <span className="text-xs font-semibold text-gold-light uppercase tracking-widest mb-1">Toplam Değer (TL)</span>
          <span className="text-2xl md:text-3xl font-black text-white">{formattedTotal}</span>
        </div>

      </div>
    </div>
  );
}
