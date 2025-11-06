const CACHE_NAME = "bruna-nail-cache-v2";
const urlsToCache = [
    "/",
    "/index.html",
    "/agendamento.html",
    "/meustrabalhos.html",
    "/login.html",
    "/style-index.css",
    "/style-agendamento.css",
    "/style-meustrabalhos.css",
    "/style-login.css",
    "/manifest.json",
    "/imagens/logo-bruna.png",
    "/imagens/icon-192.png",
    "/imagens/icon-512.png"
];

// Instala o service worker e salva arquivos no cache
self.addEventListener("install", (event) => {
    console.log("🟡 Instalando Service Worker...");
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log("✅ Arquivos armazenados no cache:", urlsToCache);
                return cache.addAll(urlsToCache);
            })
            .catch((err) => console.error("❌ Erro ao adicionar arquivos no cache:", err))
    );
});

// Ativa o SW e remove caches antigos
self.addEventListener("activate", (event) => {
    console.log("🟢 Service Worker ativado");
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log("🧹 Removendo cache antigo:", cache);
                        return caches.delete(cache);
                    }
                })
            )
        )
    );
});

// Busca arquivos do cache primeiro (offline)
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                return response; // retorna do cache
            }
            // tenta buscar online e adiciona ao cache dinamicamente
            return fetch(event.request)
                .then((networkResponse) => {
                    if (!networkResponse || networkResponse.status !== 200) {
                        return networkResponse;
                    }
                    const clonedResponse = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, clonedResponse);
                    });
                    return networkResponse;
                })
                .catch(() => {
                    // fallback offline opcional
                    if (event.request.destination === "document") {
                        return caches.match("/index.html");
                    }
                });
        })
    );
});
