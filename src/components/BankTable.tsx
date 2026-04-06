import type { BankItem } from "@/lib/api";

export default function BankTable({ banks }: { banks: BankItem[] }) {
  if (!banks?.length) return null;

  const fmt = (p: number) =>
    new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(p);

  const validBanks = banks.filter(b => b.selling > 0);
  if (!validBanks.length) return null;

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div className="card-header">
        <span className="card-header-title">Banka Gram Altın Fiyatları</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em" }}>
          ALIŞ / SATIŞ / MAKAS
        </span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="price-table" style={{ minWidth: 400 }} aria-label="Banka altın fiyatları">
          <thead>
            <tr>
              <th style={{ textAlign: "left", paddingLeft: 20 }}>Banka</th>
              <th style={{ textAlign: "right" }}>Alış ₺</th>
              <th style={{ textAlign: "right" }}>Satış ₺</th>
              <th style={{ textAlign: "right", borderLeft: "1px solid var(--border)" }}>Makas</th>
            </tr>
          </thead>
          <tbody>
            {validBanks.map((bank, i) => (
              <tr key={i}>
                <td style={{ paddingLeft: 20 }}>
                  <span className="price-name">{bank.name}</span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <span className="price-buy">{fmt(bank.buying)}</span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <span className="price-sell">{fmt(bank.selling)}</span>
                </td>
                <td style={{ textAlign: "right", borderLeft: "1px solid var(--border)", fontSize: 13, fontWeight: 700, color: "#dc2626", paddingRight: 16 }}>
                  {fmt(bank.spread)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding: "10px 20px", background: "var(--bg-table-h)", borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--text-muted)" }}>
        * Banka fiyatları gram altın baz alınarak hesaplanmıştır. Güncel fiyatlar için bankanızı arayınız.
      </div>
    </div>
  );
}
