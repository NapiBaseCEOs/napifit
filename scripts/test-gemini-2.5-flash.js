/**
 * Test Gemini 2.5 Flash Model
 */

const https = require('https');

const API_KEY = 'AIzaSyBgZuV-z0C4Nzqy_HT9WmL0l3wHa7H36QU';

async function testGemini2_5Flash() {
  console.log('🧪 Gemini 2.5 Flash Testi\n');

  const prompt = `Sen bir diyetisyensin. Aşağıdaki yiyecek için kalori hesapla.

Yiyecek: pilav (1 porsiyon)

Lütfen aşağıdaki JSON formatında cevap ver:
{
  "totalCalories": sayı,
  "breakdown": [
    {
      "index": 0,
      "name": "pilav",
      "calories": sayı,
      "quantity": "1 porsiyon"
    }
  ],
  "explanation": "Türkçe açıklama"
}

Sadece JSON döndür.`;

  const postData = JSON.stringify({
    contents: [{
      parts: [{
        text: prompt
      }]
    }]
  });

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    },
    timeout: 15000
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const parsed = JSON.parse(body);
            console.log('✅ BAŞARILI! Status: 200\n');
            console.log('📄 Yanıt:', JSON.stringify(parsed, null, 2).substring(0, 500));
            resolve({ success: true, response: parsed });
          } catch {
            console.log('✅ BAŞARILI ama parse hatası');
            console.log('Raw:', body.substring(0, 500));
            resolve({ success: true, raw: body });
          }
        } else {
          console.log(`❌ BAŞARISIZ! Status: ${res.statusCode}\n`);
          console.log('Hata:', body.substring(0, 500));
          resolve({ success: false, status: res.statusCode, error: body });
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Hata: ${error.message}\n`);
      resolve({ success: false, error: error.message });
    });

    req.on('timeout', () => {
      req.destroy();
      console.log('❌ Timeout\n');
      resolve({ success: false, error: 'Timeout' });
    });

    console.log('📤 İstek gönderiliyor...\n');
    req.write(postData);
    req.end();
  });
}

testGemini2_5Flash().then(result => {
  if (result.success) {
    console.log('\n🎉 Model çalışıyor! gemini-2.5-flash kullanılabilir.\n');
  } else {
    console.log('\n⚠️ Model test edilemedi. Alternatif model deneyin.\n');
  }
});

