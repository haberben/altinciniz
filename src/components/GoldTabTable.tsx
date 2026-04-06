"use client";

import { useState } from "react";
import type { AssetItem } from "@/lib/api";
import Link from "next/link";

type TabKey = "kapalicarsi" | "serbest" | "harem";

interface Props {
  kapalicarsiItems: AssetItem[];     // Kapalıçarşı/Kuyumcu fiyatları
  serbestItems: AssetItem[];          // Serbest piyasa fiyatları (if available)
  haremItems?: AssetItem[];           // Harem/toptan fiyatları (if available)
}

const TABS: { key: TabKey; label: string; badge?: string }[] = [
  { key: "kapalicarsi", label: "Kapalıçarşı", badge: "CANLI" },
  { key: "serbest", label: "Serbest Piyasa" },
  { key: "harem", label: "Harem Karşılaştırma" },
];

export default function GoldTabTable({ kapalicarsiItems, serbestItems, haremItems }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("kapalicarsi");

  const formatPrice = (price: number, decimals = 2) =>
    new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(price);

  const getItems = () => {
    if (activeTab === "kapalicarsi") return kapalicarsiItems;
    if (activeTab === "serbest") return serbestItems.length > 0 ? serbestItems : kapalicarsiItems;
    if (activeTab === "harem") return haremItems && haremItems.length > 0 ? haremItems : kapalicarsiItems;
    return kapalicarsiItems;
  };

  const currentItems = getItems();

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-[#1a3a6a]/40 shadow-xl bg-[#071428]">
      {/* Sekme başlıkları */}
      <div className="flex border-b border-[#1a3a6a]/50 bg-[#060f20]">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-3.5 text-xs font-black tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
              activeTab === tab.key
                ? "border-[#D4AF37] text-[#D4AF37] bg-[#0e2040]"
                : "border-transparent text-[#4a6a9a] hover:text-[#8fa8cc] hover:bg-[#0a1830]"
            }`}
          >
            {tab.label}
            {tab.badge && activeTab === tab.key && (
              <span className="bg-emerald-400/20 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded-full border border-emerald-400/30">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Sekme açıklaması */}
      <div className="px-5 py-2.5 bg-[#071428] border-b border-[#1a3a6a]/20 text-[10px] text-[#3a5a8a]">
        {activeTab === "kapalicarsi" &&
          "Kuyumcu ekranı verileri İstanbul Kapalıçarşı altın firmalarından alınan fiyatlardan oluşmaktadır."}
        {activeTab === "serbest" &&
          "Serbest piyasa fiyatları genel borsa ve toptan alım satım verilerini yansıtır."}
        {activeTab === "harem" &&
          "Harem Altın ve benzeri toptan piyasa fiyatlarıyla Kapalıçarşı fiyatlarının karşılaştırması."}
      </div>

      {/* Tablo */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[480px]" aria-label={`${activeTab} altın fiyatları`}>
          <thead>
            <tr className="text-[10px] font-black uppercase tracking-widest text-[#4a6a9a] bg-[#060f20] border-b border-[#1a3a6a]/30">
              <th className="px-5 py-3">Ürün / Saat</th>
              <th className="px-4 py-3 text-right border-l border-[#1a3a6a]/20">Alış ₺</th>
              <th className="px-4 py-3 text-right">Satış ₺</th>
              <th className="px-4 py-3 text-center border-l border-[#1a3a6a]/20">Değişim</th>
              {activeTab === "harem" && (
                <th className="px-4 py-3 text-right border-l border-[#1a3a6a]/20">Makas</th>
              )}
              <th className="px-3 py-3 text-center">↗</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => {
              const isUp = (item.changePercent ?? 0) >= 0;
              const hasChange = item.changePercent !== undefined;
              const spread = item.priceSelling - item.priceBuying;

              return (
                <tr
                  key={item.slug}
                  className="border-b border-[#1a3a6a]/20 hover:bg-[#0e2040]/60 transition-colors group"
                >
                  {/* İsim + Saat */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${hasChange && !isUp ? "bg-red-400" : "bg-emerald-400"}`} />
                      <div>
                        <Link
                          href={`/${item.slug}`}
                          className="text-[13px] font-bold text-white group-hover:text-[#D4AF37] transition-colors block leading-tight"
                        >
                          {item.name}
                        </Link>
                        {item.updateTime && (
                          <span className="text-[10px] text-[#4a6a9a] font-mono">{item.updateTime}</span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Alış */}
                  <td className="px-4 py-3.5 text-right border-l border-[#1a3a6a]/20">
                    <span className="text-[13px] font-semibold text-[#8fa8cc]">
                      {formatPrice(item.priceBuying)}
                    </span>
                  </td>

                  {/* Satış */}
                  <td className="px-4 py-3.5 text-right">
                    <span className="text-[15px] font-black text-[#D4AF37]">
                      {formatPrice(item.priceSelling)}
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
                            ({isUp ? "+" : ""}{formatPrice(item.changeAmount)})
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[10px] text-[#3a5a8a]">—</span>
                    )}
                  </td>

                  {/* Makas (sadece harem sekmesinde) */}
                  {activeTab === "harem" && (
                    <td className="px-4 py-3.5 text-right border-l border-[#1a3a6a]/20">
                      <span className="text-[12px] font-bold text-orange-400">
                        {formatPrice(spread)}
                      </span>
                    </td>
                  )}

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
