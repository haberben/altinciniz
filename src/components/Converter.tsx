"use client";

import { useState, useMemo } from "react";
import type { AssetItem } from "@/lib/api";

export default function Converter({ items }: { items: AssetItem[] }) {
  const [amount, setAmount]       = useState<string>("1");
  const [selected, setSelected]   = useState<string>("gram-altin");

  const asset = useMemo(() => items.find(i => i.slug === selected) ?? items[0], [items, selected]);

  const total = useMemo(() => {
    const n = parseFloat(amount);
    if (!n || isNaN(n) || n < 0 || !asset) return 0;
    return n * asset.price;
  }, [amount, asset]);

  const formatted = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(total);

  return (
    <div className="converter-wrap">
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
        <span style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)" }}>Altın Hesaplama Aracı</span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end" }}>
        {/* Miktar */}
        <div style={{ flex: "1 1 100px", minWidth: 100 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
            Miktar
          </label>
          <input
            type="number"
            min="0"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            style={{ width: "100%", fontWeight: 700, fontSize: 15 }}
          />
        </div>

        {/* Ürün seçimi */}
        <div style={{ flex: "2 1 200px", minWidth: 160 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
            Ürün
          </label>
          <select
            value={selected}
            onChange={e => setSelected(e.target.value)}
            style={{ width: "100%", fontWeight: 600, fontSize: 14 }}
          >
            <optgroup label="Altın">
              {items.filter(i => i.type === "gold").map(g => (
                <option key={g.slug} value={g.slug}>{g.name}</option>
              ))}
            </optgroup>
            <optgroup label="Döviz">
              {items.filter(i => i.type === "currency").map(c => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </optgroup>
            <optgroup label="Değerli Madenler">
              {items.filter(i => i.type === "metal").map(m => (
                <option key={m.slug} value={m.slug}>{m.name}</option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Sonuç */}
        <div style={{
          flex: "1 1 140px",
          background: "var(--gold-bg)",
          border: "1px solid var(--gold-border)",
          borderRadius: 8,
          padding: "12px 16px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--gold-dark)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Toplam Tutar</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "var(--text-primary)" }}>{formatted}</div>
        </div>
      </div>
    </div>
  );
}
