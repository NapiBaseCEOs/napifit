/**
 * Gemini API Key Verification
 * API key'in geçerli olup olmadığını test eder
 */

const https = require('https');

const API_KEY = 'AIzaSyBgZuV-z0C4Nzqy_HT9WmL0l3wHa7H36QU';

// API key doğrulama - model listesi endpoint'i
function checkAPIKey() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models?key=${API_KEY}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000
    };

    console.log('🔍 API Key doğrulanıyor...\n');
    console.log(`API Key: ${API_KEY.substring(0, 15)}...\n`);

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const parsed = JSON.parse(body);
            console.log('✅ API Key GEÇERLİ!\n');
            console.log(`📊 Mevcut modeller (ilk 10):`);
            if (parsed.models && parsed.models.length > 0) {
              parsed.models.slice(0, 10).forEach((model, idx) => {
                const name = model.name.replace('models/', '');
                const supported = model.supportedGenerationMethods || [];
                const canGenerate = supported.includes('generateContent');
                const icon = canGenerate ? '✅' : '⚠️';
                console.log(`   ${icon} ${name} (generateContent: ${canGenerate ? 'Evet' : 'Hayır'})`);
              });
              
              // Çalışan modeli bul
              const workingModel = parsed.models.find(m => 
                (m.supportedGenerationMethods || []).includes('generateContent')
              );
              
              if (workingModel) {
                const modelName = workingModel.name.replace('models/', '');
                console.log(`\n🎉 Önerilen model: ${modelName}\n`);
                resolve({ valid: true, models: parsed.models, recommended: modelName });
              } else {
                console.log('\n⚠️ generateContent destekleyen model bulunamadı.\n');
                resolve({ valid: true, models: parsed.models, recommended: null });
              }
            } else {
              console.log('⚠️ Model listesi boş.\n');
              resolve({ valid: true, models: [], recommended: null });
            }
          } catch (error) {
            console.log('❌ Yanıt parse edilemedi:', error.message);
            console.log('Raw response:', body.substring(0, 500));
            resolve({ valid: false, error: 'Parse error' });
          }
        } else {
          console.log(`❌ API Key GEÇERSİZ veya ERİŞİM YOK! (Status: ${res.statusCode})\n`);
          console.log('Hata:', body.substring(0, 500));
          resolve({ valid: false, status: res.statusCode, error: body });
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Bağlantı hatası: ${error.message}\n`);
      resolve({ valid: false, error: error.message });
    });

    req.on('timeout', () => {
      req.destroy();
      console.log('❌ Timeout - API yanıt vermedi\n');
      resolve({ valid: false, error: 'Timeout' });
    });

    req.end();
  });
}

async function testRecommendedModel(modelName) {
  if (!modelName) {
    console.log('⚠️ Önerilen model yok, test edilemiyor.\n');
    return;
  }

  console.log(`\n🧪 Önerilen model test ediliyor: ${modelName}\n`);

  return new Promise((resolve) => {
    const postData = JSON.stringify({
      contents: [{
        parts: [{
          text: "Test. Sadece 'OK' yaz."
        }]
      }]
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/${modelName}:generateContent?key=${API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const parsed = JSON.parse(body);
            console.log('✅ Model ÇALIŞIYOR!\n');
            console.log('📄 Yanıt:', JSON.stringify(parsed).substring(0, 200));
            console.log(`\n🎉 Model adı: ${modelName}\n`);
            resolve({ success: true, model: modelName });
          } catch {
            console.log('✅ Model çalışıyor ama yanıt parse edilemedi.');
            resolve({ success: true, model: modelName, raw: body.substring(0, 200) });
          }
        } else {
          console.log(`❌ Model test BAŞARISIZ (Status: ${res.statusCode})`);
          console.log('Hata:', body.substring(0, 300));
          resolve({ success: false, status: res.statusCode, error: body });
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Test hatası: ${error.message}`);
      resolve({ success: false, error: error.message });
    });

    req.on('timeout', () => {
      req.destroy();
      console.log('❌ Timeout');
      resolve({ success: false, error: 'Timeout' });
    });

    req.write(postData);
    req.end();
  });
}

async function main() {
  const result = await checkAPIKey();
  
  if (result.valid && result.recommended) {
    await testRecommendedModel(result.recommended);
  } else if (!result.valid) {
    console.log('\n💡 Çözüm:');
    console.log('   1. Google AI Studio\'ya gidin: https://aistudio.google.com/');
    console.log('   2. Yeni bir API key oluşturun');
    console.log('   3. API key\'i Vercel\'e ekleyin');
    console.log('   4. Yeni deploy yapın\n');
  }
}

main();

