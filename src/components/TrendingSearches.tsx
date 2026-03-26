"use client";

import React from 'react';
import Link from 'next/link';
import { Search, TrendingUp, Hash } from 'lucide-react';

const trends = [
  { label: "Gram Altın Fiyatı", slug: "gram-altin" },
  { label: "Gram Altın Ne Kadar Bugün?", slug: "gram-altin" },
  { label: "Gram Altın 2026 Tahminleri", slug: "altin/gram-altin-fiyati-2026" },
  { label: "Dün Altın Ne Kadardı?", slug: "altin/gram-altin-dun-ne-kadardi" },
  { label: "24 Ayar Gram Altın", slug: "gram-altin" },
  { label: "22 Ayar Gram Altın", slug: "22-ayar-bilezik" },
  { label: "Gram Altın Grafik", slug: "gram-altin" },
  { label: "Gram Altın Harem", slug: "gram-altin" },
  { label: "Yarım Gram Altın Fiyatı", slug: "gram-altin" },
  { label: "Gram Altın Satış Fiyatı", slug: "gram-altin" },
  { label: "Çeyrek Altın Ne Kadar?", slug: "ceyrek-altin" },
  { label: "Altın Hesaplama Robotu", slug: "hesaplama" },
  { label: "22 Ayar Bilezik 2026", slug: "altin/22-ayar-bilezik-fiyatlari-2026" }
];

export default function TrendingSearches() {
  return (
    <section className="py-12 border-t border-white/5 bg-black/20">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-gold-primary/10 rounded-lg">
            <TrendingUp size={20} className="text-gold-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Trend Aramalar</h3>
            <p className="text-sm text-gray-500">Google üzerinde en çok aratılan altın ve döviz terimleri</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {trends.map((trend, index) => (
            <Link
              key={index}
              href={`/${trend.slug}`}
              prefetch={false}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-gold-primary/10 border border-white/10 hover:border-gold-primary/30 rounded-full text-sm text-gray-400 hover:text-gold-light transition-all duration-300 group"
            >
              <Hash size={14} className="text-gray-600 group-hover:text-gold-primary transition-colors" />
              <span>{trend.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
