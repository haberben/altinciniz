import React from "react";
import Link from "next/link";
import { Sparkles, Activity, TrendingUp, TrendingDown } from "lucide-react";
import type { AssetItem } from "@/lib/api";

type Props = {
  item: AssetItem;
  featured?: boolean;
};

export default function PriceCard({ item, featured = false }: Props) {
  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(p) + ' ₺';
  };

  return (
    <Link 
      href={`/${item.slug}`} 
      prefetch={false}
      aria-label={`${item.name} canlı fiyat detayları ve grafikler`}
      className={`block relative group overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-1 
      ${featured 
        ? "col-span-1 bg-gradient-to-br from-[#1a1500]/90 to-black/90 border border-gold-primary/30 shadow-[0_0_40px_rgba(212,175,55,0.15)] hover:shadow-[0_0_60px_rgba(212,175,55,0.3)] backdrop-blur-2xl px-6 py-6" 
        : "py-6 px-6 bg-white/5 border border-white/10 hover:bg-white/10 shadow-lg backdrop-blur-xl"}`}
    >
      {/* Glow Effect Top-Right */}
      <div className={`absolute -right-20 -top-20 w-40 h-40 rounded-full blur-[80px] transition-all duration-500 group-hover:bg-gold-primary/30 ${featured ? "bg-gold-primary/20" : "bg-gold-primary/5"}`} />

      <div className="flex flex-col h-full justify-between relative z-10 space-y-4">
        <div className="flex justify-between items-start">
          <h3 className={`${featured ? "text-xl font-bold tracking-wide" : "text-lg font-medium"} text-gray-200 group-hover:text-white transition-colors flex items-center gap-2`}>
            {featured && <Sparkles className="text-gold-light" size={20} />}
            {item.name}
          </h3>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center space-x-1 px-2 py-1 rounded-lg text-[10px] uppercase font-bold text-gray-400 bg-white/5 border border-white/10">
              <Activity size={12} className="text-gold-light" />
              <span>Canlı</span>
            </div>
            {/* Technical Signal (Mock Logic for UI Superiority) */}
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${item.priceSelling > item.priceBuying * 1.05 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
              {item.priceSelling > item.priceBuying * 1.05 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {item.priceSelling > item.priceBuying * 1.05 ? 'Güçlü Al' : 'Nötr'}
            </div>
          </div>
        </div>
        
        {/* Alış-Satış Kutuları */}
        <div className="grid grid-cols-2 gap-3 mt-4">
            <div className={`flex flex-col p-3 rounded-xl border ${featured ? "bg-black/40 border-[#333]" : "bg-black/30 border-[#222]"}`}>
                <span className="text-[10px] uppercase font-bold text-gray-500 mb-1 tracking-widest">Alış</span>
                <span className={`${featured ? "text-xl text-white" : "text-lg text-gray-300"} font-black tracking-wide`}>
                    {formatPrice(item.priceBuying)}
                </span>
            </div>
            <div className={`flex flex-col p-3 rounded-xl border relative ${featured ? "bg-gold-primary/10 border-gold-primary/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]" : "bg-white/5 border-[#333]"}`}>
                <span className="text-[10px] uppercase font-bold text-gold-light mb-1 tracking-widest">Satış</span>
                <span className={`${featured ? "text-xl text-gold-light drop-shadow-md" : "text-lg text-white"} font-black tracking-wide`}>
                    {formatPrice(item.priceSelling)}
                </span>
            </div>
        </div>
      </div>
      
    </Link>
  );
}
