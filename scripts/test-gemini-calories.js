/**
 * Gemini API Test Script
 * Kalori hesaplama API'sini test eder
 */

const https = require('https');

const API_KEY = 'AIzaSyBgZuV-z0C4Nzqy_HT9WmL0l3wHa7H36QU';
const BASE_URL = 'https://napibase.com'; // veya local: http://localhost:3000

async function testGeminiCalories() {
  console.log('🧪 Gemini Kalori Hesaplama Testi\n');

  const testData = {
    mode: 'meal',
    meal: {
      mealType: 'breakfast',
      notes: null,
      foods: [
        {
          index: 0,
          name: 'pilav',
          quantity: '1 porsiyon'
        }
      ]
    }
  };

  try {
    console.log('📤 Test verisi:', JSON.stringify(testData, null, 2));
    console.log('\n⏳ API çağrısı yapılıyor...\n');

    const url = new URL(`${BASE_URL}/api/ai/calories`);
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            resolve({ status: res.statusCode, data: parsed, raw: body });
          } catch {
            resolve({ status: res.statusCode, data: body, raw: body });
          }
        });
      });

      req.on('error', reject);
      req.write(JSON.stringify(testData));
      req.end();
    });

    console.log(`✅ Status: ${response.status}`);
    console.log(`📄 Response:`, JSON.stringify(response.data, null, 2));

    if (response.status === 200 && response.data.mode === 'meal') {
      console.log('\n✅ Test BAŞARILI!');
      console.log(`📊 Toplam Kalori: ${response.data.result.totalCalories} kcal`);
      console.log(`📋 Açıklama: ${response.data.result.explanation}`);
      if (response.data.result.breakdown?.length > 0) {
        console.log('\n🍽️  Yiyecek Detayları:');
        response.data.result.breakdown.forEach((food) => {
          console.log(`   - ${food.name}: ${food.calories} kcal`);
        });
      }
    } else {
      console.log('\n❌ Test BAŞARISIZ!');
      console.log('Hata:', response.data.message || 'Bilinmeyen hata');
    }
  } catch (error) {
    console.error('\n❌ Test hatası:', error.message);
    console.error(error);
  }
}

// Doğrudan Gemini API testi
async function testDirectGeminiAPI() {
  console.log('\n\n🔬 Doğrudan Gemini API Testi\n');

  const { GoogleGenerativeAI } = require('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(API_KEY);
  
  // Try to list available models first
  try {
    console.log('🔍 Mevcut modelleri listeleniyor...\n');
    const models = await genAI.listModels();
    console.log('✅ Mevcut modeller:');
    models.models.slice(0, 5).forEach(m => {
      console.log(`   - ${m.name}`);
    });
    console.log('');
  } catch (e) {
    console.log('⚠️ Model listesi alınamadı, devam ediliyor...\n');
  }
  
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

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

  try {
    console.log('📤 Prompt gönderiliyor...\n');
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    console.log('✅ Gemini API yanıt aldı!');
    console.log('\n📄 Raw Response:');
    console.log(text);
    console.log('\n');

    // JSON'u parse et
    let cleanedText = text.trim();
    if (cleanedText.includes('```json')) {
      cleanedText = cleanedText.split('```json')[1]?.split('```')[0]?.trim() || cleanedText;
    } else if (cleanedText.includes('```')) {
      cleanedText = cleanedText.split('```')[1]?.split('```')[0]?.trim() || cleanedText;
    }

    const json = JSON.parse(cleanedText);
    console.log('✅ Parsed JSON:');
    console.log(JSON.stringify(json, null, 2));
  } catch (error) {
    console.error('❌ Gemini API hatası:', error.message);
    console.error(error);
  }
}

// Testleri çalıştır
(async () => {
  await testDirectGeminiAPI();
  await testGeminiCalories();
})();

