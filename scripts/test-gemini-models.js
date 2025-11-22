/**
 * Gemini API Model Test
 * Doğru model adını bulmak için test eder
 */

const https = require('https');

const API_KEY = 'AIzaSyBgZuV-z0C4Nzqy_HT9WmL0l3wHa7H36QU';

const testModels = [
  'gemini-pro',
  'gemini-1.5-pro',
  'gemini-1.5-flash',
  'models/gemini-pro',
  'models/gemini-1.5-pro',
  'models/gemini-1.5-flash',
];

async function testModel(modelName) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      contents: [{
        parts: [{
          text: "Merhaba, test mesajı. Lütfen sadece 'OK' yaz."
        }]
      }]
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/${modelName}:generateContent?key=${API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({
          model: modelName,
          status: res.statusCode,
          success: res.statusCode === 200,
          body: body.substring(0, 200)
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        model: modelName,
        status: 0,
        success: false,
        error: error.message
      });
    });

    req.write(postData);
    req.end();
  });
}

async function testAllModels() {
  console.log('🧪 Gemini Model Testi\n');
  console.log('Test edilen modeller:\n');

  for (const model of testModels) {
    const result = await testModel(model);
    const icon = result.success ? '✅' : '❌';
    console.log(`${icon} ${model}: ${result.success ? 'ÇALIŞIYOR!' : `Status ${result.status}`}`);
    
    if (result.success) {
      console.log(`   📄 Yanıt: ${result.body.substring(0, 100)}...\n`);
      console.log(`\n🎉 ÇALIŞAN MODEL BULUNDU: ${model}\n`);
      return model;
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n❌ Hiçbir model çalışmadı. API key kontrolü yapın.\n');
  return null;
}

testAllModels();

