export interface GuideEntry {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  assetSlug: string;
  badge: string;
  intro: string;
  sections: { heading: string; paragraphs: string[] }[];
  faqs: { q: string; a: string }[];
}

export const SEO_GUIDES: Record<string, GuideEntry> = {
  'gram-altin-fiyati-2026': {
    slug: 'gram-altin-fiyati-2026',
    title: 'Gram Altın Fiyatı 2026 Analizi ve Güncel Beklentiler',
    metaTitle: 'Gram Altın Fiyatı 2026 Analizi – Canlı Fiyat & Piyasa Beklentileri',
    description: '2026 yılı gram altın fiyatı canlı verileri, ons altın ve Dolar/TL etkisi, Kapalıçarşı makas analizi ve yatırımcılar için kapsamlı rehber.',
    assetSlug: 'gram-altin',
    badge: '2026 Piyasa Rehberi',
    intro: '2026 yılında gram altın fiyatlarını şekillendiren küresel ons altın dinamikleri, Dolar/TL paritesi ve yerel Kapalıçarşı arz-talep dengesini canlı veriler ışığında inceleyin.',
    sections: [
      {
        heading: '2026’da Gram Altını Etkileyen İki Temel Dinamik',
        paragraphs: [
          'Türkiye’de gram altın fiyatı iki ana bileşenin çarpımından doğar: küresel XAU/USD ons altın fiyatı ve yerel USD/TRY döviz kuru. Bu iki değişkenin birlikte hareket etmesi, gram altının TL cinsinden fiyat oynaklığını doğrudan belirler.',
          'Merkez bankalarının rezerv çeşitlendirme politikaları, küresel enflasyon beklentileri ve faiz indirim döngüleri ons altını yönlendirirken; yurt içi enflasyon ve likidite koşulları kur tarafındaki seyri belirlemektedir.',
        ],
      },
      {
        heading: 'Kapalıçarşı ve Banka Makas Farkı Nasıl Yönetilir?',
        paragraphs: [
          'Yatırımcılar yalnızca gram altın fiyatına değil, alış ve satış arasındaki makas aralığına da dikkat etmelidir. Mesai saatleri içinde bankalar ile Kapalıçarşı fiziki piyasası arasındaki fark daralırken, akşam ve hafta sonu saatlerinde banka makasları açılabilmektedir.',
          'Sitemizin ana sayfasındaki Banka Gram Altın Fiyatları tablosundan hangi kurumun o an en dar makası sunduğunu anlık olarak kıyaslayabilirsiniz.',
        ],
      },
    ],
    faqs: [
      { q: 'Gram altın fiyatı neden anlık değişiyor?', a: 'Küresel ons altın (XAU/USD) ve Dolar/TL kuru saniyeler içinde işlem gördüğü için yerel gram altın kotasyonları da piyasa saatlerinde sürekli güncellenir.' },
      { q: '24 ayar mı 22 ayar gram altın mı tercih edilir?', a: 'Yatırım ve kısa vadeli likidite için işçiliksiz 24 ayar has/paketli gram altın makası genellikle daha avantajlıdır.' },
    ],
  },
  'ceyrek-altin-fiyati-2026': {
    slug: 'ceyrek-altin-fiyati-2026',
    title: 'Çeyrek Altın Fiyatı 2026 – Yeni ve Eski Çeyrek Rehberi',
    metaTitle: 'Çeyrek Altın Fiyatı 2026 – Bugün Çeyrek Altın Ne Kadar?',
    description: '2026 çeyrek altın canlı alış-satış fiyatı, yeni tarihli ve eski tarihli çeyrek farkı, gram ağırlığı ve has altın karşılığı.',
    assetSlug: 'ceyrek-altin',
    badge: 'Sarrafiye Rehberi',
    intro: 'Düğün sezonundan uzun vadeli fiziki birikime kadar en çok talep gören çeyrek altının 2026 canlı fiyat yapısını ve teknik özelliklerini inceleyin.',
    sections: [
      {
        heading: 'Çeyrek Altın Kaç Gramdır ve İçinde Ne Kadar Saf Altın Vardır?',
        paragraphs: [
          'Darphane tarafından basılan standart bir çeyrek altın kulpsuz olarak 1,75 gram ağırlığındadır ve 22 ayar (%91,6 saflık) altından üretilir. Bu da çeyrek altının içinde net 1,6065 gram saf (has) altın bulunduğu anlamına gelir.',
          'Fiyatı ise içindeki 1,6065 gram saf altının güncel değeri üzerine Darphane basım bedeli ve piyasa talep primi eklenerek oluşur.',
        ],
      },
      {
        heading: 'Yeni Tarihli ve Eski Tarihli Çeyrek Altın Arasındaki Fark',
        paragraphs: [
          'Yeni tarihli çeyrek altın içinde bulunulan takvim yılında basıldığı için hediyelik amaçlı daha fazla talep görür. Eski tarihli çeyrek altın ise altın ağırlığı ve saflığı birebir aynı olmasına rağmen birkaç lira daha düşük primle işlem görebilir.',
        ],
      },
    ],
    faqs: [
      { q: '10 adet çeyrek altın kaç gram has altın eder?', a: '1 çeyrekte 1,6065 gram saf altın bulunur; 10 adet çeyrek altın toplam 17,50 gram brüt ve 16,065 gram saf has altın içerir.' },
      { q: 'Çeyrek altın bozdurulurken zarar edilir mi?', a: 'Bozdurmada alış-satış makası kadar fark oluşur. Kuyumcu makaslarını sitemizden canlı takip ederek en uygun zamanlamayı değerlendirebilirsiniz.' },
    ],
  },
  '22-ayar-bilezik-fiyatlari-2026': {
    slug: '22-ayar-bilezik-fiyatlari-2026',
    title: '22 Ayar Bilezik Fiyatları 2026 ve Gram Hesaplama Rehberi',
    metaTitle: '22 Ayar Bilezik Fiyatları 2026 – Canlı Gram & İşçilik Rehberi',
    description: '2026 güncel 22 ayar bilezik gram alış ve satış fiyatı, 10-20-30 gram bilezik hesaplama yöntemleri ve işçiliksiz model tavsiyeleri.',
    assetSlug: '22-ayar-bilezik',
    badge: 'Bilezik & Takı Rehberi',
    intro: '22 ayar (916 milyem) bileziklerin canlı gram fiyatı üzerinden 10, 20 ve 30 gramlık modellerin yaklaşık maliyet ve bozdurma değerlerini öğrenin.',
    sections: [
      {
        heading: '22 Ayar Bilezik Gram Fiyatı Nasıl Hesaplanır?',
        paragraphs: [
          '22 ayar altın %91,6 saflık oranına sahiptir. Bu nedenle ham değeri 24 ayar has altın fiyatının yaklaşık 0,916 katsayısı ile orantılıdır. Ancak bileziğin vitrin satış fiyatına modelin işçilik maliyeti de yansıtılır.',
          'Burma bilezik, kibrit çöpü veya düz kibrit model gibi işçiliği düşük bileziklerde bozdurma sırasındaki değer kaybı daha az olur; taşlı veya fantezi işlemeli modellerde ise işçilik oranı yükselir.',
        ],
      },
      {
        heading: 'Bilezik Alırken ve Bozdururken Nelere Dikkat Edilmeli?',
        paragraphs: [
          'Bileziğin iç yüzeyinde TSE ve 916 (22K) ayar damgasının bulunmasına dikkat edilmelidir. Bozdurma işlemi yaparken sitemizdeki 22 Ayar Bilezik alış kurunu baz alarak kuyumcudan net gramaj tartımı istemek hak kaybını önler.',
        ],
      },
    ],
    faqs: [
      { q: '22 ayar bilezik neden 24 ayar gram altından ucuzdur?', a: '24 ayar gram altın %99,5-%99,9 saf altın içerirken, 22 ayar bilezik dayanıklılık için %91,6 saf altın ve %8,4 bakır/gümüş alaşımından oluşur.' },
      { q: 'İşçiliksiz bilezik alırken fark ödenir mi?', a: 'Her üretimde minimum bir atölye ve kâr payı bulunur; ancak Adana burması ve klasik düz modellerde bu pay oldukça düşüktür.' },
    ],
  },
  'gram-altin-dun-ne-kadardi': {
    slug: 'gram-altin-dun-ne-kadardi',
    title: 'Gram Altın Dün Ne Kadardı? Günlük Değişim Nasıl Anlaşılır?',
    metaTitle: 'Gram Altın Dün Ne Kadardı? Canlı Fiyat ve Günlük Değişim | Altıncınız',
    description: 'Gram altının dünkü kapanışına göre günlük yüzdesel değişimini ve TL bazlı farkını canlı Kapalıçarşı verileriyle nasıl okuyacağınızı öğrenin.',
    assetSlug: 'gram-altin',
    badge: 'Günlük Piyasa Takibi',
    intro: 'Yatırımcıların en çok merak ettiği "Dün altın ne kadardı?" sorusunu, bugünkü canlı fiyat ve günlük değişim yüzdesi üzerinden net şekilde analiz edin.',
    sections: [
      {
        heading: 'Dünkü Kapanış Fiyatı ve Günlük Değişim İlişkisi',
        paragraphs: [
          'Canlı tablomuzdaki değişim yüzdesi (%) ve TL değişim miktarı, altının bir önceki işlem günü kapanışına kıyasla ne kadar yükseldiğini veya gerilediğini gösterir. Pozitif yeşil ibare dünkü kapanışın üzerinde olunduğunu, kırmızı ibare ise altında işlem görüldüğünü ifade eder.',
          'Örneğin günlük değişim +%1,20 görünüyorsa, bugünkü fiyat dünkü kapanışın %1,20 üzerindedir. Dünkü yaklaşık kapanış seviyesini `Bugünkü Fiyat / (1 + Değişim/100)` formülüyle kolayca hesaplayabilirsiniz.',
        ],
      },
      {
        heading: 'Hafta Sonu ve Gece Saatlerinde Fiyatlar Neden Sabitlenir?',
        paragraphs: [
          'Küresel FX ve emtia borsaları Cuma gece yarısından Pazar gecesine kadar kapalı olduğu için hafta sonu spot ons fiyatı sabit kalır. Bu süreçte Kapalıçarşı ve bankalardaki alış-satış makasları daha temkinli tutulabilir.',
        ],
      },
    ],
    faqs: [
      { q: 'Günlük değişim oranı hangi saate göre hesaplanır?', a: 'Genellikle uluslararası piyasaların gece yarısı (TSİ 00:00 / 01:00) kapanış baz fiyatı referans alınarak gün içi yüzde değişim hesaplanır.' },
    ],
  },
  'kapalicarsi-harem-farki-nedir': {
    slug: 'kapalicarsi-harem-farki-nedir',
    title: 'Kapalıçarşı Altın Fiyatları ile Harem / Serbest Piyasa Farkı Nedir?',
    metaTitle: 'Kapalıçarşı ve Harem Altın Farkı Nedir? Canlı Karşılaştırma',
    description: 'Kapalıçarşı kuyumcu ekranı ile Harem Altın / Serbest Piyasa toptan fiyatları arasındaki farkın nedenleri ve canlı kıyaslama.',
    assetSlug: 'gram-altin',
    badge: 'Piyasa Karşılaştırma',
    intro: 'Ana sayfamızdaki "Piyasa Karşılaştırma" sekmesinde yer alan Kapalıçarşı ve Serbest Piyasa / Harem kotasyonları arasındaki farkın neden oluştuğunu keşfedin.',
    sections: [
      {
        heading: 'Toptan Ekran Fiyatı ile Perakende Kuyumcu Ekranı',
        paragraphs: [
          'Harem Altın veya serbest piyasa toptan ekranları genellikle İstanbul toptan altın ticaretinin referans kotasyonlarını gösterir ve alış-satış makası çok dardır.',
          'Kapalıçarşı Kuyumcular Odası tavsiye niteliğindeki kuyumcu ekranı ise perakende işlem maliyetlerini, sigorta, nakliye ve fiziki stok riskini içerdiği için satış tarafında toptan ekranın biraz üzerinde fiyatlanabilir.',
        ],
      },
      {
        heading: 'Hangisini Referans Almalısınız?',
        paragraphs: [
          'Fiziki altın alım-satımı için kuyumcu dükkanına gidecekseniz Kapalıçarşı / Kuyumcular Odası ekranı gerçek işlem fiyatına daha yakındır. Küresel trendi ve toptan baz değeri görmek içinse Serbest Piyasa sekmesini izleyebilirsiniz.',
        ],
      },
    ],
    faqs: [
      { q: 'Kuyumcuda neden ekrandakinden farklı fiyat çıkabiliyor?', a: 'Kuyumcular arası fiziki talep yoğunluğu, taksit veya kredi kartı komisyonları ve bölgesel tedarik maliyetleri ekrandaki referans fiyatla küçük farklılıklar yaratabilir.' },
    ],
  },
  'altin-makas-araligi-nedir': {
    slug: 'altin-makas-araligi-nedir',
    title: 'Altın Makas Aralığı (Spread) Nedir ve Nasıl En Aza İndirilir?',
    metaTitle: 'Altında Makas Aralığı Nedir? En Düşük Makaslı Banka ve Kuyumcular',
    description: 'Altın alış ve satış fiyatı arasındaki makas farkı nedir, bankalarda neden yükselir ve makas maliyetini azaltmanın yolları nelerdir?',
    assetSlug: 'gram-altin',
    badge: 'Yatırımcı Sözlüğü',
    intro: 'Altın alım-satımında gizli maliyet olarak bilinen makas (spread) kavramını ve doğru işlem zamanlamasıyla nasıl tasarruf edeceğinizi öğrenin.',
    sections: [
      {
        heading: 'Makas (Alış-Satış Farkı) Nasıl Hesaplanır?',
        paragraphs: [
          'Makas aralığı = Satış Fiyatı − Alış Fiyatı formülüyle hesaplanır. Örneğin gram altın satış fiyatı 6.130 TL, alış fiyatı 6.035 TL ise makas 95 TL’dir. Yani aldığınız altını aynı saniye geri satsanız 95 TL’lik bir fark oluşur.',
          'Yüzdesel makası ise `(Makas / Satış Fiyatı) × 100` şeklinde hesaplayarak farklı varlıkların veya bankaların maliyetini adil biçimde kıyaslayabilirsiniz.',
        ],
      },
      {
        heading: 'Makas Maliyetini Düşürmenin 3 Altın Kuralı',
        paragraphs: [
          '1) Banka işlemlerini piyasanın açık olduğu hafta içi 09:30 – 17:00 saatleri arasında gerçekleştirin. 2) Ana sayfamızdaki Banka Gram Altın tablosundan en düşük makaslı bankayı kontrol edin. 3) Fiziki alımlarda yüksek işçilikli takılar yerine darphane sikkesi (Ata/Cumhuriyet) veya 24 ayar has gram tercih edin.',
        ],
      },
    ],
    faqs: [
      { q: 'En düşük altın makası hangi saatlerde olur?', a: 'Genellikle Türkiye bankacılık ve İstanbul Kapalıçarşı piyasasının aynı anda açık olduğu hafta içi 10:00 – 16:30 arası makas aralıkları en dar seviyesine iner.' },
    ],
  },
};

export const ALL_GUIDE_SLUGS = Object.keys(SEO_GUIDES);
