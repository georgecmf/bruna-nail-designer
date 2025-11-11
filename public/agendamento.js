const dateInput = document.getElementById("dateInput");
const serviceSelect = document.getElementById("serviceSelect");
const timesContainer = document.getElementById("timesContainer");
const clientName = document.getElementById("clientName");
const clientPhone = document.getElementById("clientPhone");
const confirmBtn = document.getElementById("confirmBooking");
let selectedTime = null;

// Duração (em horas) e valor de cada serviço
const services = {
    "Alongamento Molde F1": { duration: 3, price: 80 },
    "Remoção": { duration: 1, price: 30 },
    "Manutenção Molde F1": { duration: 2, price: 70 },
    "Blindagem": { duration: 2, price: 45 },
    "Banho em Gel": { duration: 2, price: 60 }
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

    const service = serviceSelect.value;
    const date = dateInput.value;

    if (!service || !date) {
        timesContainer.innerHTML =
            "<p class='info-text'>Escolha um serviço e uma data para ver os horários disponíveis.</p>";
        return;
    }

    const { duration } = services[service];
    let hasAvailable = false;

    allHours.forEach((hour) => {
        const conflict = bookings.some(
            (b) =>
                b.date === date &&
                ((hour >= b.hour && hour < b.hour + b.duration) ||
                    (hour + duration > b.hour && hour + duration <= b.hour + b.duration))
        );

        const btn = document.createElement("button");
        btn.textContent = `${hour}:00`;

        if (conflict) {
            btn.classList.add("disabled");
            btn.disabled = true;
        } else {
            hasAvailable = true;
            btn.addEventListener("click", () => {
                selectedTime = hour;
                Array.from(timesContainer.children).forEach((c) => c.classList.remove("selected"));
                btn.classList.add("selected");
            });
        }

        timesContainer.appendChild(btn);
    });

    if (!hasAvailable) {
        timesContainer.innerHTML =
            "<p class='info-text'>Nenhum horário disponível nesta data. Escolha outra.</p>";
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
    const yourNumber = "5551986028455";
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
