export interface AssetItem {
  name: string;
  slug: string;
  price: number;
  changePercent: number;
  isUp: boolean;
  type: 'gold' | 'currency' | 'metal';
}

const API_URL = "https://finans.truncgil.com/v3/today.json";

function parseTRNumber(str: string): number {
  if (!str) return 0;
  // "6.065,71" -> "6065.71"
  return parseFloat(str.replace(/\./g, '').replace(',', '.'));
}

function parsePercent(str: string): number {
  if (!str) return 0;
  // "%-5,32" -> -5.32
  return parseFloat(str.replace('%', '').replace(',', '.'));
}

export async function getMarketData(): Promise<AssetItem[]> {
  try {
    const res = await fetch(API_URL, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();

    const createItem = (key: string, name: string, type: 'gold' | 'currency' | 'metal', customSlug?: string): AssetItem => {
      const item = data[key];
      const slug = customSlug || key.toLowerCase();
      if (!item) return { name, slug, price: 0, changePercent: 0, isUp: true, type };
      
      const price = parseTRNumber(item.Selling || item.Buying);
      const changeP = parsePercent(item.Change);
      
      return {
        name,
        slug,
        price,
        changePercent: changeP,
        isUp: changeP >= 0,
        type
      };
    };

    return [
      createItem("gram-altin", "Gram Altın", "gold"),
      createItem("ceyrek-altin", "Çeyrek Altın", "gold"),
      createItem("yarim-altin", "Yarım Altın", "gold"),
      createItem("tam-altin", "Tam Altın", "gold"),
      createItem("cumhuriyet-altini", "Cumhuriyet Altını", "gold"),
      
      createItem("USD", "Dolar (USD/TL)", "currency", "dolar"),
      createItem("EUR", "Euro (EUR/TL)", "currency", "euro"),
      
      createItem("gumus", "Gümüş (Gram)", "metal"),
      createItem("gram-platin", "Platin (Gram)", "metal", "platin"),
      createItem("gram-paladyum", "Paladyum (Gram)", "metal", "paladyum")
    ];
  } catch (error) {
    console.error("API Fetch Error:", error);
    return [];
  }
}
