import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createSupabaseRouteClient } from "@/lib/supabase/server";

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  console.warn("GEMINI_API_KEY is not set. Proactive AI messages will not work.");
}

function getGeminiClient() {
  if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }
  return new GoogleGenerativeAI(geminiApiKey);
}

async function getUserActivityStatus(userId: string) {
  try {
    const supabase = createSupabaseRouteClient();
    const today = new Date().toISOString().split("T")[0];
    const now = new Date();
    const hour = now.getHours();

    // Bugünkü öğünler
    const { data: todayMeals } = await supabase
      .from("meals")
      .select("food_name, calories, meal_type, created_at")
      .eq("user_id", userId)
      .gte("created_at", `${today}T00:00:00`)
      .lte("created_at", `${today}T23:59:59`)
      .order("created_at", { ascending: false });

    // Bugünkü egzersizler
    const { data: todayWorkouts } = await supabase
      .from("workouts")
      .select("name, calories, duration, created_at")
      .eq("user_id", userId)
      .gte("created_at", `${today}T00:00:00`)
      .lte("created_at", `${today}T23:59:59`)
      .order("created_at", { ascending: false });

    // Kullanıcı profili
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, weight, target_weight, daily_water_goal_ml")
      .eq("id", userId)
      .single();

    // Su tüketimi (bugün)
    const { data: waterIntakes } = await supabase
      .from("water_intakes")
      .select("amount_ml")
      .eq("user_id", userId)
      .gte("created_at", `${today}T00:00:00`)
      .lte("created_at", `${today}T23:59:59`);

    const totalWater = waterIntakes?.reduce((sum, intake) => sum + (intake.amount_ml || 0), 0) || 0;

    // Son aktivite zamanı
    const lastMealTime = todayMeals?.[0]?.created_at;
    const lastWorkoutTime = todayWorkouts?.[0]?.created_at;
    const lastActivityTime = lastMealTime && lastWorkoutTime
      ? new Date(lastMealTime) > new Date(lastWorkoutTime) ? lastMealTime : lastWorkoutTime
      : lastMealTime || lastWorkoutTime;

    return {
      profile,
      todayMeals: todayMeals || [],
      todayWorkouts: todayWorkouts || [],
      totalWater,
      waterGoal: profile?.daily_water_goal_ml || 2000,
      lastActivityTime,
      currentHour: hour,
      mealCount: todayMeals?.length || 0,
      workoutCount: todayWorkouts?.length || 0,
    };
  } catch (error) {
    console.error("Error fetching user activity:", error);
    return null;
  }
}

export async function POST(request: Request) {
  if (!geminiApiKey) {
    return NextResponse.json({ message: null }, { status: 200 });
  }

  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const activityStatus = await getUserActivityStatus(userId);
    if (!activityStatus) {
      return NextResponse.json({ message: null }, { status: 200 });
    }

    const {
      profile,
      todayMeals,
      todayWorkouts,
      totalWater,
      waterGoal,
      lastActivityTime,
      currentHour,
      mealCount,
      workoutCount,
    } = activityStatus;

    // Mesaj tipini belirle (rastgele ama context-aware)
    const messageTypes = [];
    
    // Sabah mesajları (6-10)
    if (currentHour >= 6 && currentHour < 10) {
      if (mealCount === 0) {
        messageTypes.push("morning_breakfast_reminder");
      } else {
        messageTypes.push("morning_greeting", "morning_motivation");
      }
    }
    
    // Öğle mesajları (10-14)
    if (currentHour >= 10 && currentHour < 14) {
      if (mealCount < 2) {
        messageTypes.push("lunch_reminder");
      } else {
        messageTypes.push("midday_check", "activity_reminder");
      }
    }
    
    // Akşam mesajları (14-18)
    if (currentHour >= 14 && currentHour < 18) {
      if (workoutCount === 0) {
        messageTypes.push("afternoon_workout_reminder");
      } else {
        messageTypes.push("afternoon_check", "evening_prep");
      }
    }
    
    // Akşam mesajları (18-22)
    if (currentHour >= 18 && currentHour < 22) {
      if (mealCount < 3) {
        messageTypes.push("dinner_reminder");
      } else {
        messageTypes.push("evening_check", "daily_summary");
      }
    }
    
    // Gece mesajları (22-6)
    if (currentHour >= 22 || currentHour < 6) {
      messageTypes.push("night_greeting", "tomorrow_prep");
    }

    // Genel mesajlar (her zaman)
    messageTypes.push("casual_check", "motivation", "water_reminder", "activity_reminder");

    // Rastgele bir mesaj tipi seç
    const messageType = messageTypes[Math.floor(Math.random() * messageTypes.length)];

    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Context string'i oluştur
    let contextString = `Sen NapiFit uygulamasının AI asistanısın. Kullanıcıya samimi, arkadaşça ve motive edici bir şekilde mesaj göndereceksin. Türkçe konuşuyorsun.\n\n`;

    if (profile?.full_name) {
      contextString += `Kullanıcının adı: ${profile.full_name}\n`;
    }

    contextString += `Bugünkü Durum:\n`;
    contextString += `- Öğün sayısı: ${mealCount}\n`;
    contextString += `- Egzersiz sayısı: ${workoutCount}\n`;
    contextString += `- Su tüketimi: ${totalWater}ml / ${waterGoal}ml\n`;
    contextString += `- Saat: ${currentHour}:00\n`;

    if (lastActivityTime) {
      const lastActivity = new Date(lastActivityTime);
      const hoursSince = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60));
      contextString += `- Son aktivite: ${hoursSince} saat önce\n`;
    }

    // Mesaj tipine göre prompt
    let prompt = "";
    
    switch (messageType) {
      case "morning_breakfast_reminder":
        prompt = "Kullanıcıya sabah kahvaltısı yapmasını hatırlat. Kahvaltının önemini vurgula ve motive et. Samimi ve arkadaşça bir ton kullan.";
        break;
      case "morning_greeting":
        prompt = "Kullanıcıya günaydın de ve bugün için motive et. Eğer bugün öğün veya egzersiz yapmadıysa, bunları yapmasını öner.";
        break;
      case "lunch_reminder":
        prompt = "Kullanıcıya öğle yemeği yapmasını hatırlat. Sağlıklı beslenme önerisi ver.";
        break;
      case "afternoon_workout_reminder":
        prompt = "Kullanıcıya bugün egzersiz yapmadığını hatırlat. Egzersizin faydalarını anlat ve motive et. Eğer yaparsa ne olacağını açıkla.";
        break;
      case "dinner_reminder":
        prompt = "Kullanıcıya akşam yemeği yapmasını hatırlat. Hafif ve sağlıklı öneriler ver.";
        break;
      case "water_reminder":
        if (totalWater < waterGoal * 0.7) {
          prompt = "Kullanıcıya su içmesini hatırlat. Yeterli su içmediğini belirt ve su içmenin önemini vurgula.";
        } else {
          prompt = "Kullanıcıya su tüketimini takdir et ama yine de devam etmesini söyle.";
        }
        break;
      case "activity_reminder":
        if (mealCount === 0 && workoutCount === 0) {
          prompt = "Kullanıcıya bugün henüz hiçbir aktivite yapmadığını hatırlat. Bugün öğün veya egzersiz yapmasını öner. Yaparsa ne kadar iyi hissedeceğini anlat.";
        } else if (workoutCount === 0) {
          prompt = "Kullanıcıya bugün egzersiz yapmadığını hatırlat. Egzersiz yaparsa ne olacağını (enerji, mutluluk, sağlık) anlat ve motive et.";
        } else if (mealCount < 2) {
          prompt = "Kullanıcıya bugün yeterince öğün yapmadığını hatırlat. Düzenli beslenmenin önemini vurgula.";
        }
        break;
      case "casual_check":
        prompt = "Kullanıcıya 'naber', 'nasılsın' gibi samimi bir şekilde sor. Bugünkü durumunu sor ve destek ol.";
        break;
      case "motivation":
        if (mealCount > 0 || workoutCount > 0) {
          prompt = "Kullanıcıyı bugün yaptıkları için takdir et ve motive et. Devam etmesini söyle.";
        } else {
          prompt = "Kullanıcıyı motive et. Bugün başlamasını öner. Başlarsa ne kadar iyi hissedeceğini anlat.";
        }
        break;
      case "daily_summary":
        prompt = "Kullanıcıya bugünkü aktivitelerini özetle ve takdir et. Yarın için motive et.";
        break;
      default:
        prompt = "Kullanıcıya samimi bir şekilde merhaba de, nasıl olduğunu sor ve bugünkü aktiviteleri hakkında konuş.";
    }

    const fullPrompt = `${contextString}\n\n${prompt}\n\nKısa, samimi ve motive edici bir mesaj yaz (maksimum 2-3 cümle). Emoji kullan ama aşırıya kaçma.`;

    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text().trim();

    // Cache için timestamp ekle (aynı mesajı tekrar göstermemek için)
    return NextResponse.json({
      message: text,
      messageType,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.error("Proactive message error:", error);
    return NextResponse.json({ message: null }, { status: 200 });
  }
}

