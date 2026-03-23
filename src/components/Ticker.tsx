"use client";

import type { AssetItem } from "@/lib/api";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Ticker({ items }: { items: AssetItem[] }) {
  // SSR (Server Side Rendering) hatasını önlemek için mounted kontrolü
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || !items || items.length === 0) return <div className="h-10 bg-[#0a0a0a] border-b border-[#222]" />;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);
  };

  return (
    <div className="w-full bg-[#0a0a0a] border-b border-[#222] overflow-hidden sticky top-0 z-50">
      <div className="flex w-full whitespace-nowrap" style={{ animation: "marquee 40s linear infinite" }}>
        {/* We duplicate the items array so the ticker loops smoothly */}
        {[...items, ...items, ...items].map((item, index) => (
          <Link
            key={index}
            href={`/${item.slug}`}
            className="inline-flex items-center px-6 py-2 border-r border-[#222] hover:bg-[#111] transition-colors"
          >
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mr-3">{item.name}</span>
            <span className="text-white text-sm font-semibold mr-3">{formatPrice(item.price)}</span>
            <span className={`flex items-center text-xs font-bold ${item.isUp ? "text-emerald-400" : "text-red-400"}`}>
              {item.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              %{Math.abs(item.changePercent).toFixed(2)}
            </span>
          </Link>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
}
