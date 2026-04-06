"use client";

import type { AssetItem } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { TrendingUp, TrendingDown } from "lucide-react";

const KEY_SLUGS = ["altin-ons", "gram-altin", "gumus", "usd", "eur"];
const KEY_LABELS: Record<string, string> = {
  "altin-ons": "ALTIN ONS",
  "gram-altin": "GRAM ALTIN",
  "gumus": "GÜMÜŞ",
  "usd": "DOLAR",
  "eur": "EURO",
};

export default function Ticker({ items }: { items: AssetItem[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || !items || items.length === 0)
    return <div className="h-14 bg-[#071428] border-b border-[#1a3a6a]" />;

  const formatPrice = (price: number, decimals = 2) =>
    new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(price);

  // Üstte gösterilecek kritik varlıklar
  const keyItems = KEY_SLUGS
    .map(slug => items.find(i => i.slug === slug))
    .filter(Boolean) as AssetItem[];

  // Kayan şerit için tüm varlıklar
  const tickerItems = items.filter(i => i.price > 0);

  return (
    <div className="sticky top-0 z-50 w-full bg-[#071428] border-b border-[#1a3a6a] shadow-lg">
      {/* ÜST BAR: Kritik bilgi kutuları */}
      <div className="flex items-stretch border-b border-[#1a3a6a]/50 overflow-x-auto scrollbar-none">
        {keyItems.map((item) => {
          const isUp = (item.changePercent ?? 0) >= 0;
          const pct = item.changePercent;
          return (
            <Link
              key={item.slug}
              href={`/${item.slug}`}
              className="flex-shrink-0 flex flex-col px-4 py-2 border-r border-[#1a3a6a]/50 hover:bg-[#0e2040] transition-colors min-w-[120px]"
            >
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider text-[#8fa8cc]">
                  {KEY_LABELS[item.slug] ?? item.name}
                </span>
              </div>
              <span className="text-sm font-black text-white leading-tight mt-0.5">
                {formatPrice(item.priceSelling, item.type === "currency" ? 4 : 2)}
              </span>
              {pct !== undefined ? (
                <div className={`flex items-center gap-0.5 text-[10px] font-bold mt-0.5 ${isUp ? "text-emerald-400" : "text-red-400"}`}>
                  {isUp ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                  {isUp ? "+" : ""}{pct.toFixed(2)}%
                </div>
              ) : (
                <div className="text-[10px] text-gray-600 mt-0.5">—</div>
              )}
            </Link>
          );
        })}

        {/* Theme Toggle sağ köşe */}
        <div className="ml-auto flex-shrink-0 flex items-center px-4 border-l border-[#1a3a6a]/50">
          <ThemeToggle />
        </div>
      </div>

      {/* ALT BAR: Kayan ticker şeridi */}
      <div className="flex items-center h-8 overflow-hidden">
        <div
          className="flex whitespace-nowrap"
          style={{ animation: "ticker-scroll 60s linear infinite" }}
        >
          {[...tickerItems, ...tickerItems].map((item, i) => {
            const isUp = (item.changePercent ?? 0) >= 0;
            return (
              <Link
                key={`${item.slug}-${i}`}
                href={`/${item.slug}`}
                className="inline-flex items-center gap-2 px-4 border-r border-[#1a3a6a]/30 hover:bg-[#0e2040] transition-colors h-8"
              >
                <span className="text-[10px] font-bold text-[#6a8aaa] uppercase tracking-wide">
                  {item.name}
                </span>
                <span className="text-[11px] font-black text-[#D4AF37]">
                  {formatPrice(item.priceSelling, item.type === "currency" ? 4 : 2)}
                </span>
                {item.changePercent !== undefined && (
                  <span className={`text-[9px] font-bold ${isUp ? "text-emerald-400" : "text-red-400"}`}>
                    {isUp ? "▲" : "▼"} {Math.abs(item.changePercent).toFixed(2)}%
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes ticker-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .scrollbar-none::-webkit-scrollbar { display: none; }
          .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
        `
      }} />
    </div>
  );
}
