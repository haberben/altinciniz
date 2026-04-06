export interface AssetItem {
  name: string;
  slug: string;
  price: number;
  priceBuying: number;
  priceSelling: number;
  type: 'gold' | 'currency' | 'metal' | 'index';
  changePercent?: number;
  changeAmount?: number;
  updateTime?: string;
}

export interface BankItem {
  name: string;
  buying: number;
  selling: number;
  spread: number;
  updateTime?: string;
}

export interface MarketResponse {
  items: AssetItem[];
  banks?: BankItem[];
  updateDate: string;
  source?: string;
}

function getTRTime() {
  return new Intl.DateTimeFormat('tr-TR', {
    timeZone: 'Europe/Istanbul',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(new Date());
}

function parseTRNumber(val: string): number {
  if (!val) return 0;
  return parseFloat(val.replace(/\./g, '').replace(',', '.')) || 0;
}

// ─────────────────────────────────────────────────────────────
// SCRAPER 1: anlikaltinfiyatlari.com/altin/kapalicarsi
// ─────────────────────────────────────────────────────────────
async function fetchAnlikAltinData(): Promise<{ items: AssetItem[] } | null> {
  try {
    const res = await fetch('https://anlikaltinfiyatlari.com/altin/kapalicarsi', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': 'https://anlikaltinfiyatlari.com/',
        'Cache-Control': 'no-cache',
      },
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    const html = await res.text();

    const items: AssetItem[] = [];

    // Parse table rows — each row contains name, time, buy, sell, change
    // Pattern: look for rows within the gold price table
    const rowPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    const cellPattern = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    const stripTags = (s: string) => s.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();

    // Extract all <tr> blocks
    const rows = Array.from(html.matchAll(rowPattern));

    const nameMap: Record<string, { name: string; slug: string; type: AssetItem['type'] }> = {
      'GRAM ALTIN': { name: 'Gram Altın', slug: 'gram-altin', type: 'gold' },
      '22 AYAR ALTIN': { name: '22 Ayar Altın', slug: '22-ayar-bilezik', type: 'gold' },
      '14 AYAR ALTIN': { name: '14 Ayar Altın', slug: '14-ayar-altin', type: 'gold' },
      'ÇEYREK ALTIN': { name: 'Çeyrek Altın', slug: 'ceyrek-altin', type: 'gold' },
      'YARIM ALTIN': { name: 'Yarım Altın', slug: 'yarim-altin', type: 'gold' },
      'TAM ALTIN': { name: 'Tam Altın', slug: 'tam-altin', type: 'gold' },
      'HAS ALTIN': { name: 'Has Altın', slug: 'has-altin', type: 'gold' },
      'ATA ALTIN': { name: 'Ata Altın', slug: 'ata-altin', type: 'gold' },
      "ATA 5'Lİ": { name: "Ata 5'li", slug: 'besli-ata', type: 'gold' },
      'GREMSE (2.5)': { name: 'Gremse (2.5)', slug: 'gremse-altin', type: 'gold' },
      'GÜMÜŞ GRAM': { name: 'Gümüş Gram', slug: 'gumus', type: 'metal' },
      'GÜMÜŞ ONS': { name: 'Gümüş Ons', slug: 'gumus-ons', type: 'metal' },
      'ALTIN/GÜMÜŞ': { name: 'Altın/Gümüş Oranı', slug: 'altin-gumus-oran', type: 'metal' },
      'ALTIN ONS $': { name: 'Altın ONS ($)', slug: 'altin-ons', type: 'gold' },
    };

    for (const row of rows) {
      const rowHtml = row[1];
      const cells = Array.from(rowHtml.matchAll(cellPattern)).map((c: RegExpExecArray) => stripTags(c[1]));
      if (cells.length < 3) continue;

      const rawName = cells[0].split('\n')[0].trim().toUpperCase();
      const meta = nameMap[rawName];
      if (!meta) continue;

      // cells[0] = name + time, cells[1] = buy, cells[2] = sell, cells[3] might have change
      const timePart = cells[0].match(/\d{2}:\d{2}:\d{2}/)?.[0] || '';
      const buy = parseTRNumber(cells[1]);
      const sell = parseTRNumber(cells[2]);
      const changeRaw = cells[3] || '';
      const pctMatch = changeRaw.match(/([-+]?\d+[,.]?\d*)\s*%/);
      const amtMatch = changeRaw.match(/\(([^)]+)\)/);
      const changePercent = pctMatch ? parseFloat(pctMatch[1].replace(',', '.')) : undefined;
      const changeAmount = amtMatch ? parseTRNumber(amtMatch[1]) : undefined;

      if (buy > 0 || sell > 0) {
        items.push({
          ...meta,
          price: sell || buy,
          priceBuying: buy,
          priceSelling: sell,
          changePercent,
          changeAmount,
          updateTime: timePart,
        });
      }
    }

    if (items.length < 3) return null;
    return { items };
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// SCRAPER 2: canlialtinfiyatlari.com/kuyumcular-odasi
// ─────────────────────────────────────────────────────────────
async function fetchCanliAltinData(): Promise<{ items: AssetItem[]; banks: BankItem[] } | null> {
  try {
    const res = await fetch('https://canlialtinfiyatlari.com/kuyumcular-odasi-altin-fiyatlari.html', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': 'https://canlialtinfiyatlari.com/',
        'Cache-Control': 'no-cache',
      },
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    const html = await res.text();

    const items: AssetItem[] = [];
    const banks: BankItem[] = [];

    const rowPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    const cellPattern = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    const stripTags = (s: string) => s.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();

    const nameMap: Record<string, { name: string; slug: string; type: AssetItem['type'] }> = {
      'GRAM ALTIN': { name: 'Gram Altın', slug: 'gram-altin', type: 'gold' },
      'HAS ALTIN': { name: 'Has Altın', slug: 'has-altin', type: 'gold' },
      '14-AYAR GR': { name: '14 Ayar Altın', slug: '14-ayar-altin', type: 'gold' },
      '22-AYAR GR': { name: '22 Ayar Altın', slug: '22-ayar-bilezik', type: 'gold' },
      'ÇEYREK ALTIN': { name: 'Çeyrek Altın', slug: 'ceyrek-altin', type: 'gold' },
      'YARIM ALTIN': { name: 'Yarım Altın', slug: 'yarim-altin', type: 'gold' },
      'TAM ALTIN': { name: 'Tam Altın', slug: 'tam-altin', type: 'gold' },
      'ATA ALTIN': { name: 'Ata Altın', slug: 'ata-altin', type: 'gold' },
      'BEŞLİ ATA': { name: "Ata 5'li", slug: 'besli-ata', type: 'gold' },
      'ÇEYREK (ESKİ)': { name: 'Çeyrek (Eski)', slug: 'ceyrek-eski', type: 'gold' },
      'YARIM (ESKİ)': { name: 'Yarım (Eski)', slug: 'yarim-eski', type: 'gold' },
      'TAM (ESKİ)': { name: 'Tam (Eski)', slug: 'tam-eski', type: 'gold' },
      'ALTIN ONS': { name: 'Altın ONS ($)', slug: 'altin-ons', type: 'gold' },
      // Serbest Piyasa
      '18 AYAR ALTIN': { name: '18 Ayar Altın', slug: '18-ayar-altin', type: 'gold' },
      'KILO/DOLAR': { name: 'Kilo Altın / Dolar', slug: 'kilo-dolar', type: 'gold' },
      'KILO/EURO': { name: 'Kilo Altın / Euro', slug: 'kilo-euro', type: 'gold' },
    };

    const bankNames = [
      'ALTINKAYNAK', 'VAKIFBANK', 'ZİRAAT BANKASI', 'KUVEYT TÜRK',
      'YAPI KREDİ', 'İŞ BANKASI', 'QNB FİNANSBANK', 'GARANTİ BBVA',
      'HALKBANK', 'DENİZBANK', 'AKBANK', 'ALBARAKA TÜRK', 'TÜRKİYE FİNANS'
    ];

    const rows = Array.from(html.matchAll(rowPattern));
    for (const row of rows) {
      const rowHtml = row[1];
      const cells = Array.from(rowHtml.matchAll(cellPattern)).map((c: RegExpExecArray) => stripTags(c[1]));
      if (cells.length < 3) continue;

      const rawName = cells[0].split('\n')[0].trim().toUpperCase();

      // Try gold items
      const meta = nameMap[rawName];
      if (meta) {
        const timePart = cells[0].match(/\d{2}:\d{2}:\d{2}/)?.[0] || '';
        const buy = parseTRNumber(cells[1]);
        const sell = parseTRNumber(cells[2]);
        const changeRaw = cells[3] || '';
        const pctMatch = changeRaw.match(/([-+]?\d+[,.]?\d*)\s*%/);
        const changePercent = pctMatch ? parseFloat(pctMatch[1].replace(',', '.')) : undefined;

        if (buy > 0 || sell > 0) {
          items.push({
            ...meta,
            price: sell || buy,
            priceBuying: buy,
            priceSelling: sell,
            changePercent,
            updateTime: timePart,
          });
        }
        continue;
      }

      // Try bank items
      const bankMeta = bankNames.find(b => rawName.includes(b));
      if (bankMeta && cells.length >= 3) {
        const timePart = cells[0].match(/\d{2}:\d{2}:\d{2}/)?.[0] || '';
        const buy = parseTRNumber(cells[1]);
        const sell = parseTRNumber(cells[2]);
        const spreadRaw = cells[3] ? parseTRNumber(cells[3]) : sell - buy;
        if (buy > 0 && sell > 0) {
          banks.push({
            name: bankMeta.charAt(0) + bankMeta.slice(1).toLowerCase().replace('İ', 'İ'),
            buying: buy,
            selling: sell,
            spread: spreadRaw,
            updateTime: timePart,
          });
        }
      }
    }

    if (items.length < 3) return null;
    return { items, banks };
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// FALLBACK: truncgil.com
// ─────────────────────────────────────────────────────────────
const TRUNCGIL_API_URL = "https://finans.truncgil.com/today.json";

async function fetchTruncgilData(): Promise<AssetItem[] | null> {
  try {
    const res = await fetch(TRUNCGIL_API_URL, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    const json = await res.json();

    const createItem = (key: string, name: string, type: AssetItem['type'], customSlug?: string): AssetItem => {
      const item = json[key];
      const slug = customSlug || key.toLowerCase();
      if (!item) return { name, slug, price: 0, priceBuying: 0, priceSelling: 0, type };
      const buy = parseTRNumber(item["Alış"] || item["Alis"] || '0');
      const sell = parseTRNumber(item["Satış"] || item["Satis"] || '0');
      return { name, slug, price: sell || buy, priceBuying: buy, priceSelling: sell, type };
    };

    return [
      createItem("gram-altin", "Gram Altın", "gold", "gram-altin"),
      createItem("gram-has-altin", "Has Altın", "gold", "has-altin"),
      createItem("ceyrek-altin", "Çeyrek Altın", "gold", "ceyrek-altin"),
      createItem("yarim-altin", "Yarım Altın", "gold", "yarim-altin"),
      createItem("tam-altin", "Tam Altın", "gold", "tam-altin"),
      createItem("ata-altin", "Ata Altın", "gold", "ata-altin"),
      createItem("gremse-altin", "Gremse Altın", "gold", "gremse-altin"),
      createItem("besli-altin", "Ata 5'li", "gold", "besli-ata"),
      createItem("22-ayar-bilezik", "22 Ayar Altın", "gold", "22-ayar-bilezik"),
      createItem("14-ayar-altin", "14 Ayar Altın", "gold", "14-ayar-altin"),
      createItem("USD", "Dolar", "currency", "usd"),
      createItem("EUR", "Euro", "currency", "eur"),
      createItem("GBP", "İngiliz Sterlini", "currency", "gbp"),
      createItem("CHF", "İsviçre Frangı", "currency", "chf"),
      createItem("SAR", "Suudi Riyali", "currency", "sar"),
      createItem("gumus", "Gümüş Gram", "metal", "gumus"),
    ];
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// MAIN: 30-saniye rotasyonlu veri çekimi
// ─────────────────────────────────────────────────────────────
export async function getMarketData(): Promise<MarketResponse> {
  // Hangi kaynağı önce deneyeceğimizi 30 saniyelik epoch'a göre belirle
  const epoch30 = Math.floor(Date.now() / 30000);
  const useAnlikFirst = epoch30 % 2 === 0;

  let items: AssetItem[] | null = null;
  let banks: BankItem[] | undefined = undefined;
  let source = '';

  if (useAnlikFirst) {
    // Kaynak A: anlikaltinfiyatlari.com
    const result = await fetchAnlikAltinData();
    if (result && result.items.length > 3) {
      items = result.items;
      source = 'anlikaltinfiyatlari';
    }
    // Kaynak B: canlialtinfiyatlari.com
    if (!items) {
      const result2 = await fetchCanliAltinData();
      if (result2 && result2.items.length > 3) {
        items = result2.items;
        banks = result2.banks;
        source = 'canlialtinfiyatlari';
      }
    }
  } else {
    // Kaynak B önce
    const result = await fetchCanliAltinData();
    if (result && result.items.length > 3) {
      items = result.items;
      banks = result.banks;
      source = 'canlialtinfiyatlari';
    }
    // Kaynak A
    if (!items) {
      const result2 = await fetchAnlikAltinData();
      if (result2 && result2.items.length > 3) {
        items = result2.items;
        source = 'anlikaltinfiyatlari';
      }
    }
  }

  // Fallback: truncgil
  if (!items) {
    const truncgil = await fetchTruncgilData();
    if (truncgil && truncgil.length > 0) {
      items = truncgil;
      source = 'truncgil';
    }
  }

  // Eğer scraped veriye döviz yoksa truncgil'den döviz ekle
  if (items) {
    const hasCurrency = items.some(i => i.type === 'currency');
    if (!hasCurrency) {
      const fallback = await fetchTruncgilData();
      if (fallback) {
        const currencies = fallback.filter(i => i.type === 'currency');
        items = [...items, ...currencies];
      }
    }
    // Dolar, Euro, Sterlin, Frank, Riyal ekle - yoksa statik
    const ensureCurrency = (slug: string, name: string, buy: number, sell: number) => {
      if (!items!.find(i => i.slug === slug)) {
        items!.push({ name, slug, price: sell, priceBuying: buy, priceSelling: sell, type: 'currency' });
      }
    };
    ensureCurrency('usd', 'Dolar', 44.60, 44.60);
    ensureCurrency('eur', 'Euro', 51.58, 51.58);
    ensureCurrency('gbp', 'İngiliz Sterlini', 58.00, 58.50);
    ensureCurrency('chf', 'İsviçre Frangı', 50.00, 50.50);
    ensureCurrency('sar', 'Suudi Riyali', 11.87, 11.90);

    return { items, banks, updateDate: getTRTime(), source };
  }

  // Son çare: statik fallback
  return {
    items: [
      { name: "Gram Altın", slug: "gram-altin", price: 6750, priceBuying: 6620, priceSelling: 6750, type: "gold" },
      { name: "Has Altın", slug: "has-altin", price: 6820, priceBuying: 6700, priceSelling: 6820, type: "gold" },
      { name: "Çeyrek Altın", slug: "ceyrek-altin", price: 11500, priceBuying: 11150, priceSelling: 11500, type: "gold" },
      { name: "Yarım Altın", slug: "yarim-altin", price: 23000, priceBuying: 22300, priceSelling: 23000, type: "gold" },
      { name: "Tam Altın", slug: "tam-altin", price: 45700, priceBuying: 44300, priceSelling: 45700, type: "gold" },
      { name: "Ata Altın", slug: "ata-altin", price: 46500, priceBuying: 45200, priceSelling: 46500, type: "gold" },
      { name: "Ata 5'li", slug: "besli-ata", price: 232000, priceBuying: 225000, priceSelling: 232000, type: "gold" },
      { name: "22 Ayar Altın", slug: "22-ayar-bilezik", price: 6450, priceBuying: 6160, priceSelling: 6450, type: "gold" },
      { name: "14 Ayar Altın", slug: "14-ayar-altin", price: 4930, priceBuying: 3700, priceSelling: 4930, type: "gold" },
      { name: "Gremse (2.5)", slug: "gremse-altin", price: 113000, priceBuying: 110000, priceSelling: 113000, type: "gold" },
      { name: "Altın ONS ($)", slug: "altin-ons", price: 4665, priceBuying: 4664, priceSelling: 4665, type: "gold" },
      { name: "Gümüş Gram", slug: "gumus", price: 109, priceBuying: 101, priceSelling: 109, type: "metal" },
      { name: "Gümüş Ons", slug: "gumus-ons", price: 72.30, priceBuying: 72.26, priceSelling: 72.30, type: "metal" },
      { name: "Altın/Gümüş Oranı", slug: "altin-gumus-oran", price: 66.80, priceBuying: 61.71, priceSelling: 66.80, type: "metal" },
      { name: "Dolar", slug: "usd", price: 44.60, priceBuying: 44.45, priceSelling: 44.60, type: "currency" },
      { name: "Euro", slug: "eur", price: 51.58, priceBuying: 51.09, priceSelling: 51.58, type: "currency" },
      { name: "İngiliz Sterlini", slug: "gbp", price: 58.49, priceBuying: 58.49, priceSelling: 59.08, type: "currency" },
      { name: "İsviçre Frangı", slug: "chf", price: 55.91, priceBuying: 55.35, priceSelling: 55.91, type: "currency" },
      { name: "Suudi Riyali", slug: "sar", price: 11.89, priceBuying: 11.77, priceSelling: 11.89, type: "currency" },
    ],
    updateDate: getTRTime(),
    source: 'static'
  };
}
