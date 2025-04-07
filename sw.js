// Версия кэша - обновите при изменении файлов
const CACHE_NAME = 'portfolio-v1';
// Файлы для кэширования
const ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/favicon-32x32.png',
  '/apple-touch-icon.png',
  '/styles.css',
  '/script.js'
];
const CACHE_NAME = 'v2';
     const ASSETS = [
       '/',
       '/web-app-manifest-192x192.png',
       '/index.html'
     ];

// ===== Установка Service Worker =====
self.addEventListener('install', event => {
  // NEW: Активируем skipWaiting сразу после установки
  self.skipWaiting(); // Принудительная активация нового SW
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Кэширование основных файлов');
        return cache.addAll(ASSETS);
      })
  );
});

// ===== Активация =====
self.addEventListener('activate', event => {
  // NEW: Очистка старых кэшей + принудительный захват контроля
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all([
        // Очистка старых кэшей
        ...cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name)),
        // NEW: Немедленный захват контроля над страницами
        self.clients.claim()
      ]);
    })
  );
});

// ===== NEW: Автообновление при изменении контента =====
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

// ===== Обработка запросов =====
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        return cachedResponse || fetch(event.request);
      })
  );
});