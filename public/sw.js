const CACHE_NAME = "napifit-sw-v3";
const WATER_REMINDER_TAG = "water-reminder";

// Kullanıcı ayarları (default değerler)
let reminderSettings = {
  enabled: false,
  intervalMinutes: 120,
  totalAmount: 0,
  dailyGoal: 2000,
};

// Son bildirim zamanı (duplicate önlemek için)
let lastNotificationTime = 0;

// Service Worker kurulumu
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker v3...");
  event.waitUntil(
    Promise.all([
      self.skipWaiting(),
      // Cache'i temizle
      caches.delete(CACHE_NAME).catch(() => {}),
    ])
  );
});

// Service Worker aktivasyonu
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker v3...");
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Eski bildirimleri temizle
      self.registration.getNotifications({ tag: WATER_REMINDER_TAG }).then((notifications) => {
        notifications.forEach((notification) => notification.close());
      }),
      // Eski cache'leri temizle
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith("napifit-sw-") && name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      }),
    ])
  );
  
  // Aktif olduktan sonra bildirim kontrolünü başlat
  if (reminderSettings.enabled) {
    startNotificationLoop();
  }
});

// Bildirim tıklama olayı
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification clicked:", event.notification.tag);
  event.notification.close();
  
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientsArr) => {
        // Açık bir sekme varsa odaklan
        for (const client of clientsArr) {
          if ("focus" in client && client.url.includes(self.location.origin)) {
            return client.focus();
          }
        }
        // Yoksa yeni sekme aç
        if (self.clients.openWindow) {
          return self.clients.openWindow("/water");
        }
      })
  );
});

// Mesajlaşma - kullanıcı ayarlarını al
self.addEventListener("message", (event) => {
  console.log("[SW] Message received:", event.data);
  
  if (event.data && event.data.type === "UPDATE_REMINDER_SETTINGS") {
    reminderSettings = {
      enabled: event.data.enabled ?? reminderSettings.enabled,
      intervalMinutes: event.data.intervalMinutes ?? reminderSettings.intervalMinutes,
      totalAmount: event.data.totalAmount ?? reminderSettings.totalAmount,
      dailyGoal: event.data.dailyGoal ?? reminderSettings.dailyGoal,
    };
    
    console.log("[SW] Reminder settings updated:", reminderSettings);
    
    // Bildirimleri yeniden zamanla
    if (reminderSettings.enabled) {
      startNotificationLoop();
    } else {
      stopNotificationLoop();
      cancelAllNotifications();
    }
    
    // Onay mesajı gönder
    event.ports[0]?.postMessage({ success: true });
  }
});

// Background Sync event
self.addEventListener("sync", (event) => {
  if (event.tag === "water-reminder-sync" && reminderSettings.enabled) {
    console.log("[SW] Background sync triggered");
    event.waitUntil(checkAndSendNotification());
  }
});

// Periodic Background Sync event
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "water-reminder" && reminderSettings.enabled) {
    console.log("[SW] Periodic sync triggered");
    event.waitUntil(checkAndSendNotification());
  }
});

// Tüm bildirimleri iptal et
async function cancelAllNotifications() {
  const notifications = await self.registration.getNotifications({
    tag: WATER_REMINDER_TAG,
    includeTriggered: true,
  });
  notifications.forEach((notification) => notification.close());
  console.log("[SW] All notifications cancelled");
}

// Bildirim gönder (duplicate kontrolü ile)
async function sendNotification() {
  const now = Date.now();
  const intervalMs = reminderSettings.intervalMinutes * 60 * 1000;
  
  // Son bildirimden bu yana yeterli zaman geçti mi?
  if (now - lastNotificationTime < intervalMs * 0.9) {
    console.log("[SW] Skipping notification - too soon");
    return;
  }
  
  try {
    await self.registration.showNotification("💧 Su Hatırlatıcısı", {
      body: `Hedefinize ulaşmak için su içmeyi unutmayın! ${Math.round(reminderSettings.totalAmount)}ml / ${reminderSettings.dailyGoal}ml`,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: WATER_REMINDER_TAG,
      requireInteraction: false,
      silent: false,
      vibrate: [200, 100, 200],
    });
    
    lastNotificationTime = now;
    console.log("[SW] Notification sent at", new Date(now).toISOString());
  } catch (error) {
    console.error("[SW] Failed to send notification:", error);
  }
}

// Bildirim kontrolü yap ve gönder
async function checkAndSendNotification() {
  if (!reminderSettings.enabled) {
    return;
  }
  
  await sendNotification();
  
  // Background Sync'i tekrar kaydet (Chrome'da daha güvenilir)
  if ("sync" in self.registration) {
    try {
      await self.registration.sync.register("water-reminder-sync");
    } catch (error) {
      console.log("[SW] Background sync registration:", error);
    }
  }
}

// Notification loop timer
let notificationTimer = null;
let isLoopRunning = false;

// Bildirim döngüsünü başlat (Chrome için optimize edilmiş)
function startNotificationLoop() {
  if (isLoopRunning) {
    console.log("[SW] Notification loop already running");
    return;
  }
  
  stopNotificationLoop();
  
  if (!reminderSettings.enabled) {
    return;
  }
  
  isLoopRunning = true;
  const intervalMs = reminderSettings.intervalMinutes * 60 * 1000;
  
  console.log(`[SW] Starting notification loop with ${reminderSettings.intervalMinutes}min interval`);
  
  // İlk bildirimi hemen gönder (eğer izin varsa)
  checkAndSendNotification();
  
  // Scheduled Notifications API desteği var mı?
  const supportsScheduled = 
    "showTrigger" in Notification.prototype &&
    "TimestampTrigger" in self;
  
  if (supportsScheduled) {
    // Chrome/Edge: Scheduled Notifications API kullan
    console.log("[SW] Using Scheduled Notifications API");
    scheduleScheduledNotifications();
  }
  
  // Background Sync kaydı (Chrome'da daha güvenilir)
  if ("sync" in self.registration) {
    self.registration.sync.register("water-reminder-sync").catch((error) => {
      console.log("[SW] Background sync registration failed:", error);
    });
  }
  
  // Periodic Background Sync kaydı
  if ("periodicSync" in self.registration) {
    self.registration.periodicSync
      .register("water-reminder", {
        minInterval: Math.max(intervalMs, 60 * 1000), // En az 1 dakika
      })
      .catch((error) => {
        console.log("[SW] Periodic sync registration failed:", error);
      });
  }
  
  // Fallback: Service Worker'da interval (tarayıcı açıkken)
  // Chrome'da Service Worker bazen uyuyor, bu yüzden daha agresif bir kontrol yapıyoruz
  const checkInterval = Math.min(intervalMs, 5 * 60 * 1000); // En fazla 5 dakikada bir kontrol
  
  notificationTimer = setInterval(() => {
    if (reminderSettings.enabled) {
      checkAndSendNotification();
    }
  }, checkInterval);
  
  console.log(`[SW] Notification loop started with ${checkInterval / 1000}s check interval`);
}

// Bildirim döngüsünü durdur
function stopNotificationLoop() {
  if (notificationTimer) {
    clearInterval(notificationTimer);
    notificationTimer = null;
  }
  isLoopRunning = false;
  console.log("[SW] Notification loop stopped");
}

// Scheduled Notifications API ile bildirimleri zamanla
async function scheduleScheduledNotifications() {
  await cancelAllNotifications();
  
  if (!reminderSettings.enabled) {
    return;
  }
  
  const intervalMs = reminderSettings.intervalMinutes * 60 * 1000;
  const now = Date.now();
  
  try {
    const TriggerConstructor = self.TimestampTrigger;
    
    // Sonraki 24 saat için bildirimleri zamanla (her interval'de bir)
    const notificationsToSchedule = Math.floor((24 * 60 * 60 * 1000) / intervalMs);
    const maxNotifications = Math.min(notificationsToSchedule, 48);
    
    for (let i = 1; i <= maxNotifications; i++) {
      const triggerTime = now + intervalMs * i;
      
      try {
        await self.registration.showNotification("💧 Su Hatırlatıcısı", {
          body: `Hedefinize ulaşmak için su içmeyi unutmayın! ${Math.round(reminderSettings.totalAmount)}ml / ${reminderSettings.dailyGoal}ml`,
          icon: "/icon-192.png",
          badge: "/icon-192.png",
          tag: `${WATER_REMINDER_TAG}-scheduled-${i}`,
          requireInteraction: false,
          showTrigger: new TriggerConstructor(triggerTime),
        });
      } catch (error) {
        console.error(`[SW] Failed to schedule notification ${i}:`, error);
      }
    }
    
    console.log(`[SW] Scheduled ${maxNotifications} notifications using Scheduled Notifications API`);
  } catch (error) {
    console.error("[SW] Scheduled notification setup failed:", error);
  }
}

// Push event (gelecekte push notifications için)
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();
    if (data.type === "water-reminder") {
      event.waitUntil(
        self.registration.showNotification("💧 Su Hatırlatıcısı", {
          body: data.body || "Su içmeyi unutmayın!",
          icon: "/icon-192.png",
          badge: "/icon-192.png",
          tag: WATER_REMINDER_TAG,
          requireInteraction: false,
        })
      );
    }
  }
});

// Service Worker'ın uyanık kalması için ekstra tetikleyiciler
// Chrome'da Service Worker bazen uyuyor, bu yüzden ekstra mekanizmalar ekliyoruz
self.addEventListener("fetch", (event) => {
  // Her fetch'te bildirim kontrolü yap (sadece belirli aralıklarla)
  if (reminderSettings.enabled && Math.random() < 0.01) {
    // %1 ihtimalle kontrol et (çok sık olmasın)
    checkAndSendNotification();
  }
});

// Service Worker başlatıldığında bildirim döngüsünü başlat
if (reminderSettings.enabled) {
  startNotificationLoop();
}

// AI Assistant proaktif mesajları için
let aiAssistantCheckInterval = null;

// AI Assistant mesaj kontrolü
async function checkAIAssistantMessages() {
  try {
    // Service Worker'dan main thread'e mesaj gönder
    const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    clients.forEach((client) => {
      client.postMessage({
        type: "CHECK_AI_ASSISTANT_MESSAGE",
      });
    });
  } catch (error) {
    console.error("[SW] AI Assistant message check error:", error);
  }
}

// AI Assistant için periyodik kontrol başlat
function startAIAssistantCheck() {
  if (aiAssistantCheckInterval) {
    clearInterval(aiAssistantCheckInterval);
  }
  
  // Her 5 dakikada bir kontrol et
  aiAssistantCheckInterval = setInterval(checkAIAssistantMessages, 5 * 60 * 1000);
  
  // İlk kontrolü hemen yap
  setTimeout(checkAIAssistantMessages, 10000); // 10 saniye sonra
}

// Service Worker aktif olduğunda AI Assistant kontrolünü başlat
startAIAssistantCheck();
