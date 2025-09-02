const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize SQLite database
const db = new sqlite3.Database("./salon.db");
db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            service TEXT,
            date TEXT,
            time TEXT,
            price REAL,
            receipt_number TEXT,
            reference_number TEXT
        )`);
        db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)");

        // Migration: add new columns if missing
        db.get("PRAGMA table_info(bookings)", (err, info) => {
            db.all("PRAGMA table_info(bookings)", (err, columns) => {
                const colNames = columns.map(c => c.name);
                if (!colNames.includes("price")) db.run("ALTER TABLE bookings ADD COLUMN price REAL");
                if (!colNames.includes("receipt_number")) db.run("ALTER TABLE bookings ADD COLUMN receipt_number TEXT");
                if (!colNames.includes("reference_number")) db.run("ALTER TABLE bookings ADD COLUMN reference_number TEXT");
            });
        });
});

const JWT_SECRET = process.env.JWT_SECRET || "salon_secret_key_2025";

function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid token" });
        req.user = user;
        next();
    });
}
// Auth routes
app.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Username and password required" });
    const hash = bcrypt.hashSync(password, 8);
    db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hash], function(err) {
        if (err) return res.status(400).json({ error: "Username already exists" });
        const token = generateToken({ id: this.lastID, username });
        res.json({ token, username });
    });
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Username and password required" });
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err || !user) return res.status(400).json({ error: "Invalid credentials" });
        if (!bcrypt.compareSync(password, user.password)) return res.status(400).json({ error: "Invalid credentials" });
        const token = generateToken({ id: user.id, username });
        res.json({ token, username });
    });
});

// Guest login (no registration, just returns a guest token)
app.post("/guest", (req, res) => {
    const token = generateToken({ guest: true });
    res.json({ token, guest: true });
});

// Routes
app.get("/", (req, res) => {
    res.send("Salon Scheduler API is running.");
});

// Protect bookings endpoints (allow both user and guest)
app.get("/bookings", authenticateToken, (req, res) => {
    db.all("SELECT * FROM bookings", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});


app.post("/bookings", authenticateToken, (req, res) => {
    const { name, service, date, time, price, receipt_number, reference_number } = req.body;
    db.run(
        "INSERT INTO bookings (name, service, date, time, price, receipt_number, reference_number) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [name, service, date, time, price, receipt_number, reference_number],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            // Imitate sending an email by logging to the console
            console.log(`(Imitation) Appointment confirmation email: Appointment booked for ${name} on ${date} at ${time} for service: ${service}`);
            res.json({ id: this.lastID, name, service, date, time, price, receipt_number, reference_number });
        }
    );
});

// Start server
app.listen(4000, () => console.log("✅ Backend running on http://localhost:4000"));
