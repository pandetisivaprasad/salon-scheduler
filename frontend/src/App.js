import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({ name: "", service: "", date: "", time: "" });

  useEffect(() => {
    fetch("http://localhost:4000/bookings")
      .then(res => res.json())
      .then(data => setBookings(data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:4000/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(newBooking => setBookings([...bookings, newBooking]));
  };

  return (
    <div className="salon-container">
      <h1 className="salon-title">Salon Booking App</h1>
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
