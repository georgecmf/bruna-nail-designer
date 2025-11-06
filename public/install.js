let deferredPrompt;
const installButton = document.getElementById("installButton");

window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installButton.style.display = "block"; // mostra o botão

    installButton.addEventListener("click", async () => {
        installButton.style.display = "none";
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`Usuário escolheu: ${outcome}`);
        deferredPrompt = null;
    });
});

window.addEventListener("appinstalled", () => {
    console.log("✅ Aplicativo instalado com sucesso!");
});
