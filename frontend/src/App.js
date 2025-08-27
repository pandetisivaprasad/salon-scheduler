import React, { useState, useEffect } from "react";

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
    <div style={{ padding: "20px" }}>
      <h1>Salon Booking App</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} /><br />
        <input placeholder="Service" onChange={(e) => setForm({ ...form, service: e.target.value })} /><br />
        <input type="date" onChange={(e) => setForm({ ...form, date: e.target.value })} /><br />
        <input type="time" onChange={(e) => setForm({ ...form, time: e.target.value })} /><br />
        <button type="submit">Book Appointment</button>
      </form>

      <h2>Appointments</h2>
      <ul>
        {bookings.map(b => (
          <li key={b.id}>{b.name} - {b.service} - {b.date} at {b.time}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
