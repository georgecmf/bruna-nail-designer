const images = document.querySelectorAll(".gallery-grid img");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

let currentIndex = 0;

// ===== Abrir lightbox =====
images.forEach((img, index) => {
    img.addEventListener("click", () => {
        currentIndex = index;
        showImage();
        lightbox.style.display = "flex";
    });
});

function showImage() {
    lightboxImg.src = images[currentIndex].src;
}

// ===== Botões =====
nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % images.length;
    showImage();
});

prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage();
});

// ===== Fechar clicando fora =====
lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
        lightbox.style.display = "none";
    }
});

// ===== SWIPE MOBILE =====
let startX = 0;

lightboxImg.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
});

lightboxImg.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    // Sensibilidade do swipe (quanto arrasta)
    if (diff > 50) {
        // Arrastou para esquerda → próxima
        currentIndex = (currentIndex + 1) % images.length;
        showImage();
    } else if (diff < -50) {
        // Arrastou para direita → anterior
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage();
    }
});
