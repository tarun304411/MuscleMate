import { Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Product from "./pages/Product";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import OrderPlaced from "./pages/OrderPlaced";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";

import CalorieCalculator from "./pages/CalorieCalculator";
import AIFitnessCoach from "./components/AIFitnessCoach";
import { CartProvider, useCart } from "./context/CartContext";
import { api } from "./api";
import Footer from "./components/Footer";

function Header(){
  const { count, clear } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  
  // Check login status on component mount
  useEffect(() => {
    const checkLoginStatus = () => {
      const loginStatus = localStorage.getItem('ix_is_logged_in') === 'true';
      const currentUsername = localStorage.getItem('ix_username');
      setIsLoggedIn(loginStatus);
      setUsername(currentUsername);
    };
    
    checkLoginStatus();
    
    // Listen for storage changes
    window.addEventListener('storage', checkLoginStatus);
    
    // Listen for custom login state changes
    const handleLoginStateChange = (event) => {
      const { isLoggedIn, username } = event.detail;
      setIsLoggedIn(isLoggedIn);
      setUsername(username);
    };
    
    window.addEventListener('loginStateChanged', handleLoginStateChange);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('loginStateChanged', handleLoginStateChange);
    };
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    
    // Show confirmation
    if (!confirm('Are you sure you want to logout?')) {
      return;
    }
    
    try {
      // Call backend logout
      await api.post('/api/accounts/session-logout/');
    } catch (error) {
      console.log('Backend logout failed:', error);
    }
    
    try {
      // Clear cart and local storage
      clear();
      localStorage.removeItem('ix_cart_v1');
      localStorage.removeItem('ix_username');
      localStorage.removeItem('ix_user_id');
      localStorage.removeItem('ix_is_logged_in');
      
      // Show success message
      alert('Logged out successfully!');
      
      // Redirect to home
      window.location.href = '/';
    } catch (error) {
      console.log('Local cleanup failed:', error);
      // Still redirect even if cleanup fails
      window.location.href = '/';
    }
  };

  return (
    <header className="site-header">
      <div className="container">
        <div className="nav">
          <Link to="/" className="brand" style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <img src="/assets/logo.svg" alt="MuscleMate" width="28" height="28"/>
                          <span style={{color: 'white'}}>Muscle<span style={{color: 'var(--brand)'}}>Mate</span></span>
          </Link>
                      <nav>
              <Link to="/">Home</Link>
                              <Link to="/about">About</Link>

                <Link to="/calories">Calorie Calculator</Link>
                <Link to="/ai-coach">AI Coach</Link>
                {isLoggedIn && <Link to="/orders">Orders</Link>}
              {!isLoggedIn ? (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/register">Register</Link>
                </>
              ) : (
                <>
                  <span style={{color: 'var(--brand)', fontWeight: '600'}}>Hi, {username}!</span>
                  <button 
                    onClick={handleLogout}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = '#ef4444';
                      e.target.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'none';
                      e.target.style.color = '#ef4444';
                    }}
                  >
                    🚪 Logout
                  </button>
                </>
              )}
              <Link to="/cart">Cart ({count})</Link>
              <Link to="/contact">Contact</Link>
            </nav>
        </div>
      </div>
    </header>
  );
}

export default function App(){
  return (
    <div>
      <CartProvider>
        <Header />
        <main className="container" style={{padding: "24px 0"}}>
                     <Routes>
             <Route path="/" element={<Home/>} />
             <Route path="/login" element={<Login/>} />
             <Route path="/register" element={<Register/>} />
                             <Route path="/about" element={<About/>} />

                <Route path="/calories" element={<CalorieCalculator/>} />
                <Route path="/ai-coach" element={<AIFitnessCoach/>} />
                <Route path="/contact" element={<Contact/>} />
             <Route path="/product/:id" element={<Product/>} />
             <Route path="/cart" element={<Cart/>} />
             <Route path="/order/placed" element={<OrderPlaced/>} />
             <Route path="/orders" element={<Orders/>} />
           </Routes>
        </main>
        <Footer />
      </CartProvider>
    </div>
  );
}


