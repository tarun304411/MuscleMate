import { useEffect, useState } from "react";

export default function BannerCarousel({ images = [] }) {
  const fallbacks = [
    "/assets/img/banner1.svg",
    "/assets/img/banner2.svg",
    "/assets/img/banner3.svg",
  ];
  const list = images.length ? images : fallbacks;
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % list.length), 4000);
    return () => clearInterval(t);
  }, [list.length]);

  return (
    <div className="carousel">
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${i * 100}%)` }}
      >
        {list.map((src, idx) => (
          <div className="carousel-slide" key={idx}>
            <div className="banner-img" style={{ backgroundImage: `url(${src})` }} />
            <div className="carousel-overlay">
              <h2>MuscleMate Deals</h2>
              <p>Supplements • Apparel • Accessories</p>
            </div>
          </div>
        ))}
      </div>
      <div className="dots">
        {list.map((_, d) => (
          <button
            key={d}
            className={"dot" + (d === i ? " active" : "")}
            onClick={() => setI(d)}
            aria-label={`Go to slide ${d + 1}`}
          />
        ))}
      </div>
    </div>
  );
}


