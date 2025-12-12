import { useEffect, useState } from "react";
import ScrollerRow from "../components/ScrollerRow";
import { api } from "../api";

export default function Home(){
  const [items,setItems]=useState([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{ api.get("/api/products/items/").then(r=>setItems(r.data.results ?? r.data)).finally(()=>setLoading(false)); },[]);
  const fallback = [
    { id: 101, name: "MuscleMate Whey 1kg", price: 2499 },
    { id: 102, name: "MuscleMate Power Belt", price: 1299 },
    { id: 104, name: "Creatine Monohydrate 300g", price: 899 },
    { id: 105, name: "BCAA 2:1:1 250g", price: 799 },
    { id: 106, name: "Pre Workout Xtreme", price: 1199 },
    { id: 107, name: "Shaker Bottle 750ml", price: 299 },
  ];

  return (
    <div>
                           <section className="hero" style={{
                background: 'linear-gradient(180deg, #0b0f14 0%, #131a22 100%)',
                padding: '32px',
                borderRadius: '16px',
                margin: '24px 0',
                textAlign: 'center',
                color: 'white',
                border: '1px solid #1f2731',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.25)'
              }}>
          <h1 className="text-3xl font-extrabold" style={{margin: '0 0 16px 0', color: 'white'}}>MuscleMate Gym Supplements</h1>
          <p style={{margin: 0, opacity: 0.9, fontSize: '18px'}}>Premium nutrition for serious athletes.</p>
          {/* <button className="cta">Shop Now</button> */}
        </section>
       
               

                     <div style={{
               background: 'linear-gradient(180deg, #0b0f14 0%, #131a22 100%)',
               padding: '32px',
               borderRadius: '16px',
               margin: '24px 0',
               textAlign: 'center',
               color: 'white',
               border: '1px solid #1f2731',
               boxShadow: '0 16px 40px rgba(0, 0, 0, 0.25)'
             }}>
               <h2 style={{margin: '0 0 16px 0', fontSize: '24px'}}>
                 🍎 Calorie Deficit Calculator & Meal Planner
               </h2>
               <p style={{margin: '0 0 20px 0', opacity: 0.9, lineHeight: 1.6}}>
                 Calculate your daily calorie needs and get personalized meal suggestions for veg/non-veg. 
                 Perfect for weight loss, maintenance, or muscle gain goals!
               </p>
               <a 
                 href="/calories" 
                 style={{
                   display: 'inline-block',
                   padding: '12px 24px',
                   backgroundColor: '#f59e0b',
                   color: '#0b0f14',
                   textDecoration: 'none',
                   borderRadius: '8px',
                   fontWeight: '600',
                   transition: 'transform 0.2s'
                 }}
                 onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                 onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
               >
                 Calculate Calories Now →
               </a>
             </div>

             <div style={{
               background: 'linear-gradient(180deg, #0b0f14 0%, #131a22 100%)',
               padding: '32px',
               borderRadius: '16px',
               margin: '24px 0',
               textAlign: 'center',
               color: 'white',
               border: '1px solid #1f2731',
               boxShadow: '0 16px 40px rgba(0, 0, 0, 0.25)'
             }}>
               <h2 style={{margin: '0 0 16px 0', fontSize: '24px'}}>
                 🤖 AI Fitness Coach - Your Personal Trainer
               </h2>
               <p style={{margin: '0 0 20px 0', opacity: 0.9, lineHeight: 1.6}}>
                 Get personalized workout plans, nutrition advice, and fitness motivation from our AI Coach! 
                 Ask anything about fitness, workouts, or nutrition in Hindi/English/Hinglish! 💪✨
               </p>
               <a 
                 href="/ai-coach" 
                 style={{
                   display: 'inline-block',
                   padding: '12px 24px',
                   backgroundColor: '#f59e0b',
                   color: '#0b0f14',
                   textDecoration: 'none',
                   borderRadius: '8px',
                   fontWeight: '600',
                   transition: 'transform 0.2s'
                 }}
                 onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                 onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
               >
                 Chat with AI Coach Now →
               </a>
             </div>
      {loading ? (
        <div className="grid">{Array.from({length:6}).map((_,i)=>(<div key={i} className="card"><div className="card-thumb skeleton"></div><div className="card-body"><div className="skeleton" style={{height:16, width:'60%', borderRadius:6}}></div></div></div>))}</div>
      ) : (
        <>
          {(() => {
            const data = (items.length ? items : fallback);
            const by = (re) => data.filter(p => re.test(p.name || "")).slice(0, 12);
            const ensure = (re, img) => {
              const arr = by(re);
              const seed = arr.length ? arr : fallback.filter(p => re.test(p.name || "")).slice(0, 8);
              return seed.map(p => ({ ...p, image: img }));
            };
            return (
              <>
                <ScrollerRow title="Protein Powders" items={ensure(/whey|protein|iso|gainer/i, "/assets/img/gainer.jpeg")} hideBuy />
                <ScrollerRow title="Creatine" items={ensure(/creatine/i, "/assets/img/creatine.jpeg")} hideBuy />
                {/* <ScrollerRow title="Pre-Workout" items={by(/(^|\s)pre|preworkout/i).map(p => ({ ...p, image: "/assets/img/gainer.jpeg" }))} hideBuy /> */}
                <ScrollerRow title="BCAA & Aminos" items={ensure(/bcaa|amino/i, "/assets/img/bcaa.jpeg")} hideBuy />
                <ScrollerRow title="Lifting Belts" items={ensure(/belt/i, "/assets/img/belt.webp")} hideBuy />
                <ScrollerRow title="Lifting Straps" items={ensure(/strap/i, "/assets/img/straps.webp")} hideBuy />
                <ScrollerRow title="Shakers & Accessories" items={ensure(/shaker|bottle|accessor/i, "/assets/img/shaker.jpeg")} hideBuy />
              </>
            );
          })()}
        </>
      )}
    </div>
  );
}


