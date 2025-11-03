import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const DATA_FILE = "./data.json";

// Função para ler o "banco" (JSON)
function readData() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    }
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
}

// Função para gravar no "banco"
function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// 🔹 GET /api/bookings → lista agendamentos
app.get("/api/bookings", (req, res) => {
    const bookings = readData();
    res.json(bookings);
});

// 🔹 POST /api/bookings → cria novo agendamento
app.post("/api/bookings", (req, res) => {
    const { name, phone, service, date, time } = req.body;

    if (!name || !phone || !service || !date || !time) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    const bookings = readData();

    // Evita conflito (mesmo dia e hora)
    const conflict = bookings.find(
        (b) => b.date === date && b.time === time
    );

    if (conflict) {
        return res.status(400).json({ error: "Horário já reservado" });
    }

    const newBooking = {
        id: Date.now(),
        name,
        phone,
        service,
        date,
        time,
    };

    bookings.push(newBooking);
    saveData(bookings);

    res.json({ message: "Agendamento criado com sucesso", booking: newBooking });
});

// 🔹 DELETE /api/bookings/:id → cancelar
app.delete("/api/bookings/:id", (req, res) => {
    const id = Number(req.params.id);
    let bookings = readData();
    bookings = bookings.filter((b) => b.id !== id);
    saveData(bookings);
    res.json({ message: "Agendamento cancelado" });
});

app.listen(PORT, () => console.log(`✅ Servidor rodando em http://localhost:${PORT}`));
