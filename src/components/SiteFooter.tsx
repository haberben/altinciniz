import Link from 'next/link';

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: '#ffffff', marginTop: 24 }}>
      <div className="page-wrapper" style={{ paddingTop: 28, paddingBottom: 28, display: 'grid', gap: 24 }}>
        {/* Yasal Uyarı */}
        <div
          className="card"
          style={{
            padding: '14px 18px',
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
            borderLeft: '4px solid #dc2626',
            background: '#fef2f2',
          }}
        >
          <span aria-hidden="true" style={{ fontSize: 18, lineHeight: 1.2 }}>⚠️</span>
          <div>
            <p style={{ fontSize: 12, fontWeight: 800, color: '#991b1b', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Yasal Uyarı &amp; Bilgilendirme
            </p>
            <p style={{ fontSize: 12, color: '#4a5568', lineHeight: 1.6, margin: 0 }}>
              Altıncınız üzerinde yayınlanan Kapalıçarşı, serbest piyasa, döviz ve banka verileri yalnızca bilgilendirme amaçlıdır ve yatırım tavsiyesi niteliği taşımaz.
              Fiziki alım-satım işlemleri şehir, kuyumcu işçiliği ve piyasa likiditesine göre farklılık gösterebilir.
            </p>
          </div>
        </div>

        {/* SEO Dahili Bağlantı Ağı */}
        <div className="footer-grid" style={{ paddingTop: 8, paddingBottom: 8 }}>
          <div>
            <h3 style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-primary)', margin: '0 0 12px' }}>
              Popüler Altınlar
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8, fontSize: 13 }}>
              <li><Link href="/gram-altin" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Gram Altın Fiyatı</Link></li>
              <li><Link href="/has-altin" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Has Altın (24 Ayar)</Link></li>
              <li><Link href="/ceyrek-altin" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Çeyrek Altın Ne Kadar?</Link></li>
              <li><Link href="/yarim-altin" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Yarım Altın Fiyatı</Link></li>
              <li><Link href="/tam-altin" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Tam Altın Fiyatı</Link></li>
              <li><Link href="/cumhuriyet-altini" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Cumhuriyet Altını</Link></li>
              <li><Link href="/ata-altin" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Ata Altın Fiyatı</Link></li>
              <li><Link href="/22-ayar-bilezik" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>22 Ayar Bilezik Gram</Link></li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-primary)', margin: '0 0 12px' }}>
              Döviz &amp; Madenler
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8, fontSize: 13 }}>
              <li><Link href="/dolar" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Amerikan Doları (USD)</Link></li>
              <li><Link href="/euro" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Euro Kuru (EUR)</Link></li>
              <li><Link href="/sterlin" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>İngiliz Sterlini (GBP)</Link></li>
              <li><Link href="/isvicre-frangi" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>İsviçre Frangı (CHF)</Link></li>
              <li><Link href="/suudi-riyali" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Suudi Riyali (SAR)</Link></li>
              <li><Link href="/gumus" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Gümüş Gram Fiyatı</Link></li>
              <li><Link href="/altin-ons" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Ons Altın ($)</Link></li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-primary)', margin: '0 0 12px' }}>
              Araçlar &amp; Rehberler
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8, fontSize: 13 }}>
              <li><Link href="/hesaplama" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Canlı Altın Hesaplama</Link></li>
              <li><Link href="/altin/gram-altin-fiyati-2026" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Gram Altın 2026 Analizi</Link></li>
              <li><Link href="/altin/ceyrek-altin-fiyati-2026" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Çeyrek Altın 2026 Rehberi</Link></li>
              <li><Link href="/altin/22-ayar-bilezik-fiyatlari-2026" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>22 Ayar Bilezik 2026</Link></li>
              <li><Link href="/altin/gram-altin-dun-ne-kadardi" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Dün Altın Ne Kadardı?</Link></li>
              <li><Link href="/altin/kapalicarsi-harem-farki-nedir" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Kapalıçarşı ve Harem Farkı</Link></li>
              <li><Link href="/altin/altin-makas-araligi-nedir" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Altın Makas Aralığı Nedir?</Link></li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-primary)', margin: '0 0 12px' }}>
              Kurumsal &amp; Güven
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8, fontSize: 13 }}>
              <li><Link href="/hakkimizda" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Hakkımızda &amp; Veri Kaynakları</Link></li>
              <li><Link href="/iletisim" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>İletişim</Link></li>
              <li><Link href="/gizlilik-politikasi" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Gizlilik ve Çerez Politikası</Link></li>
              <li><Link href="/sitemap.xml" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Site Haritası</Link></li>
            </ul>
          </div>
        </div>

        {/* Alt imza */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 18, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)' }}>
            <span style={{ color: 'var(--gold-dark)' }}>Altın</span>cınız
          </span>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
            © {year} Altıncınız.com — Canlı Altın, Döviz ve Banka Fiyat Takibi
          </p>
        </div>
      </div>
    </footer>
  );
}
