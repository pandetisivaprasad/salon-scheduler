import React, { useState } from "react";
import PaymentGateway from "./PaymentGateway";

export default function CheckoutPage({ name, services, date, time, totalPrice, onBack, onConfirm }) {
  const [showPayment, setShowPayment] = useState(false);

  if (showPayment) {
    return (
      <PaymentGateway
        amount={totalPrice}
        onSuccess={() => onConfirm()}
        onCancel={() => setShowPayment(false)}
      />
    );
  }

  return (
    <div className="salon-container">
      <h1 className="salon-title">Checkout</h1>
      <div style={{marginBottom: 24, textAlign: "center"}}>
        <p><b>Name:</b> {name}</p>
        <p><b>Services:</b> {services.map(s => s.label).join(", ")}</p>
        <p><b>Date:</b> {date}</p>
        <p><b>Time:</b> {time}</p>
        <p style={{marginTop:16, fontWeight:600}}>Total Price: <span style={{color:'#3182ce'}}>${totalPrice}</span></p>
      </div>
      <div style={{textAlign: "center"}}>
        <button onClick={onBack} style={{marginRight: 12, padding: "10px 20px", borderRadius: 8, background: "#eee", color: "#333", border: "none", fontWeight: 600, cursor: "pointer"}}>
          Back
        </button>
        <button onClick={() => setShowPayment(true)} style={{padding: "10px 20px", borderRadius: 8, background: "#3182ce", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer"}}>
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}
