import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "ix_cart_v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(saved)) setItems(saved);
    } catch (_) { /* ignore */ }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product, quantity = 1) => {
    setItems(prev => {
      const found = prev.find(x => x.id === product.id);
      
      if (found) {
        return prev.map(x => x.id === product.id ? { ...x, quantity: x.quantity + quantity } : x);
      }
      
      return [...prev, { 
        id: product.id, 
        name: product.name, 
        price: Number(product.price) || 0, 
        quantity, 
        image: product.image
      }];
    });
  };

  const updateQty = (id, quantity) => {
    setItems(prev => prev.map(x => x.id === id ? { ...x, quantity: Math.max(1, quantity) } : x));
  };

  const removeItem = (id) => setItems(prev => prev.filter(x => x.id !== id));
  const clear = () => setItems([]);

  const total = useMemo(() => items.reduce((s, x) => s + x.price * x.quantity, 0), [items]);
  const count = useMemo(() => items.reduce((s, x) => s + x.quantity, 0), [items]);

  const value = useMemo(() => ({ items, addItem, updateQty, removeItem, clear, total, count }), [items, total, count]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}


