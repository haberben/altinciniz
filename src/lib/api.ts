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
const API_URL = `https://haremapi.tr/api/v1/prices?api_key=${API_KEY}`;

export async function getMarketData(): Promise<MarketResponse> {
  try {
    const res = await fetch(API_URL, { 
      next: { 
        revalidate: 10,
        tags: ['market-data']
      } 
    });
    if (!res.ok) throw new Error("Failed to fetch HaremAPI");
    const json = await res.json();
    const dataArray = json.data;

    // Vercel sunucuları Amerika'da (iad1) olduğu için saati zorla İstanbul'a çekiyoruz
    const dateOptions: Intl.DateTimeFormatOptions = { 
      timeZone: 'Europe/Istanbul', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    };

    let updateDate = new Date().toLocaleTimeString('tr-TR', dateOptions);
    if (json.updatedAt) {
        updateDate = new Date(json.updatedAt).toLocaleTimeString('tr-TR', dateOptions);
    } else if (dataArray && dataArray.length > 0 && dataArray[0].timestamp) {
        // Fallback to the first item's timestamp if root updatedAt is missing
        updateDate = new Date(dataArray[0].timestamp).toLocaleTimeString('tr-TR', dateOptions);
    }

    const createItem = (key: string, name: string, type: 'gold' | 'currency' | 'metal', customSlug?: string): AssetItem => {
      const item = dataArray.find((i: any) => i.symbol === key);
      const slug = customSlug || key.toLowerCase().replace(/_/g, '-');
      
      if (!item) return { name, slug, price: 0, priceBuying: 0, priceSelling: 0, type };
      
      const priceBuying = parseFloat(item.bid) || 0;
      const priceSelling = parseFloat(item.ask) || 0;
      
      return {
        name,
        slug,
        price: priceSelling || priceBuying, 
        priceBuying: priceBuying,
        priceSelling: priceSelling,
        type
      };
    };

    const items = [
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
      createItem("AUDTRY", "Avustralya Doları", "currency", "aud"),
      createItem("CADTRY", "Kanada Doları", "currency", "cad"),
      
      createItem("GUMTRY", "Gümüş (Gram)", "metal", "gumus"),
      createItem("PLATIN", "Platin", "metal", "platin"),
      createItem("PALADYUM", "Paladyum", "metal", "paladyum")
    ];

    return { items, updateDate: `Bugün ${updateDate}` };
  } catch (error) {
    console.error("API Fetch Error:", error);
    return { items: [], updateDate: new Date().toLocaleTimeString('tr-TR', { timeZone: 'Europe/Istanbul' }) };
  }
}
