/**
 * Gemini API Test Script
 * API key'in çalışıp çalışmadığını test eder
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyBgZuV-z0C4Nzqy_HT9WmL0l3wHa7H36QU";

async function testGeminiAPI() {
  console.log("🧪 Gemini API Test Başlatılıyor...\n");

  if (!API_KEY) {
    console.error("❌ GEMINI_API_KEY tanımlı değil!");
    process.exit(1);
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Basit bir test prompt
    const testPrompt = `1 porsiyon mercimek çorbasının kalorisini hesapla. Sadece JSON formatında cevap ver: {"calories": sayı, "explanation": "açıklama"}`;

    console.log("📤 Test prompt gönderiliyor...");
    const result = await model.generateContent(testPrompt);
    const response = result.response;
    const text = response.text();

    console.log("✅ API çalışıyor!\n");
    console.log("📥 Yanıt:");
    console.log(text);
    console.log("\n");

    // JSON parse test
    try {
      let cleanedText = text.trim();
      if (cleanedText.includes("```json")) {
        cleanedText = cleanedText.split("```json")[1]?.split("```")[0]?.trim() || cleanedText;
      }
      const json = JSON.parse(cleanedText);
      console.log("✅ JSON parse başarılı!");
      console.log(JSON.stringify(json, null, 2));
      process.exit(0);
    } catch (parseError) {
      console.log("⚠️  JSON parse hatası (ama API çalışıyor):", parseError.message);
      process.exit(0);
    }
  } catch (error) {
    console.error("❌ API hatası:", error.message);
    if (error.message.includes("API_KEY")) {
      console.error("💡 API key geçersiz olabilir. Vercel'de GEMINI_API_KEY environment variable'ını kontrol edin.");
    }
    process.exit(1);
  }
}

testGeminiAPI();

