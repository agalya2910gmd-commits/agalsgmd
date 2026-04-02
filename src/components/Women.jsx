import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaHeart,
  FaRegHeart,
  FaStar,
  FaShoppingBag,
  FaArrowRight,
  FaArrowLeft,
  FaCheckCircle,
  FaTruck,
  FaExchangeAlt,
  FaShieldAlt,
  FaCalendarAlt,
  FaThumbsUp,
  FaMinus,
  FaPlus,
  FaBolt,
  FaTag,
  FaUser,
} from "react-icons/fa";

const products = [
  {
    id: 1,
    name: "Floral Summer Dress",
    price: "₹499",
    originalPrice: "₹899",
    images: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=85&auto=format&fit=crop",
    ],
    rating: 4.5,
    reviews: 212,
    tag: "NEW",
    category: "Dresses",
    colors: ["#F4A7B9", "#A8D8A8", "#B0C4DE"],
    colorNames: ["Rose Pink", "Sage Green", "Sky Blue"],
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "Elevate your summer wardrobe with this enchanting floral dress. Crafted from lightweight, breathable cotton fabric that drapes beautifully. Features a flattering V-neckline, delicate ruffled sleeves, and a flowy A-line silhouette that moves with you. Perfect for garden parties, brunch dates, or sunset strolls along the beach.",
    material: "100% Premium Cotton",
    care: "Machine wash cold. Do not bleach. Tumble dry low.",
    brand: "Summer Breeze",
    inStock: true,
    delivery: "Free delivery by Tomorrow",
    returns: "30 days easy returns",
    warranty: "3 months warranty",
    highlights: [
      "Breathable cotton fabric",
      "Flowy A-line silhouette",
      "Delicate ruffle details",
      "Hidden side pockets",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Sarah M.",
        rating: 5,
        date: "15 Mar 2024",
        title: "Absolutely love this dress!",
        comment:
          "The fabric is so soft and comfortable. Perfect for summer days. The fit is true to size and the color is exactly as shown.",
        helpful: 45,
        verified: true,
      },
      {
        id: 2,
        user: "Jessica K.",
        rating: 4,
        date: "10 Mar 2024",
        title: "Great quality",
        comment:
          "Beautiful dress, very well made. The ruffles add a nice touch. Would definitely recommend.",
        helpful: 32,
        verified: true,
      },
      {
        id: 3,
        user: "Emily R.",
        rating: 5,
        date: "5 Mar 2024",
        title: "Perfect summer dress",
        comment:
          "Wore this to a beach wedding and got so many compliments. Lightweight and elegant.",
        helpful: 28,
        verified: true,
      },
    ],
  },
  {
    id: 2,
    name: "Casual Sneakers",
    price: "₹799",
    originalPrice: "₹1,299",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=85&auto=format&fit=crop",
    ],
    rating: 4.8,
    reviews: 340,
    tag: "HOT",
    category: "Footwear",
    colors: ["#030303", "#1C1C1C", "#8B4513"],
    colorNames: ["Black", "Charcoal", "Tan"],
    sizes: ["36", "37", "38", "39", "40", "41"],
    description:
      "Step into comfort with these premium casual sneakers. Designed with memory foam insoles and breathable mesh lining, these sneakers provide all-day comfort whether you're running errands or exploring the city. The cushioned sole and flexible construction make every step feel effortless.",
    material: "Premium Leather + Breathable Mesh",
    care: "Spot clean with damp cloth. Air dry.",
    brand: "Urban Walk",
    inStock: true,
    delivery: "Free delivery by Tomorrow",
    returns: "30 days easy returns",
    warranty: "6 months warranty",
    highlights: [
      "Memory foam insole",
      "Breathable mesh lining",
      "Non-slip rubber sole",
      "Lightweight design",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Priya S.",
        rating: 5,
        date: "12 Mar 2024",
        title: "Most comfortable sneakers!",
        comment:
          "I can wear these all day without any discomfort. The memory foam is amazing. True to size.",
        helpful: 67,
        verified: true,
      },
      {
        id: 2,
        user: "Anjali P.",
        rating: 5,
        date: "8 Mar 2024",
        title: "Great value",
        comment:
          "Excellent quality for the price. Stylish and comfortable. Highly recommend!",
        helpful: 41,
        verified: true,
      },
    ],
  },
  {
    id: 3,
    name: "Stylish Handbag",
    price: "₹999",
    originalPrice: "₹1,999",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=85&auto=format&fit=crop",
    ],
    rating: 4.7,
    reviews: 178,
    tag: "NEW",
    category: "Accessories",
    colors: ["#C49A6C", "#2C2C2C", "#8B0000"],
    colorNames: ["Tan", "Black", "Burgundy"],
    sizes: ["One Size"],
    description:
      "Elevate any outfit with this sophisticated handbag. Crafted from premium vegan leather with gold-toned hardware. Features a spacious main compartment, interior zip pocket, and an adjustable shoulder strap. Perfect for work, weekends, and everything in between.",
    material: "Premium Vegan Leather",
    care: "Wipe clean with soft, damp cloth.",
    brand: "Luxe & Co",
    inStock: true,
    delivery: "Free delivery by Tomorrow",
    returns: "30 days easy returns",
    warranty: "3 months warranty",
    highlights: [
      "Spacious interior",
      "Adjustable shoulder strap",
      "Gold-toned hardware",
      "Interior zip pocket",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Meera K.",
        rating: 5,
        date: "14 Mar 2024",
        title: "Beautiful handbag!",
        comment:
          "The quality is amazing for the price. Looks very expensive. Perfect size for daily use.",
        helpful: 53,
        verified: true,
      },
      {
        id: 2,
        user: "Divya N.",
        rating: 4,
        date: "9 Mar 2024",
        title: "Great purchase",
        comment: "Love the color and design. Very spacious. Would recommend.",
        helpful: 29,
        verified: true,
      },
    ],
  },
  {
    id: 4,
    name: "Denim Jacket",
    price: "₹1,299",
    originalPrice: "₹2,499",
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605459540739-9a2bc17b76e3?w=800&q=85&auto=format&fit=crop",
    ],
    rating: 4.6,
    reviews: 95,
    tag: "SALE",
    category: "Outerwear",
    colors: ["#4A6FA5", "#1C1C2E", "#8B9DC3"],
    colorNames: ["Light Wash", "Dark Wash", "Stone Wash"],
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "A timeless wardrobe essential reimagined with a soft enzyme wash for that perfectly worn-in feel. Classic denim jacket featuring button-front closure, chest pockets, and adjustable side tabs. Layer it over dresses, tees, or hoodies for effortless cool-girl style.",
    material: "100% Cotton Denim",
    care: "Machine wash cold, inside out. Do not bleach.",
    brand: "Denim Co.",
    inStock: true,
    delivery: "Free delivery by 2 days",
    returns: "30 days easy returns",
    warranty: "6 months warranty",
    highlights: [
      "Enzyme washed for softness",
      "Classic button-front closure",
      "Chest flap pockets",
      "Adjustable side tabs",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Riya S.",
        rating: 5,
        date: "11 Mar 2024",
        title: "Perfect jacket!",
        comment:
          "The wash is beautiful and the fit is just right. Very versatile piece.",
        helpful: 38,
        verified: true,
      },
      {
        id: 2,
        user: "Neha G.",
        rating: 4,
        date: "6 Mar 2024",
        title: "Great quality",
        comment:
          "Sturdy denim, nice color. Slightly oversized but that's the style.",
        helpful: 22,
        verified: true,
      },
    ],
  },
];

const parsePrice = (s) => parseFloat(s.replace(/[₹,]/g, ""));

const tagStyles = {
  NEW: { bg: "#1A3A5C", color: "#F0F4FF" },
  HOT: { bg: "#3A1A1A", color: "#FF6B6B" },
  SALE: { bg: "#1A3A2A", color: "#4ADE80" },
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600&display=swap');

  :root {
    --bg-deep: #e8e9ed;
    --bg-card: #FFFFFF;
    --bg-img: #F5F5F5;
    --border: #E8E4DC;
    --gold: #C9A84C;
    --dark: #1A1A2E;
    --mid: #6B6B6B;
    --success: #27AE60;
    --danger: #E53E3E;
    --white: #FFFFFF;
    --text-muted: #888888;
  }

  /* Listing Section */
  .wc-section {
    background: var(--bg-deep);
    padding: 72px 0 90px;
    font-family: 'Outfit', sans-serif;
  }

  .wc-header { margin-bottom: 48px; }

  .wc-kicker {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 10px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--dark);
    font-weight: 500;
    margin-bottom: 14px;
  }
  .wc-kicker::before,
  .wc-kicker::after {
    content: '';
    display: block;
    width: 28px;
    height: 1px;
    background: var(--gold);
    opacity: 0.5;
  }

  .wc-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(32px, 5vw, 54px);
    font-weight: 600;
    color: var(--dark);
    line-height: 1.08;
    margin: 0 0 12px;
    letter-spacing: -0.5px;
  }
  .wc-title em {
    font-style: italic;
    color: var(--gold);
    font-family: 'Outfit', sans-serif;
    font-weight: 300;
  }

  .wc-desc {
    font-size: 13.5px;
    color: var(--mid);
    font-weight: 300;
    max-width: 360px;
    line-height: 1.75;
    margin: 0;
  }

  .wc-view-all {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    background: var(--dark);
    color: #fff;
    border: none;
    padding: 12px 28px;
    font-family: 'Outfit', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 2px;
    transition: background 0.25s, box-shadow 0.25s;
  }
  .wc-view-all:hover {
    background: var(--gold);
  }
  .wc-view-all svg { transition: transform 0.3s; }
  .wc-view-all:hover svg { transform: translateX(4px); }

  /* Card */
  .wc-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    transition: box-shadow 0.3s, transform 0.3s;
    cursor: pointer;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .wc-card:hover {
    box-shadow: 0 12px 32px rgba(0,0,0,0.1);
    transform: translateY(-5px);
  }

  .wc-img-box {
    position: relative;
    aspect-ratio: 1 / 1;
    background: var(--bg-img);
    overflow: hidden;
  }
  .wc-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  .wc-card:hover .wc-img { transform: scale(1.06); }

  .wc-tag {
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 8.5px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 3px 9px;
    border-radius: 20px;
    font-family: 'Outfit', sans-serif;
    z-index: 2;
  }

  .wc-wish {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 32px;
    height: 32px;
    background: rgba(255,255,255,0.95);
    border: 1px solid var(--border);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s;
    z-index: 2;
  }
  .wc-wish:hover { transform: scale(1.12); background: #fff; }

  .wc-body { 
    padding: 14px; 
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .wc-cat {
    font-size: 9px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--gold);
    font-weight: 500;
    margin-bottom: 4px;
  }

  .wc-name {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: var(--dark);
    line-height: 1.35;
    margin-bottom: 8px;
  }

  .wc-colors { display: flex; gap: 6px; margin-bottom: 10px; }
  .wc-dot {
    width: 12px; height: 12px;
    border-radius: 50%;
    border: 1.5px solid rgba(0,0,0,0.1);
    cursor: pointer;
    transition: transform 0.15s;
  }
  .wc-dot:hover { transform: scale(1.3); }
  .wc-dot.active { outline: 2px solid var(--gold); outline-offset: 2px; }

  .wc-rating { display: flex; align-items: center; gap: 4px; margin-bottom: 10px; }
  .wc-star { font-size: 11px; color: var(--gold); }
  .wc-rev { font-size: 10px; color: var(--text-muted); }

  .wc-prices {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }
  .wc-price {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--dark);
  }
  .wc-orig {
    font-size: 11.5px;
    color: var(--text-muted);
    text-decoration: line-through;
  }
  .wc-off {
    font-size: 10px;
    color: var(--success);
    font-weight: 500;
  }

  .wc-cart {
    width: 100%;
    padding: 10px 0;
    background: transparent;
    border: 1px solid var(--border);
    color: var(--dark);
    font-family: 'Outfit', sans-serif;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.25s;
    margin-top: auto;
  }
  .wc-cart:hover {
    background: var(--dark);
    border-color: var(--dark);
    color: #fff;
  }
  .wc-cart.added {
    background: var(--gold);
    border-color: var(--gold);
    color: #fff;
  }

  .wc-footer { text-align: center; margin-top: 56px; }
  .wc-footer-line {
    font-size: 13px;
    color: var(--text-muted);
    font-style: italic;
    margin-bottom: 22px;
  }

  /* Toast */
  .toast-notif {
    position: fixed; bottom: 20px; right: 20px;
    background: var(--dark); color: #fff;
    padding: 12px 20px; border-radius: 8px;
    font-size: 13px; font-family: 'Outfit', sans-serif;
    z-index: 9999; animation: slideIn 0.3s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  @keyframes slideIn { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }

  /* Detail Page */
  .pdp-overlay {
    position: fixed; inset: 0;
    background: #fff; z-index: 3000;
    overflow-y: auto;
    font-family: 'Outfit', sans-serif;
  }
  .pdp-overlay.entering { animation: pdpSlideIn 0.42s cubic-bezier(0.22,1,0.36,1) forwards; }
  .pdp-overlay.exiting { animation: pdpSlideOut 0.32s cubic-bezier(0.55,0,1,0.45) forwards; }
  @keyframes pdpSlideIn { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
  @keyframes pdpSlideOut { from{transform:translateX(0);opacity:1} to{transform:translateX(100%);opacity:0} }

  .pdp-nav {
    position: sticky; top: 0; z-index: 10;
    background: rgba(255,255,255,0.97);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 16px 40px;
    display: flex; justify-content: space-between; align-items: center;
  }
  @media(max-width:576px){ .pdp-nav{ padding: 14px 16px; } }

  .pdp-back-btn {
    display: flex; align-items: center; gap: 10px;
    background: none; border: 1px solid var(--border);
    font-family: 'Outfit', sans-serif; font-size: 12px;
    letter-spacing: 2px; text-transform: uppercase;
    color: var(--dark); padding: 9px 20px; border-radius: 6px;
    cursor: pointer; transition: all 0.25s;
  }
  .pdp-back-btn:hover { background: var(--dark); color: #fff; border-color: var(--dark); }

  .pdp-nav-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 15px; font-weight: 600; color: var(--dark);
  }

  .pdp-nav-wish {
    display: flex; align-items: center; gap: 8px;
    border: 1px solid var(--border); background: none;
    padding: 9px 18px; border-radius: 6px;
    font-family: 'Outfit', sans-serif; font-size: 12px;
    cursor: pointer; transition: all 0.25s; color: var(--dark);
  }
  .pdp-nav-wish:hover { border-color: var(--danger); }
  .pdp-nav-wish.wished { border-color: var(--danger); background: #fff0f0; color: var(--danger); }

  .pdp-inner { max-width: 1200px; margin: 0 auto; padding: 40px 40px 80px; }
  @media(max-width:576px){ .pdp-inner{ padding: 24px 16px 60px; } }

  .pdp-crumb {
    font-size: 11px; letter-spacing: 0.5px; color: var(--mid);
    margin-bottom: 28px; display: flex; align-items: center; gap: 6px;
  }
  .pdp-crumb span { color: var(--dark); font-weight: 500; }

  .pdp-gallery { position: sticky; top: 90px; }
  .pdp-main-wrap {
    width: 100%; aspect-ratio: 3/4;
    border-radius: 16px; overflow: hidden;
    background: var(--bg-img); margin-bottom: 14px; position: relative;
  }
  .pdp-main-img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 0.55s ease;
  }
  .pdp-main-wrap:hover .pdp-main-img { transform: scale(1.05); }
  .pdp-tag-badge {
    position: absolute; top: 14px; left: 14px;
    font-size: 9px; font-weight: 600; letter-spacing: 2px;
    padding: 4px 10px; border-radius: 5px; z-index: 2;
  }

  .pdp-thumbs { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; }
  .pdp-thumb {
    aspect-ratio: 1; border-radius: 8px; overflow: hidden;
    cursor: pointer; border: 2.5px solid transparent;
    transition: border-color 0.2s;
  }
  .pdp-thumb.active { border-color: var(--gold); }
  .pdp-thumb img { width:100%; height:100%; object-fit:cover; }

  .pdp-info { padding-left: 32px; }
  @media(max-width:768px){ .pdp-info{ padding-left:0; padding-top:28px; } }

  .pdp-brand { font-size:10px; letter-spacing:4px; text-transform:uppercase; color:var(--gold); font-weight:600; margin-bottom:8px; }
  .pdp-product-name {
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(22px,3vw,34px); font-weight:700;
    color: var(--dark); line-height:1.15; margin-bottom:12px;
  }
  .pdp-rating-row { display:flex; align-items:center; gap:10px; margin-bottom:18px; flex-wrap:wrap; }
  .pdp-stars-wrap { display:flex; gap:3px; color: var(--gold); }
  .pdp-rnum { font-size:13px; font-weight:600; color:var(--dark); }
  .pdp-rcount { font-size:12px; color:var(--mid); }

  .pdp-hr { border:none; border-top:1px solid var(--border); margin:18px 0; }

  .pdp-prices { display:flex; align-items:baseline; gap:12px; flex-wrap:wrap; margin-bottom:4px; }
  .pdp-price { font-family:'Space Grotesk', sans-serif; font-size:30px; font-weight:700; color:var(--dark); }
  .pdp-orig-price { font-size:16px; color:#bbb; text-decoration:line-through; }
  .pdp-disc-badge { font-size:12px; font-weight:600; letter-spacing:1px; color:#fff; background:var(--success); padding:3px 8px; border-radius:4px; }
  .pdp-save { font-size:12px; color:var(--success); margin-bottom:18px; }

  .pdp-stock-row { display:inline-flex; align-items:center; gap:7px; font-size:12px; font-weight:500; margin-bottom:20px; }
  .pdp-stock-dot { width:7px; height:7px; border-radius:50%; background:var(--success); }
  .pdp-stock-ok { color:var(--success); }

  .pdp-label { font-size:10px; letter-spacing:2.5px; text-transform:uppercase; color:var(--mid); font-weight:600; margin-bottom:10px; }

  .pdp-color-list { display:flex; gap:12px; margin-bottom:20px; flex-wrap:wrap; }
  .pdp-color-opt { display:flex; flex-direction:column; align-items:center; gap:5px; border:none; background:none; cursor:pointer; padding:0; }
  .pdp-color-swatch { width:28px; height:28px; border-radius:50%; border:2.5px solid transparent; outline:2px solid transparent; transition:all 0.2s; }
  .pdp-color-opt.active .pdp-color-swatch { outline:2px solid var(--gold); outline-offset:2px; }
  .pdp-color-name { font-size:9px; color:var(--mid); }

  .pdp-size-list { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:22px; }
  .pdp-size-btn {
    min-width:46px; padding:9px 12px;
    border:1.5px solid var(--border); border-radius:6px;
    background:transparent; font-family:'Outfit', sans-serif;
    font-size:12px; font-weight:500; color:var(--dark);
    cursor:pointer; transition:all 0.2s;
  }
  .pdp-size-btn:hover { border-color:var(--dark); }
  .pdp-size-btn.active { background:var(--dark); color:#fff; border-color:var(--dark); }

  .pdp-qty-row { display:flex; align-items:center; gap:16px; margin-bottom:22px; }
  .pdp-qty { display:flex; align-items:center; border:1.5px solid var(--border); border-radius:8px; overflow:hidden; }
  .pdp-qty-btn { width:38px; height:40px; border:none; background:#f9f9f9; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background 0.2s; }
  .pdp-qty-btn:hover { background:var(--gold); color:#fff; }
  .pdp-qty-num { width:46px; text-align:center; font-size:15px; font-weight:600; color:var(--dark); }

  .pdp-btn-row { display:flex; gap:12px; margin-bottom:20px; flex-wrap:wrap; }
  .pdp-btn-cart, .pdp-btn-buy {
    flex:1; min-width:150px; padding:14px 20px;
    border-radius:8px;
    font-family:'Outfit', sans-serif; font-size:11px; letter-spacing:2.5px;
    text-transform:uppercase; cursor:pointer; transition:all 0.3s;
    display:flex; align-items:center; justify-content:center; gap:8px;
  }
  .pdp-btn-cart { background:var(--dark); color:#fff; border:none; }
  .pdp-btn-cart:hover { background:#2a2a2a; transform:translateY(-1px); }
  .pdp-btn-cart.added { background:var(--gold); }
  .pdp-btn-buy { background:var(--gold); color:#fff; border:none; }
  .pdp-btn-buy:hover { background:#b3934e; transform:translateY(-1px); }

  .pdp-trust { display:flex; gap:16px; flex-wrap:wrap; margin-bottom:22px; }
  .pdp-trust-item { display:flex; align-items:center; gap:7px; font-size:11px; color:var(--mid); }
  .pdp-trust-icon { color:var(--gold); }

  .pdp-desc { font-size:13.5px; color:#444; line-height:1.8; margin-bottom:14px; }
  .pdp-feat-list { list-style:none; padding:0; margin:0; }
  .pdp-feat-list li { display:flex; align-items:center; gap:8px; font-size:12px; color:var(--mid); padding:5px 0; border-bottom:1px solid var(--border); }
  .pdp-feat-list li:last-child { border-bottom:none; }

  .pdp-reviews { background:var(--bg-deep); padding:60px 0; }
  .pdp-section-ey { font-size:10px; letter-spacing:5px; text-transform:uppercase; color:var(--gold); font-weight:600; margin-bottom:8px; }
  .pdp-section-h { font-family:'Space Grotesk', sans-serif; font-size:clamp(24px,3vw,36px); font-weight:700; color:var(--dark); margin-bottom:36px; }
  .pdp-section-h em { font-style:italic; color:var(--gold); }

  .pdp-rating-box {
    display:flex; align-items:center; gap:24px;
    background:#fff; border-radius:12px; padding:28px;
    margin-bottom:28px; box-shadow:0 2px 16px rgba(0,0,0,0.05);
  }
  @media(max-width:576px){ .pdp-rating-box{ flex-direction:column; } }
  .pdp-big-r { text-align:center; min-width:80px; }
  .pdp-big-num { font-family:'Space Grotesk', sans-serif; font-size:48px; font-weight:700; color:var(--dark); line-height:1; }
  .pdp-big-stars { display:flex; justify-content:center; gap:3px; margin:6px 0; color: var(--gold); }
  .pdp-big-cnt { font-size:11px; color:var(--mid); }
  .pdp-bars { flex:1; }
  .pdp-bar-row { display:flex; align-items:center; gap:10px; margin-bottom:7px; }
  .pdp-bar-lbl { font-size:11px; color:var(--mid); min-width:28px; text-align:right; }
  .pdp-bar-track { flex:1; height:6px; background:var(--border); border-radius:3px; overflow:hidden; }
  .pdp-bar-fill { height:100%; background:var(--gold); border-radius:3px; }
  .pdp-bar-cnt { font-size:11px; color:var(--mid); min-width:20px; }

  .pdp-rev-card {
    background:#fff; border-radius:12px; padding:22px;
    margin-bottom:14px; border:1px solid var(--border);
    transition:box-shadow 0.25s;
  }
  .pdp-rev-card:hover { box-shadow:0 6px 24px rgba(0,0,0,0.08); }
  .pdp-rev-head { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:10px; flex-wrap:wrap; gap:10px; }
  .pdp-rev-name { font-weight:600; font-size:14px; color:var(--dark); margin-bottom:4px; }
  .pdp-rev-meta { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
  .pdp-rev-stars { display:flex; gap:2px; color: var(--gold); }
  .pdp-verified { font-size:9px; letter-spacing:1px; color:var(--success); font-weight:600; background:#e8f8ee; padding:2px 7px; border-radius:20px; }
  .pdp-rev-date { font-size:11px; color:#bbb; }
  .pdp-rev-title { font-weight:600; font-size:13px; color:var(--dark); margin-bottom:6px; }
  .pdp-rev-body { font-size:13px; color:#555; line-height:1.7; }
  .pdp-helpful { margin-top:12px; background:none; border:none; color:var(--gold); cursor:pointer; font-size:12px; display:flex; align-items:center; gap:5px; font-family:'Outfit', sans-serif; }

  .pdp-similar { padding:60px 0; }
  .pdp-sim-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
  @media(max-width:992px){ .pdp-sim-grid{ grid-template-columns:repeat(2,1fr); } }
  @media(max-width:480px){ .pdp-sim-grid{ grid-template-columns:repeat(2,1fr); gap:12px; } }

  .pdp-sim-card {
    border-radius:12px; overflow:hidden; background:#fff;
    border:1px solid var(--border); cursor:pointer;
    transition:box-shadow 0.3s, transform 0.3s;
  }
  .pdp-sim-card:hover { box-shadow:0 10px 28px rgba(0,0,0,0.1); transform:translateY(-5px); }
  .pdp-sim-img-wrap { position:relative; aspect-ratio:1/1; overflow:hidden; background:var(--bg-img); }
  .pdp-sim-img { width:100%; height:100%; object-fit:cover; transition:transform 0.5s; }
  .pdp-sim-card:hover .pdp-sim-img { transform:scale(1.07); }
  .pdp-sim-overlay {
    position:absolute; inset:0; background:rgba(0,0,0,0.55);
    display:flex; align-items:center; justify-content:center;
    opacity:0; transition:opacity 0.3s;
  }
  .pdp-sim-card:hover .pdp-sim-overlay { opacity:1; }
  .pdp-sim-add-btn {
    padding:8px 16px; background:#fff; color:var(--dark);
    border:none; border-radius:6px; font-family:'Outfit', sans-serif;
    font-size:10px; letter-spacing:2px; text-transform:uppercase;
    cursor:pointer; display:flex; align-items:center; gap:5px;
  }
  .pdp-sim-add-btn:hover { background:var(--gold); color:#fff; }
  .pdp-sim-badge {
    position:absolute; top:8px; left:8px; z-index:1;
    font-size:8px; font-weight:600; letter-spacing:1.5px;
    padding:3px 7px; border-radius:4px;
  }
  .pdp-sim-body { padding:12px; }
  .pdp-sim-cat { font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(--gold); font-weight:500; margin-bottom:4px; }
  .pdp-sim-name { font-family:'Space Grotesk', sans-serif; font-size:13px; font-weight:600; color:var(--dark); margin-bottom:6px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .pdp-sim-price { font-size:14px; font-weight:700; color:var(--dark); }
  .pdp-sim-orig { font-size:11px; color:#bbb; text-decoration:line-through; margin-left:6px; }
`;

function StarRating({ rating, size = 11 }) {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <FaStar
          key={i}
          style={{
            fontSize: size,
            color: "#C9A84C",
            opacity: i <= Math.round(rating) ? 1 : 0.2,
          }}
        />
      ))}
    </>
  );
}

function getDiscount(price, orig) {
  const p = parseFloat(price.replace(/[₹,]/g, ""));
  const o = parseFloat(orig.replace(/[₹,]/g, ""));
  return Math.round(((o - p) / o) * 100);
}

export default function Women() {
  const [wishlist, setWishlist] = useState([]);
  const [activeColors, setActiveColors] = useState({});
  const [addedItems, setAddedItems] = useState({});
  const [toast, setToast] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailAnim, setDetailAnim] = useState("entering");
  const [mainImg, setMainImg] = useState(0);
  const [selColor, setSelColor] = useState(0);
  const [selSize, setSelSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [addedDetail, setAddedDetail] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const toggleWish = (id, e) => {
    if (e) e.stopPropagation();
    const isWished = wishlist.includes(id);
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    showToast(isWished ? "Removed from wishlist" : "Added to wishlist ♥");
  };

  const setColor = (id, i) => setActiveColors((prev) => ({ ...prev, [id]: i }));

  const handleAddToCart = (item, quantity = 1, fromDetail = false) => {
    setAddedItems((prev) => ({ ...prev, [item.id]: true }));
    showToast(`${item.name} added to cart! ✓`);
    setTimeout(
      () => setAddedItems((prev) => ({ ...prev, [item.id]: false })),
      1600,
    );
    if (fromDetail) {
      setAddedDetail(true);
      setTimeout(() => setAddedDetail(false), 1600);
    }
  };

  const openDetail = (product) => {
    setDetailProduct(product);
    setMainImg(0);
    setSelColor(0);
    setSelSize(null);
    setQty(1);
    setAddedDetail(false);
    setDetailAnim("entering");
    setDetailVisible(true);
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
  };

  const closeDetail = () => {
    setDetailAnim("exiting");
    setTimeout(() => {
      setDetailVisible(false);
      setDetailProduct(null);
      document.body.style.overflow = "";
    }, 320);
  };

  const getSimilar = (p) =>
    products
      .filter((x) => x.category === p.category && x.id !== p.id)
      .slice(0, 4);

  const ratingBars = (p) => [
    { label: "5★", pct: 70, cnt: Math.round(p.reviews * 0.7) },
    { label: "4★", pct: 18, cnt: Math.round(p.reviews * 0.18) },
    { label: "3★", pct: 7, cnt: Math.round(p.reviews * 0.07) },
    { label: "2★", pct: 3, cnt: Math.round(p.reviews * 0.03) },
    { label: "1★", pct: 2, cnt: Math.round(p.reviews * 0.02) },
  ];

  const savings = (p) => parsePrice(p.originalPrice) - parsePrice(p.price);

  const parsePrice = (s) => parseFloat(s.replace(/[₹,]/g, ""));

  const DetailPage = ({ p }) => {
    const isWished = wishlist.includes(p.id);
    const tagStyle = tagStyles[p.tag] || { bg: "#1A1A2E", color: "#fff" };
    const similar = getSimilar(p);
    const bars = ratingBars(p);

    return (
      <div className={`pdp-overlay ${detailAnim}`}>
        <div className="pdp-nav">
          <button className="pdp-back-btn" onClick={closeDetail}>
            <FaArrowLeft size={11} /> Back to Shop
          </button>
          <span className="pdp-nav-title">{p.name}</span>
          <button
            className={`pdp-nav-wish ${isWished ? "wished" : ""}`}
            onClick={() => toggleWish(p.id)}
          >
            {isWished ? <FaHeart size={13} /> : <FaRegHeart size={13} />}
            {isWished ? "Wishlisted" : "Wishlist"}
          </button>
        </div>

        <div className="pdp-inner">
          <div className="pdp-crumb">
            <span style={{ cursor: "pointer" }} onClick={closeDetail}>
              Shop
            </span>
            <span>/</span>
            <span>{p.category}</span>
            <span>/</span>
            <span>{p.name}</span>
          </div>

          <Row>
            <Col md={6} lg={5}>
              <div className="pdp-gallery">
                <div className="pdp-main-wrap">
                  <img
                    src={p.images[mainImg]}
                    alt={p.name}
                    className="pdp-main-img"
                  />
                  <span
                    className="pdp-tag-badge"
                    style={{ background: tagStyle.bg, color: tagStyle.color }}
                  >
                    {p.tag}
                  </span>
                </div>
                <div className="pdp-thumbs">
                  {p.images.map((img, i) => (
                    <div
                      key={i}
                      className={`pdp-thumb ${mainImg === i ? "active" : ""}`}
                      onClick={() => setMainImg(i)}
                    >
                      <img src={img} alt={`${p.name} view ${i + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            </Col>

            <Col md={6} lg={7}>
              <div className="pdp-info">
                <div className="pdp-brand">{p.brand}</div>
                <h1 className="pdp-product-name">{p.name}</h1>

                <div className="pdp-rating-row">
                  <div className="pdp-stars-wrap">
                    <StarRating rating={p.rating} size={12} />
                  </div>
                  <span className="pdp-rnum">{p.rating}</span>
                  <span>·</span>
                  <span className="pdp-rcount">{p.reviews} reviews</span>
                </div>

                <hr className="pdp-hr" />

                <div className="pdp-prices">
                  <span className="pdp-price">{p.price}</span>
                  <span className="pdp-orig-price">{p.originalPrice}</span>
                  <span className="pdp-disc-badge">{p.discount} OFF</span>
                </div>
                <p className="pdp-save">
                  You save ₹{savings(p).toLocaleString("en-IN")}
                </p>

                <div className="pdp-stock-row pdp-stock-ok">
                  <span className="pdp-stock-dot" />
                  In Stock
                </div>

                <hr className="pdp-hr" />

                <div className="pdp-label">Select Colour</div>
                <div className="pdp-color-list">
                  {p.colors.map((c, i) => (
                    <button
                      key={i}
                      className={`pdp-color-opt ${selColor === i ? "active" : ""}`}
                      onClick={() => setSelColor(i)}
                    >
                      <div
                        className="pdp-color-swatch"
                        style={{ backgroundColor: c }}
                      />
                      <span className="pdp-color-name">{p.colorNames[i]}</span>
                    </button>
                  ))}
                </div>

                <div className="pdp-label">Select Size</div>
                <div className="pdp-size-list">
                  {p.sizes.map((s) => (
                    <button
                      key={s}
                      className={`pdp-size-btn ${selSize === s ? "active" : ""}`}
                      onClick={() => setSelSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <div className="pdp-label">Quantity</div>
                <div className="pdp-qty-row">
                  <div className="pdp-qty">
                    <button
                      className="pdp-qty-btn"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                    >
                      <FaMinus size={9} />
                    </button>
                    <span className="pdp-qty-num">{qty}</span>
                    <button
                      className="pdp-qty-btn"
                      onClick={() => setQty((q) => q + 1)}
                    >
                      <FaPlus size={9} />
                    </button>
                  </div>
                </div>

                <div className="pdp-btn-row">
                  <button
                    className={`pdp-btn-cart ${addedDetail ? "added" : ""}`}
                    onClick={() => handleAddToCart(p, qty, true)}
                  >
                    <FaShoppingBag size={11} />
                    {addedDetail ? "Added ✓" : "Add to Cart"}
                  </button>
                  <button className="pdp-btn-buy">
                    <FaBolt size={11} /> Buy Now
                  </button>
                </div>

                <div className="pdp-trust">
                  <div className="pdp-trust-item">
                    <FaTruck className="pdp-trust-icon" size={13} />
                    {p.delivery}
                  </div>
                  <div className="pdp-trust-item">
                    <FaExchangeAlt className="pdp-trust-icon" size={13} />
                    {p.returns}
                  </div>
                  <div className="pdp-trust-item">
                    <FaShieldAlt className="pdp-trust-icon" size={13} />
                    {p.warranty}
                  </div>
                </div>

                <hr className="pdp-hr" />

                <div className="pdp-label">About This Product</div>
                <p className="pdp-desc">{p.description}</p>
                <ul className="pdp-feat-list">
                  {p.highlights.map((h, i) => (
                    <li key={i}>
                      <FaCheckCircle
                        size={10}
                        style={{ color: "var(--gold)", flexShrink: 0 }}
                      />{" "}
                      {h}
                    </li>
                  ))}
                  <li>
                    <FaTag
                      size={10}
                      style={{ color: "var(--gold)", flexShrink: 0 }}
                    />{" "}
                    Material: {p.material}
                  </li>
                  <li>
                    <FaCheckCircle
                      size={10}
                      style={{ color: "var(--gold)", flexShrink: 0 }}
                    />{" "}
                    Care: {p.care}
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </div>

        {/* Reviews Section */}
        <div className="pdp-reviews">
          <div
            className="pdp-inner"
            style={{ paddingTop: 0, paddingBottom: 0 }}
          >
            <p className="pdp-section-ey">— Customer Feedback —</p>
            <h2 className="pdp-section-h">
              What Our Customers <em>Say</em>
            </h2>

            <div className="pdp-rating-box">
              <div className="pdp-big-r">
                <div className="pdp-big-num">{p.rating}</div>
                <div className="pdp-big-stars">
                  <StarRating rating={p.rating} size={14} />
                </div>
                <div className="pdp-big-cnt">{p.reviews} ratings</div>
              </div>
              <div className="pdp-bars">
                {bars.map((b) => (
                  <div className="pdp-bar-row" key={b.label}>
                    <span className="pdp-bar-lbl">{b.label}</span>
                    <div className="pdp-bar-track">
                      <div
                        className="pdp-bar-fill"
                        style={{ width: `${b.pct}%` }}
                      />
                    </div>
                    <span className="pdp-bar-cnt">{b.cnt}</span>
                  </div>
                ))}
              </div>
            </div>

            {p.reviewsList.map((r) => (
              <div className="pdp-rev-card" key={r.id}>
                <div className="pdp-rev-head">
                  <div>
                    <div className="pdp-rev-name">{r.user}</div>
                    <div className="pdp-rev-meta">
                      <div className="pdp-rev-stars">
                        <StarRating rating={r.rating} size={11} />
                      </div>
                      {r.verified && (
                        <span className="pdp-verified">
                          ✓ Verified Purchase
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="pdp-rev-date">
                    <FaCalendarAlt size={10} style={{ marginRight: 4 }} />
                    {r.date}
                  </span>
                </div>
                <div className="pdp-rev-title">{r.title}</div>
                <div className="pdp-rev-body">{r.comment}</div>
                <button className="pdp-helpful">
                  <FaThumbsUp size={10} /> Helpful ({r.helpful})
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Similar Products */}
        {similar.length > 0 && (
          <div className="pdp-similar">
            <div
              className="pdp-inner"
              style={{ paddingTop: 0, paddingBottom: 0 }}
            >
              <p className="pdp-section-ey">— You May Also Like —</p>
              <h2 className="pdp-section-h">
                Similar <em>Styles</em>
              </h2>
              <div className="pdp-sim-grid">
                {similar.map((sp) => {
                  const ts = tagStyles[sp.tag] || {
                    bg: "#1A1A2E",
                    color: "#fff",
                  };
                  return (
                    <div
                      key={sp.id}
                      className="pdp-sim-card"
                      onClick={() => {
                        setDetailProduct(sp);
                        setMainImg(0);
                        setSelColor(0);
                        setSelSize(null);
                        setQty(1);
                        setAddedDetail(false);
                      }}
                    >
                      <div className="pdp-sim-img-wrap">
                        <img
                          src={sp.images[0]}
                          alt={sp.name}
                          className="pdp-sim-img"
                        />
                        <span
                          className="pdp-sim-badge"
                          style={{ background: ts.bg, color: ts.color }}
                        >
                          {sp.tag}
                        </span>
                        <div className="pdp-sim-overlay">
                          <button
                            className="pdp-sim-add-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(sp, 1, false);
                            }}
                          >
                            <FaShoppingBag size={9} /> Quick Add
                          </button>
                        </div>
                      </div>
                      <div className="pdp-sim-body">
                        <div className="pdp-sim-cat">{sp.category}</div>
                        <div className="pdp-sim-name">{sp.name}</div>
                        <div className="pdp-sim-price">{sp.price}</div>
                        <span className="pdp-sim-orig">{sp.originalPrice}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <style>{styles}</style>
      {toast && <div className="toast-notif">{toast}</div>}

      {detailVisible && detailProduct && <DetailPage p={detailProduct} />}

      <section className="wc-section">
        <Container>
          <Row className="align-items-end wc-header">
            <Col xs={12} md={7}>
              <div className="wc-kicker">Exclusively Curated</div>
              <h2 className="wc-title">
                Women's <em>Luxury</em>
                <br />
                Collection
              </h2>
              <p className="wc-desc">
                The epitome of elegance — handpicked pieces for the modern
                woman.
              </p>
            </Col>
            <Col xs={12} md={5} className="text-md-end mt-4 mt-md-0">
              <button className="wc-view-all">
                View All
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </Col>
          </Row>

          <Row className="g-4">
            {products.map((item) => {
              const tag = tagStyles[item.tag] || {
                bg: "#1A1A2E",
                color: "#fff",
              };
              const discount = getDiscount(item.price, item.originalPrice);
              const isAdded = addedItems[item.id];
              const isWished = wishlist.includes(item.id);

              return (
                <Col key={item.id} xs={6} sm={6} md={4} lg={3}>
                  <div className="wc-card" onClick={() => openDetail(item)}>
                    <div className="wc-img-box">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="wc-img"
                      />
                      <span
                        className="wc-tag"
                        style={{ background: tag.bg, color: tag.color }}
                      >
                        {item.tag}
                      </span>
                      <button
                        className="wc-wish"
                        onClick={(e) => toggleWish(item.id, e)}
                      >
                        {isWished ? (
                          <FaHeart size={14} color="#E53E3E" />
                        ) : (
                          <FaRegHeart size={14} />
                        )}
                      </button>
                    </div>

                    <div className="wc-body">
                      <div className="wc-cat">{item.category}</div>
                      <div className="wc-name">{item.name}</div>

                      <div className="wc-colors">
                        {item.colors.map((c, i) => (
                          <div
                            key={i}
                            className={`wc-dot ${activeColors[item.id] === i ? "active" : ""}`}
                            style={{ backgroundColor: c }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setColor(item.id, i);
                            }}
                          />
                        ))}
                      </div>

                      <div className="wc-rating">
                        <StarRating rating={item.rating} />
                        <span className="wc-rev">({item.reviews})</span>
                      </div>

                      <div className="wc-prices">
                        <span className="wc-price">{item.price}</span>
                        <span className="wc-orig">{item.originalPrice}</span>
                        <span className="wc-off">{discount}% off</span>
                      </div>

                      <button
                        className={`wc-cart ${isAdded ? "added" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(item);
                        }}
                      >
                        {isAdded ? "Added ✓" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>

          <div className="wc-footer">
            <p className="wc-footer-line">Showing 4 of 120 curated pieces</p>
            <button className="wc-view-all">
              Explore Full Collection
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </Container>
      </section>
    </>
  );
}
