import { useState } from "react";
import { api, setToken } from "../api";
import { useNavigate } from "react-router-dom";

export default function Register(){
  const [username,setU]=useState("");
  const [email,setE]=useState("");
  const [password,setP]=useState("");
  const [err,setErr]=useState("");
  const nav = useNavigate();

  const onSubmit=async(e)=>{
    e.preventDefault(); setErr("");
    try{
      const response = await api.post('/api/accounts/register/', { username, email, password });
      try{ 
        localStorage.setItem('ix_username', username);
        localStorage.setItem('ix_user_id', response.data.user_id || username);
        localStorage.setItem('ix_is_logged_in', 'true');
      }catch(_){}
      
      // Dispatch custom event to update header
      window.dispatchEvent(new CustomEvent('loginStateChanged', {
        detail: { isLoggedIn: true, username: username }
      }));
      
      alert("Account created successfully! You can now place orders.");
      nav('/');
    }catch(e){ setErr(e?.response?.data?.detail || 'Failed to register'); }
  };

  return (
    <div>
      <h1 className="section-title">Create account</h1>
      <div className="card" style={{maxWidth: 460, marginTop: 12}}>
        <div className="card-body">
          <form onSubmit={onSubmit} style={{display:'grid', gap:10}}>
            <input className="input" placeholder="Username" value={username} onChange={e=>setU(e.target.value)} />
            <input className="input" placeholder="Email (optional)" value={email} onChange={e=>setE(e.target.value)} />
            <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setP(e.target.value)} />
            {err && <div style={{color:'#ef4444', fontSize:13}}>{err}</div>}
            <button className="btn btn-gold" type="submit">Sign up</button>
          </form>
        </div>
      </div>
    </div>
  );
}


