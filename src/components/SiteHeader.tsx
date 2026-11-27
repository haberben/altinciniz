import Link from 'next/link';
import type { AssetItem } from '@/lib/api';
import Ticker from './Ticker';
import { InstallAppButton } from './InstallAppPrompt';

interface Props {
  items: AssetItem[];
  updateDate?: string;
  activePath?: string;
}

const NAV_LINKS = [
  { label: 'Canlı Piyasa', href: '/' },
  { label: 'Gram Altın', href: '/gram-altin' },
  { label: 'Çeyrek Altın', href: '/ceyrek-altin' },
  { label: '22 Ayar Bilezik', href: '/22-ayar-bilezik' },
  { label: 'Cumhuriyet Altını', href: '/cumhuriyet-altini' },
  { label: 'Dolar', href: '/dolar' },
  { label: 'Euro', href: '/euro' },
  { label: 'Gümüş', href: '/gumus' },
  { label: 'Altın Hesaplama', href: '/hesaplama' },
];

export default function SiteHeader({ items, updateDate, activePath = '/' }: Props) {
  return (
    <header>
      {/* Marka Şeridi */}
      <div className="site-brand-bar">
        <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, paddingBottom: 10, gap: 12, flexWrap: 'wrap' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <span
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #D4AF37 0%, #FCE782 100%)',
                color: '#0f1e38',
                fontWeight: 900,
                fontSize: 18,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              A
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
              <span style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>
                <span style={{ color: '#FCE782' }}>Altın</span>cınız
              </span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>
                Kapalıçarşı &amp; Serbest Piyasa Canlı Veri Merkezi
              </span>
            </span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <InstallAppButton variant="header" />
            <Link
              href="/hesaplama"
              style={{
                background: 'rgba(212,175,55,0.14)',
                border: '1px solid rgba(212,175,55,0.45)',
                color: '#FCE782',
                padding: '6px 11px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              Hesaplama
            </Link>
          </div>
        </div>
      </div>

      {/* Üst Canlı Şerit */}
      <Ticker items={items} updateDate={updateDate} />

      {/* Ana Navigasyon */}
      <nav className="site-nav" aria-label="Ana gezinme">
        <div className="page-wrapper">
          <div style={{ display: 'flex', overflowX: 'auto' }} className="no-scrollbar">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = activePath === href;
              return (
                <Link
                  key={href}
                  href={href}
                  prefetch={false}
                  className={`nav-link${isActive ? ' active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
}
