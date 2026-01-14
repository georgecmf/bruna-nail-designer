// ===== Registro do Service Worker =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('✅ Service Worker registrado com sucesso:', reg))
            .catch(err => console.log('❌ Erro ao registrar SW:', err));
    });
}
