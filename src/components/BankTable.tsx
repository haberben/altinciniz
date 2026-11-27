import type { BankItem } from '@/lib/api';

export default function BankTable({ banks }: { banks: BankItem[] }) {
  if (!banks?.length) return null;

  const fmt = (p: number) =>
    new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(p);

  const validBanks = banks.filter((b) => b.selling > 0 && b.buying > 0);
  if (!validBanks.length) return null;

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="card-header">
        <h2 className="card-header-title">Banka Gram Altın Fiyatları</h2>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.72)', letterSpacing: '0.05em' }}>
          EN DÜŞÜK MAKASA GÖRE SIRALI
        </span>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="price-table" style={{ minWidth: 460 }} aria-label="Banka gram altın fiyatları ve makas karşılaştırması">
          <thead>
            <tr>
              <th style={{ textAlign: 'left', paddingLeft: 20 }}>Banka / Kurum</th>
              <th style={{ textAlign: 'right' }}>Alış ₺</th>
              <th style={{ textAlign: 'right' }}>Satış ₺</th>
              <th style={{ textAlign: 'right', borderLeft: '1px solid var(--border)', paddingRight: 20 }}>Makas Farkı</th>
            </tr>
          </thead>
          <tbody>
            {validBanks.map((bank, i) => (
              <tr key={bank.name}>
                <td style={{ paddingLeft: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span className="price-name">{bank.name}</span>
                    {i === 0 && (
                      <span className="badge-up">En Dar Makas</span>
                    )}
                    {bank.updateTime && (
                      <span className="price-time">{bank.updateTime}</span>
                    )}
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <span className="price-buy">{fmt(bank.buying)} ₺</span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <span className="price-sell">{fmt(bank.selling)} ₺</span>
                </td>
                <td style={{ textAlign: 'right', borderLeft: '1px solid var(--border)', fontSize: 13, fontWeight: 700, color: i === 0 ? 'var(--up)' : '#b91c1c', paddingRight: 20 }}>
                  {fmt(bank.spread)} ₺
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding: '10px 20px', background: 'var(--bg-table-h)', borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text-muted)' }}>
        * Banka dijital gram altın alış-satış kurları mesai saatleri dışında makas genişlemesi gösterebilir. İşlem öncesi kendi banka ekranınızı kontrol ediniz.
      </div>
    </div>
  );
}
