const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize SQLite database
const db = new sqlite3.Database("./salon.db");
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS bookings (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, service TEXT, date TEXT, time TEXT)");
});

// Routes
app.get("/", (req, res) => {
    res.send("Salon Scheduler API is running.");
});
app.get("/bookings", (req, res) => {
    db.all("SELECT * FROM bookings", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post("/bookings", (req, res) => {
    const { name, service, date, time } = req.body;
    db.run("INSERT INTO bookings (name, service, date, time) VALUES (?, ?, ?, ?)",
        [name, service, date, time],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, name, service, date, time });
        }
    );
});

// Start server
app.listen(4000, () => console.log("✅ Backend running on http://localhost:4000"));
