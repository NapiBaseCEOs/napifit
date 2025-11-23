import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  console.warn("GEMINI_API_KEY is not set. AI Assistant will not work.");
}

function getGeminiClient() {
  if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }
  return new GoogleGenerativeAI(geminiApiKey);
}

async function getUserContext(userId: string) {
  try {
    const supabase = createSupabaseRouteClient();
    
    // Kullanıcı profil bilgileri
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, weight, height, age, gender, target_weight, daily_water_goal_ml, water_reminder_enabled")
      .eq("id", userId)
      .single();

    // Bugünkü aktiviteler
    const today = new Date().toISOString().split("T")[0];
    const { data: todayMeals } = await supabase
      .from("meals")
      .select("food_name, calories, meal_type, created_at")
      .eq("user_id", userId)
      .gte("created_at", `${today}T00:00:00`)
      .lte("created_at", `${today}T23:59:59`)
      .order("created_at", { ascending: false })
      .limit(10);

    const { data: todayWorkouts } = await supabase
      .from("workouts")
      .select("name, calories, duration, type, created_at")
      .eq("user_id", userId)
      .gte("created_at", `${today}T00:00:00`)
      .lte("created_at", `${today}T23:59:59`)
      .order("created_at", { ascending: false })
      .limit(10);

    // Son 7 günün özeti
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const { data: weeklyStats } = await supabase
      .from("meals")
      .select("calories")
      .eq("user_id", userId)
      .gte("created_at", weekAgo.toISOString());

    const weeklyCalories = weeklyStats?.reduce((sum, meal) => sum + (meal.calories || 0), 0) || 0;
    const avgDailyCalories = Math.round(weeklyCalories / 7);

    return {
      profile: profile || null,
      todayMeals: todayMeals || [],
      todayWorkouts: todayWorkouts || [],
      weeklyStats: {
        avgDailyCalories,
        totalMeals: weeklyStats?.length || 0,
      },
    };
  } catch (error) {
    console.error("Error fetching user context:", error);
    return null;
  }
}

export async function POST(request: Request) {
  if (!geminiApiKey) {
    return NextResponse.json(
      { error: "AI Assistant is not available. GEMINI_API_KEY is not configured." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { message, conversationHistory, userId } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Kullanıcı context'ini al
    let userContext = null;
    if (userId) {
      try {
        userContext = await getUserContext(userId);
      } catch (contextError) {
        console.error("Error getting user context:", contextError);
        // Context hatası olsa bile devam et
      }
    }

    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Context string'i oluştur
    let contextString = `Sen NapiFit uygulamasının AI asistanısın. Kullanıcılara sağlık, fitness, beslenme ve egzersiz konularında yardımcı oluyorsun. Türkçe konuşuyorsun ve samimi, motive edici bir ton kullanıyorsun.\n\n`;

    if (userContext && userContext.profile) {
      const { profile, todayMeals, todayWorkouts, weeklyStats } = userContext;
      contextString += `Kullanıcı Bilgileri:\n`;
      if (profile.full_name) contextString += `- İsim: ${profile.full_name}\n`;
      if (profile.weight) contextString += `- Kilo: ${profile.weight} kg\n`;
      if (profile.height) contextString += `- Boy: ${profile.height} cm\n`;
      if (profile.age) contextString += `- Yaş: ${profile.age}\n`;
      if (profile.gender) contextString += `- Cinsiyet: ${profile.gender === "male" ? "Erkek" : profile.gender === "female" ? "Kadın" : "Diğer"}\n`;
      if (profile.target_weight) contextString += `- Hedef Kilo: ${profile.target_weight} kg\n`;
      if (profile.daily_water_goal_ml) contextString += `- Günlük Su Hedefi: ${profile.daily_water_goal_ml} ml\n`;
      
      if (todayMeals.length > 0) {
        contextString += `\nBugünkü Öğünler:\n`;
        todayMeals.forEach((meal, idx) => {
          contextString += `${idx + 1}. ${meal.food_name} - ${meal.calories || 0} kcal (${meal.meal_type || "öğün"})\n`;
        });
      }
      
      if (todayWorkouts.length > 0) {
        contextString += `\nBugünkü Egzersizler:\n`;
        todayWorkouts.forEach((workout, idx) => {
          contextString += `${idx + 1}. ${workout.name} - ${workout.calories || 0} kcal (${workout.duration || 0} dk)\n`;
        });
      }
      
      if (weeklyStats.avgDailyCalories > 0) {
        contextString += `\nHaftalık Ortalama: ${weeklyStats.avgDailyCalories} kcal/gün\n`;
      }
      
      contextString += `\n`;
    }

    contextString += `Kullanıcının sorusu veya isteği: ${message}\n\n`;
    contextString += `Lütfen kullanıcıya yardımcı, samimi ve motive edici bir şekilde yanıt ver. `;
    contextString += `Eğer kullanıcı hakkında bilgiler varsa, bunları kullanarak kişiselleştirilmiş öneriler sun. `;
    contextString += `Yanıtın kısa, öz ve anlaşılır olsun. Emoji kullanabilirsin ama aşırıya kaçma. `;
    contextString += `Eğer kullanıcı bugünkü öğünlerini veya egzersizlerini soruyorsa, yukarıdaki bilgileri kullan.`;

    // Conversation history ekle
    const historyContext = conversationHistory && conversationHistory.length > 0
      ? `\n\nÖnceki konuşma geçmişi:\n${conversationHistory.map((h: any) => `${h.role === "user" ? "Kullanıcı" : "Asistan"}: ${h.content}`).join("\n")}\n`
      : "";

    const fullPrompt = contextString + historyContext + `\n\nYanıtını ver (sadece yanıt, başka açıklama ekleme):`;

    let result;
    let response;
    let text;
    
    try {
      result = await model.generateContent(fullPrompt);
      response = result.response;
      text = response.text();
      
      if (!text || text.trim().length === 0) {
        throw new Error("AI'dan boş yanıt alındı");
      }
    } catch (geminiError: any) {
      console.error("Gemini API error:", geminiError);
      
      // Gemini API hatalarını daha iyi yakala
      let errorMessage = "AI servisi yanıt veremedi";
      const errorMsg = geminiError.message || String(geminiError);
      const errorDetails = geminiError.errorDetails || [];
      
      // HTTP referrer kısıtlaması kontrolü
      const isReferrerBlocked = errorMsg.includes("REFERRER") || 
                                errorMsg.includes("referer") ||
                                errorDetails.some((d: any) => d.reason === "API_KEY_HTTP_REFERRER_BLOCKED");
      
      if (isReferrerBlocked) {
        errorMessage = "AI API anahtarı HTTP referrer kısıtlaması nedeniyle çalışmıyor. Lütfen Google AI Studio'da API key kısıtlamalarını kaldırın.";
      } else if (errorMsg.includes("API_KEY") || errorMsg.includes("403") || errorMsg.includes("401")) {
        errorMessage = "AI API anahtarı geçersiz veya eksik. Lütfen Vercel environment variables'ı kontrol edin.";
      } else if (errorMsg.includes("quota") || errorMsg.includes("429")) {
        errorMessage = "AI servisi kota limitine ulaştı. Lütfen daha sonra tekrar deneyin.";
      } else if (errorMsg.includes("model") || errorMsg.includes("404")) {
        errorMessage = "AI model bulunamadı";
      } else if (errorMsg) {
        errorMessage = errorMsg;
      }
      
      throw new Error(errorMessage);
    }

    // Öneriler oluştur (mesaj tipine göre)
    const suggestions: string[] = [];
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes("öğün") || lowerMessage.includes("beslenme") || lowerMessage.includes("yemek")) {
      suggestions.push("Bugünkü öğünlerimi değerlendir", "Sağlıklı beslenme planı öner", "Kalori hesaplama yardımı");
    } else if (lowerMessage.includes("egzersiz") || lowerMessage.includes("antrenman") || lowerMessage.includes("spor")) {
      suggestions.push("Haftalık egzersiz planı öner", "Kardiyovasküler egzersiz önerileri", "Güç antrenmanı tavsiyeleri");
    } else if (lowerMessage.includes("kilo") || lowerMessage.includes("hedef") || lowerMessage.includes("zayıflama")) {
      suggestions.push("Kilo verme stratejisi öner", "Hedefime nasıl ulaşırım?", "Metabolizma hızlandırma ipuçları");
    } else {
      suggestions.push("Bugünkü öğünlerimi değerlendir", "Haftalık egzersiz planı öner", "Hedeflerim için tavsiye ver", "Sağlıklı beslenme önerileri");
    }

    return NextResponse.json({
      response: text,
      suggestions: suggestions.slice(0, 4), // En fazla 4 öneri
    });
  } catch (error: any) {
    console.error("AI Assistant error:", error);
    
    // Daha detaylı hata mesajı
    let errorMessage = "Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.";
    if (error.message) {
      if (error.message.includes("GEMINI_API_KEY")) {
        errorMessage = "AI servisi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.";
      } else if (error.message.includes("network") || error.message.includes("fetch")) {
        errorMessage = "Bağlantı hatası. İnternet bağlantınızı kontrol edin.";
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}

