
import React, { useState, useEffect } from "react";
import "./App.css";
import Login from "./Login";

function App() {
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({ name: "", service: "", date: "", time: "" });
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [username, setUsername] = useState(() => localStorage.getItem("username") || "");

  useEffect(() => {
    if (token) {
      fetch("http://localhost:4000/bookings", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (res.status === 401 || res.status === 403) throw new Error("Unauthorized");
          return res.json();
        })
        .then(data => setBookings(data))
        .catch(() => {
          setToken("");
          setUsername("");
          localStorage.removeItem("token");
          localStorage.removeItem("username");
        });
    }
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:4000/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(newBooking => setBookings([...bookings, newBooking]));
  };

  const handleAuth = (tok, user) => {
    setToken(tok);
    setUsername(user);
    localStorage.setItem("token", tok);
    localStorage.setItem("username", user);
  };

  const handleLogout = () => {
    setToken("");
    setUsername("");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setBookings([]);
  };

  if (!token) {
    return <Login onAuth={handleAuth} />;
  }

  return (
    <div className="salon-container">
      <h1 className="salon-title">Salon Booking App</h1>
      <div style={{textAlign: "right", marginBottom: 8}}>
        <span style={{marginRight: 12}}>Welcome, {username}</span>
        <button onClick={handleLogout} style={{background: "#eee", color: "#333", border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer"}}>Logout</button>
      </div>
      <form className="salon-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input id="name" placeholder="Enter your name" onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <label htmlFor="service">Service</label>
        <select id="service" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}>
          <option value="">Select Service</option>
          <option value="Haircut">Haircut</option>
          <option value="Color">Color</option>
          <option value="Styling">Styling</option>
          <option value="Shave">Shave</option>
        </select>

        <label htmlFor="date">Date</label>
        <input id="date" type="date" onChange={(e) => setForm({ ...form, date: e.target.value })} />

        <label htmlFor="time">Time</label>
        <input id="time" type="time" onChange={(e) => setForm({ ...form, time: e.target.value })} />

        <button type="submit">Book Appointment</button>
      </form>

      <div className="salon-appointments">
        <h2>Appointments</h2>
        <ul>
          {bookings.map(b => (
            <li key={b.id}>{b.name} - {b.service} - {b.date} at {b.time}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
