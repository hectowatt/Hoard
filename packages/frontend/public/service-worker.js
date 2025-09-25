const CACHE_NAME = "hoard-cache-v1";
const urlsToCache = [
  "/",
  "/192.png",
  "/512.png",
  "/Hoard_icon.png",
  "/manifest.json",
];

// インストールイベント: キャッシュを作成
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// フェッチイベント: キャッシュからリソースを提供
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // キャッシュがあればそれを返し、なければネットワークから取得
      return response || fetch(event.request);
    })
  );
});

// アクティベーションイベント: 古いキャッシュを削除
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});