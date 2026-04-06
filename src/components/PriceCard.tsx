import React from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import type { AssetItem } from "@/lib/api";

type Props = {
  item: AssetItem;
  featured?: boolean;
};

export default function PriceCard({ item, featured = false }: Props) {
  const formatPrice = (p: number, decimals = 2) =>
    new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(p) + " ₺";

  const isUp = (item.changePercent ?? 0) >= 0;
  const hasChange = item.changePercent !== undefined;
  const isCurrency = item.type === "currency";
  const decimals = isCurrency ? 4 : 2;

  return (
    <Link
      href={`/${item.slug}`}
      prefetch={false}
      aria-label={`${item.name} canlı fiyat detayları`}
      className="block relative group overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-0.5 bg-[#071428] border border-[#1a3a6a]/40 hover:border-[#D4AF37]/40 hover:shadow-[0_0_24px_rgba(212,175,55,0.12)] backdrop-blur-sm px-5 py-4"
    >
      {/* Subtle glow */}
      <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[60px] bg-[#D4AF37]/5 group-hover:bg-[#D4AF37]/10 transition-all duration-500 pointer-events-none" />

      <div className="relative z-10">
        {/* Başlık satırı */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[13px] font-bold text-[#8fa8cc] group-hover:text-white transition-colors">
            {item.name}
          </h3>
          <div className="flex items-center gap-1 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
            <Activity size={9} className="text-emerald-400" />
            <span className="text-[9px] font-black text-emerald-400 uppercase">Canlı</span>
          </div>
        </div>

        {/* Büyük satış fiyatı */}
        <div className="text-2xl font-black text-[#D4AF37] tracking-tight mb-1">
          {formatPrice(item.priceSelling, decimals)}
        </div>

        {/* Alış + Değişim */}
        <div className="flex items-center justify-between">
          <div className="text-[11px] text-[#4a6a9a]">
            Alış:{" "}
            <span className="text-[#8fa8cc] font-semibold">
              {formatPrice(item.priceBuying, decimals)}
            </span>
          </div>
          {hasChange && (
            <div
              className={`flex items-center gap-0.5 text-[11px] font-black px-2 py-0.5 rounded ${
                isUp
                  ? "bg-emerald-400/10 text-emerald-400"
                  : "bg-red-400/10 text-red-400"
              }`}
            >
              {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {isUp ? "+" : ""}{item.changePercent!.toFixed(2)}%
            </div>
          )}
        </div>

        {/* Güncelleme saati */}
        {item.updateTime && (
          <div className="text-[9px] text-[#2a4a6a] font-mono mt-1.5">{item.updateTime}</div>
        )}
      </div>
    </Link>
  );
}
