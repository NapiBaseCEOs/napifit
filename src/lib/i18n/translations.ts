import type { Locale } from "./locales";
import { defaultLocale } from "./locales";

export type TranslationKey = 
  // Homepage
  | "homepage.title"
  | "homepage.subtitle"
  | "homepage.description"
  | "homepage.cta.start"
  | "homepage.cta.login"
  // Stats
  | "stats.members"
  | "stats.workouts"
  | "stats.meals"
  | "stats.avgSteps"
  | "stats.streaks"
  | "stats.realTime"
  // Navigation & Header
  | "nav.home"
  | "nav.dashboard"
  | "nav.health"
  | "nav.profile"
  | "nav.community"
  | "nav.water"
  | "nav.logout"
  | "nav.login"
  | "nav.register"
  // Common
  | "common.save"
  | "common.cancel"
  | "common.loading"
  | "common.error"
  | "common.success"
  | "common.delete"
  | "common.edit"
  | "common.add"
  | "common.search"
  | "common.filter"
  | "common.close"
  | "common.back"
  | "common.next"
  | "common.previous"
  | "common.submit"
  | "common.confirm"
  // Forms
  | "form.email"
  | "form.password"
  | "form.name"
  | "form.fullName"
  | "form.weight"
  | "form.height"
  | "form.age"
  | "form.gender"
  | "form.goal"
  // Workout
  | "workout.name"
  | "workout.type"
  | "workout.duration"
  | "workout.calories"
  | "workout.distance"
  | "workout.sets"
  | "workout.reps"
  | "workout.add"
  | "workout.list"
  | "workout.recent"
  // Meal
  | "meal.name"
  | "meal.quantity"
  | "meal.calories"
  | "meal.protein"
  | "meal.carbs"
  | "meal.fat"
  | "meal.add"
  | "meal.breakfast"
  | "meal.lunch"
  | "meal.dinner"
  | "meal.snack"
  // Water
  | "water.intake"
  | "water.goal"
  | "water.add"
  | "water.today"
  | "water.remaining"
  // Health
  | "health.metrics"
  | "health.weight"
  | "health.bloodPressure"
  | "health.heartRate"
  | "health.steps"
  | "health.sleep"
  // AI Assistant
  | "ai.greeting"
  | "ai.howCanIHelp"
  | "ai.thinking"
  | "ai.error"
  | "ai.sendMessage"
  | "ai.placeholder"
  // Reviews & Social
  | "reviews.title"
  | "reviews.subtitle"
  | "reviews.realTime"
  // Features
  | "features.aiPlans"
  | "features.realTimeReports"
  | "features.googleLogin"
  | "features.mobileSync"
  // Journey
  | "journey.step1.title"
  | "journey.step1.desc"
  | "journey.step2.title"
  | "journey.step2.desc"
  | "journey.step3.title"
  | "journey.step3.desc"
  // Social Proof
  | "social.trustedInfra"
  | "social.description"
  // CTA
  | "cta.title"
  | "cta.description"
  | "cta.join"
  | "cta.hasAccount"
  // Changelog
  | "changelog.title"
  | "changelog.subtitle"
  | "changelog.previousReleases"
  // Health Forms
  | "healthForms.quickLog"
  | "healthForms.title"
  | "healthForms.description"
  | "healthForms.active"
  | "healthForms.metric.title"
  | "healthForms.metric.description"
  | "healthForms.workout.title"
  | "healthForms.workout.description"
  | "healthForms.meal.title"
  | "healthForms.meal.description";

export const translations: Record<Locale, Record<TranslationKey, string>> = {
  // TÜRKÇE
  tr: {
    "homepage.title": "Sağlıklı Yaşamın",
    "homepage.subtitle": "Yeni Başlangıcı",
    "homepage.description": "Kişisel antrenman planları, beslenme hatırlatmaları ve sağlık metrikleri tek panelde.",
    "homepage.cta.start": "Hemen Başla",
    "homepage.cta.login": "Giriş Yap",
    "stats.members": "Aktif Üye",
    "stats.workouts": "Kaydedilen Egzersiz",
    "stats.meals": "Takip Edilen Öğün",
    "stats.avgSteps": "Ortalama Günlük Adım",
    "stats.streaks": "Aktif Seriler",
    "stats.realTime": "Gerçek Zamanlı",
    "nav.home": "Ana Sayfa",
    "nav.dashboard": "Panel",
    "nav.health": "Sağlık",
    "nav.profile": "Profil",
    "nav.community": "Topluluk",
    "nav.water": "Su Takibi",
    "nav.logout": "Çıkış Yap",
    "nav.login": "Giriş Yap",
    "nav.register": "Kayıt Ol",
    "common.save": "Kaydet",
    "common.cancel": "İptal",
    "common.loading": "Yükleniyor...",
    "common.error": "Hata oluştu",
    "common.success": "Başarılı",
    "common.delete": "Sil",
    "common.edit": "Düzenle",
    "common.add": "Ekle",
    "common.search": "Ara",
    "common.filter": "Filtrele",
    "common.close": "Kapat",
    "common.back": "Geri",
    "common.next": "İleri",
    "common.previous": "Önceki",
    "common.submit": "Gönder",
    "common.confirm": "Onayla",
    "form.email": "E-posta",
    "form.password": "Şifre",
    "form.name": "İsim",
    "form.fullName": "Tam İsim",
    "form.weight": "Kilo",
    "form.height": "Boy",
    "form.age": "Yaş",
    "form.gender": "Cinsiyet",
    "form.goal": "Hedef",
    "workout.name": "Egzersiz Adı",
    "workout.type": "Tip",
    "workout.duration": "Süre (dakika)",
    "workout.calories": "Yakılan Kalori",
    "workout.distance": "Mesafe (km)",
    "workout.sets": "Set Sayısı",
    "workout.reps": "Tekrar Sayısı",
    "workout.add": "Egzersiz Ekle",
    "workout.list": "Egzersizlerim",
    "workout.recent": "Son Egzersizler",
    "meal.name": "Yiyecek Adı",
    "meal.quantity": "Miktar",
    "meal.calories": "Kalori",
    "meal.protein": "Protein (g)",
    "meal.carbs": "Karbonhidrat (g)",
    "meal.fat": "Yağ (g)",
    "meal.add": "Öğün Ekle",
    "meal.breakfast": "Kahvaltı",
    "meal.lunch": "Öğle Yemeği",
    "meal.dinner": "Akşam Yemeği",
    "meal.snack": "Atıştırmalık",
    "water.intake": "Su Tüketimi",
    "water.goal": "Hedef",
    "water.add": "Su Ekle",
    "water.today": "Bugün",
    "water.remaining": "Kalan",
    "health.metrics": "Sağlık Metrikleri",
    "health.weight": "Kilo",
    "health.bloodPressure": "Tansiyon",
    "health.heartRate": "Nabız",
    "health.steps": "Adım",
    "health.sleep": "Uyku",
    "ai.greeting": "Merhaba! Nasıl yardımcı olabilirim?",
    "ai.howCanIHelp": "Size nasıl yardımcı olabilirim?",
    "ai.thinking": "Düşünüyorum...",
    "ai.error": "Üzgünüm, bir hata oluştu",
    "ai.sendMessage": "Mesaj gönder",
    "ai.placeholder": "Mesajınızı yazın...",
    "reviews.title": "Kullanıcı Yorumları",
    "reviews.subtitle": "Gerçek kullanıcılarımızın deneyimleri",
    "reviews.realTime": "Gerçek Zamanlı",
    "features.aiPlans": "AI destekli planlar",
    "features.realTimeReports": "Gerçek zamanlı raporlar",
    "features.googleLogin": "Google & e-posta ile giriş",
    "features.mobileSync": "Mobil senkronizasyon",
    "journey.step1.title": "Onboarding & Analiz",
    "journey.step1.desc": "Yapay zeka destekli sorularla profilini oluştur, hedeflerini belirle.",
    "journey.step2.title": "Planını Özelleştir",
    "journey.step2.desc": "Egzersiz, beslenme ve sağlık önerilerini kişisel programına göre uyarlıyoruz.",
    "journey.step3.title": "İlerlemeni Takip Et",
    "journey.step3.desc": "Gerçek zamanlı metrikler, raporlar ve hatırlatmalarla motivasyonunu koru.",
    "social.trustedInfra": "Güvenilir Altyapı",
    "social.description": "NapiFit hem Supabase güvenliği hem de Vercel otomatik deploy sistemi sayesinde dakikalar içinde yayına alınır.",
    "cta.title": "Mobil deneyim, Cloudflare desteği ve AI önerileriyle",
    "cta.description": "NapiFit hem web hem de mobil (Capacitor) deneyimini destekler. Tek tıkla Vercel ve Cloudflare entegrasyonlarıyla her push sonrası otomatik olarak yayına çıkar.",
    "cta.join": "Topluluğa Katıl",
    "cta.hasAccount": "Hesabın var mı?",
    "changelog.title": "Sürüm Notları",
    "changelog.subtitle": "En son güncellemeler ve yeni özellikler",
    "changelog.previousReleases": "Önceki Sürümler",
    "healthForms.quickLog": "Hızlı Kayıt",
    "healthForms.title": "Tek panelden tüm kayıtlar",
    "healthForms.description": "AI destekli alanlar doğru kaloriyi tahmin eder, hatırlatmalar ise seni yönlendirsin.",
    "healthForms.active": "AKTİF",
    "healthForms.metric.title": "Sağlık Metrikleri",
    "healthForms.metric.description": "Kilo, tansiyon, nabız ve daha fazlası.",
    "healthForms.workout.title": "Egzersiz",
    "healthForms.workout.description": "Koşu, spor salonu, yoga gibi aktiviteleri kaydet.",
    "healthForms.meal.title": "Öğün",
    "healthForms.meal.description": "Yiyecekleri seç, AI kalori tahmini al.",
  },

  // ENGLISH
  en: {
    "homepage.title": "Healthy Living",
    "homepage.subtitle": "New Beginning",
    "homepage.description": "Personal training plans, nutrition reminders, and health metrics in one dashboard.",
    "homepage.cta.start": "Get Started",
    "homepage.cta.login": "Sign In",
    "stats.members": "Active Members",
    "stats.workouts": "Recorded Workouts",
    "stats.meals": "Tracked Meals",
    "stats.avgSteps": "Average Daily Steps",
    "stats.streaks": "Active Streaks",
    "stats.realTime": "Real Time",
    "nav.home": "Home",
    "nav.dashboard": "Dashboard",
    "nav.health": "Health",
    "nav.profile": "Profile",
    "nav.community": "Community",
    "nav.water": "Water Tracking",
    "nav.logout": "Logout",
    "nav.login": "Login",
    "nav.register": "Register",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.success": "Success",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.add": "Add",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.close": "Close",
    "common.back": "Back",
    "common.next": "Next",
    "common.previous": "Previous",
    "common.submit": "Submit",
    "common.confirm": "Confirm",
    "form.email": "Email",
    "form.password": "Password",
    "form.name": "Name",
    "form.fullName": "Full Name",
    "form.weight": "Weight",
    "form.height": "Height",
    "form.age": "Age",
    "form.gender": "Gender",
    "form.goal": "Goal",
    "workout.name": "Workout Name",
    "workout.type": "Type",
    "workout.duration": "Duration (minutes)",
    "workout.calories": "Calories Burned",
    "workout.distance": "Distance (km)",
    "workout.sets": "Number of Sets",
    "workout.reps": "Number of Reps",
    "workout.add": "Add Workout",
    "workout.list": "My Workouts",
    "workout.recent": "Recent Workouts",
    "meal.name": "Food Name",
    "meal.quantity": "Quantity",
    "meal.calories": "Calories",
    "meal.protein": "Protein (g)",
    "meal.carbs": "Carbohydrates (g)",
    "meal.fat": "Fat (g)",
    "meal.add": "Add Meal",
    "meal.breakfast": "Breakfast",
    "meal.lunch": "Lunch",
    "meal.dinner": "Dinner",
    "meal.snack": "Snack",
    "water.intake": "Water Intake",
    "water.goal": "Goal",
    "water.add": "Add Water",
    "water.today": "Today",
    "water.remaining": "Remaining",
    "health.metrics": "Health Metrics",
    "health.weight": "Weight",
    "health.bloodPressure": "Blood Pressure",
    "health.heartRate": "Heart Rate",
    "health.steps": "Steps",
    "health.sleep": "Sleep",
    "ai.greeting": "Hello! How can I help you?",
    "ai.howCanIHelp": "How can I assist you?",
    "ai.thinking": "Thinking...",
    "ai.error": "Sorry, an error occurred",
    "ai.sendMessage": "Send message",
    "ai.placeholder": "Type your message...",
    "reviews.title": "User Reviews",
    "reviews.subtitle": "Experiences from our real users",
    "reviews.realTime": "Real Time",
    "features.aiPlans": "AI-powered plans",
    "features.realTimeReports": "Real-time reports",
    "features.googleLogin": "Google & email sign-in",
    "features.mobileSync": "Mobile synchronization",
    "journey.step1.title": "Onboarding & Analysis",
    "journey.step1.desc": "Create your profile with AI-powered questions and set your goals.",
    "journey.step2.title": "Customize Your Plan",
    "journey.step2.desc": "We tailor exercise, nutrition, and health recommendations to your personal program.",
    "journey.step3.title": "Track Your Progress",
    "journey.step3.desc": "Stay motivated with real-time metrics, reports, and reminders.",
    "social.trustedInfra": "Trusted Infrastructure",
    "social.description": "NapiFit goes live in minutes thanks to both Supabase security and Vercel's automatic deployment system.",
    "cta.title": "Mobile experience, Cloudflare support, and AI suggestions",
    "cta.description": "NapiFit supports both web and mobile (Capacitor) experiences. It goes live automatically after each push with one-click Vercel and Cloudflare integrations.",
    "cta.join": "Join the Community",
    "cta.hasAccount": "Already have an account?",
    "changelog.title": "Release Notes",
    "changelog.subtitle": "Latest updates and new features",
    "changelog.previousReleases": "Previous Releases",
    "healthForms.quickLog": "Quick Log",
    "healthForms.title": "All records from one panel",
    "healthForms.description": "AI-powered fields estimate accurate calories, reminders guide you.",
    "healthForms.active": "ACTIVE",
    "healthForms.metric.title": "Health Metrics",
    "healthForms.metric.description": "Weight, blood pressure, heart rate, and more.",
    "healthForms.workout.title": "Workout",
    "healthForms.workout.description": "Log activities like running, gym, yoga.",
    "healthForms.meal.title": "Meal",
    "healthForms.meal.description": "Select foods, get AI calorie estimates.",
  },

  // DEUTSCH (German)
  de: {
    "homepage.title": "Gesundes Leben",
    "homepage.subtitle": "Neuer Anfang",
    "homepage.description": "Persönliche Trainingspläne, Ernährungserinnerungen und Gesundheitsmetriken in einem Dashboard.",
    "homepage.cta.start": "Loslegen",
    "homepage.cta.login": "Anmelden",
    "stats.members": "Aktive Mitglieder",
    "stats.workouts": "Aufgezeichnete Workouts",
    "stats.meals": "Verfolgte Mahlzeiten",
    "stats.avgSteps": "Durchschnittliche tägliche Schritte",
    "stats.streaks": "Aktive Serien",
    "stats.realTime": "Echtzeit",
    "nav.home": "Startseite",
    "nav.dashboard": "Dashboard",
    "nav.health": "Gesundheit",
    "nav.profile": "Profil",
    "nav.community": "Community",
    "nav.water": "Wasser-Tracking",
    "nav.logout": "Abmelden",
    "nav.login": "Anmelden",
    "nav.register": "Registrieren",
    "common.save": "Speichern",
    "common.cancel": "Abbrechen",
    "common.loading": "Lädt...",
    "common.error": "Ein Fehler ist aufgetreten",
    "common.success": "Erfolgreich",
    "common.delete": "Löschen",
    "common.edit": "Bearbeiten",
    "common.add": "Hinzufügen",
    "common.search": "Suchen",
    "common.filter": "Filtern",
    "common.close": "Schließen",
    "common.back": "Zurück",
    "common.next": "Weiter",
    "common.previous": "Zurück",
    "common.submit": "Absenden",
    "common.confirm": "Bestätigen",
    "form.email": "E-Mail",
    "form.password": "Passwort",
    "form.name": "Name",
    "form.fullName": "Vollständiger Name",
    "form.weight": "Gewicht",
    "form.height": "Größe",
    "form.age": "Alter",
    "form.gender": "Geschlecht",
    "form.goal": "Ziel",
    "workout.name": "Workout-Name",
    "workout.type": "Typ",
    "workout.duration": "Dauer (Minuten)",
    "workout.calories": "Verbrannte Kalorien",
    "workout.distance": "Distanz (km)",
    "workout.sets": "Anzahl der Sätze",
    "workout.reps": "Anzahl der Wiederholungen",
    "workout.add": "Workout hinzufügen",
    "workout.list": "Meine Workouts",
    "workout.recent": "Letzte Workouts",
    "meal.name": "Lebensmittelname",
    "meal.quantity": "Menge",
    "meal.calories": "Kalorien",
    "meal.protein": "Protein (g)",
    "meal.carbs": "Kohlenhydrate (g)",
    "meal.fat": "Fett (g)",
    "meal.add": "Mahlzeit hinzufügen",
    "meal.breakfast": "Frühstück",
    "meal.lunch": "Mittagessen",
    "meal.dinner": "Abendessen",
    "meal.snack": "Snack",
    "water.intake": "Wasseraufnahme",
    "water.goal": "Ziel",
    "water.add": "Wasser hinzufügen",
    "water.today": "Heute",
    "water.remaining": "Verbleibend",
    "health.metrics": "Gesundheitsmetriken",
    "health.weight": "Gewicht",
    "health.bloodPressure": "Blutdruck",
    "health.heartRate": "Herzfrequenz",
    "health.steps": "Schritte",
    "health.sleep": "Schlaf",
    "ai.greeting": "Hallo! Wie kann ich Ihnen helfen?",
    "ai.howCanIHelp": "Wie kann ich Ihnen behilflich sein?",
    "ai.thinking": "Denke nach...",
    "ai.error": "Entschuldigung, ein Fehler ist aufgetreten",
    "ai.sendMessage": "Nachricht senden",
    "ai.placeholder": "Ihre Nachricht eingeben...",
    "reviews.title": "Benutzerbewertungen",
    "reviews.subtitle": "Erfahrungen unserer echten Benutzer",
    "reviews.realTime": "Echtzeit",
    "features.aiPlans": "KI-gestützte Pläne",
    "features.realTimeReports": "Echtzeit-Berichte",
    "features.googleLogin": "Google & E-Mail-Anmeldung",
    "features.mobileSync": "Mobile Synchronisierung",
    "journey.step1.title": "Onboarding & Analyse",
    "journey.step1.desc": "Erstellen Sie Ihr Profil mit KI-gestützten Fragen und setzen Sie Ihre Ziele.",
    "journey.step2.title": "Passen Sie Ihren Plan an",
    "journey.step2.desc": "Wir passen Bewegungs-, Ernährungs- und Gesundheitsempfehlungen an Ihr persönliches Programm an.",
    "journey.step3.title": "Verfolgen Sie Ihren Fortschritt",
    "journey.step3.desc": "Bleiben Sie motiviert mit Echtzeit-Metriken, Berichten und Erinnerungen.",
    "social.trustedInfra": "Vertrauenswürdige Infrastruktur",
    "social.description": "NapiFit geht dank Supabase-Sicherheit und Vercel's automatischem Bereitstellungssystem in Minuten live.",
    "cta.title": "Mobile Erfahrung, Cloudflare-Unterstützung und KI-Vorschläge",
    "cta.description": "NapiFit unterstützt sowohl Web- als auch mobile (Capacitor) Erfahrungen. Es geht automatisch live nach jedem Push mit Ein-Klick-Vercel- und Cloudflare-Integrationen.",
    "cta.join": "Community beitreten",
    "cta.hasAccount": "Haben Sie bereits ein Konto?",
    "changelog.title": "Versionshinweise",
    "changelog.subtitle": "Neueste Updates und neue Funktionen",
    "changelog.previousReleases": "Frühere Versionen",
    "healthForms.quickLog": "Schnelleingabe",
    "healthForms.title": "Alle Aufzeichnungen von einem Panel",
    "healthForms.description": "KI-gestützte Felder schätzen genaue Kalorien, Erinnerungen leiten Sie.",
    "healthForms.active": "AKTIV",
    "healthForms.metric.title": "Gesundheitsmetriken",
    "healthForms.metric.description": "Gewicht, Blutdruck, Herzfrequenz und mehr.",
    "healthForms.workout.title": "Training",
    "healthForms.workout.description": "Aktivitäten wie Laufen, Fitnessstudio, Yoga protokollieren.",
    "healthForms.meal.title": "Mahlzeit",
    "healthForms.meal.description": "Lebensmittel auswählen, KI-Kalorienschätzung erhalten.",
  },

  // FRANÇAIS (French) - Shortened for brevity, pattern continues
  fr: {
    "homepage.title": "Vie Saine",
    "homepage.subtitle": "Nouveau Début",
    "homepage.description": "Plans d'entraînement personnels, rappels nutritionnels et métriques de santé dans un tableau de bord.",
    "homepage.cta.start": "Commencer",
    "homepage.cta.login": "Se connecter",
    "stats.members": "Membres Actifs",
    "stats.workouts": "Entraînements Enregistrés",
    "stats.meals": "Repas Suivis",
    "stats.avgSteps": "Pas Quotidiens Moyens",
    "stats.streaks": "Séries Actives",
    "stats.realTime": "Temps Réel",
    "nav.home": "Accueil",
    "nav.dashboard": "Tableau de bord",
    "nav.health": "Santé",
    "nav.profile": "Profil",
    "nav.community": "Communauté",
    "nav.water": "Suivi de l'eau",
    "nav.logout": "Déconnexion",
    "nav.login": "Connexion",
    "nav.register": "S'inscrire",
    "common.save": "Enregistrer",
    "common.cancel": "Annuler",
    "common.loading": "Chargement...",
    "common.error": "Une erreur s'est produite",
    "common.success": "Succès",
    "common.delete": "Supprimer",
    "common.edit": "Modifier",
    "common.add": "Ajouter",
    "common.search": "Rechercher",
    "common.filter": "Filtrer",
    "common.close": "Fermer",
    "common.back": "Retour",
    "common.next": "Suivant",
    "common.previous": "Précédent",
    "common.submit": "Soumettre",
    "common.confirm": "Confirmer",
    "form.email": "E-mail",
    "form.password": "Mot de passe",
    "form.name": "Nom",
    "form.fullName": "Nom complet",
    "form.weight": "Poids",
    "form.height": "Taille",
    "form.age": "Âge",
    "form.gender": "Genre",
    "form.goal": "Objectif",
    "workout.name": "Nom de l'Entraînement",
    "workout.type": "Type",
    "workout.duration": "Durée (minutes)",
    "workout.calories": "Calories Brûlées",
    "workout.distance": "Distance (km)",
    "workout.sets": "Nombre de Séries",
    "workout.reps": "Nombre de Répétitions",
    "workout.add": "Ajouter un entraînement",
    "workout.list": "Mes entraînements",
    "workout.recent": "Entraînements récents",
    "meal.name": "Nom de l'Aliment",
    "meal.quantity": "Quantité",
    "meal.calories": "Calories",
    "meal.protein": "Protéines (g)",
    "meal.carbs": "Glucides (g)",
    "meal.fat": "Lipides (g)",
    "meal.add": "Ajouter un repas",
    "meal.breakfast": "Petit-déjeuner",
    "meal.lunch": "Déjeuner",
    "meal.dinner": "Dîner",
    "meal.snack": "Collation",
    "water.intake": "Consommation d'eau",
    "water.goal": "Objectif",
    "water.add": "Ajouter de l'eau",
    "water.today": "Aujourd'hui",
    "water.remaining": "Restant",
    "health.metrics": "Métriques de Santé",
    "health.weight": "Poids",
    "health.bloodPressure": "Tension artérielle",
    "health.heartRate": "Fréquence cardiaque",
    "health.steps": "Pas",
    "health.sleep": "Sommeil",
    "ai.greeting": "Bonjour! Comment puis-je vous aider?",
    "ai.howCanIHelp": "Comment puis-je vous aider?",
    "ai.thinking": "Réflexion...",
    "ai.error": "Désolé, une erreur s'est produite",
    "ai.sendMessage": "Envoyer un message",
    "ai.placeholder": "Tapez votre message...",
    "reviews.title": "Avis des Utilisateurs",
    "reviews.subtitle": "Expériences de nos vrais utilisateurs",
    "reviews.realTime": "Temps Réel",
    "features.aiPlans": "Plans alimentés par l'IA",
    "features.realTimeReports": "Rapports en temps réel",
    "features.googleLogin": "Connexion Google & e-mail",
    "features.mobileSync": "Synchronisation mobile",
    "journey.step1.title": "Intégration & Analyse",
    "journey.step1.desc": "Créez votre profil avec des questions alimentées par l'IA et définissez vos objectifs.",
    "journey.step2.title": "Personnalisez votre plan",
    "journey.step2.desc": "Nous adaptons les recommandations d'exercice, de nutrition et de santé à votre programme personnel.",
    "journey.step3.title": "Suivez vos progrès",
    "journey.step3.desc": "Restez motivé avec des métriques en temps réel, des rapports et des rappels.",
    "social.trustedInfra": "Infrastructure de confiance",
    "social.description": "NapiFit est mis en ligne en quelques minutes grâce à la sécurité Supabase et au système de déploiement automatique de Vercel.",
    "cta.title": "Expérience mobile, support Cloudflare et suggestions IA",
    "cta.description": "NapiFit prend en charge les expériences web et mobiles (Capacitor). Il est mis en ligne automatiquement après chaque push avec les intégrations Vercel et Cloudflare en un clic.",
    "cta.join": "Rejoindre la communauté",
    "cta.hasAccount": "Vous avez déjà un compte?",
    "changelog.title": "Notes de version",
    "changelog.subtitle": "Dernières mises à jour et nouvelles fonctionnalités",
    "changelog.previousReleases": "Versions précédentes",
    "healthForms.quickLog": "Enregistrement rapide",
    "healthForms.title": "Tous les enregistrements depuis un seul panneau",
    "healthForms.description": "Les champs alimentés par l'IA estiment les calories précises, les rappels vous guident.",
    "healthForms.active": "ACTIF",
    "healthForms.metric.title": "Métriques de santé",
    "healthForms.metric.description": "Poids, tension artérielle, fréquence cardiaque et plus.",
    "healthForms.workout.title": "Entraînement",
    "healthForms.workout.description": "Enregistrer des activités comme la course, la salle de sport, le yoga.",
    "healthForms.meal.title": "Repas",
    "healthForms.meal.description": "Sélectionner des aliments, obtenir des estimations de calories IA.",
  },

  // TODO: Add full translations for other languages (ES, IT, RU, AR, PT, ZH, JA, KO, HI, NL, SV, PL)
  // For now, these will fall back to English via getTranslation()
  es: {} as Record<TranslationKey, string>,
  it: {} as Record<TranslationKey, string>,
  ru: {} as Record<TranslationKey, string>,
  ar: {} as Record<TranslationKey, string>,
  pt: {} as Record<TranslationKey, string>,
  zh: {} as Record<TranslationKey, string>,
  ja: {} as Record<TranslationKey, string>,
  ko: {} as Record<TranslationKey, string>,
  hi: {} as Record<TranslationKey, string>,
  nl: {} as Record<TranslationKey, string>,
  sv: {} as Record<TranslationKey, string>,
  pl: {} as Record<TranslationKey, string>,
};

// Translation function with fallback
export function getTranslation(locale: Locale, key: TranslationKey): string {
  const localeTranslations = translations[locale];
  if (localeTranslations && (key in localeTranslations)) {
    return localeTranslations[key] || key;
  }
  const defaultTranslations = translations[defaultLocale];
  if (defaultTranslations && (key in defaultTranslations)) {
    return defaultTranslations[key] || key;
  }
  return key;
}
