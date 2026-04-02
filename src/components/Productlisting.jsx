// components/ProductListing.js
import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  FaHeart,
  FaRegHeart,
  FaStar,
  FaStarHalfAlt,
  FaShoppingBag,
  FaArrowRight,
  FaArrowLeft,
  FaCheckCircle,
  FaTruck,
  FaExchangeAlt,
  FaShieldAlt,
  FaUser,
  FaCalendarAlt,
  FaThumbsUp,
  FaMinus,
  FaPlus,
  FaBolt,
  FaTag,
} from "react-icons/fa";
import { useStore } from "../context/StoreContext";

// ─── All products with 4 real men's fashion images each ──────────────────────
const products = [
  {
    id: 1,
    name: "Oversized Linen Blazer",
    category: "Outerwear",
    price: "₹3,299",
    originalPrice: "₹5,499",
    discount: "40% OFF",
    rating: 4.8,
    reviews: 128,
    images: [
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594938298603-a8ffa9e24e27?w=800&q=85&auto=format&fit=crop",
    ],
    tag: "TRENDING",
    colors: ["#D4A96A", "#2C3E50", "#ECE9E4"],
    colorNames: ["Camel", "Navy", "Ivory"],
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "Crafted from 100% premium European linen, this oversized blazer brings effortless sophistication to any wardrobe. The relaxed silhouette drapes beautifully, offering a contemporary take on classic tailoring. Fully lined with breathable fabric and finished with genuine horn buttons. Perfect for summer days and evening events.",
    material: "100% Premium Linen",
    care: "Dry clean only. Do not bleach. Iron at medium temperature.",
    brand: "Urban Heritage",
    inStock: true,
    delivery: "Free delivery by Tomorrow",
    returns: "30 days easy returns",
    warranty: "6 months warranty",
    highlights: [
      "Breathable linen fabric",
      "Relaxed oversized fit",
      "Premium horn buttons",
      "Side pockets",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Rajesh K.",
        rating: 5,
        date: "15 Feb 2024",
        title: "Absolutely stunning!",
        comment:
          "The quality is amazing. Perfect fit and very comfortable. I wore it to a wedding and received so many compliments!",
        helpful: 45,
        verified: true,
      },
      {
        id: 2,
        user: "Priya S.",
        rating: 4,
        date: "10 Feb 2024",
        title: "Great fabric quality",
        comment:
          "Love the fabric quality. Slightly oversized as expected but that's the style. Looks very premium in person.",
        helpful: 32,
        verified: true,
      },
    ],
  },
  {
    id: 2,
    name: "Slim Fit Chinos",
    category: "Bottoms",
    price: "₹1,899",
    originalPrice: "₹2,999",
    discount: "37% OFF",
    rating: 4.6,
    reviews: 94,
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=85&auto=format&fit=crop",
    ],
    tag: "BESTSELLER",
    colors: ["#C2A87A", "#6B7280", "#1C1C1C"],
    colorNames: ["Khaki", "Grey", "Black"],
    sizes: ["28", "30", "32", "34", "36", "38"],
    description:
      "Premium slim fit chinos made from stretch cotton fabric for maximum comfort. Mid-rise waist with a tapered leg—versatile enough to go from boardroom to weekend brunch. The subtle stretch ensures freedom of movement throughout the day.",
    material: "98% Cotton, 2% Elastane",
    care: "Machine wash cold with like colors.",
    brand: "Modern Fit",
    inStock: true,
    delivery: "Free delivery by 2 days",
    returns: "30 days easy returns",
    warranty: "3 months warranty",
    highlights: [
      "Stretch comfort",
      "Slim tapered fit",
      "Durable stitching",
      "Deep pockets",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Suresh M.",
        rating: 5,
        date: "12 Feb 2024",
        title: "Perfect fit!",
        comment:
          "Great quality and fit. Exactly as described. The stretch fabric makes it so comfortable.",
        helpful: 38,
        verified: true,
      },
      {
        id: 2,
        user: "Amit R.",
        rating: 4,
        date: "5 Feb 2024",
        title: "Good buy",
        comment:
          "Nice chinos, colour is accurate. Slightly check measurements as sizing can vary.",
        helpful: 21,
        verified: true,
      },
    ],
  },
  {
    id: 3,
    name: "Premium Polo Shirt",
    category: "Tops",
    price: "₹1,299",
    originalPrice: "₹2,199",
    discount: "41% OFF",
    rating: 4.5,
    reviews: 211,
    images: [
      "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=85&auto=format&fit=crop",
    ],
    tag: "NEW IN",
    colors: ["#FFFFFF", "#1A3A5C", "#2E8B57"],
    colorNames: ["White", "Navy", "Forest"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Classic polo shirt with premium pique cotton fabric. Features a comfortable regular fit and durable two-button placket. The knitted collar and cuffs retain their shape wash after wash. Versatile enough for both casual and semi-formal occasions.",
    material: "100% Combed Pique Cotton",
    care: "Machine wash warm. Tumble dry low.",
    brand: "Classic Edge",
    inStock: true,
    delivery: "Free delivery by Tomorrow",
    returns: "30 days easy returns",
    warranty: "3 months warranty",
    highlights: [
      "Pique cotton fabric",
      "Anti-wrinkle finish",
      "Colour fast dye",
      "Knitted collar",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Vikram R.",
        rating: 4,
        date: "14 Feb 2024",
        title: "Good quality polo",
        comment:
          "Nice fabric and fit. Pique texture feels premium. Holds shape after washing well.",
        helpful: 25,
        verified: true,
      },
      {
        id: 2,
        user: "Deepak N.",
        rating: 5,
        date: "8 Feb 2024",
        title: "Excellent polo",
        comment:
          "Best polo I've bought at this price point. Fabric is soft yet structured.",
        helpful: 40,
        verified: true,
      },
    ],
  },
  {
    id: 4,
    name: "Washed Denim Jacket",
    category: "Outerwear",
    price: "₹2,799",
    originalPrice: "₹4,499",
    discount: "38% OFF",
    rating: 4.7,
    reviews: 76,
    images: [
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605459540739-9a2bc17b76e3?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598522325074-042db73aa4e6?w=800&q=85&auto=format&fit=crop",
    ],
    tag: "HOT",
    colors: ["#4A6FA5", "#1C1C2E", "#8B9DC3"],
    colorNames: ["Light Wash", "Dark Wash", "Stone Wash"],
    sizes: ["S", "M", "L", "XL"],
    description:
      "A timeless wardrobe staple reimagined with a premium enzyme wash for that perfectly broken-in look from day one. 100% cotton denim, button-through front, chest and side pockets. A layering essential for every season.",
    material: "100% Cotton Denim",
    care: "Machine wash cold, inside out. Do not bleach.",
    brand: "Denim Co.",
    inStock: true,
    delivery: "Free delivery by 3 days",
    returns: "30 days easy returns",
    warranty: "6 months warranty",
    highlights: [
      "Vintage enzyme wash",
      "Heavy duty construction",
      "Button-through front",
      "Multiple pockets",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Neha G.",
        rating: 5,
        date: "8 Feb 2024",
        title: "Awesome jacket!",
        comment:
          "Perfect wash and fit. Looks exactly like the photos. Very durable stitching.",
        helpful: 42,
        verified: true,
      },
      {
        id: 2,
        user: "Ravi K.",
        rating: 5,
        date: "1 Feb 2024",
        title: "Love it!",
        comment: "The wash finish is perfect. Gets better with every wear.",
        helpful: 29,
        verified: true,
      },
    ],
  },
  {
    id: 5,
    name: "Relaxed Kurta Set",
    category: "Ethnic",
    price: "₹2,499",
    originalPrice: "₹3,999",
    discount: "38% OFF",
    rating: 4.9,
    reviews: 183,
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594938298603-a8ffa9e24e27?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=85&auto=format&fit=crop",
    ],
    tag: "NEW IN",
    colors: ["#F5E6D3", "#8B4513", "#4A4A4A"],
    colorNames: ["Cream", "Brown", "Charcoal"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "A contemporary kurta set in breathable cotton-linen with hand-block printed accents at the hem and cuffs. Comes with matching straight-cut pyjamas. The relaxed silhouette ensures all-day comfort while the craftsmanship keeps you looking effortlessly festive.",
    material: "70% Cotton, 30% Linen",
    care: "Dry clean recommended. Hand wash cold.",
    brand: "Ethnic Essence",
    inStock: true,
    delivery: "Free delivery by Tomorrow",
    returns: "30 days easy returns",
    warranty: "3 months warranty",
    highlights: [
      "Hand-block print details",
      "Includes matching pyjamas",
      "Breathable cotton-linen",
      "Relaxed silhouette",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Anjali P.",
        rating: 5,
        date: "13 Feb 2024",
        title: "Beautiful kurta!",
        comment:
          "Excellent quality and the embroidery is so intricate. Perfect for festive occasions.",
        helpful: 56,
        verified: true,
      },
      {
        id: 2,
        user: "Meera S.",
        rating: 5,
        date: "7 Feb 2024",
        title: "Gorgeous set",
        comment:
          "The fabric is so comfortable and the print is beautiful. Received many compliments.",
        helpful: 48,
        verified: true,
      },
    ],
  },
  {
    id: 6,
    name: "Structured Bomber Jacket",
    category: "Outerwear",
    price: "₹3,799",
    originalPrice: "₹5,999",
    discount: "37% OFF",
    rating: 4.7,
    reviews: 59,
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=85&auto=format&fit=crop",
    ],
    tag: "TRENDING",
    colors: ["#1C1C1C", "#556B2F", "#8B0000"],
    colorNames: ["Jet Black", "Olive", "Burgundy"],
    sizes: ["S", "M", "L", "XL"],
    description:
      "Street-meets-structure in this premium bomber jacket. Crafted from a technical twill shell with satin lining, featuring ribbed collar, cuffs and hem. Zip pockets and a clean silhouette make this an instant wardrobe anchor.",
    material: "92% Polyester, 8% Spandex Shell",
    care: "Machine wash cold. Do not iron.",
    brand: "Street Style",
    inStock: true,
    delivery: "Free delivery by 2 days",
    returns: "30 days easy returns",
    warranty: "6 months warranty",
    highlights: [
      "Water resistant shell",
      "Satin lining",
      "Ribbed cuffs & hem",
      "YKK zippers",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Arjun K.",
        rating: 4,
        date: "9 Feb 2024",
        title: "Stylish jacket",
        comment:
          "Great quality and looks super stylish. The fit is perfect and it's surprisingly lightweight.",
        helpful: 31,
        verified: true,
      },
      {
        id: 2,
        user: "Siddharth V.",
        rating: 5,
        date: "3 Feb 2024",
        title: "Great buy!",
        comment:
          "Excellent bomber jacket. The satin lining is a nice touch. Highly recommend.",
        helpful: 27,
        verified: true,
      },
    ],
  },
  {
    id: 7,
    name: "Embroidered Sherwani",
    category: "Ethnic",
    price: "₹5,999",
    originalPrice: "₹8,999",
    discount: "33% OFF",
    rating: 4.9,
    reviews: 203,
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=85&auto=format&fit=crop",
    ],
    tag: "NEW IN",
    colors: ["#F5E6D3", "#8B4513", "#DAA520"],
    colorNames: ["Ivory", "Chocolate", "Gold"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "An heirloom-quality sherwani meticulously embroidered by master artisans with zari threadwork. Crafted from pure raw silk with a rich jacquard weave, this is celebration dressing at its finest. Includes matching churidar.",
    material: "Pure Raw Silk with Zari Work",
    care: "Dry clean only. Store in muslin bag.",
    brand: "Royal Heritage",
    inStock: true,
    delivery: "Free delivery by 5 days",
    returns: "Exchange only on customized products",
    warranty: "1 year craftsmanship warranty",
    highlights: [
      "Pure raw silk",
      "Zari embroidery",
      "Includes churidar",
      "Royal design",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Rahul M.",
        rating: 5,
        date: "11 Feb 2024",
        title: "Royal look!",
        comment:
          "Excellent craftsmanship. The zari work is absolutely stunning. Wore it to my brother's wedding.",
        helpful: 89,
        verified: true,
      },
      {
        id: 2,
        user: "Gaurav T.",
        rating: 5,
        date: "5 Feb 2024",
        title: "Worth every rupee",
        comment:
          "The quality of silk is superb. Fits perfectly and looks regal.",
        helpful: 62,
        verified: true,
      },
    ],
  },
  {
    id: 8,
    name: "Leather Biker Jacket",
    category: "Outerwear",
    price: "₹4,799",
    originalPrice: "₹7,999",
    discount: "40% OFF",
    rating: 4.8,
    reviews: 145,
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605459540739-9a2bc17b76e3?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=800&q=85&auto=format&fit=crop",
    ],
    tag: "TRENDING",
    colors: ["#2C2C2C", "#5C3A1A", "#1E3A5F"],
    colorNames: ["Matte Black", "Cognac", "Midnight Blue"],
    sizes: ["S", "M", "L", "XL"],
    description:
      "Full-grain vegetable-tanned leather, asymmetric front zip, belted waist—this biker jacket is built to become your most-reached-for piece. The supple leather breaks in beautifully over time, developing a unique patina that's entirely your own.",
    material: "100% Full-Grain Genuine Leather",
    care: "Professional leather clean only. Condition regularly.",
    brand: "Biker Culture",
    inStock: true,
    delivery: "Free delivery by 3 days",
    returns: "15 days returns",
    warranty: "1 year warranty",
    highlights: [
      "Full-grain leather",
      "Viscose quilted lining",
      "Asymmetric zip",
      "Develops unique patina",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Karan S.",
        rating: 5,
        date: "7 Feb 2024",
        title: "Perfect biker jacket",
        comment:
          "Amazing quality leather. Already feels like it's been broken in. A true investment piece.",
        helpful: 67,
        verified: true,
      },
      {
        id: 2,
        user: "Naveen P.",
        rating: 5,
        date: "2 Feb 2024",
        title: "Superb quality",
        comment:
          "The leather quality is premium. Zips are smooth and the lining is comfortable.",
        helpful: 44,
        verified: true,
      },
    ],
  },
];

const parsePrice = (s) => parseFloat(s.replace(/[₹,]/g, ""));

const tagStyles = {
  "NEW IN": { bg: "#1a1a2e", color: "#a8c4e0" },
  TRENDING: { bg: "#2a1a0e", color: "#e8c97e" },
  BESTSELLER: { bg: "#0e2010", color: "#6fcf97" },
  HOT: { bg: "#2a0e0e", color: "#e87e7e" },
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600;700&display=swap');

  :root {
    --gold: #B5975A;
    --dark: #0F0F0F;
    --mid: #6B6B6B;
    --light: #F8F5F0;
    --border: #E8E4DC;
    --success: #27AE60;
    --danger: #E74C3C;
    --white: #FFFFFF;
  }

  /* ─── Listing Section ─── */
  .pl-section {
    background: #fff;
    padding: 80px 0 100px;
    font-family: 'Jost', sans-serif;
  }
  .pl-eyebrow {
    font-size: 11px; letter-spacing: 5px; text-transform: uppercase;
    color: var(--gold); margin-bottom: 10px; font-family: 'Jost', sans-serif;
  }
  .pl-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(32px,4vw,48px); font-weight: 700;
    color: var(--dark); letter-spacing: -0.5px; line-height: 1.1; margin-bottom: 6px;
  }
  .pl-title em { font-style: italic; color: var(--gold); }
  .pl-subtitle { font-size: 14px; color: #555; font-weight: 300; letter-spacing: 0.3px; }
  .pl-divider {
    width: 100%; height: 0.5px;
    background: linear-gradient(to right, #B5975A55, #e0e0e0, transparent);
    margin: 40px 0;
  }
  .pl-bottom { text-align: center; margin-top: 60px; }
  .pl-bottom-line {
    font-family: 'Playfair Display', serif; font-size: 15px;
    font-style: italic; color: #888; margin-bottom: 24px;
  }
  .pl-shop-btn {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 13px 32px; background: var(--dark); color: #fff;
    font-family: 'Jost', sans-serif; font-size: 11px; letter-spacing: 3px;
    text-transform: uppercase; border: none; cursor: pointer; border-radius: 0;
    transition: background 0.3s;
  }
  .pl-shop-btn:hover { background: var(--gold); }

  /* ─── Card ─── */
  .pl-card {
    position: relative; border-radius: 10px; overflow: hidden;
    background: linear-gradient(to bottom,#0d0e0e,#f0f2f3);
    height: 100%; display: flex; flex-direction: column;
    border: none; transition: transform 0.35s ease, box-shadow 0.35s ease;
    cursor: pointer; z-index: 0;
  }
  .pl-card:before {
    content: ''; position: absolute; z-index: -1; top: -16px; right: -16px;
    background: #e8c97e; height: 32px; width: 32px; border-radius: 50%;
    transform: scale(1); transform-origin: 50% 50%;
    transition: transform 0.35s ease-out;
  }
  .pl-card:hover:before { transform: scale(28); }
  .pl-card:hover .pl-body { background: transparent; }
  .pl-card:hover .pl-name { color: #070707; }
  .pl-card:hover .pl-price { color: #fff; }
  .pl-card:hover .pl-cat { color: rgba(5,5,5,0.9); }
  .pl-card:hover .pl-star { color: #ffd966; }
  .pl-card:hover .pl-rev { color: rgba(10,10,10,0.7); }
  .pl-card:hover .pl-disc { color: #020202; }
  .pl-card:hover .pl-cart { border-color: #0a0909; color: #fff; }

  .pl-img-wrap {
    position: relative; overflow: hidden;
    aspect-ratio: 4/3; background: #f7f4f0; flex-shrink: 0; z-index: 1;
  }
  .pl-img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.6s ease;
  }
  .pl-card:hover .pl-img { transform: scale(1.05); }
  .pl-tag {
    position: absolute; top: 10px; left: 10px;
    font-size: 8px; font-weight: 600; letter-spacing: 2px;
    padding: 3px 8px; border-radius: 4px; font-family: 'Jost',sans-serif; z-index: 2;
  }
  .pl-wishlist {
    position: absolute; top: 8px; right: 8px;
    width: 30px; height: 30px;
    background: rgba(12,11,11,0.95); border: none; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background 0.2s, transform 0.2s;
    z-index: 2; box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  .pl-wishlist:hover { transform: scale(1.15); background: #fff; }
  .go-corner {
    display: flex; align-items: center; justify-content: center;
    position: absolute; width: 2em; height: 2em;
    top: 0; right: 0; border-radius: 0 4px 0 32px; z-index: 2; overflow: hidden;
  }
  .go-arrow { margin-top:-4px; margin-right:-4px; color:#fff; font-size:14px; }
  .pl-body {
    padding: 14px 16px 16px; flex:1; display:flex; flex-direction:column;
    background:#f2f8f9; transition: background 0.35s ease-out;
    position: relative; z-index: 1;
  }
  .pl-cat { font-size:9px; letter-spacing:2.5px; text-transform:uppercase; color:var(--gold); font-weight:500; margin-bottom:3px; transition:color 0.2s; }
  .pl-name { font-family:'Playfair Display',serif; font-size:13px; font-weight:600; color:var(--dark); margin-bottom:7px; line-height:1.3; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; transition:color 0.2s; }
  .pl-colors { display:flex; gap:5px; margin-bottom:7px; }
  .pl-dot { width:10px; height:10px; border-radius:50%; border:1.5px solid rgba(0,0,0,0.12); cursor:pointer; transition:transform 0.2s; }
  .pl-dot:hover { transform:scale(1.3); }
  .pl-rating { display:flex; align-items:center; gap:4px; margin-bottom:8px; }
  .pl-star { color:var(--gold); font-size:10px; transition:color 0.2s; }
  .pl-rev { font-size:10px; color:#aaa; transition:color 0.2s; }
  .pl-prices { display:flex; align-items:baseline; gap:6px; margin-bottom:10px; flex-wrap:wrap; }
  .pl-price { font-family:'Playfair Display',serif; font-size:15px; font-weight:700; color:var(--dark); transition:color 0.2s; }
  .pl-orig { font-size:11px; color:#bbb; text-decoration:line-through; }
  .pl-disc { font-size:10px; color:var(--success); font-weight:600; letter-spacing:0.5px; transition:color 0.2s; }
  .pl-cart {
    width:100%; padding:8px 0; background:transparent;
    border:1px solid var(--dark); color:var(--dark);
    font-family:'Jost',sans-serif; font-size:10px; letter-spacing:2.5px;
    text-transform:uppercase; cursor:pointer; border-radius:4px;
    transition: background 0.25s, color 0.25s, border-color 0.25s;
    margin-top:auto; display:flex; align-items:center; justify-content:center; gap:6px;
  }
  .pl-cart:hover { background:var(--dark); color:#F8F5F0; }
  .pl-cart.added { background:var(--gold); color:#fff; border-color:var(--gold); }
  .heart-active { color:var(--danger); }
  .heart-inactive { color:#bbb; }

  /* ─── Toast ─── */
  .toast-notif {
    position: fixed; bottom:20px; right:20px;
    background: var(--gold); color:#fff; padding:12px 20px;
    border-radius:8px; font-size:13px; font-family:'Jost',sans-serif;
    z-index:9999; animation: slideIn 0.3s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  @keyframes slideIn { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }

  /* ─── Detail Page (full-screen, route-like) ─── */
  .pdp-overlay {
    position: fixed; inset: 0;
    background: #fff; z-index: 3000;
    overflow-y: auto; overflow-x: hidden;
    font-family: 'Jost', sans-serif;
  }
  .pdp-overlay.entering { animation: pdpSlideIn 0.42s cubic-bezier(0.22,1,0.36,1) forwards; }
  .pdp-overlay.exiting  { animation: pdpSlideOut 0.32s cubic-bezier(0.55,0,1,0.45) forwards; }
  @keyframes pdpSlideIn  { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
  @keyframes pdpSlideOut { from{transform:translateX(0);opacity:1}   to{transform:translateX(100%);opacity:0} }

  /* Detail sticky nav */
  .pdp-nav {
    position: sticky; top: 0; z-index: 10;
    background: rgba(255,255,255,0.97);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 16px 40px;
    display: flex; justify-content: space-between; align-items: center;
  }
  @media(max-width:576px){ .pdp-nav{ padding:14px 16px; } }

  .pdp-back-btn {
    display: flex; align-items: center; gap: 10px;
    background: none; border: 1px solid var(--border);
    font-family: 'Jost', sans-serif; font-size: 12px;
    letter-spacing: 2px; text-transform: uppercase;
    color: var(--dark); padding: 9px 20px; border-radius: 6px;
    cursor: pointer; transition: all 0.25s;
  }
  .pdp-back-btn:hover { background: var(--dark); color: #fff; border-color: var(--dark); }

  .pdp-nav-title {
    font-family: 'Playfair Display', serif;
    font-size: 15px; font-weight: 600; color: var(--dark);
    opacity: 0; transition: opacity 0.2s;
  }
  .pdp-nav-title.visible { opacity: 1; }

  .pdp-nav-wish {
    display: flex; align-items: center; gap: 8px;
    border: 1px solid var(--border); background: none;
    padding: 9px 18px; border-radius: 6px;
    font-family: 'Jost', sans-serif; font-size: 12px;
    cursor: pointer; transition: all 0.25s; color: var(--dark);
  }
  .pdp-nav-wish:hover { border-color: var(--danger); }
  .pdp-nav-wish.wished { border-color: var(--danger); background: #fff0f0; color: var(--danger); }

  /* Detail inner wrap */
  .pdp-inner { max-width: 1200px; margin: 0 auto; padding: 40px 40px 80px; }
  @media(max-width:576px){ .pdp-inner{ padding: 24px 16px 60px; } }

  /* Breadcrumb */
  .pdp-crumb {
    font-size: 11px; letter-spacing: 0.5px; color: var(--mid);
    margin-bottom: 28px; display: flex; align-items: center; gap: 6px;
  }
  .pdp-crumb span { color: var(--dark); font-weight: 500; }
  .pdp-crumb-sep { color: #ccc; }

  /* Gallery */
  .pdp-gallery { position: sticky; top: 90px; }
  .pdp-main-wrap {
    width: 100%; aspect-ratio: 3/4;
    border-radius: 16px; overflow: hidden;
    background: var(--light); margin-bottom: 14px; position: relative;
  }
  .pdp-main-img {
    width: 100%; height: 100%;
    object-fit: cover; object-position: center top;
    transition: transform 0.55s ease;
  }
  .pdp-main-wrap:hover .pdp-main-img { transform: scale(1.05); }
  .pdp-tag-badge {
    position: absolute; top: 14px; left: 14px;
    font-size: 9px; font-weight: 600; letter-spacing: 2px;
    padding: 4px 10px; border-radius: 5px; z-index: 2;
    font-family: 'Jost', sans-serif;
  }

  /* Thumbnails — only 4 real images, no colour swatches */
  .pdp-thumbs { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; }
  .pdp-thumb {
    aspect-ratio: 1; border-radius: 8px; overflow: hidden;
    cursor: pointer; border: 2.5px solid transparent;
    transition: border-color 0.2s, transform 0.2s;
  }
  .pdp-thumb.active { border-color: var(--gold); }
  .pdp-thumb:hover { transform: scale(1.04); }
  .pdp-thumb img { width:100%; height:100%; object-fit:cover; }

  /* Info panel */
  .pdp-info { padding-left: 32px; }
  @media(max-width:768px){ .pdp-info{ padding-left:0; padding-top:28px; } }

  .pdp-brand { font-size:10px; letter-spacing:4px; text-transform:uppercase; color:var(--gold); font-weight:600; margin-bottom:8px; }
  .pdp-product-name {
    font-family: 'Playfair Display', serif;
    font-size: clamp(22px,3vw,34px); font-weight:700;
    color: var(--dark); line-height:1.15; margin-bottom:12px;
  }
  .pdp-rating-row { display:flex; align-items:center; gap:10px; margin-bottom:18px; flex-wrap:wrap; }
  .pdp-stars-wrap { display:flex; gap:3px; }
  .pdp-rnum { font-size:13px; font-weight:600; color:var(--dark); }
  .pdp-rcount { font-size:12px; color:var(--mid); }
  .pdp-sep { color:#ddd; }
  .pdp-sku { font-size:11px; color:#bbb; }

  .pdp-hr { border:none; border-top:1px solid var(--border); margin:18px 0; }

  .pdp-prices { display:flex; align-items:baseline; gap:12px; flex-wrap:wrap; margin-bottom:4px; }
  .pdp-price { font-family:'Playfair Display',serif; font-size:30px; font-weight:700; color:var(--dark); }
  .pdp-orig-price { font-size:16px; color:#bbb; text-decoration:line-through; }
  .pdp-disc-badge { font-size:12px; font-weight:600; letter-spacing:1px; color:#fff; background:var(--success); padding:3px 8px; border-radius:4px; }
  .pdp-save { font-size:12px; color:var(--success); margin-bottom:18px; }

  .pdp-stock-row { display:inline-flex; align-items:center; gap:7px; font-size:12px; font-weight:500; margin-bottom:20px; }
  .pdp-stock-dot { width:7px; height:7px; border-radius:50%; }
  .pdp-stock-ok .pdp-stock-dot { background:var(--success); }
  .pdp-stock-ok { color:var(--success); }
  .pdp-stock-low .pdp-stock-dot { background:#E67E22; }
  .pdp-stock-low { color:#E67E22; }

  .pdp-label { font-size:10px; letter-spacing:2.5px; text-transform:uppercase; color:var(--mid); font-weight:600; margin-bottom:10px; }

  /* Colours in info — swatches only (no thumbnails) */
  .pdp-color-list { display:flex; gap:12px; margin-bottom:20px; flex-wrap:wrap; }
  .pdp-color-opt { display:flex; flex-direction:column; align-items:center; gap:5px; border:none; background:none; cursor:pointer; padding:0; }
  .pdp-color-swatch { width:28px; height:28px; border-radius:50%; border:2.5px solid transparent; outline:2px solid transparent; transition:all 0.2s; box-shadow:0 1px 4px rgba(0,0,0,0.15); }
  .pdp-color-opt.active .pdp-color-swatch { outline:2px solid var(--gold); outline-offset:2px; }
  .pdp-color-name { font-size:9px; color:var(--mid); }

  .pdp-size-list { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:22px; }
  .pdp-size-btn {
    min-width:46px; padding:9px 12px;
    border:1.5px solid var(--border); border-radius:6px;
    background:transparent; font-family:'Jost',sans-serif;
    font-size:12px; font-weight:500; color:var(--dark);
    cursor:pointer; transition:all 0.2s;
  }
  .pdp-size-btn:hover { border-color:var(--dark); }
  .pdp-size-btn.active { background:var(--dark); color:#fff; border-color:var(--dark); }

  .pdp-qty-row { display:flex; align-items:center; gap:16px; margin-bottom:22px; }
  .pdp-qty { display:flex; align-items:center; border:1.5px solid var(--border); border-radius:8px; overflow:hidden; }
  .pdp-qty-btn { width:38px; height:40px; border:none; background:#f9f9f9; cursor:pointer; display:flex; align-items:center; justify-content:center; color:var(--dark); transition:background 0.2s; font-size:11px; }
  .pdp-qty-btn:hover { background:var(--gold); color:#fff; }
  .pdp-qty-num { width:46px; text-align:center; font-size:15px; font-weight:600; color:var(--dark); }

  .pdp-btn-row { display:flex; gap:12px; margin-bottom:20px; flex-wrap:wrap; }
  .pdp-btn-cart {
    flex:1; min-width:150px; padding:14px 20px;
    background:var(--dark); color:#fff; border:none; border-radius:8px;
    font-family:'Jost',sans-serif; font-size:11px; letter-spacing:2.5px;
    text-transform:uppercase; cursor:pointer; transition:background 0.3s, transform 0.15s;
    display:flex; align-items:center; justify-content:center; gap:8px;
  }
  .pdp-btn-cart:hover { background:#2a2a2a; transform:translateY(-1px); }
  .pdp-btn-cart.added { background:var(--gold); }
  .pdp-btn-buy {
    flex:1; min-width:150px; padding:14px 20px;
    background:var(--gold); color:#fff; border:none; border-radius:8px;
    font-family:'Jost',sans-serif; font-size:11px; letter-spacing:2.5px;
    text-transform:uppercase; cursor:pointer; transition:background 0.3s, transform 0.15s;
    display:flex; align-items:center; justify-content:center; gap:8px;
  }
  .pdp-btn-buy:hover { background:#a08040; transform:translateY(-1px); }

  /* Trust */
  .pdp-trust { display:flex; gap:16px; flex-wrap:wrap; margin-bottom:22px; }
  .pdp-trust-item { display:flex; align-items:center; gap:7px; font-size:11px; color:var(--mid); }
  .pdp-trust-icon { color:var(--gold); }

  /* Description */
  .pdp-desc { font-size:13.5px; color:#444; line-height:1.8; margin-bottom:14px; }
  .pdp-feat-list { list-style:none; padding:0; margin:0; }
  .pdp-feat-list li { display:flex; align-items:center; gap:8px; font-size:12px; color:var(--mid); padding:5px 0; border-bottom:1px solid var(--border); }
  .pdp-feat-list li:last-child { border-bottom:none; }

  /* Reviews section */
  .pdp-reviews { background:var(--light); padding:60px 0; }
  .pdp-section-ey { font-size:10px; letter-spacing:5px; text-transform:uppercase; color:var(--gold); font-weight:600; margin-bottom:8px; }
  .pdp-section-h { font-family:'Playfair Display',serif; font-size:clamp(24px,3vw,36px); font-weight:700; color:var(--dark); margin-bottom:36px; }
  .pdp-section-h em { font-style:italic; color:var(--gold); }

  .pdp-rating-box {
    display:flex; align-items:center; gap:24px;
    background:#fff; border-radius:12px; padding:28px;
    margin-bottom:28px; box-shadow:0 2px 16px rgba(0,0,0,0.05);
  }
  @media(max-width:576px){ .pdp-rating-box{ flex-direction:column; } }
  .pdp-big-r { text-align:center; min-width:80px; }
  .pdp-big-num { font-family:'Playfair Display',serif; font-size:48px; font-weight:700; color:var(--dark); line-height:1; }
  .pdp-big-stars { display:flex; justify-content:center; gap:3px; margin:6px 0; }
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
    transition:box-shadow 0.25s, transform 0.25s;
  }
  .pdp-rev-card:hover { box-shadow:0 6px 24px rgba(0,0,0,0.08); transform:translateY(-2px); }
  .pdp-rev-head { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:10px; }
  .pdp-rev-name { font-weight:600; font-size:14px; color:var(--dark); margin-bottom:4px; }
  .pdp-rev-meta { display:flex; align-items:center; gap:8px; }
  .pdp-rev-stars { display:flex; gap:2px; }
  .pdp-verified { font-size:9px; letter-spacing:1px; color:var(--success); font-weight:600; background:#e8f8ee; padding:2px 7px; border-radius:20px; }
  .pdp-rev-date { font-size:11px; color:#bbb; }
  .pdp-rev-title { font-weight:600; font-size:13px; color:var(--dark); margin-bottom:6px; }
  .pdp-rev-body { font-size:13px; color:#555; line-height:1.7; }
  .pdp-helpful { margin-top:12px; background:none; border:none; color:var(--gold); cursor:pointer; font-size:12px; display:flex; align-items:center; gap:5px; transition:transform 0.2s; font-family:'Jost',sans-serif; }
  .pdp-helpful:hover { transform:translateX(4px); }

  /* Similar products */
  .pdp-similar { padding:60px 0; }
  .pdp-sim-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
  @media(max-width:992px){ .pdp-sim-grid{ grid-template-columns:repeat(2,1fr); } }
  @media(max-width:480px){ .pdp-sim-grid{ grid-template-columns:repeat(2,1fr); gap:12px; } }

  .pdp-sim-card {
    border-radius:12px; overflow:hidden; background:#fff;
    border:1px solid var(--border); cursor:pointer;
    transition:box-shadow 0.3s, transform 0.3s;
    display:flex; flex-direction:column;
  }
  .pdp-sim-card:hover { box-shadow:0 10px 28px rgba(0,0,0,0.1); transform:translateY(-5px); }
  .pdp-sim-img-wrap { position:relative; aspect-ratio:4/3; overflow:hidden; background:var(--light); }
  .pdp-sim-img { width:100%; height:100%; object-fit:cover; transition:transform 0.5s; }
  .pdp-sim-card:hover .pdp-sim-img { transform:scale(1.07); }
  .pdp-sim-overlay {
    position:absolute; inset:0; background:rgba(15,15,15,0.55);
    display:flex; align-items:center; justify-content:center;
    opacity:0; transition:opacity 0.3s;
  }
  .pdp-sim-card:hover .pdp-sim-overlay { opacity:1; }
  .pdp-sim-add-btn {
    padding:8px 16px; background:#fff; color:var(--dark);
    border:none; border-radius:6px; font-family:'Jost',sans-serif;
    font-size:10px; letter-spacing:2px; text-transform:uppercase;
    cursor:pointer; display:flex; align-items:center; gap:5px;
    transition:background 0.2s;
  }
  .pdp-sim-add-btn:hover { background:var(--gold); color:#fff; }
  .pdp-sim-badge {
    position:absolute; top:8px; left:8px; z-index:1;
    font-size:8px; font-weight:600; letter-spacing:1.5px;
    padding:3px 7px; border-radius:4px;
    font-family:'Jost',sans-serif;
  }
  .pdp-sim-body { padding:12px; flex:1; display:flex; flex-direction:column; }
  .pdp-sim-cat { font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(--gold); font-weight:500; margin-bottom:4px; }
  .pdp-sim-name { font-family:'Playfair Display',serif; font-size:13px; font-weight:600; color:var(--dark); margin-bottom:8px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .pdp-sim-prices { display:flex; align-items:baseline; gap:6px; }
  .pdp-sim-price { font-family:'Playfair Display',serif; font-size:14px; font-weight:700; color:var(--dark); }
  .pdp-sim-orig { font-size:11px; color:#bbb; text-decoration:line-through; }
  .pdp-sim-disc { font-size:10px; color:var(--success); font-weight:600; }
`;

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ProductListing() {
  const [activeColor, setActiveColor] = useState({});
  const [addedItems, setAddedItems] = useState({});
  const [toast, setToast] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false); // controls mount
  const [detailAnim, setDetailAnim] = useState("entering"); // entering | exiting
  const [mainImg, setMainImg] = useState(0);
  const [selColor, setSelColor] = useState(0);
  const [selSize, setSelSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [addedDetail, setAddedDetail] = useState(false);

  const { addToCart, toggleWishlist, isInWishlist } = useStore();

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  // ── Open detail — route-like slide in ──
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

  // ── Close detail — slide out then unmount ──
  const closeDetail = () => {
    setDetailAnim("exiting");
    setTimeout(() => {
      setDetailVisible(false);
      setDetailProduct(null);
      document.body.style.overflow = "";
    }, 320);
  };

  const handleAddToCart = (item, quantity = 1, fromDetail = false) => {
    const cartItem = {
      id: item.id,
      name: item.name,
      price: parsePrice(item.price),
      originalPrice: parsePrice(item.originalPrice),
      priceDisplay: item.price,
      discount: item.discount,
      image: item.images[0],
      category: item.category,
      colors: item.colors,
      rating: item.rating,
      reviews: item.reviews,
      tag: item.tag,
      quantity,
    };
    addToCart(cartItem);
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

  const handleWishlist = (id, e) => {
    if (e) e.stopPropagation();
    toggleWishlist(id);
    showToast(
      isInWishlist(id) ? "Removed from wishlist" : "Added to wishlist ♥",
    );
  };

  const renderStars = (rating, size = 11) =>
    Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className="pl-star"
        style={{ fontSize: size, opacity: i < Math.round(rating) ? 1 : 0.18 }}
      />
    ));

  const renderDetailStars = (rating, size = 12) =>
    Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        style={{
          fontSize: size,
          color: "#B5975A",
          opacity: i < Math.round(rating) ? 1 : 0.18,
        }}
      />
    ));

  // Similar = same category, exclude current
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

  // ─── Detail Page JSX ────────────────────────────────────────────────────────
  const DetailPage = ({ p }) => {
    const isWished = isInWishlist(p.id);
    const tagStyle = tagStyles[p.tag] || { bg: "#111", color: "#eee" };
    const similar = getSimilar(p);
    const bars = ratingBars(p);
    const lowStock = false; // can add stock field later

    return (
      <div className={`pdp-overlay ${detailAnim}`}>
        {/* ── Sticky nav ── */}
        <div className="pdp-nav">
          <button className="pdp-back-btn" onClick={closeDetail}>
            <FaArrowLeft size={11} /> Back to Shop
          </button>
          <span className="pdp-nav-title visible">{p.name}</span>
          <button
            className={`pdp-nav-wish ${isWished ? "wished" : ""}`}
            onClick={() => handleWishlist(p.id)}
          >
            {isWished ? <FaHeart size={13} /> : <FaRegHeart size={13} />}
            {isWished ? "Wishlisted" : "Wishlist"}
          </button>
        </div>

        <div className="pdp-inner">
          {/* Breadcrumb */}
          <div className="pdp-crumb">
            <span style={{ cursor: "pointer" }} onClick={closeDetail}>
              Shop
            </span>
            <span className="pdp-crumb-sep">/</span>
            <span>{p.category}</span>
            <span className="pdp-crumb-sep">/</span>
            <span>{p.name}</span>
          </div>

          <Row>
            {/* ── LEFT: Gallery ── */}
            <Col md={6} lg={5}>
              <div className="pdp-gallery">
                {/* Main image */}
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

                {/* Thumbnails — 4 real product images only, NO colour divs */}
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

            {/* ── RIGHT: Info ── */}
            <Col md={6} lg={7}>
              <div className="pdp-info">
                <div className="pdp-brand">{p.brand}</div>
                <h1 className="pdp-product-name">{p.name}</h1>

                <div className="pdp-rating-row">
                  <div className="pdp-stars-wrap">
                    {renderDetailStars(p.rating)}
                  </div>
                  <span className="pdp-rnum">{p.rating}</span>
                  <span className="pdp-sep">·</span>
                  <span className="pdp-rcount">{p.reviews} reviews</span>
                </div>

                <hr className="pdp-hr" />

                {/* Price */}
                <div className="pdp-prices">
                  <span className="pdp-price">{p.price}</span>
                  <span className="pdp-orig-price">{p.originalPrice}</span>
                  <span className="pdp-disc-badge">{p.discount}</span>
                </div>
                <p className="pdp-save">
                  You save ₹{savings(p).toLocaleString("en-IN")}
                </p>

                {/* Stock */}
                <div
                  className={`pdp-stock-row ${lowStock ? "pdp-stock-low" : "pdp-stock-ok"}`}
                >
                  <span className="pdp-stock-dot" />
                  {lowStock ? "Only a few left — hurry!" : "In Stock"}
                </div>

                <hr className="pdp-hr" />

                {/* Colours — swatches in info panel only */}
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

                {/* Sizes */}
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

                {/* Qty */}
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

                {/* Action buttons */}
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

                {/* Trust badges */}
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

                {/* Description */}
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

        {/* ── Reviews ── */}
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
                  {renderDetailStars(p.rating, 14)}
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
                        {renderDetailStars(r.rating, 11)}
                      </div>
                      {r.verified && (
                        <span className="pdp-verified">✓ Verified</span>
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

        {/* ── Similar Products ── */}
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
                  const ts = tagStyles[sp.tag] || { bg: "#111", color: "#eee" };
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
                        <div className="pdp-sim-prices">
                          <span className="pdp-sim-price">{sp.price}</span>
                          <span className="pdp-sim-orig">
                            {sp.originalPrice}
                          </span>
                          <span className="pdp-sim-disc">{sp.discount}</span>
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

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>
      {toast && <div className="toast-notif">{toast}</div>}

      {/* Full-screen detail "page" — mounted/unmounted with slide animation */}
      {detailVisible && detailProduct && <DetailPage p={detailProduct} />}

      {/* Product listing (always in DOM so scroll position is preserved) */}
      <section className="pl-section">
        <Container>
          <Row className="align-items-end mb-2">
            <Col xs={12} md={7}>
              <p className="pl-eyebrow">— Curated for You —</p>
              <h2 className="pl-title">
                Most <em>Wanted</em>
                <br />
                This Season
              </h2>
              <p className="pl-subtitle">
                Hand-picked styles for the modern man
              </p>
            </Col>
          </Row>

          <div className="pl-divider" />

          <Row className="g-4">
            {products.map((item, idx) => {
              const tagStyle = tagStyles[item.tag] || {
                bg: "#111",
                color: "#eee",
              };
              const isAdded = addedItems[item.id];
              const isWishlisted = isInWishlist(item.id);

              return (
                <Col key={item.id} xs={12} sm={6} lg={4} xl={3}>
                  <div
                    className="pl-card"
                    style={{ animationDelay: `${idx * 0.08}s` }}
                    onClick={() => openDetail(item)}
                  >
                    <div className="pl-img-wrap">
                      {/* Only the first (primary) product image on the card */}
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="pl-img"
                        loading="lazy"
                      />
                      <span
                        className="pl-tag"
                        style={{
                          background: tagStyle.bg,
                          color: tagStyle.color,
                        }}
                      >
                        {item.tag}
                      </span>
                      <button
                        className="pl-wishlist"
                        onClick={(e) => handleWishlist(item.id, e)}
                      >
                        {isWishlisted ? (
                          <FaHeart className="heart-active" size={12} />
                        ) : (
                          <FaRegHeart className="heart-inactive" size={12} />
                        )}
                      </button>
                      <div className="go-corner">
                        <div className="go-arrow">→</div>
                      </div>
                    </div>

                    <div className="pl-body">
                      <div className="pl-cat">{item.category}</div>
                      <h3 className="pl-name">{item.name}</h3>

                      {/* Colour dots — purely decorative, no broken thumb images */}
                      <div className="pl-colors">
                        {item.colors.map((c, i) => (
                          <div
                            key={i}
                            className="pl-dot"
                            style={{
                              backgroundColor: c,
                              outline:
                                activeColor[item.id] === i
                                  ? `2px solid ${c}`
                                  : "none",
                              outlineOffset: "2px",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveColor((prev) => ({
                                ...prev,
                                [item.id]: i,
                              }));
                            }}
                          />
                        ))}
                      </div>

                      <div className="pl-rating">
                        {renderStars(item.rating)}
                        <span className="pl-rev">({item.reviews})</span>
                      </div>

                      <div className="pl-prices">
                        <span className="pl-price">{item.price}</span>
                        <span className="pl-orig">{item.originalPrice}</span>
                        <span className="pl-disc">{item.discount}</span>
                      </div>

                      <button
                        className={`pl-cart ${isAdded ? "added" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(item);
                        }}
                      >
                        <FaShoppingBag size={9} />
                        {isAdded ? "Added ✓" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>

          <div className="pl-bottom">
            <p className="pl-bottom-line">
              Showing {products.length} of 48 styles — there's more waiting for
              you
            </p>
            <button className="pl-shop-btn">
              Load More <FaArrowRight size={11} />
            </button>
          </div>
        </Container>
      </section>
    </>
  );
}
