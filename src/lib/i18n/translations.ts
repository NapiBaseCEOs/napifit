import type { Locale } from "./locales";
import { defaultLocale } from "./locales";

export type TranslationKey = 
  | "homepage.title"
  | "homepage.subtitle"
  | "homepage.cta.start"
  | "homepage.cta.login"
  | "stats.members"
  | "stats.workouts"
  | "stats.meals"
  | "stats.avgSteps"
  | "stats.streaks"
  | "stats.realTime"
  | "reviews.title"
  | "reviews.subtitle"
  | "reviews.realTime"
  | "workout.name"
  | "workout.type"
  | "workout.duration"
  | "workout.calories"
  | "workout.distance"
  | "workout.sets"
  | "workout.reps"
  | "meal.name"
  | "meal.quantity"
  | "meal.calories"
  | "common.save"
  | "common.cancel"
  | "common.loading"
  | "common.error";

export const translations: Record<Locale, Record<TranslationKey, string>> = {
  tr: {
    "homepage.title": "Sağlıklı Yaşamın",
    "homepage.subtitle": "Yeni Başlangıcı",
    "homepage.cta.start": "Hemen Başla",
    "homepage.cta.login": "Giriş Yap",
    "stats.members": "Aktif Üye",
    "stats.workouts": "Kaydedilen Egzersiz",
    "stats.meals": "Takip Edilen Öğün",
    "stats.avgSteps": "Ortalama Günlük Adım",
    "stats.streaks": "Aktif Seriler",
    "stats.realTime": "Gerçek Zamanlı",
    "reviews.title": "Kullanıcı Yorumları",
    "reviews.subtitle": "Gerçek kullanıcılarımızın deneyimleri",
    "reviews.realTime": "Gerçek Zamanlı",
    "workout.name": "Egzersiz Adı",
    "workout.type": "Tip",
    "workout.duration": "Süre (dakika)",
    "workout.calories": "Yakılan Kalori",
    "workout.distance": "Mesafe (km)",
    "workout.sets": "Set Sayısı",
    "workout.reps": "Tekrar Sayısı",
    "meal.name": "Yiyecek Adı",
    "meal.quantity": "Miktar",
    "meal.calories": "Kalori",
    "common.save": "Kaydet",
    "common.cancel": "İptal",
    "common.loading": "Yükleniyor...",
    "common.error": "Hata oluştu",
  },
  en: {
    "homepage.title": "Healthy Living",
    "homepage.subtitle": "New Beginning",
    "homepage.cta.start": "Get Started",
    "homepage.cta.login": "Sign In",
    "stats.members": "Active Members",
    "stats.workouts": "Recorded Workouts",
    "stats.meals": "Tracked Meals",
    "stats.avgSteps": "Average Daily Steps",
    "stats.streaks": "Active Streaks",
    "stats.realTime": "Real Time",
    "reviews.title": "User Reviews",
    "reviews.subtitle": "Experiences from our real users",
    "reviews.realTime": "Real Time",
    "workout.name": "Workout Name",
    "workout.type": "Type",
    "workout.duration": "Duration (minutes)",
    "workout.calories": "Calories Burned",
    "workout.distance": "Distance (km)",
    "workout.sets": "Number of Sets",
    "workout.reps": "Number of Reps",
    "meal.name": "Food Name",
    "meal.quantity": "Quantity",
    "meal.calories": "Calories",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.loading": "Loading...",
    "common.error": "An error occurred",
  },
  de: {
    "homepage.title": "Gesundes Leben",
    "homepage.subtitle": "Neuer Anfang",
    "homepage.cta.start": "Loslegen",
    "homepage.cta.login": "Anmelden",
    "stats.members": "Aktive Mitglieder",
    "stats.workouts": "Aufgezeichnete Workouts",
    "stats.meals": "Verfolgte Mahlzeiten",
    "stats.avgSteps": "Durchschnittliche tägliche Schritte",
    "stats.streaks": "Aktive Serien",
    "stats.realTime": "Echtzeit",
    "reviews.title": "Benutzerbewertungen",
    "reviews.subtitle": "Erfahrungen unserer echten Benutzer",
    "reviews.realTime": "Echtzeit",
    "workout.name": "Workout-Name",
    "workout.type": "Typ",
    "workout.duration": "Dauer (Minuten)",
    "workout.calories": "Verbrannte Kalorien",
    "workout.distance": "Distanz (km)",
    "workout.sets": "Anzahl der Sätze",
    "workout.reps": "Anzahl der Wiederholungen",
    "meal.name": "Lebensmittelname",
    "meal.quantity": "Menge",
    "meal.calories": "Kalorien",
    "common.save": "Speichern",
    "common.cancel": "Abbrechen",
    "common.loading": "Lädt...",
    "common.error": "Ein Fehler ist aufgetreten",
  },
  fr: {
    "homepage.title": "Vie Saine",
    "homepage.subtitle": "Nouveau Début",
    "homepage.cta.start": "Commencer",
    "homepage.cta.login": "Se connecter",
    "stats.members": "Membres Actifs",
    "stats.workouts": "Entraînements Enregistrés",
    "stats.meals": "Repas Suivis",
    "stats.avgSteps": "Pas Quotidiens Moyens",
    "stats.streaks": "Séries Actives",
    "stats.realTime": "Temps Réel",
    "reviews.title": "Avis des Utilisateurs",
    "reviews.subtitle": "Expériences de nos vrais utilisateurs",
    "reviews.realTime": "Temps Réel",
    "workout.name": "Nom de l'Entraînement",
    "workout.type": "Type",
    "workout.duration": "Durée (minutes)",
    "workout.calories": "Calories Brûlées",
    "workout.distance": "Distance (km)",
    "workout.sets": "Nombre de Séries",
    "workout.reps": "Nombre de Répétitions",
    "meal.name": "Nom de l'Aliment",
    "meal.quantity": "Quantité",
    "meal.calories": "Calories",
    "common.save": "Enregistrer",
    "common.cancel": "Annuler",
    "common.loading": "Chargement...",
    "common.error": "Une erreur s'est produite",
  },
  es: {
    "homepage.title": "Vida Saludable",
    "homepage.subtitle": "Nuevo Comienzo",
    "homepage.cta.start": "Comenzar",
    "homepage.cta.login": "Iniciar Sesión",
    "stats.members": "Miembros Activos",
    "stats.workouts": "Entrenamientos Registrados",
    "stats.meals": "Comidas Rastreadas",
    "stats.avgSteps": "Pasos Diarios Promedio",
    "stats.streaks": "Rachas Activas",
    "stats.realTime": "Tiempo Real",
    "reviews.title": "Reseñas de Usuarios",
    "reviews.subtitle": "Experiencias de nuestros usuarios reales",
    "reviews.realTime": "Tiempo Real",
    "workout.name": "Nombre del Entrenamiento",
    "workout.type": "Tipo",
    "workout.duration": "Duración (minutos)",
    "workout.calories": "Calorías Quemadas",
    "workout.distance": "Distancia (km)",
    "workout.sets": "Número de Series",
    "workout.reps": "Número de Repeticiones",
    "meal.name": "Nombre del Alimento",
    "meal.quantity": "Cantidad",
    "meal.calories": "Calorías",
    "common.save": "Guardar",
    "common.cancel": "Cancelar",
    "common.loading": "Cargando...",
    "common.error": "Ocurrió un error",
  },
  it: {
    "homepage.title": "Vita Sana",
    "homepage.subtitle": "Nuovo Inizio",
    "homepage.cta.start": "Inizia",
    "homepage.cta.login": "Accedi",
    "stats.members": "Membri Attivi",
    "stats.workouts": "Allenamenti Registrati",
    "stats.meals": "Pasti Tracciati",
    "stats.avgSteps": "Passi Giornalieri Medi",
    "stats.streaks": "Serie Attive",
    "stats.realTime": "Tempo Reale",
    "reviews.title": "Recensioni Utenti",
    "reviews.subtitle": "Esperienze dei nostri veri utenti",
    "reviews.realTime": "Tempo Reale",
    "workout.name": "Nome Allenamento",
    "workout.type": "Tipo",
    "workout.duration": "Durata (minuti)",
    "workout.calories": "Calorie Bruciate",
    "workout.distance": "Distanza (km)",
    "workout.sets": "Numero di Serie",
    "workout.reps": "Numero di Ripetizioni",
    "meal.name": "Nome Alimento",
    "meal.quantity": "Quantità",
    "meal.calories": "Calorie",
    "common.save": "Salva",
    "common.cancel": "Annulla",
    "common.loading": "Caricamento...",
    "common.error": "Si è verificato un errore",
  },
  ru: {
    "homepage.title": "Здоровый Образ Жизни",
    "homepage.subtitle": "Новое Начало",
    "homepage.cta.start": "Начать",
    "homepage.cta.login": "Войти",
    "stats.members": "Активные Участники",
    "stats.workouts": "Записанные Тренировки",
    "stats.meals": "Отслеживаемые Приемы Пищи",
    "stats.avgSteps": "Средние Дневные Шаги",
    "stats.streaks": "Активные Серии",
    "stats.realTime": "В Реальном Времени",
    "reviews.title": "Отзывы Пользователей",
    "reviews.subtitle": "Опыт наших реальных пользователей",
    "reviews.realTime": "В Реальном Времени",
    "workout.name": "Название Тренировки",
    "workout.type": "Тип",
    "workout.duration": "Длительность (минуты)",
    "workout.calories": "Сожженные Калории",
    "workout.distance": "Расстояние (км)",
    "workout.sets": "Количество Подходов",
    "workout.reps": "Количество Повторений",
    "meal.name": "Название Еды",
    "meal.quantity": "Количество",
    "meal.calories": "Калории",
    "common.save": "Сохранить",
    "common.cancel": "Отмена",
    "common.loading": "Загрузка...",
    "common.error": "Произошла ошибка",
  },
  ar: {
    "homepage.title": "الحياة الصحية",
    "homepage.subtitle": "بداية جديدة",
    "homepage.cta.start": "ابدأ الآن",
    "homepage.cta.login": "تسجيل الدخول",
    "stats.members": "الأعضاء النشطون",
    "stats.workouts": "التمارين المسجلة",
    "stats.meals": "الوجبات المتتبعة",
    "stats.avgSteps": "متوسط الخطوات اليومية",
    "stats.streaks": "السلاسل النشطة",
    "stats.realTime": "في الوقت الفعلي",
    "reviews.title": "آراء المستخدمين",
    "reviews.subtitle": "تجارب مستخدمينا الحقيقيين",
    "reviews.realTime": "في الوقت الفعلي",
    "workout.name": "اسم التمرين",
    "workout.type": "النوع",
    "workout.duration": "المدة (دقائق)",
    "workout.calories": "السعرات المحروقة",
    "workout.distance": "المسافة (كم)",
    "workout.sets": "عدد المجموعات",
    "workout.reps": "عدد التكرارات",
    "meal.name": "اسم الطعام",
    "meal.quantity": "الكمية",
    "meal.calories": "السعرات",
    "common.save": "حفظ",
    "common.cancel": "إلغاء",
    "common.loading": "جاري التحميل...",
    "common.error": "حدث خطأ",
  },
};

export function getTranslation(locale: Locale, key: TranslationKey): string {
  const localeTranslations = translations[locale as keyof typeof translations];
  if (localeTranslations && (key in localeTranslations)) {
    return localeTranslations[key] as string;
  }
  const defaultTranslations = translations[defaultLocale as keyof typeof translations];
  if (defaultTranslations && (key in defaultTranslations)) {
    return defaultTranslations[key] as string;
  }
  return key;
}

