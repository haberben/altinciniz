'use client';

import { useState, useMemo } from 'react';
import type { AssetItem } from '@/lib/api';
import { formatAssetPrice } from '@/lib/assets';
import Link from 'next/link';

type Tab = 'kapalicarsi' | 'serbest' | 'karsilastirma';

interface Props {
  items: AssetItem[];
  serbestItems?: AssetItem[];
}

const TABS: { key: Tab; label: string }[] = [
  { key: 'kapalicarsi', label: 'Kapalıçarşı' },
  { key: 'serbest', label: 'Serbest Piyasa / Harem' },
  { key: 'karsilastirma', label: 'Piyasa Karşılaştırma' },
];

export default function GoldTabTable({ items, serbestItems = [] }: Props) {
  const [tab, setTab] = useState<Tab>('kapalicarsi');
  const [query, setQuery] = useState<string>('');

  const serbestMap = useMemo(() => {
    const map = new Map<string, AssetItem>();
    for (const s of serbestItems) map.set(s.slug, s);
    return map;
  }, [serbestItems]);

  const baseList = useMemo(() => {
    if (tab === 'serbest') {
      return items.map((item) => serbestMap.get(item.slug) || item);
    }
    return items;
  }, [tab, items, serbestMap]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('tr-TR');
    if (!q) return baseList;
    return baseList.filter((item) => item.name.toLocaleLowerCase('tr-TR').includes(q));
  }, [baseList, query]);

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      {/* Sekmeler */}
      <div className="tab-list">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`tab-btn${tab === t.key ? ' active' : ''}`}
          >
            {t.label}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', padding: '8px 16px' }}>
          <span className="live-badge">Canlı</span>
        </div>
      </div>

      {/* Açıklama + Hızlı Arama */}
      <div
        style={{
          padding: '10px 20px',
          background: 'var(--bg-table-h)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
        }}
      >
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          {tab === 'kapalicarsi' && 'Kapalıçarşı ve Kuyumcular Odası ekranından alınan anlık fiziki piyasa fiyatları'}
          {tab === 'serbest' && 'Serbest piyasa / toptan Harem referanslı anlık alış-satış fiyatları'}
          {tab === 'karsilastirma' && 'Kapalıçarşı ile Serbest Piyasa (Toptan) satış fiyatı ve makas aralığı karşılaştırması'}
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Altın ara (Gram, Çeyrek, 22 Ayar...)"
          aria-label="Altın tablosunda ara"
          style={{
            padding: '6px 12px',
            fontSize: 12,
            borderRadius: 6,
            border: '1px solid var(--border-strong)',
            background: '#ffffff',
            color: 'var(--text-primary)',
            minWidth: 220,
            outline: 'none',
          }}
        />
      </div>

      {/* Tablo */}
      <div style={{ overflowX: 'auto' }}>
        <table className="price-table" style={{ minWidth: 560 }} aria-label={`${tab} altın fiyatları tablosu`}>
          <thead>
            {tab === 'karsilastirma' ? (
              <tr>
                <th style={{ textAlign: 'left', paddingLeft: 20 }}>Altın Türü</th>
                <th style={{ textAlign: 'right' }}>Kapalıçarşı Satış</th>
                <th style={{ textAlign: 'right' }}>Serbest / Harem Satış</th>
                <th style={{ textAlign: 'right', borderLeft: '1px solid var(--border)' }}>Fark</th>
                <th style={{ textAlign: 'right', borderLeft: '1px solid var(--border)' }}>Kuyumcu Makası</th>
                <th style={{ width: 68 }}></th>
              </tr>
            ) : (
              <tr>
                <th style={{ textAlign: 'left', paddingLeft: 20 }}>Altın Türü</th>
                <th style={{ textAlign: 'right' }}>Alış</th>
                <th style={{ textAlign: 'right' }}>Satış</th>
                <th style={{ textAlign: 'right', borderLeft: '1px solid var(--border)' }}>Makas</th>
                <th style={{ textAlign: 'center', borderLeft: '1px solid var(--border)' }}>Değişim</th>
                <th style={{ width: 68 }}></th>
              </tr>
            )}
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', fontSize: 13 }}>
                  Aramanızla eşleşen altın türü bulunamadı.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const pct = item.changePercent;
                const isUp = (pct ?? 0) >= 0;
                const hasC = pct !== undefined;
                const spread = item.priceSelling - item.priceBuying;
                const serbestMatch = serbestMap.get(item.slug) || item;
                const marketDiff = item.priceSelling - serbestMatch.priceSelling;

                if (tab === 'karsilastirma') {
                  return (
                    <tr key={item.slug}>
                      <td style={{ paddingLeft: 20 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className={hasC ? (isUp ? 'dot-up' : 'dot-down') : 'dot-neu'} />
                          <Link href={`/${item.slug}`} prefetch={false} className="price-name" style={{ textDecoration: 'none' }}>
                            {item.name}
                          </Link>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="price-sell">{formatAssetPrice(item.priceSelling, item)}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="price-buy">{formatAssetPrice(serbestMatch.priceSelling, item)}</span>
                      </td>
                      <td style={{ textAlign: 'right', borderLeft: '1px solid var(--border)', fontSize: 13, fontWeight: 700, color: marketDiff >= 0 ? '#b45309' : 'var(--up)' }}>
                        {marketDiff >= 0 ? '+' : ''}{formatAssetPrice(marketDiff, item)}
                      </td>
                      <td style={{ textAlign: 'right', borderLeft: '1px solid var(--border)', fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>
                        {formatAssetPrice(spread, item)}
                      </td>
                      <td style={{ textAlign: 'center', paddingRight: 12 }}>
                        <Link href={`/${item.slug}`} prefetch={false} className="detail-link" aria-label={`${item.name} detayı`}>
                          Detay
                        </Link>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={item.slug}>
                    <td style={{ paddingLeft: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className={hasC ? (isUp ? 'dot-up' : 'dot-down') : 'dot-neu'} />
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
                    <td style={{ textAlign: 'right', borderLeft: '1px solid var(--border)', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>
                      {formatAssetPrice(spread, item)}
                    </td>
                    <td style={{ textAlign: 'center', borderLeft: '1px solid var(--border)' }}>
                      {hasC ? (
                        <span className={isUp ? 'badge-up' : 'badge-down'}>
                          {isUp ? '▲' : '▼'} {Math.abs(pct!).toFixed(2)}%
                        </span>
                      ) : (
                        <span className="badge-neutral">—</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center', paddingRight: 12 }}>
                      <Link href={`/${item.slug}`} prefetch={false} className="detail-link" aria-label={`${item.name} detayı`}>
                        Detay
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
