import Link from "next/link";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
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
      className={`block relative group overflow-hidden rounded-2xl bg-surface border border-[#222] transition-all duration-300 hover:border-gold-primary/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] px-6 py-6 
      ${featured ? "col-span-full md:py-12 bg-gradient-to-br from-surface to-black border-gold-primary/30" : ""}`}
    >
      <div className="flex flex-col h-full justify-between relative z-10">
        <h2 className={`${featured ? "text-2xl md:text-3xl" : "text-lg"} font-medium text-gray-300 group-hover:text-white transition-colors`}>
          {item.name}
        </h2>
        
        <div className="mt-4 flex items-end justify-between">
          <div className={`${featured ? "text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gold-light to-gold-primary" : "text-2xl font-bold text-white"}`}>
            {formattedPrice}
          </div>
          
          <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium ${item.isUp ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
            {item.isUp ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
            <span>%{Math.abs(item.changePercent).toFixed(2)}</span>
          </div>
        </div>
      </div>
{featured && (
  <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-gold-primary/5 rounded-full blur-3xl group-hover:bg-gold-primary/10 transition-colors pointer-events-none" />
)}
    </Link>
  );
}
