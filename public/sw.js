const CACHE_NAME = 'chuangmeng-admin-v1';
const urlsToCache = [
  '/',
  '/admin',
  '/admin/content',
  '/admin/media',
  '/admin/settings',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

// 安装事件 - 缓存核心资源
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 拦截网络请求
self.addEventListener('fetch', (event: FetchEvent) => {
  // 只对同源请求进行处理
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // 对于API请求，直接走网络
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // 缓存命中则返回缓存
      if (response) {
        return response;
      }

      // 否则发起网络请求
      return fetch(event.request).then((response) => {
        // 检查是否为有效响应
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // 克隆响应
        const responseToCache = response.clone();

        // 缓存响应
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    }).catch(() => {
      // 网络失败时返回缓存或离线页面
      return caches.match(event.request);
    })
  );
});

// 类型定义
declare const self: ServiceWorkerGlobalScope & {
  skipWaiting: () => void;
  clients: {
    claim: () => void;
  };
};

interface ExtendableEvent extends Event {
  waitUntil(promise: Promise<any>): void;
}

interface FetchEvent extends ExtendableEvent {
  request: Request;
  respondWith(response: Promise<Response> | Response): void;
}
