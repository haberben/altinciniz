import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Altıncınız – Canlı Kapalıçarşı Altın ve Döviz Fiyatları';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #0f1e38 0%, #1b2f52 60%, #152542 100%)',
          padding: '64px 72px',
          color: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: '#D4AF37',
              color: '#0f1e38',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 38,
              fontWeight: 900,
            }}
          >
            A
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 36, fontWeight: 900, color: '#FCE782' }}>Altıncınız</span>
            <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.72)' }}>altinciniz.com</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ fontSize: 58, fontWeight: 900, lineHeight: 1.12, color: '#ffffff' }}>
            Canlı Kapalıçarşı Altın ve Döviz Fiyatları
          </div>
          <div style={{ fontSize: 28, color: 'rgba(255,255,255,0.82)' }}>
            Gram Altın • Çeyrek Altın • 22 Ayar Bilezik • Banka Makasları • Altın Hesaplama
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '2px solid rgba(212,175,55,0.35)', paddingTop: 24 }}>
          <span style={{ fontSize: 22, color: '#4ade80', fontWeight: 700 }}>● 7/24 Anlık Veri Akışı</span>
          <span style={{ fontSize: 22, color: '#D4AF37', fontWeight: 700 }}>Serbest Piyasa &amp; Banka Karşılaştırması</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
