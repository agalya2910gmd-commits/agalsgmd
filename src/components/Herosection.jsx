import React, { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";

const slides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1600&q=80",
    tag: "New Collection",
    headline: ["DEFINE YOUR", "STYLE"],
    sub: "Premium menswear crafted for the bold.",
    accent: "#e8c97e",
  },
];

const keyframes = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes slideTag {
  from { opacity: 0; transform: translateX(-18px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes scaleIn {
  from { transform: scale(1.08); }
  to   { transform: scale(1); }
}

.hero-slide-content .tag  { animation: slideTag 0.6s ease forwards; }
.hero-slide-content h1    { animation: fadeUp  0.7s 0.15s ease both; text-align: left; }
.hero-slide-content p     { animation: fadeUp  0.7s 0.3s  ease both; text-align: left; }
.hero-slide-content .badge-row { animation: fadeIn 0.8s 0.6s ease both; justify-content: flex-start; }

.hero-carousel-img { animation: scaleIn 8s ease forwards; }

.hero-dot {
  width: 28px; height: 3px; border-radius: 2px;
  background: rgba(255,255,255,0.35);
  border: none; padding: 0; cursor: pointer;
  transition: background 0.3s, width 0.3s;
}
.hero-dot.active { width: 48px; background: #fff; }

.hero-scroll-hint {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  z-index: 10;
  opacity: 0.5;
}
.scroll-line {
  width: 1px; height: 40px;
  background: linear-gradient(to bottom, transparent, #fff);
  animation: scrollPulse 2s ease-in-out infinite;
}
@keyframes scrollPulse {
  0%,100% { opacity: 0.4; transform: scaleY(1); }
  50% { opacity: 1; transform: scaleY(1.15); }
}
`;

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
    setAnimKey((k) => k + 1);
  };

  useEffect(() => {
    setAnimKey((k) => k + 1);
  }, []);

  const slide = slides[index];

  return (
    <>
      <style>{keyframes}</style>
      <section
        style={{
          position: "relative",
          height: "100vh",
          overflow: "hidden",
          background: "#0a0a0a",
        }}
      >
        {/* Bootstrap Carousel (image only, no controls/indicators) */}
        <Carousel
          activeIndex={index}
          onSelect={handleSelect}
          controls={false}
          indicators={false}
          fade
          interval={5000}
          style={{ position: "absolute", inset: 0, height: "100%" }}
        >
          {slides.map((s) => (
            <Carousel.Item key={s.id} style={{ height: "100vh" }}>
              <div
                className="hero-carousel-img"
                style={{
                  height: "100vh",
                  width: "100%",
                  backgroundImage: `url(${s.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center top",
                }}
              />
            </Carousel.Item>
          ))}
        </Carousel>

        {/* Gradient overlays */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            background:
              "linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)",
          }}
        />

        {/* Slide number */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "40px",
            transform: "translateY(-50%)",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              className={`hero-dot${index === i ? " active" : ""}`}
              onClick={() => handleSelect(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Main content */}
        <div
          key={animKey}
          className="hero-slide-content"
          style={{
            position: "absolute",
            zIndex: 5,
            top: "50%",
            left: "6%",
            transform: "translateY(-50%)",
            maxWidth: "600px",
            width: "100%",
            textAlign: "left",
          }}
        >
          {/* Tag */}
          <div
            className="tag"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "22px",
              justifyContent: "flex-start",
            }}
          >
            <span
              style={{
                width: "28px",
                height: "1.5px",
                background: slide.accent,
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "11px",
                letterSpacing: "4px",
                textTransform: "uppercase",
                color: slide.accent,
                fontWeight: "500",
              }}
            >
              {slide.tag}
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(64px, 9vw, 110px)",
              lineHeight: "0.92",
              color: "#fff",
              letterSpacing: "2px",
              marginBottom: "24px",
              opacity: 0,
              textAlign: "left",
              marginLeft: 0,
              marginRight: 0,
            }}
          >
            {slide.headline[0]}
            <br />
            <span style={{ color: slide.accent }}>{slide.headline[1]}</span>
          </h1>

          {/* Subtext */}
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "16px",
              color: "rgba(255,255,255,0.7)",
              fontWeight: "300",
              letterSpacing: "0.3px",
              marginBottom: "36px",
              opacity: 0,
              textAlign: "left",
              marginLeft: 0,
              marginRight: 0,
            }}
          >
            {slide.sub}
          </p>

          {/* Stats badges */}
          <div
            className="badge-row"
            style={{
              display: "flex",
              gap: "28px",
              marginTop: "52px",
              opacity: 0,
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            {[
              ["500+", "Styles"],
              ["4.9★", "Rating"],
              ["Free", "Shipping"],
            ].map(([num, label]) => (
              <div key={label} style={{ textAlign: "left" }}>
                <p
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "22px",
                    color: "#fff",
                    marginBottom: "2px",
                    textAlign: "left",
                  }}
                >
                  {num}
                </p>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "10px",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.45)",
                    margin: 0,
                    textAlign: "left",
                  }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Slide counter bottom left */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            left: "6%",
            zIndex: 10,
            display: "flex",
            alignItems: "baseline",
            gap: "4px",
          }}
        >
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "36px",
              color: "#fff",
              lineHeight: 1,
            }}
          >
            0{index + 1}
          </span>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "12px",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            / 0{slides.length}
          </span>
        </div>

        {/* Scroll hint */}
        <div className="hero-scroll-hint">
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "9px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#fff",
            }}
          >
            scroll
          </span>
          <div className="scroll-line" />
        </div>
      </section>
    </>
  );
}
