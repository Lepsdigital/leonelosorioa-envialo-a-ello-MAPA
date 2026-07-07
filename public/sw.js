const CACHE_NAME = "mapa-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/src/main.tsx",
  "/src/App.tsx",
  "/src/index.css",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable.png"
];

// Install Event - caching the app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching App Shell and Offline Assets");
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn("[Service Worker] Pre-cache warning (some assets might be bundled dynamically):", err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[Service Worker] Clearing old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - network first with cache fallback to serve the latest content and guarantee offline functionality
self.addEventListener("fetch", (event) => {
  // Only handle HTTP/HTTPS, skip other schemes like chrome-extension://
  if (!event.request.url.startsWith("http")) return;

  // We should bypass caching for API routes (such as gemini calls /api/*) to avoid caching dynamic models
  if (event.request.url.includes("/api/")) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If valid response, clone and cache it for future offline usage
        if (response && response.status === 200 && response.type === "basic") {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Fetch failed - try matching request in our cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // If HTML request failed and isn't cached, return the root index.html as a fallback
          if (event.request.headers.get("accept")?.includes("text/html")) {
            return caches.match("/");
          }
          
          // Otherwise fail gracefully
          return new Response("Offline mode activated. MAPA cache is loaded.", {
            status: 503,
            statusText: "Service Unavailable (Offline)"
          });
        });
      })
  );
});

// Helper to calculate lock status safely in Service Worker
function isTestLocked(progress) {
  try {
    if (!progress || !progress.activationDate) {
      return false; // Default to unlocked if no data
    }
    const currentDay = Number(progress.currentDay || 1);
    if (currentDay === 1) {
      return false; // Day 1 is always unlocked immediately
    }
    const prevDay = currentDay - 1;
    let prevCompletionMs = 0;

    // Check if we have the completion timestamp of the previous day
    if (progress.completionTimestamps && progress.completionTimestamps[prevDay]) {
      prevCompletionMs = new Date(progress.completionTimestamps[prevDay]).getTime();
    } else {
      // Fallback calculation based on activation date
      const activatedDate = new Date(progress.activationDate);
      prevCompletionMs = activatedDate.getTime() + (prevDay - 1) * 24 * 60 * 60 * 1000;
    }

    if (isNaN(prevCompletionMs)) {
      return false;
    }

    const now = new Date().getTime();
    const unlockTime = prevCompletionMs + 24 * 60 * 60 * 1000;
    return (unlockTime - now) > 0; // True if locked, false if unlocked
  } catch (err) {
    console.error("[SW] Error calculating chronological state:", err);
    return false; // Fail open safely
  }
}

// Real push notification delivery event listener
self.addEventListener("push", (event) => {
  let data = {
    title: "M.A.P.A.™ Bienestar",
    body: "Tu guía de tranquilidad e inteligencia emocional está lista.",
    icon: "/icon-512.png",
    badge: "/icon-512.png"
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (err) {
      data.body = event.data.text();
    }
  }

  event.waitUntil(
    caches.open("mapa-user-progress-cache")
      .then((cache) => cache.match("/local-user-progress"))
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse.json();
        }
        return null;
      })
      .then((progress) => {
        const isLocked = isTestLocked(progress);
        
        const actions = [
          { action: "explore", title: "Ingresar a M.A.P.A.™ 🧘‍♀️" }
        ];

        // Only show "Hacerlo" if progress is found and the test is NOT locked
        if (progress && !isLocked) {
          actions.unshift({
            action: "test",
            title: `Hacerlo (Día ${progress.currentDay}) ➔`
          });
        }

        const options = {
          body: data.body,
          icon: data.icon || "/icon-512.png",
          badge: data.badge || "/icon-512.png",
          tag: "mapa-push-notif",
          vibrate: [200, 100, 200],
          data: { ...data, progress },
          actions: actions
        };

        return self.registration.showNotification(data.title, options);
      })
      .catch((err) => {
        console.error("[SW] Push event handling with cache check failed:", err);
        // Fallback option if matching cache fails
        const options = {
          body: data.body,
          icon: data.icon || "/icon-512.png",
          badge: data.badge || "/icon-512.png",
          tag: "mapa-push-notif",
          vibrate: [200, 100, 200],
          data: data,
          actions: [
            { action: "explore", title: "Ingresar a M.A.P.A.™ 🧘‍♀️" }
          ]
        };
        return self.registration.showNotification(data.title, options);
      })
  );
});

// Real push notification click action router
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  let targetUrl = "/";
  if (event.action === "test") {
    targetUrl = "/?action=test";
  }

  // Redirect users to the application main interface
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Find open tab
      for (const client of clientList) {
        if (client.url.includes("/") && "focus" in client) {
          if (event.action === "test" && "navigate" in client) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      // If no open tab, open a new one
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
