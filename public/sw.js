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

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Real push notification click action router
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // Redirect users to the application main interface
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Find open tab
      for (const client of clientList) {
        if (client.url.includes("/") && "focus" in client) {
          return client.focus();
        }
      }
      // If no open tab, open a new one
      if (self.clients.openWindow) {
        return self.clients.openWindow("/");
      }
    })
  );
});
