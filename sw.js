const CACHE_NAME = "bruna-nail-cache-v4";

const STATIC_ASSETS = [
    "/style-index.css",
    "/style-agendamento.css",
    "/style-meustrabalhos.css",
    "/style-login.css",
    "/manifest.json",
    "/imagens/logo-bruna.png",
    "/imagens/icon-192.png",
    "/imagens/icon-512.png"
];

// INSTALL
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
    );
    self.skipWaiting();
});

// ACTIVATE
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((key) => key !== CACHE_NAME && caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

// FETCH
self.addEventListener("fetch", (event) => {
    const { request } = event;

    // 🔥 HTML → sempre da rede
    if (request.destination === "document") {
        event.respondWith(fetch(request));
        return;
    }

    // 🎨 Arquivos estáticos → cache first
    event.respondWith(
        caches.match(request).then((cached) => {
            return cached || fetch(request).then((response) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(request, response.clone());
                    return response;
                });
            });
        })
    );
});
