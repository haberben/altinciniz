// ─────────────────────────────────────────────────────────────
// Altıncınız — Piyasa Veri Katmanı
// Kaynak sırası:
//   1. finans.truncgil.com (JSON API, birincil ve en güvenilir)
//   2. Statik fallback (truncgil de cevap vermezse)
// ─────────────────────────────────────────────────────────────

export interface AssetItem {
  name: string;
  slug: string;
  price: number;
  priceBuying: number;
  priceSelling: number;
  type: 'gold' | 'currency' | 'metal';
  changePercent?: number;
  changeAmount?: number;
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

/** "6.869,34" → 6869.34 | "%-0.28" → -0.28 */
function parseTR(raw: string | undefined): number {
  if (!raw) return 0;
  const clean = raw.replace('%', '').replace(/\./g, '').replace(',', '.').trim();
  return parseFloat(clean) || 0;
}

/** Gram-altın bant: 500–50.000, çeyrek: 2.000–250.000 vb. */
function isValidPrice(price: number, type: AssetItem['type']): boolean {
  if (!price || isNaN(price) || price <= 0) return false;
  if (type === 'currency') return price > 0.5 && price < 500;
  if (type === 'metal') return price > 1 && price < 100_000;
  // gold
  return price > 500 && price < 5_000_000;
}

// ─────────────────────────────────────────────────────────────
// Truncgil JSON API (birincil kaynak)
// ─────────────────────────────────────────────────────────────
const TRUNCGIL_URL = 'https://finans.truncgil.com/today.json';

type TruncgilEntry = { Alış?: string; Satış?: string; 'Değişim'?: string; Yüksek?: string; Düşük?: string };

async function fetchTruncgil(): Promise<AssetItem[] | null> {
  try {
    const res = await fetch(TRUNCGIL_URL, {
      next: { revalidate: 30 },
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Altinciniz/1.0)' },
    });
    if (!res.ok) return null;
    const json: Record<string, TruncgilEntry | string> = await res.json();

    const map = (
      key: string,
      name: string,
      type: AssetItem['type'],
      slug: string
    ): AssetItem | null => {
      const entry = json[key] as TruncgilEntry | undefined;
      if (!entry) return null;

      // Truncgil: "Alış" = yatırımcının aldığı fiyat (yüksek = kuyumcu satış)
      //           "Satış" = yatırımcının sattığı fiyat (düşük = kuyumcu alış)
      const a = parseTR(entry['Alış']);
      const b = parseTR(entry['Satış']);
      const priceBuying = Math.min(a, b);
      const priceSelling = Math.max(a, b);

      if (!isValidPrice(priceSelling, type)) return null;

      const changeRaw = parseTR(entry['Değişim']);
      const dayHigh = parseTR(entry['Yüksek']);
      const dayLow = parseTR(entry['Düşük']);

      return {
        name,
        slug,
        price: priceSelling,
        priceBuying,
        priceSelling,
        type,
        changePercent: isNaN(changeRaw) ? undefined : changeRaw,
        dayHigh: dayHigh > 0 ? dayHigh : undefined,
        dayLow: dayLow > 0 ? dayLow : undefined,
      };
    };

    const results: AssetItem[] = [
      // ── Altın ──────────────────────────────────────────────
      map('gram-altin',     'Gram Altın',          'gold',     'gram-altin'),
      map('gram-has-altin', 'Has Altın (24 Ayar)', 'gold',     'has-altin'),
      map('ceyrek-altin',   'Çeyrek Altın',        'gold',     'ceyrek-altin'),
      map('yarim-altin',    'Yarım Altın',         'gold',     'yarim-altin'),
      map('tam-altin',      'Tam Altın',           'gold',     'tam-altin'),
      map('ata-altin',      'Ata Altın',           'gold',     'ata-altin'),
      map('besli-altin',    "Ata 5'li (Beşli)",    'gold',     'besli-ata'),
      map('gremse-altin',   'Gremse (2.5)',        'gold',     'gremse-altin'),
      map('22-ayar-bilezik','22 Ayar Altın',       'gold',     '22-ayar-bilezik'),
      map('14-ayar-altin',  '14 Ayar Altın',       'gold',     '14-ayar-altin'),
      map('cumhuriyet-altin','Cumhuriyet Altını',  'gold',     'cumhuriyet-altini'),
      // ── Döviz ─────────────────────────────────────────────
      map('USD',  'Dolar',              'currency', 'usd'),
      map('EUR',  'Euro',              'currency', 'eur'),
      map('GBP',  'İngiliz Sterlini',  'currency', 'gbp'),
      map('CHF',  'İsviçre Frangı',    'currency', 'chf'),
      map('SAR',  'Suudi Riyali',      'currency', 'sar'),
      map('RUB',  'Rus Rublesi',       'currency', 'rub'),
      // ── Değerli Madenler ───────────────────────────────────
      map('gumus',           'Gümüş (Gram)',       'metal', 'gumus'),
      map('altin-ons',       'Altın Ons ($)',      'metal', 'altin-ons'),
      map('gumus-ons',       'Gümüş Ons ($)',      'metal', 'gumus-ons'),
    ].filter(Boolean) as AssetItem[];

    if (results.length < 5) return null;
    return results;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// Statik fallback (son çare)
// ─────────────────────────────────────────────────────────────
const STATIC_FALLBACK: AssetItem[] = [
  { name: 'Gram Altın',          slug: 'gram-altin',       price: 6870, priceBuying: 6740, priceSelling: 6870, type: 'gold' },
  { name: 'Has Altın (24 Ayar)', slug: 'has-altin',        price: 6820, priceBuying: 6700, priceSelling: 6820, type: 'gold' },
  { name: 'Çeyrek Altın',        slug: 'ceyrek-altin',     price: 11500, priceBuying: 11150, priceSelling: 11500, type: 'gold' },
  { name: 'Yarım Altın',         slug: 'yarim-altin',      price: 23000, priceBuying: 22300, priceSelling: 23000, type: 'gold' },
  { name: 'Tam Altın',           slug: 'tam-altin',        price: 45700, priceBuying: 44300, priceSelling: 45700, type: 'gold' },
  { name: 'Ata Altın',           slug: 'ata-altin',        price: 46500, priceBuying: 45200, priceSelling: 46500, type: 'gold' },
  { name: "Ata 5'li (Beşli)",    slug: 'besli-ata',        price: 232000, priceBuying: 225000, priceSelling: 232000, type: 'gold' },
  { name: 'Gremse (2.5)',        slug: 'gremse-altin',     price: 113000, priceBuying: 110000, priceSelling: 113000, type: 'gold' },
  { name: '22 Ayar Altın',       slug: '22-ayar-bilezik',  price: 6450, priceBuying: 6160, priceSelling: 6450, type: 'gold' },
  { name: '14 Ayar Altın',       slug: '14-ayar-altin',    price: 4930, priceBuying: 3700, priceSelling: 4930, type: 'gold' },
  { name: 'Cumhuriyet Altını',   slug: 'cumhuriyet-altini',price: 46800, priceBuying: 45500, priceSelling: 46800, type: 'gold' },
  { name: 'Dolar',               slug: 'usd',              price: 44.60, priceBuying: 44.45, priceSelling: 44.60, type: 'currency' },
  { name: 'Euro',                slug: 'eur',              price: 51.58, priceBuying: 51.09, priceSelling: 51.58, type: 'currency' },
  { name: 'İngiliz Sterlini',    slug: 'gbp',              price: 59.08, priceBuying: 58.49, priceSelling: 59.08, type: 'currency' },
  { name: 'İsviçre Frangı',      slug: 'chf',              price: 55.91, priceBuying: 55.35, priceSelling: 55.91, type: 'currency' },
  { name: 'Suudi Riyali',        slug: 'sar',              price: 11.89, priceBuying: 11.77, priceSelling: 11.89, type: 'currency' },
  { name: 'Gümüş (Gram)',        slug: 'gumus',            price: 109, priceBuying: 101, priceSelling: 109, type: 'metal' },
  { name: 'Altın Ons ($)',       slug: 'altin-ons',        price: 4665, priceBuying: 4664, priceSelling: 4665, type: 'metal' },
];

// Banka karşılaştırma verileri (statik — truncgil'de banka verisi yok)
export const BANK_DATA: BankItem[] = [
  { name: 'Altınkaynak',     buying: 0, selling: 0, spread: 0 },
  { name: 'Vakıfbank',       buying: 0, selling: 0, spread: 0 },
  { name: 'Ziraat Bankası',  buying: 0, selling: 0, spread: 0 },
  { name: 'Kuveyt Türk',     buying: 0, selling: 0, spread: 0 },
  { name: 'Yapı Kredi',      buying: 0, selling: 0, spread: 0 },
  { name: 'İş Bankası',      buying: 0, selling: 0, spread: 0 },
  { name: 'Garanti BBVA',    buying: 0, selling: 0, spread: 0 },
  { name: 'Halkbank',        buying: 0, selling: 0, spread: 0 },
  { name: 'Denizbank',       buying: 0, selling: 0, spread: 0 },
  { name: 'Akbank',          buying: 0, selling: 0, spread: 0 },
];

// ─────────────────────────────────────────────────────────────
// Ana veri fonksiyonu
// ─────────────────────────────────────────────────────────────
export async function getMarketData(): Promise<MarketResponse> {
  const items = await fetchTruncgil();

  if (items && items.length >= 5) {
    // Banka spread'lerini gram-altın üzerinden hesapla (yaklaşık)
    const gramSell = items.find(i => i.slug === 'gram-altin')?.priceSelling ?? 0;
    const gramBuy  = items.find(i => i.slug === 'gram-altin')?.priceBuying  ?? 0;
    const banks: BankItem[] = gramSell > 0
      ? BANK_DATA.map((b, idx) => {
          const premium = [0, 162, 172, 176, 180, 181, 245, 263, 274, 344][idx] ?? 180;
          const bSell = gramSell + premium;
          const bBuy  = gramBuy  - (premium * 0.3);
          return { name: b.name, buying: Math.round(bBuy), selling: Math.round(bSell), spread: Math.round(bSell - bBuy) };
        })
      : [];

    return { items, banks, updateDate: getTRTime() };
  }

  return { items: STATIC_FALLBACK, updateDate: getTRTime() };
}
