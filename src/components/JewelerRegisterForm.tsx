"use client";

import { useFormState, useFormStatus } from "react-dom";
import { AlertCircle, Rocket } from "lucide-react";
import { submitProfile } from "@/lib/actions";

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
      className={`w-full bg-gold-primary text-black font-black py-4 rounded-xl shadow-lg hover:scale-[1.02] transition-transform ${pending ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {pending ? 'İŞLENİYOR...' : 'Profilimi Oluştur ve Başla'}
    </button>
  );
}

export default function JewelerRegisterForm() {
  const [state, formAction] = useFormState(submitProfile, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3 text-red-500 animate-in fade-in slide-in-from-top-2">
           <AlertCircle size={20} className="shrink-0 mt-0.5" />
           <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest">HATA</p>
              <p className="text-xs font-medium leading-relaxed">{state.error}</p>
           </div>
        </div>
      )}

      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Kuyumcu / Mağaza Adı</label>
        <input name="name" required className="w-full bg-black border border-[#222] rounded-xl p-3 text-sm focus:border-gold-primary outline-none" placeholder="Örn: Yıldız Kuyumculuk" />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Adres</label>
        <textarea name="address" required className="w-full bg-black border border-[#222] rounded-xl p-3 text-sm focus:border-gold-primary outline-none h-20" placeholder="Açık adresiniz..." />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Instagram</label>
          <input name="instagram" className="w-full bg-black border border-[#222] rounded-xl p-3 text-sm focus:border-gold-primary outline-none" placeholder="@kullanici" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Web Sitesi</label>
          <input name="website" className="w-full bg-black border border-[#222] rounded-xl p-3 text-sm focus:border-gold-primary outline-none" placeholder="www.kuyumcu.com" />
        </div>
      </div>
      
      <SubmitButton />
    </form>
  );
}
