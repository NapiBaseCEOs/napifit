import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createSupabaseRouteClient } from "@/lib/supabase/route";
import { estimateMealCalories } from "@/lib/ai/calorie-estimator";
import { createAssistantNotification } from "@/lib/notifications/assistant";

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

type QuickActionName =
  | "log_meal"
  | "log_workout"
  | "log_water"
  | "log_metric"
  | "open_calendar"
  | "open_health_page";

const QUICK_ACTION_CONFIG: Record<QuickActionName, { label: string; href: string }> = {
  log_meal: {
    label: "Öğün Kaydı Aç",
    href: "/health?tab=meal#quick-log",
  },
  log_workout: {
    label: "Egzersiz Kaydı Aç",
    href: "/health?tab=workout#quick-log",
  },
  log_water: {
    label: "Su Takibini Aç",
    href: "/water",
  },
  log_metric: {
    label: "Kilo Kaydı Aç",
    href: "/health?tab=metric#quick-log",
  },
  open_calendar: {
    label: "Takvimi Gör",
    href: "/health#calendar",
  },
  open_health_page: {
    label: "Sağlık Paneli",
    href: "/health",
  },
};

const MEAL_TYPE_LABELS: Record<string, string> = {
  breakfast: "kahvaltı",
  lunch: "öğle yemeği",
  dinner: "akşam yemeği",
  snack: "ara öğün",
};

type StructuredButton = {
  action: QuickActionName;
  label?: string;
};

type StructuredWaterLog = {
  type: "water";
  amountMl: number;
  note?: string;
};

type StructuredMealLog = {
  type: "meal";
  mealType?: "breakfast" | "lunch" | "dinner" | "snack";
  items?: Array<{ name: string; quantity?: string }>;
  notes?: string;
};

type StructuredAutoLog = StructuredWaterLog | StructuredMealLog;

type StructuredModelResponse = {
  reply?: string;
  suggestedButtons?: StructuredButton[];
  autoLogs?: StructuredAutoLog[];
};

type AutoLogResult = {
  id: string;
  type: "water" | "meal";
  message: string;
  status: "success" | "error";
};

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

function normalizeSuggestedButtons(buttons?: StructuredButton[]) {
  if (!Array.isArray(buttons) || buttons.length === 0) {
    return [];
  }

  const seen = new Set<QuickActionName>();
  const normalized: Array<{ id: string; label: string; href: string }> = [];

  buttons.forEach((button, index) => {
    if (!button || typeof button !== "object") {
      return;
    }

    const action = button.action;
    if (!action || !QUICK_ACTION_CONFIG[action] || seen.has(action)) {
      return;
    }

    seen.add(action);
    const config = QUICK_ACTION_CONFIG[action];
    const label =
      (button.label && typeof button.label === "string" ? button.label : config.label).slice(0, 40);

    normalized.push({
      id: `${action}-${index}`,
      label,
      href: config.href,
    });
  });

  return normalized.slice(0, 3);
}

async function processAutoLogs(autoLogs: StructuredAutoLog[] | undefined, userId?: string) {
  if (!Array.isArray(autoLogs) || autoLogs.length === 0 || !userId) {
    return [];
  }

  const supabase = createSupabaseRouteClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || user.id !== userId) {
    return [];
  }

  const results: AutoLogResult[] = [];

  for (const [index, log] of autoLogs.entries()) {
    if (!log || typeof log !== "object") continue;

    try {
      if (log.type === "water" && typeof log.amountMl === "number") {
        const saved = await handleWaterLog(supabase, user.id, log);
        results.push({
          id: `water-${index}`,
          type: "water",
          status: "success",
          message: `${saved.amountMl} ml su kaydı eklendi.`,
        });
      } else if (log.type === "meal") {
        const saved = await handleMealLog(supabase, user.id, log);
        if (saved) {
          results.push({
            id: `meal-${index}`,
            type: "meal",
            status: "success",
            message: `${saved.itemCount} öğeden oluşan ${saved.mealTypeLabel} kaydedildi.`,
          });
        }
      }
    } catch (logError: any) {
      results.push({
        id: `error-${index}`,
        type: log.type === "water" ? "water" : "meal",
        status: "error",
        message: logError?.message || "Kayıt eklenirken hata oluştu.",
      });
    }
  }

  return results;
}

async function handleWaterLog(
  supabase: ReturnType<typeof createSupabaseRouteClient>,
  userId: string,
  log: StructuredWaterLog
) {
  const amount = Math.max(10, Math.min(5000, Math.round(log.amountMl)));

  const { error } = await supabase
    .from("water_intake")
    .insert({
      user_id: userId,
      amount_ml: amount,
    })
    .select()
    .single();

  if (error) {
    throw new Error("Su kaydı eklenemedi.");
  }

  return { amountMl: amount };
}

async function handleMealLog(
  supabase: ReturnType<typeof createSupabaseRouteClient>,
  userId: string,
  log: StructuredMealLog
) {
  const items = Array.isArray(log.items)
    ? log.items
        .map((item) => ({
          name: typeof item?.name === "string" ? item.name.trim().slice(0, 80) : "",
          quantity: item?.quantity ? String(item.quantity).trim().slice(0, 40) : undefined,
        }))
        .filter((item) => item.name.length > 0)
        .slice(0, 5)
    : [];

  if (items.length === 0) {
    throw new Error("Öğün kaydı için yiyecek bilgisi algılanamadı.");
  }

  const mealType: "breakfast" | "lunch" | "dinner" | "snack" =
    (log.mealType && ["breakfast", "lunch", "dinner", "snack"].includes(log.mealType)
      ? log.mealType
      : "snack") as "breakfast" | "lunch" | "dinner" | "snack";

  let foods = items.map((item) => ({
    name: item.name,
    quantity: item.quantity ?? null,
    calories: 0,
  }));

  let totalCalories = 0;

  try {
    const aiResult = await estimateMealCalories({
      mealType,
      foods: items.map((item, index) => ({
        index,
        name: item.name,
        quantity: item.quantity,
      })),
      notes: log.notes ?? undefined,
    });

    totalCalories = Math.round(aiResult.totalCalories);
    const breakdownMap = new Map(aiResult.breakdown.map((entry) => [entry.index, entry]));
    foods = foods.map((food, index) => {
      const aiFood = breakdownMap.get(index);
      return {
        ...food,
        calories: aiFood ? Math.max(0, Math.round(aiFood.calories)) : 0,
      };
    });
  } catch (aiError) {
    console.warn("Assistant meal auto-log calorie estimation failed:", aiError);
    totalCalories = foods.reduce((sum, food) => sum + (food.calories || 0), 0);
  }

  if (totalCalories <= 0) {
    totalCalories = foods.reduce((sum, food) => sum + (food.calories || 0), 0);
  }

  const { error } = await supabase
    .from("meals")
    .insert({
      user_id: userId,
      foods,
      total_calories: totalCalories,
      meal_type: mealType,
      notes: log.notes ? String(log.notes).slice(0, 200) : null,
    })
    .select()
    .single();

  if (error) {
    console.error("Assistant meal auto-log insert error:", error);
    throw new Error("Öğün kaydı eklenemedi.");
  }

  return {
    mealTypeLabel: MEAL_TYPE_LABELS[mealType] || "öğün",
    itemCount: foods.length,
  };
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
    const { message, conversationHistory } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const supabase = createSupabaseRouteClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    let userContext = null;
    try {
      userContext = await getUserContext(user.id);
    } catch (contextError) {
      console.error("Error getting user context:", contextError);
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

    const historyContext =
      conversationHistory && conversationHistory.length > 0
        ? `Önceki konuşma geçmişi:\n${conversationHistory
            .map((h: any) => `${h.role === "user" ? "Kullanıcı" : "Asistan"}: ${h.content}`)
            .join("\n")}\n\n`
        : "";

    const jsonInstruction = `
Yanıtını sadece geçerli JSON olarak döndür.
Şema:
{
  "reply": "Türkçe cevap",
  "suggestedButtons": [
    {
      "action": "log_meal" | "log_workout" | "log_water" | "log_metric" | "open_calendar" | "open_health_page",
      "label": "opsiyonel kısa buton etiketi"
    }
  ],
  "autoLogs": [
    { "type": "water", "amountMl": 500, "note": "opsiyonel" },
    { "type": "meal", "mealType": "breakfast" | "lunch" | "dinner" | "snack", "items": [{ "name": "yiyecek", "quantity": "opsiyonel" }], "notes": "opsiyonel" }
  ]
}
Kurallar:
- "reply" alanı en fazla 2-3 cümle olsun, motive edici ve samimi bir Türkçe kullan.
- Kullanıcıya bir kayıt yapmasını öneriyorsan uygun "suggestedButtons" ekle (en fazla 3 adet).
- "autoLogs" sadece kullanıcı açıkça bir şeyi yaptığını söylediğinde doldur (ör: "500ml su içtim", "öğle yemeklerinde tavuk yedim"). Açık ifade yoksa boş dizi kullan.
- Auto log oluştururken yiyecek adlarını liste halinde ver ve miktarları tahmin etme, kullanıcı ne söylediyse onu kullan.
- JSON dışında ekstra karakter veya açıklama ekleme.
`;

    const fullPrompt = `${contextString}${historyContext}${jsonInstruction}\nKullanıcının mesajı: """${message}"""`;

    let result;
    let text;
    
    try {
      result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.8,
        },
      });
      text = result.response.text();

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

    let structured: StructuredModelResponse = {};
    try {
      structured = JSON.parse(text);
    } catch (parseError) {
      console.warn("Failed to parse structured AI response:", parseError);
      structured = { reply: text };
    }

    const autoLogResults = await processAutoLogs(structured.autoLogs, user.id);
    const quickActions = normalizeSuggestedButtons(structured.suggestedButtons);

    let replyText = (structured.reply || "").trim();
    if (!replyText) {
      replyText = "Şu anda yanıt veremiyorum. Lütfen tekrar deneyin.";
    }

    const successfulLogs = autoLogResults.filter((log) => log.status === "success");
    if (successfulLogs.length > 0) {
      const summary = successfulLogs.map((log) => log.message).join(" ");
      replyText += `\n\n_Not: ${summary}_`;
    }

    await createAssistantNotification({
      supabase,
      userId: user.id,
      title: "🤖 AI Asistanı yeni mesaj gönderdi",
      message: replyText,
      type: "assistant_chat",
      link: "/health#quick-log",
      metadata: {
        quickActionCount: quickActions.length,
        autoLogCount: autoLogResults.length,
      },
    });

    return NextResponse.json({
      response: replyText,
      quickActions,
      autoLogs: autoLogResults,
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

