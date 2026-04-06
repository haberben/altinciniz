import React from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { AssetItem } from "@/lib/api";

export default function PriceCard({ item }: { item: AssetItem }) {
  const fmt = (p: number, dec = 2) =>
    new Intl.NumberFormat("tr-TR", { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(p) + " ₺";

  const isUp   = (item.changePercent ?? 0) >= 0;
  const hasChg = item.changePercent !== undefined;
  const dec    = item.type === "currency" ? 4 : 2;

  return (
    <Link
      href={`/${item.slug}`}
      className="card"
      style={{
        display: "block",
        padding: "16px 18px",
        textDecoration: "none",
        transition: "box-shadow 0.2s, transform 0.2s",
      }}
      aria-label={`${item.name} canlı fiyat`}
    >
      {/* Başlık */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {item.name}
        </span>
        <span className="live-badge">Canlı</span>
      </div>

      {/* Satış fiyatı */}
      <div style={{ fontSize: 22, fontWeight: 900, color: "var(--text-primary)", lineHeight: 1, marginBottom: 10 }}>
        {fmt(item.priceSelling, dec)}
      </div>

      {/* Alış + değişim */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
          Alış: {fmt(item.priceBuying, dec)}
        </span>
        {hasChg && (
          <span className={isUp ? "badge-up" : "badge-down"}>
            {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {isUp ? "+" : ""}{item.changePercent!.toFixed(2)}%
          </span>
        )}
      </div>
    </Link>
  );
}
