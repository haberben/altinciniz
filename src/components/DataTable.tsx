import type { AssetItem } from "@/lib/api";
import Link from "next/link";

interface Props {
  items: AssetItem[];
  title: string;
  showTime?: boolean;
}

export default function DataTable({ items, title, showTime = false }: Props) {
  const fmt = (p: number, dec = 2) =>
    new Intl.NumberFormat("tr-TR", { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(p);

  if (!items?.length) return null;

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      {/* Başlık */}
      <div className="card-header">
        <span className="card-header-title">{title}</span>
        <span className="live-badge">Canlı</span>
      </div>

      {/* Tablo */}
      <div style={{ overflowX: "auto" }}>
        <table className="price-table" style={{ minWidth: 480 }} aria-label={title}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", paddingLeft: 20 }}>Ürün</th>
              <th style={{ textAlign: "right" }}>Alış ₺</th>
              <th style={{ textAlign: "right" }}>Satış ₺</th>
              <th style={{ textAlign: "center", borderLeft: "1px solid var(--border)" }}>Değişim</th>
              <th style={{ textAlign: "center", width: 60 }}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const pct      = item.changePercent;
              const isUp     = (pct ?? 0) >= 0;
              const hasChg   = pct !== undefined;
              const dec      = item.type === "currency" ? 4 : 2;

              return (
                <tr key={item.slug}>
                  {/* İsim */}
                  <td style={{ paddingLeft: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className={hasChg ? (isUp ? "dot-up" : "dot-down") : "dot-neu"} />
                      <div>
                        <span className="price-name">{item.name}</span>
                        {showTime && item.changePercent !== undefined && (
                          <span className="price-time" style={{ display: "block" }}>canlı</span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Alış */}
                  <td style={{ textAlign: "right" }}>
                    <span className="price-buy">{fmt(item.priceBuying, dec)}</span>
                  </td>

                  {/* Satış */}
                  <td style={{ textAlign: "right" }}>
                    <span className="price-sell">{fmt(item.priceSelling, dec)}</span>
                  </td>

                  {/* Değişim */}
                  <td style={{ textAlign: "center", borderLeft: "1px solid var(--border)" }}>
                    {hasChg ? (
                      <span className={isUp ? "badge-up" : "badge-down"}>
                        {isUp ? "▲" : "▼"} {Math.abs(pct!).toFixed(2)}%
                      </span>
                    ) : (
                      <span className="badge-neutral">—</span>
                    )}
                    {item.changeAmount !== undefined && item.changeAmount !== 0 && (
                      <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>
                        ({item.changeAmount > 0 ? "+" : ""}{fmt(item.changeAmount)})
                      </div>
                    )}
                  </td>

                  {/* Detay */}
                  <td style={{ textAlign: "center" }}>
                    <Link
                      href={`/${item.slug}`}
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "4px 10px",
                        borderRadius: 6,
                        border: "1px solid var(--border-strong)",
                        color: "var(--text-secondary)",
                        textDecoration: "none",
                        display: "inline-block",
                        transition: "all 0.15s",
                      }}
                    >
                      Detay
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
