import type { BankItem } from "@/lib/api";

export default function BankTable({ banks }: { banks: BankItem[] }) {
  if (!banks || banks.length === 0) return null;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-[#1a3a6a]/40 shadow-xl bg-[#071428]">
      <div className="flex items-center justify-between px-5 py-3.5 bg-[#0e2040] border-b border-[#1a3a6a]/50">
        <h4 className="text-sm font-black text-white uppercase tracking-wider">Banka Gram Altın Fiyatları</h4>
        <span className="text-[10px] font-bold text-[#4a6a9a] bg-[#0a1830] px-2.5 py-1 rounded-full border border-[#1a3a6a]/30">
          ALIŞ / SATIŞ / MAKAS
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[400px]" aria-label="Banka altın fiyatları">
          <thead>
            <tr className="text-[10px] font-black uppercase tracking-widest text-[#4a6a9a] bg-[#060f20] border-b border-[#1a3a6a]/30">
              <th className="px-5 py-3">Banka</th>
              <th className="px-4 py-3 text-right border-l border-[#1a3a6a]/20">Alış</th>
              <th className="px-4 py-3 text-right">Satış</th>
              <th className="px-4 py-3 text-right border-l border-[#1a3a6a]/20">Makas</th>
            </tr>
          </thead>
          <tbody>
            {banks.map((bank, i) => (
              <tr key={i} className="border-b border-[#1a3a6a]/20 hover:bg-[#0e2040]/60 transition-colors">
                <td className="px-5 py-3">
                  <div>
                    <span className="text-[13px] font-bold text-white">{bank.name}</span>
                    {bank.updateTime && (
                      <span className="block text-[10px] text-[#4a6a9a] font-mono">{bank.updateTime}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right border-l border-[#1a3a6a]/20">
                  <span className="text-[13px] font-semibold text-[#8fa8cc]">{formatPrice(bank.buying)}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-[14px] font-black text-[#D4AF37]">{formatPrice(bank.selling)}</span>
                </td>
                <td className="px-4 py-3 text-right border-l border-[#1a3a6a]/20">
                  <span className="text-[12px] font-bold text-red-400">{formatPrice(bank.spread)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
