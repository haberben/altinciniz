import type { AssetItem } from '@/lib/api';
import { formatAssetPrice } from '@/lib/assets';
import Link from 'next/link';

interface Props {
  items: AssetItem[];
  title: string;
}

export default function DataTable({ items, title }: Props) {
  if (!items?.length) return null;

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="card-header">
        <h2 className="card-header-title">{title}</h2>
        <span className="live-badge">Canlı</span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="price-table" style={{ minWidth: 440 }} aria-label={title}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', paddingLeft: 20 }}>Ürün</th>
              <th style={{ textAlign: 'right' }}>Alış</th>
              <th style={{ textAlign: 'right' }}>Satış</th>
              <th style={{ textAlign: 'center', borderLeft: '1px solid var(--border)' }}>Değişim</th>
              <th style={{ textAlign: 'center', width: 68 }}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const pct = item.changePercent;
              const isUp = (pct ?? 0) >= 0;
              const hasChg = pct !== undefined;

              return (
                <tr key={item.slug}>
                  <td style={{ paddingLeft: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className={hasChg ? (isUp ? 'dot-up' : 'dot-down') : 'dot-neu'} />
                      <div>
                        <Link href={`/${item.slug}`} prefetch={false} className="price-name" style={{ textDecoration: 'none', display: 'block' }}>
                          {item.name}
                        </Link>
                        {item.updateTime && (
                          <span className="price-time">{item.updateTime}</span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <span className="price-buy">{formatAssetPrice(item.priceBuying, item)}</span>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <span className="price-sell">{formatAssetPrice(item.priceSelling, item)}</span>
                  </td>

                  <td style={{ textAlign: 'center', borderLeft: '1px solid var(--border)' }}>
                    {hasChg ? (
                      <span className={isUp ? 'badge-up' : 'badge-down'}>
                        {isUp ? '▲' : '▼'} {Math.abs(pct!).toFixed(2)}%
                      </span>
                    ) : (
                      <span className="badge-neutral">—</span>
                    )}
                  </td>

                  <td style={{ textAlign: 'center', paddingRight: 12 }}>
                    <Link
                      href={`/${item.slug}`}
                      prefetch={false}
                      className="detail-link"
                      aria-label={`${item.name} detay sayfası`}
                    >
                      Detay
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
