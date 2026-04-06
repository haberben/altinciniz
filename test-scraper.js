const https = require('https');

function safeParseFloat(raw) {
  if (!raw) return 0;
  const clean = raw.replace(/[^\d.,-]/g, '').trim();
  if (!clean) return 0;
  if (clean.includes(',')) {
    const withoutThousands = clean.replace(/\./g, ''); 
    return parseFloat(withoutThousands.replace(',', '.'));
  }
  return parseFloat(clean) || 0;
}

const cleanText = (htmlStr) => htmlStr.replace(/<[^>]+>/g, ' ').trim().replace(/\s+/g, ' ');

const opts1 = {
  hostname: 'anlikaltinfiyatlari.com',
  path: '/altin/kapalicarsi',
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
};

https.get(opts1, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const rows = data.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
    let cnt = 0;
    rows.forEach(row => {
      const cells = Array.from(row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)).map(m => m[1]);
      if (cells.length < 3) return; // FIX
      cnt++;
      if (cnt === 2) {
          console.log("Source 1 Second Row Original Cells:");
          console.log(cells.map(cleanText));
          
          const raw1 = cleanText(cells[0] || '');
          const raw2 = cleanText(cells[1] || '');
          const raw3 = cleanText(cells[2] || '');

          const nameMatch = raw1.match(/^([A-Za-zÇŞĞÜÖİçşğüöı0-9\s]+?)(?:\s+\d{2}:\d{2}:\d{2})?$/);
          const nameRaw = nameMatch ? nameMatch[1].trim() : raw1;
          
          const timeMatch = raw1.match(/\d{2}:\d{2}:\d{2}/);
          const updateTime = timeMatch ? timeMatch[0] : '';
          
          const buyRaw = raw2;
          const sellMatch = raw3.match(/^[\d.,]+/);
          const sellRaw = sellMatch ? sellMatch[0] : raw3;
          
          const buying = safeParseFloat(buyRaw);
          const selling = safeParseFloat(sellRaw);
          
          const percentMatch = raw3.match(/([+-]?[\d.,]+)\s*%/);
          const changePercent = percentMatch ? safeParseFloat(percentMatch[1]) : undefined;
          
          console.log({
              nameRaw,
              updateTime,
              buyRaw,
              sellRaw,
              buying,
              selling,
              changePercent
          });
      }
    });
    console.log("Source 1 mapped:", cnt, "rows");
  });
});
