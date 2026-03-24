"use client";

import type { AssetItem } from "@/lib/api";
import { Activity } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Ticker({ items }: { items: AssetItem[] }) {
  // SSR (Server Side Rendering) hatasını önlemek için mounted kontrolü
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || !items || items.length === 0) return <div className="h-10 bg-[#0a0a0a] border-b border-[#222]" />;


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);
  };

  return (
    <div className="w-full bg-[#0a0a0a] border-b border-[#222] overflow-hidden sticky top-0 z-50 flex items-center" style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)" }}>
      {/* Scrolling ticker tape */}
      <div className="flex flex-1 w-0 whitespace-nowrap overflow-hidden" style={{ animation: "marquee 40s linear infinite" }}>
        {/* We duplicate the items array so the ticker loops smoothly */}
        {[...items, ...items, ...items, ...items].map((item, index) => (
          <Link
            key={index}
            href={`/${item.slug}`}
            className="inline-flex items-center px-6 py-2 border-r transition-colors hover:bg-white/5"
            style={{ borderColor: "var(--border-color)" }}
          >
            <span className="text-xs font-bold uppercase tracking-wider mr-3" style={{ color: "var(--text-secondary)" }}>{item.name}</span>
            <span className="text-gold-light text-sm font-black mr-3">{formatPrice(item.priceSelling)}</span>
            <span className="flex items-center text-[10px] font-bold text-emerald-500 uppercase">
              <Activity size={12} className="mr-1" />
              Canlı
            </span>
          </Link>
        ))}
      </div>

      {/* Theme Toggle — always visible on the right */}
      <div className="shrink-0 px-4 border-l" style={{ borderColor: "var(--border-color)", background: "var(--bg-secondary)" }}>
        <ThemeToggle />
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

