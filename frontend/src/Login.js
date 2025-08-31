import React, { useState } from "react";
import "./App.css";

export default function Login({ onAuth }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const endpoint = isRegister ? "/register" : "/login";
    try {
      const res = await fetch(`http://localhost:4000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        onAuth(data.token, data.username);
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  const handleGuest = async () => {
    setError("");
    try {
      const res = await fetch("http://localhost:4000/guest", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        onAuth(data.token, "Guest");
      } else {
        setError("Guest login failed");
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="salon-container">
      <h1 className="salon-title">Salon Login</h1>
      <form className="salon-form" onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input id="username" value={username} onChange={e => setUsername(e.target.value)} required />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">{isRegister ? "Register" : "Login"}</button>
      </form>
      <button className="salon-form" style={{marginTop:8}} onClick={handleGuest}>Continue as Guest</button>
      <div style={{marginTop:12, textAlign:"center"}}>
        <button className="salon-form" style={{background:"#eee", color:"#333"}} onClick={() => setIsRegister(r => !r)}>
          {isRegister ? "Already have an account? Login" : "New user? Register"}
        </button>
      </div>
      {error && <div style={{color:"#e53e3e", marginTop:12, textAlign:"center"}}>{error}</div>}
    </div>
  );
}
