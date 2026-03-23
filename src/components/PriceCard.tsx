import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, Sparkles } from "lucide-react";
import type { AssetItem } from "@/lib/api";

type Props = {
  item: AssetItem;
  featured?: boolean;
};

export default function PriceCard({ item, featured = false }: Props) {
  const formattedPrice = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(item.price);

  return (
    <Link 
      href={`/${item.slug}`} 
      className={`block relative group overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-1 
      ${featured 
        ? "col-span-full md:py-16 md:px-12 bg-gradient-to-br from-[#1a1500]/90 to-black/90 border border-gold-primary/30 shadow-[0_0_40px_rgba(212,175,55,0.15)] hover:shadow-[0_0_60px_rgba(212,175,55,0.3)] backdrop-blur-2xl" 
        : "py-6 px-6 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-gold-primary/40 shadow-lg backdrop-blur-xl"}`}
    >
      {/* Glow Effect Top-Right */}
      <div className={`absolute -right-20 -top-20 w-40 h-40 rounded-full blur-[80px] transition-all duration-500 group-hover:bg-gold-primary/30 ${featured ? "bg-gold-primary/20" : "bg-gold-primary/10"}`} />

      <div className="flex flex-col h-full justify-between relative z-10">
        <div className="flex justify-between items-start">
          <h2 className={`${featured ? "text-2xl md:text-3xl font-semibold tracking-wide" : "text-lg font-medium"} text-gray-200 group-hover:text-white transition-colors flex items-center gap-2`}>
            {featured && <Sparkles className="text-gold-light" size={24} />}
            {item.name}
          </h2>
        </div>
        
        <div className="mt-6 flex items-end justify-between">
          <div className={`${featured ? "text-6xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gold-light via-gold-primary to-gold-dark drop-shadow-sm" : "text-2xl font-bold text-white tracking-wide"}`}>
            {formattedPrice}
          </div>
          
          <div className={`flex flex-col items-end`}>
            <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-bold shadow-sm backdrop-blur-md ${item.isUp ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" : "bg-red-500/15 text-red-400 border border-red-500/20"}`}>
              {item.isUp ? <ArrowUpRight size={18} strokeWidth={3} /> : <ArrowDownRight size={18} strokeWidth={3} />}
              <span>%{Math.abs(item.changePercent).toFixed(2)}</span>
            </div>
            {featured && <span className="text-xs text-gray-500 mt-2 font-medium">Son 24 Saat</span>}
          </div>
        </div>
      </div>
      
      {/* Glow Effect Bottom-Left for Featured */}
      {featured && (
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-gold-primary/10 rounded-full blur-[100px] pointer-events-none" />
      )}
    </Link>
  );
}
