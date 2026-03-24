import { createClient } from "@/lib/supabase-server";
import { Star, ChevronRight, Store } from "lucide-react";
import Link from "next/link";

export default async function VIPJewelers() {
  const { data: allJewelers } = await createClient()
    .from("jeweler_profiles")
    .select("*")
    .eq("is_approved", true)
    .order("sort_order", { ascending: true });

  if (!allJewelers || allJewelers.length === 0) return null;

  const vipJewelers     = allJewelers.filter(j => j.is_verified);
  const regularJewelers = allJewelers.filter(j => !j.is_verified);

  return (
    <div className="space-y-0">

      {/* ── Yıldızlı Kuyumcular ── Grid */}
      {vipJewelers.length > 0 && (
        <section className="bg-gradient-to-r from-gold-primary/8 to-transparent border-y border-gold-primary/15 py-6">
          <div className="max-w-7xl mx-auto px-6">
            {/* Section Label */}
            <div className="flex items-center gap-2 mb-5">
              <div className="bg-gold-primary/20 p-1.5 rounded-lg border border-gold-primary/25">
                <Star size={13} className="text-gold-light fill-gold-light" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-gold-light/80">
                Öne Çıkan Kuyumcular
              </span>
            </div>

            {/* VIP Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {vipJewelers.map((j) => (
                <Link
                  key={j.id}
                  href={`/kuyumcular/${j.slug}`}
                  className="group flex flex-col items-center gap-2 bg-black/30 hover:bg-gold-primary/10 border border-gold-primary/15 hover:border-gold-primary/40 rounded-2xl p-4 transition-all text-center"
                >
                  {/* Avatar / Logo */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-primary/20 to-black border border-gold-primary/25 flex items-center justify-center text-xl font-black text-gold-light overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                    {j.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={j.logo_url} alt={j.name} className="w-full h-full object-cover" />
                    ) : (
                      j.name.substring(0, 1)
                    )}
                  </div>

                  {/* Star Badge */}
                  <div className="flex items-center gap-1">
                    <Star size={9} className="text-gold-primary fill-gold-primary" />
                    <Star size={9} className="text-gold-primary fill-gold-primary" />
                  </div>

                  <p className="text-xs font-bold leading-tight line-clamp-2">{j.name}</p>
                  <p className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter flex items-center gap-0.5 group-hover:text-gold-primary transition-colors">
                    Fiyat Gör <ChevronRight size={9} />
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Tüm Kuyumcular ── Horizontal Swipe Strip */}
      {regularJewelers.length > 0 && (
        <section className="bg-[#0a0a0a] border-b border-white/5 py-4">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-6">
              {/* Label (pinned left) */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="bg-white/5 p-1.5 rounded-lg border border-white/5">
                  <Store size={13} className="text-gray-500" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">
                  Kuyumcular
                </span>
              </div>

              {/* Scrollable strip — native touch scroll, hidden scrollbar */}
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1 flex-1 cursor-grab active:cursor-grabbing">
                {regularJewelers.map((j) => (
                  <Link
                    key={j.id}
                    href={`/kuyumcular/${j.slug}`}
                    className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-gold-primary/20 rounded-xl px-3 py-2 transition-all group shrink-0"
                  >
                    {/* Avatar / Logo */}
                    <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-gray-400 overflow-hidden shrink-0">
                      {j.logo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={j.logo_url} alt={j.name} className="w-full h-full object-cover" />
                      ) : (
                        j.name.substring(0, 1)
                      )}
                    </div>
                    <span className="text-xs font-semibold whitespace-nowrap text-gray-300 group-hover:text-white transition-colors">
                      {j.name}
                    </span>
                    <ChevronRight size={10} className="text-gray-600 group-hover:text-gold-primary transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
