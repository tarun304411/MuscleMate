import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function OrderPlaced(){
  const location = useLocation();
  const data = location.state?.order || null;
  const { clear } = useCart();

  useEffect(()=>{
    // Double-safety: empty cart and localStorage on order page load
    try { clear(); } catch(_) {}
    try { localStorage.setItem('ix_cart_v1','[]'); } catch(_) {}
  },[clear]);
  return (
    <div>
      <h1 className="section-title">Order Placed</h1>
      <div className="card" style={{maxWidth: 700, marginTop: 12}}>
        <div className="card-body">
          {data ? (
            <>
              <p>Thank you! Your order <strong>#{data.id}</strong> has been placed.</p>
              <p>Total paid: <strong>₹{Number(data.total_amount).toFixed(2)}</strong> {Number(data.discount_amount)>0 && (<span style={{opacity:.8}}>(including discount ₹{Number(data.discount_amount).toFixed(2)})</span>)}
              </p>
            </>
          ) : (
            <p>Thank you for your purchase.</p>
          )}
          <div style={{marginTop: 12}}>
            <Link className="btn" to="/">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}