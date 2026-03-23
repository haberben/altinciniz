"use client";

import { useFormState, useFormStatus } from "react-dom";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { createJewelerAdmin } from "@/lib/actions";
import { useEffect, useRef } from "react";

const initialState = {
  success: false,
  error: null as string | null,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      className={`h-16 px-12 bg-gold-primary text-black rounded-[28px] font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all flex items-center gap-3 shadow-xl shadow-gold-primary/20 ${pending ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {pending ? 'İŞLENİYOR...' : 'KULLANICI VE MAĞAZA OLUŞTUR'} <ArrowRight size={18} />
    </button>
  );
}

export default function AdminCreateStoreForm() {
  const [state, formAction] = useFormState(createJewelerAdmin, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success && formRef.current) {
        formRef.current.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="max-w-xl space-y-6">
      {state.success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-3xl flex items-center gap-4 text-emerald-500 animate-in fade-in slide-in-from-top-4 duration-500">
           <CheckCircle2 size={24} />
           <p className="text-sm font-bold">Mağaza ve Kullanıcı başarıyla oluşturuldu!</p>
        </div>
      )}

      {state.error && (
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl flex items-start gap-4 text-red-500 animate-in fade-in slide-in-from-top-4 duration-500">
           <AlertCircle size={24} className="shrink-0 mt-0.5" />
           <div className="space-y-1">
              <p className="text-sm font-black uppercase tracking-widest">HATA OLUŞTU</p>
              <p className="text-xs font-medium opacity-80 leading-relaxed">{state.error}</p>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">MÜŞTERİ MAİL (GİRİŞ İÇİN)</label>
          <input name="email" type="email" required placeholder="ornek@mail.com" className="w-full h-16 bg-white/5 border border-white/10 rounded-[28px] px-8 outline-none focus:border-gold-primary transition-all font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">GEÇİCİ ŞİFRE</label>
          <input name="password" type="text" required placeholder="Sifre123..." className="w-full h-16 bg-white/5 border border-white/10 rounded-[28px] px-8 outline-none focus:border-gold-primary transition-all font-bold" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">MAĞAZA ADI</label>
        <input name="name" required placeholder="Örn: Lizbon Kuyumculuk" className="w-full h-16 bg-white/5 border border-white/10 rounded-[28px] px-8 outline-none focus:border-gold-primary transition-all font-bold" />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">ADRES</label>
        <input name="address" required placeholder="Şehir, Mahalle vb." className="w-full h-16 bg-white/5 border border-white/10 rounded-[28px] px-8 outline-none focus:border-gold-primary transition-all font-bold" />
      </div>
      
      <SubmitButton />
    </form>
  );
}
