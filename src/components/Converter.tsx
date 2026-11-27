'use client';

import { useState, useMemo, useId } from 'react';
import type { AssetItem } from '@/lib/api';

interface Props {
  items: AssetItem[];
  defaultSlug?: string;
}

const PRESETS = [1, 5, 10, 20, 50, 100];

export default function Converter({ items, defaultSlug = 'gram-altin' }: Props) {
  const inputId = useId();
  const selectId = useId();

  const selectableItems = useMemo(
    () => items.filter((i) => i.unit === 'TRY'),
    [items]
  );

  const initialSlug = selectableItems.some((i) => i.slug === defaultSlug)
    ? defaultSlug
    : selectableItems[0]?.slug || 'gram-altin';

  const [amount, setAmount] = useState<string>('1');
  const [selected, setSelected] = useState<string>(initialSlug);

  const asset = useMemo(
    () => selectableItems.find((i) => i.slug === selected) ?? selectableItems[0],
    [selectableItems, selected]
  );

  const parsedAmount = useMemo(() => {
    const n = parseFloat(amount.replace(',', '.'));
    return !n || isNaN(n) || n < 0 ? 0 : n;
  }, [amount]);

  const totalSell = asset ? parsedAmount * asset.priceSelling : 0;
  const totalBuy = asset ? parsedAmount * asset.priceBuying : 0;

  const fmtTRY = (val: number) =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(val);

  return (
    <div className="converter-wrap">
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>
            Canlı Altın &amp; Döviz Hesaplama
          </span>
        </div>

        {/* Hızlı miktar butonları */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setAmount(String(p))}
              className={`preset-btn${parsedAmount === p ? ' active' : ''}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, alignItems: 'end' }}>
        <div>
          <label htmlFor={inputId} style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            Miktar (Gram / Adet)
          </label>
          <input
            id={inputId}
            type="number"
            min="0"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor={selectId} style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            Varlık Seçin
          </label>
          <select id={selectId} value={selected} onChange={(e) => setSelected(e.target.value)}>
            <optgroup label="Altın">
              {selectableItems.filter((i) => i.type === 'gold').map((g) => (
                <option key={g.slug} value={g.slug}>{g.name}</option>
              ))}
            </optgroup>
            <optgroup label="Döviz">
              {selectableItems.filter((i) => i.type === 'currency').map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </optgroup>
            <optgroup label="Değerli Madenler">
              {selectableItems.filter((i) => i.type === 'metal').map((m) => (
                <option key={m.slug} value={m.slug}>{m.name}</option>
              ))}
            </optgroup>
          </select>
        </div>

        <div
          style={{
            background: 'var(--bg-table-h)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '10px 14px',
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>
            Bozdurma (Alış) Tutarı
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-secondary)' }}>{fmtTRY(totalBuy)}</div>
        </div>

        <div
          style={{
            background: 'var(--gold-bg)',
            border: '1px solid var(--gold-border)',
            borderRadius: 8,
            padding: '10px 14px',
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--gold-dark)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>
            Satın Alma (Satış) Tutarı
          </div>
          <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)' }}>{fmtTRY(totalSell)}</div>
        </div>
      </div>
    </div>
  );
}
