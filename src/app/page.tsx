import { getMarketData } from "@/lib/api";
import Ticker from "@/components/Ticker";
import GoldTabTable from "@/components/GoldTabTable";
import DataTable from "@/components/DataTable";
import BankTable from "@/components/BankTable";
import Converter from "@/components/Converter";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Gram Altın Fiyatı (Canlı) – Bugün Gram Altın Ne Kadar? | Altıncınız",
  description:
    "Anlık gram altın fiyatı bugün ne kadar? Çeyrek altın, yarım altın, tam altın canlı Kapalıçarşı fiyatları. Has altın, 22 ayar, ata altın, beşli ata fiyatları. Döviz kurları ve gümüş fiyatı.",
  openGraph: {
    title: "Gram Altın Fiyatı Canlı | Altıncınız",
    description:
      "Kapalıçarşı anlık altın fiyatları, çeyrek altın ne kadar, yarım altın, tam altın canlı takip.",
  },
};

export default async function Home() {
  const { items, banks, updateDate } = await getMarketData();

  if (!items?.length) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
        Veriler yüklenemiyor. Lütfen daha sonra tekrar deneyin.
      </main>
    );
  }

  // Kategorize
  const goldOrder = [
    "gram-altin", "has-altin", "22-ayar-bilezik", "14-ayar-altin",
    "ceyrek-altin", "yarim-altin", "tam-altin",
    "ata-altin", "besli-ata", "gremse-altin", "cumhuriyet-altini", "altin-ons",
  ];
  const tableGolds = [
    ...goldOrder.map(s => items.find(i => i.slug === s)).filter(Boolean),
    ...items.filter(i => i.type === "gold" && !goldOrder.includes(i.slug)),
  ] as typeof items;

  const currencies = items.filter(i => i.type === "currency");
  const metals     = items.filter(i => i.type === "metal");

  const gramAltin  = items.find(i => i.slug === "gram-altin");
  const ceyrek     = items.find(i => i.slug === "ceyrek-altin");
  const usd        = items.find(i => i.slug === "usd");
  const eur        = items.find(i => i.slug === "eur");

  const fmt = (p: number, dec = 2) =>
    new Intl.NumberFormat("tr-TR", { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(p);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "Gram altın ne kadar?", acceptedAnswer: { "@type": "Answer", text: `Bugün gram altın ${gramAltin ? fmt(gramAltin.priceSelling) + " TL" : "güncel olarak sitemizden takip edilebilir"}. Kapalıçarşı canlı fiyatı için tablolarımızı inceleyin.` } },
      { "@type": "Question", name: "Çeyrek altın fiyatı nedir?", acceptedAnswer: { "@type": "Answer", text: `Bugün çeyrek altın fiyatı ${ceyrek ? fmt(ceyrek.priceSelling) + " TL" : "güncel olarak sitemizden takip edilebilir"}. Çeyrek altın 1.75 gram olup 22 ayardır.` } },
      { "@type": "Question", name: "Altın almak için doğru zaman mı?", acceptedAnswer: { "@type": "Answer", text: "Yatırım kararları kişisel mali durumunuza bağlıdır. Sayfamız yalnızca bilgilendirme amacıyla anlık Kapalıçarşı fiyatlarını sunar." } },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Ticker */}
      <Ticker items={items} />

      {/* Navigasyon */}
      <nav className="site-nav" aria-label="Ana gezinme">
        <div className="page-wrapper">
          <div style={{ display: "flex", overflowX: "auto", gap: 0 }} className="no-scrollbar">
            {[
              { label: "Canlı Altın",   href: "/" },
              { label: "Gram Altın",    href: "/gram-altin" },
              { label: "Çeyrek Altın",  href: "/ceyrek-altin" },
              { label: "Kapalıçarşı",   href: "/" },
              { label: "Hesaplama",     href: "/hesaplama" },
              { label: "Gümüş",        href: "/gumus" },
              { label: "Dolar",         href: "/usd" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                style={{
                  display: "inline-block",
                  padding: "14px 18px",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  color: "rgba(255,255,255,0.65)",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  borderBottom: "2px solid transparent",
                  transition: "all 0.15s",
                }}
                className="nav-link-hover"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <style>{`
        .nav-link-hover:hover { color: #D4AF37; border-bottom-color: #D4AF37 !important; background: rgba(255,255,255,0.04); }
        .detail-link:hover { background: var(--gold); color: #000; border-color: var(--gold); }
      `}</style>

      {/* Ana içerik */}
      <div className="page-wrapper">
        <div className="page-content animate-in">

          {/* Sayfa başlığı + özet */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: "var(--text-primary)", marginBottom: 4, lineHeight: 1.2 }}>
                Kapalıçarşı Altın Fiyatları{" "}
                <span style={{ fontSize: 12, fontWeight: 800, background: "#16a34a", color: "#fff", padding: "2px 8px", borderRadius: 4, verticalAlign: "middle" }}>
                  ANLIK
                </span>
              </h1>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>
                Kuyumcular Odası canlı fiyatları · Son güncelleme:{" "}
                <strong style={{ color: "var(--text-primary)" }}>{updateDate}</strong>
              </p>
            </div>
          </div>

          {/* Hızlı fiyat özeti — 4 kart */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
            {[gramAltin, ceyrek, usd, eur].filter(Boolean).map(item => {
              if (!item) return null;
              const isUp = (item.changePercent ?? 0) >= 0;
              const dec  = item.type === "currency" ? 4 : 2;
              return (
                <Link
                  key={item.slug}
                  href={`/${item.slug}`}
                  className="card hover-card"
                  style={{ padding: "16px 18px", textDecoration: "none", display: "block", transition: "box-shadow 0.2s, transform 0.2s" }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "var(--text-primary)", lineHeight: 1 }}>
                    {fmt(item.priceSelling, dec)} ₺
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      Alış: {fmt(item.priceBuying, dec)}
                    </span>
                    {item.changePercent !== undefined && (
                      <span className={isUp ? "badge-up" : "badge-down"}>
                        {isUp ? "▲" : "▼"}{Math.abs(item.changePercent).toFixed(2)}%
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Ana içerik: 2/3 sol + 1/3 sağ */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>

            {/* Altın tablosu (sekmeli) */}
            <GoldTabTable items={tableGolds} />

          </div>

          {/* Banka + Döviz yan yana */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>

            {/* Döviz */}
            <DataTable items={currencies} title="Canlı Döviz Kurları" />

            {/* Gümüş / Madenler */}
            {metals.length > 0 && (
              <DataTable items={metals} title="Değerli Madenler" />
            )}

          </div>

          {/* Banka tablosu */}
          {banks && banks.length > 0 && (
            <BankTable banks={banks} />
          )}

          {/* Hesaplama aracı */}
          <section>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", marginBottom: 12 }}>
              Altın Hesaplama Aracı
            </h2>
            <Converter items={items} />
          </section>

          {/* SEO İçerik */}
          <div className="seo-section">
            <h2>Kapalıçarşı'da Altın Fiyatları Nasıl Belirlenir?</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20, marginTop: 16 }}>
              {[
                ["Gram Altın Fiyatı", `Gram altın fiyatı, uluslararası ons altın paritesi ve anlık dolar/TL kurundan hesaplanır. Bugün gram altın satış fiyatı ${gramAltin ? fmt(gramAltin.priceSelling) + " TL" : "canlı tabloda"} civarındadır.`],
                ["Çeyrek Altın Fiyatı", `Çeyrek altın 1.75 gram olup 22 ayardır. İçerdiği saf altın 1.6065 gramdır. Bugün çeyrek altın ${ceyrek ? fmt(ceyrek.priceSelling) + " TL" : "canlı tabloda"} olarak işlem görmektedir.`],
                ["Alış ve Satış Farkı (Makas)", "Alış fiyatı, kuyumcunun sizden altın aldığı (düşük) değerdir. Satış, kuyumcunun size sattığı (yüksek) değerdir. Bu fark 'makas' veya 'spread' olarak bilinir."],
                ["Kapalıçarşı ve Bankalardaki Fark", "Kapalıçarşı serbest piyasasında fiyatlar arz-talep ile oluşur. Bankalar ise genellikle daha geniş makas (yüksek komisyon) uygular."],
              ].map(([title, text]) => (
                <div key={title}>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Schema için görünür içerik */}
          <div className="seo-section">
            <h2>Sık Sorulan Sorular</h2>
            <div style={{ display: "grid", gap: 16, marginTop: 12 }}>
              {[
                ["Gram altın ne kadar?", `Bugün gram altın fiyatı ${gramAltin ? fmt(gramAltin.priceSelling) + " TL" : "güncel olarak yukarıdaki canlı tablodan öğrenebilirsiniz"}. Kapalıçarşı anlık fiyatı sayfamızda otomatik güncellenmektedir.`],
                ["Çeyrek altın kaç TL?", `Çeyrek altın bugün ${ceyrek ? fmt(ceyrek.priceSelling) + " TL" : "canlı tablomuzdan takip edilebilir"}. Çeyrek altın fiyatı gram altına göre günlük değişim gösterir.`],
                ["Altın almak için doğru zaman mı?", "Altın yatırımı uzun vadeli değer koruma aracı olarak bilinir. Yatırım kararlarını bir finansal danışmana danışarak vermenizi öneririz."],
                ["Has altın ile gram altın farkı nedir?", "Has altın (24 ayar) %99.5+ saflıktadır. Gram altın genellikle 22 ayar olup içerdiği saf altın miktarı daha düşüktür. Has altın biraz daha pahalı olur."],
              ].map(([q, a]) => (
                <details key={q} style={{ borderBottom: "1px solid var(--border)", paddingBottom: 12 }}>
                  <summary style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", cursor: "pointer", paddingBottom: 6 }}>{q}</summary>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, margin: "8px 0 0" }}>{a}</p>
                </details>
              ))}
            </div>
          </div>

          {/* Footer */}
          <footer style={{ borderTop: "1px solid var(--border)", paddingTop: 24, marginTop: 8 }}>
            <div className="card" style={{ padding: "16px 20px", display: "flex", gap: 14, alignItems: "flex-start", borderLeft: "4px solid #dc2626" }}>
              <div style={{ fontSize: 22 }}>⚠️</div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 800, color: "#dc2626", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Yasal Uyarı</p>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                  Burada yer alan fiyatlar yalnızca bilgilendirme amaçlıdır ve yatırım tavsiyesi niteliği taşımaz.
                  Gerçek işlem fiyatları yerel kuyumcu ve bankalara göre farklılık gösterebilir. Altıncınız.com yasal sorumluluk kabul etmez.
                </p>
              </div>
            </div>
            <div style={{ textAlign: "center", marginTop: 20, paddingBottom: 20 }}>
              <span style={{ fontSize: 18, fontWeight: 900, color: "var(--text-muted)" }}>
                <span style={{ color: "var(--gold)" }}>Altın</span>cınız
              </span>
              <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "6px 0 0" }}>
                © {new Date().getFullYear()} Altıncınız — Canlı Altın ve Döviz Fiyatları
              </p>
            </div>
          </footer>

        </div>
      </div>
    </>
  );
}
