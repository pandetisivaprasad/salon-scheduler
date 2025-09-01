
import React, { useState, useEffect } from "react";
import "./App.css";
import Login from "./Login";
import AppointmentsPage from "./AppointmentsPage";
import CheckoutPage from "./CheckoutPage";
function App() {
  const servicesList = [
    { label: "Haircut", price: 20 },
    { label: "Color", price: 40 },
    { label: "Styling", price: 30 },
    { label: "Shave", price: 15 }
  ];
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({ name: "", services: [], date: "", time: "" });
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [username, setUsername] = useState(() => localStorage.getItem("username") || "");
  const [confirmation, setConfirmation] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showAppointmentsPage, setShowAppointmentsPage] = useState(false);

  const fetchBookings = () => {
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowCheckout(true);
  };

  const handleCheckoutBack = () => {
    setShowCheckout(false);
  };

  function generateRef(prefix = "REF") {
    return (
      prefix + "-" +
      Math.random().toString(36).substring(2, 8).toUpperCase() +
      Date.now().toString().slice(-4)
    );
  }

  const handleCheckoutConfirm = () => {
    const paymentReceipt = generateRef("PAY");
    const appointmentRef = generateRef("APT");
    fetch("http://localhost:4000/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        ...form,
        service: form.services.map(s => s.label).join(", ")
      })
    })
      .then(res => res.json())
      .then(newBooking => {
        setBookings([...bookings, newBooking]);
        setConfirmation({
          name: newBooking.name,
          services: form.services,
          date: newBooking.date,
          time: newBooking.time,
          paymentReceipt,
          appointmentRef
        });
        setShowCheckout(false);
      });
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

  if (showAppointmentsPage) {
    return <AppointmentsPage bookings={bookings} onBack={() => setShowAppointmentsPage(false)} />;
  }

  if (showCheckout) {
    const totalPrice = form.services.reduce((sum, s) => sum + (s.price || 0), 0);
    return (
      <CheckoutPage
        name={form.name}
        services={form.services}
        date={form.date}
        time={form.time}
        totalPrice={totalPrice}
        onBack={handleCheckoutBack}
        onConfirm={handleCheckoutConfirm}
      />
    );
  }

  if (confirmation) {
    const totalPrice = confirmation.services.reduce((sum, s) => sum + (s.price || 0), 0);
    return (
      <div className="salon-container">
        <h1 className="salon-title">Appointment Confirmed!</h1>
        <div style={{marginBottom: 24, textAlign: "center"}}>
          <p>Thank you, <b>{confirmation.name}</b>!</p>
          <p>Your appointment for <b>{confirmation.services.map(s => s.label).join(", ")}</b> is booked on <b>{confirmation.date}</b> at <b>{confirmation.time}</b>.</p>
          <p style={{marginTop:16, fontWeight:600}}>Total Price: <span style={{color:'#3182ce'}}>${totalPrice}</span></p>
          <p style={{marginTop:12}}><b>Payment Receipt #:</b> <span style={{color:'#2b6cb0'}}>{confirmation.paymentReceipt}</span></p>
          <p><b>Appointment Ref #:</b> <span style={{color:'#2b6cb0'}}>{confirmation.appointmentRef}</span></p>
        </div>
        <div style={{textAlign: "center"}}>
          <button onClick={() => { fetchBookings(); setShowAppointmentsPage(true); setConfirmation(null); }} style={{padding: "10px 20px", borderRadius: 8, background: "#3182ce", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer"}}>
            View My Appointments
          </button>
        </div>
      </div>
    );
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

        <label>Services</label>
        <div style={{marginBottom:18}}>
          {servicesList.map(service => (
            <label key={service.label} style={{display:'block', marginBottom:6, fontWeight:400}}>
              <input
                type="checkbox"
                checked={form.services.some(s => s.label === service.label)}
                onChange={e => {
                  if (e.target.checked) {
                    setForm(f => ({ ...f, services: [...f.services, service] }));
                  } else {
                    setForm(f => ({ ...f, services: f.services.filter(s => s.label !== service.label) }));
                  }
                }}
              />
              {service.label} <span style={{color:'#888', fontSize:'0.95em'}}>(${service.price})</span>
            </label>
          ))}
        </div>

        <label htmlFor="date">Date</label>
        <input id="date" type="date" onChange={(e) => setForm({ ...form, date: e.target.value })} />

        <label htmlFor="time">Time</label>
        <input id="time" type="time" onChange={(e) => setForm({ ...form, time: e.target.value })} />

        <button type="submit">Book Appointment</button>
      </form>

      <div style={{marginTop: 24, textAlign: "center"}}>
        <button onClick={() => { fetchBookings(); setShowAppointmentsPage(true); }}
        style={{padding: "10px 20px", borderRadius: 8, background: "#3182ce", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer"}}>
          Show My Appointments
        </button>
      </div>
    </div>
  );
}

export default App;
