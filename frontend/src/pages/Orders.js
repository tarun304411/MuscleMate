
import { useEffect, useState } from "react";
import { api } from "../api";

export default function Orders(){
  const [data,setData]=useState({count:0,orders:[]});
  const [err,setErr]=useState("");
  const [loading, setLoading] = useState(true);
  const [productNames, setProductNames] = useState({});
  
  // Fetch product names for all products
  const fetchProductNames = async (productIds) => {
    try {
      const uniqueIds = [...new Set(productIds)];
      console.log('🔍 Fetching product names for IDs:', uniqueIds);
      const names = {};
      
      for (const id of uniqueIds) {
        try {
          console.log(` Fetching product ${id}...`);
          const response = await api.get(`/api/products/items/${id}/`);
          console.log(` Product ${id} response:`, response.data);
          if (response.data && response.data.name) {
            names[id] = response.data.name;
            console.log(` Product ${id} name set to:`, response.data.name);
          } else {
            names[id] = `Product #${id}`; // Fallback if no name
            console.log(` Product ${id} no name found, using fallback`);
          }
        } catch (error) {
          console.error(` Error fetching product ${id}:`, error);
          names[id] = `Product #${id}`; // Fallback if product not found
        }
      }
      
      console.log(' Final product names object:', names);
      setProductNames(names);
    } catch (error) {
      console.error('Error fetching product names:', error);
    }
  };
  
  useEffect(()=>{ 
    setLoading(true);
    api.get('/api/orders/mine/')
      .then(r => {
        console.log(' Orders data received:', r.data);
        setData(r.data);
        
        // Extract all product IDs from orders
        const allProductIds = [];
        r.data.orders.forEach(order => {
          console.log(' Order:', order);
          order.items.forEach(item => {
            console.log(' Item:', item);
            allProductIds.push(item.product);
          });
        });
        
        console.log(' All product IDs found:', allProductIds);
        
        // Fetch product names
        if (allProductIds.length > 0) {
          fetchProductNames(allProductIds);
        }
      })
      .catch(() => setErr('Login required'))
      .finally(() => setLoading(false));
  },[]);
  
  if (loading) {
    return (
      <div style={{
        textAlign: 'center', 
        padding: '60px 0',
        background: 'linear-gradient(180deg, #0b0f14 0%, #131a22 100%)',
        borderRadius: '16px',
        border: '1px solid #1f2731',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.25)',
        margin: '0 auto',
        maxWidth: '1200px'
      }}>
        <div style={{fontSize: '32px', color: '#0ea5e9', marginBottom: '16px'}}>⏳</div>
        <div style={{fontSize: '18px', color: '#e2e8f0'}}>Loading your orders...</div>
      </div>
    );
  }
  
  return (
    <div style={{
      maxWidth: '1200px', 
      margin: '0 auto',
      background: 'linear-gradient(180deg, #0b0f14 0%, #131a22 100%)',
      borderRadius: '16px',
      border: '1px solid #1f2731',
      boxShadow: '0 16px 40px rgba(0, 0, 0, 0.25)',
      overflow: 'hidden',
      padding: '32px'
    }}>
      <h1 style={{
        textAlign: 'center',
        marginBottom: '40px',
        color: 'white',
        fontSize: '32px',
        fontWeight: '800',
        textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
      }}>
        📋 My Orders
      </h1>
      
      {err && (
        <div style={{
          color:'#ef4444', 
          textAlign: 'center', 
          padding: '30px',
          background: 'rgba(239, 68, 68, 0.1)',
          borderRadius: '12px',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          marginBottom: '30px'
        }}>
          <div style={{fontSize: '18px', marginBottom: '8px'}}> {err}</div>
        </div>
      )}
      
      {data.count===0 ? (
                 <div style={{
           textAlign: 'center', 
           padding: '80px 40px',
           background: '#121821',
           borderRadius: '16px',
           border: '1px solid #1f2731',
           boxShadow: '0 16px 40px rgba(0, 0, 0, 0.25)'
         }}>
          <div style={{fontSize: '64px', marginBottom: '24px'}}>📦</div>
          <div style={{fontSize: '28px', fontWeight: '700', marginBottom: '12px', color: '#fff'}}>No Orders Yet</div>
          <div style={{color: '#94a3b8', fontSize: '18px', marginBottom: '24px'}}>Start shopping to see your orders here!</div>
          <div style={{
            background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '25px',
            fontSize: '16px',
            fontWeight: '600',
            display: 'inline-block',
            cursor: 'pointer'
          }}>
            🛍️ Start Shopping
          </div>
        </div>
      ) : (
        <div style={{display:'grid', gap: '32px'}}>
          {data.orders.map(o=> (
                         <div key={o.id} className="card" style={{
               background: '#121821',
               border: '1px solid #1f2731',
               borderRadius: '16px',
               overflow: 'hidden',
               boxShadow: '0 16px 40px rgba(0, 0, 0, 0.25)',
               transition: 'all 0.3s ease'
             }}>
                             {/* Order Header */}
               <div style={{
                 background: 'linear-gradient(90deg, rgba(255,255,255,.05), rgba(255,255,255,.02))',
                 padding: '28px 32px',
                 borderBottom: '1px solid #1f2731',
                 position: 'relative'
               }}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap'}}>
                    <div style={{
                      background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)',
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '25px',
                      fontSize: '16px',
                      fontWeight: '700',
                      boxShadow: '0 4px 15px rgba(14, 165, 233, 0.4)'
                    }}>
                       Order #{o.id}
                    </div>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      <span style={{color: '#94a3b8', fontSize: '15px'}}>
                        By: <span style={{color: '#fff', fontWeight: '600'}}>{o.user_name}</span>
                      </span>
                    </div>
                  </div>
                  <div style={{
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    padding: '16px 28px',
                    borderRadius: '16px',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '20px',
                    boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)',
                    border: '2px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    ₹{Number(o.total_amount).toFixed(2)}
                  </div>
                </div>
                
                {Number(o.discount_amount) > 0 && (
                  <div style={{
                    marginTop: '20px',
                    padding: '12px 20px',
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.15))',
                    border: '2px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '12px',
                    color: '#f59e0b',
                    fontSize: '16px',
                    fontWeight: '600',
                    display: 'inline-block',
                    boxShadow: '0 4px 15px rgba(245, 158, 11, 0.2)'
                  }}>
                     You saved ₹{Number(o.discount_amount).toFixed(2)} on this order!
                  </div>
                )}
              </div>
              
                             {/* Order Items */}
               <div className="card-body" style={{
                 padding: '32px',
                 background: 'rgba(17,21,27,.88)'
               }}>
                 <div style={{marginBottom: '24px'}}>
                   <h3 style={{
                     fontSize: '22px',
                     fontWeight: '700',
                     color: 'white',
                     margin: '0 0 20px 0',
                     display: 'flex',
                     alignItems: 'center',
                     gap: '12px'
                   }}>
                     <span style={{
                       background: '#0ea5e9',
                       padding: '8px 16px',
                       borderRadius: '20px',
                       fontSize: '16px',
                       color: 'white',
                       fontWeight: '600',
                       boxShadow: '0 4px 15px rgba(14, 165, 233, 0.4)'
                     }}>
                       {o.items.length} {o.items.length === 1 ? 'Item' : 'Items'}
                     </span>
                     Order Details
                   </h3>
                 </div>
                
                <div style={{display: 'grid', gap: '20px'}}>
                  {o.items.map((it,i)=>(
                                         <div key={i} style={{
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'space-between',
                       padding: '24px',
                       background: '#0f141b',
                       borderRadius: '12px',
                       border: '1px solid #334155',
                       transition: 'all 0.3s ease',
                       cursor: 'pointer'
                     }}
                     onMouseEnter={(e) => {
                       e.target.style.background = '#1f2937';
                       e.target.style.transform = 'translateY(-2px)';
                       e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                     }}
                     onMouseLeave={(e) => {
                       e.target.style.background = '#0f141b';
                       e.target.style.transform = 'translateY(0)';
                       e.target.style.boxShadow = 'none';
                     }}
                     >
                      <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
                        <div style={{
                          background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)',
                          color: 'white',
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          fontWeight: '700',
                          boxShadow: '0 4px 15px rgba(14, 165, 233, 0.4)',
                          border: '2px solid rgba(255, 255, 255, 0.2)'
                        }}>
                          {it.quantity}
                        </div>
    <div>
                                                                               <div style={{
                             fontSize: '20px',
                             fontWeight: '700',
                             color: '#ffffff',
                             marginBottom: '8px',
                             textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
                           }}>
                             {productNames[it.product] || `Product #${it.product}`}
                           </div>
                           <div style={{
                             fontSize: '16px',
                             color: '#e2e8f0',
                             marginBottom: '4px',
                             fontWeight: '500'
                           }}>
                             Unit Price: ₹{Number(it.price).toFixed(2)}
                           </div>
                           <div style={{
                             fontSize: '14px',
                             color: '#cbd5e1',
                             fontStyle: 'italic',
                             fontWeight: '400'
                           }}>
                             Product ID: #{it.product}
                           </div>
                           
                        </div>
                      </div>
                      
                      <div style={{
                        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                        padding: '12px 20px',
                        borderRadius: '12px',
                        color: 'white',
                        fontWeight: '700',
                        fontSize: '18px',
                        boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)',
                        border: '2px solid rgba(255, 255, 255, 0.2)'
                      }}>
                        ₹{(Number(it.price) * it.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
                                 {/* Order Summary */}
                 <div style={{
                   marginTop: '32px',
                   padding: '28px',
                   background: '#0f141b',
                   borderRadius: '12px',
                   border: '1px solid #334155',
                   boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
                 }}>
                   <h4 style={{
                     fontSize: '20px',
                     fontWeight: '700',
                     color: 'white',
                     margin: '0 0 24px 0',
                     textAlign: 'center'
                   }}>
                     💰 Order Summary
                   </h4>
                  
                  <div style={{
                    display: 'grid',
                    gap: '16px',
                    marginBottom: '24px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 0'
                    }}>
                      <span style={{color: '#e2e8f0', fontSize: '17px', fontWeight: '600'}}>Subtotal:</span>
                      <span style={{color: '#ffffff', fontSize: '17px', fontWeight: '700', textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'}}>
                        ₹{(Number(o.total_amount) + Number(o.discount_amount || 0)).toFixed(2)}
                      </span>
                    </div>
                    
                    {Number(o.discount_amount) > 0 && (
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 0'
                      }}>
                        <span style={{color: '#fbbf24', fontSize: '17px', fontWeight: '600'}}>Discount:</span>
                        <span style={{color: '#fbbf24', fontSize: '17px', fontWeight: '700', textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'}}>
                          -₹{Number(o.discount_amount).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px',
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(22, 163, 74, 0.15))',
                    borderRadius: '12px',
                    border: '2px solid rgba(34, 197, 94, 0.3)',
                    boxShadow: '0 4px 20px rgba(34, 197, 94, 0.2)'
                  }}>
                    <span style={{color: '#ffffff', fontSize: '22px', fontWeight: '700', textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'}}>Total Amount:</span>
                    <span style={{
                      color: '#22c55e',
                      fontSize: '26px',
                      fontWeight: '800',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
                    }}>
                      ₹{Number(o.total_amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


