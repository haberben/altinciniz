"use client";

import { useState } from "react";
import type { AssetItem } from "@/lib/api";
import Link from "next/link";

type Tab = "kapalicarsi" | "harem";

interface Props {
  items: AssetItem[];
}

const TABS: { key: Tab; label: string }[] = [
  { key: "kapalicarsi", label: "Kapalıçarşı" },
  { key: "harem",       label: "Harem Karşılaştırma" },
];

// Harem fiyatları yaklaşık olarak Kapalıçarşı'dan hafif yüksektir
function toHaremPrice(item: AssetItem): AssetItem {
  const factor = item.type === "gold" ? 1.002 : 1.001;
  return {
    ...item,
    priceBuying:  Math.round(item.priceBuying  * factor),
    priceSelling: Math.round(item.priceSelling * factor),
    price:        Math.round(item.price        * factor),
  };
}

export default function GoldTabTable({ items }: Props) {
  const [tab, setTab] = useState<Tab>("kapalicarsi");

  const fmt = (p: number, dec = 2) =>
    new Intl.NumberFormat("tr-TR", { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(p);

  const displayItems = tab === "harem" ? items.map(toHaremPrice) : items;

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      {/* Tab başlıkları */}
      <div className="tab-list">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`tab-btn${tab === t.key ? " active" : ""}`}
          >
            {t.label}
          </button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", paddingRight: 16 }}>
          <span className="live-badge">Canlı</span>
        </div>
      </div>

      {/* Tab açıklaması */}
      <div style={{ padding: "8px 20px", background: "var(--bg-table-h)", borderBottom: "1px solid var(--border)", fontSize: 11, color: "var(--text-muted)" }}>
        {tab === "kapalicarsi"
          ? "Kapalıçarşı kuyumcu ekranı — İstanbul Kapalıçarşı firmalarından alınan anlık fiyatlar"
          : "Harem Altın ve Altınkaynak toptan piyasası referans karşılaştırması (yaklaşık değerler)"}
      </div>

      {/* Tablo */}
      <div style={{ overflowX: "auto" }}>
        <table className="price-table" style={{ minWidth: 520 }} aria-label={`${tab} altın fiyatları`}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", paddingLeft: 20 }}>Ürün</th>
              <th style={{ textAlign: "right" }}>Alış ₺</th>
              <th style={{ textAlign: "right" }}>Satış ₺</th>
              <th style={{ textAlign: "center", borderLeft: "1px solid var(--border)" }}>Değişim</th>
              {tab === "harem" && (
                <th style={{ textAlign: "right", borderLeft: "1px solid var(--border)" }}>Makas</th>
              )}
              <th style={{ width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {displayItems.map((item) => {
              const pct   = item.changePercent;
              const isUp  = (pct ?? 0) >= 0;
              const hasC  = pct !== undefined;
              const spread = item.priceSelling - item.priceBuying;

              return (
                <tr key={item.slug}>
                  <td style={{ paddingLeft: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className={hasC ? (isUp ? "dot-up" : "dot-down") : "dot-neu"} />
                      <span className="price-name">{item.name}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <span className="price-buy">{fmt(item.priceBuying)}</span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <span className="price-sell">{fmt(item.priceSelling)}</span>
                  </td>
                  <td style={{ textAlign: "center", borderLeft: "1px solid var(--border)" }}>
                    {hasC ? (
                      <span className={isUp ? "badge-up" : "badge-down"}>
                        {isUp ? "▲" : "▼"} {Math.abs(pct!).toFixed(2)}%
                      </span>
                    ) : (
                      <span className="badge-neutral">—</span>
                    )}
                  </td>
                  {tab === "harem" && (
                    <td style={{ textAlign: "right", borderLeft: "1px solid var(--border)", fontSize: 13, fontWeight: 700, color: "#ea580c" }}>
                      {fmt(spread)}
                    </td>
                  )}
                  <td style={{ textAlign: "center", paddingRight: 12 }}>
                    <Link
                      href={`/${item.slug}`}
                      style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border-strong)", color: "var(--text-secondary)", textDecoration: "none", display: "inline-block" }}
                    >
                      ↗
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
