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
  | "common.calendar"
  | "common.today"
  | "common.locale"
  | "common.user"
  | "common.founder"
  | "common.admin"
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
  | "reviews.loading"
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
  | "healthForms.meal.description"
  // Auth - Login
  | "auth.login.welcome"
  | "auth.login.subtitle"
  | "auth.login.emailLabel"
  | "auth.login.passwordLabel"
  | "auth.login.submit"
  | "auth.login.googleContinue"
  | "auth.login.googleNote"
  | "auth.login.noAccount"
  | "auth.login.forgotPassword"
  | "auth.login.errors.invalidCredentials"
  | "auth.login.errors.emailNotConfirmed"
  | "auth.login.errors.sessionError"
  | "auth.login.errors.googleError"
  | "auth.login.info.resendVerification"
  // Auth - Register
  | "auth.register.title"
  | "auth.register.subtitle"
  | "auth.register.firstName"
  | "auth.register.lastName"
  | "auth.register.dateOfBirth"
  | "auth.register.gender"
  | "auth.register.height"
  | "auth.register.weight"
  | "auth.register.targetWeight"
  | "auth.register.activityLevel"
  | "auth.register.passwordHint"
  | "auth.register.consent"
  | "auth.register.errors.required"
  | "auth.register.errors.ageRestriction"
  | "auth.register.errors.passwordPolicy"
  | "auth.register.success"
  // Country Selection
  | "country.select"
  | "country.selectTitle"
  | "country.selectDescription"
  | "country.detected"
  | "country.change"
  | "country.save"
  | "country.required"
  // Profile & Community
  | "profile.country"
  | "community.country"
  | "community.from"
  // Dashboard
  | "dashboard.welcome"
  | "dashboard.healthPanel"
  | "dashboard.currentWeight"
  | "dashboard.targetWeight"
  | "dashboard.dailyGoal"
  | "dashboard.todayCalories"
  | "dashboard.burnedCalories"
  | "dashboard.bmr"
  | "dashboard.bmrDesc"
  | "dashboard.tdee"
  | "dashboard.dailyBalance"
  | "dashboard.bowelHealth"
  | "dashboard.toGoal"
  | "dashboard.toGain"
  | "dashboard.toLose"
  | "dashboard.mealsLogged"
  | "dashboard.workoutsLogged"
  | "dashboard.avgSteps"
  | "dashboard.calorieDeficit"
  | "dashboard.calorieSurplus"
  | "dashboard.balanced"
  | "dashboard.bowelStatus.unknown"
  | "dashboard.bowelStatus.veryHealthy"
  | "dashboard.bowelStatus.healthy"
  | "dashboard.bowelStatus.normal"
  | "dashboard.bowelStatus.warning"
  | "dashboard.bowelStatus.unhealthy"
  | "dashboard.bowelMessage.noData"
  | "dashboard.bowelMessage.perfect"
  | "dashboard.bowelMessage.normal"
  | "dashboard.bowelMessage.needsFiber"
  | "dashboard.bowelMessage.needsWater"
  | "dashboard.bowelMessage.risk"
  | "dashboard.bowelFrequency"
  | "dashboard.activityCalendar"
  | "dashboard.todayActivities"
  | "dashboard.todayMeals"
  | "dashboard.todayWorkouts"
  | "dashboard.add"
  | "dashboard.mealTypes.breakfast"
  | "dashboard.mealTypes.lunch"
  | "dashboard.mealTypes.dinner"
  | "dashboard.mealTypes.snack"
  | "dashboard.mealTypes.meal"
  | "dashboard.food"
  | "dashboard.noMeals"
  | "dashboard.noWorkouts"
  | "dashboard.track"
  // Community
  | "community.sort.likes"
  | "community.sort.newest"
  | "community.sort.implemented"
  | "community.heroes"
  | "community.mvps"
  | "community.inspirations"
  | "community.waiting"
  | "community.noSuggestions"
  | "community.deleteFailed"
  | "community.deleteConfirm"
  | "community.deleteReasonModeration"
  | "community.founderLiked"
  | "community.adminLiked"
  // Community Homepage
  | "community.homepage.title"
  | "community.homepage.subtitle"
  | "community.homepage.loading"
  | "community.homepage.goToCommunity"
  | "community.homepage.topRequests"
  | "community.homepage.noRequests"
  | "community.homepage.likes"
  | "community.homepage.implemented"
  | "community.homepage.leaderboardTitle"
  | "community.homepage.noLeaders"
  | "community.homepage.suggestion"
  | "community.homepage.suggestions"
  | "community.founderLikedBody"
  | "community.adminLikedBody"
  | "community.leaderboard.title"
  | "community.leaderboard.subtitle"
  | "community.leaderboard.description"
  // Profile
  | "profile.title"
  | "profile.yourInfo"
  | "profile.userInfo"
  | "profile.backToDashboard"
  | "profile.backToCommunity"
  | "profile.hidden"
  | "profile.hiddenDesc"
  | "profile.hiddenUser"
  // Profile Edit
  | "profile.edit.title"
  | "profile.edit.subtitle"
  | "profile.edit.fieldLabels.name"
  | "profile.edit.fieldLabels.height"
  | "profile.edit.fieldLabels.weight"
  | "profile.edit.fieldLabels.age"
  | "profile.edit.fieldLabels.gender"
  | "profile.edit.fieldLabels.targetWeight"
  | "profile.edit.fieldLabels.dailySteps"
  | "profile.edit.fieldLabels.showPublicProfile"
  | "profile.edit.fieldLabels.showCommunityStats"
  | "profile.edit.genderOptions.male"
  | "profile.edit.genderOptions.female"
  | "profile.edit.genderOptions.other"
  | "profile.edit.genderOptions.notSelected"
  | "profile.edit.status.open"
  | "profile.edit.status.closed"
  | "profile.edit.privacy.title"
  | "profile.edit.privacy.publicDesc"
  | "profile.edit.privacy.statsDesc"
  | "profile.edit.changes.title"
  | "profile.edit.noChanges"
  | "profile.edit.saving"
  | "profile.edit.save"
  | "profile.edit.reset"
  | "profile.edit.success"
  | "profile.edit.error"
  | "profile.edit.errorUpdate"
  | "profile.edit.note"
  // Errors
  | "errors.notFound.title"
  | "errors.notFound.message"
  | "errors.notFound.backHome"
  // Terms
  | "terms.title"
  | "terms.subtitle"
  | "terms.description"
  | "terms.clauses.service.title"
  | "terms.clauses.service.content"
  | "terms.clauses.user.title"
  | "terms.clauses.user.content"
  | "terms.clauses.security.title"
  | "terms.clauses.security.content"
  | "terms.clauses.thirdParty.title"
  | "terms.clauses.thirdParty.content"
  | "terms.clauses.changes.title"
  | "terms.clauses.changes.content"
  | "terms.contact.title"
  | "terms.contact.content"
  | "terms.contact.email"
  | "terms.contact.privacyLink"
  | "terms.contact.emailAction"
  | "terms.contact.privacyAction"
  // Privacy
  | "privacy.title"
  | "privacy.subtitle"
  | "privacy.description"
  | "privacy.sections.data.title"
  | "privacy.sections.data.items.0"
  | "privacy.sections.data.items.1"
  | "privacy.sections.data.items.2"
  | "privacy.sections.usage.title"
  | "privacy.sections.usage.items.0"
  | "privacy.sections.usage.items.1"
  | "privacy.sections.usage.items.2"
  | "privacy.sections.storage.title"
  | "privacy.sections.storage.items.0"
  | "privacy.sections.storage.items.1"
  | "privacy.sections.storage.items.2"
  | "privacy.rights.title"
  | "privacy.rights.content"
  | "privacy.rights.email"
  | "privacy.rights.responseTime"
  | "privacy.rights.termsLink"
  | "privacy.rights.moreInfo"
  | "privacy.rights.moreInfoAction";

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
    "common.calendar": "Takvim",
    "common.today": "Bugün",
    "common.locale": "tr-TR",
    "common.user": "Kullanıcı",
    "common.founder": "Kurucu",
    "common.admin": "Yönetici",
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
    "reviews.loading": "Yorumlar yükleniyor...",
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
    "auth.login.welcome": "Tekrar Hoş Geldin",
    "auth.login.subtitle": "Hesabına erişmek için giriş yap veya Google ile devam et.",
    "auth.login.emailLabel": "EMAİL",
    "auth.login.passwordLabel": "ŞİFRE",
    "auth.login.submit": "Giriş Yap",
    "auth.login.googleContinue": "Google ile devam et",
    "auth.login.googleNote": "Google ile girişte doğrulama gerekmez.",
    "auth.login.noAccount": "Hesabın yok mu?",
    "auth.login.forgotPassword": "Şifremi Unuttum",
    "auth.login.errors.invalidCredentials": "Email veya şifre hatalı. Lütfen kontrol edip tekrar deneyin.",
    "auth.login.errors.emailNotConfirmed": "E-posta adresin doğrulanmamış görünüyor.",
    "auth.login.errors.sessionError": "Oturum oluşturulamadı. Lütfen tekrar deneyin.",
    "auth.login.errors.googleError": "Google ile giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.",
    "auth.login.info.resendVerification": "Doğrulama mailini teslim almadıysan aşağıdan yeniden gönderebilirsin.",
    "auth.register.title": "Hesap Oluştur",
    "auth.register.subtitle": "NapiFit'e katıl ve sağlıklı yaşam yolculuğuna başla.",
    "auth.register.firstName": "Ad",
    "auth.register.lastName": "Soyad",
    "auth.register.dateOfBirth": "Doğum Tarihi",
    "auth.register.gender": "Cinsiyet",
    "auth.register.height": "Boy (cm)",
    "auth.register.weight": "Kilo (kg)",
    "auth.register.targetWeight": "Hedef Kilo (kg)",
    "auth.register.activityLevel": "Aktivite Seviyesi",
    "auth.register.passwordHint": "En az 8 karakter, içinde büyük harf ve rakam bulunmalı.",
    "auth.register.consent": "Kullanım şartlarını ve gizlilik politikasını kabul ediyorum.",
    "auth.register.errors.required": "zorunludur",
    "auth.register.errors.ageRestriction": "18 yaşından küçükler kayıt olamaz",
    "auth.register.errors.passwordPolicy": "Şifren 8+ karakter olmalı ve en az bir büyük harf ile rakam içermeli.",
    "auth.register.success": "Kayıt başarılı! E-posta adresini kontrol et.",
    "country.select": "Ülke Seç",
    "country.selectTitle": "Ülkenizi Seçin",
    "country.selectDescription": "Hangi ülkeden bağlanıyorsunuz? Bu bilgi toplulukta ve profilde görünecek.",
    "country.detected": "Tespit Edilen",
    "country.change": "Değiştir",
    "country.save": "Kaydet",
    "country.required": "Ülke seçimi zorunludur",
    "profile.country": "Ülke",
    "community.country": "Ülke",
    "community.from": "den",
    "dashboard.welcome": "Hoş geldin",
    "dashboard.healthPanel": "Sağlık Kontrol Paneli",
    "dashboard.currentWeight": "Mevcut Kilo",
    "dashboard.targetWeight": "Hedef Kilo",
    "dashboard.dailyGoal": "Günlük Hedef",
    "dashboard.todayCalories": "Bugünkü Kalori",
    "dashboard.burnedCalories": "Yakılan Kalori",
    "dashboard.bmr": "BMR (Bazal Metabolizma)",
    "dashboard.bmrDesc": "Dinlenirken yaktığın kalori",
    "dashboard.tdee": "TDEE: {tdee} kcal (aktivite ile)",
    "dashboard.dailyBalance": "Günlük Kalori Dengesi",
    "dashboard.bowelHealth": "Bağırsak Sağlığı",
    "dashboard.toGoal": "kg hedefe",
    "dashboard.toGain": "kg alınmalı",
    "dashboard.toLose": "kg verilmeli",
    "dashboard.mealsLogged": "öğün kaydedildi",
    "dashboard.workoutsLogged": "egzersiz kaydedildi",
    "dashboard.avgSteps": "Ortalama adım sayısı",
    "dashboard.calorieDeficit": "Kalori açığı var (kilo vermeye uygun)",
    "dashboard.calorieSurplus": "Kalori fazlası var (kilo almak için)",
    "dashboard.balanced": "Dengeli",
    "dashboard.bowelStatus.unknown": "Bilinmiyor",
    "dashboard.bowelStatus.veryHealthy": "Çok Sağlıklı",
    "dashboard.bowelStatus.healthy": "Sağlıklı",
    "dashboard.bowelStatus.normal": "Normal",
    "dashboard.bowelStatus.warning": "Dikkat",
    "dashboard.bowelStatus.unhealthy": "Sağlıksız",
    "dashboard.bowelMessage.noData": "Henüz veri yok",
    "dashboard.bowelMessage.perfect": "Mükemmel! Her gün tuvalete çıkıyorsun.",
    "dashboard.bowelMessage.normal": "Normal düzenli bağırsak hareketi.",
    "dashboard.bowelMessage.needsFiber": "Normal aralıkta, ancak daha fazla lif almayı dene.",
    "dashboard.bowelMessage.needsWater": "Biraz yavaşlamış, daha fazla su ve lif tüket.",
    "dashboard.bowelMessage.risk": "Kabızlık riski var. Doktora danış ve beslenmeyi gözden geçir.",
    "dashboard.bowelFrequency": "günde bir tuvalet",
    "dashboard.activityCalendar": "Aktivite Takvimi",
    "dashboard.todayActivities": "Bugünkü Aktiviteler",
    "dashboard.todayMeals": "Bugünkü Öğünler",
    "dashboard.todayWorkouts": "Bugünkü Egzersizler",
    "dashboard.add": "+ Ekle",
    "dashboard.mealTypes.breakfast": "🌅 Kahvaltı",
    "dashboard.mealTypes.lunch": "☀️ Öğle",
    "dashboard.mealTypes.dinner": "🌙 Akşam",
    "dashboard.mealTypes.snack": "🍿 Atıştırmalık",
    "dashboard.mealTypes.meal": "🍽️ Öğün",
    "dashboard.food": "Yemek",
    "dashboard.noMeals": "Henüz öğün kaydedilmedi",
    "dashboard.noWorkouts": "Henüz egzersiz kaydedilmedi",
    "dashboard.track": "+ Takip Et →",
    "community.sort.likes": "En Beğenilenler",
    "community.sort.newest": "En Yeni",
    "community.sort.implemented": "Uygulananlar",
    "community.heroes": "Öneri Kahramanları 🛠️",
    "community.mvps": "Topluluk MVP'leri 🌟",
    "community.inspirations": "İlham Verenler ✨",
    "community.waiting": "İlk kahramanı bekliyoruz 💫",
    "community.noSuggestions": "Henüz uygulanmış öneri yok. İlk öneriyi gönderen sen ol!",
    "community.deleteFailed": "Silme işlemi başarısız",
    "community.deleteConfirm": "Bu öneriyi silmek istediğinize emin misiniz?",
    "community.deleteReasonModeration": "Topluluk kurallarına aykırı içerik",
    "community.founderLiked": "👑 Kurucu Önerinizi Beğendi!",
    "community.adminLiked": "⭐ Admin Önerinizi Beğendi!",
    "community.founderLikedBody": "🎉 Kurucu önerinizi beğendi! Harika bir fikir, tebrikler!",
    "community.adminLikedBody": "⭐ Admin önerinizi beğendi! Güzel bir öneri, tebrikler!",
    "community.homepage.title": "Topluluk",
    "community.homepage.subtitle": "Özellik önerileri ve topluluk liderleri",
    "community.homepage.loading": "Topluluk verileri yükleniyor...",
    "community.homepage.goToCommunity": "Topluluğa Git →",
    "community.homepage.topRequests": "En Beğenilen Öneriler",
    "community.homepage.noRequests": "Henüz öneri yok",
    "community.homepage.likes": "beğeni",
    "community.homepage.implemented": "✓ Uygulandı",
    "community.homepage.leaderboardTitle": "Yılın Adamı 👑",
    "community.homepage.noLeaders": "Henüz lider yok",
    "community.homepage.suggestion": "öneri",
    "community.homepage.suggestions": "öneriler",
    "community.leaderboard.title": "Topluluk Gururu",
    "community.leaderboard.subtitle": "Uygulanan öneri sayısına göre haftalık motivasyon tablosu",
    "community.leaderboard.description": "öneri uygulandı",
    "profile.title": "Profil",
    "profile.yourInfo": "Hesap bilgileriniz ve istatistikleriniz",
    "profile.userInfo": "profil bilgileri",
    "profile.backToDashboard": "Kontrol Paneli",
    "profile.backToCommunity": "Topluluğa Dön",
    "profile.hidden": "Bu profil gizli",
    "profile.hiddenDesc": "Bu kullanıcı profilini gizlemiştir",
    "profile.hiddenUser": "Gizli Kullanıcı",
    "profile.edit.title": "Profilini Güncelle",
    "profile.edit.subtitle": "Kişisel Bilgiler",
    "profile.edit.fieldLabels.name": "Ad soyad",
    "profile.edit.fieldLabels.height": "Boy",
    "profile.edit.fieldLabels.weight": "Kilo",
    "profile.edit.fieldLabels.age": "Yaş",
    "profile.edit.fieldLabels.gender": "Cinsiyet",
    "profile.edit.fieldLabels.targetWeight": "Hedef kilo",
    "profile.edit.fieldLabels.dailySteps": "Günlük adım",
    "profile.edit.fieldLabels.showPublicProfile": "Herkese açık profil",
    "profile.edit.fieldLabels.showCommunityStats": "Topluluk istatistikleri",
    "profile.edit.genderOptions.male": "Erkek",
    "profile.edit.genderOptions.female": "Kadın",
    "profile.edit.genderOptions.other": "Diğer",
    "profile.edit.genderOptions.notSelected": "Seçilmedi",
    "profile.edit.status.open": "Açık",
    "profile.edit.status.closed": "Kapalı",
    "profile.edit.privacy.title": "Gizlilik Ayarları",
    "profile.edit.privacy.publicDesc": "Profiliniz ve bilgileriniz toplulukta görünür olur",
    "profile.edit.privacy.statsDesc": "Toplulukta öneri sayınız ve liderlik bilgileriniz görünür",
    "profile.edit.changes.title": "Güncellenecek alanlar",
    "profile.edit.noChanges": "Değişiklik bulunmuyor.",
    "profile.edit.saving": "Kaydediliyor...",
    "profile.edit.save": "Değişiklikleri Kaydet",
    "profile.edit.reset": "Sıfırla",
    "profile.edit.success": "Profil bilgilerin güncellendi.",
    "profile.edit.error": "Profil güncellenemedi.",
    "profile.edit.errorUpdate": "Profil güncellenirken hata oluştu.",
    "profile.edit.note": "Güncellemeler Supabase üzerinde güvenli olarak saklanır. Sağlık verilerini paylaşmadan önce kişisel sınırlarınızı göz önünde bulundurun.",
    "errors.notFound.title": "404",
    "errors.notFound.message": "Aradığınız sayfa bulunamadı.",
    "errors.notFound.backHome": "Ana Sayfaya Dön",
    "terms.title": "Kullanım Koşulları",
    "terms.subtitle": "Kullanım Şartları",
    "terms.description": "Bu doküman, NapiFit servislerini kullanırken uyulması gereken temel kuralları ve sorumlulukları belirtir. Platformu kullanmaya devam ederek bu şartları kabul etmiş olursunuz.",
    "terms.clauses.service.title": "Hizmet Tanımı",
    "terms.clauses.service.content": "NapiFit; sağlık metriklerini kaydetmenizi, Supabase üzerinde saklamanızı ve Vercel üzerinden sunulan web/mobil uygulamalarımızdan erişmenizi sağlar.",
    "terms.clauses.user.title": "Kullanıcı Yükümlülükleri",
    "terms.clauses.user.content": "Hesap bilgilerinizin gizliliğinden siz sorumlusunuz. Yanlış veya saldırgan içerik göndermek, diğer kullanıcıların deneyimini bozacak davranışlarda bulunmak veya RLS politikalarını aşmaya çalışmak yasaktır.",
    "terms.clauses.security.title": "Veri Güvenliği",
    "terms.clauses.security.content": "Supabase ve Vercel altyapılarıyla tüm veriler TLS üzerinden şifrelenir. Sistemler düzenli olarak güncellenir; ancak internet tabanlı hiçbir platform %100 güvenlik garantisi veremez.",
    "terms.clauses.thirdParty.title": "Üçüncü Taraf Bağlantılar",
    "terms.clauses.thirdParty.content": "Google OAuth veya diğer sağlayıcılarla giriş yaptığınızda, ilgili hizmetlerin politikaları da geçerli olur. Giriş ekranında sunulan bilgileri inceleyerek ilerleyin.",
    "terms.clauses.changes.title": "Değişiklikler",
    "terms.clauses.changes.content": "Bu şartlar zaman zaman güncellenebilir. Güncel versiyon her zaman bu sayfada yayınlanır. Kritik değişiklikler e-posta ile paylaşılır.",
    "terms.contact.title": "İletişim",
    "terms.contact.content": "Herhangi bir soru veya geribildirim için",
    "terms.contact.email": "legal@napibase.com",
    "terms.contact.privacyLink": "Gizlilik Politikası",
    "terms.contact.emailAction": "adresine e-posta gönderebilirsiniz. Gizlilikle ilgili sorular için",
    "terms.contact.privacyAction": "sayfasını inceleyin.",
    "privacy.title": "Gizlilik İlkesi",
    "privacy.subtitle": "Gizlilik Politikası",
    "privacy.description": "NapiFit olarak kişisel verilerinizi yalnızca ürün deneyimi sunmak ve iyileştirmek amacıyla işleriz. Aşağıdaki başlıklar verilerinizi nasıl topladığımızı, sakladığımızı ve koruduğumuzu açıklar.",
    "privacy.sections.data.title": "Topladığımız Veriler",
    "privacy.sections.data.items.0": "Ad, soyad, e-posta adresi ve Supabase üzerinden saklanan profil bilgileriniz.",
    "privacy.sections.data.items.1": "Girdiğiniz sağlık metrikleri (boy, kilo, günlük adım, hedefler).",
    "privacy.sections.data.items.2": "Google ile giriş yaptığınızda Google'ın paylaştığı temel profil bilgileri.",
    "privacy.sections.usage.title": "Verilerin Kullanım Amacı",
    "privacy.sections.usage.items.0": "Size kişiselleştirilmiş öneriler sunmak ve sağlık panelini oluşturmak.",
    "privacy.sections.usage.items.1": "Destek talebi veya bildirimler için sizinle iletişime geçmek.",
    "privacy.sections.usage.items.2": "Anonimleştirilmiş istatistikler üreterek ürün geliştirme kararları almak.",
    "privacy.sections.storage.title": "Saklama Süresi ve Güvenlik",
    "privacy.sections.storage.items.0": "Veriler Supabase üzerinde saklanır ve istemci-sunucu arasında TLS ile şifrelenir.",
    "privacy.sections.storage.items.1": "Hesabınızı silmeniz halinde tüm profil kayıtları 30 gün içinde kalıcı olarak temizlenir.",
    "privacy.sections.storage.items.2": "Yalnızca yetkili ekip üyeleri ve sistemler bu verilere erişebilir.",
    "privacy.rights.title": "Haklarınız",
    "privacy.rights.content": "Verilerinize erişme, düzeltme veya silme talepleri için",
    "privacy.rights.email": "support@napibase.com",
    "privacy.rights.responseTime": "Talepler 15 gün içinde yanıtlanır.",
    "privacy.rights.termsLink": "Kullanım Şartları",
    "privacy.rights.moreInfo": "Daha fazla bilgi için",
    "privacy.rights.moreInfoAction": "sayfasına göz atabilirsiniz.",
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
    "common.calendar": "Calendar",
    "common.today": "Today",
    "common.locale": "en-US",
    "common.user": "User",
    "common.founder": "Founder",
    "common.admin": "Admin",
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
    "reviews.loading": "Loading reviews...",
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
    "auth.login.welcome": "Welcome Back",
    "auth.login.subtitle": "Sign in to access your account or continue with Google.",
    "auth.login.emailLabel": "EMAIL",
    "auth.login.passwordLabel": "PASSWORD",
    "auth.login.submit": "Sign In",
    "auth.login.googleContinue": "Continue with Google",
    "auth.login.googleNote": "No email verification required with Google sign-in.",
    "auth.login.noAccount": "Don't have an account?",
    "auth.login.forgotPassword": "Forgot Password",
    "auth.login.errors.invalidCredentials": "Invalid email or password. Please check and try again.",
    "auth.login.errors.emailNotConfirmed": "Your email address appears to be unverified.",
    "auth.login.errors.sessionError": "Could not create session. Please try again.",
    "auth.login.errors.googleError": "An error occurred while signing in with Google. Please try again.",
    "auth.login.info.resendVerification": "If you didn't receive the verification email, you can resend it below.",
    "auth.register.title": "Create Account",
    "auth.register.subtitle": "Join NapiFit and start your healthy living journey.",
    "auth.register.firstName": "First Name",
    "auth.register.lastName": "Last Name",
    "auth.register.dateOfBirth": "Date of Birth",
    "auth.register.gender": "Gender",
    "auth.register.height": "Height (cm)",
    "auth.register.weight": "Weight (kg)",
    "auth.register.targetWeight": "Target Weight (kg)",
    "auth.register.activityLevel": "Activity Level",
    "auth.register.passwordHint": "At least 8 characters, must contain uppercase letter and number.",
    "auth.register.consent": "I accept the terms of service and privacy policy.",
    "auth.register.errors.required": "is required",
    "auth.register.errors.ageRestriction": "Users under 18 cannot register",
    "auth.register.errors.passwordPolicy": "Password must be 8+ characters and contain at least one uppercase letter and number.",
    "auth.register.success": "Registration successful! Please check your email.",
    "country.select": "Select Country",
    "country.selectTitle": "Select Your Country",
    "country.selectDescription": "Which country are you connecting from? This will be shown in community and profile.",
    "country.detected": "Detected",
    "country.change": "Change",
    "country.save": "Save",
    "country.required": "Country selection is required",
    "profile.country": "Country",
    "community.country": "Country",
    "community.from": "from",
    "dashboard.welcome": "Welcome",
    "dashboard.healthPanel": "Health Control Panel",
    "dashboard.currentWeight": "Current Weight",
    "dashboard.targetWeight": "Target Weight",
    "dashboard.dailyGoal": "Daily Goal",
    "dashboard.todayCalories": "Today's Calories",
    "dashboard.burnedCalories": "Burned Calories",
    "dashboard.bmr": "BMR (Basal Metabolism)",
    "dashboard.bmrDesc": "Calories burned at rest",
    "dashboard.tdee": "TDEE: {tdee} kcal (with activity)",
    "dashboard.dailyBalance": "Daily Calorie Balance",
    "dashboard.bowelHealth": "Bowel Health",
    "dashboard.toGoal": "kg to goal",
    "dashboard.toGain": "kg to gain",
    "dashboard.toLose": "kg to lose",
    "dashboard.mealsLogged": "meals logged",
    "dashboard.workoutsLogged": "workouts logged",
    "dashboard.avgSteps": "Average step count",
    "dashboard.calorieDeficit": "Calorie deficit (suitable for weight loss)",
    "dashboard.calorieSurplus": "Calorie surplus (for weight gain)",
    "dashboard.balanced": "Balanced",
    "dashboard.bowelStatus.unknown": "Unknown",
    "dashboard.bowelStatus.veryHealthy": "Very Healthy",
    "dashboard.bowelStatus.healthy": "Healthy",
    "dashboard.bowelStatus.normal": "Normal",
    "dashboard.bowelStatus.warning": "Warning",
    "dashboard.bowelStatus.unhealthy": "Unhealthy",
    "dashboard.bowelMessage.noData": "No data yet",
    "dashboard.bowelMessage.perfect": "Perfect! You go to the bathroom every day.",
    "dashboard.bowelMessage.normal": "Normal regular bowel movement.",
    "dashboard.bowelMessage.needsFiber": "Within normal range, but try to get more fiber.",
    "dashboard.bowelMessage.needsWater": "A bit slow, consume more water and fiber.",
    "dashboard.bowelMessage.risk": "Risk of constipation. Consult a doctor and review your diet.",
    "dashboard.bowelFrequency": "times per day",
    "dashboard.activityCalendar": "Activity Calendar",
    "dashboard.todayActivities": "Today's Activities",
    "dashboard.todayMeals": "Today's Meals",
    "dashboard.todayWorkouts": "Today's Workouts",
    "dashboard.add": "+ Add",
    "dashboard.mealTypes.breakfast": "🌅 Breakfast",
    "dashboard.mealTypes.lunch": "☀️ Lunch",
    "dashboard.mealTypes.dinner": "🌙 Dinner",
    "dashboard.mealTypes.snack": "🍿 Snack",
    "dashboard.mealTypes.meal": "🍽️ Meal",
    "dashboard.food": "Food",
    "dashboard.noMeals": "No meals logged yet",
    "dashboard.noWorkouts": "No workouts logged yet",
    "dashboard.track": "+ Track →",
    "community.sort.likes": "Most Liked",
    "community.sort.newest": "Newest",
    "community.sort.implemented": "Implemented",
    "community.heroes": "Feature Heroes 🛠️",
    "community.mvps": "Community MVPs 🌟",
    "community.inspirations": "Inspirations ✨",
    "community.waiting": "Waiting for the first hero 💫",
    "community.noSuggestions": "No implemented suggestions yet. Be the first to send one!",
    "community.deleteFailed": "Delete operation failed",
    "community.deleteConfirm": "Are you sure you want to delete this suggestion?",
    "community.deleteReasonModeration": "Content violates community guidelines",
    "community.founderLiked": "👑 Founder Liked Your Suggestion!",
    "community.adminLiked": "⭐ Admin Liked Your Suggestion!",
    "community.founderLikedBody": "🎉 Founder liked your suggestion! Great idea, congratulations!",
    "community.adminLikedBody": "⭐ Admin liked your suggestion! Nice suggestion, congratulations!",
    "community.homepage.title": "Community",
    "community.homepage.subtitle": "Feature suggestions and community leaders",
    "community.homepage.loading": "Loading community data...",
    "community.homepage.goToCommunity": "Go to Community →",
    "community.homepage.topRequests": "Most Liked Suggestions",
    "community.homepage.noRequests": "No suggestions yet",
    "community.homepage.likes": "likes",
    "community.homepage.implemented": "✓ Implemented",
    "community.homepage.leaderboardTitle": "Top Contributors 👑",
    "community.homepage.noLeaders": "No leaders yet",
    "community.homepage.suggestion": "suggestion",
    "community.homepage.suggestions": "suggestions",
    "community.leaderboard.title": "Community Pride",
    "community.leaderboard.subtitle": "Weekly motivation table based on number of implemented suggestions",
    "community.leaderboard.description": "suggestions implemented",
    "profile.title": "Profile",
    "profile.yourInfo": "Your account information and statistics",
    "profile.userInfo": "profile information",
    "profile.backToDashboard": "Dashboard",
    "profile.backToCommunity": "Back to Community",
    "profile.hidden": "This profile is hidden",
    "profile.hiddenDesc": "This user has hidden their profile",
    "profile.hiddenUser": "Hidden User",
    "profile.edit.title": "Update Your Profile",
    "profile.edit.subtitle": "Personal Information",
    "profile.edit.fieldLabels.name": "Full Name",
    "profile.edit.fieldLabels.height": "Height",
    "profile.edit.fieldLabels.weight": "Weight",
    "profile.edit.fieldLabels.age": "Age",
    "profile.edit.fieldLabels.gender": "Gender",
    "profile.edit.fieldLabels.targetWeight": "Target Weight",
    "profile.edit.fieldLabels.dailySteps": "Daily Steps",
    "profile.edit.fieldLabels.showPublicProfile": "Public Profile",
    "profile.edit.fieldLabels.showCommunityStats": "Community Statistics",
    "profile.edit.genderOptions.male": "Male",
    "profile.edit.genderOptions.female": "Female",
    "profile.edit.genderOptions.other": "Other",
    "profile.edit.genderOptions.notSelected": "Not Selected",
    "profile.edit.status.open": "Open",
    "profile.edit.status.closed": "Closed",
    "profile.edit.privacy.title": "Privacy Settings",
    "profile.edit.privacy.publicDesc": "Your profile and information will be visible in the community",
    "profile.edit.privacy.statsDesc": "Your suggestion count and leadership information will be visible in the community",
    "profile.edit.changes.title": "Fields to Update",
    "profile.edit.noChanges": "No changes found.",
    "profile.edit.saving": "Saving...",
    "profile.edit.save": "Save Changes",
    "profile.edit.reset": "Reset",
    "profile.edit.success": "Your profile information has been updated.",
    "profile.edit.error": "Profile could not be updated.",
    "profile.edit.errorUpdate": "An error occurred while updating profile.",
    "profile.edit.note": "Updates are securely stored on Supabase. Please consider your personal boundaries before sharing health data.",
    "errors.notFound.title": "404",
    "errors.notFound.message": "The page you are looking for could not be found.",
    "errors.notFound.backHome": "Back to Home",
    "terms.title": "Terms of Use",
    "terms.subtitle": "Terms and Conditions",
    "terms.description": "This document outlines the basic rules and responsibilities that must be followed when using NapiFit services. By continuing to use the platform, you agree to these terms.",
    "terms.clauses.service.title": "Service Definition",
    "terms.clauses.service.content": "NapiFit allows you to record health metrics, store them on Supabase, and access them from our web/mobile applications served via Vercel.",
    "terms.clauses.user.title": "User Obligations",
    "terms.clauses.user.content": "You are responsible for the privacy of your account information. It is prohibited to send false or malicious content, engage in behavior that will disrupt other users' experience, or attempt to bypass RLS policies.",
    "terms.clauses.security.title": "Data Security",
    "terms.clauses.security.content": "All data is encrypted over TLS with Supabase and Vercel infrastructure. Systems are regularly updated; however, no internet-based platform can provide a 100% security guarantee.",
    "terms.clauses.thirdParty.title": "Third-Party Links",
    "terms.clauses.thirdParty.content": "When you sign in with Google OAuth or other providers, the policies of those services also apply. Please review the information provided on the sign-in screen.",
    "terms.clauses.changes.title": "Changes",
    "terms.clauses.changes.content": "These terms may be updated from time to time. The current version is always published on this page. Critical changes are shared via email.",
    "terms.contact.title": "Contact",
    "terms.contact.content": "For any questions or feedback, you can send an email to",
    "terms.contact.email": "legal@napibase.com",
    "terms.contact.privacyLink": "Privacy Policy",
    "terms.contact.emailAction": "you can send an email to",
    "terms.contact.privacyAction": "page.",
    "privacy.title": "Privacy Policy",
    "privacy.subtitle": "Privacy Policy",
    "privacy.description": "As NapiFit, we process your personal data only for the purpose of providing and improving the product experience. The following headings explain how we collect, store, and protect your data.",
    "privacy.sections.data.title": "Data We Collect",
    "privacy.sections.data.items.0": "Your name, surname, email address, and profile information stored on Supabase.",
    "privacy.sections.data.items.1": "Health metrics you enter (height, weight, daily steps, goals).",
    "privacy.sections.data.items.2": "Basic profile information shared by Google when you sign in with Google.",
    "privacy.sections.usage.title": "Purpose of Data Usage",
    "privacy.sections.usage.items.0": "To provide you with personalized recommendations and create the health panel.",
    "privacy.sections.usage.items.1": "To contact you for support requests or notifications.",
    "privacy.sections.usage.items.2": "To make product development decisions by generating anonymized statistics.",
    "privacy.sections.storage.title": "Storage Duration and Security",
    "privacy.sections.storage.items.0": "Data is stored on Supabase and encrypted between client and server via TLS.",
    "privacy.sections.storage.items.1": "If you delete your account, all profile records will be permanently deleted within 30 days.",
    "privacy.sections.storage.items.2": "Only authorized team members and systems can access this data.",
    "privacy.rights.title": "Your Rights",
    "privacy.rights.content": "To request access, correction, or deletion of your data, you can contact us at",
    "privacy.rights.email": "support@napibase.com",
    "privacy.rights.responseTime": "Requests are responded to within 15 days.",
    "privacy.rights.termsLink": "Terms and Conditions",
    "privacy.rights.moreInfo": "For more information, you can check the",
    "privacy.rights.moreInfoAction": "page.",
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
    "common.calendar": "Kalender",
    "common.today": "Heute",
    "common.locale": "de-DE",
    "common.user": "Benutzer",
    "common.founder": "Gründer",
    "common.admin": "Administrator",
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
    "reviews.loading": "Bewertungen werden geladen...",
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
    "auth.login.welcome": "Willkommen zurück",
    "auth.login.subtitle": "Melden Sie sich an, um auf Ihr Konto zuzugreifen, oder fahren Sie mit Google fort.",
    "auth.login.emailLabel": "E-MAIL",
    "auth.login.passwordLabel": "PASSWORT",
    "auth.login.submit": "Anmelden",
    "auth.login.googleContinue": "Mit Google fortfahren",
    "auth.login.googleNote": "Bei Google-Anmeldung ist keine E-Mail-Bestätigung erforderlich.",
    "auth.login.noAccount": "Haben Sie kein Konto?",
    "auth.login.forgotPassword": "Passwort vergessen",
    "auth.login.errors.invalidCredentials": "Ungültige E-Mail oder Passwort. Bitte überprüfen und erneut versuchen.",
    "auth.login.errors.emailNotConfirmed": "Ihre E-Mail-Adresse scheint nicht bestätigt zu sein.",
    "auth.login.errors.sessionError": "Sitzung konnte nicht erstellt werden. Bitte versuchen Sie es erneut.",
    "auth.login.errors.googleError": "Beim Anmelden mit Google ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
    "auth.login.info.resendVerification": "Wenn Sie die Bestätigungs-E-Mail nicht erhalten haben, können Sie sie unten erneut senden.",
    "auth.register.title": "Konto erstellen",
    "auth.register.subtitle": "Treten Sie NapiFit bei und beginnen Sie Ihre gesunde Lebensreise.",
    "auth.register.firstName": "Vorname",
    "auth.register.lastName": "Nachname",
    "auth.register.dateOfBirth": "Geburtsdatum",
    "auth.register.gender": "Geschlecht",
    "auth.register.height": "Größe (cm)",
    "auth.register.weight": "Gewicht (kg)",
    "auth.register.targetWeight": "Zielgewicht (kg)",
    "auth.register.activityLevel": "Aktivitätsniveau",
    "auth.register.passwordHint": "Mindestens 8 Zeichen, muss Großbuchstaben und Zahl enthalten.",
    "auth.register.consent": "Ich akzeptiere die Nutzungsbedingungen und die Datenschutzrichtlinie.",
    "auth.register.errors.required": "ist erforderlich",
    "auth.register.errors.ageRestriction": "Benutzer unter 18 können sich nicht registrieren",
    "auth.register.errors.passwordPolicy": "Passwort muss 8+ Zeichen lang sein und mindestens einen Großbuchstaben und eine Zahl enthalten.",
    "auth.register.success": "Registrierung erfolgreich! Bitte überprüfen Sie Ihre E-Mail.",
    "country.select": "Land auswählen",
    "country.selectTitle": "Wählen Sie Ihr Land",
    "country.selectDescription": "Aus welchem Land verbinden Sie sich? Dies wird in Community und Profil angezeigt.",
    "country.detected": "Erkannt",
    "country.change": "Ändern",
    "country.save": "Speichern",
    "country.required": "Länderauswahl ist erforderlich",
    "profile.country": "Land",
    "community.country": "Land",
    "community.from": "aus",
    "dashboard.welcome": "Willkommen",
    "dashboard.healthPanel": "Gesundheitskontrollpanel",
    "dashboard.currentWeight": "Aktuelles Gewicht",
    "dashboard.targetWeight": "Zielgewicht",
    "dashboard.dailyGoal": "Tagesziel",
    "dashboard.todayCalories": "Heutige Kalorien",
    "dashboard.burnedCalories": "Verbrannte Kalorien",
    "dashboard.bmr": "BMR (Grundumsatz)",
    "dashboard.bmrDesc": "Kalorien im Ruhezustand",
    "dashboard.tdee": "TDEE: {tdee} kcal (mit Aktivität)",
    "dashboard.dailyBalance": "Tägliches Kaloriengleichgewicht",
    "dashboard.bowelHealth": "Darmgesundheit",
    "dashboard.toGoal": "kg zum Ziel",
    "dashboard.toGain": "kg zunehmen",
    "dashboard.toLose": "kg abnehmen",
    "dashboard.mealsLogged": "Mahlzeiten protokolliert",
    "dashboard.workoutsLogged": "Workouts protokolliert",
    "dashboard.avgSteps": "Durchschnittliche Schrittzahl",
    "dashboard.calorieDeficit": "Kaloriendefizit (geeignet für Gewichtsverlust)",
    "dashboard.calorieSurplus": "Kalorienüberschuss (für Gewichtszunahme)",
    "dashboard.balanced": "Ausgewogen",
    "dashboard.bowelStatus.unknown": "Unbekannt",
    "dashboard.bowelStatus.veryHealthy": "Sehr gesund",
    "dashboard.bowelStatus.healthy": "Gesund",
    "dashboard.bowelStatus.normal": "Normal",
    "dashboard.bowelStatus.warning": "Warnung",
    "dashboard.bowelStatus.unhealthy": "Ungesund",
    "dashboard.bowelMessage.noData": "Noch keine Daten",
    "dashboard.bowelMessage.perfect": "Perfekt! Sie gehen jeden Tag auf die Toilette.",
    "dashboard.bowelMessage.normal": "Normale regelmäßige Darmbewegung.",
    "dashboard.bowelMessage.needsFiber": "Im normalen Bereich, aber versuchen Sie, mehr Ballaststoffe zu bekommen.",
    "dashboard.bowelMessage.needsWater": "Etwas langsam, konsumieren Sie mehr Wasser und Ballaststoffe.",
    "dashboard.bowelMessage.risk": "Verstopfungsrisiko. Konsultieren Sie einen Arzt und überprüfen Sie Ihre Ernährung.",
    "dashboard.bowelFrequency": "mal pro Tag",
    "dashboard.activityCalendar": "Aktivitätskalender",
    "dashboard.todayActivities": "Heutige Aktivitäten",
    "dashboard.todayMeals": "Heutige Mahlzeiten",
    "dashboard.todayWorkouts": "Heutige Workouts",
    "dashboard.add": "+ Hinzufügen",
    "dashboard.mealTypes.breakfast": "🌅 Frühstück",
    "dashboard.mealTypes.lunch": "☀️ Mittagessen",
    "dashboard.mealTypes.dinner": "🌙 Abendessen",
    "dashboard.mealTypes.snack": "🍿 Snack",
    "dashboard.mealTypes.meal": "🍽️ Mahlzeit",
    "dashboard.food": "Essen",
    "dashboard.noMeals": "Noch keine Mahlzeiten protokolliert",
    "dashboard.noWorkouts": "Noch keine Workouts protokolliert",
    "dashboard.track": "+ Verfolgen →",
    "community.sort.likes": "Meist gemocht",
    "community.sort.newest": "Neueste",
    "community.sort.implemented": "Implementiert",
    "community.heroes": "Feature-Helden 🛠️",
    "community.mvps": "Community-MVPs 🌟",
    "community.inspirations": "Inspirationen ✨",
    "community.waiting": "Warten auf den ersten Helden 💫",
    "community.noSuggestions": "Noch keine implementierten Vorschläge. Seien Sie der Erste, der einen sendet!",
    "community.deleteFailed": "Löschvorgang fehlgeschlagen",
    "community.deleteConfirm": "Sind Sie sicher, dass Sie diesen Vorschlag löschen möchten?",
    "community.deleteReasonModeration": "Inhalt verstößt gegen Community-Richtlinien",
    "community.founderLiked": "👑 Gründer hat Ihren Vorschlag gemocht!",
    "community.adminLiked": "⭐ Admin hat Ihren Vorschlag gemocht!",
    "community.founderLikedBody": "🎉 Gründer hat Ihren Vorschlag gemocht! Tolle Idee, Glückwunsch!",
    "community.adminLikedBody": "⭐ Admin hat Ihren Vorschlag gemocht! Schöner Vorschlag, Glückwunsch!",
    "community.homepage.title": "Community",
    "community.homepage.subtitle": "Funktionsvorschläge und Community-Führer",
    "community.homepage.loading": "Community-Daten werden geladen...",
    "community.homepage.goToCommunity": "Zur Community →",
    "community.homepage.topRequests": "Beliebteste Vorschläge",
    "community.homepage.noRequests": "Noch keine Vorschläge",
    "community.homepage.likes": "Likes",
    "community.homepage.implemented": "✓ Implementiert",
    "community.homepage.leaderboardTitle": "Top-Mitwirkende 👑",
    "community.homepage.noLeaders": "Noch keine Führer",
    "community.homepage.suggestion": "Vorschlag",
    "community.homepage.suggestions": "Vorschläge",
    "community.leaderboard.title": "Community-Stolz",
    "community.leaderboard.subtitle": "Wöchentliche Motivationstabelle basierend auf der Anzahl der implementierten Vorschläge",
    "community.leaderboard.description": "Vorschläge implementiert",
    "profile.title": "Profil",
    "profile.yourInfo": "Ihre Kontoinformationen und Statistiken",
    "profile.userInfo": "Profilinformationen",
    "profile.backToDashboard": "Dashboard",
    "profile.backToCommunity": "Zurück zur Community",
    "profile.hidden": "Dieses Profil ist versteckt",
    "profile.hiddenDesc": "Dieser Benutzer hat sein Profil versteckt",
    "profile.hiddenUser": "Versteckter Benutzer",
    "profile.edit.title": "Profil aktualisieren",
    "profile.edit.subtitle": "Persönliche Informationen",
    "profile.edit.fieldLabels.name": "Vollständiger Name",
    "profile.edit.fieldLabels.height": "Größe",
    "profile.edit.fieldLabels.weight": "Gewicht",
    "profile.edit.fieldLabels.age": "Alter",
    "profile.edit.fieldLabels.gender": "Geschlecht",
    "profile.edit.fieldLabels.targetWeight": "Zielgewicht",
    "profile.edit.fieldLabels.dailySteps": "Tägliche Schritte",
    "profile.edit.fieldLabels.showPublicProfile": "Öffentliches Profil",
    "profile.edit.fieldLabels.showCommunityStats": "Community-Statistiken",
    "profile.edit.genderOptions.male": "Männlich",
    "profile.edit.genderOptions.female": "Weiblich",
    "profile.edit.genderOptions.other": "Andere",
    "profile.edit.genderOptions.notSelected": "Nicht ausgewählt",
    "profile.edit.status.open": "Offen",
    "profile.edit.status.closed": "Geschlossen",
    "profile.edit.privacy.title": "Datenschutzeinstellungen",
    "profile.edit.privacy.publicDesc": "Ihr Profil und Ihre Informationen werden in der Community sichtbar sein",
    "profile.edit.privacy.statsDesc": "Ihre Vorschlagsanzahl und Führungsinformationen werden in der Community sichtbar sein",
    "profile.edit.changes.title": "Zu aktualisierende Felder",
    "profile.edit.noChanges": "Keine Änderungen gefunden.",
    "profile.edit.saving": "Wird gespeichert...",
    "profile.edit.save": "Änderungen speichern",
    "profile.edit.reset": "Zurücksetzen",
    "profile.edit.success": "Ihre Profilinformationen wurden aktualisiert.",
    "profile.edit.error": "Profil konnte nicht aktualisiert werden.",
    "profile.edit.errorUpdate": "Beim Aktualisieren des Profils ist ein Fehler aufgetreten.",
    "profile.edit.note": "Aktualisierungen werden sicher auf Supabase gespeichert. Bitte berücksichtigen Sie Ihre persönlichen Grenzen, bevor Sie Gesundheitsdaten teilen.",
    "errors.notFound.title": "404",
    "errors.notFound.message": "Die gesuchte Seite konnte nicht gefunden werden.",
    "errors.notFound.backHome": "Zur Startseite",
    "terms.title": "Nutzungsbedingungen",
    "terms.subtitle": "Allgemeine Geschäftsbedingungen",
    "terms.description": "Dieses Dokument beschreibt die grundlegenden Regeln und Verantwortlichkeiten, die bei der Nutzung der NapiFit-Dienste befolgt werden müssen. Durch die weitere Nutzung der Plattform stimmen Sie diesen Bedingungen zu.",
    "terms.clauses.service.title": "Dienstbeschreibung",
    "terms.clauses.service.content": "NapiFit ermöglicht es Ihnen, Gesundheitsmetriken zu erfassen, auf Supabase zu speichern und über unsere über Vercel bereitgestellten Web-/Mobilanwendungen darauf zuzugreifen.",
    "terms.clauses.user.title": "Benutzerpflichten",
    "terms.clauses.user.content": "Sie sind für die Privatsphäre Ihrer Kontoinformationen verantwortlich. Es ist verboten, falsche oder bösartige Inhalte zu senden, sich so zu verhalten, dass die Erfahrung anderer Benutzer gestört wird, oder zu versuchen, RLS-Richtlinien zu umgehen.",
    "terms.clauses.security.title": "Datensicherheit",
    "terms.clauses.security.content": "Alle Daten werden über TLS mit Supabase- und Vercel-Infrastruktur verschlüsselt. Systeme werden regelmäßig aktualisiert; jedoch kann keine internetbasierte Plattform eine 100%ige Sicherheitsgarantie bieten.",
    "terms.clauses.thirdParty.title": "Drittanbieter-Verbindungen",
    "terms.clauses.thirdParty.content": "Wenn Sie sich mit Google OAuth oder anderen Anbietern anmelden, gelten auch die Richtlinien dieser Dienste. Bitte überprüfen Sie die Informationen auf dem Anmeldebildschirm.",
    "terms.clauses.changes.title": "Änderungen",
    "terms.clauses.changes.content": "Diese Bedingungen können von Zeit zu Zeit aktualisiert werden. Die aktuelle Version wird immer auf dieser Seite veröffentlicht. Kritische Änderungen werden per E-Mail mitgeteilt.",
    "terms.contact.title": "Kontakt",
    "terms.contact.content": "Bei Fragen oder Feedback können Sie eine E-Mail an",
    "terms.contact.email": "legal@napibase.com",
    "terms.contact.privacyLink": "Datenschutzrichtlinie",
    "terms.contact.emailAction": "können Sie eine E-Mail an",
    "terms.contact.privacyAction": "Seite.",
    "privacy.title": "Datenschutzrichtlinie",
    "privacy.subtitle": "Datenschutzrichtlinie",
    "privacy.description": "Als NapiFit verarbeiten wir Ihre persönlichen Daten nur zum Zweck der Bereitstellung und Verbesserung des Produkterlebnisses. Die folgenden Überschriften erklären, wie wir Ihre Daten sammeln, speichern und schützen.",
    "privacy.sections.data.title": "Von uns gesammelte Daten",
    "privacy.sections.data.items.0": "Ihr Name, Nachname, E-Mail-Adresse und auf Supabase gespeicherte Profilinformationen.",
    "privacy.sections.data.items.1": "Von Ihnen eingegebene Gesundheitsmetriken (Größe, Gewicht, tägliche Schritte, Ziele).",
    "privacy.sections.data.items.2": "Grundlegende Profilinformationen, die von Google geteilt werden, wenn Sie sich mit Google anmelden.",
    "privacy.sections.usage.title": "Zweck der Datennutzung",
    "privacy.sections.usage.items.0": "Um Ihnen personalisierte Empfehlungen zu geben und das Gesundheitspanel zu erstellen.",
    "privacy.sections.usage.items.1": "Um Sie für Supportanfragen oder Benachrichtigungen zu kontaktieren.",
    "privacy.sections.usage.items.2": "Um Produktentwicklungsentscheidungen zu treffen, indem anonymisierte Statistiken generiert werden.",
    "privacy.sections.storage.title": "Speicherdauer und Sicherheit",
    "privacy.sections.storage.items.0": "Daten werden auf Supabase gespeichert und zwischen Client und Server über TLS verschlüsselt.",
    "privacy.sections.storage.items.1": "Wenn Sie Ihr Konto löschen, werden alle Profilaufzeichnungen innerhalb von 30 Tagen dauerhaft gelöscht.",
    "privacy.sections.storage.items.2": "Nur autorisierte Teammitglieder und Systeme können auf diese Daten zugreifen.",
    "privacy.rights.title": "Ihre Rechte",
    "privacy.rights.content": "Um Zugriff, Korrektur oder Löschung Ihrer Daten anzufordern, können Sie uns unter",
    "privacy.rights.email": "support@napibase.com",
    "privacy.rights.responseTime": "Anfragen werden innerhalb von 15 Tagen beantwortet.",
    "privacy.rights.termsLink": "Allgemeine Geschäftsbedingungen",
    "privacy.rights.moreInfo": "Für weitere Informationen können Sie die",
    "privacy.rights.moreInfoAction": "Seite besuchen.",
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
    "common.calendar": "Calendrier",
    "common.today": "Aujourd'hui",
    "common.locale": "fr-FR",
    "common.user": "Utilisateur",
    "common.founder": "Fondateur",
    "common.admin": "Administrateur",
    "reviews.title": "Avis des Utilisateurs",
    "reviews.subtitle": "Expériences de nos vrais utilisateurs",
    "reviews.realTime": "Temps Réel",
    "reviews.loading": "Chargement des avis...",
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
    "auth.login.welcome": "Bon retour",
    "auth.login.subtitle": "Connectez-vous pour accéder à votre compte ou continuez avec Google.",
    "auth.login.emailLabel": "E-MAIL",
    "auth.login.passwordLabel": "MOT DE PASSE",
    "auth.login.submit": "Se connecter",
    "auth.login.googleContinue": "Continuer avec Google",
    "auth.login.googleNote": "Aucune vérification d'e-mail requise avec la connexion Google.",
    "auth.login.noAccount": "Vous n'avez pas de compte?",
    "auth.login.forgotPassword": "Mot de passe oublié",
    "auth.login.errors.invalidCredentials": "E-mail ou mot de passe invalide. Veuillez vérifier et réessayer.",
    "auth.login.errors.emailNotConfirmed": "Votre adresse e-mail semble non vérifiée.",
    "auth.login.errors.sessionError": "Impossible de créer une session. Veuillez réessayer.",
    "auth.login.errors.googleError": "Une erreur s'est produite lors de la connexion avec Google. Veuillez réessayer.",
    "auth.login.info.resendVerification": "Si vous n'avez pas reçu l'e-mail de vérification, vous pouvez le renvoyer ci-dessous.",
    "auth.register.title": "Créer un compte",
    "auth.register.subtitle": "Rejoignez NapiFit et commencez votre parcours de vie saine.",
    "auth.register.firstName": "Prénom",
    "auth.register.lastName": "Nom de famille",
    "auth.register.dateOfBirth": "Date de naissance",
    "auth.register.gender": "Genre",
    "auth.register.height": "Taille (cm)",
    "auth.register.weight": "Poids (kg)",
    "auth.register.targetWeight": "Poids cible (kg)",
    "auth.register.activityLevel": "Niveau d'activité",
    "auth.register.passwordHint": "Au moins 8 caractères, doit contenir une lettre majuscule et un chiffre.",
    "auth.register.consent": "J'accepte les conditions d'utilisation et la politique de confidentialité.",
    "auth.register.errors.required": "est requis",
    "auth.register.errors.ageRestriction": "Les utilisateurs de moins de 18 ans ne peuvent pas s'inscrire",
    "auth.register.errors.passwordPolicy": "Le mot de passe doit contenir 8+ caractères et au moins une lettre majuscule et un chiffre.",
    "auth.register.success": "Inscription réussie! Veuillez vérifier votre e-mail.",
    "country.select": "Sélectionner le pays",
    "country.selectTitle": "Sélectionnez votre pays",
    "country.selectDescription": "De quel pays vous connectez-vous? Ceci sera affiché dans la communauté et le profil.",
    "country.detected": "Détecté",
    "country.change": "Changer",
    "country.save": "Enregistrer",
    "country.required": "La sélection du pays est requise",
    "profile.country": "Pays",
    "community.country": "Pays",
    "community.from": "de",
    "dashboard.welcome": "Bienvenue",
    "dashboard.healthPanel": "Panneau de contrôle de la santé",
    "dashboard.currentWeight": "Poids actuel",
    "dashboard.targetWeight": "Poids cible",
    "dashboard.dailyGoal": "Objectif quotidien",
    "dashboard.todayCalories": "Calories d'aujourd'hui",
    "dashboard.burnedCalories": "Calories brûlées",
    "dashboard.bmr": "BMR (Métabolisme de base)",
    "dashboard.bmrDesc": "Calories brûlées au repos",
    "dashboard.tdee": "TDEE: {tdee} kcal (avec activité)",
    "dashboard.dailyBalance": "Équilibre calorique quotidien",
    "dashboard.bowelHealth": "Santé intestinale",
    "dashboard.toGoal": "kg vers l'objectif",
    "dashboard.toGain": "kg à prendre",
    "dashboard.toLose": "kg à perdre",
    "dashboard.mealsLogged": "repas enregistrés",
    "dashboard.workoutsLogged": "entraînements enregistrés",
    "dashboard.avgSteps": "Nombre moyen de pas",
    "dashboard.calorieDeficit": "Déficit calorique (adapté à la perte de poids)",
    "dashboard.calorieSurplus": "Excédent calorique (pour la prise de poids)",
    "dashboard.balanced": "Équilibré",
    "dashboard.bowelStatus.unknown": "Inconnu",
    "dashboard.bowelStatus.veryHealthy": "Très sain",
    "dashboard.bowelStatus.healthy": "Sain",
    "dashboard.bowelStatus.normal": "Normal",
    "dashboard.bowelStatus.warning": "Attention",
    "dashboard.bowelStatus.unhealthy": "Malsain",
    "dashboard.bowelMessage.noData": "Pas encore de données",
    "dashboard.bowelMessage.perfect": "Parfait! Vous allez aux toilettes tous les jours.",
    "dashboard.bowelMessage.normal": "Mouvement intestinal régulier normal.",
    "dashboard.bowelMessage.needsFiber": "Dans la plage normale, mais essayez d'obtenir plus de fibres.",
    "dashboard.bowelMessage.needsWater": "Un peu lent, consommez plus d'eau et de fibres.",
    "dashboard.bowelMessage.risk": "Risque de constipation. Consultez un médecin et examinez votre alimentation.",
    "dashboard.bowelFrequency": "fois par jour",
    "dashboard.activityCalendar": "Calendrier d'activité",
    "dashboard.todayActivities": "Activités d'aujourd'hui",
    "dashboard.todayMeals": "Repas d'aujourd'hui",
    "dashboard.todayWorkouts": "Entraînements d'aujourd'hui",
    "dashboard.add": "+ Ajouter",
    "dashboard.mealTypes.breakfast": "🌅 Petit-déjeuner",
    "dashboard.mealTypes.lunch": "☀️ Déjeuner",
    "dashboard.mealTypes.dinner": "🌙 Dîner",
    "dashboard.mealTypes.snack": "🍿 Collation",
    "dashboard.mealTypes.meal": "🍽️ Repas",
    "dashboard.food": "Nourriture",
    "dashboard.noMeals": "Aucun repas enregistré",
    "dashboard.noWorkouts": "Aucun entraînement enregistré",
    "dashboard.track": "+ Suivre →",
    "community.sort.likes": "Les plus aimés",
    "community.sort.newest": "Plus récents",
    "community.sort.implemented": "Implémentés",
    "community.heroes": "Héros de fonctionnalités 🛠️",
    "community.mvps": "MVP de la communauté 🌟",
    "community.inspirations": "Inspirations ✨",
    "community.waiting": "En attente du premier héros 💫",
    "community.noSuggestions": "Aucune suggestion implémentée. Soyez le premier à en envoyer une!",
    "community.deleteFailed": "Échec de la suppression",
    "community.deleteConfirm": "Êtes-vous sûr de vouloir supprimer cette suggestion?",
    "community.deleteReasonModeration": "Le contenu viole les règles de la communauté",
    "community.founderLiked": "👑 Le fondateur a aimé votre suggestion!",
    "community.adminLiked": "⭐ L'admin a aimé votre suggestion!",
    "community.founderLikedBody": "🎉 Le fondateur a aimé votre suggestion! Excellente idée, félicitations!",
    "community.adminLikedBody": "⭐ L'admin a aimé votre suggestion! Belle suggestion, félicitations!",
    "community.homepage.title": "Communauté",
    "community.homepage.subtitle": "Suggestions de fonctionnalités et leaders de la communauté",
    "community.homepage.loading": "Chargement des données de la communauté...",
    "community.homepage.goToCommunity": "Aller à la communauté →",
    "community.homepage.topRequests": "Suggestions les plus aimées",
    "community.homepage.noRequests": "Aucune suggestion pour le moment",
    "community.homepage.likes": "j'aime",
    "community.homepage.implemented": "✓ Implémenté",
    "community.homepage.leaderboardTitle": "Meilleurs contributeurs 👑",
    "community.homepage.noLeaders": "Aucun leader pour le moment",
    "community.homepage.suggestion": "suggestion",
    "community.homepage.suggestions": "suggestions",
    "community.leaderboard.title": "Fierté de la communauté",
    "community.leaderboard.subtitle": "Tableau de motivation hebdomadaire basé sur le nombre de suggestions implémentées",
    "community.leaderboard.description": "suggestions implémentées",
    "profile.title": "Profil",
    "profile.yourInfo": "Vos informations de compte et statistiques",
    "profile.userInfo": "informations de profil",
    "profile.backToDashboard": "Tableau de bord",
    "profile.backToCommunity": "Retour à la communauté",
    "profile.hidden": "Ce profil est masqué",
    "profile.hiddenDesc": "Cet utilisateur a masqué son profil",
    "profile.hiddenUser": "Utilisateur masqué",
    "profile.edit.title": "Mettre à jour votre profil",
    "profile.edit.subtitle": "Informations personnelles",
    "profile.edit.fieldLabels.name": "Nom complet",
    "profile.edit.fieldLabels.height": "Taille",
    "profile.edit.fieldLabels.weight": "Poids",
    "profile.edit.fieldLabels.age": "Âge",
    "profile.edit.fieldLabels.gender": "Genre",
    "profile.edit.fieldLabels.targetWeight": "Poids cible",
    "profile.edit.fieldLabels.dailySteps": "Pas quotidiens",
    "profile.edit.fieldLabels.showPublicProfile": "Profil public",
    "profile.edit.fieldLabels.showCommunityStats": "Statistiques de la communauté",
    "profile.edit.genderOptions.male": "Homme",
    "profile.edit.genderOptions.female": "Femme",
    "profile.edit.genderOptions.other": "Autre",
    "profile.edit.genderOptions.notSelected": "Non sélectionné",
    "profile.edit.status.open": "Ouvert",
    "profile.edit.status.closed": "Fermé",
    "profile.edit.privacy.title": "Paramètres de confidentialité",
    "profile.edit.privacy.publicDesc": "Votre profil et vos informations seront visibles dans la communauté",
    "profile.edit.privacy.statsDesc": "Votre nombre de suggestions et vos informations de leadership seront visibles dans la communauté",
    "profile.edit.changes.title": "Champs à mettre à jour",
    "profile.edit.noChanges": "Aucun changement trouvé.",
    "profile.edit.saving": "Enregistrement...",
    "profile.edit.save": "Enregistrer les modifications",
    "profile.edit.reset": "Réinitialiser",
    "profile.edit.success": "Vos informations de profil ont été mises à jour.",
    "profile.edit.error": "Le profil n'a pas pu être mis à jour.",
    "profile.edit.errorUpdate": "Une erreur s'est produite lors de la mise à jour du profil.",
    "profile.edit.note": "Les mises à jour sont stockées en toute sécurité sur Supabase. Veuillez considérer vos limites personnelles avant de partager des données de santé.",
    "errors.notFound.title": "404",
    "errors.notFound.message": "La page que vous recherchez est introuvable.",
    "errors.notFound.backHome": "Retour à l'accueil",
    "terms.title": "Conditions d'utilisation",
    "terms.subtitle": "Conditions générales",
    "terms.description": "Ce document décrit les règles de base et les responsabilités qui doivent être respectées lors de l'utilisation des services NapiFit. En continuant à utiliser la plateforme, vous acceptez ces conditions.",
    "terms.clauses.service.title": "Définition du service",
    "terms.clauses.service.content": "NapiFit vous permet d'enregistrer des métriques de santé, de les stocker sur Supabase et d'y accéder depuis nos applications web/mobiles servies via Vercel.",
    "terms.clauses.user.title": "Obligations de l'utilisateur",
    "terms.clauses.user.content": "Vous êtes responsable de la confidentialité de vos informations de compte. Il est interdit d'envoyer du contenu faux ou malveillant, de se comporter de manière à perturber l'expérience d'autres utilisateurs ou de tenter de contourner les politiques RLS.",
    "terms.clauses.security.title": "Sécurité des données",
    "terms.clauses.security.content": "Toutes les données sont cryptées via TLS avec l'infrastructure Supabase et Vercel. Les systèmes sont régulièrement mis à jour; cependant, aucune plateforme basée sur Internet ne peut fournir une garantie de sécurité à 100%.",
    "terms.clauses.thirdParty.title": "Liens tiers",
    "terms.clauses.thirdParty.content": "Lorsque vous vous connectez avec Google OAuth ou d'autres fournisseurs, les politiques de ces services s'appliquent également. Veuillez examiner les informations fournies sur l'écran de connexion.",
    "terms.clauses.changes.title": "Modifications",
    "terms.clauses.changes.content": "Ces conditions peuvent être mises à jour de temps à autre. La version actuelle est toujours publiée sur cette page. Les modifications critiques sont partagées par e-mail.",
    "terms.contact.title": "Contact",
    "terms.contact.content": "Pour toute question ou commentaire, vous pouvez envoyer un e-mail à",
    "terms.contact.email": "legal@napibase.com",
    "terms.contact.privacyLink": "Politique de confidentialité",
    "terms.contact.emailAction": "vous pouvez envoyer un e-mail à",
    "terms.contact.privacyAction": "page.",
    "privacy.title": "Politique de confidentialité",
    "privacy.subtitle": "Politique de confidentialité",
    "privacy.description": "En tant que NapiFit, nous traitons vos données personnelles uniquement dans le but de fournir et d'améliorer l'expérience produit. Les titres suivants expliquent comment nous collectons, stockons et protégeons vos données.",
    "privacy.sections.data.title": "Données que nous collectons",
    "privacy.sections.data.items.0": "Votre nom, prénom, adresse e-mail et informations de profil stockées sur Supabase.",
    "privacy.sections.data.items.1": "Métriques de santé que vous entrez (taille, poids, pas quotidiens, objectifs).",
    "privacy.sections.data.items.2": "Informations de profil de base partagées par Google lorsque vous vous connectez avec Google.",
    "privacy.sections.usage.title": "Objectif de l'utilisation des données",
    "privacy.sections.usage.items.0": "Pour vous fournir des recommandations personnalisées et créer le panneau de santé.",
    "privacy.sections.usage.items.1": "Pour vous contacter pour des demandes de support ou des notifications.",
    "privacy.sections.usage.items.2": "Pour prendre des décisions de développement de produits en générant des statistiques anonymisées.",
    "privacy.sections.storage.title": "Durée de stockage et sécurité",
    "privacy.sections.storage.items.0": "Les données sont stockées sur Supabase et cryptées entre le client et le serveur via TLS.",
    "privacy.sections.storage.items.1": "Si vous supprimez votre compte, tous les enregistrements de profil seront définitivement supprimés dans les 30 jours.",
    "privacy.sections.storage.items.2": "Seuls les membres autorisés de l'équipe et les systèmes peuvent accéder à ces données.",
    "privacy.rights.title": "Vos droits",
    "privacy.rights.content": "Pour demander l'accès, la correction ou la suppression de vos données, vous pouvez nous contacter à",
    "privacy.rights.email": "support@napibase.com",
    "privacy.rights.responseTime": "Les demandes sont traitées dans les 15 jours.",
    "privacy.rights.termsLink": "Conditions générales",
    "privacy.rights.moreInfo": "Pour plus d'informations, vous pouvez consulter la",
    "privacy.rights.moreInfoAction": "page.",
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
