import { Info, TrendingUp, Calculator, HelpCircle, BarChart2, ShieldCheck, Landmark, Globe } from "lucide-react";

export default function RichSEOContent() {
  return (
    <section className="mt-24 space-y-20 py-16 border-t border-white/5">
      <div className="max-w-5xl mx-auto space-y-16 text-gray-300 leading-relaxed text-[17px]">
        
        {/* Giriş: Gram Altın Nedir? */}
        <div className="space-y-8 animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-gold-primary/10 px-4 py-2 rounded-full border border-gold-primary/20 text-gold-primary text-xs font-black uppercase tracking-widest mb-4">
             Finans Rehberi
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">
            Gram Altın Nedir? <br/>
            <span className="text-gold-primary italic text-3xl md:text-4xl">Yatırımcılar İçin Güvenli Liman Rehberi</span>
          </h2>
          <p className="border-l-2 border-gold-primary/30 pl-6 py-2 italic font-medium text-xl text-white/80">
            "Gram altın, yatırım dünyasında istikrarın ve likiditenin sembolüdür."
          </p>
          <p>
            Türkiye finans piyasalarında ve halk arasında en çok tercih edilen güvenli liman olan <strong>gram altın</strong>, temel olarak 24 ayar (has) altının 1 gramlık ağırlığını temsil eden birimdir. Kuyumculardaki fiziki alımlardan banka altın mevduat hesaplarına kadar geniş bir yelpazede standart birim olarak kabul edilir.
          </p>
          <p>
            Genellikle 995.0 veya 999.9 saflık derecesinde işlem gören bu değerli metal, dünyadaki enflasyonist baskılara ve ekonomik belirsizliklere karşı "alım gücünü koruma" özelliğiyle bilinir. Altıncınız olarak sunduğumuz <strong>canlı gram altın fiyatları</strong>, sadece bir rakam değil; Kapalıçarşı piyasasının kalbi ve küresel ekonominin Türk Lirası üzerindeki anlık yansımasıdır.
          </p>
        </div>

        {/* Bölüm: Gram Altın Nasıl Hesaplanır? */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[40px] p-8 md:p-14 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-primary/5 rounded-full blur-[100px] -mr-48 -mt-48 transition-all group-hover:bg-gold-primary/10" />
          
          <div className="relative z-10 space-y-10">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-4">
              <Calculator className="text-gold-primary" size={40} />
              Altın Hesaplama: 22 Ayar ve 24 Ayar Farkı
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 text-base text-gray-400">
                <p>
                  Google üzerinde en çok aratılan <strong>"gram altın ne kadar 22 ayar"</strong> ve <strong>"gram altın ne kadar 24 ayar"</strong> soruları genellikle kafa karışıklığına yol açar. 24 ayar altın %99.9 saflıkla "Has Altın" olarak adlandırılırken, 22 ayar altın %91.6 saflıktadır. 
                </p>
                <p>
                  Hesaplama yaparken, 24 ayar gram fiyatını 0.916 katsayısı ile çarparak yaklaşık 22 ayar değerini bulabilirsiniz. Sitemizdeki <strong>gram altın hesaplama aracı</strong>, bu işlemi sizin için otomatik olarak yapar ve en güncel verileri sunar.
                </p>
                <div className="bg-black/60 p-8 rounded-3xl border border-gold-primary/30 text-center font-mono group-hover:border-gold-primary/50 transition-colors">
                  <span className="text-gray-500 text-xs block mb-3 uppercase tracking-widest font-sans">Ayar Dönüştürme Katsayısı</span>
                  <div className="text-gold-light text-2xl md:text-3xl font-black drop-shadow-sm">
                    24 Ayar Fiyatı × 0.9160 = <span className="text-white">22 Ayar (₺)</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 rounded-3xl p-8 border border-white/5 space-y-6">
                <h3 className="text-white font-black text-lg uppercase tracking-tight">Hesaplama Örneği:</h3>
                <ul className="space-y-4 text-[15px]">
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-500">Ons Altın Fiyatı:</span>
                    <span className="font-bold text-white">$2,150.00</span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-500">USD/TRY Kuru:</span>
                    <span className="font-bold text-white">₺32.40</span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-500">Gram Karşılığı (Ons/31.1):</span>
                    <span className="font-bold text-gold-light">$69.12</span>
                  </li>
                  <li className="flex justify-between pt-2">
                    <span className="text-white font-black">Sonuç (Canlı Gram):</span>
                    <span className="font-black text-emerald-400 text-xl">₺2,239.50</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bölüm: Neden Yükselir? */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-6">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
              <TrendingUp className="text-emerald-500" size={28} />
            </div>
            <h3 className="text-3xl font-black text-white tracking-tighter">Gram Altın Neden Yükselir?</h3>
            <p className="text-gray-400">
              Gram altının yükselişi genellikle üç ana tetikleyiciye bağlıdır. Birincisi, jeopolitik krizlerdir. Savaş, terör veya küresel siyasi gerilimler yatırımcıyı "riskli" varlıklardan kaçırıp "güvenli liman" altına yönlendirir. İkincisi, enflasyondur. Para birimleri değer kaybederken altın sınırlı arzı nedeniyle değerini korur. 
            </p>
            <p className="text-gray-400">
              Üçüncü ve en önemli yerel faktör ise <strong>dolar kurudur</strong>. Ons fiyatı dünya genelinde düşse bile, Türk Lirası dolar karşısında değer kaybederse gram altın Türkiye'de yükselmeye devam edebilir.
            </p>
          </div>
          <div className="space-y-6">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
              <BarChart2 className="text-blue-500" size={28} />
            </div>
            <h3 className="text-3xl font-black text-white tracking-tighter">Ons Altın ile İlişkisi</h3>
            <p className="text-gray-400">
              Ons altın, küresel altının "kalp ritmidir". New York, Londra ve Hong Kong borsaları üzerinden dönen bu rakam, altının dünya genelindeki geçerli takas değerini belirler. Gram altın yatırımcısı, dolar kurunu takip ettiği kadar <strong>ons grafiğini</strong> de takip etmelidir. 
            </p>
            <p className="text-gray-400">
              Eğer dolar kuru stabilse, gram altındaki tüm değişim ons piyasasından kaynaklanır. Ancak 2026 beklentilerine bakıldığında analistler, ons altının yeni rekorlara koşabileceğini ve bunun yerel piyasadaki <strong>22 ayar, 24 ayar gram altın</strong> fiyatlarını yukarı yönlü güçlü bir şekilde baskılayabileceğini belirtiyor.
            </p>
          </div>
        </div>

        {/* Bölüm: Rakip Analizi (Harem, Altınkaynak, Bigpara) */}
        <div className="bg-gradient-to-br from-[#111] to-black border border-white/5 rounded-[40px] p-8 md:p-14 space-y-10">
          <div className="flex flex-col md:flex-row gap-10">
            <div className="md:w-1/3 shrink-0 py-4">
               <div className="p-8 bg-blue-500/5 rounded-3xl border border-blue-500/10 text-center space-y-4">
                  <Globe className="text-blue-400 mx-auto" size={48} />
                  <span className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] block">Piyasa Devleri</span>
                  <p className="text-gray-500 text-xs">Harem Altın, Altınkaynak ve Bigpara gibi dev platformlar piyasanın referans noktalarıdır.</p>
               </div>
            </div>
            <div className="md:w-2/3 space-y-8">
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter">
                Harem Altın, Altınkaynak ve <span className="text-gold-primary">Büyük Piyasaların Analizi</span>
              </h2>
              <p>
                Yatırımcılar sıkça <strong>Harem Altın canlı</strong>, <strong>Altınkaynak altın fiyatları</strong> ve <strong>Bigpara altın</strong> kurlarını karşılaştırır. Bu platformlar toptan piyasayı yansıtırken, Altıncınız olarak biz; bu verileri süzgeçten geçirerek en saf Kapalıçarşı fiyatlarını sunuyoruz. 
              </p>
              <p className="text-white/80 font-bold italic">
                "Harem Altın ve Kapalıçarşı arasındaki makas aralığını anlık olarak takip etmek, karlı bir yatırım için olmazsa olmazdır."
              </p>
              <p>
                2026 yılı beklentilerinde, <strong>gram altın grafik</strong> verileri incelendiğinde rakiplerimizin sunduğu verilerle tam uyumlu, ancak kullanıcı deneyimi açısından daha hızlı bir akış sağlıyoruz. Ons ve dolar kuru pariteleri, Harem piyasasının kalbinden doğrudan ekranınıza yansır.
              </p>
            </div>
          </div>
        </div>

        {/* Bölüm: Neden Altıncınız? */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-4 hover:border-gold-primary/30 transition-colors">
              <ShieldCheck className="text-gold-primary" size={32} />
              <h3 className="text-white font-black italic uppercase tracking-tighter">Şeffaf Veri</h3>
              <p className="text-sm text-gray-500">Manipülasyondan uzak, doğrudan Kapalıçarşı merkezli canlı likidite akışlarını yansıtıyoruz.</p>
           </div>
           <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-4 hover:border-gold-primary/30 transition-colors">
              <Globe className="text-blue-400" size={32} />
              <h3 className="text-white font-black italic uppercase tracking-tighter">Küresel Entegrasyon</h3>
              <p className="text-sm text-gray-500">Global ons ve yerel dolar paritelerini saniyeler içinde işleyerek Türkiye kurlarını hesaplıyoruz.</p>
           </div>
           <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-4 hover:border-gold-primary/30 transition-colors">
              <Calculator className="text-emerald-400" size={32} />
              <h3 className="text-white font-black italic uppercase tracking-tighter">Akıllı Araçlar</h3>
              <p className="text-sm text-gray-500">Sadece fiyat göstermiyor, elinizdeki birikimi anında TL'ye çeviren gelişmiş araçlar sunuyoruz.</p>
           </div>
        </div>

        {/* Bölüm: Kurumsal SSS (Structured Data Support) */}
        <div className="space-y-12">
          <div className="text-center space-y-4">
             <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter">Merak Edilen Sorular</h2>
             <p className="text-gray-500 text-lg">Finansal bilincinizi artıracak kısa bilgiler.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0f0f0f] p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all group">
              <h3 className="font-black text-white mb-4 group-hover:text-gold-primary transition-colors flex items-center gap-2">
                 <HelpCircle size={18} /> 22 ayar gram altın ile 24 ayar farkı nedir?
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                24 ayar altın, %99.9 saflıktadır ve genellikle "has altın" olarak bilinir. 22 ayar ise %91.6 oranında altın içerir, kalanı genellikle bakır veya gümüş gibi metallerdir (bileziklerde dayanıklılık için tercih edilir). Yatırım için makas payı düşük olan 24 ayar has gram tercih edilir.
              </p>
            </div>
            <div className="bg-[#0f0f0f] p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all group">
              <h3 className="font-black text-white mb-4 group-hover:text-gold-primary transition-colors flex items-center gap-2">
                 <HelpCircle size={18} /> Harem Altın verileri neden önemlidir?
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Harem Altın, Kapalıçarşı'nın en büyük toptan altın merkezlerinden biridir. Türkiye'deki çoğu kuyumcu kendi fiyatlarını bu toptan akışlara göre belirler. Altıncınız, Harem Altın anlık verileriyle uyumlu bir akış sağlayarak size "kuyumcuya gitmeden önceki gerçek fiyatı" gösterir.
              </p>
            </div>
            <div className="bg-[#0f0f0f] p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all group">
              <h3 className="font-black text-white mb-4 group-hover:text-gold-primary transition-colors flex items-center gap-2">
                 <HelpCircle size={18} /> Altın fiyatları ne zaman güncellenir?
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                 Sitemizdeki veriler 24 saat boyunca, ancak piyasa saatlerinde (09:00 - 18:00) 15-30 saniye aralıklarla, piyasa dışı saatlerde ise küresel ons hareketlerine göre güncellenir. "Canlı" ibaresi olan tüm rakamlar son global ve yerel takas değerlerini yansıtır.
              </p>
            </div>
            <div className="bg-[#0f0f0f] p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-all group">
              <h3 className="font-black text-white mb-4 group-hover:text-gold-primary transition-colors flex items-center gap-2">
                 <HelpCircle size={18} /> Altın alırken nelere dikkat edilmeli?
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                 Alım-satım farkı (makas), işçilik maliyeti ve sertifika en kritik unsurlardır. Külçe altınlarda işçilik azdır, bu da yatırım için karlı kılar. Sitemizden <strong>canlı gram altın takibi</strong> yaparak makasın en dar olduğu anları yakalayabilirsiniz.
              </p>
            </div>
          </div>
        </div>

        {/* Kapanış ve Meta Keywords Tag Replacement Container */}
        <div className="pt-20 text-center border-t border-white/5 space-y-6">
          <p className="text-[13px] text-gray-600 font-medium font-mono leading-loose max-w-4xl mx-auto uppercase tracking-tighter">
            Etiketler: gram altın fiyatı bugün ne kadar, canlı gram altın takibi, bugün gram altın kaç tl, harem altın canlı, 24 ayar gram altın ne kadar, güncel çeyrek altın fiyatları, kapalıçarşı canlı altın piyasası, yarım altın fiyatları 2026, altın hesaplama motoru, ons altın dolar karşılığı.
          </p>
          <div className="flex justify-center flex-wrap gap-x-8 gap-y-2 opacity-30 mt-10">
             <span className="text-[10px] font-black uppercase tracking-widest">Altıncınız SEO Engine</span>
             <span className="text-[10px] font-black uppercase tracking-widest">Real-time Data Provider</span>
             <span className="text-[10px] font-black uppercase tracking-widest">Verified Market Authority</span>
          </div>
        </div>
      </div>
    </section>
  );
}
