/**
 * Direct Gemini API Test
 * Google Gemini API'nin doğru model adını bulmak için test eder
 */

const https = require('https');

const API_KEY = 'AIzaSyBgZuV-z0C4Nzqy_HT9WmL0l3wHa7H36QU';

// Google Gemini API'deki gerçek model adları
const models = [
  'gemini-pro',
  'gemini-1.5-pro-latest',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro',
  'gemini-1.5-flash',
];

async function testModel(modelName) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      contents: [{
        parts: [{
          text: "Test mesajı. Sadece 'OK' yaz."
        }]
      }]
    });

    // Try v1beta endpoint
    const path1 = `/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;
    const options1 = {
      hostname: 'generativelanguage.googleapis.com',
      path: path1,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 5000
    };

    const req1 = https.request(options1, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const parsed = JSON.parse(body);
            resolve({ model: modelName, status: res.statusCode, success: true, response: parsed });
          } catch {
            resolve({ model: modelName, status: res.statusCode, success: true, response: body });
          }
        } else {
          resolve({ model: modelName, status: res.statusCode, success: false, error: body.substring(0, 200) });
        }
      });
    });

    req1.on('error', (error) => {
      resolve({ model: modelName, success: false, error: error.message });
    });

    req1.on('timeout', () => {
      req1.destroy();
      resolve({ model: modelName, success: false, error: 'Timeout' });
    });

    req1.write(postData);
    req1.end();
  });
}

async function testAllModels() {
  console.log('🧪 Gemini Model Testi\n');
  console.log(`API Key: ${API_KEY.substring(0, 10)}...\n`);

  for (const model of models) {
    console.log(`Test ediliyor: ${model}...`);
    const result = await testModel(model);
    
    if (result.success) {
      console.log(`✅ ${model}: ÇALIŞIYOR! (Status: ${result.status})\n`);
      console.log(`📄 Yanıt örneği:`, JSON.stringify(result.response).substring(0, 200));
      console.log(`\n🎉 ÇALIŞAN MODEL: ${model}\n`);
      return model;
    } else {
      console.log(`❌ ${model}: Status ${result.status || 'Error'}`);
      if (result.error) {
        console.log(`   Hata: ${result.error.substring(0, 100)}`);
      }
      console.log('');
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n❌ Hiçbir model çalışmadı.\n');
  console.log('💡 Kontrol edin:');
  console.log('   1. API key geçerli mi?');
  console.log('   2. API key Google AI Studio\'dan oluşturuldu mu?');
  console.log('   3. API key\'de yeterli yetki var mı?');
  return null;
}

testAllModels().then(workingModel => {
  if (workingModel) {
    console.log(`\n✅ Kullanılacak model: ${workingModel}`);
  }
});

