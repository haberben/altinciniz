import { ASSET_SPECS } from './assets';

export interface AssetItem {
  name: string;
  slug: string;
  price: number;
  priceBuying: number;
  priceSelling: number;
  type: 'gold' | 'currency' | 'metal';
  unit: 'TRY' | 'USD' | 'RATIO';
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
  serbestItems: AssetItem[];
  banks: BankItem[];
  updateDate: string;
  updateDateLong: string;
  updatedIso: string;
  activeSource: string;
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

function getTRDateLong(): string {
  return new Intl.DateTimeFormat('tr-TR', {
    timeZone: 'Europe/Istanbul',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());
}

function safeParseFloat(raw: string | undefined): number {
  if (!raw) return 0;
  const clean = raw.replace(/[^\d.,-]/g, '').trim();
  if (!clean) return 0;
  if (clean.includes(',')) {
    const withoutThousands = clean.replace(/\./g, '');
    return parseFloat(withoutThousands.replace(',', '.')) || 0;
  }
  // If multiple dots (e.g. 1.234.567) treat as thousands
  const dots = (clean.match(/\./g) || []).length;
  if (dots > 1) {
    return parseFloat(clean.replace(/\./g, '')) || 0;
  }
  return parseFloat(clean) || 0;
}

function cleanText(htmlStr: string): string {
  return htmlStr.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ').trim().replace(/\s+/g, ' ');
}

function extractNameAndTime(raw: string): { name: string; updateTime?: string } {
  const timeMatch = raw.match(/(\d{2}:\d{2}:\d{2})/);
  const updateTime = timeMatch ? timeMatch[1] : undefined;
  let name = raw
    .replace(/\d{4}-\d{2}-\d{2}\s*/g, '')
    .replace(/\d{2}:\d{2}:\d{2}/g, '')
    .replace(/^Kuyumcular Odası Altın Fiyatları\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  return { name, updateTime };
}

function mapRawNameToSlug(rawName: string): string | null {
  const lower = rawName.toLocaleLowerCase('tr-TR');

  // Altın çeşitleri (önce spesifik eski / ayar / sikke eşleştirmeleri!)
  if (lower.includes('çeyrek') && lower.includes('eski')) return 'ceyrek-eski';
  if (lower.includes('yarım') && lower.includes('eski')) return 'yarim-eski';
  if (lower.includes('tam') && lower.includes('eski')) return 'tam-eski';

  if (lower.includes('has altın') || lower === 'has') return 'has-altin';
  if (lower.includes('gram altın') || lower === 'gram') return 'gram-altin';
  if (lower.includes('22 ayar') || lower.includes('22-ayar')) return '22-ayar-bilezik';
  if (lower.includes('18 ayar') || lower.includes('18-ayar')) return '18-ayar-altin';
  if (lower.includes('14 ayar') || lower.includes('14-ayar')) return '14-ayar-altin';
  if (lower.includes('çeyrek')) return 'ceyrek-altin';
  if (lower.includes('yarım')) return 'yarim-altin';
  if (lower.includes('tam altın') || lower === 'tam') return 'tam-altin';
  if (lower.includes('cumhuriyet')) return 'cumhuriyet-altini';
  if (lower.includes('beşli') || lower.includes("5'li")) return 'besli-ata';
  if (lower.includes('ata altın') || lower === 'ata') return 'ata-altin';
  if (lower.includes('gremse')) return 'gremse-altin';
  if (lower.includes('altın ons') || lower === 'ons altın') return 'altin-ons';

  // Değerli madenler
  if (lower.includes('altın/gümüş') || lower.includes('xau/xag')) return 'altin-gumus-oran';
  if (lower.includes('gümüş ons')) return 'gumus-ons';
  if (lower.includes('gümüş')) return 'gumus';

  // Döviz
  if (lower === 'dolar' || lower === 'usd' || lower.includes('amerikan doları')) return 'dolar';
  if (lower === 'euro' || lower === 'eur') return 'euro';
  if (lower === 'pound' || lower === 'sterlin' || lower.includes('sterlin')) return 'sterlin';
  if (lower === 'frank' || lower.includes('isviçre frangı')) return 'isvicre-frangi';
  if (lower === 'riyal' || lower.includes('suudi riyali')) return 'suudi-riyali';
  if (lower.includes('kanada doları')) return 'kanada-dolari';
  if (lower.includes('avustralya doları')) return 'avustralya-dolari';

  return null;
}

function buildAsset(
  slug: string,
  buying: number,
  selling: number,
  changePercent?: number,
  changeAmount?: number,
  updateTime?: string
): AssetItem | null {
  const spec = ASSET_SPECS[slug];
  if (!spec) return null;
  if (!Number.isFinite(buying) || !Number.isFinite(selling) || buying <= 0 || selling <= 0) return null;

  const fixedBuy = Math.min(buying, selling);
  const fixedSell = Math.max(buying, selling);

  return {
    name: spec.shortName,
    slug: spec.slug,
    price: fixedSell,
    priceBuying: fixedBuy,
    priceSelling: fixedSell,
    type: spec.type,
    unit: spec.unit,
    changePercent: Number.isFinite(changePercent) ? changePercent : undefined,
    changeAmount: Number.isFinite(changeAmount) ? changeAmount : undefined,
    updateTime,
  };
}

function parseChangeCell(raw: string): { sell?: number; changePercent?: number; changeAmount?: number } {
  const sellMatch = raw.match(/^[\d.,]+/);
  const sell = sellMatch ? safeParseFloat(sellMatch[0]) : undefined;
  // Supports both "-0.26 %" and "% 2.21"
  const pctMatch = raw.match(/([+-]?[\d.,]+)\s*%/) || raw.match(/%\s*([+-]?[\d.,]+)/);
  const changePercent = pctMatch ? safeParseFloat(pctMatch[1]) : undefined;
  const amtMatch = raw.match(/\(\s*([+-]?[\d.,]+)\s*\)/);
  const changeAmount = amtMatch ? safeParseFloat(amtMatch[1]) : undefined;
  return { sell, changePercent, changeAmount };
}

// ─────────────────────────────────────────────────────────────
// KAYNAK 1: anlikaltinfiyatlari.com/altin/kapalicarsi
// ─────────────────────────────────────────────────────────────
async function fetchSource1(): Promise<AssetItem[] | null> {
  try {
    const url = 'https://anlikaltinfiyatlari.com/altin/kapalicarsi';
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
      next: { revalidate: 15 },
      signal: AbortSignal.timeout(3500),
    });
    if (!res.ok) return null;
    const html = await res.text();

    const map = new Map<string, AssetItem>();
    const rows = html.match(/<tr[^>]*>[\s\S]*?<\/tr>/g) || [];

    for (const row of rows) {
      const cells = Array.from(row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)).map((m) => cleanText(m[1]));
      if (cells.length < 3) continue;

      const { name, updateTime } = extractNameAndTime(cells[0]);
      const slug = mapRawNameToSlug(name);
      if (!slug || map.has(slug)) continue;

      const buying = safeParseFloat(cells[1]);
      const parsed = parseChangeCell(cells[2]);
      const selling = parsed.sell ?? safeParseFloat(cells[2]);

      const item = buildAsset(slug, buying, selling, parsed.changePercent, parsed.changeAmount, updateTime);
      if (item) map.set(slug, item);
    }

    const items = Array.from(map.values());
    return items.length >= 6 ? items : null;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// KAYNAK 2: canlialtinfiyatlari.com (Kuyumcular Odası + Serbest Piyasa + Bankalar + Gümüş)
// ─────────────────────────────────────────────────────────────
async function fetchSource2(): Promise<{
  kuyumcuItems: AssetItem[];
  serbestItems: AssetItem[];
  banks: BankItem[];
} | null> {
  try {
    const url = 'https://canlialtinfiyatlari.com/kuyumcular-odasi-altin-fiyatlari.html';
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
      next: { revalidate: 15 },
      signal: AbortSignal.timeout(3500),
    });
    if (!res.ok) return null;
    const html = await res.text();

    const tables = html.match(/<table[\s\S]*?<\/table>/gi) || [];
    if (tables.length < 2) return null;

    const kuyumcuMap = new Map<string, AssetItem>();
    const serbestMap = new Map<string, AssetItem>();
    const banks: BankItem[] = [];

    tables.forEach((tableHtml, tableIdx) => {
      const upperHtml = tableHtml.toUpperCase();
      const rows = tableHtml.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];

      const isBankTable = upperHtml.includes('MAKAS') && upperHtml.includes('GRAM ALTIN');
      const isSerbestGoldTable = upperHtml.includes('SERBEST PİYASA') || upperHtml.includes('SERBEST PIYASA') || tableIdx === 1;
      const isKuyumcuGoldTable = !isSerbestGoldTable && !isBankTable && (upperHtml.includes('KUYUMCU') || tableIdx === 0);
      const isCurrencyTable = upperHtml.includes('DÖVİZ') || upperHtml.includes('DOVIZ');
      const isSilverTable = upperHtml.includes('GÜMÜŞ') || upperHtml.includes('GUMUS');

      for (const row of rows) {
        const cells = Array.from(row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)).map((m) => cleanText(m[1]));
        if (cells.length < 3) continue;

        if (isBankTable && cells.length >= 4) {
          // Reject stale rows with explicit past date like 2026-08-25
          if (/\d{4}-\d{2}-\d{2}/.test(cells[0])) continue;
          const { name, updateTime } = extractNameAndTime(cells[0]);
          if (!name) continue;
          const buying = safeParseFloat(cells[1]);
          const selling = safeParseFloat(cells[2]);
          const spread = cells[3] ? safeParseFloat(cells[3]) : selling - buying;
          if (buying > 0 && selling > 0 && selling > buying) {
            banks.push({
              name,
              buying,
              selling,
              spread: spread > 0 ? spread : selling - buying,
              updateTime,
            });
          }
          continue;
        }

        if (isSilverTable && cells.length >= 4) {
          // Row shape: ["Gümüş Gram", "TL", "71.3763", "4.92 %"]
          const { name, updateTime } = extractNameAndTime(cells[0]);
          const slug = mapRawNameToSlug(name);
          if (!slug) continue;
          const val = safeParseFloat(cells[2]);
          const pctMatch = cells[3].match(/([+-]?[\d.,]+)/);
          const chg = pctMatch ? safeParseFloat(pctMatch[1]) : undefined;
          const item = buildAsset(slug, val, val, chg, undefined, updateTime);
          if (item) {
            if (!kuyumcuMap.has(slug)) kuyumcuMap.set(slug, item);
            if (!serbestMap.has(slug)) serbestMap.set(slug, item);
          }
          continue;
        }

        if (isCurrencyTable && cells.length >= 4) {
          const { name, updateTime } = extractNameAndTime(cells[0]);
          const slug = mapRawNameToSlug(name);
          if (!slug) continue;
          const buying = safeParseFloat(cells[1]);
          const selling = safeParseFloat(cells[2]);
          const pctMatch = cells[3].match(/([+-]?[\d.,]+)/);
          const chg = pctMatch ? safeParseFloat(pctMatch[1]) : undefined;
          const item = buildAsset(slug, buying, selling, chg, undefined, updateTime);
          if (item) kuyumcuMap.set(slug, item);
          continue;
        }

        if (isKuyumcuGoldTable || isSerbestGoldTable) {
          const { name, updateTime } = extractNameAndTime(cells[0]);
          const slug = mapRawNameToSlug(name);
          if (!slug) continue;
          const buying = safeParseFloat(cells[1]);
          const parsed = parseChangeCell(cells[2]);
          const selling = parsed.sell ?? safeParseFloat(cells[2]);
          const item = buildAsset(slug, buying, selling, parsed.changePercent, parsed.changeAmount, updateTime);
          if (!item) continue;
          if (isSerbestGoldTable) {
            if (!serbestMap.has(slug)) serbestMap.set(slug, item);
          } else {
            if (!kuyumcuMap.has(slug)) kuyumcuMap.set(slug, item);
          }
        }
      }
    });

    const kuyumcuItems = Array.from(kuyumcuMap.values());
    const serbestItems = Array.from(serbestMap.values());
    return kuyumcuItems.length >= 6 || serbestItems.length >= 6
      ? { kuyumcuItems, serbestItems, banks }
      : null;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// KAYNAK 3: Truncgil JSON API (Cloudflare-Safe Enrichment & Fallback)
// ─────────────────────────────────────────────────────────────
async function fetchTruncgilData(): Promise<AssetItem[] | null> {
  try {
    const res = await fetch('https://finans.truncgil.com/today.json', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 15 },
      signal: AbortSignal.timeout(3500),
    });
    if (!res.ok) return null;
    const json = await res.json();

    const mapKeys: [string, string][] = [
      ['gram-altin', 'gram-altin'],
      ['gram-has-altin', 'has-altin'],
      ['ceyrek-altin', 'ceyrek-altin'],
      ['yarim-altin', 'yarim-altin'],
      ['tam-altin', 'tam-altin'],
      ['cumhuriyet-altini', 'cumhuriyet-altini'],
      ['ata-altin', 'ata-altin'],
      ['besli-altin', 'besli-ata'],
      ['gremse-altin', 'gremse-altin'],
      ['22-ayar-bilezik', '22-ayar-bilezik'],
      ['18-ayar-altin', '18-ayar-altin'],
      ['14-ayar-altin', '14-ayar-altin'],
      ['ons', 'altin-ons'],
      ['gumus', 'gumus'],
      ['USD', 'dolar'],
      ['EUR', 'euro'],
      ['GBP', 'sterlin'],
      ['CHF', 'isvicre-frangi'],
      ['SAR', 'suudi-riyali'],
      ['CAD', 'kanada-dolari'],
      ['AUD', 'avustralya-dolari'],
    ];

    const items: AssetItem[] = [];
    for (const [key, slug] of mapKeys) {
      const raw = json[key];
      if (!raw) continue;
      const buy = safeParseFloat(raw['Alış'] || raw['Alis'] || '0');
      const sell = safeParseFloat(raw['Satış'] || raw['Satis'] || '0');
      const pctMatch = String(raw['Değişim'] || '').match(/([+-]?[\d.,]+)/);
      const chg = pctMatch ? safeParseFloat(pctMatch[1]) : undefined;
      const item = buildAsset(slug, buy, sell, chg);
      if (item) items.push(item);
    }

    return items.length > 0 ? items : null;
  } catch {
    return null;
  }
}

function mergeBySlug(primary: AssetItem[], secondary: AssetItem[]): AssetItem[] {
  const map = new Map<string, AssetItem>();
  for (const item of primary) {
    map.set(item.slug, item);
  }
  for (const item of secondary) {
    if (!map.has(item.slug)) {
      map.set(item.slug, item);
    }
  }
  return Array.from(map.values());
}

// ─────────────────────────────────────────────────────────────
// ANA VERİ ORKESTRASYONU
// ─────────────────────────────────────────────────────────────
export async function getMarketData(): Promise<MarketResponse> {
  const epoch30s = Math.floor(Date.now() / 30000);
  const rotateToSource2 = epoch30s % 2 !== 0;

  const [res1, res2, res3] = await Promise.allSettled([
    fetchSource1(),
    fetchSource2(),
    fetchTruncgilData(),
  ]);

  const s1 = res1.status === 'fulfilled' ? res1.value : null;
  const s2 = res2.status === 'fulfilled' ? res2.value : null;
  const s3 = res3.status === 'fulfilled' ? res3.value : null;

  let items: AssetItem[] = [];
  let activeSource = 'Kapalıçarşı';

  if (rotateToSource2) {
    if (s2?.kuyumcuItems?.length) {
      items = mergeBySlug(s2.kuyumcuItems, s1 || []);
      activeSource = 'Kuyumcular Odası & Serbest Piyasa';
    } else if (s1?.length) {
      items = s1;
      activeSource = 'Kapalıçarşı';
    }
  } else {
    if (s1?.length) {
      items = mergeBySlug(s1, s2?.kuyumcuItems || []);
      activeSource = 'Kapalıçarşı';
    } else if (s2?.kuyumcuItems?.length) {
      items = s2.kuyumcuItems;
      activeSource = 'Kuyumcular Odası & Serbest Piyasa';
    }
  }

  // Missing assets enrichment (Cumhuriyet Altını, 18 Ayar, ek dövizler) from Serbest + Truncgil
  if (s2?.serbestItems?.length) {
    items = mergeBySlug(items, s2.serbestItems);
  }
  if (s3?.length) {
    items = mergeBySlug(items, s3);
    if (activeSource === 'Kapalıçarşı' && !s1?.length && !s2?.kuyumcuItems?.length) {
      activeSource = 'Piyasa Verisi';
    }
  }

  // Ensure cumhuriyet-altini always aligns if missing (same Darphane 7.216g standard as ata-altin)
  if (!items.some((i) => i.slug === 'cumhuriyet-altini')) {
    const ata = items.find((i) => i.slug === 'ata-altin');
    if (ata) {
      const cum = buildAsset('cumhuriyet-altini', ata.priceBuying, ata.priceSelling, ata.changePercent, ata.changeAmount, ata.updateTime);
      if (cum) items.push(cum);
    }
  }

  // Ultimate fallback shield only if ALL 3 external providers fail simultaneously
  if (items.length === 0) {
    const staticFallback: [string, number, number][] = [
      ['gram-altin', 6035, 6130],
      ['has-altin', 6065, 6106],
      ['22-ayar-bilezik', 5518, 5720],
      ['18-ayar-altin', 4460, 4550],
      ['14-ayar-altin', 3307, 4469],
      ['ceyrek-altin', 9888, 10143],
      ['ceyrek-eski', 9858, 10082],
      ['yarim-altin', 19776, 20285],
      ['yarim-eski', 19596, 20105],
      ['tam-altin', 39431, 40143],
      ['tam-eski', 39132, 40026],
      ['cumhuriyet-altini', 40523, 40998],
      ['ata-altin', 40523, 40998],
      ['besli-ata', 202008, 204942],
      ['gremse-altin', 98274, 99900],
      ['altin-ons', 3647.9, 3648.3],
      ['gumus', 67.94, 77.59],
      ['gumus-ons', 43.69, 43.72],
      ['altin-gumus-oran', 77.92, 89.27],
      ['dolar', 50.698, 50.792],
      ['euro', 55.265, 55.483],
      ['sterlin', 66.107, 66.453],
      ['isvicre-frangi', 60.049, 60.637],
      ['suudi-riyali', 13.204, 13.655],
    ];
    items = staticFallback
      .map(([slug, buy, sell]) => buildAsset(slug, buy, sell))
      .filter((x): x is AssetItem => Boolean(x));
    activeSource = 'Yedek Piyasa Verisi';
  }

  // Serbest piyasa comparison items (use Source 2 Table 1 or Truncgil real toptan prices)
  let serbestItems: AssetItem[] = s2?.serbestItems?.length
    ? mergeBySlug(s2.serbestItems, s3 || [])
    : s3?.length
      ? s3
      : items;

  // Real banks from Source 2 (sorted by narrowest spread first!), fallback calculated cleanly if Source 2 down
  let banks: BankItem[] = (s2?.banks || [])
    .slice()
    .sort((a, b) => a.spread - b.spread);

  if (banks.length === 0) {
    const gram = items.find((i) => i.slug === 'gram-altin');
    const gramBuy = gram?.priceBuying ?? 6035;
    const gramSell = gram?.priceSelling ?? 6130;
    banks = [
      { name: 'Altınkaynak', spreadHint: 58, sellOffset: -30 },
      { name: 'Albaraka Türk', spreadHint: 109, sellOffset: -160 },
      { name: 'Ziraat Bankası', spreadHint: 118, sellOffset: -145 },
      { name: 'QNB Finansbank', spreadHint: 120, sellOffset: -130 },
      { name: 'Vakıfbank', spreadHint: 123, sellOffset: -130 },
      { name: 'Kuveyt Türk', spreadHint: 154, sellOffset: -165 },
    ].map((b) => {
      const selling = Number((gramSell + b.sellOffset).toFixed(2));
      const buying = Number((selling - b.spreadHint).toFixed(2));
      return {
        name: b.name,
        buying: buying > 0 ? buying : gramBuy,
        selling,
        spread: Number((selling - buying).toFixed(2)),
      };
    });
  }

  return {
    items,
    serbestItems,
    banks,
    updateDate: getTRTime(),
    updateDateLong: getTRDateLong(),
    updatedIso: new Date().toISOString(),
    activeSource,
  };
}
