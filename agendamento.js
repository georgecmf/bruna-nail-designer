const dateInput = document.getElementById("dateInput");
const serviceSelect = document.getElementById("serviceSelect");
const timesContainer = document.getElementById("timesContainer");
const clientName = document.getElementById("clientName");
const clientPhone = document.getElementById("clientPhone");
const confirmBtn = document.getElementById("confirmBooking");
let selectedTime = null;

const OPEN_HOUR = 9;        // abre às 09h
const CLOSE_HOUR = 19;     // fecha às 19h (permite iniciar serviço às 18h)
const BREAK_TIME = 0.5;

// Duração (em horas) e valor de cada serviço
const services = {
    "Alongamento Molde F1": { duration: 3, price: 100 },
    "Remoção": { duration: 1, price: 30 },
    "Manutenção Molde F1": { duration: 2, price: 80 },
    "Blindagem": { duration: 2, price: 55 },
    "Banho em Gel": { duration: 2, price: 80 },
    "Unha Encapsulada": { duration: 1, price: 10 },
    "Reposição de Unha Quebrada": { duration: 1, price: 5 }
};

// Horários disponíveis
const allHours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

// Recupera agendamentos do localStorage
let bookings = [];
try {
    const saved = JSON.parse(localStorage.getItem("bookings"));
    if (Array.isArray(saved)) bookings = saved;
} catch {
    bookings = [];
}

// Renderiza horários disponíveis
function renderTimes() {
    timesContainer.innerHTML = "";

    const date = dateInput.value;

    if (!date) {
        timesContainer.innerHTML =
            "<p class='info-text'>Escolha uma data para ver os horários disponíveis.</p>";
        return;
    }

    let hasAvailable = false;

    // Data selecionada
    const [day, month, year] = date.split("/");
    const selectedDate = new Date(year, month - 1, day);

    // Data atual
    const now = new Date();
    const isToday =
        selectedDate.getDate() === now.getDate() &&
        selectedDate.getMonth() === now.getMonth() &&
        selectedDate.getFullYear() === now.getFullYear();

    const currentHour = now.getHours();

    allHours.forEach((hour) => {
        // ❌ Remove horários passados se for hoje
        if (isToday && hour <= currentHour) return;

        // Verifica conflito APENAS com agendamentos existentes
        const conflict = bookings.some((b) => {
            const bookingStart = b.hour;
            const bookingEnd = b.hour + b.duration + BREAK_TIME;

            return (
                b.date === date &&
                hour >= bookingStart &&
                hour < bookingEnd
            );
        });

        const btn = document.createElement("button");
        btn.textContent = `${hour}:00`;

        if (conflict) {
            btn.classList.add("disabled");
            btn.disabled = true;
        } else {
            hasAvailable = true;
            btn.addEventListener("click", () => {
                selectedTime = hour;
                Array.from(timesContainer.children).forEach((c) =>
                    c.classList.remove("selected")
                );
                btn.classList.add("selected");
            });
        }

        timesContainer.appendChild(btn);
    });

    if (!hasAvailable) {
        timesContainer.innerHTML =
            "<p class='info-text'>Nenhum horário disponível nesta data.</p>";
    }
}



// Eventos
serviceSelect.addEventListener("change", renderTimes);
dateInput.addEventListener("change", renderTimes);

// Inicializa com os horários desabilitados até escolher data/serviço
renderTimes();

// Confirmar agendamento e enviar WhatsApp
confirmBtn.addEventListener("click", () => {
    const name = clientName.value.trim();
    const phone = clientPhone.value.trim();
    const service = serviceSelect.value;
    const date = dateInput.value;
    const hour = selectedTime;

    if (!name || !phone || !service || !date || !hour) {
        alert("Preencha todos os campos: nome, telefone, serviço, data e horário!");
        return;
    }

    const { duration, price } = services[service];

    // Salva o agendamento no localStorage
    bookings.push({ name, phone, date, hour, service, duration });
    localStorage.setItem("bookings", JSON.stringify(bookings));

    // Mensagem para o cliente
    const messageClient = `Olá ${name}! 🌸

Seu agendamento foi *confirmado* com sucesso!

📅 *Data:* ${date}
⏰ *Horário:* ${hour}:00
💅 *Serviço:* ${service}
💵 *Valor:* R$ ${price},00

Agradecemos imensamente pela sua confiança e preferência! 💖  
Caso haja qualquer alteração ou imprevisto, entraremos em contato previamente.

Atenciosamente,  
*Bruna Nail Designer 💅*`;

    // Envia mensagem ao cliente
    const clientNumber = phone.replace(/\D/g, "");
    window.open(
        `https://wa.me/55${clientNumber}?text=${encodeURIComponent(messageClient)}`,
        "_blank"
    );

    // Mensagem para você (profissional)
    const yourNumber = "5551985433830";
    const messageBru = `📢 *Novo agendamento recebido!*

👤 *Cliente:* ${name}
📞 *Telefone:* ${phone}
💅 *Serviço:* ${service}
📅 *Data:* ${date}
⏰ *Horário:* ${hour}:00
💵 *Valor:* R$ ${price},00

Verifique o agendamento no sistema.`;

    window.open(`https://wa.me/${yourNumber}?text=${encodeURIComponent(messageBru)}`, "_blank");

    // Mensagem de confirmação visual
    alert(`✅ Agendamento confirmado para ${date} às ${hour}:00!`);

    // Reseta seleção
    selectedTime = null;
    clientName.value = "";
    clientPhone.value = "";
    serviceSelect.value = "";
    renderTimes();
});
