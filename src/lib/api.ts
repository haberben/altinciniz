export interface AssetItem {
  name: string;
  slug: string;
  price: number; 
  priceBuying: number;
  priceSelling: number;
  type: 'gold' | 'currency' | 'metal';
}

export interface MarketResponse {
  items: AssetItem[];
  updateDate: string;
}

const API_KEY = "hapi_6eb9f72089734ea7aa46655f7f000689";
const HAREM_API_URL = `https://haremapi.tr/api/v1/prices?api_key=${API_KEY}`;
const TRUNCGIL_API_URL = "https://finans.truncgil.com/today.json";

async function fetchHaremData(): Promise<AssetItem[] | null> {
  try {
    const res = await fetch(HAREM_API_URL, { 
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
      },
      next: { revalidate: 15 } 
    });
    
    if (!res.ok) return null;
    const json = await res.json();
    
    let dataArray: any[] = [];
    if (Array.isArray(json)) {
      dataArray = json;
    } else if (json.data) {
      dataArray = Array.isArray(json.data) ? json.data : Object.values(json.data);
    } else if (typeof json === 'object') {
      dataArray = Object.values(json).filter((item: any) => item && typeof item === 'object' && (item.symbol || item.code || item.bid));
    }

    if (!dataArray || dataArray.length === 0) return null;

    const createItem = (key: string, name: string, type: 'gold' | 'currency' | 'metal', customSlug?: string): AssetItem => {
      const item = dataArray.find((i: any) => i.symbol === key || i.code === key);
      const slug = customSlug || key.toLowerCase().replace(/_/g, '-');
      if (!item) return { name, slug, price: 0, priceBuying: 0, priceSelling: 0, type };
      
      const buy = parseFloat(item.bid) || 0;
      const sell = parseFloat(item.ask) || 0;
      return { name, slug, price: sell || buy, priceBuying: buy, priceSelling: sell, type };
    };

    return [
      createItem("ALTIN", "Gram Altın", "gold", "gram-altin"),
      createItem("KULCEALTIN", "Has Altın (Külçe)", "gold", "has-altin"),
      createItem("CEYREK_YENI", "Çeyrek Altın", "gold", "ceyrek-altin"),
      createItem("YARIM_YENI", "Yarım Altın", "gold", "yarim-altin"),
      createItem("TEK_YENI", "Tam Altın", "gold", "tam-altin"),
      createItem("ATA_YENI", "Ata Altın", "gold", "ata-altin"),
      createItem("GREMESE_YENI", "Gremse Altın", "gold", "gremse-altin"),
      createItem("ATA5_YENI", "Beşli Ata", "gold", "besli-ata"),
      createItem("AYAR22", "22 Ayar Bilezik", "gold", "22-ayar-bilezik"),
      createItem("AYAR14", "14 Ayar Altın", "gold", "14-ayar-altin"),
      createItem("USDTRY", "Dolar", "currency", "usd"),
      createItem("EURTRY", "Euro", "currency", "eur"),
      createItem("GBPTRY", "İngiliz Sterlini", "currency", "gbp"),
      createItem("CHFTRY", "İsviçre Frangı", "currency", "chf"),
      createItem("SARTRY", "Suudi Riyali", "currency", "sar"),
      createItem("GUMTRY", "Gümüş (Gram)", "metal", "gumus"),
      createItem("PLATIN", "Platin", "metal", "platin"),
      createItem("PALADYUM", "Paladyum", "metal", "paladyum")
    ];
  } catch (e) {
    return null;
  }
}

async function fetchTruncgilData(): Promise<AssetItem[] | null> {
  try {
    const res = await fetch(TRUNCGIL_API_URL, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    const json = await res.json();

    const parseTR = (val: string) => parseFloat(val.replace('.', '').replace(',', '.')) || 0;

    const createItem = (key: string, name: string, type: 'gold' | 'currency' | 'metal', customSlug?: string): AssetItem => {
      const item = json[key];
      const slug = customSlug || key.toLowerCase();
      if (!item) return { name, slug, price: 0, priceBuying: 0, priceSelling: 0, type };
      
      const buy = parseTR(item["Alış"] || item["Alis"]);
      const sell = parseTR(item["Satış"] || item["Satis"]);
      return { name, slug, price: sell || buy, priceBuying: buy, priceSelling: sell, type };
    };

    return [
      createItem("gram-altin", "Gram Altın", "gold", "gram-altin"),
      createItem("gram-has-altin", "Has Altın (Külçe)", "gold", "has-altin"),
      createItem("ceyrek-altin", "Çeyrek Altın", "gold", "ceyrek-altin"),
      createItem("yarim-altin", "Yarım Altın", "gold", "yarim-altin"),
      createItem("tam-altin", "Tam Altın", "gold", "tam-altin"),
      createItem("ata-altin", "Ata Altın", "gold", "ata-altin"),
      createItem("gremse-altin", "Gremse Altın", "gold", "gremse-altin"),
      createItem("besli-altin", "Beşli Ata", "gold", "besli-ata"),
      createItem("22-ayar-bilezik", "22 Ayar Bilezik", "gold", "22-ayar-bilezik"),
      createItem("14-ayar-altin", "14 Ayar Altın", "gold", "14-ayar-altin"),
      createItem("USD", "Dolar", "currency", "usd"),
      createItem("EUR", "Euro", "currency", "eur"),
      createItem("GBP", "İngiliz Sterlini", "currency", "gbp"),
      createItem("CHF", "İsviçre Frangı", "currency", "chf"),
      createItem("SAR", "Suudi Riyali", "currency", "sar"),
      createItem("gumus", "Gümüş (Gram)", "metal", "gumus"),
      createItem("gram-platin", "Platin", "metal", "platin"),
      createItem("gram-paladyum", "Paladyum", "metal", "paladyum")
    ];
  } catch (e) {
    return null;
  }
}

export async function getMarketData(): Promise<MarketResponse> {
  // 1. Primary: HaremAPI
  const haremItems = await fetchHaremData();
  if (haremItems && haremItems.length > 0) {
    return { items: haremItems, updateDate: `Canlı (Harem) ${new Date().toLocaleTimeString('tr-TR')}` };
  }

  // 2. Secondary: Truncgil
  const truncgilItems = await fetchTruncgilData();
  if (truncgilItems && truncgilItems.length > 0) {
    return { items: truncgilItems, updateDate: `Canlı (Yedek) ${new Date().toLocaleTimeString('tr-TR')}` };
  }

  // 3. Last Resort: Static Fallback
  return {
    items: [
      { name: "Gram Altın", slug: "gram-altin", price: 6697, priceBuying: 6563, priceSelling: 6697, type: "gold" },
      { name: "Çeyrek Altın", slug: "ceyrek-altin", price: 11123, priceBuying: 10732, priceSelling: 11123, type: "gold" },
      { name: "Dolar", slug: "usd", price: 45.07, priceBuying: 44.81, priceSelling: 45.07, type: "currency" },
      { name: "Euro", slug: "eur", price: 52.07, priceBuying: 51.64, priceSelling: 52.07, type: "currency" },
      { name: "22 Ayar Bilezik", slug: "22-ayar-bilezik", price: 6342, priceBuying: 5971, priceSelling: 6342, type: "gold" },
      { name: "Has Altın (Külçe)", slug: "has-altin", price: 6731, priceBuying: 6530, priceSelling: 6731, type: "gold" },
      { name: "Gümüş (Gram)", slug: "gumus", price: 103.68, priceBuying: 95.06, priceSelling: 103.68, type: "metal" }
    ],
    updateDate: `Sistem Meşgul (Tahmini: ${new Date().toLocaleTimeString('tr-TR')})`
  };
}
