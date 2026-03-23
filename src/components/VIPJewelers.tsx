import { createClient } from "@/lib/supabase-server"; // Use server client
import { Star, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function VIPJewelers() {
  const { data: jewelers } = await createClient()
    .from("jeweler_profiles")
    .select("*")
    .eq("is_verified", true)
    .eq("is_approved", true)
    .limit(5);

  if (!jewelers || jewelers.length === 0) return null;

  return (
    <div className="bg-[#0a0a0a] border-b border-white/5 py-4 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 flex items-center gap-8">
        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-gold-primary/20 p-2 rounded-lg border border-gold-primary/20">
            <Star size={14} className="text-gold-light fill-gold-light" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Yıldızlı Kuyumcular</span>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-1">
          {jewelers.map((j) => (
            <Link 
              key={j.id} 
              href={`/kuyumcular/${j.slug}`}
              className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl px-4 py-2 transition-all group shrink-0"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-primary/20 to-black border border-gold-primary/20 flex items-center justify-center text-[10px] font-black text-gold-light">
                {j.name.substring(0, 1)}
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-bold leading-none">{j.name}</p>
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter flex items-center gap-1 group-hover:text-gold-primary transition-colors">
                  Canlı Fiyat Gör <ChevronRight size={10}/>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
