import React from "react";

export default function AppointmentsPage({ bookings, onBack }) {
  return (
    <div className="salon-container">
      <h1 className="salon-title">Your Appointments</h1>
      <button onClick={onBack} style={{marginBottom: 16, background: "#eee", color: "#333", border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer"}}>Back</button>
      <div className="salon-appointments">
        <h2>Appointments</h2>
        <ul>
          {bookings.length === 0 && <li>No appointments found.</li>}
          {bookings.map(b => (
            <li key={b.id}>{b.name} - {b.service} - {b.date} at {b.time}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
