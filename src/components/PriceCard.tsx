import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, Sparkles } from "lucide-react";
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
      className={`block relative group overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-1 
      ${featured 
        ? "col-span-1 bg-gradient-to-br from-[#1a1500]/90 to-black/90 border border-gold-primary/30 shadow-[0_0_40px_rgba(212,175,55,0.15)] hover:shadow-[0_0_60px_rgba(212,175,55,0.3)] backdrop-blur-2xl px-6 py-6" 
        : "py-6 px-6 bg-white/5 border border-white/10 hover:bg-white/10 shadow-lg backdrop-blur-xl"}`}
    >
      {/* Glow Effect Top-Right */}
      <div className={`absolute -right-20 -top-20 w-40 h-40 rounded-full blur-[80px] transition-all duration-500 group-hover:bg-gold-primary/30 ${featured ? "bg-gold-primary/20" : "bg-gold-primary/5"}`} />

      <div className="flex flex-col h-full justify-between relative z-10 space-y-4">
        <div className="flex justify-between items-start">
          <h2 className={`${featured ? "text-xl font-bold tracking-wide" : "text-lg font-medium"} text-gray-200 group-hover:text-white transition-colors flex items-center gap-2`}>
            {featured && <Sparkles className="text-gold-light" size={20} />}
            {item.name}
          </h2>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-bold shadow-sm backdrop-blur-md ${item.isUp ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" : "bg-red-500/15 text-red-400 border border-red-500/20"}`}>
            {item.isUp ? <ArrowUpRight size={14} strokeWidth={3} /> : <ArrowDownRight size={14} strokeWidth={3} />}
            <span>%{Math.abs(item.changePercent).toFixed(2)}</span>
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
