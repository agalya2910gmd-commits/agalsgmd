// components/ProductListing.js
import React, { useState, useEffect, useRef, useCallback } from "react";
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
  FaClock,
} from "react-icons/fa";
import { useStore } from "../context/StoreContext";

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
    tag: "TRENDING",
    images: [
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594938298603-a8ffa9e24e27?w=800&q=85&auto=format&fit=crop",
    ],
    colors: ["#D4A96A", "#2C3E50", "#ECE9E4"],
    colorNames: ["Camel", "Navy", "Ivory"],
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "Crafted from 100% premium European linen, this oversized blazer brings effortless sophistication to any wardrobe. The relaxed silhouette drapes beautifully, offering a contemporary take on classic tailoring.",
    material: "100% Premium Linen",
    care: "Dry clean only.",
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
    tag: "BESTSELLER",
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=85&auto=format&fit=crop",
    ],
    colors: ["#C2A87A", "#6B7280", "#1C1C1C"],
    colorNames: ["Khaki", "Grey", "Black"],
    sizes: ["28", "30", "32", "34", "36", "38"],
    description:
      "Premium slim fit chinos made from stretch cotton fabric for maximum comfort. Mid-rise waist with a tapered leg—versatile enough to go from boardroom to weekend brunch.",
    material: "98% Cotton, 2% Elastane",
    care: "Machine wash cold.",
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
    tag: "NEW IN",
    images: [
      "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=85&auto=format&fit=crop",
    ],
    colors: ["#FFFFFF", "#1A3A5C", "#2E8B57"],
    colorNames: ["White", "Navy", "Forest"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Classic polo shirt with premium pique cotton fabric. Features a comfortable regular fit and durable two-button placket. Knitted collar and cuffs retain their shape wash after wash.",
    material: "100% Combed Pique Cotton",
    care: "Machine wash warm.",
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
    tag: "HOT",
    images: [
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605459540739-9a2bc17b76e3?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598522325074-042db73aa4e6?w=800&q=85&auto=format&fit=crop",
    ],
    colors: ["#4A6FA5", "#1C1C2E", "#8B9DC3"],
    colorNames: ["Light Wash", "Dark Wash", "Stone Wash"],
    sizes: ["S", "M", "L", "XL"],
    description:
      "A timeless wardrobe staple reimagined with a premium enzyme wash for that perfectly broken-in look from day one. 100% cotton denim.",
    material: "100% Cotton Denim",
    care: "Machine wash cold inside out.",
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
    tag: "NEW IN",
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594938298603-a8ffa9e24e27?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=85&auto=format&fit=crop",
    ],
    colors: ["#F5E6D3", "#8B4513", "#4A4A4A"],
    colorNames: ["Cream", "Brown", "Charcoal"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "A contemporary kurta set in breathable cotton-linen with hand-block printed accents at the hem and cuffs. Comes with matching straight-cut pyjamas.",
    material: "70% Cotton, 30% Linen",
    care: "Dry clean recommended.",
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
    tag: "TRENDING",
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=85&auto=format&fit=crop",
    ],
    colors: ["#1C1C1C", "#556B2F", "#8B0000"],
    colorNames: ["Jet Black", "Olive", "Burgundy"],
    sizes: ["S", "M", "L", "XL"],
    description:
      "Street-meets-structure in this premium bomber jacket. Crafted from a technical twill shell with satin lining.",
    material: "92% Polyester, 8% Spandex Shell",
    care: "Machine wash cold.",
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
    tag: "NEW IN",
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=85&auto=format&fit=crop",
    ],
    colors: ["#F5E6D3", "#8B4513", "#DAA520"],
    colorNames: ["Ivory", "Chocolate", "Gold"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "An heirloom-quality sherwani embroidered by master artisans with zari threadwork. Crafted from pure raw silk.",
    material: "Pure Raw Silk with Zari Work",
    care: "Dry clean only.",
    brand: "Royal Heritage",
    inStock: true,
    delivery: "Free delivery by 5 days",
    returns: "Exchange only",
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
    tag: "TRENDING",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605459540739-9a2bc17b76e3?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=800&q=85&auto=format&fit=crop",
    ],
    colors: ["#2C2C2C", "#5C3A1A", "#1E3A5F"],
    colorNames: ["Matte Black", "Cognac", "Midnight Blue"],
    sizes: ["S", "M", "L", "XL"],
    description:
      "Full-grain vegetable-tanned leather, asymmetric front zip — built to become your most-reached-for piece.",
    material: "100% Full-Grain Genuine Leather",
    care: "Professional leather clean only.",
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

/* ═══════════════════════════════════════════ CSS ══════════════════════════════════════════ */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600;700&display=swap');
  :root {
    --gold:#B5975A; --dark:#0F0F0F; --mid:#6B6B6B;
    --light:#F8F5F0; --border:#E8E4DC; --success:#27AE60;
    --danger:#E74C3C; --white:#FFFFFF;
  }

  /* ── Listing page ── */
  .pl-section{background:#fff;padding:80px 0 100px;font-family:'Jost',sans-serif}
  .pl-eyebrow{font-size:11px;letter-spacing:5px;text-transform:uppercase;color:var(--gold);margin-bottom:10px}
  .pl-title{font-family:'Playfair Display',serif;font-size:clamp(32px,4vw,48px);font-weight:700;color:var(--dark);letter-spacing:-.5px;line-height:1.1;margin-bottom:6px}
  .pl-title em{font-style:italic;color:var(--gold)}
  .pl-subtitle{font-size:14px;color:#555;font-weight:300}
  .pl-divider{width:100%;height:.5px;background:linear-gradient(to right,#B5975A55,#e0e0e0,transparent);margin:40px 0}
  .pl-bottom{text-align:center;margin-top:60px}
  .pl-bottom-line{font-family:'Playfair Display',serif;font-size:15px;font-style:italic;color:#888;margin-bottom:24px}
  .pl-shop-btn{display:inline-flex;align-items:center;gap:10px;padding:13px 32px;background:var(--dark);color:#fff;font-family:'Jost',sans-serif;font-size:11px;letter-spacing:3px;text-transform:uppercase;border:none;cursor:pointer;transition:background .3s}
  .pl-shop-btn:hover{background:var(--gold)}
  .pl-card{position:relative;border-radius:10px;overflow:hidden;background:linear-gradient(to bottom,#0d0e0e,#f0f2f3);height:100%;display:flex;flex-direction:column;cursor:pointer;z-index:0;transition:transform .35s ease,box-shadow .35s ease}
  .pl-card:before{content:'';position:absolute;z-index:-1;top:-16px;right:-16px;background:#e8c97e;height:32px;width:32px;border-radius:50%;transform:scale(1);transform-origin:50% 50%;transition:transform .35s ease-out}
  .pl-card:hover:before{transform:scale(28)}
  .pl-card:hover .pl-body{background:transparent}
  .pl-card:hover .pl-name,.pl-card:hover .pl-cat{color:#070707}
  .pl-card:hover .pl-price{color:#fff}
  .pl-card:hover .pl-star{color:#ffd966}
  .pl-card:hover .pl-rev,.pl-card:hover .pl-disc{color:rgba(10,10,10,.7)}
  .pl-card:hover .pl-cart{border-color:#0a0909;color:#fff}
  .pl-img-wrap{position:relative;overflow:hidden;aspect-ratio:4/3;background:#f7f4f0;flex-shrink:0;z-index:1}
  .pl-img{width:100%;height:100%;object-fit:cover;transition:transform .6s ease}
  .pl-card:hover .pl-img{transform:scale(1.05)}
  .pl-tag{position:absolute;top:10px;left:10px;font-size:8px;font-weight:600;letter-spacing:2px;padding:3px 8px;border-radius:4px;font-family:'Jost',sans-serif;z-index:2}
  .pl-wishlist{position:absolute;top:8px;right:8px;width:30px;height:30px;background:rgba(12,11,11,.95);border:none;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .2s,transform .2s;z-index:2}
  .pl-wishlist:hover{transform:scale(1.15);background:#fff}
  .go-corner{display:flex;align-items:center;justify-content:center;position:absolute;width:2em;height:2em;top:0;right:0;border-radius:0 4px 0 32px;z-index:2;overflow:hidden}
  .go-arrow{margin-top:-4px;margin-right:-4px;color:#fff;font-size:14px}
  .pl-body{padding:14px 16px 16px;flex:1;display:flex;flex-direction:column;background:#f2f8f9;transition:background .35s ease-out;position:relative;z-index:1}
  .pl-cat{font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:var(--gold);font-weight:500;margin-bottom:3px;transition:color .2s}
  .pl-name{font-family:'Playfair Display',serif;font-size:13px;font-weight:600;color:var(--dark);margin-bottom:7px;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;transition:color .2s}
  .pl-colors{display:flex;gap:5px;margin-bottom:7px}
  .pl-dot{width:10px;height:10px;border-radius:50%;border:1.5px solid rgba(0,0,0,.12);cursor:pointer;transition:transform .2s}
  .pl-dot:hover{transform:scale(1.3)}
  .pl-rating{display:flex;align-items:center;gap:4px;margin-bottom:8px}
  .pl-star{color:var(--gold);font-size:10px;transition:color .2s}
  .pl-rev{font-size:10px;color:#aaa;transition:color .2s}
  .pl-prices{display:flex;align-items:baseline;gap:6px;margin-bottom:10px;flex-wrap:wrap}
  .pl-price{font-family:'Playfair Display',serif;font-size:15px;font-weight:700;color:var(--dark);transition:color .2s}
  .pl-orig{font-size:11px;color:#bbb;text-decoration:line-through}
  .pl-disc{font-size:10px;color:var(--success);font-weight:600;letter-spacing:.5px;transition:color .2s}
  .pl-cart{width:100%;padding:8px 0;background:transparent;border:1px solid var(--dark);color:var(--dark);font-family:'Jost',sans-serif;font-size:10px;letter-spacing:2.5px;text-transform:uppercase;cursor:pointer;border-radius:4px;transition:background .25s,color .25s,border-color .25s;margin-top:auto;display:flex;align-items:center;justify-content:center;gap:6px}
  .pl-cart:hover{background:var(--dark);color:#F8F5F0}
  .pl-cart.added{background:var(--gold);color:#fff;border-color:var(--gold)}
  .heart-active{color:var(--danger)}
  .heart-inactive{color:#bbb}
  .toast-notif{position:fixed;bottom:20px;right:20px;background:var(--gold);color:#fff;padding:12px 20px;border-radius:8px;font-size:13px;font-family:'Jost',sans-serif;z-index:9999;animation:slideIn .3s ease;box-shadow:0 4px 12px rgba(0,0,0,.15)}
  @keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}

  /* ═══════════════ DETAIL OVERLAY ═══════════════ */
  .pdp-overlay{
    position:fixed;inset:0;background:#fff;
    z-index:3000;overflow-y:auto;overflow-x:hidden;
    font-family:'Jost',sans-serif;
  }
  .pdp-overlay.entering{animation:pdpIn .4s cubic-bezier(.22,1,.36,1) forwards}
  .pdp-overlay.exiting {animation:pdpOut .3s cubic-bezier(.55,0,1,.45) forwards}
  @keyframes pdpIn {from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
  @keyframes pdpOut{from{transform:translateX(0);opacity:1}to{transform:translateX(100%);opacity:0}}

  /* sticky nav */
  .pdp-nav{
    position:sticky;top:0;z-index:50;
    background:rgba(255,255,255,.97);backdrop-filter:blur(12px);
    border-bottom:1px solid var(--border);
    padding:11px 28px;
    display:flex;justify-content:space-between;align-items:center;
  }
  @media(max-width:576px){.pdp-nav{padding:10px 14px}}
  .pdp-back-btn{display:flex;align-items:center;gap:8px;background:none;border:1px solid var(--border);font-family:'Jost',sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--dark);padding:7px 15px;border-radius:6px;cursor:pointer;transition:all .22s}
  .pdp-back-btn:hover{background:var(--dark);color:#fff;border-color:var(--dark)}
  .pdp-nav-title{font-family:'Playfair Display',serif;font-size:14px;font-weight:600;color:var(--dark);max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .pdp-nav-wish{display:flex;align-items:center;gap:7px;border:1px solid var(--border);background:none;padding:7px 14px;border-radius:6px;font-family:'Jost',sans-serif;font-size:11px;cursor:pointer;transition:all .22s;color:var(--dark)}
  .pdp-nav-wish:hover{border-color:var(--danger)}
  .pdp-nav-wish.wished{border-color:var(--danger);background:#fdfbfb;color:var(--danger)}

  /* breadcrumb */
  .pdp-crumb{font-size:11px;color:var(--mid);display:flex;align-items:center;gap:5px;padding:12px 28px 0}
  @media(max-width:576px){.pdp-crumb{padding:10px 14px 0}}
  .pdp-crumb-link{color:var(--dark);font-weight:500;cursor:pointer}
  .pdp-crumb-sep{color:#ccc}

  /* ═══ HERO — exact match to reference image 2 ═══
     Layout: [thumb col 68px] [main img flex:1]  |  [info col ~45%]
     No scrollbar, no sticky tricks — just align-items:start on grid so
     left column's natural height equals the image, right column flows freely.
  */
  .pdp-hero{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:0 44px;
    max-width:1200px;
    margin:0 auto;
    padding:18px 28px 0;
    align-items:start;
  }
  @media(max-width:860px){.pdp-hero{grid-template-columns:1fr;gap:20px;padding:14px 14px 0}}

  /* gallery column — sticky so image stays while info scrolls */
  .pdp-gcol{
    position:sticky;
    top:56px;
    display:flex;
    gap:10px;
    align-self:start;
  }
  @media(max-width:860px){.pdp-gcol{position:static}}

  /* thumbs strip — left of main image, exactly like reference */
  .pdp-thumbs{
    display:flex;flex-direction:column;gap:8px;
    width:66px;flex-shrink:0;
  }
  .pdp-thumb{
    width:66px;height:80px;border-radius:7px;overflow:hidden;
    cursor:pointer;border:2px solid transparent;flex-shrink:0;
    background:var(--light);transition:border-color .18s,transform .18s;
  }
  .pdp-thumb.active{border-color:var(--gold)}
  .pdp-thumb:hover:not(.active){border-color:#ccc;transform:scale(1.04)}
  .pdp-thumb img{width:100%;height:100%;object-fit:cover;display:block}

  /* main image wrapper */
  .pdp-mwrap-col{flex:1;position:relative}
  .pdp-mwrap{
    width:100%;aspect-ratio:3/4;
    border-radius:12px;overflow:hidden;
    background:var(--light);position:relative;
    cursor:crosshair;
    box-shadow:0 4px 18px rgba(0,0,0,.08);
  }
  .pdp-mimg{width:100%;height:100%;object-fit:cover;object-position:center top;display:block;pointer-events:none}
  .pdp-tbadge{position:absolute;top:12px;left:12px;font-size:9px;font-weight:600;letter-spacing:2px;padding:4px 10px;border-radius:5px;z-index:2;font-family:'Jost',sans-serif;pointer-events:none}
  .zoom-lens{position:absolute;top:0;left:0;width:118px;height:118px;border:2px solid var(--gold);background:rgba(181,151,90,.07);border-radius:4px;pointer-events:none;z-index:15;opacity:0;visibility:hidden;transition:opacity .12s;will-change:transform}
  .zoom-lens.active{opacity:1;visibility:visible}
  .zoom-preview{position:absolute;top:0;left:calc(100% + 10px);width:270px;height:100%;overflow:hidden;border-radius:10px;box-shadow:0 10px 26px rgba(0,0,0,.18);z-index:20;pointer-events:none;border:1px solid var(--border);background-repeat:no-repeat;opacity:0;visibility:hidden;transition:opacity .14s;will-change:background-position}
  .zoom-preview.active{opacity:1;visibility:visible}
  @media(max-width:1160px){.zoom-preview{display:none!important}}

  /* ── Info column ── */
  .pdp-icol{padding-top:0}
  @media(max-width:860px){.pdp-icol{padding-top:0}}

  /* all info items — compact spacing matching reference */
  .pdp-brand {font-size:10px;letter-spacing:3.5px;text-transform:uppercase;color:var(--mid);font-weight:500;margin-bottom:4px}
  .pdp-pname {font-family:'Playfair Display',serif;font-size:clamp(20px,2vw,26px);font-weight:700;color:var(--dark);line-height:1.2;margin-bottom:8px}
  .pdp-rrow  {display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-bottom:10px}
  .pdp-rstars{display:flex;gap:2px}
  .pdp-rnum  {font-size:13px;font-weight:600;color:var(--dark)}
  .pdp-rcnt  {font-size:12px;color:var(--mid)}
  .pdp-rsep  {color:#ddd}
  .pdp-hr    {border:none;border-top:1px solid var(--border);margin:10px 0}

  .pdp-prices{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:2px}
  .pdp-price {font-family:'Playfair Display',serif;font-size:26px;font-weight:700;color:var(--dark)}
  .pdp-oprice{font-size:15px;color:#bbb;text-decoration:line-through}
  .pdp-dbadge{font-size:11px;font-weight:700;letter-spacing:.8px;color:#fff;background:var(--danger);padding:3px 8px;border-radius:4px}
  .pdp-save  {font-size:11px;color:var(--success);margin-bottom:8px}
  .pdp-stock {display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:500;margin-bottom:10px;color:var(--success)}
  .pdp-sdot  {width:7px;height:7px;border-radius:50%;background:var(--success)}

  .pdp-desc  {font-size:12.5px;color:#555;line-height:1.75;margin-bottom:12px}

  .pdp-lbl   {font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:var(--mid);font-weight:600;margin-bottom:8px}

  .pdp-clist {display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px}
  .pdp-copt  {display:flex;flex-direction:column;align-items:center;gap:4px;border:none;background:none;cursor:pointer;padding:0}
  .pdp-csw   {width:26px;height:26px;border-radius:50%;border:2px solid transparent;outline:2px solid transparent;transition:all .18s;box-shadow:0 1px 4px rgba(0,0,0,.14)}
  .pdp-copt.active .pdp-csw{outline:2px solid var(--gold);outline-offset:2px}
  .pdp-cname {font-size:8px;color:var(--mid)}

  .pdp-slist {display:flex;gap:7px;flex-wrap:wrap;margin-bottom:14px}
  .pdp-sbtn  {min-width:50px;padding:7px 11px;border:1.5px solid var(--border);border-radius:7px;background:transparent;font-family:'Jost',sans-serif;font-size:12px;font-weight:500;color:var(--dark);cursor:pointer;transition:all .18s;text-align:center}
  .pdp-sbtn:hover{border-color:var(--dark)}
  .pdp-sbtn.active{background:var(--dark);color:#fff;border-color:var(--dark)}

  .pdp-qrow  {display:flex;align-items:center;gap:12px;margin-bottom:14px}
  .pdp-qty   {display:flex;align-items:center;border:1.5px solid var(--border);border-radius:8px;overflow:hidden}
  .pdp-qbtn  {width:36px;height:38px;border:none;background:#f9f9f9;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--dark);transition:background .18s}
  .pdp-qbtn:hover{background:var(--gold);color:#fff}
  .pdp-qnum  {width:42px;text-align:center;font-size:14px;font-weight:600;color:var(--dark)}

  /* Buttons — matches reference: dark cart + teal/green buy */
  .pdp-brow  {display:flex;gap:10px;margin-bottom:14px}
  .pdp-bcart {
    flex:1;padding:13px 16px;
    background:var(--dark);color:#fff;border:none;border-radius:8px;
    font-family:'Jost',sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;
    cursor:pointer;transition:background .25s,transform .15s;
    display:flex;align-items:center;justify-content:center;gap:8px;
  }
  .pdp-bcart:hover{background:#222;transform:translateY(-1px)}
  .pdp-bcart.added{background:var(--gold)}
  .pdp-bbuy  {
    flex:1;padding:13px 16px;
    background:#1a6b3a;color:#fff;border:none;border-radius:8px;
    font-family:'Jost',sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;
    cursor:pointer;transition:background .25s,transform .15s;
    display:flex;align-items:center;justify-content:center;gap:8px;
  }
  .pdp-bbuy:hover{background:#145430;transform:translateY(-1px)}

  /* trust */
  .pdp-trust {display:flex;gap:10px;flex-wrap:wrap;padding:10px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
  .pdp-titem {display:flex;align-items:center;gap:6px;font-size:10px;color:var(--mid)}
  .pdp-ticon {color:var(--gold)}

  /* ═══ BELOW HERO ═══ */
  .pdp-below{max-width:1200px;margin:0 auto;padding:44px 28px 80px}
  @media(max-width:576px){.pdp-below{padding:32px 14px 60px}}

  .pdp-sey  {font-size:10px;letter-spacing:5px;text-transform:uppercase;color:var(--gold);font-weight:600;margin-bottom:5px}
  .pdp-sh   {font-family:'Playfair Display',serif;font-size:clamp(20px,2.6vw,28px);font-weight:700;color:var(--dark);margin-bottom:22px}
  .pdp-sh em{font-style:italic;color:var(--gold)}
  .pdp-sdiv {border:none;border-top:1px solid var(--border);margin:42px 0 34px}

  /* rating summary */
  .pdp-rsum {display:flex;align-items:center;gap:28px;flex-wrap:wrap;margin-bottom:22px}
  .pdp-bigr {text-align:center;min-width:72px}
  .pdp-bnum {font-family:'Playfair Display',serif;font-size:46px;font-weight:700;color:var(--dark);line-height:1}
  .pdp-bstars{display:flex;justify-content:center;gap:3px;margin:5px 0}
  .pdp-bcnt {font-size:11px;color:var(--mid)}
  .pdp-bars {flex:1}
  .pdp-br   {display:flex;align-items:center;gap:10px;margin-bottom:6px}
  .pdp-blbl {font-size:11px;color:var(--mid);min-width:28px;text-align:right}
  .pdp-btrk {flex:1;height:5px;background:var(--border);border-radius:3px;overflow:hidden}
  .pdp-bfil {height:100%;background:var(--gold);border-radius:3px}
  .pdp-bcn  {font-size:11px;color:var(--mid);min-width:20px}

  .pdp-rdiv {border:none;border-top:1px solid var(--border);margin:0 0 14px}
  .pdp-rcard{padding:18px 0;border-bottom:1px solid var(--border)}
  .pdp-rcard:last-child{border-bottom:none}
  .pdp-rhead{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:7px}
  .pdp-rname{font-weight:600;font-size:13px;color:var(--dark);margin-bottom:3px}
  .pdp-rmeta{display:flex;align-items:center;gap:8px}
  .pdp-rstars2{display:flex;gap:2px}
  .pdp-verified{font-size:9px;letter-spacing:1px;color:var(--success);font-weight:600}
  .pdp-rdate{font-size:11px;color:#bbb;display:flex;align-items:center;gap:4px}
  .pdp-rtitle{font-weight:600;font-size:13px;color:var(--dark);margin-bottom:4px}
  .pdp-rbody{font-size:12.5px;color:#555;line-height:1.7}
  .pdp-helpful{margin-top:9px;background:none;border:none;color:var(--gold);cursor:pointer;font-size:11px;display:flex;align-items:center;gap:5px;font-family:'Jost',sans-serif;padding:0;transition:transform .18s}
  .pdp-helpful:hover{transform:translateX(3px)}

  /* product grids */
  .pdp-pgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
  @media(max-width:860px){.pdp-pgrid{grid-template-columns:repeat(3,1fr)}}
  @media(max-width:560px){.pdp-pgrid{grid-template-columns:repeat(2,1fr);gap:10px}}
  .pdp-pc   {border-radius:10px;overflow:hidden;background:#fff;border:1px solid var(--border);cursor:pointer;transition:box-shadow .26s,transform .26s;display:flex;flex-direction:column}
  .pdp-pc:hover{box-shadow:0 8px 22px rgba(0,0,0,.10);transform:translateY(-4px)}
  .pdp-pimgw{position:relative;aspect-ratio:4/3;overflow:hidden;background:var(--light)}
  .pdp-pimg {width:100%;height:100%;object-fit:cover;transition:transform .46s}
  .pdp-pc:hover .pdp-pimg{transform:scale(1.07)}
  .pdp-povl {position:absolute;inset:0;background:rgba(15,15,15,.52);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .26s}
  .pdp-pc:hover .pdp-povl{opacity:1}
  .pdp-pabtn{padding:7px 13px;background:#fff;color:var(--dark);border:none;border-radius:6px;font-family:'Jost',sans-serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;display:flex;align-items:center;gap:5px;transition:background .2s}
  .pdp-pabtn:hover{background:var(--gold);color:#fff}
  .pdp-pbadge{position:absolute;top:8px;left:8px;z-index:1;font-size:8px;font-weight:600;letter-spacing:1.5px;padding:3px 7px;border-radius:4px;font-family:'Jost',sans-serif}
  .pdp-rvbadge{position:absolute;top:8px;right:8px;z-index:1;background:rgba(0,0,0,.6);color:#fff;font-size:8px;letter-spacing:1px;padding:3px 7px;border-radius:10px;font-family:'Jost',sans-serif;display:flex;align-items:center;gap:4px}
  .pdp-pbody{padding:10px 12px;flex:1;display:flex;flex-direction:column}
  .pdp-pcat {font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--gold);font-weight:500;margin-bottom:3px}
  .pdp-pnam {font-family:'Playfair Display',serif;font-size:13px;font-weight:600;color:var(--dark);margin-bottom:5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .pdp-ppr  {display:flex;align-items:baseline;gap:5px}
  .pdp-pp   {font-family:'Playfair Display',serif;font-size:13px;font-weight:700;color:var(--dark)}
  .pdp-po   {font-size:10px;color:#bbb;text-decoration:line-through}
  .pdp-pd   {font-size:9px;color:var(--success);font-weight:600}
`;

/* ═══════════════════════════════ DetailPage ═══════════════════════════════ */
const DetailPage = ({
  product,
  detailAnim,
  onClose,
  onAddToCart,
  onWishlist,
  isInWishlist,
  onProductClick,
  recentlyViewed,
}) => {
  const [mainImg, setMainImg] = useState(0);
  const [selColor, setSelColor] = useState(0);
  const [selSize, setSelSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [cartAdded, setCartAdded] = useState(false);

  const zoomRef = useRef(null);
  const lensRef = useRef(null);
  const previewRef = useRef(null);
  const rafRef = useRef(null);
  const activeRef = useRef(false);
  const overlayRef = useRef(null);

  const tagSt = tagStyles[product.tag] || { bg: "#111", color: "#fdfbfb" };
  const isWish = isInWishlist(product.id);
  const saving = parsePrice(product.originalPrice) - parsePrice(product.price);

  const stars = (r, sz = 12) =>
    Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        style={{
          fontSize: sz,
          color: "#B5975A",
          opacity: i < Math.round(r) ? 1 : 0.18,
        }}
      />
    ));

  const similar = products
    .filter((x) => x.category === product.category && x.id !== product.id)
    .slice(0, 4);
  const rvList = recentlyViewed.filter((p) => p.id !== product.id).slice(0, 4);
  const bars = [
    { l: "5★", p: 70, c: Math.round(product.reviews * 0.7) },
    { l: "4★", p: 18, c: Math.round(product.reviews * 0.18) },
    { l: "3★", p: 7, c: Math.round(product.reviews * 0.07) },
    { l: "2★", p: 3, c: Math.round(product.reviews * 0.03) },
    { l: "1★", p: 2, c: Math.round(product.reviews * 0.02) },
  ];

  const handleCart = () => {
    onAddToCart(product, qty, true);
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 1600);
  };
  const handlePClick = (p) => {
    onProductClick(p);
    setMainImg(0);
    setSelColor(0);
    setSelSize(null);
    setQty(1);
    setCartAdded(false);
    activeRef.current = false;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (overlayRef.current) overlayRef.current.scrollTop = 0;
  };

  /* zoom */
  const doZoom = (cx, cy) => {
    if (!zoomRef.current || !lensRef.current || !previewRef.current) return;
    const r = zoomRef.current.getBoundingClientRect();
    let rx = (cx - r.left) / r.width,
      ry = (cy - r.top) / r.height;
    rx = Math.min(Math.max(rx, 0), 1);
    ry = Math.min(Math.max(ry, 0), 1);
    const lw = 118,
      lh = 118;
    let ll = rx * r.width - lw / 2,
      lt = ry * r.height - lh / 2;
    ll = Math.min(Math.max(ll, 0), r.width - lw);
    lt = Math.min(Math.max(lt, 0), r.height - lh);
    lensRef.current.style.transform = `translate3d(${ll}px,${lt}px,0)`;
    const z = 3;
    const bx = Math.min(Math.max(rx * 100 * z, 0), z * 100 - 100);
    const by = Math.min(Math.max(ry * 100 * z, 0), z * 100 - 100);
    previewRef.current.style.backgroundPosition = `${bx}% ${by}%`;
  };
  const onMove = (e) => {
    if (!activeRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => doZoom(e.clientX, e.clientY));
  };
  const onEnter = () => {
    activeRef.current = true;
    lensRef.current?.classList.add("active");
    previewRef.current?.classList.add("active");
  };
  const onLeave = () => {
    activeRef.current = false;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    lensRef.current?.classList.remove("active");
    previewRef.current?.classList.remove("active");
  };

  useEffect(() => {
    activeRef.current = false;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    lensRef.current?.classList.remove("active");
    if (previewRef.current) {
      previewRef.current.classList.remove("active");
      previewRef.current.style.backgroundImage = `url(${product.images[mainImg]})`;
    }
  }, [mainImg, product.images]);

  const curImg = product.images[mainImg];

  return (
    <div className={`pdp-overlay ${detailAnim}`} ref={overlayRef}>
      {/* Nav */}
      <div className="pdp-nav">
        <button className="pdp-back-btn" onClick={onClose}>
          <FaArrowLeft size={10} /> Back to Shop
        </button>
        <span className="pdp-nav-title">{product.name}</span>
        <button
          className={`pdp-nav-wish ${isWish ? "wished" : ""}`}
          onClick={() => onWishlist(product.id)}
        >
          {isWish ? <FaHeart size={12} /> : <FaRegHeart size={12} />}{" "}
          {isWish ? "Wishlisted" : "Wishlist"}
        </button>
      </div>

      {/* Breadcrumb */}
      <div className="pdp-crumb">
        <span className="pdp-crumb-link" onClick={onClose}>
          Shop
        </span>
        <span className="pdp-crumb-sep">/</span>
        <span>{product.category}</span>
        <span className="pdp-crumb-sep">/</span>
        <span style={{ color: "var(--mid)" }}>{product.name}</span>
      </div>

      {/* ═══ HERO ═══ */}
      <div className="pdp-hero">
        {/* Left: thumbnails + main image (sticky) */}
        <div className="pdp-gcol">
          {/* Thumbs on the left — exactly like reference image 2 */}
          <div className="pdp-thumbs">
            {product.images.map((img, i) => (
              <div
                key={i}
                className={`pdp-thumb ${mainImg === i ? "active" : ""}`}
                onClick={() => setMainImg(i)}
              >
                <img src={img} alt={`${product.name} ${i + 1}`} />
              </div>
            ))}
          </div>

          {/* Main image */}
          <div className="pdp-mwrap-col">
            <div
              ref={zoomRef}
              className="pdp-mwrap"
              onMouseEnter={onEnter}
              onMouseLeave={onLeave}
              onMouseMove={onMove}
            >
              <img src={curImg} alt={product.name} className="pdp-mimg" />
              <div ref={lensRef} className="zoom-lens" />
              <span
                className="pdp-tbadge"
                style={{ background: tagSt.bg, color: tagSt.color }}
              >
                {product.tag}
              </span>
            </div>
            <div
              ref={previewRef}
              className="zoom-preview"
              style={{
                backgroundImage: `url(${curImg})`,
                backgroundSize: "300%",
                backgroundRepeat: "no-repeat",
              }}
            />
          </div>
        </div>

        {/* Right: info */}
        <div className="pdp-icol">
          <div className="pdp-brand">{product.brand}</div>
          <h1 className="pdp-pname">{product.name}</h1>

          <div className="pdp-rrow">
            <div className="pdp-rstars">{stars(product.rating)}</div>
            <span className="pdp-rnum">{product.rating}</span>
            <span className="pdp-rsep">·</span>
            <span className="pdp-rcnt">{product.reviews} reviews</span>
          </div>

          {/* Prices */}
          <div className="pdp-prices">
            <span className="pdp-price">{product.price}</span>
            <span className="pdp-oprice">{product.originalPrice}</span>
            <span className="pdp-dbadge">{product.discount}</span>
          </div>
          <p className="pdp-save">You save ₹{saving.toLocaleString("en-IN")}</p>
          <div className="pdp-stock">
            <span className="pdp-sdot" /> In Stock
          </div>

          {/* Description */}
          <p className="pdp-desc">{product.description}</p>

          <hr className="pdp-hr" />

          {/* Colors */}
          <div className="pdp-lbl">Select Colors</div>
          <div className="pdp-clist">
            {product.colors.map((c, i) => (
              <button
                key={i}
                className={`pdp-copt ${selColor === i ? "active" : ""}`}
                onClick={() => setSelColor(i)}
              >
                <div className="pdp-csw" style={{ backgroundColor: c }} />
                <span className="pdp-cname">{product.colorNames[i]}</span>
              </button>
            ))}
          </div>

          {/* Sizes */}
          <div className="pdp-lbl">Choose Size</div>
          <div className="pdp-slist">
            {product.sizes.map((s) => (
              <button
                key={s}
                className={`pdp-sbtn ${selSize === s ? "active" : ""}`}
                onClick={() => setSelSize(s)}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Qty */}
          <div className="pdp-lbl">Quantity</div>
          <div className="pdp-qrow">
            <div className="pdp-qty">
              <button
                className="pdp-qbtn"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                <FaMinus size={9} />
              </button>
              <span className="pdp-qnum">{qty}</span>
              <button className="pdp-qbtn" onClick={() => setQty((q) => q + 1)}>
                <FaPlus size={9} />
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pdp-brow">
            <button
              className={`pdp-bcart ${cartAdded ? "added" : ""}`}
              onClick={handleCart}
            >
              <FaShoppingBag size={11} />{" "}
              {cartAdded ? "Added ✓" : "Add to Cart"}
            </button>
            <button className="pdp-bbuy">
              <FaBolt size={11} /> Buy Now
            </button>
          </div>

          {/* Trust */}
          <div className="pdp-trust">
            <div className="pdp-titem">
              <FaTruck className="pdp-ticon" size={11} /> {product.delivery}
            </div>
            <div className="pdp-titem">
              <FaExchangeAlt className="pdp-ticon" size={11} />{" "}
              {product.returns}
            </div>
            <div className="pdp-titem">
              <FaShieldAlt className="pdp-ticon" size={11} /> {product.warranty}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ BELOW: Reviews → Similar → Recently Viewed ═══ */}
      <div className="pdp-below">
        {/* Reviews */}
        <p className="pdp-sey">— Customer Feedback —</p>
        <h2 className="pdp-sh">
          What Our Customers <em>Say</em>
        </h2>

        <div className="pdp-rsum">
          <div className="pdp-bigr">
            <div className="pdp-bnum">{product.rating}</div>
            <div className="pdp-bstars">{stars(product.rating, 13)}</div>
            <div className="pdp-bcnt">{product.reviews} ratings</div>
          </div>
          <div className="pdp-bars">
            {bars.map((b) => (
              <div className="pdp-br" key={b.l}>
                <span className="pdp-blbl">{b.l}</span>
                <div className="pdp-btrk">
                  <div className="pdp-bfil" style={{ width: `${b.p}%` }} />
                </div>
                <span className="pdp-bcn">{b.c}</span>
              </div>
            ))}
          </div>
        </div>

        <hr className="pdp-rdiv" />
        {product.reviewsList.map((r) => (
          <div className="pdp-rcard" key={r.id}>
            <div className="pdp-rhead">
              <div>
                <div className="pdp-rname">{r.user}</div>
                <div className="pdp-rmeta">
                  <div className="pdp-rstars2">{stars(r.rating, 11)}</div>
                  {r.verified && (
                    <span className="pdp-verified">✓ Verified</span>
                  )}
                </div>
              </div>
              <span className="pdp-rdate">
                <FaCalendarAlt size={9} /> {r.date}
              </span>
            </div>
            <div className="pdp-rtitle">{r.title}</div>
            <div className="pdp-rbody">{r.comment}</div>
            <button className="pdp-helpful">
              <FaThumbsUp size={9} /> Helpful ({r.helpful})
            </button>
          </div>
        ))}

        {/* Similar Products — AFTER reviews */}
        {similar.length > 0 && (
          <>
            <hr className="pdp-sdiv" />
            <p className="pdp-sey">— You May Also Like —</p>
            <h2 className="pdp-sh">
              Similar <em>Styles</em>
            </h2>
            <div className="pdp-pgrid">
              {similar.map((sp) => {
                const ts = tagStyles[sp.tag] || {
                  bg: "#111",
                  color: "#fdf9f9",
                };
                return (
                  <div
                    key={sp.id}
                    className="pdp-pc"
                    onClick={() => handlePClick(sp)}
                  >
                    <div className="pdp-pimgw">
                      <img
                        src={sp.images[0]}
                        alt={sp.name}
                        className="pdp-pimg"
                      />
                      <span
                        className="pdp-pbadge"
                        style={{ background: ts.bg, color: ts.color }}
                      >
                        {sp.tag}
                      </span>
                      <div className="pdp-povl">
                        <button
                          className="pdp-pabtn"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(sp, 1, false);
                          }}
                        >
                          <FaShoppingBag size={9} /> Quick Add
                        </button>
                      </div>
                    </div>
                    <div className="pdp-pbody">
                      <div className="pdp-pcat">{sp.category}</div>
                      <div className="pdp-pnam">{sp.name}</div>
                      <div className="pdp-ppr">
                        <span className="pdp-pp">{sp.price}</span>
                        <span className="pdp-po">{sp.originalPrice}</span>
                        <span className="pdp-pd">{sp.discount}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Recently Viewed */}
        {rvList.length > 0 && (
          <>
            <hr className="pdp-sdiv" />
            <p className="pdp-sey">— Your Journey —</p>
            <h2 className="pdp-sh">
              Recently <em>Viewed</em>
            </h2>
            <div className="pdp-pgrid">
              {rvList.map((rv) => {
                const ts = tagStyles[rv.tag] || {
                  bg: "#111",
                  color: "#fdf9f9",
                };
                return (
                  <div
                    key={rv.id}
                    className="pdp-pc"
                    onClick={() => handlePClick(rv)}
                  >
                    <div className="pdp-pimgw">
                      <img
                        src={rv.images[0]}
                        alt={rv.name}
                        className="pdp-pimg"
                      />
                      <span
                        className="pdp-pbadge"
                        style={{ background: ts.bg, color: ts.color }}
                      >
                        {rv.tag}
                      </span>
                      <span className="pdp-rvbadge">
                        <FaClock size={8} /> Viewed
                      </span>
                      <div className="pdp-povl">
                        <button
                          className="pdp-pabtn"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(rv, 1, false);
                          }}
                        >
                          <FaShoppingBag size={9} /> Quick Add
                        </button>
                      </div>
                    </div>
                    <div className="pdp-pbody">
                      <div className="pdp-pcat">{rv.category}</div>
                      <div className="pdp-pnam">{rv.name}</div>
                      <div className="pdp-ppr">
                        <span className="pdp-pp">{rv.price}</span>
                        <span className="pdp-po">{rv.originalPrice}</span>
                        <span className="pdp-pd">{rv.discount}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════ Listing ═══════════════════════════════ */
export default function ProductListing() {
  const [activeColor, setActiveColor] = useState({});
  const [addedItems, setAddedItems] = useState({});
  const [toast, setToast] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailAnim, setDetailAnim] = useState("entering");
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  const { addToCart, toggleWishlist, isInWishlist } = useStore();

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }, []);

  const openDetail = useCallback((product) => {
    const scrollY = window.scrollY;
    setDetailProduct(product);
    setDetailAnim("entering");
    setDetailVisible(true);
    document.body.style.overflow = "hidden";
    document.body.dataset.scrollY = scrollY;
    setRecentlyViewed((prev) =>
      [product, ...prev.filter((p) => p.id !== product.id)].slice(0, 8),
    );
  }, []);

  const closeDetail = useCallback(() => {
    setDetailAnim("exiting");
    const scrollY = parseInt(document.body.dataset.scrollY || "0", 10);
    setTimeout(() => {
      setDetailVisible(false);
      setDetailProduct(null);
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY);
      delete document.body.dataset.scrollY;
    }, 320);
  }, []);

  const handleAddToCart = useCallback(
    (item, quantity = 1) => {
      addToCart({
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
      });
      setAddedItems((prev) => ({ ...prev, [item.id]: true }));
      showToast(`${item.name} added to cart! ✓`);
      setTimeout(
        () => setAddedItems((prev) => ({ ...prev, [item.id]: false })),
        1600,
      );
    },
    [addToCart, showToast],
  );

  const handleWishlist = useCallback(
    (id, e) => {
      if (e) e.stopPropagation();
      toggleWishlist(id);
      showToast(
        isInWishlist(id) ? "Removed from wishlist" : "Added to wishlist ♥",
      );
    },
    [toggleWishlist, isInWishlist, showToast],
  );

  const handleProductClick = useCallback((p) => {
    setDetailProduct(p);
    setDetailAnim("entering");
    setRecentlyViewed((prev) =>
      [p, ...prev.filter((x) => x.id !== p.id)].slice(0, 8),
    );
  }, []);

  const renderStars = useCallback(
    (rating, size = 11) =>
      Array.from({ length: 5 }, (_, i) => (
        <FaStar
          key={i}
          className="pl-star"
          style={{ fontSize: size, opacity: i < Math.round(rating) ? 1 : 0.18 }}
        />
      )),
    [],
  );

  return (
    <>
      <style>{css}</style>
      {toast && <div className="toast-notif">{toast}</div>}

      {detailVisible && detailProduct && (
        <DetailPage
          product={detailProduct}
          detailAnim={detailAnim}
          onClose={closeDetail}
          onAddToCart={handleAddToCart}
          onWishlist={toggleWishlist}
          isInWishlist={isInWishlist}
          onProductClick={handleProductClick}
          recentlyViewed={recentlyViewed}
        />
      )}

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
              const ts = tagStyles[item.tag] || {
                bg: "#111",
                color: "#fffcfc",
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
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="pl-img"
                        loading="lazy"
                      />
                      <span
                        className="pl-tag"
                        style={{ background: ts.bg, color: ts.color }}
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
                        <FaShoppingBag size={9} />{" "}
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
