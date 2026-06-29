/* Verici service worker — çevrimdışı kabuk + güncelleme akışı */
const VERSION = "v1.0.0";
const CACHE = "verici-" + VERSION;

// Uygulama kabuğu (aynı kaynak). Sürüm yükseltince eskiler temizlenir.
const SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL)).catch(() => {})
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Firebase / WebRTC / sinyalleşme: her zaman ağ (önbelleğe alma)
  if (url.hostname.includes("firebase") || url.hostname.includes("googleapis") ||
      url.hostname.includes("gstatic") && url.pathname.includes("firebasejs")) {
    return; // tarayıcının normal ağ akışına bırak
  }

  // Sayfa gezinmeleri: önce ağ, çevrimdışıysa önbellekten kabuk
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match("./index.html").then((r) => r || caches.match("./")))
    );
    return;
  }

  // Statik aynı-kaynak varlıklar: önce önbellek, sonra ağ (ve önbelleğe yaz)
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        }).catch(() => cached);
      })
    );
    return;
  }

  // Çapraz kaynak (fontlar vb.): ağ, başarısızsa önbellek
  event.respondWith(
    fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(req))
  );
});
