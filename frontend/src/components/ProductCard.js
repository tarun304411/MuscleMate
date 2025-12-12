import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { pickImageCandidates } from "../utils/pickImage";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product, hideBuy = false }){
  const candidates = pickImageCandidates(product.name, product.category?.name, product.image);
  const [idx, setIdx] = useState(0);
  const img = candidates[idx] || candidates[candidates.length - 1];
  const { addItem } = useCart();
  const nav = useNavigate();

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };
  const handleBuy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    nav("/cart");
  };

  return (
    <Link to={`/product/${product.id}`} state={{ product }} className="card" title={product.name} aria-label={product.name}>
      <div className="card-thumb">
        <img src={img} alt={product.name} onError={()=> setIdx(i => Math.min(i+1, candidates.length-1))}/>
      </div>
      <div className="card-body">
        <span className="title">{product.name}</span>
        <div className="price">₹{Number(product.price).toFixed(2)}</div>
      </div>
      <div className="card-actions">
        <button className="btn btn-outline" onClick={handleAdd}>Add to Cart</button>
        {!hideBuy && (
          <button className="btn" onClick={handleBuy}>Buy Now</button>
        )}
      </div>
    </Link>
  );
}


