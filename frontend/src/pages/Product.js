import { useEffect, useMemo, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { api } from "../api";
import { useCart } from "../context/CartContext";
import { pickImageCandidates } from "../utils/pickImage";

export default function Product(){
  const {id}=useParams();
  const location = useLocation();
  const prefetched = location.state?.product || null;
  const [p,setP]=useState(prefetched);
  const [loading,setLoading]=useState(true);
  const { addItem } = useCart();
  useEffect(()=>{
    if (prefetched) { setLoading(false); return; }
    api.get(`/api/products/items/${id}/`).then(r=>setP(r.data)).catch(()=>setP(null)).finally(()=>setLoading(false));
  },[id]);
  const images = useMemo(() => pickImageCandidates(p?.name, p?.category?.name, p?.image), [p]);
  const [idx, setIdx] = useState(0);
  if(loading) return <p>Loading...</p>;
  if(!p) return <p>Not found</p>;
  const src = images[idx] || images[images.length-1];
  return (
    <div className="product">
      <div className="product-media">
        <div className="product-main">
          <img src={src} alt={p.name} onError={()=> setIdx(i => Math.min(i+1, images.length-1))}/>
        </div>
        <div className="thumbs">
          {images.map((u, i) => (
            <button className={"thumb" + (i===idx ? " active" : "")} key={i} onClick={()=>setIdx(i)}>
              <img src={u} alt="" onError={(e)=>{ e.currentTarget.style.display = 'none'; }} />
            </button>
          ))}
        </div>
      </div>
      <div>
        <h1 className="product-title">{p.name}</h1>
        <div className="product-price">₹{Number(p.price).toFixed(2)}</div>
        <p style={{marginTop: 10, color: "#475569", whiteSpace: "pre-line"}}>{p.description || "No description"}</p>
        <div className="sticky-actions" style={{gridTemplateColumns: '1fr'}}>
          <button className="btn btn-gold" onClick={()=> { addItem(p, 1); }}>ADD TO CART</button>
        </div>
      </div>
    </div>
  );
}


