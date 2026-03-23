"use client";

import { siteConfig } from "@/config/siteConfig";

export default function AdBanner() {
  if (!siteConfig.ads.showAds) {
    return null; // Reklam kapalıysa hiçbir şey render etme (Tasarım otomatik uyum sağlar)
  }

  return (
    <div className="w-full max-w-5xl mx-auto my-6 animate-fade-in relative z-10 group overflow-hidden rounded-xl bg-surface border border-[#333]">
      <div className="absolute top-0 right-0 bg-black/60 text-[10px] text-gray-400 px-2 py-1 rounded-bl-lg z-20">
        Sponsorlu
      </div>
      <a 
        href={siteConfig.ads.targetUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block w-full"
      >
        <img 
          src={siteConfig.ads.imageUrl} 
          alt={siteConfig.ads.altText} 
          className="w-full h-auto object-cover max-h-[120px] md:max-h-[200px] transition-transform duration-500 group-hover:scale-[1.02]"
          loading="lazy"
        />
      </a>
    </div>
  );
}
