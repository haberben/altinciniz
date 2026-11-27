import React from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { AssetItem } from '@/lib/api';
import { formatAssetPrice } from '@/lib/assets';

export default function PriceCard({ item }: { item: AssetItem }) {
  const isUp = (item.changePercent ?? 0) >= 0;
  const hasChg = item.changePercent !== undefined;

  return (
    <Link
      href={`/${item.slug}`}
      prefetch={false}
      className="card hover-card"
      style={{
        display: 'block',
        padding: '13px 14px',
        textDecoration: 'none',
        transition: 'box-shadow 0.2s, transform 0.2s, border-color 0.2s',
      }}
      aria-label={`${item.name} canlı fiyatı`}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, gap: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {item.name}
        </span>
        <span className="live-badge">Canlı</span>
      </div>

      <div style={{ fontSize: 'clamp(17px, 4.4vw, 22px)', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.15, marginBottom: 8 }}>
        {formatAssetPrice(item.priceSelling, item)}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
          Alış: {formatAssetPrice(item.priceBuying, item)}
        </span>
        {hasChg && (
          <span className={isUp ? 'badge-up' : 'badge-down'}>
            {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {isUp ? '+' : ''}{item.changePercent!.toFixed(2)}%
          </span>
        )}
      </div>
    </Link>
  );
}
