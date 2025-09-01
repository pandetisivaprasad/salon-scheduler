import React, { useState } from "react";

export default function PaymentGateway({ amount, onSuccess, onCancel }) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [method, setMethod] = useState("credit");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const [upiId, setUpiId] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      if ((method === "credit" || method === "debit")) {
        if (name && cardNumber.length >= 12 && expiry.match(/^\d{2}\/\d{2}$/) && cvv.length >= 3) {
          onSuccess({ method, cardNumber, name });
        } else {
          setError("Please fill all card details correctly.");
        }
      } else if (method === "upi") {
        if (upiId && upiId.includes("@")) {
          onSuccess({ method, upiId });
        } else {
          setError("Please enter a valid UPI ID.");
        }
      } else if (method === "paypal") {
        if (paypalEmail && /.+@.+\..+/.test(paypalEmail)) {
          onSuccess({ method, paypalEmail });
        } else {
          setError("Please enter a valid PayPal email.");
        }
      }
    }, 1200);
  };

  return (
    <div className="salon-container">
      <h2 className="salon-title">Payment</h2>
      <form className="salon-form" onSubmit={handleSubmit} style={{maxWidth:400, margin:"0 auto"}}>
        <label>Payment Method</label>
        <select value={method} onChange={e => setMethod(e.target.value)} style={{marginBottom:12}}>
          <option value="credit">Credit Card</option>
          <option value="debit">Debit Card</option>
          <option value="upi">UPI</option>
          <option value="paypal">PayPal</option>
        </select>
        {(method === "credit" || method === "debit") && (
          <>
            <label>Name on Card</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Cardholder Name" />
            <label>Card Number</label>
            <input value={cardNumber} onChange={e => setCardNumber(e.target.value.replace(/\D/g, ""))} maxLength={16} placeholder="1234 5678 9012 3456" />
            <label>Expiry</label>
            <input value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="MM/YY" maxLength={5} />
            <label>CVV</label>
            <input value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, ""))} maxLength={4} placeholder="123" />
          </>
        )}
        {method === "upi" && (
          <>
            <label>UPI ID</label>
            <input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi" />
          </>
        )}
        {method === "paypal" && (
          <>
            <label>PayPal Email</label>
            <input value={paypalEmail} onChange={e => setPaypalEmail(e.target.value)} placeholder="your@email.com" />
          </>
        )}
        <div style={{marginTop:18, fontWeight:600}}>Amount: <span style={{color:'#3182ce'}}>${amount}</span></div>
        {error && <div style={{color:'red', marginTop:8}}>{error}</div>}
        <div style={{marginTop:18, textAlign:'center'}}>
          <button type="button" onClick={onCancel} style={{marginRight:12, padding:"10px 20px", borderRadius:8, background:"#eee", color:"#333", border:"none", fontWeight:600, cursor:"pointer"}}>Cancel</button>
          <button type="submit" disabled={processing} style={{padding:"10px 20px", borderRadius:8, background:"#3182ce", color:"#fff", border:"none", fontWeight:600, cursor:"pointer"}}>
            {processing ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </form>
    </div>
  );
}
