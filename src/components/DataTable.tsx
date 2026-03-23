import type { AssetItem } from "@/lib/api";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";

export default function DataTable({ items, title }: { items: AssetItem[], title: string }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);
  };

  return (
    <div className="w-full bg-surface border border-[#222] rounded-2xl overflow-hidden shadow-xl backdrop-blur-md">
      <div className="bg-[#111] px-6 py-5 border-b border-[#222]">
        <h3 className="text-xl font-bold text-gray-200 tracking-wide">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="bg-[#0a0a0a] text-gray-500 text-[11px] font-black uppercase tracking-widest border-b border-[#222]">
              <th className="px-6 py-4">Piyasa / Ürün</th>
              <th className="px-6 py-4 text-right border-l border-[#222]/50">Alış (TL)</th>
              <th className="px-6 py-4 text-right">Satış (TL)</th>
              <th className="px-6 py-4 text-center border-l border-[#222]/50">Yön/Değişim</th>
              <th className="px-4 py-4 text-center">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222]">
            {items.map((item) => (
              <tr key={item.slug} className="hover:bg-white/5 transition-colors group pl-4">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-3 ${item.isUp ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                    <span className="text-[15px] font-bold text-white tracking-wide">{item.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right border-l border-[#222]/30">
                  <span className="text-[15px] font-semibold text-gray-400 tracking-wide">
                    {formatPrice(item.priceBuying)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-[16px] font-black text-gold-light drop-shadow-sm tracking-wide">
                    {formatPrice(item.priceSelling)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center border-l border-[#222]/30">
                  <div className={`inline-flex items-center justify-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-bold w-24 ${item.isUp ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                    {item.isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    <span>%{Math.abs(item.changePercent).toFixed(2)}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  <Link href={`/${item.slug}`} className="text-xs font-bold px-4 py-2 bg-[#111] hover:bg-gold-primary hover:text-black text-gray-300 rounded-lg transition-all border border-[#333] hover:border-gold-primary">
                    Detay
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
