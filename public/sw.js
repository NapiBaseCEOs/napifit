const CACHE_NAME = "napifit-sw-v2";
const WATER_REMINDER_TAG = "water-reminder";

// Kullanıcı ayarları (default değerler)
let reminderSettings = {
  enabled: false,
  intervalMinutes: 120,
  totalAmount: 0,
  dailyGoal: 2000,
};

// Service Worker kurulumu
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker...");
  event.waitUntil(self.skipWaiting());
});

// Service Worker aktivasyonu
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker...");
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Eski bildirimleri temizle
      self.registration.getNotifications({ tag: WATER_REMINDER_TAG }).then((notifications) => {
        notifications.forEach((notification) => notification.close());
      }),
    ])
  );
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
      scheduleNotifications();
    } else {
      cancelAllNotifications();
    }
    
    // Onay mesajı gönder
    event.ports[0]?.postMessage({ success: true });
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

// Bildirimleri zamanla
async function scheduleNotifications() {
  await cancelAllNotifications();
  
  if (!reminderSettings.enabled) {
    return;
  }
  
  const intervalMs = reminderSettings.intervalMinutes * 60 * 1000;
  const now = Date.now();
  
  // Scheduled Notifications API desteği var mı?
  const supportsScheduled = 
    "showTrigger" in Notification.prototype &&
    "TimestampTrigger" in self;
  
  if (supportsScheduled) {
    // Chrome/Edge: Scheduled Notifications API kullan
    console.log("[SW] Using Scheduled Notifications API");
    
    try {
      const TriggerConstructor = self.TimestampTrigger;
      
      // Sonraki 24 saat için bildirimleri zamanla (her interval'de bir)
      const notificationsToSchedule = Math.floor((24 * 60 * 60 * 1000) / intervalMs);
      
      for (let i = 1; i <= Math.min(notificationsToSchedule, 48); i++) {
        const triggerTime = now + intervalMs * i;
        
        await self.registration.showNotification("💧 Su Hatırlatıcısı", {
          body: `Hedefinize ulaşmak için su içmeyi unutmayın! ${Math.round(reminderSettings.totalAmount)}ml / ${reminderSettings.dailyGoal}ml`,
          icon: "/icon-192.png",
          badge: "/icon-192.png",
          tag: `${WATER_REMINDER_TAG}-${i}`,
          requireInteraction: false,
          showTrigger: new TriggerConstructor(triggerTime),
        });
      }
      
      console.log(`[SW] Scheduled ${Math.min(notificationsToSchedule, 48)} notifications`);
    } catch (error) {
      console.error("[SW] Scheduled notification failed:", error);
      // Fallback: Periodic Background Sync kullan
      setupPeriodicSync();
    }
  } else {
    // Fallback: Periodic Background Sync veya interval kullan
    console.log("[SW] Using Periodic Background Sync fallback");
    setupPeriodicSync();
  }
}

// Periodic Background Sync kurulumu
async function setupPeriodicSync() {
  if (!("periodicSync" in self.registration)) {
    console.log("[SW] Periodic Background Sync not supported, using interval fallback");
    setupIntervalFallback();
    return;
  }
  
  try {
    // Periodic sync kaydı
    await self.registration.periodicSync.register("water-reminder", {
      minInterval: reminderSettings.intervalMinutes * 60 * 1000,
    });
    
    console.log("[SW] Periodic Background Sync registered");
  } catch (error) {
    console.error("[SW] Periodic sync registration failed:", error);
    setupIntervalFallback();
  }
}

// Interval fallback (tarayıcı açıkken çalışır)
let intervalTimer = null;

function setupIntervalFallback() {
  if (intervalTimer) {
    clearInterval(intervalTimer);
  }
  
  if (!reminderSettings.enabled) {
    return;
  }
  
  const intervalMs = reminderSettings.intervalMinutes * 60 * 1000;
  
  intervalTimer = setInterval(async () => {
    if (reminderSettings.enabled) {
      await self.registration.showNotification("💧 Su Hatırlatıcısı", {
        body: `Hedefinize ulaşmak için su içmeyi unutmayın! ${Math.round(reminderSettings.totalAmount)}ml / ${reminderSettings.dailyGoal}ml`,
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        tag: WATER_REMINDER_TAG,
        requireInteraction: false,
      });
    }
  }, intervalMs);
  
  console.log("[SW] Interval fallback set up");
}

// Periodic sync olayı
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "water-reminder" && reminderSettings.enabled) {
    event.waitUntil(
      self.registration.showNotification("💧 Su Hatırlatıcısı", {
        body: `Hedefinize ulaşmak için su içmeyi unutmayın! ${Math.round(reminderSettings.totalAmount)}ml / ${reminderSettings.dailyGoal}ml`,
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        tag: WATER_REMINDER_TAG,
        requireInteraction: false,
      })
    );
  }
});

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

