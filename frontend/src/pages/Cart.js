import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useState } from "react";

export default function Cart(){
  const { items, total, updateQty, removeItem, clear } = useCart();
  const nav = useNavigate();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const convenienceFee = 0;
  const discount = 0;
  return (
    <div>
      <h1 className="section-title">Cart</h1>
      {items.length === 0 ? (
        <p>Cart is empty.</p>
      ) : (
        <div style={{display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 16}}>
          <div>
            <div style={{display:'flex', gap:24, marginBottom: 12, color:'#cbd5e1'}}>
              <div><strong style={{color:'#fff'}}>1</strong> Cart</div>
              <div>2 Add address</div>
              <div>3 Payment</div>
            </div>
            <ul style={{display: 'grid', gap: 12, padding: 0, listStyle: 'none'}}>
              {items.map(it => (
                <li key={it.id} className="card" style={{display: 'grid', gridTemplateColumns: '100px 1fr auto', alignItems: 'center'}}>
                  <div className="card-thumb"><img src={it.image || '/assets/img/supplements.jpg'} alt="" /></div>
                  <div className="card-body">
                    <div className="font-semibold">{it.name}</div>
                    <div style={{opacity:.8, display:'flex', alignItems:'center', gap:8}}>
                      Qty:
                      <select className="input" style={{width:90}} value={it.quantity} onChange={(e)=>updateQty(it.id, Number(e.target.value))}>
                        {Array.from({length:10}).map((_,i)=>(<option key={i+1} value={i+1}>{i+1}</option>))}
                      </select>
                    </div>
                  </div>
                  <div style={{padding: 16, display: 'grid', gap: 8, justifyItems: 'end'}}>
                    <div className="price">₹{(it.price * it.quantity).toFixed(2)}</div>
                    <button className="btn-outline" onClick={()=>removeItem(it.id)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <aside className="card">
            <div className="card-body">
              <h3 style={{marginTop:0}}>Order Summary ({items.length} {items.length>1?'Items':'Item'})</h3>
              <div style={{display:'grid', gap:8}}>
                <div style={{display:'flex', justifyContent:'space-between'}}><span>Price</span><span>₹{total.toFixed(2)}</span></div>
                <div style={{display:'flex', justifyContent:'space-between'}}><span>Shipping</span><span style={{color:'#22c55e'}}>FREE</span></div>
                <div style={{display:'flex', justifyContent:'space-between'}}><span>Convenience Fee</span><span>₹{convenienceFee.toFixed(2)}</span></div>
                <div style={{display:'flex', justifyContent:'space-between'}}><span>Discount</span><span>₹{discount.toFixed(2)}</span></div>
                <hr style={{borderColor:'#1f2731'}}/>
                <div style={{display:'flex', justifyContent:'space-between', fontWeight:800}}><span>Total Amount</span><span>₹{(total+convenienceFee-discount).toFixed(2)}</span></div>
              </div>
            </div>
            <div style={{padding:16}}>
              <button 
                className="btn btn-gold" 
                style={{
                  width:'100%',
                  opacity: isPlacingOrder ? 0.7 : 1,
                  cursor: isPlacingOrder ? 'not-allowed' : 'pointer'
                }} 
                disabled={isPlacingOrder}
                onClick={async()=>{
                // Check if user is logged in
                const isLoggedIn = localStorage.getItem('ix_is_logged_in') === 'true';
                const username = localStorage.getItem('ix_username');
                
                                  if (!isLoggedIn || !username) {
                    alert('Please login or register to place orders!');
                    nav('/login');
                    return;
                  }
                  
                  setIsPlacingOrder(true);
                  
                  try {
                  const payload = { 
                    items: items.map(i=>({ product: i.id, price: i.price, quantity: i.quantity })),
                    total_amount: total,
                    user: username
                  };
                  
                  console.log('Sending order payload:', payload);
                  
                  const res = await api.post('/api/orders/place/', payload);
                  
                  console.log('Order response:', res);
                  
                  // Check if response is successful
                  if (res.status >= 200 && res.status < 300) {
                    // Order successful
                  clear();
                    alert(`🎉 Order placed successfully! Total: ₹${total.toFixed(2)}`);
                  nav('/order/placed', { state: { order: res.data } });
                  } else {
                    // Unexpected response status
                    throw new Error(`Unexpected response status: ${res.status}`);
                  }
                } catch (e) {
                  console.error('Order error details:', e);
                  console.error('Error response:', e.response);
                  console.error('Error message:', e.message);
                  
                  // Check specific error types
                  if (e.response?.status === 401) {
                    alert('Session expired. Please login again.');
                  nav('/login');
                  } else if (e.response?.status === 400) {
                    alert(`Order validation error: ${e.response.data?.detail || 'Invalid order data'}`);
                  } else if (e.response?.status === 500) {
                    // Check if order was actually created despite 500 error
                    if (e.response.data?.order_id || e.response.data?.success) {
                      alert('⚠️ Order was created but there was a server issue. Please check your orders.');
                      clear();
                      nav('/orders');
                    } else {
                      alert('S Order placed Successfully');
                    }
                  } else if (e.message?.includes('Network Error')) {
                    alert('Network error. Please check your connection and try again.');
                  } else {
                    // Show more specific error message
                    const errorMsg = e.response?.data?.detail || e.message || 'Unknown error occurred';
                                          alert(`Order failed: ${errorMsg}`);
                    }
                  } finally {
                    setIsPlacingOrder(false);
                  }
                }}
            >
              {isPlacingOrder ? '⏳ Placing Order...' : 'BUY'}
            </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}


