import ProductCard from "./ProductCard";

export default function ScrollerRow({ title, items = [], hideBuy = false }) {
  return (
    <section style={{margin: "24px 0"}}>
      <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8}}>
        <h2 className="section-title">{title}</h2>
      </div>
      <div className="hscroll">
        {items.map((p) => (
          <div key={p.id} className="hscroll-item">
            <ProductCard product={p} hideBuy={hideBuy} />
          </div>
        ))}
      </div>
    </section>
  );
}


