export interface AssetItem {
  name: string;
  slug: string;
  price: number; // For backward compatibility / default sorting
  priceBuying: number;
  priceSelling: number;
  changePercent: number;
  isUp: boolean;
  type: 'gold' | 'currency' | 'metal';
}

export interface MarketResponse {
  items: AssetItem[];
  updateDate: string;
}

const API_URL = "https://finans.truncgil.com/v3/today.json";

function parseTRNumber(str: string | undefined): number {
  if (!str) return 0;
  return parseFloat(str.replace(/\./g, '').replace(',', '.'));
}

function parsePercent(str: string | undefined): number {
  if (!str) return 0;
  return parseFloat(str.replace('%', '').replace(',', '.'));
}

export async function getMarketData(): Promise<MarketResponse> {
  try {
    const res = await fetch(API_URL, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();

    const updateDate = data.Update_Date || new Date().toLocaleString('tr-TR');

    const createItem = (key: string, name: string, type: 'gold' | 'currency' | 'metal', customSlug?: string): AssetItem => {
      const item = data[key];
      const slug = customSlug || key.toLowerCase();
      if (!item) return { name, slug, price: 0, priceBuying: 0, priceSelling: 0, changePercent: 0, isUp: true, type };
      
      const priceBuying = parseTRNumber(item.Buying);
      const priceSelling = parseTRNumber(item.Selling);
      const changeP = parsePercent(item.Change);
      
      return {
        name,
        slug,
        price: priceSelling || priceBuying, 
        priceBuying: priceBuying || priceSelling,
        priceSelling: priceSelling || priceBuying,
        changePercent: changeP,
        isUp: changeP >= 0,
        type
      };
    };

    const items = [
      createItem("gram-altin", "Gram Altın", "gold"),
      createItem("gram-has-altin", "Has Altın (Gram)", "gold", "has-altin"),
      createItem("ceyrek-altin", "Çeyrek Altın", "gold"),
      createItem("yarim-altin", "Yarım Altın", "gold"),
      createItem("tam-altin", "Tam Altın", "gold"),
      createItem("cumhuriyet-altini", "Cumhuriyet Altını", "gold"),
      createItem("ata-altin", "Ata Altın", "gold"),
      createItem("gremse-altin", "Gremse Altın", "gold"),
      createItem("resat-altin", "Reşat Altın", "gold"),
      createItem("22-ayar-bilezik", "22 Ayar Bilezik", "gold"),
      createItem("18-ayar-altin", "18 Ayar Altın", "gold"),
      createItem("14-ayar-altin", "14 Ayar Altın", "gold"),
      
      createItem("USD", "Dolar (USD/TL)", "currency", "dolar"),
      createItem("EUR", "Euro (EUR/TL)", "currency", "euro"),
      createItem("GBP", "İngiliz Sterlini", "currency", "sterlin"),
      createItem("CHF", "İsviçre Frangı", "currency", "frank"),
      createItem("SAR", "Suudi Riyali", "currency", "riyal"),
      
      createItem("gumus", "Gümüş (Gram)", "metal"),
      createItem("gram-platin", "Platin (Gram)", "metal", "platin"),
      createItem("gram-paladyum", "Paladyum (Gram)", "metal", "paladyum")
    ];

    return { items, updateDate };
  } catch (error) {
    console.error("API Fetch Error:", error);
    return { items: [], updateDate: new Date().toLocaleString('tr-TR') };
  }
}
