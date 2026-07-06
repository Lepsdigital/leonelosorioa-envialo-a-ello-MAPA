const CACHE_NAME = "mapa-cache-v2";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icono-192x192.png",
  "/icono-512x512.png",
  "/favicon.png"
];

// Install Event - caching the app shell robustly
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching App Shell and Offline Assets individually...");
      // Cache assets individually so that if any of them fails (e.g. 404 in certain environments), 
      // the Service Worker registration and install event WILL NOT fail.
      const cachePromises = ASSETS_TO_CACHE.map((asset) => {
        return cache.add(asset).catch((err) => {
          console.warn(`[Service Worker] Failed to cache individual asset: ${asset}`, err);
        });
      });
      return Promise.all(cachePromises);
    }).then(() => {
      console.log("[Service Worker] Asset caching completed.");
      return self.skipWaiting();
    })
  );
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
    icon: "/icono-512x512.png",
    badge: "/icono-512x512.png"
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (err) {
      data.body = event.data.text();
    }
  }

  // Determine if this is an action-required notification
  const isActionNotification = (title, body, category) => {
    const t = (title || "").toLowerCase();
    const b = (body || "").toLowerCase();
    const c = (category || "").toLowerCase();
    
    if (t.includes("testimonio") || b.includes("testimonio") || t.includes("caso de éxito") || b.includes("caso de éxito") || t.includes("caso de exito") || b.includes("caso de exito")) {
      return false;
    }
    
    const actionKeywords = [
      "test", "prueba", "tarea", "reflexión", "reflexion", "pendiente", 
      "completar", "avance", "día actual", "día de hoy", "dia de hoy", 
      "evaluación", "evaluacion", "sintonizar", "completado"
    ];
    
    const matchesKeyword = actionKeywords.some(keyword => t.includes(keyword) || b.includes(keyword));
    const isActionCategory = c === "reminder" || c === "unlocked" || c === "guía rápida de emergencia";
    
    return matchesKeyword || isActionCategory;
  };

  // Perform a dynamic status check in cache to coordinate "Hacerlo" CTA visibility
  const showNotificationPromise = caches.match("/api/current-status")
    .then((response) => {
      if (response) {
        return response.json();
      }
      return null;
    })
    .then((status) => {
      let isLocked = false;
      if (status && typeof status.isLocked === "boolean") {
        isLocked = status.isLocked;
        console.log("SW: Dynamic user status check succeeded. isLocked:", isLocked);
      }

      // If locked, override action visibility to hide the "Hacerlo" button
      const hasAction = isLocked ? false : isActionNotification(data.title, data.body, data.category);

      const actions = [];
      if (hasAction) {
        actions.push({ action: "do_action", title: "Hacerlo 🎯" });
      }
      actions.push({ action: "explore", title: "Ingresar a M.A.P.A.™ 🧘‍♀️" });

      const options = {
        body: data.body,
        icon: data.icon || "/icono-512x512.png",
        badge: data.badge || "/icono-512x512.png",
        tag: "mapa-push-notif",
        vibrate: [200, 100, 200],
        data: data,
        actions: actions
      };

      return self.registration.showNotification(data.title, options);
    })
    .catch((err) => {
      console.warn("SW: Error checking cached status, falling back to basic layout:", err);
      // Fallback
      const hasAction = isActionNotification(data.title, data.body, data.category);
      const actions = [];
      if (hasAction) {
        actions.push({ action: "do_action", title: "Hacerlo 🎯" });
      }
      actions.push({ action: "explore", title: "Ingresar a M.A.P.A.™ 🧘‍♀️" });

      return self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon || "/icono-512x512.png",
        badge: data.badge || "/icono-512x512.png",
        tag: "mapa-push-notif",
        vibrate: [200, 100, 200],
        data: data,
        actions: actions
      });
    });

  event.waitUntil(showNotificationPromise);
});

// Real push notification click action router
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  let targetUrl = "/";
  if (event.action === "do_action") {
    targetUrl = "/?action=do_action";
  }

  // Redirect users to the application main interface and notify clients
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Find open tab
      for (const client of clientList) {
        if (client.url.includes("/") && "focus" in client) {
          if (event.action === "do_action") {
            client.postMessage({ 
              type: "TRIGGER_ACTION", 
              data: event.notification.data 
            });
          }
          return client.focus();
        }
      }
      // If no open tab, open a new one with deep-linking query param
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

// Listener to skip waiting and activate immediately when client requests it
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    console.log("[Service Worker] Received SKIP_WAITING signal, skipping waiting...");
    self.skipWaiting();
  }
});
