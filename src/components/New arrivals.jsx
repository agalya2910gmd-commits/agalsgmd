import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaShoppingBag,
  FaHeart,
  FaRegHeart,
  FaStar,
  FaArrowRight,
  FaArrowLeft,
  FaFire,
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
    name: "Summer Floral Dress",
    category: "Women's Fashion",
    price: "₹2,199",
    originalPrice: "₹3,499",
    discount: "37%",
    rating: 4.8,
    reviews: 214,
    images: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=85&auto=format&fit=crop",
    ],
    tag: "JUST DROPPED",
    tagStyle: { bg: "#1a0e2e", color: "#c4a8e0" },
    colors: ["#FF6B6B", "#FFB347", "#6B5B95"],
    colorNames: ["Coral Red", "Amber Gold", "Purple Haze"],
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "Embrace the essence of summer with this enchanting floral dress. Crafted from lightweight, breathable cotton voile that dances with every step. Features a flattering V-neckline, delicate puff sleeves, and a tiered skirt that creates beautiful movement. The vibrant floral print adds a touch of romance to your wardrobe, perfect for brunch dates, garden parties, or sunset strolls.",
    material: "100% Cotton Voile",
    care: "Machine wash cold with like colors. Tumble dry low.",
    brand: "Summer Breeze",
    inStock: true,
    delivery: "Free delivery by Tomorrow",
    returns: "30 days easy returns",
    warranty: "3 months warranty",
    highlights: [
      "Breathable cotton voile fabric",
      "Flattering V-neckline",
      "Delicate puff sleeves",
      "Tiered skirt design",
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
          "The fabric is so soft and comfortable. Perfect for summer days. The fit is true to size and the color is exactly as shown. Received so many compliments!",
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
          "Beautiful dress, very well made. The ruffles add a nice touch. Would definitely recommend to friends.",
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
          "Wore this to a beach wedding and got so many compliments. Lightweight and elegant. The pockets are a game changer!",
        helpful: 28,
        verified: true,
      },
    ],
  },
  {
    id: 2,
    name: "Elegant Maxi Dress",
    category: "Eveningwear",
    price: "₹3,999",
    originalPrice: "₹5,999",
    discount: "33%",
    rating: 4.9,
    reviews: 89,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=85&auto=format&fit=crop",
    ],
    tag: "BESTSELLER",
    tagStyle: { bg: "#0e1a0e", color: "#7ec887" },
    colors: ["#2C3E50", "#8E44AD", "#16A085"],
    colorNames: ["Midnight Blue", "Royal Purple", "Teal Green"],
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "Make a stunning entrance in this elegant maxi dress. Crafted from luxurious satin fabric that drapes beautifully over your silhouette. Features a sophisticated cowl neckline, adjustable spaghetti straps, and a flowing A-line skirt that creates an ethereal look. Perfect for weddings, galas, or any special occasion where you want to shine.",
    material: "Premium Satin (95% Polyester, 5% Spandex)",
    care: "Hand wash cold. Do not bleach. Hang dry.",
    brand: "Luxe Couture",
    inStock: true,
    delivery: "Free delivery by 2 days",
    returns: "30 days easy returns",
    warranty: "6 months warranty",
    highlights: [
      "Luxurious satin fabric",
      "Elegant cowl neckline",
      "Adjustable straps",
      "Flowing A-line silhouette",
      "Hidden back zipper",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Priya S.",
        rating: 5,
        date: "12 Mar 2024",
        title: "Absolutely stunning!",
        comment:
          "Wore this to my cousin's wedding and felt like a million bucks. The fabric is high quality and the fit is perfect.",
        helpful: 67,
        verified: true,
      },
      {
        id: 2,
        user: "Anjali P.",
        rating: 5,
        date: "8 Mar 2024",
        title: "Worth every rupee",
        comment:
          "Beautiful dress, very elegant. The cowl neck is so flattering. Highly recommend for special occasions.",
        helpful: 41,
        verified: true,
      },
    ],
  },
  {
    id: 3,
    name: "Casual Denim Dress",
    category: "Street Style",
    price: "₹2,499",
    originalPrice: "₹3,999",
    discount: "38%",
    rating: 4.7,
    reviews: 156,
    images: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=85&auto=format&fit=crop",
    ],
    tag: "TRENDING",
    tagStyle: { bg: "#2a1a0e", color: "#e8c97e" },
    colors: ["#3498DB", "#2ECC71", "#F39C12"],
    colorNames: ["Sky Blue", "Emerald", "Sunset Orange"],
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "Elevate your casual wardrobe with this chic denim dress. Crafted from soft, medium-weight denim that offers both comfort and structure. Features a classic button-down front, chest patch pockets, and a versatile A-line silhouette. Dress it up with heels or keep it casual with sneakers – endless styling possibilities.",
    material: "98% Cotton, 2% Elastane Denim",
    care: "Machine wash cold, inside out. Do not bleach.",
    brand: "Denim Co.",
    inStock: true,
    delivery: "Free delivery by Tomorrow",
    returns: "30 days easy returns",
    warranty: "3 months warranty",
    highlights: [
      "Soft stretch denim",
      "Button-down front",
      "Chest patch pockets",
      "Versatile A-line cut",
      "Washed for softness",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Meera K.",
        rating: 5,
        date: "14 Mar 2024",
        title: "Perfect everyday dress!",
        comment:
          "So comfortable and stylish. The denim is soft but holds its shape well. Great for casual outings.",
        helpful: 53,
        verified: true,
      },
      {
        id: 2,
        user: "Divya N.",
        rating: 4,
        date: "9 Mar 2024",
        title: "Great purchase",
        comment:
          "Love the color and fit. True to size. Would recommend to friends.",
        helpful: 29,
        verified: true,
      },
    ],
  },
  {
    id: 4,
    name: "Silk Evening Gown",
    category: "Luxury",
    price: "₹5,999",
    originalPrice: "₹8,999",
    discount: "33%",
    rating: 5.0,
    reviews: 47,
    images: [
      "https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&q=85&auto=format&fit=crop",
    ],
    tag: "EXCLUSIVE",
    tagStyle: { bg: "#1a0a0a", color: "#e87e7e" },
    colors: ["#E74C3C", "#BDC3C7", "#34495E"],
    colorNames: ["Ruby Red", "Silver Mist", "Midnight Navy"],
    sizes: ["XS", "S", "M", "L"],
    description:
      "Experience unparalleled luxury in this exquisite silk evening gown. Handcrafted from the finest mulberry silk, this gown drapes like a dream. Features a stunning plunging neckline, open back with delicate criss-cross straps, and a dramatic train that follows your every step. The perfect choice for red carpet events, galas, or your most memorable occasions.",
    material: "100% Pure Mulberry Silk",
    care: "Dry clean only. Store in garment bag.",
    brand: "Royal Heritage",
    inStock: true,
    delivery: "Free delivery by 3 days",
    returns: "15 days returns",
    warranty: "1 year warranty",
    highlights: [
      "Pure mulberry silk",
      "Plunging neckline",
      "Criss-cross open back",
      "Dramatic train",
      "Fully lined",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Riya S.",
        rating: 5,
        date: "11 Mar 2024",
        title: "Absolutely breathtaking!",
        comment:
          "This gown is pure perfection. The silk is incredibly soft and the fit is flawless. Worth every penny.",
        helpful: 89,
        verified: true,
      },
      {
        id: 2,
        user: "Neha G.",
        rating: 5,
        date: "6 Mar 2024",
        title: "Dream dress",
        comment:
          "Wore this to a black-tie event and received endless compliments. The quality is outstanding.",
        helpful: 62,
        verified: true,
      },
    ],
  },
];

const parsePrice = (s) => parseFloat(s.replace(/[₹,]/g, ""));

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');

.na-section {
  background: linear-gradient(135deg,  #f0f0f5);
  padding: 90px 0 100px;
  position: relative;
  overflow: hidden;
  font-family: 'Outfit', sans-serif;
}

.na-section::before {
  content: '';
  position: absolute;
  top: -200px; left: 50%;
  transform: translateX(-50%);
  width: 800px; height: 500px;
  background: radial-gradient(ellipse, rgba(196,168,224,0.05) 0%, transparent 70%);
  pointer-events: none;
}

.na-eyebrow {
  font-size: 10px;
  letter-spacing: 6px;
  text-transform: uppercase;
  color: #1a1a2e;
  font-weight: 500;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.na-eyebrow::before,
.na-eyebrow::after {
  content: '';
  flex: 1;
  height: 0.5px;
  background: rgba(196,168,224,0.5);
}

.na-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(44px, 6vw, 76px);
  font-weight: 700;
  color: #1a1a2e;
  line-height: 0.95;
  letter-spacing: -1px;
  margin-bottom: 0;
}
.na-title em {
  font-style: italic;
  color: #c4a8e0;
}

.na-subtitle {
  font-size: 14px;
  color: #555;
  font-weight: 300;
  letter-spacing: 0.3px;
  margin-top: 12px;
}

.na-divider {
  height: 0.5px;
  background: linear-gradient(to right, transparent, rgba(196,168,224,0.3), transparent);
  margin: 48px 0;
}

/* Card */
.na-card {
  background: #ffffff;
  border: 1px solid rgba(196,168,224,0.2);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.na-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.na-img-wrap {
  position: relative;
  overflow: hidden;
  aspect-ratio: 1 / 1;
  flex-shrink: 0;
}
.na-img {
  width: 100%; 
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s ease;
}
.na-card:hover .na-img { transform: scale(1.05); }

.na-tag {
  position: absolute;
  top: 12px; 
  left: 12px;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1.5px;
  padding: 4px 10px;
  border-radius: 20px;
  font-family: 'Outfit', sans-serif;
  z-index: 2;
}

.na-wish {
  position: absolute;
  top: 12px; 
  right: 12px;
  width: 32px; 
  height: 32px;
  background: rgba(255,255,255,0.95);
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 50%;
  display: flex; 
  align-items: center; 
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 2;
}
.na-wish:hover {
  transform: scale(1.08);
  background: #fff;
}

.na-body { 
  padding: 10px 12px; 
  flex: 1; 
  display: flex; 
  flex-direction: column; 
}

.na-cat {
  font-size: 8.5px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #c4a8e0;
  font-weight: 500;
  margin-bottom: 3px;
}

.na-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 6px;
  line-height: 1.25;
}

.na-colors { 
  display: flex; 
  gap: 5px; 
  margin-bottom: 8px; 
}
.na-dot {
  width: 12px; 
  height: 12px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s;
}
.na-dot:hover { transform: scale(1.2); }

.na-rating { 
  display: flex; 
  align-items: center; 
  gap: 5px; 
  margin-bottom: 8px; 
}
.na-star { 
  color: #c4a8e0; 
  font-size: 10px; 
}
.na-star.dim { opacity: 0.2; }
.na-rev { 
  font-size: 10px; 
  color: #888; 
}

.na-prices { 
  display: flex; 
  align-items: baseline; 
  gap: 8px; 
  margin-bottom: 10px; 
  flex-wrap: wrap; 
}
.na-price {
  font-family: 'Cormorant Garamond', serif;
  font-size: 18px; 
  font-weight: 700; 
  color: #1a1a2e;
}
.na-orig { 
  font-size: 11px; 
  color: #aaa; 
  text-decoration: line-through; 
}
.na-disc { 
  font-size: 10px; 
  color: #27ae60; 
  font-weight: 600; 
}

.na-cart {
  width: 100%;
  padding: 8px 0;
  background: transparent;
  border: 1px solid rgba(26,26,46,0.15);
  color: #1a1a2e;
  font-family: 'Outfit', sans-serif;
  font-size: 9px;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.25s;
  margin-top: auto;
}
.na-cart:hover {
  background: #1a1a2e;
  color: #fff;
  border-color: #1a1a2e;
}
.na-cart.added {
  background: #c4a8e0;
  border-color: #c4a8e0;
  color: #fff;
}

.na-bottom {
  text-align: center;
  margin-top: 64px;
}
.na-bottom-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 17px;
  font-style: italic;
  color: #888;
  margin-bottom: 24px;
}
.na-bottom-text span { 
  color: #c4a8e0; 
  font-style: normal; 
  font-weight: 800; 
  font-size: 27px; 
}

.na-view-all {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 40px;
  background: transparent;
  border: 1px solid rgba(196,168,224,0.5);
  color: #c4a8e0;
  font-family: 'Outfit', sans-serif;
  font-size: 10px;
  letter-spacing: 4px;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 1px;
  transition: all 0.3s;
  text-decoration: none;
}
.na-view-all:hover {
  background: rgba(196,168,224,0.08);
  color: #c4a8e0;
  border-color: #c4a8e0;
  gap: 16px;
}

/* Toast */
.toast-notif {
  position: fixed; bottom: 20px; right: 20px;
  background: #1a1a2e; color: #fff;
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
  border-bottom: 1px solid #e8e4dc;
  padding: 16px 40px;
  display: flex; justify-content: space-between; align-items: center;
}
@media(max-width:576px){ .pdp-nav{ padding: 14px 16px; } }

.pdp-back-btn {
  display: flex; align-items: center; gap: 10px;
  background: none; border: 1px solid #e8e4dc;
  font-family: 'Outfit', sans-serif; font-size: 12px;
  letter-spacing: 2px; text-transform: uppercase;
  color: #1a1a2e; padding: 9px 20px; border-radius: 6px;
  cursor: pointer; transition: all 0.25s;
}
.pdp-back-btn:hover { background: #1a1a2e; color: #fff; border-color: #1a1a2e; }

.pdp-nav-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 18px; font-weight: 600; color: #1a1a2e;
}

.pdp-nav-wish {
  display: flex; align-items: center; gap: 8px;
  border: 1px solid #e8e4dc; background: none;
  padding: 9px 18px; border-radius: 6px;
  font-family: 'Outfit', sans-serif; font-size: 12px;
  cursor: pointer; transition: all 0.25s; color: #1a1a2e;
}
.pdp-nav-wish:hover { border-color: #e74c3c; }
.pdp-nav-wish.wished { border-color: #e74c3c; background: #fff0f0; color: #e74c3c; }

.pdp-inner { max-width: 1200px; margin: 0 auto; padding: 40px 40px 80px; }
@media(max-width:576px){ .pdp-inner{ padding: 24px 16px 60px; } }

.pdp-crumb {
  font-size: 11px; letter-spacing: 0.5px; color: #888;
  margin-bottom: 28px; display: flex; align-items: center; gap: 6px;
}
.pdp-crumb span { color: #1a1a2e; font-weight: 500; }

.pdp-gallery { position: sticky; top: 90px; }
.pdp-main-wrap {
  width: 100%; aspect-ratio: 3/4;
  border-radius: 16px; overflow: hidden;
  background: #f5f5f5; margin-bottom: 14px; position: relative;
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
.pdp-thumb.active { border-color: #c4a8e0; }
.pdp-thumb img { width:100%; height:100%; object-fit:cover; }

.pdp-info { padding-left: 32px; }
@media(max-width:768px){ .pdp-info{ padding-left:0; padding-top:28px; } }

.pdp-brand { font-size:10px; letter-spacing:4px; text-transform:uppercase; color:#c4a8e0; font-weight:600; margin-bottom:8px; }
.pdp-product-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(22px,3vw,34px); font-weight:700;
  color: #1a1a2e; line-height:1.15; margin-bottom:12px;
}
.pdp-rating-row { display:flex; align-items:center; gap:10px; margin-bottom:18px; flex-wrap:wrap; }
.pdp-stars-wrap { display:flex; gap:3px; color: #c4a8e0; }
.pdp-rnum { font-size:13px; font-weight:600; color:#1a1a2e; }
.pdp-rcount { font-size:12px; color:#888; }

.pdp-hr { border:none; border-top:1px solid #e8e4dc; margin:18px 0; }

.pdp-prices { display:flex; align-items:baseline; gap:12px; flex-wrap:wrap; margin-bottom:4px; }
.pdp-price { font-family:'Cormorant Garamond', serif; font-size:30px; font-weight:700; color:#1a1a2e; }
.pdp-orig-price { font-size:16px; color:#bbb; text-decoration:line-through; }
.pdp-disc-badge { font-size:12px; font-weight:600; letter-spacing:1px; color:#fff; background:#27ae60; padding:3px 8px; border-radius:4px; }
.pdp-save { font-size:12px; color:#27ae60; margin-bottom:18px; }

.pdp-stock-row { display:inline-flex; align-items:center; gap:7px; font-size:12px; font-weight:500; margin-bottom:20px; }
.pdp-stock-dot { width:7px; height:7px; border-radius:50%; background:#27ae60; }
.pdp-stock-ok { color:#27ae60; }

.pdp-label { font-size:10px; letter-spacing:2.5px; text-transform:uppercase; color:#888; font-weight:600; margin-bottom:10px; }

.pdp-color-list { display:flex; gap:12px; margin-bottom:20px; flex-wrap:wrap; }
.pdp-color-opt { display:flex; flex-direction:column; align-items:center; gap:5px; border:none; background:none; cursor:pointer; padding:0; }
.pdp-color-swatch { width:28px; height:28px; border-radius:50%; border:2.5px solid transparent; outline:2px solid transparent; transition:all 0.2s; }
.pdp-color-opt.active .pdp-color-swatch { outline:2px solid #c4a8e0; outline-offset:2px; }
.pdp-color-name { font-size:9px; color:#888; }

.pdp-size-list { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:22px; }
.pdp-size-btn {
  min-width:46px; padding:9px 12px;
  border:1.5px solid #e8e4dc; border-radius:6px;
  background:transparent; font-family:'Outfit', sans-serif;
  font-size:12px; font-weight:500; color:#1a1a2e;
  cursor:pointer; transition:all 0.2s;
}
.pdp-size-btn:hover { border-color:#1a1a2e; }
.pdp-size-btn.active { background:#1a1a2e; color:#fff; border-color:#1a1a2e; }

.pdp-qty-row { display:flex; align-items:center; gap:16px; margin-bottom:22px; }
.pdp-qty { display:flex; align-items:center; border:1.5px solid #e8e4dc; border-radius:8px; overflow:hidden; }
.pdp-qty-btn { width:38px; height:40px; border:none; background:#f9f9f9; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background 0.2s; }
.pdp-qty-btn:hover { background:#c4a8e0; color:#fff; }
.pdp-qty-num { width:46px; text-align:center; font-size:15px; font-weight:600; color:#1a1a2e; }

.pdp-btn-row { display:flex; gap:12px; margin-bottom:20px; flex-wrap:wrap; }
.pdp-btn-cart, .pdp-btn-buy {
  flex:1; min-width:150px; padding:14px 20px;
  border-radius:8px;
  font-family:'Outfit', sans-serif; font-size:11px; letter-spacing:2.5px;
  text-transform:uppercase; cursor:pointer; transition:all 0.3s;
  display:flex; align-items:center; justify-content:center; gap:8px;
}
.pdp-btn-cart { background:#1a1a2e; color:#fff; border:none; }
.pdp-btn-cart:hover { background:#2a2a4e; transform:translateY(-1px); }
.pdp-btn-cart.added { background:#c4a8e0; }
.pdp-btn-buy { background:#c4a8e0; color:#fff; border:none; }
.pdp-btn-buy:hover { background:#b3934e; transform:translateY(-1px); }

.pdp-trust { display:flex; gap:16px; flex-wrap:wrap; margin-bottom:22px; }
.pdp-trust-item { display:flex; align-items:center; gap:7px; font-size:11px; color:#888; }
.pdp-trust-icon { color:#c4a8e0; }

.pdp-desc { font-size:13.5px; color:#444; line-height:1.8; margin-bottom:14px; }
.pdp-feat-list { list-style:none; padding:0; margin:0; }
.pdp-feat-list li { display:flex; align-items:center; gap:8px; font-size:12px; color:#888; padding:5px 0; border-bottom:1px solid #e8e4dc; }
.pdp-feat-list li:last-child { border-bottom:none; }

.pdp-reviews { background: #f8f5f0; padding:60px 0; }
.pdp-section-ey { font-size:10px; letter-spacing:5px; text-transform:uppercase; color:#c4a8e0; font-weight:600; margin-bottom:8px; }
.pdp-section-h { font-family:'Cormorant Garamond', serif; font-size:clamp(24px,3vw,36px); font-weight:700; color:#1a1a2e; margin-bottom:36px; }
.pdp-section-h em { font-style:italic; color:#c4a8e0; }

.pdp-rating-box {
  display:flex; align-items:center; gap:24px;
  background:#fff; border-radius:12px; padding:28px;
  margin-bottom:28px; box-shadow:0 2px 16px rgba(0,0,0,0.05);
}
@media(max-width:576px){ .pdp-rating-box{ flex-direction:column; } }
.pdp-big-r { text-align:center; min-width:80px; }
.pdp-big-num { font-family:'Cormorant Garamond', serif; font-size:48px; font-weight:700; color:#1a1a2e; line-height:1; }
.pdp-big-stars { display:flex; justify-content:center; gap:3px; margin:6px 0; color: #c4a8e0; }
.pdp-big-cnt { font-size:11px; color:#888; }
.pdp-bars { flex:1; }
.pdp-bar-row { display:flex; align-items:center; gap:10px; margin-bottom:7px; }
.pdp-bar-lbl { font-size:11px; color:#888; min-width:28px; text-align:right; }
.pdp-bar-track { flex:1; height:6px; background:#e8e4dc; border-radius:3px; overflow:hidden; }
.pdp-bar-fill { height:100%; background:#c4a8e0; border-radius:3px; }
.pdp-bar-cnt { font-size:11px; color:#888; min-width:20px; }

.pdp-rev-card {
  background:#fff; border-radius:12px; padding:22px;
  margin-bottom:14px; border:1px solid #e8e4dc;
  transition:box-shadow 0.25s;
}
.pdp-rev-card:hover { box-shadow:0 6px 24px rgba(0,0,0,0.08); }
.pdp-rev-head { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:10px; flex-wrap:wrap; gap:10px; }
.pdp-rev-name { font-weight:600; font-size:14px; color:#1a1a2e; margin-bottom:4px; }
.pdp-rev-meta { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.pdp-rev-stars { display:flex; gap:2px; color: #c4a8e0; }
.pdp-verified { font-size:9px; letter-spacing:1px; color:#27ae60; font-weight:600; background:#e8f8ee; padding:2px 7px; border-radius:20px; }
.pdp-rev-date { font-size:11px; color:#bbb; }
.pdp-rev-title { font-weight:600; font-size:13px; color:#1a1a2e; margin-bottom:6px; }
.pdp-rev-body { font-size:13px; color:#555; line-height:1.7; }
.pdp-helpful { margin-top:12px; background:none; border:none; color:#c4a8e0; cursor:pointer; font-size:12px; display:flex; align-items:center; gap:5px; font-family:'Outfit', sans-serif; }

.pdp-similar { padding:60px 0; }
.pdp-sim-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
@media(max-width:992px){ .pdp-sim-grid{ grid-template-columns:repeat(2,1fr); } }
@media(max-width:480px){ .pdp-sim-grid{ grid-template-columns:repeat(2,1fr); gap:12px; } }

.pdp-sim-card {
  border-radius:12px; overflow:hidden; background:#fff;
  border:1px solid #e8e4dc; cursor:pointer;
  transition:box-shadow 0.3s, transform 0.3s;
}
.pdp-sim-card:hover { box-shadow:0 10px 28px rgba(0,0,0,0.1); transform:translateY(-5px); }
.pdp-sim-img-wrap { position:relative; aspect-ratio:1/1; overflow:hidden; background:#f5f5f5; }
.pdp-sim-img { width:100%; height:100%; object-fit:cover; transition:transform 0.5s; }
.pdp-sim-card:hover .pdp-sim-img { transform:scale(1.07); }
.pdp-sim-overlay {
  position:absolute; inset:0; background:rgba(0,0,0,0.55);
  display:flex; align-items:center; justify-content:center;
  opacity:0; transition:opacity 0.3s;
}
.pdp-sim-card:hover .pdp-sim-overlay { opacity:1; }
.pdp-sim-add-btn {
  padding:8px 16px; background:#fff; color:#1a1a2e;
  border:none; border-radius:6px; font-family:'Outfit', sans-serif;
  font-size:10px; letter-spacing:2px; text-transform:uppercase;
  cursor:pointer; display:flex; align-items:center; gap:5px;
}
.pdp-sim-add-btn:hover { background:#c4a8e0; color:#fff; }
.pdp-sim-badge {
  position:absolute; top:8px; left:8px; z-index:1;
  font-size:8px; font-weight:600; letter-spacing:1.5px;
  padding:3px 7px; border-radius:4px;
}
.pdp-sim-body { padding: 10px; }
.pdp-sim-cat { font-size:8.5px; letter-spacing:1.5px; text-transform:uppercase; color:#c4a8e0; font-weight:500; margin-bottom:2px; }
.pdp-sim-name { font-family:'Cormorant Garamond', serif; font-size:12px; font-weight:600; color:#1a1a2e; margin-bottom:5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.pdp-sim-price { font-size:14px; font-weight:700; color:#1a1a2e; }
.pdp-sim-orig { font-size:11px; color:#bbb; text-decoration:line-through; margin-left:6px; }
`;

export default function New_arrivals() {
  const [wishlist, setWishlist] = useState([]);
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

  const toggleWishlist = (id, e) => {
    if (e) e.stopPropagation();
    const isWished = wishlist.includes(id);
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    showToast(isWished ? "Removed from wishlist" : "Added to wishlist ♥");
  };

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

  const renderStars = (rating, size = 10) =>
    Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        style={{
          fontSize: size,
          color: "#c4a8e0",
          opacity: i < Math.round(rating) ? 1 : 0.2,
        }}
      />
    ));

  const DetailPage = ({ p }) => {
    const isWished = wishlist.includes(p.id);
    const tagStyle = p.tagStyle || { bg: "#1a1a2e", color: "#fff" };
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
            onClick={() => toggleWishlist(p.id)}
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
                <div className="pdp-brand">{p.brand || "New Arrival"}</div>
                <h1 className="pdp-product-name">{p.name}</h1>

                <div className="pdp-rating-row">
                  <div className="pdp-stars-wrap">
                    {renderStars(p.rating, 12)}
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
                        style={{ color: "#c4a8e0", flexShrink: 0 }}
                      />{" "}
                      {h}
                    </li>
                  ))}
                  <li>
                    <FaTag
                      size={10}
                      style={{ color: "#c4a8e0", flexShrink: 0 }}
                    />{" "}
                    Material: {p.material}
                  </li>
                  <li>
                    <FaCheckCircle
                      size={10}
                      style={{ color: "#c4a8e0", flexShrink: 0 }}
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
                <div className="pdp-big-stars">{renderStars(p.rating, 14)}</div>
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
                        {renderStars(r.rating, 11)}
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
                  const ts = sp.tagStyle || { bg: "#1a1a2e", color: "#fff" };
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
                        <div>
                          <span className="pdp-sim-price">{sp.price}</span>
                          <span className="pdp-sim-orig">
                            {sp.originalPrice}
                          </span>
                        </div>
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
      <style>{CSS}</style>
      {toast && <div className="toast-notif">{toast}</div>}

      {detailVisible && detailProduct && <DetailPage p={detailProduct} />}

      <section className="na-section">
        <Container>
          <Row className="align-items-end mb-0 g-3">
            <Col xs={12} md={7}>
              <div className="na-eyebrow">Just Dropped</div>
              <h2 className="na-title">
                New <em>Arrivals</em>
              </h2>
              <p className="na-subtitle">
                Freshest styles, curated every week — be first to wear it.
              </p>
            </Col>
          </Row>

          <div className="na-divider" />

          <Row className="g-4">
            {products.map((p, idx) => {
              const isAdded = addedItems[p.id];
              const isWished = wishlist.includes(p.id);

              return (
                <Col key={p.id} xs={12} sm={6} lg={3}>
                  <div
                    className="na-card"
                    onClick={() => openDetail(p)}
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="na-img-wrap">
                      <img src={p.images[0]} alt={p.name} className="na-img" />
                      <span
                        className="na-tag"
                        style={{
                          background: p.tagStyle.bg,
                          color: p.tagStyle.color,
                        }}
                      >
                        {p.tag}
                      </span>
                      <button
                        className="na-wish"
                        onClick={(e) => toggleWishlist(p.id, e)}
                      >
                        {isWished ? (
                          <FaHeart color="#e87e7e" size={12} />
                        ) : (
                          <FaRegHeart size={12} />
                        )}
                      </button>
                    </div>

                    <div className="na-body">
                      <div className="na-cat">{p.category}</div>
                      <h3 className="na-name">{p.name}</h3>

                      <div className="na-colors">
                        {p.colors.map((c, i) => (
                          <div
                            key={i}
                            className="na-dot"
                            style={{ background: c }}
                          />
                        ))}
                      </div>

                      <div className="na-rating">
                        {renderStars(p.rating)}
                        <span className="na-rev">({p.reviews})</span>
                      </div>

                      <div className="na-prices">
                        <span className="na-price">{p.price}</span>
                        <span className="na-orig">{p.originalPrice}</span>
                        <span className="na-disc">{p.discount} OFF</span>
                      </div>

                      <button
                        className={`na-cart ${isAdded ? "added" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(p);
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

          <div className="na-bottom">
            <p className="na-bottom-text">
              Explore our full collection of <span>200+ new styles</span> added
              this season
            </p>
            <a href="/new-arrivals" className="na-view-all">
              View All New Arrivals <FaArrowRight size={10} />
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
