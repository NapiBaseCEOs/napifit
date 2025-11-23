import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createSupabaseRouteClient } from "@/lib/supabase/route";
import { createAssistantNotification } from "@/lib/notifications/assistant";

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

async function getUserActivityStatus(
  supabase: ReturnType<typeof createSupabaseRouteClient>,
  userId: string
) {
  try {
    const today = new Date().toISOString().split("T")[0];
    const now = new Date();
    // Türkiye saati (Europe/Istanbul) için saat hesaplama
    const turkeyHour = parseInt(
      new Intl.DateTimeFormat('tr-TR', {
        timeZone: 'Europe/Istanbul',
        hour: 'numeric',
        hour12: false
      }).format(now)
    );

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

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const { data: weeklyMeals } = await supabase
      .from("meals")
      .select("calories")
      .eq("user_id", userId)
      .gte("created_at", weekAgo.toISOString());

    const weeklyCalories =
      weeklyMeals?.reduce((sum, meal) => sum + (meal.calories || 0), 0) || 0;
    const avgDailyCalories = Math.round(weeklyCalories / 7);

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
      currentHour: turkeyHour,
      mealCount: todayMeals?.length || 0,
      workoutCount: todayWorkouts?.length || 0,
      weeklyStats: {
        avgDailyCalories,
        totalMeals: weeklyMeals?.length || 0,
      },
    };
  } catch (error) {
    console.error("Error fetching user activity:", error);
    return null;
  }
}

type MessageType =
  | "morning_breakfast_reminder"
  | "morning_greeting"
  | "lunch_reminder"
  | "afternoon_workout_reminder"
  | "dinner_reminder"
  | "water_reminder"
  | "activity_reminder"
  | "casual_check"
  | "motivation"
  | "daily_summary"
  | "mindfulness_check"
  | "posture_reset"
  | "energy_boost"
  | "gratitude_prompt"
  | "hydro_celebration"
  | "coach_tip"
  | "micro_goal"
  | "focus_sprint"
  | "wind_down";

interface PromptContext {
  profileName?: string | null;
  mealCount: number;
  workoutCount: number;
  totalWater: number;
  waterGoal: number;
  hoursSinceLastActivity: number | null;
  currentHour: number;
  avgDailyCalories: number;
}

const pickRandom = <T,>(list: T[]): { value: T; index: number } => {
  const index = Math.floor(Math.random() * list.length);
  return { value: list[index], index };
};

const styleVariations = [
  "Mesajı samimi bir koç gibi yaz; Türkçe günlük konuşma dili kullan ve kullanıcıya doğrudan 'sen' diye hitap et.",
  "Enerjik ama baskıcı olmayan bir tonda yaz; güven veren bir arkadaş gibi konuş.",
  "Tonunu yumuşak tut ama eyleme geçiren net bir motivasyon cümlesi ekle.",
  "Bilimsel bir gerçek veya mini ipucu sıkıştır; ama dili yine sıcak ve anlaşılır olsun.",
  "Metinde küçük bir hikâye veya hayal ettirme tekniği kullan; kullanıcıyı sahneyi gözünde canlandırmaya davet et.",
  "Sporda ısınıyormuş gibi ritimli ve tempolu anlat; kısa cümlelerle ivme yarat.",
  "Kendini kullanıcıyla aynı takımdaymış gibi konumlandır; 'birlikte' vurgusunu ekle.",
  "Emoji kullan ama 2-3 taneyi geçme ve mesajın önemli kelimelerini desteklemek için yerleştir.",
];

const creativityVariations = [
  "Mesaj yalnızca 2-3 cümle olsun ve her cümlenin başında duyguyu yansıtan farklı bir emoji kullan.",
  "Hızlı okunabilir olması için ilk cümleyi dikkat çekici yap, ikinci cümlede önerini ver.",
  "Bir cümlede durum tespiti, diğerinde aksiyon öner; gereksiz kelime kullanma.",
  "Sonda mini bir nefes veya beden farkındalığı önerisi ekle.",
  "Metafor veya benzetme ekleyerek mesajı eğlenceli kıl; ama toplamda 3 cümleyi geçme.",
];

const callToActionVariations = [
  "Son cümlede yapılacak eylemi net şekilde söyle ve zaman referansı ver (ör. 'şimdi', 'ilk fırsatta').",
  "Kullanıcıyı küçük bir söz vermeye davet et; 'söz ver bana' gibi sıcak bir ifade ekle.",
  "Mesajı, yapılacak eylemin sağlayacağı somut faydayla bitir.",
  "Kapanışta kullanıcının adını (varsa) tekrar hatırlatıp kişiselleştir.",
  "Eylemi tamamladığında seni haberdar etmesini isteyerek iletişimi açık tut.",
];

const groundingVariations = [
  "Metinde zamanı belirt (sabah/öğle/akşam) ve bugünün ritmine bağla.",
  "Son cümlede nefes alıp vücuda odaklanma gibi kısa bir farkındalık öner.",
  "Kullanıcının hedef kilosu veya su hedefi gibi verileri hatırlat; veriye dayalı konuş.",
  "Enerji, odak veya sakinlik gibi hissi bir kelime ekle ve onu güçlendirecek eylemi bağla.",
];

const getDisplayName = (fullName?: string | null) => {
  if (!fullName) return "sen";
  const first = fullName.trim().split(" ")[0];
  return first.length > 0 ? first : "sen";
};

const promptTemplates: Record<MessageType, Array<(ctx: PromptContext) => string>> = {
  morning_breakfast_reminder: [
    (ctx) =>
      `Saat ${ctx.currentHour}:00 civarı ve ${getDisplayName(ctx.profileName)} henüz kahvaltı etmedi. Protein + lif içeren 5 dakikalık bir kahvaltının kan şekerini dengeleyip gün boyu enerji verdiğini anlat.`,
    () =>
      `Kullanıcı işe/okula başlamadan önce hafif ama besleyici bir kahvaltı yapmalı. Tam tahıllı tost + yumurta + sebze gibi bir tabak öner ve sabahı nasıl değiştireceğini vurgula.`,
    () =>
      `Sabah öğününü atlamak metabolizmayı yavaşlatır. Kahvaltıyı kısa bir ritüel gibi anlat, bir cümlede kahvaltı fikri ver, diğer cümlede motivasyon ver.`,
    () =>
      `Kullanıcıya kahvaltıda en az bir protein, bir renkli sebze ve kompleks karbonhidrat önermesini söyle. Mesajda 'güne sağlam başla' temasını kullan.`,
    () =>
      `Uyanır uyanmaz su + küçük kahvaltı kombinasyonunun beyni açacağını belirt. Kahvaltıyı duyguya bağla: 'kendine özen' veya 'bedenine teşekkür' gibi ifadeler ekle.`,
  ],
  morning_greeting: [
    () =>
      `Günaydın mesajı yaz; güne minik bir nefes alıştırmasıyla başlamasını öner ve bugünün hedeflerinden birini hatırlat.`,
    () =>
      `Sabah enerjisi taşıyan, günün ilk 3 saatini nasıl değerlendireceğini anlatan kısa bir mesaj oluştur.`,
    () =>
      `Kullanıcıyı güne ait niyet belirlemeye çağır; niyet örneği ver (enerji, sakinlik, üretkenlik).`,
    () =>
      `Sabah güneşini metafor olarak kullan; ışık gibi hareket etmesini söyle ve minik aksiyon öner.`,
    () =>
      `Günaydın derken kahvaltı, su ve esneme üçlüsünü hatırlat; 2 cümlede topla.`,
  ],
  lunch_reminder: [
    () =>
      "Öğle öğününü atlamaması gerektiğini, düzenli beslenmenin metabolizmayı mutlu ettiğini anlat. Hızlı ve sağlıklı bir öğle alternatifi öner.",
    () =>
      "Öğle vakti yaklaşırken kan şekeri düşmeden dengeli beslenmenin önemini vurgula; tabakta renk çeşitliliği öner.",
    () =>
      "Yoğunluk bahanesiyle öğünü ertelememesi için pratik bir meal prep fikri sun.",
    () =>
      "Protein + lif + su kombinasyonunun öğle sonrası odaklanmayı artırdığını anlat.",
    () =>
      "Öğle molasını minik bir reset gibi düşünmesini sağla; yemek ve kısa yürüyüş önersin.",
  ],
  afternoon_workout_reminder: [
    () =>
      "Bugün henüz egzersiz yapmadıysa kısa bir 20 dakikalık antrenmanın bile ruh halini yükselteceğini anlat.",
    () =>
      "İş/okul sonrası için ter atmayı eğlenceli hale getiren bir fikir ver (dans, ip atlama, hızlı yürüyüş).",
    () =>
      "Kullanıcı egzersizi ertelediyse mini bir 'şimdi kalk' çağrısı yap; ısınma öner.",
    () =>
      "Egzersiz sonrası salgılanan endorfinlerden bahset ve o hissi hatırlat.",
    () =>
      "Vakit darsa HIIT tarzı bir plan veya evde ekipmansız set öner; süresini söyle.",
  ],
  dinner_reminder: [
    () =>
      "Akşam yemeğini hafif tutmasını ama protein+sebze eklemesini hatırlat; geç saatlere kalmamasını söyle.",
    () =>
      "Akşam sofrasını sakinleşme anı olarak tanımla ve mindful yemeyi öner.",
    () =>
      "Çorba + salata + sağlıklı yağ kombinasyonuyla günü kapatabileceğini anlat.",
    () =>
      "Gece acıkmalarını önlemek için dengeli akşam öğünü gerekliliğini vurgula.",
    () =>
      "Telefonsuz bir akşam tabağı fikri ver; odaklı yemek yemesini iste.",
  ],
  water_reminder: [
    (ctx) =>
      `Bugün ${ctx.totalWater}ml su içti; hedefi ${ctx.waterGoal}ml. Eksik kısmı hatırlat ve suyu keyifli hale getirecek fikir ver (ör. nane, salatalık).`,
    () =>
      "Su hedefini saatlik mini hedeflere bölmesini öner; her saat 1 bardak gibi.",
    () =>
      "Vücut sinyallerinden bahset (baş ağrısı, odak düşmesi) ve suyun çözüm olduğunu anlat.",
    () =>
      "Su içmeyi hatırlatmak için telefon etiketi, su takip uygulaması ya da su arkadaşı önermesini iste.",
    () =>
      "Her öğünden önce büyük bir bardak su içmesini söyle; rutine bağla.",
  ],
  activity_reminder: [
    (ctx) =>
      `Bugün öğün sayısı ${ctx.mealCount}, egzersiz ${ctx.workoutCount}. Eksik olan alanı nazikçe hatırlat ve mini aksiyon öner.`,
    () =>
      "Kullanıcıyı harekete geçirecek 5 dakikalık 'şimdi' challenge'ı yaz (squat, plank, yürüyüş).",
    () =>
      "Aktiviteyi eğlenceli hale getirmek için müzik veya arkadaş öner; motive et.",
    () =>
      "Gün içinde esneme + nefes + hareket üçlüsünü dengelemesini söyle.",
    () =>
      "Yapılacak en küçük aksiyonun bile zinciri kıracağını anlat; zincir metaforu kullan.",
  ],
  casual_check: [
    () =>
      "Kullanıcıya sohbet eder gibi 'nasılsın' de; günün highlight'ını sor ve destek ver.",
    () =>
      "Mini bir check-in yap: duygu, enerji ve odak seviyesini sor.",
    () =>
      "Bugün kendine ayırdığı 5 dakikalık alanı olup olmadığını sor; yoksa öner.",
    () =>
      "Kısa bir 'şu an nasıl hissediyorsun' sorusu sorup ardından destekleyici cümle ekle.",
    () =>
      "Konuşmaya sıcak bir emoji ile girip günün gidişatını sor.",
  ],
  motivation: [
    () =>
      "Kullanıcının hedefini hatırlat ve bugün yapacağı tek bir aksiyonun bile ona yaklaştıracağını söyle.",
    () =>
      "Daha önce başardığı bir şeyi referans alarak özgüvenini tazele.",
    () =>
      "Zor günlerde bile küçük adımların değerini anlat; minik örnek ver.",
    () =>
      "Hedefe giden yolu oyunlaştır; level/puan metaforu kullan.",
    () =>
      "Kendine ayırdığı her dakikanın yatırım olduğunu söyle ve motive et.",
  ],
  daily_summary: [
    (ctx) =>
      `Bugünkü öğün ${ctx.mealCount}, egzersiz ${ctx.workoutCount}, su ${ctx.totalWater}ml. Minik özet yap ve ertesi güne niyet belirlet.`,
    () =>
      "Günün güçlü alanlarını ve geliştirmek istediği tek alanı nazikçe özetle.",
    () =>
      "Akşam kapanışı için şükrettiği 1 şeyi yazmasını iste; ardından yarın için mikro hedef ver.",
    () =>
      "Günlük ilerlemenin mozaik gibi küçük taşlarla dolduğunu anlat; bugünkü taşları listele.",
    () =>
      "Haftalık ortalama kaloriyi referans alarak bugünü değerlendiren bir cümle ekle.",
  ],
  mindfulness_check: [
    () =>
      "Kullanıcıya derin nefes + omuz gevşetme gibi 1 dakikalık farkındalık öner.",
    () =>
      "Şu an bedeninde hangi alanın dikkat istediğini sor ve küçük bir tarama yaptır.",
    () =>
      "Gözleri kapatıp üç nefes alma, sonra minik bir gülümseme tekniği öner.",
    () =>
      "Telefonu bırakıp camdan dışarı bakmasını veya yürüyüş yapmasını öner; duyularını hatırlat.",
    () =>
      "Stresi hafifletmek için box breathing veya 4-7-8 nefes tekniğini anlat.",
  ],
  posture_reset: [
    () =>
      "Uzun süre oturduysa 30 saniyelik postür reseti öner (omuzları geriye, boynu uzat).",
    () =>
      "Masa başında kısa bir esneme dizisi tarif et (kedi-deve, gövde twist, bilek germe).",
    () =>
      "Ekrana çok baktıysa göz ve boyun dinlendirmesini iste.",
    () =>
      "Ayakta durup 10 derin nefes + kolları yukarı uzatma seti öner.",
    () =>
      "Postürü düzeltmenin nefes ve özgüven üzerindeki etkisini hatırlat.",
  ],
  energy_boost: [
    () =>
      "Enerjisi düştüyse su+protein+hareket üçlüsünden eksik olanı tamamlamasını iste; bugünkü değerleri referans ver.",
    () =>
      "2 dakikalık mini kardiyo veya merdiven inip çıkma önererek enerji yükselt.",
    () =>
      "Enerji için kahve yerine su ve nefes deneyebileceğini söyle; kısa rutin tarif et.",
    () =>
      "Gün ortasında power nap veya meditasyon önermesini iste.",
    () =>
      "Enerji çökmesini 'enerji pankası' metaforuyla açıkla ve dolduracak eylemi söyle.",
  ],
  gratitude_prompt: [
    () =>
      "Bugün şükrettiği bir şeyi yazmasını iste ve bunun motivasyonunu nasıl etkilediğini anlat.",
    () =>
      "Minnettarlık pratiğinin stres seviyesini düşürdüğünü vurgula; basit örnek ver.",
    () =>
      "Günün güzel bir anını fotoğraf gibi hatırlayıp o hisse dönmesini iste.",
    () =>
      "Küçük başarılarını kutlamasını ve kendine teşekkür etmesini öner.",
    () =>
      "Gratitude journaling yapmasını ve 2 maddelik liste önermesini iste.",
  ],
  hydro_celebration: [
    (ctx) =>
      `Bugün ${ctx.totalWater}ml su içti; bu başarıyı kutla ve hedefe ulaşmasına çok az kaldığını söyle.`,
    () =>
      "Su hedefine yaklaştığı için onu alkışla ve bu rutini nasıl koruyacağını anlat.",
    () =>
      "Kendi adıyla 'hydration hero' ilan et; eğlenceli bir kutlama cümlesi yaz.",
    () =>
      "Su içme ritmini sürdürürse cildinin ve enerjisinin nasıl parlayacağını anlat.",
    () =>
      "Gün sonunda su tracker'ını doldurmanın verdiği tatmini betimle.",
  ],
  coach_tip: [
    () =>
      "Bugün egzersiz yaptıysa formunu geliştirecek mini bir koçluk ipucu ver.",
    () =>
      "Kas onarımı için protein + esneme + uyku üçlüsünü hatırlat.",
    () =>
      "Egzersiz sonrası nefes veya soğuma rutini öner.",
    () =>
      "Antrenmanını not etmesini veya ilerleme fotoğrafı çekmesini iste.",
    () =>
      "Bir sonraki antrenman için mikro hedef belirlemesini sağla.",
  ],
  micro_goal: [
    () =>
      "Bugün için 5 dakikalık mikro hedef belirlet; örn. 10 squat, 1 bardak su, 3 derin nefes.",
    () =>
      "Kullanıcıya 'şu anda yapabileceğin en küçük adım ne?' sorusunu sor ve öneri ver.",
    () =>
      "Zinciri kırmamak için 1 dakika bile olsa hareket önermesini iste.",
    () =>
      "Mikro hedefi mutlaka yazmasını ve tamamlayınca kendini kutlamasını söyle.",
    () =>
      "Yeni alışkanlığını mevcut rutine bağlamasını (habit stacking) öner.",
  ],
  focus_sprint: [
    (ctx) =>
      `Son aktiviteden bu yana ${ctx.hoursSinceLastActivity ?? 0} saat geçmiş olabilir. 15 dakikalık odak sprinti öner ve ardından ödül koy.`,
    () =>
      "Pomodoro veya 25-5 tekniğini önererek odak bloğu oluşturmasını iste.",
    () =>
      "Dağılan motivasyonu toparlamak için yapılacak tek kritik işi seçmesini söyle.",
    () =>
      "Farkındalık + yapılacaklar listesi kombinasyonuyla mini plan yazmasını öner.",
    () =>
      "Odak sprintinden sonra su içmek veya esnemek için alarm kurmasını iste.",
  ],
  wind_down: [
    () =>
      "Akşam saatlerinde ekranı bırakıp hafif esneme + bitki çayı ile kapanış önermesini iste.",
    () =>
      "Uyku hijyenini hatırlat; loş ışık, telefon uzak, sakin nefes öner.",
    () =>
      "Gün sonu değerlendirmesi yapıp zihni boşaltması için journaling öner.",
    () =>
      "Uyumadan önce 3 derin nefes + teşekkür cümlesi pratiği teklif et.",
    () =>
      "Gece atıştırmalarını engellemek için sıcak duş + hafif kitap okuma kombinasyonu öner.",
  ],
};

export async function POST(request: Request) {
  if (!geminiApiKey) {
    return NextResponse.json({ message: null }, { status: 200 });
  }

  try {
    await request.json().catch(() => ({}));

    const supabase = createSupabaseRouteClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ message: null }, { status: 401 });
    }

    const activityStatus = await getUserActivityStatus(supabase, user.id);
    if (!activityStatus) {
      return NextResponse.json({ message: null }, { status: 200 });
    }

    const now = new Date();
    const {
      profile,
      totalWater,
      waterGoal,
      lastActivityTime,
      currentHour,
      mealCount,
      workoutCount,
      weeklyStats,
    } = activityStatus;

    const hoursSinceLastActivity = lastActivityTime
      ? Math.floor((now.getTime() - new Date(lastActivityTime).getTime()) / (1000 * 60 * 60))
      : null;

    const promptContext: PromptContext = {
      profileName: profile?.full_name,
      mealCount,
      workoutCount,
      totalWater,
      waterGoal,
      hoursSinceLastActivity,
      currentHour,
      avgDailyCalories: weeklyStats?.avgDailyCalories ?? 0,
    };

    const messageTypes: MessageType[] = [];

    if (currentHour >= 6 && currentHour < 10) {
      if (mealCount === 0) {
        messageTypes.push("morning_breakfast_reminder");
      } else {
        messageTypes.push("morning_greeting");
      }
    }

    if (currentHour >= 10 && currentHour < 14) {
      if (mealCount < 2) {
        messageTypes.push("lunch_reminder");
      } else {
        messageTypes.push("activity_reminder");
      }
    }

    if (currentHour >= 14 && currentHour < 18) {
      if (workoutCount === 0) {
        messageTypes.push("afternoon_workout_reminder");
      } else {
        messageTypes.push("coach_tip");
      }
    }

    if (currentHour >= 18 && currentHour < 22) {
      if (mealCount < 3) {
        messageTypes.push("dinner_reminder");
      } else {
        messageTypes.push("daily_summary");
      }
    }

    if (currentHour >= 22 || currentHour < 6) {
      messageTypes.push("wind_down");
    }

    if (totalWater >= waterGoal * 0.8) {
      messageTypes.push("hydro_celebration");
    }

    if (totalWater < waterGoal * 0.4) {
      messageTypes.push("water_reminder", "energy_boost");
    }

    if (hoursSinceLastActivity && hoursSinceLastActivity >= 3) {
      messageTypes.push("focus_sprint");
    }

    if (currentHour >= 13 && currentHour <= 17) {
      messageTypes.push("posture_reset");
    }

    messageTypes.push(
      "casual_check",
      "motivation",
      "activity_reminder",
      "mindfulness_check",
      "micro_goal",
      "gratitude_prompt"
    );

    const { value: messageType } = pickRandom(messageTypes);

    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });

    let contextString = `Sen NapiFit uygulamasının AI asistanısın. Kullanıcıya samimi, arkadaşça ve motive edici bir şekilde mesaj göndereceksin. Türkçe konuşuyorsun.\n\n`;

    if (profile?.full_name) {
      contextString += `Kullanıcının adı: ${profile.full_name}\n`;
    }

    contextString += `Bugünkü Durum:\n`;
    contextString += `- Öğün sayısı: ${mealCount}\n`;
    contextString += `- Egzersiz sayısı: ${workoutCount}\n`;
    contextString += `- Su tüketimi: ${totalWater}ml / ${waterGoal}ml\n`;
    contextString += `- Ortalama günlük kalori: ${promptContext.avgDailyCalories} kcal\n`;
    contextString += `- Saat: ${currentHour}:00\n`;

    if (hoursSinceLastActivity !== null) {
      contextString += `- Son aktivite: ${hoursSinceLastActivity} saat önce\n`;
    }

    const templateList = promptTemplates[messageType] ?? promptTemplates.motivation;
    const baseChoice = pickRandom(templateList);
    const styleChoice = pickRandom(styleVariations);
    const creativityChoice = pickRandom(creativityVariations);
    const groundingChoice = pickRandom(groundingVariations);
    const callToActionChoice = pickRandom(callToActionVariations);

    const prompt = [
      baseChoice.value(promptContext),
      styleChoice.value,
      creativityChoice.value,
      groundingChoice.value,
      callToActionChoice.value,
      "Mesaj tamamen Türkçe olsun ve toplam 3 cümleyi geçmesin.",
    ].join("\n\n");

    const fullPrompt = `${contextString}\n\n${prompt}`;

    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text().trim();

    if (text) {
      const hourBucket = Math.floor(now.getTime() / (1000 * 60 * 60));
      const variantSignature = `${messageType}:${baseChoice.index}:${styleChoice.index}:${creativityChoice.index}:${groundingChoice.index}:${callToActionChoice.index}`;
      const dedupeKey = `proactive:${user.id}:${messageType}:${hourBucket}`;

      await createAssistantNotification({
        supabase,
        userId: user.id,
        title: "💡 AI Hatırlatıcısı",
        message: text,
        type: "assistant_proactive",
        link: "/health",
        metadata: { messageType, hourBucket, variantSignature },
        dedupeKey,
      });

      return NextResponse.json({
        message: text,
        messageType,
        sentAt: Date.now(),
        variant: variantSignature,
      });
    }

    return NextResponse.json({
      message: text,
      messageType,
      sentAt: Date.now(),
    });
  } catch (error: any) {
    console.error("Proactive message error:", error);

    const errorMsg = error.message || String(error);
    const isReferrerBlocked =
      errorMsg.includes("REFERRER") ||
      errorMsg.includes("referer") ||
      errorMsg.includes("API_KEY_HTTP_REFERRER_BLOCKED");

    if (isReferrerBlocked) {
      console.error("API key HTTP referrer kısıtlaması var - Google AI Studio'da düzenleme gerekli");
    }

    return NextResponse.json({ message: null }, { status: 200 });
  }
}

