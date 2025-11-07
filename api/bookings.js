import fs from "fs";

const DATA_FILE = "./data.json";

function readData() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    }
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
}

function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export default function handler(req, res) {
    if (req.method === "GET") {
        const bookings = readData();
        res.status(200).json(bookings);
    } else if (req.method === "POST") {
        const { name, phone, service, date, time } = req.body;
        if (!name || !phone || !service || !date || !time) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios" });
        }

        const bookings = readData();
        const conflict = bookings.find(b => b.date === date && b.time === time);
        if (conflict) {
            return res.status(400).json({ error: "Horário já reservado" });
        }

        const newBooking = { id: Date.now(), name, phone, service, date, time };
        bookings.push(newBooking);
        saveData(bookings);

        res.status(201).json({ message: "Agendamento criado com sucesso", booking: newBooking });
    } else if (req.method === "DELETE") {
        const id = Number(req.query.id);
        let bookings = readData().filter(b => b.id !== id);
        saveData(bookings);
        res.status(200).json({ message: "Agendamento cancelado" });
    } else {
        res.status(405).json({ error: "Método não permitido" });
    }
}
