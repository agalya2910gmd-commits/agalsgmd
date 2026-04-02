import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaHeart,
  FaRegHeart,
  FaStar,
  FaShoppingBag,
  FaBolt,
  FaTruck,
  FaUndo,
  FaShieldAlt,
  FaChevronDown,
  FaChevronUp,
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

const globalStyles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,500&family=Jost:wght@300;400;500;600&display=swap');

* { box-sizing: border-box; }

.ab-page {
   background: linear-gradient(135deg, #e6e6ec, , #6f7072);
  min-height: 100vh;
  font-family: 'Jost', sans-serif;
  padding: 40px 0 80px;
}

/* Breadcrumb */
.ab-crumb {
  font-size: 12px;
  color: #B5975A;
  letter-spacing: 0.5px;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.ab-crumb span { color: #F0EBF8; font-weight: 500; }

/* Hero Section */
.ab-hero {
  text-align: center;
  margin-bottom: 60px;
  padding: 40px 0;
}
.ab-hero-badge {
  font-size: 11px;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: #B5975A;
  margin-bottom: 16px;
}
.ab-hero-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(36px, 5vw, 56px);
  font-weight: 700;
  color: #030303;
  margin-bottom: 20px;
}
.ab-hero-title em {
  font-style: italic;
  color: #B5975A;
}
.ab-hero-subtitle {
  font-size: 16px;
  color: #111010;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Story Section */
.ab-story-section {
  margin-bottom: 70px;
}
.ab-section-title {
  font-family: 'Playfair Display', serif;
  font-size: 28px;
  font-weight: 600;
  color: #0b0b0c;
  margin-bottom: 30px;
  position: relative;
  display: inline-block;
}
.ab-section-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 60px;
  height: 2px;
  background: #B5975A;
}
.ab-story-text {
  color: #0e0d0d;
  line-height: 1.8;
  font-size: 15px;
  margin-bottom: 20px;
}
.ab-story-image {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}
.ab-story-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.ab-story-image:hover img {
  transform: scale(1.05);
}

/* Stats Section */
.ab-stats {
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  padding: 50px 30px;
  margin: 60px 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  text-align: center;
}
.ab-stat-item {
  text-align: center;
}
.ab-stat-number {
  font-family: 'Playfair Display', serif;
  font-size: 42px;
  font-weight: 700;
  color: #B5975A;
  margin-bottom: 8px;
}
.ab-stat-label {
  font-size: 13px;
  color: #ccc;
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* Divider */
.ab-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(196,168,224,0.3), transparent);
  margin: 40px 0;
}
`;

export default function About() {
  return (
    <>
      <style>{globalStyles}</style>
      <div className="ab-page">
        <Container>
          {/* Breadcrumb */}
          <div className="ab-crumb">
            Home &rsaquo; <span>About Us</span>
          </div>

          {/* Hero Section */}
          <div className="ab-hero">
            <div className="ab-hero-badge">— Our Story —</div>
            <h1 className="ab-hero-title">
              Crafting <em>Timeless</em> Fashion <br />
              Since 2019
            </h1>
            <p className="ab-hero-subtitle">
              NIVEST was born from a passion to create premium men's wear that
              combines modern aesthetics with classic craftsmanship.
            </p>
          </div>

          {/* Story Section */}
          <Row className="ab-story-section align-items-center">
            <Col lg={6}>
              <h2 className="ab-section-title">Our Journey</h2>
              <p className="ab-story-text">
                Founded in 2019, NIVEST began with a simple yet powerful vision:
                to revolutionize men's fashion by offering premium quality
                clothing that doesn't compromise on style or affordability. What
                started as a small boutique in Mumbai has now grown into a
                beloved brand with thousands of satisfied customers across the
                globe.
              </p>
              <p className="ab-story-text">
                Our name, NIVEST, reflects our commitment to investing in
                quality, style, and the confidence of every man who wears our
                clothing. We believe that great style should be accessible to
                all, and we work tirelessly to create pieces that make you look
                and feel your best.
              </p>
              <p className="ab-story-text">
                Today, we're proud to offer a curated collection that blends
                contemporary trends with timeless elegance, all crafted with
                meticulous attention to detail and the finest materials.
              </p>
            </Col>
            <Col lg={6}>
              <div className="ab-story-image">
                <img
                  src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&q=85&auto=format&fit=crop"
                  alt="Our Store"
                />
              </div>
            </Col>
          </Row>

         

          <div className="ab-divider" />
        </Container>
      </div>
    </>
  );
}
