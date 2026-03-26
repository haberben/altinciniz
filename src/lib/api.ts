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
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
      },
      next: { 
        revalidate: 10,
        tags: ['market-data']
      } 
    });
    
    if (!res.ok) {
      console.error(`HaremAPI returned ${res.status}: ${res.statusText}`);
      throw new Error(`Failed to fetch HaremAPI: ${res.status}`);
    }

    const json = await res.json();
    
    // HaremAPI responds with different structures sometimes (root array, nested data array, or data object)
    let dataArray: any[] = [];
    if (Array.isArray(json)) {
      dataArray = json;
    } else if (json.data) {
      dataArray = Array.isArray(json.data) ? json.data : Object.values(json.data);
    } else if (typeof json === 'object') {
      // If it's a root object of symbols (without 'data' key)
      dataArray = Object.values(json).filter((item: any) => item && typeof item === 'object' && (item.symbol || item.code || item.bid));
    }

    // Saati zorla İstanbul'a çekiyoruz
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
        updateDate = new Date(dataArray[0].timestamp).toLocaleTimeString('tr-TR', dateOptions);
    }

    const createItem = (key: string, name: string, type: 'gold' | 'currency' | 'metal', customSlug?: string): AssetItem => {
      const item = dataArray.find((i: any) => i.symbol === key || i.code === key);
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
    console.error("API Fetch Error, using fallback:", error);
    
    // Static Fallback to prevent 404s and black screens
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
}
