"use client";

import type { AssetItem } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";

const KEY_ASSETS = [
  { slug: "altin-ons",  label: "ALTIN ONS" },
  { slug: "gram-altin", label: "GRAM ALTIN" },
  { slug: "gumus",      label: "GÜMÜŞ" },
  { slug: "usd",        label: "DOLAR" },
  { slug: "eur",        label: "EURO" },
];

export default function Ticker({ items }: { items: AssetItem[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || !items?.length) {
    return <div className="site-ticker" style={{ height: 84 }} />;
  }

  const fmt = (p: number, dec = 2) =>
    new Intl.NumberFormat("tr-TR", { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(p);

  const keyItems = KEY_ASSETS
    .map(k => ({ ...k, item: items.find(i => i.slug === k.slug) }))
    .filter(k => k.item);

  const tickerItems = items.filter(i => i.price > 0);

  return (
    <div className="site-ticker">
      {/* Üst satır: anahtar varlık kutuları */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="page-wrapper">
          <div style={{ display: "flex", overflowX: "auto" }} className="no-scrollbar">
            {keyItems.map(({ slug, label, item }) => {
              if (!item) return null;
              const isUp = (item.changePercent ?? 0) >= 0;
              const dec  = item.type === "currency" ? 4 : 2;
              return (
                <Link
                  key={slug}
                  href={`/${slug}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "10px 20px",
                    borderRight: "1px solid rgba(255,255,255,0.06)",
                    textDecoration: "none",
                    minWidth: 130,
                    flexShrink: 0,
                    transition: "background 0.15s",
                  }}
                  className="hover-ticker-box"
                >
                  <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>
                    {label}
                  </span>
                  <span style={{ fontSize: 15, fontWeight: 900, color: "#ffffff", lineHeight: 1.2, marginTop: 2 }}>
                    {fmt(item.priceSelling, dec)}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#ffffff", opacity: 0.45 }}>
                      {fmt(item.priceBuying, dec)}
                    </span>
                    {item.changePercent !== undefined && (
                      <span style={{ fontSize: 10, fontWeight: 800, color: isUp ? "#4ade80" : "#f87171", marginLeft: 4 }}>
                        {isUp ? "▲" : "▼"} {Math.abs(item.changePercent).toFixed(2)}%
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}

            {/* Son güncelleme */}
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", padding: "0 16px", flexShrink: 0 }}>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
                Fiyatlar canlı güncellenmektedir
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alt satır: kayan tüm varlık şeridi */}
      <div style={{ height: 30, overflow: "hidden", display: "flex", alignItems: "center" }}>
        <div
          style={{ display: "flex", whiteSpace: "nowrap", willChange: "transform" }}
          className="ticker-scroll"
        >
          {[...tickerItems, ...tickerItems].map((item, i) => {
            const isUp = (item.changePercent ?? 0) >= 0;
            const dec  = item.type === "currency" ? 4 : 2;
            return (
              <Link
                key={`${item.slug}-${i}`}
                href={`/${item.slug}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "0 16px",
                  borderRight: "1px solid rgba(255,255,255,0.05)",
                  textDecoration: "none",
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {item.name}
                </span>
                <span style={{ fontSize: 11, fontWeight: 900, color: "#D4AF37" }}>
                  {fmt(item.priceSelling, dec)}
                </span>
                {item.changePercent !== undefined && (
                  <span style={{ fontSize: 9, fontWeight: 800, color: isUp ? "#4ade80" : "#f87171" }}>
                    {isUp ? "▲" : "▼"}{Math.abs(item.changePercent).toFixed(2)}%
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes ticker-run {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-scroll { animation: ticker-run 70s linear infinite; }
        .hover-ticker-box:hover { background: rgba(255,255,255,0.04); }
      `}</style>
    </div>
  );
}
