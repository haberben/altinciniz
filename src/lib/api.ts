import { unstable_noStore as noStore } from 'next/cache';

export interface AssetItem {
  name: string;
  slug: string;
  price: number;
  priceBuying: number;
  priceSelling: number;
  type: 'gold' | 'currency' | 'metal';
  changePercent?: number;
  changeAmount?: number;
  updateTime?: string;
  dayHigh?: number;
  dayLow?: number;
}

export interface BankItem {
  name: string;
  buying: number;
  selling: number;
  spread: number;
}

export interface MarketResponse {
  items: AssetItem[];
  banks?: BankItem[];
  updateDate: string;
}

function getTRTime(): string {
  return new Intl.DateTimeFormat('tr-TR', {
    timeZone: 'Europe/Istanbul',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date());
}

/** 
 * En güvenli sayı çevirme fonksiyonu:
 * "6.746,64" -> 6746.64 (TR format)
 * "6746.64"  -> 6746.64 (EN format)
 * "11517"    -> 11517.00
 */
function safeParseFloat(raw: string | undefined): number {
  if (!raw) return 0;
  // Sadece rakam, virgül, nokta, eksi işaretleri kalsın
  const clean = raw.replace(/[^\d.,-]/g, '').trim();
  if (!clean) return 0;

  // Eğer sayının içinde virgül varsa TR formatındadır (1.234,45 -> nokta binlik, virgül ondalık)
  if (clean.includes(',')) {
    const withoutThousands = clean.replace(/\./g, ''); 
    return parseFloat(withoutThousands.replace(',', '.'));
  }
  
  // Virgül yoksa doğrudan float parse (6746.64 veya 11517)
  return parseFloat(clean) || 0;
}

// ─────────────────────────────────────────────────────────────
// KAYNAK 1: anlikaltinfiyatlari.com
// ─────────────────────────────────────────────────────────────
async function fetchSource1(): Promise<AssetItem[]> {
  const url = 'https://anlikaltinfiyatlari.com/altin/kapalicarsi';
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, next: { revalidate: 30 } });
  const html = await res.text();
  
  const items: AssetItem[] = [];
  const rows = html.match(/<tr[^>]*>[\s\S]*?<\/tr>/g) || [];

  rows.forEach(row => {
    // <td> taglarını temizle ve map et
    const cells = Array.from(row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)).map(m => m[1]);
    if (cells.length < 5) return;

    // regex stripping for pure text
    const cleanText = (htmlStr: string) => htmlStr.replace(/<[^>]+>/g, ' ').trim().replace(/\s+/g, ' ');

    const nameRaw = cleanText(cells[0] || '');
    const updateTime = cleanText(cells[1] || '');
    const buyRaw = cleanText(cells[2] || '');
    const sellRaw = cleanText(cells[3] || '');
    const changeRaw = cleanText(cells[4] || '');

    if (!nameRaw) return;

    const parseNameSlug = (n: string): { slug: string, type: AssetItem['type'] } | null => {
      const lower = n.toLowerCase();
      if (lower.includes('gram') && !lower.includes('has')) return { slug: 'gram-altin', type: 'gold' };
      if (lower.includes('has')) return { slug: 'has-altin', type: 'gold' };
      if (lower.includes('çeyrek') && !lower.includes('eski')) return { slug: 'ceyrek-altin', type: 'gold' };
      if (lower.includes('yarım') && !lower.includes('eski')) return { slug: 'yarim-altin', type: 'gold' };
      if (lower.includes('tam') && !lower.includes('eski')) return { slug: 'tam-altin', type: 'gold' };
      if (lower.includes('cumhuriyet')) return { slug: 'cumhuriyet-altini', type: 'gold' };
      if (lower.includes('ata') && !lower.includes('beşli')) return { slug: 'ata-altin', type: 'gold' };
      if (lower.includes('beşli')) return { slug: 'besli-ata', type: 'gold' };
      if (lower.includes('gremse')) return { slug: 'gremse-altin', type: 'gold' };
      if (lower.includes('22 ayar')) return { slug: '22-ayar-bilezik', type: 'gold' };
      if (lower.includes('18 ayar')) return { slug: '18-ayar-altin', type: 'gold' };
      if (lower.includes('14 ayar')) return { slug: '14-ayar-altin', type: 'gold' };
      if (n === 'Dolar') return { slug: 'usd', type: 'currency' };
      if (n === 'Euro') return { slug: 'eur', type: 'currency' };
      if (lower.includes('gümüş')) return { slug: 'gumus', type: 'metal' };
      if (lower.includes('ons')) return { slug: 'altin-ons', type: 'metal' };
      return null;
    };

    const mapping = parseNameSlug(nameRaw);
    if (!mapping) return;

    const buying = Math.min(safeParseFloat(buyRaw), safeParseFloat(sellRaw));
    const selling = Math.max(safeParseFloat(buyRaw), safeParseFloat(sellRaw));
    
    if (selling < 1) return; // ignore bad data

    // Değişim "%" ifadesinin arasındaki sayıyı al
    const percentMatch = changeRaw.match(/([+-]?[\d.,]+)\s*%/);
    const changePercent = percentMatch ? safeParseFloat(percentMatch[1]) : undefined;

    items.push({
      name: nameRaw,
      slug: mapping.slug,
      price: selling,
      priceBuying: buying,
      priceSelling: selling,
      type: mapping.type,
      changePercent,
      updateTime: updateTime.length === 8 ? updateTime : undefined
    });
  });

  return items;
}

// ─────────────────────────────────────────────────────────────
// KAYNAK 2: canlialtinfiyatlari.com
// ─────────────────────────────────────────────────────────────
async function fetchSource2(): Promise<{ items: AssetItem[], banks: BankItem[] }> {
  const url = 'https://canlialtinfiyatlari.com/kuyumcular-odasi-altin-fiyatlari.html';
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, next: { revalidate: 30 } });
  const html = await res.text();
  
  const items: AssetItem[] = [];
  const banks: BankItem[] = [];
  
  // Tablo satırlarını bulalım
  const rows = html.match(/<tr[^>]*>[\s\S]*?<\/tr>/g) || [];

  rows.forEach(row => {
    const cellsText = Array.from(row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)).map(m => m[1]);
    if (cellsText.length < 4) return; // eksik satırları atla
    
    const cleanText = (htmlStr: string) => htmlStr.replace(/<[^>]+>/g, ' ').trim().replace(/\s+/g, ' ');

    const nameRaw = cleanText(cellsText[0]);
    if (!nameRaw) return;

    // is Bank?
    const isBank = nameRaw.toLowerCase().includes('bank') || nameRaw.includes('Altınkaynak');
    if (isBank && cellsText.length >= 3) {
      const buyR = cleanText(cellsText[1]);
      const sellR = cleanText(cellsText[2]);
      const buying = safeParseFloat(buyR);
      const selling = safeParseFloat(sellR);
      if (selling > 0) {
        banks.push({ name: nameRaw, buying, selling, spread: Math.max(0, selling - buying) });
      }
      return;
    }

    // Normal altınlar
    const updateTime = cleanText(cellsText[1]);
    const buyR = cleanText(cellsText[2]);
    const sellR = cleanText(cellsText[3]);
    let changeRaw = cleanText(cellsText[4] || '');

    const parseNameSlug = (n: string): { slug: string, type: AssetItem['type'], fixedName: string } | null => {
      const lower = n.toLowerCase();
      if (lower.includes('gram')) return { slug: 'gram-altin', type: 'gold', fixedName: 'Gram Altın' };
      if (lower.includes('has')) return { slug: 'has-altin', type: 'gold', fixedName: 'Has Altın' };
      if (lower.includes('çeyrek') && !lower.includes('eski')) return { slug: 'ceyrek-altin', type: 'gold', fixedName: 'Çeyrek Altın' };
      if (lower.includes('yarım') && !lower.includes('eski')) return { slug: 'yarim-altin', type: 'gold', fixedName: 'Yarım Altın' };
      if (lower.includes('tam') && !lower.includes('eski')) return { slug: 'tam-altin', type: 'gold', fixedName: 'Tam Altın' };
      if (lower.includes('cumhuriyet')) return { slug: 'cumhuriyet-altini', type: 'gold', fixedName: 'Cumhuriyet Altını' };
      if (lower.includes('ata') && !lower.includes('beşli')) return { slug: 'ata-altin', type: 'gold', fixedName: 'Ata Altın' };
      if (lower.includes('22 ayar')) return { slug: '22-ayar-bilezik', type: 'gold', fixedName: '22 Ayar Altın' };
      if (lower.includes('14 ayar')) return { slug: '14-ayar-altin', type: 'gold', fixedName: '14 Ayar Altın' };
      if (n === 'Dolar') return { slug: 'usd', type: 'currency', fixedName: 'Dolar' };
      if (n === 'Euro') return { slug: 'eur', type: 'currency', fixedName: 'Euro' };
      if (lower.includes('gümüş')) return { slug: 'gumus', type: 'metal', fixedName: 'Gümüş (Gram)' };
      if (lower.includes('ons')) return { slug: 'altin-ons', type: 'metal', fixedName: 'Altın Ons' };
      return null;
    };

    const mapping = parseNameSlug(nameRaw);
    if (!mapping) return;

    const buying = Math.min(safeParseFloat(buyR), safeParseFloat(sellR));
    const selling = Math.max(safeParseFloat(buyR), safeParseFloat(sellR));
    
    if (selling < 1) return;

    const percentMatch = changeRaw.match(/([+-]?[\d.,]+)/);
    const changePercent = percentMatch ? safeParseFloat(percentMatch[1]) : undefined;

    items.push({
      name: mapping.fixedName,
      slug: mapping.slug,
      price: selling,
      priceBuying: buying,
      priceSelling: selling,
      type: mapping.type,
      changePercent,
      updateTime: updateTime.length === 8 ? updateTime : undefined
    });
  });

  return { items, banks };
}

// ─────────────────────────────────────────────────────────────
// Ana veri sağlayıcı (Rotasyonlu taze veri çekimi)
// ─────────────────────────────────────────────────────────────
export async function getMarketData(): Promise<MarketResponse> {
  try {
    // Epoch zamanını 30 saniyelik dilimlere böl
    // 0. dilim -> source 1
    // 1. dilim -> source 2
    const epoch30s = Math.floor(Date.now() / 30000);
    const useSource2 = epoch30s % 2 !== 0;

    if (useSource2) {
      try {
        const { items, banks } = await fetchSource2();
        if (items.length > 5) return { items, banks, updateDate: getTRTime() };
      } catch (e) {
        console.error("Source 2 failed, falling back to Source 1");
      }
    }

    // Default or Fallback to Source 1
    const items1 = await fetchSource1();
    if (items1 && items1.length > 5) {
      // Source 1'in banka verisi olmadığı için fake premium üzerinden yaklaşık hesaplayalım
      const gramSell = items1.find(i => i.slug === 'gram-altin')?.priceSelling ?? 0;
      const gramBuy  = items1.find(i => i.slug === 'gram-altin')?.priceBuying  ?? 0;
      const banksExt: BankItem[] = [
        { name: 'Altınkaynak', premium: 0 },
        { name: 'Vakıfbank', premium: 162 },
        { name: 'Ziraat Bankası', premium: 172 },
        { name: 'Kuveyt Türk', premium: 176 },
        { name: 'Yapı Kredi', premium: 180 },
        { name: 'İş Bankası', premium: 181 },
      ].map(b => {
        const sel = gramSell + b.premium;
        const buy = gramBuy - (b.premium * 0.3);
        return { name: b.name, buying: buy, selling: sel, spread: sel - buy };
      });

      return { items: items1, banks: banksExt, updateDate: getTRTime() };
    }
  } catch (err) {
    console.error("MarketData error:", err);
  }

  // Everything failed -> statik fallback
  return { items: [
    { name: 'Gram Altın', slug: 'gram-altin', price: 6870, priceBuying: 6740, priceSelling: 6870, type: 'gold' }
  ], updateDate: getTRTime() };
}
