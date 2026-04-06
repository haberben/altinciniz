import type { AssetItem } from "@/lib/api";
import Link from "next/link";

export default function DataTable({ items, title }: { items: AssetItem[]; title: string }) {
  const formatPrice = (price: number, decimals = 2) =>
    new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(price);

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-[#1a3a6a]/40 shadow-xl bg-[#071428]">
      {/* Başlık */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-[#0e2040] border-b border-[#1a3a6a]/50">
        <h4 className="text-sm font-black text-white uppercase tracking-wider">{title}</h4>
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
          CANLI
        </span>
      </div>

      {/* Tablo */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[480px]" aria-label={title}>
          <thead>
            <tr className="text-[10px] font-black uppercase tracking-widest text-[#4a6a9a] bg-[#060f20] border-b border-[#1a3a6a]/30">
              <th className="px-5 py-3">Ürün / Saat</th>
              <th className="px-4 py-3 text-right border-l border-[#1a3a6a]/20">Alış ₺</th>
              <th className="px-4 py-3 text-right">Satış ₺</th>
              <th className="px-4 py-3 text-center border-l border-[#1a3a6a]/20">Değişim</th>
              <th className="px-3 py-3 text-center">Detay</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const isUp = (item.changePercent ?? 0) >= 0;
              const hasChange = item.changePercent !== undefined;
              const isCurrency = item.type === "currency";
              const decimals = isCurrency ? 4 : 2;

              return (
                <tr
                  key={item.slug}
                  className="border-b border-[#1a3a6a]/20 hover:bg-[#0e2040]/60 transition-colors group"
                >
                  {/* İsim + Saat */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          hasChange && !isUp ? "bg-red-400" : "bg-emerald-400"
                        }`}
                      />
                      <div>
                        <Link
                          href={`/${item.slug}`}
                          className="text-[13px] font-bold text-white group-hover:text-[#D4AF37] transition-colors block leading-tight"
                        >
                          {item.name}
                        </Link>
                        {item.updateTime && (
                          <span className="text-[10px] text-[#4a6a9a] font-mono">
                            {item.updateTime}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Alış */}
                  <td className="px-4 py-3.5 text-right border-l border-[#1a3a6a]/20">
                    <span className="text-[13px] font-semibold text-[#8fa8cc]">
                      {formatPrice(item.priceBuying, decimals)}
                    </span>
                  </td>

                  {/* Satış */}
                  <td className="px-4 py-3.5 text-right">
                    <span className="text-[15px] font-black text-[#D4AF37] drop-shadow-sm">
                      {formatPrice(item.priceSelling, decimals)}
                    </span>
                  </td>

                  {/* Değişim */}
                  <td className="px-4 py-3.5 text-center border-l border-[#1a3a6a]/20">
                    {hasChange ? (
                      <div className={`inline-flex flex-col items-center ${isUp ? "text-emerald-400" : "text-red-400"}`}>
                        <span className="text-[11px] font-black flex items-center gap-0.5">
                          {isUp ? "▲" : "▼"} {Math.abs(item.changePercent!).toFixed(2)}%
                        </span>
                        {item.changeAmount !== undefined && (
                          <span className="text-[9px] font-bold opacity-70">
                            ({isUp ? "+" : ""}{formatPrice(item.changeAmount, 2)})
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[10px] text-[#3a5a8a]">—</span>
                    )}
                  </td>

                  {/* Detay */}
                  <td className="px-3 py-3.5 text-center">
                    <Link
                      href={`/${item.slug}`}
                      className="text-[10px] font-bold px-3 py-1.5 bg-[#0e2040] hover:bg-[#D4AF37] hover:text-black text-[#8fa8cc] rounded-lg transition-all border border-[#1a3a6a]/40 hover:border-[#D4AF37]"
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
