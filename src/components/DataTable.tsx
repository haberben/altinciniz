import type { AssetItem } from "@/lib/api";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";

export default function DataTable({ items, title }: { items: AssetItem[], title: string }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);
  };

  return (
    <div className="w-full bg-surface border border-[#222] rounded-2xl overflow-hidden shadow-xl backdrop-blur-md">
      <div className="bg-[#111] px-6 py-4 border-b border-[#222]">
        <h3 className="text-lg font-bold text-gray-300">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0a0a0a] text-gray-500 text-xs uppercase tracking-wider border-b border-[#222]">
              <th className="px-6 py-4 font-semibold">Piyasa / Ürün</th>
              <th className="px-6 py-4 font-semibold text-right">Alış/Satış (TL)</th>
              <th className="px-6 py-4 font-semibold text-right">Günlük Değişim</th>
              <th className="px-6 py-4 font-semibold text-center">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222]">
            {items.map((item) => (
              <tr key={item.slug} className="hover:bg-white/5 transition-colors group pl-4">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-3 ${item.isUp ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-semibold text-gray-200">{item.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm md:text-base font-bold text-white tracking-wide">
                    {formatPrice(item.price)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className={`inline-flex items-center space-x-1 text-sm font-bold ${item.isUp ? "text-emerald-400" : "text-red-400"}`}>
                    {item.isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    <span>%{Math.abs(item.changePercent).toFixed(2)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <Link href={`/${item.slug}`} className="text-xs font-bold px-4 py-2 bg-[#222] hover:bg-gold-primary hover:text-black text-gray-300 rounded-lg transition-colors border border-[#333] hover:border-gold-primary">
                    Detaylar
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
