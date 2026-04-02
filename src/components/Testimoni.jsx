import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

const testimonials = [
  {
    id: 1,
    name: "Amelia Thornton",
    role: "Fashion Blogger",
    location: "Paris, France",
    avatar: "AT",
    rating: 5,
    review:
      "Absolutely breathtaking quality. The fabric drapes like liquid silk against the skin — I've never received so many compliments in my life.",
    dress: "Velvet Noir Evening Gown",
  },
  {
    id: 2,
    name: "Sophia Delacroix",
    role: "Event Stylist",
    location: "Milan, Italy",
    avatar: "SD",
    rating: 5,
    review:
      "As a stylist, I have incredibly high standards. This collection exceeded every expectation — pure artistry.",
    dress: "Ivory Pearl Midi Dress",
  },
  {
    id: 3,
    name: "Isabella Moreau",
    role: "Luxury Bride",
    location: "Monaco",
    avatar: "IM",
    rating: 5,
    review:
      "I wore this for my wedding reception and every single guest asked about it. Timeless elegance.",
    dress: "Champagne Lace A-Line",
  },
  {
    id: 4,
    name: "Charlotte Voss",
    role: "CEO & Entrepreneur",
    location: "Vienna, Austria",
    avatar: "CV",
    rating: 5,
    review:
      "I wore this to a gala and felt transformed. The craftsmanship is extraordinary.",
    dress: "Midnight Satin Column Dress",
  },
];

const StarIcon = () => (
  <span style={{ color: "#e5c97a", fontSize: "14px" }}>★</span>
);

export default function Testimoni() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section style={styles.section}>
      <Container>
        {/* Header */}
        <div style={styles.headerWrap}>
          <p style={styles.eyebrow}>— Client Stories —</p>
          <h2 style={styles.heading}>
            Worn With <span style={styles.gold}>Elegance</span>
          </h2>
          <p style={styles.subheading}>
            Discover why discerning women choose timeless luxury.
          </p>
        </div>

        {/* Cards */}
        <Row className="g-4">
          {testimonials.map((t) => {
            const isHovered = hoveredId === t.id;

            return (
              <Col key={t.id} md={6} xl={3}>
                <div
                  style={{
                    ...styles.card,
                    ...(isHovered ? styles.cardHover : {}),
                  }}
                  onMouseEnter={() => setHoveredId(t.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Stars */}
                  <div style={{ marginBottom: 10 }}>
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </div>

                  {/* Review */}
                  <p style={styles.review}>"{t.review}"</p>

                  {/* Dress */}
                  <div style={styles.tag}>{t.dress}</div>

                  {/* Author */}
                  <div style={styles.author}>
                    <div style={styles.avatar}>{t.avatar}</div>
                    <div>
                      <div style={styles.name}>{t.name}</div>
                      <div style={styles.role}>{t.role}</div>
                      <div style={styles.location}>📍 {t.location}</div>
                    </div>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>

        {/* CTA */}
        <div style={styles.ctaWrap}>
          <p style={styles.ctaText}>
            Join <span style={styles.gold}>12,000+</span> women
          </p>
          <button style={styles.btn}>Explore Collection</button>
        </div>
      </Container>
    </section>
  );
}

const styles = {
  section: {
    background: "linear-gradient(135deg, #faf9f8,)",
    padding: "100px 0",
    color: "#0f0f0f",
    fontFamily: "'Cormorant Garamond', serif",
  },

  headerWrap: {
    textAlign: "center",
    marginBottom: 60,
  },

  eyebrow: {
    letterSpacing: 5,
    fontSize: 12,
    color: "#070706",
    marginBottom: 10,
  },

  heading: {
    fontSize: "48px",
    fontWeight: 300,
  },

  gold: {
    color: "#0a0a0a",
    fontStyle: "italic",
  },

  subheading: {
    color: "#080808",
    maxWidth: 500,
    margin: "10px auto",
  },

  card: {
    background: "#222",
    border: "1px solid rgba(229, 201, 122, 0.2)",
    borderRadius: 16,
    padding: 25,
    transition: "0.3s",
    height: "100%",
  },

  cardHover: {
    transform: "translateY(-8px)",
    boxShadow: "0 15px 40px rgba(0,0,0,0.4)",
    borderColor: "#e5c97a",
  },

  review: {
    color: "#eaeaea",
    fontSize: 15,
    lineHeight: 1.7,
    marginBottom: 15,
  },

  tag: {
    color: "#e5c97a",
    border: "1px solid #e5c97a",
    padding: "5px 12px",
    borderRadius: 20,
    display: "inline-block",
    fontSize: 11,
    marginBottom: 15,
  },

  author: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  avatar: {
    background: "#e5c97a",
    color: "#000",
    width: 40,
    height: 40,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },

  name: {
    color: "#fff",
    fontWeight: 600,
  },

  role: {
    fontSize: 12,
    color: "#c7b07a",
  },

  location: {
    fontSize: 12,
    color: "#aaa",
  },

  ctaWrap: {
    textAlign: "center",
    marginTop: 60,
  },

  ctaText: {
    marginBottom: 20,
  },

  btn: {
    border: "1px solid #020202",
    color: "#080808",
    padding: "12px 30px",
    background: "transparent",
    borderRadius: 30,
    cursor: "pointer",
    transition: "0.3s",
  },
};
