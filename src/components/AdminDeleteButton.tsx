"use client";

import { Trash } from "lucide-react";
import { useFormStatus } from "react-dom";

export default function AdminDeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      className={`h-14 px-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center ${pending ? 'opacity-50 cursor-not-allowed' : ''}`} 
      title="Mağazayı Sil"
      onClick={(e) => {
        if (!window.confirm("Bu mağazayı ve müşteriyi tamamen silmek istediğinize emin misiniz? Bu işlem geri alınamaz!")) {
          e.preventDefault();
        }
      }}
    >
      <Trash size={16} className={pending ? "animate-pulse" : ""} />
    </button>
  );
}
