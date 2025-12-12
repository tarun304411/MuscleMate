import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, setToken } from "../api";

export default function Login(){
  const [username,setU]=useState("");
  const [password,setP]=useState("");
  const [error,setError]=useState("");
  const nav = useNavigate();
  
  const onSubmit=async(e)=>{ e.preventDefault(); setError("");
    try{ 
      const response = await api.post("/api/accounts/session-login/",{username,password}); 
      try{ 
        localStorage.setItem('ix_username', username);
        localStorage.setItem('ix_user_id', response.data.user_id || username);
        localStorage.setItem('ix_is_logged_in', 'true');
      }catch(_){}
      
      // Dispatch custom event to update header
      window.dispatchEvent(new CustomEvent('loginStateChanged', {
        detail: { isLoggedIn: true, username: username }
      }));
      
      alert("Logged in successfully! You can now place orders.");
      nav('/'); // Use navigate instead of window.location
    }
    catch{ setError("Invalid credentials"); }
  };
  return (
    <div style={{maxWidth: 420, margin: "0 auto"}}>
      <h1 style={{fontSize: 24, fontWeight: 800, marginBottom: 12}}>Login</h1>
      <form onSubmit={onSubmit} style={{display: "grid", gap: 12}}>
        <input className="input" placeholder="Username" value={username} onChange={e=>setU(e.target.value)} />
        <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setP(e.target.value)} />
        {error && <div style={{color: "#dc2626", fontSize: 14}}>{error}</div>}
        <button className="btn">Sign in</button>
      </form>
      <div style={{marginTop: 10, fontSize: 14}}>
        Don’t have an account? <Link to="/register" style={{color: 'var(--brand)'}}>Register here</Link>
      </div>
    </div>
  );
}


