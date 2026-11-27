import type { AssetItem } from '@/lib/api';
import { formatAssetPrice } from '@/lib/assets';
import Link from 'next/link';

const KEY_ASSETS = [
  { slug: 'altin-ons', label: 'ALTIN ONS' },
  { slug: 'gram-altin', label: 'GRAM ALTIN' },
  { slug: 'ceyrek-altin', label: 'ÇEYREK ALTIN' },
  { slug: 'gumus', label: 'GÜMÜŞ' },
  { slug: 'dolar', label: 'DOLAR' },
  { slug: 'euro', label: 'EURO' },
];

export default function Ticker({ items, updateDate }: { items: AssetItem[]; updateDate?: string }) {
  if (!items?.length) return null;

  const keyItems = KEY_ASSETS
    .map((k) => ({ ...k, item: items.find((i) => i.slug === k.slug) }))
    .filter((k): k is { slug: string; label: string; item: AssetItem } => Boolean(k.item));

  const tickerItems = items.filter((i) => i.price > 0 && i.unit !== 'RATIO');

  const fmtPlain = (item: AssetItem, value: number) =>
    formatAssetPrice(value, item).replace(' ₺', '');

  return (
    <div className="site-ticker">
      {/* Üst satır: Anahtar varlık kutuları */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="page-wrapper">
          <div style={{ display: 'flex', overflowX: 'auto', alignItems: 'stretch' }} className="no-scrollbar">
            {keyItems.map(({ slug, label, item }) => {
              const isUp = (item.changePercent ?? 0) >= 0;
              return (
                <Link
                  key={slug}
                  href={`/${slug}`}
                  prefetch={false}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '10px 16px',
                    borderRight: '1px solid rgba(255,255,255,0.07)',
                    textDecoration: 'none',
                    minWidth: 132,
                    flexShrink: 0,
                    transition: 'background 0.15s',
                  }}
                  className="hover-ticker-box"
                >
                  <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>
                    {label}
                  </span>
                  <span style={{ fontSize: 15, fontWeight: 900, color: '#ffffff', lineHeight: 1.25, marginTop: 2 }}>
                    {fmtPlain(item, item.priceSelling)} {item.unit === 'TRY' ? '₺' : ''}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.58)' }}>
                      {fmtPlain(item, item.priceBuying)}
                    </span>
                    {item.changePercent !== undefined && (
                      <span style={{ fontSize: 10, fontWeight: 800, color: isUp ? '#4ade80' : '#f87171', marginLeft: 2 }}>
                        {isUp ? '▲' : '▼'} {Math.abs(item.changePercent).toFixed(2)}%
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}

            {updateDate && (
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px', flexShrink: 0 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap' }}>
                  Canlı · {updateDate}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alt satır: Kayan tüm varlık şeridi */}
      <div style={{ height: 32, overflow: 'hidden', display: 'flex', alignItems: 'center' }} aria-hidden="true">
        <div className="ticker-scroll">
          {[...tickerItems, ...tickerItems].map((item, i) => {
            const isUp = (item.changePercent ?? 0) >= 0;
            return (
              <Link
                key={`${item.slug}-${i}`}
                href={`/${item.slug}`}
                prefetch={false}
                tabIndex={-1}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '0 16px',
                  borderRight: '1px solid rgba(255,255,255,0.06)',
                  textDecoration: 'none',
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.62)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {item.name}
                </span>
                <span style={{ fontSize: 11, fontWeight: 900, color: '#FCE782' }}>
                  {formatAssetPrice(item.priceSelling, item)}
                </span>
                {item.changePercent !== undefined && (
                  <span style={{ fontSize: 10, fontWeight: 800, color: isUp ? '#4ade80' : '#f87171' }}>
                    {isUp ? '▲' : '▼'}{Math.abs(item.changePercent).toFixed(2)}%
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
