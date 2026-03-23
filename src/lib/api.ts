export interface AssetItem {
  name: string;
  slug: string;
  price: number;
  changePercent: number;
  isUp: boolean;
  type: 'gold' | 'currency' | 'metal';
}

const YAHOO_URL = "https://query1.finance.yahoo.com/v8/finance/chart/";

async function fetchTicker(symbol: string) {
  try {
    const res = await fetch(`${YAHOO_URL}${symbol}?interval=2m&range=1d`, {
      next: { revalidate: 60 }, // 1 dakika cache'le
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    const data = await res.json();
    const result = data.chart.result[0];
    const meta = result.meta;
    const currentPrice = meta.regularMarketPrice;
    const previousClose = meta.chartPreviousClose;
    const change = currentPrice - previousClose;
    const changePercent = (change / previousClose) * 100;

    return {
      price: currentPrice,
      changePercent: changePercent,
      isUp: change >= 0
    };
  } catch (error) {
    console.error("Error fetching", symbol, error);
    return null;
  }
}

export async function getMarketData(): Promise<AssetItem[]> {
  const [goldFutures, usdTry, eurUsd, silver, platinum, palladium] = await Promise.all([
    fetchTicker("GC=F"), // Ons Altın (USD)
    fetchTicker("TRY=X"), // USD/TL
    fetchTicker("EUR=X"), // EUR/USD (Çapraz veya EUR/TRY de bakılabilir)
    fetchTicker("SI=F"), // Gümüş
    fetchTicker("PL=F"), // Platin
    fetchTicker("PA=F"), // Paladyum
  ]);

  const fallback = { price: 0, changePercent: 0, isUp: true };
  const ons = goldFutures || fallback;
  const usd = usdTry || fallback;
  
  // EUR/TRY = EUR/USD çaprızından bulalım veya EURTRY=X yapalım. 
  // Ama daha kolay: EURTRY=X çağıralım. Yukarıda eurUsd yerine eurtry=x çağırıyorum:
  const eurTry = await fetchTicker("EURTRY=X") || fallback;
  const ag = silver || fallback;
  const pt = platinum || fallback;
  const pd = palladium || fallback;

  // Hesaplamalar
  const gramAltinTL = (ons.price * usd.price) / 31.1035;
  const ceyrekAltin = gramAltinTL * 1.75;
  const yarimAltin = gramAltinTL * 3.5;
  const tamAltin = gramAltinTL * 7;
  const cumhuriyetAltin = gramAltinTL * 7.2;

  // Yüzdeleri ons'un yüzdesi ve usd'nin yüzdesi olarak yaklaşık veriyoruz
  // Gerçekte formülü => (1+ons change) * (1+usd change) - 1
  const calcChange = (onsC: number, usdC: number) => {
    return (((1 + onsC/100) * (1 + usdC/100)) - 1) * 100;
  };

  const goldChange = calcChange(ons.changePercent, usd.changePercent);
  const goldIsUp = goldChange >= 0;

  return [
    { name: "Gram Altın", slug: "gram-altin", price: gramAltinTL, changePercent: goldChange, isUp: goldIsUp, type: 'gold' },
    { name: "Çeyrek Altın", slug: "ceyrek-altin", price: ceyrekAltin, changePercent: goldChange, isUp: goldIsUp, type: 'gold' },
    { name: "Yarım Altın", slug: "yarim-altin", price: yarimAltin, changePercent: goldChange, isUp: goldIsUp, type: 'gold' },
    { name: "Tam Altın", slug: "tam-altin", price: tamAltin, changePercent: goldChange, isUp: goldIsUp, type: 'gold' },
    { name: "Cumhuriyet Altını", slug: "cumhuriyet-altini", price: cumhuriyetAltin, changePercent: goldChange, isUp: goldIsUp, type: 'gold' },
    
    { name: "Dolar (USD/TL)", slug: "dolar", price: usd.price, changePercent: usd.changePercent, isUp: usd.isUp, type: 'currency' },
    { name: "Euro (EUR/TL)", slug: "euro", price: eurTry.price, changePercent: eurTry.changePercent, isUp: eurTry.isUp, type: 'currency' },
    
    { name: "Gümüş (Ons)", slug: "gumus", price: ag.price, changePercent: ag.changePercent, isUp: ag.isUp, type: 'metal' },
    { name: "Platin (Ons)", slug: "platin", price: pt.price, changePercent: pt.changePercent, isUp: pt.isUp, type: 'metal' },
    { name: "Paladyum (Ons)", slug: "paladyum", price: pd.price, changePercent: pd.changePercent, isUp: pd.isUp, type: 'metal' }
  ];
}
