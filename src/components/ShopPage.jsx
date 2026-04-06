// components/ShopPage.jsx
import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import s1 from "../components/images/saree1.jpg";
import s2 from "../components/images/saree2.jpg";
import s4 from "../components/images/saree4.jpg";
import s5 from "../components/images/saree5.jpg";
import {
  FaHeart,
  FaRegHeart,
  FaStar,
  FaShoppingBag,
  FaArrowRight,
  FaChevronDown,
  FaCheckCircle,
} from "react-icons/fa";
import { useStore } from "../context/StoreContext";
import { useProducts } from "../context/ProductContext";

// ─── AGE LIMITS ───────────────────────────────────────────────────────────────
const ageLimits = {
  Men: [
    { label: "All Ages", value: "all" },
    { label: "16–20", value: "16-20", min: 16, max: 20 },
    { label: "21–25", value: "21-25", min: 21, max: 25 },
    { label: "26–35", value: "26-35", min: 26, max: 35 },
    { label: "36+", value: "36+", min: 36, max: 99 },
  ],
  Women: [
    { label: "All Ages", value: "all" },
    { label: "14–18", value: "14-18", min: 14, max: 18 },
    { label: "19–25", value: "19-25", min: 19, max: 25 },
    { label: "26–35", value: "26-35", min: 26, max: 35 },
    { label: "36+", value: "36+", min: 36, max: 99 },
  ],
};

// ─── AGE MAP (static products only) ──────────────────────────────────────────
const productAgeMap = {
  1: { min: 21, max: 35 },
  2: { min: 16, max: 25 },
  3: { min: 26, max: 99 },
  4: { min: 16, max: 25 },
  5: { min: 16, max: 20 },
  6: { min: 21, max: 35 },
  7: { min: 16, max: 25 },
  8: { min: 21, max: 35 },
  9: { min: 26, max: 35 },
  10: { min: 21, max: 35 },
  11: { min: 16, max: 99 },
  12: { min: 26, max: 99 },
  13: { min: 26, max: 99 },
  14: { min: 19, max: 35 },
  15: { min: 14, max: 99 },
  16: { min: 21, max: 45 },
  17: { min: 14, max: 25 },
  18: { min: 19, max: 25 },
  19: { min: 14, max: 25 },
  20: { min: 16, max: 30 },
  21: { min: 14, max: 99 },
  22: { min: 14, max: 99 },
  23: { min: 14, max: 25 },
  24: { min: 14, max: 35 },
  25: { min: 16, max: 99 },
  26: { min: 16, max: 99 },
  27: { min: 21, max: 99 },
  28: { min: 16, max: 35 },
  29: { min: 21, max: 99 },
  30: { min: 21, max: 99 },
  31: { min: 16, max: 99 },
  32: { min: 21, max: 99 },
  33: { min: 21, max: 99 },
};

// ─── STATIC PRODUCTS ──────────────────────────────────────────────────────────
const staticProducts = [
  {
    id: 1,
    name: "Oxford Button-Down Shirt",
    category: "Men",
    subCategory: "Shirts",
    price: "₹1,799",
    originalPrice: "₹2,999",
    discount: "40% OFF",
    rating: 4.7,
    reviews: 312,
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=700&q=90&auto=format&fit=crop",
    tag: "BESTSELLER",
    colors: ["#FFFFFF", "#4A6FA5", "#2E8B57"],
    description: "Classic Oxford weave, button-down collar, slim fit",
  },
  {
    id: 2,
    name: "Linen Summer Shirt",
    category: "Men",
    subCategory: "Shirts",
    price: "₹2,299",
    originalPrice: "₹3,499",
    discount: "34% OFF",
    rating: 4.6,
    reviews: 189,
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=700&q=90&auto=format&fit=crop",
    tag: "NEW IN",
    colors: ["#E8D4B8", "#A5B4CB", "#8B9A6E"],
    description: "Breathable linen-cotton blend, perfect for summer",
  },
  {
    id: 3,
    name: "Formal White Dress Shirt",
    category: "Men",
    subCategory: "Shirts",
    price: "₹1,599",
    originalPrice: "₹2,699",
    discount: "41% OFF",
    rating: 4.8,
    reviews: 456,
    image:
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=700&q=90&auto=format&fit=crop",
    tag: "TRENDING",
    colors: ["#FFFFFF", "#F5F5F5"],
    description: "Crisp cotton poplin, spread collar, regular fit",
  },
  {
    id: 4,
    name: "Premium Polo T-Shirt",
    category: "Men",
    subCategory: "T-Shirts",
    price: "₹1,299",
    originalPrice: "₹2,199",
    discount: "41% OFF",
    rating: 4.5,
    reviews: 211,
    image:
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=700&q=90&auto=format&fit=crop",
    tag: "NEW IN",
    colors: ["#FFFFFF", "#1A3A5C", "#2E8B57"],
    description: "Premium cotton pique, classic fit with ribbed collar",
  },
  {
    id: 5,
    name: "Graphic Crew Neck Tee",
    category: "Men",
    subCategory: "T-Shirts",
    price: "₹899",
    originalPrice: "₹1,499",
    discount: "40% OFF",
    rating: 4.4,
    reviews: 334,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=700&q=90&auto=format&fit=crop",
    tag: "HOT",
    colors: ["#1C1C1C", "#4A6FA5", "#E64B2E"],
    description: "Soft 100% cotton, relaxed fit, bold graphic print",
  },
  {
    id: 6,
    name: "V-Neck Essential Tee",
    category: "Men",
    subCategory: "T-Shirts",
    price: "₹799",
    originalPrice: "₹1,299",
    discount: "38% OFF",
    rating: 4.5,
    reviews: 567,
    image:
      "https://images.unsplash.com/photo-1618517351616-38fb9c5210c6?w=700&q=90&auto=format&fit=crop",
    tag: "BESTSELLER",
    colors: ["#FFFFFF", "#2C3E50", "#8B5A2B"],
    description: "Ultra-soft cotton, slim v-neck, everyday essential",
  },
  {
    id: 7,
    name: "Tropical Print Shirt",
    category: "Men",
    subCategory: "Printed Shirts",
    price: "₹1,999",
    originalPrice: "₹3,299",
    discount: "39% OFF",
    rating: 4.6,
    reviews: 143,
    image:
      "https://images.unsplash.com/photo-1625753782971-2b3d5bca1e64?w=700&q=90&auto=format&fit=crop",
    tag: "TRENDING",
    colors: ["#2E8B57", "#D4A96A", "#4A6FA5"],
    description: "Vibrant tropical print, camp collar, resort style",
  },
  {
    id: 8,
    name: "Floral Cuban Collar Shirt",
    category: "Men",
    subCategory: "Printed Shirts",
    price: "₹1,799",
    originalPrice: "₹2,999",
    discount: "40% OFF",
    rating: 4.5,
    reviews: 98,
    image:
      "https://images.unsplash.com/photo-1604644401890-0bd678c83788?w=700&q=90&auto=format&fit=crop",
    tag: "NEW IN",
    colors: ["#1C1C1C", "#8B4513", "#2E8B57"],
    description: "Bold floral print, open camp collar, relaxed fit",
  },
  {
    id: 9,
    name: "Abstract Pattern Shirt",
    category: "Men",
    subCategory: "Printed Shirts",
    price: "₹2,099",
    originalPrice: "₹3,499",
    discount: "40% OFF",
    rating: 4.7,
    reviews: 76,
    image:
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=700&q=90&auto=format&fit=crop",
    tag: "HOT",
    colors: ["#4A6FA5", "#E8D4B8", "#2C3E50"],
    description: "Contemporary abstract print, modern slim fit",
  },
  {
    id: 10,
    name: "Slim Fit Chino Pants",
    category: "Men",
    subCategory: "Pants",
    price: "₹2,499",
    originalPrice: "₹3,999",
    discount: "38% OFF",
    rating: 4.7,
    reviews: 289,
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=700&q=90&auto=format&fit=crop",
    tag: "BESTSELLER",
    colors: ["#D4B8A4", "#2C3E50", "#4A5568"],
    description: "Stretch cotton twill, slim tapered fit",
  },
  {
    id: 11,
    name: "Classic Denim Jeans",
    category: "Men",
    subCategory: "Pants",
    price: "₹2,999",
    originalPrice: "₹4,999",
    discount: "40% OFF",
    rating: 4.8,
    reviews: 512,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=700&q=90&auto=format&fit=crop",
    tag: "TRENDING",
    colors: ["#4A6FA5", "#2C3E50", "#1C1C2E"],
    description: "Premium denim, straight cut, timeless style",
  },
  {
    id: 12,
    name: "Formal Dress Trousers",
    category: "Men",
    subCategory: "Pants",
    price: "₹3,299",
    originalPrice: "₹4,999",
    discount: "34% OFF",
    rating: 4.6,
    reviews: 134,
    image:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=700&q=90&auto=format&fit=crop",
    tag: "NEW IN",
    colors: ["#1C1C1C", "#2C3E50", "#6B4E3A"],
    description: "Wool-blend formal trousers, tailored cut",
  },
  {
    id: 13,
    name: "Banarasi Silk Saree",
    category: "Women",
    subCategory: "Saree",
    price: "₹5,999",
    originalPrice: "₹9,999",
    discount: "40% OFF",
    rating: 4.9,
    reviews: 234,
    image: s5,
    tag: "TRENDING",
    colors: ["#D4AF37", "#8B0000", "#2C1810"],
    description: "Pure Banarasi silk with intricate zari border",
  },
  {
    id: 14,
    name: "Chiffon Designer Saree",
    category: "Women",
    subCategory: "Saree",
    price: "₹3,499",
    originalPrice: "₹5,999",
    discount: "42% OFF",
    rating: 4.7,
    reviews: 178,
    image: s2,
    tag: "NEW IN",
    colors: ["#E6D5B8", "#9B6B43", "#4A6FA5"],
    description: "Lightweight chiffon, floral embroidery, elegant drape",
  },
  {
    id: 15,
    name: "Cotton Handloom Saree",
    category: "Women",
    subCategory: "Saree",
    price: "₹2,499",
    originalPrice: "₹3,999",
    discount: "38% OFF",
    rating: 4.8,
    reviews: 312,
    image: s4,
    tag: "BESTSELLER",
    colors: ["#E8C97E", "#8B4513", "#2E8B57"],
    description: "Pure handloom cotton, traditional weave, daily wear",
  },
  {
    id: 16,
    name: "Kanjivaram Silk Saree",
    category: "Women",
    subCategory: "Saree",
    price: "₹7,999",
    originalPrice: "₹12,999",
    discount: "38% OFF",
    rating: 4.9,
    reviews: 156,
    image: s1,
    tag: "HOT",
    colors: ["#B76E6E", "#D4AF37", "#4A6FA5"],
    description: "Authentic Kanjivaram silk with golden zari work",
  },
  {
    id: 17,
    name: "Off-Shoulder Ruffle Top",
    category: "Women",
    subCategory: "Western Dress",
    price: "₹1,799",
    originalPrice: "₹2,999",
    discount: "40% OFF",
    rating: 4.6,
    reviews: 223,
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=700&q=90&auto=format&fit=crop",
    tag: "HOT",
    colors: ["#FFFFFF", "#E64B2E", "#1C1C1C"],
    description: "Trendy off-shoulder ruffle top, elasticated neckline",
  },
  {
    id: 18,
    name: "Crop Top & Palazzo Set",
    category: "Women",
    subCategory: "Western Dress",
    price: "₹2,199",
    originalPrice: "₹3,499",
    discount: "37% OFF",
    rating: 4.7,
    reviews: 189,
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=700&q=90&auto=format&fit=crop",
    tag: "TRENDING",
    colors: ["#E6D5B8", "#4A6FA5", "#2E8B57"],
    description: "Coordinated crop top + flowy palazzo set",
  },
  {
    id: 19,
    name: "Denim Jacket & Skirt Set",
    category: "Women",
    subCategory: "Western Dress",
    price: "₹3,499",
    originalPrice: "₹5,499",
    discount: "36% OFF",
    rating: 4.8,
    reviews: 145,
    image:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=700&q=90&auto=format&fit=crop",
    tag: "NEW IN",
    colors: ["#4A6FA5", "#2C3E50", "#1C1C2E"],
    description: "Classic denim jacket paired with mini skirt",
  },
  {
    id: 20,
    name: "Flowy Maxi Dress",
    category: "Women",
    subCategory: "Western Dress",
    price: "₹2,899",
    originalPrice: "₹4,499",
    discount: "36% OFF",
    rating: 4.8,
    reviews: 267,
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=700&q=90&auto=format&fit=crop",
    tag: "BESTSELLER",
    colors: ["#E6D5B8", "#D4AF37", "#8B4513"],
    description:
      "Elegant flowy maxi dress with floral print, perfect for summer",
  },
  {
    id: 21,
    name: "Silver Pendant Necklace",
    category: "Accessories",
    subCategory: "Jewelry",
    price: "₹2,999",
    originalPrice: "₹4,999",
    discount: "40% OFF",
    rating: 4.8,
    reviews: 289,
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=700&q=90&auto=format&fit=crop",
    tag: "BESTSELLER",
    colors: ["#C0C0C0", "#E8C97E"],
    description: "925 Sterling silver necklace with pendant",
  },
  {
    id: 22,
    name: "Gold Plated Earrings Set",
    category: "Accessories",
    subCategory: "Jewelry",
    price: "₹1,799",
    originalPrice: "₹2,999",
    discount: "40% OFF",
    rating: 4.7,
    reviews: 234,
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=700&q=90&auto=format&fit=crop",
    tag: "TRENDING",
    colors: ["#D4AF37", "#C0C0C0"],
    description: "Elegant gold plated earrings, lightweight design",
  },
  {
    id: 23,
    name: "Beaded Bracelet Set",
    category: "Accessories",
    subCategory: "Jewelry",
    price: "₹999",
    originalPrice: "₹1,799",
    discount: "44% OFF",
    rating: 4.6,
    reviews: 178,
    image:
      "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=700&q=90&auto=format&fit=crop",
    tag: "HOT",
    colors: ["#8B4513", "#4A6FA5", "#E8C97E"],
    description: "Handcrafted beaded bracelets, adjustable size",
  },
  {
    id: 24,
    name: "Minimalist Ring Set",
    category: "Accessories",
    subCategory: "Jewelry",
    price: "₹1,299",
    originalPrice: "₹2,299",
    discount: "43% OFF",
    rating: 4.9,
    reviews: 312,
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=700&q=90&auto=format&fit=crop",
    tag: "NEW IN",
    colors: ["#C0C0C0", "#D4AF37"],
    description: "Stackable rings set, adjustable fit",
  },
  {
    id: 25,
    name: "Leather Strappy Sandals",
    category: "Accessories",
    subCategory: "Sandals",
    price: "₹1,999",
    originalPrice: "₹3,499",
    discount: "43% OFF",
    rating: 4.6,
    reviews: 312,
    image:
      "https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?w=700&q=90&auto=format&fit=crop",
    tag: "HOT",
    colors: ["#D4A96A", "#8B5A2B", "#1C1C1C"],
    description: "Genuine leather straps, cushioned footbed",
  },
  {
    id: 26,
    name: "Flat Slip-On Sandals",
    category: "Accessories",
    subCategory: "Sandals",
    price: "₹1,299",
    originalPrice: "₹2,499",
    discount: "48% OFF",
    rating: 4.5,
    reviews: 267,
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=700&q=90&auto=format&fit=crop",
    tag: "NEW IN",
    colors: ["#D4A96A", "#8B5A2B", "#C2A87A"],
    description: "Comfortable flat sandals, slip-on style",
  },
  {
    id: 27,
    name: "Block Heel Sandals",
    category: "Accessories",
    subCategory: "Sandals",
    price: "₹2,499",
    originalPrice: "₹3,999",
    discount: "38% OFF",
    rating: 4.7,
    reviews: 198,
    image:
      "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=700&q=90&auto=format&fit=crop",
    tag: "TRENDING",
    colors: ["#1C1C1C", "#8B5A2B", "#FFFFFF"],
    description: "Stable block heel, ankle strap, all-day comfort",
  },
  {
    id: 28,
    name: "Gladiator Sandals",
    category: "Accessories",
    subCategory: "Sandals",
    price: "₹2,299",
    originalPrice: "₹3,799",
    discount: "39% OFF",
    rating: 4.6,
    reviews: 156,
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=700&q=90&auto=format&fit=crop",
    tag: "BESTSELLER",
    colors: ["#8B5A2B", "#1C1C1C", "#D4A96A"],
    description: "Trendy gladiator style, multiple straps, flat sole",
  },
  {
    id: 29,
    name: "Classic Leather Belt",
    category: "Accessories",
    subCategory: "Accessories",
    price: "₹1,299",
    originalPrice: "₹2,299",
    discount: "43% OFF",
    rating: 4.6,
    reviews: 234,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&q=90&auto=format&fit=crop",
    tag: "BESTSELLER",
    colors: ["#8B5A2B", "#2C1810", "#1C1C1C"],
    description: "Genuine leather belt with polished buckle",
  },
  {
    id: 30,
    name: "Minimalist Wristwatch",
    category: "Accessories",
    subCategory: "Accessories",
    price: "₹3,499",
    originalPrice: "₹5,999",
    discount: "42% OFF",
    rating: 4.9,
    reviews: 567,
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=700&q=90&auto=format&fit=crop",
    tag: "TRENDING",
    colors: ["#C0C0C0", "#D4AF37", "#1C1C1C"],
    description: "Elegant minimalist watch, stainless steel case",
  },
  {
    id: 31,
    name: "Aviator Sunglasses",
    category: "Accessories",
    subCategory: "Accessories",
    price: "₹2,299",
    originalPrice: "₹3,999",
    discount: "42% OFF",
    rating: 4.7,
    reviews: 342,
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=700&q=90&auto=format&fit=crop",
    tag: "BESTSELLER",
    colors: ["#000000", "#8B4513", "#2C3E50"],
    description: "Polarized UV protection, classic aviator style",
  },
  {
    id: 32,
    name: "Premium Leather Wallet",
    category: "Accessories",
    subCategory: "Accessories",
    price: "₹1,799",
    originalPrice: "₹2,999",
    discount: "40% OFF",
    rating: 4.8,
    reviews: 423,
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=700&q=90&auto=format&fit=crop",
    tag: "NEW IN",
    colors: ["#8B5A2B", "#2C1810", "#4A2512"],
    description: "Premium leather wallet with multiple card slots",
  },
  {
    id: 33,
    name: "Leather Backpack",
    category: "Accessories",
    subCategory: "Accessories",
    price: "₹4,999",
    originalPrice: "₹7,999",
    discount: "38% OFF",
    rating: 4.9,
    reviews: 345,
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=700&q=90&auto=format&fit=crop",
    tag: "BESTSELLER",
    colors: ["#8B5A2B", "#2C1810", "#1C1C1C"],
    description: "Handcrafted leather backpack, laptop compartment",
  },
];

// ─── NAV STRUCTURE ────────────────────────────────────────────────────────────
const navStructure = [
  { label: "All", type: "flat" },
  {
    label: "Men",
    type: "dropdown",
    subs: ["Shirts", "T-Shirts", "Printed Shirts", "Pants"],
  },
  { label: "Women", type: "dropdown", subs: ["Saree", "Western Dress"] },
  { label: "Accessories", type: "dropdown", subs: ["Jewelry", "Sandals"] },
];

const tagConfig = {
  "NEW IN": { bg: "#EFF6FF", color: "#1E40AF", border: "#BFDBFE" },
  TRENDING: { bg: "#FFF7ED", color: "#C2410C", border: "#FED7AA" },
  BESTSELLER: { bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0" },
  HOT: { bg: "#FFF1F2", color: "#BE123C", border: "#FECDD3" },
};

const ageTheme = {
  Men: {
    activeBg: "#1E3A8A",
    activeColor: "#fff",
    activeBorder: "#1E3A8A",
    idleBg: "#EFF6FF",
    idleColor: "#1E40AF",
    idleBorder: "#C7E0FF",
  },
  Women: {
    activeBg: "#9D174D",
    activeColor: "#fff",
    activeBorder: "#9D174D",
    idleBg: "#FEF2F5",
    idleColor: "#9D174D",
    idleBorder: "#FFE0E8",
  },
};

// ─── CSS (unchanged from your original) ──────────────────────────────────────
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700&family=Playfair+Display:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; }
  .shop-main { background:#ffffff; min-height:100vh; padding-top:80px; font-family:'Inter',sans-serif; }
  .shop-filters-bar { background:#e2d37d; border-bottom:1px solid #F0F0F0; position:sticky; top:0; z-index:500; box-shadow:0 1px 8px rgba(0,0,0,0.02); }
  .filter-inner { display:flex; justify-content:space-between; align-items:center; padding:16px 0; flex-wrap:wrap; gap:15px; }
  .category-filters { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
  .cat-flat-btn { font-family:'Inter',sans-serif; font-size:13px; font-weight:600; letter-spacing:0.3px; padding:8px 24px; border-radius:100px; border:1.5px solid #E8E8E8; background:#fff; color:#4B5563; cursor:pointer; transition:all 0.2s; white-space:nowrap; }
  .cat-flat-btn:hover { border-color:#B5975A; color:#B5975A; }
  .cat-flat-btn.active { background:#1F2937; color:#ffffff; border-color:#1F2937; }
  .dd-wrap { position:relative; }
  .dd-trigger { font-family:'Inter',sans-serif; font-size:13px; font-weight:600; letter-spacing:0.3px; padding:8px 20px; border-radius:100px; border:1.5px solid #E8E8E8; background:#fff; color:#4B5563; cursor:pointer; transition:all 0.2s; display:inline-flex; align-items:center; gap:8px; white-space:nowrap; }
  .dd-trigger:hover { border-color:#B5975A; color:#B5975A; }
  .dd-trigger.active { background:#1F2937; color:#fff; border-color:#1F2937; }
  .dd-chevron { transition:transform 0.22s; flex-shrink:0; font-size:10px; }
  .dd-trigger.open .dd-chevron { transform:rotate(180deg); }
  .dd-menu { position:absolute; top:calc(100% + 8px); left:0; background:#fff; border:1px solid #EEEEEE; border-radius:20px; box-shadow:0 20px 40px rgba(0,0,0,0.08); min-width:210px; z-index:600; overflow:hidden; animation:ddIn 0.17s ease; }
  @keyframes ddIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
  .dd-head { padding:14px 18px 10px; border-bottom:1px solid #F5F5F5; background:#c8dde2; }
  .dd-head-label { font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#B5975A; }
  .dd-list { padding:8px 0; }
  .dd-item { width:100%; background:none; border:none; text-align:left; padding:10px 18px; font-family:'Inter',sans-serif; font-size:13px; color:#0c0d0e; cursor:pointer; transition:background 0.13s; display:flex; align-items:center; gap:10px; font-weight:500; }
  .dd-dot { width:6px; height:6px; border-radius:50%; background:#D1D5DB; flex-shrink:0; transition:background 0.13s; }
  .dd-item:hover { background:#F9FAFB; }
  .dd-item:hover .dd-dot { background:#B5975A; }
  .dd-item.active { background:#FEF7E6; color:#1F2937; font-weight:600; }
  .dd-item.active .dd-dot { background:#B5975A; }
  .dd-sep { height:1px; background:#F2F2F2; margin:4px 0; }
  .filter-right { display:flex; align-items:center; gap:16px; }
  .result-count { font-size:13px; color:#9CA3AF; font-weight:500; white-space:nowrap; }
  .sort-select { font-family:'Inter',sans-serif; font-size:12px; font-weight:500; background:#fff; border:1.5px solid #E8E8E8; padding:8px 14px; border-radius:10px; color:#374151; cursor:pointer; outline:none; transition:border-color 0.2s; }
  .sort-select:focus { border-color:#B5975A; }
  .age-filter-bar { background:#f5e9d6; border-bottom:1px solid #e8d5b0; padding:10px 0; animation:ageFadeIn 0.22s ease; }
  @keyframes ageFadeIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
  .age-filter-inner { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
  .age-filter-label { font-size:11px; font-weight:700; letter-spacing:1.8px; text-transform:uppercase; color:#7C6344; margin-right:4px; white-space:nowrap; }
  .age-pill-btn { font-family:'Inter',sans-serif; font-size:12px; font-weight:600; padding:6px 18px; border-radius:100px; border:1.5px solid; cursor:pointer; transition:all 0.2s ease; white-space:nowrap; letter-spacing:0.2px; }
  .age-pill-btn:hover { transform:translateY(-1px); box-shadow:0 4px 10px rgba(0,0,0,0.1); }
  .sec-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:32px; padding-bottom:16px; border-bottom:2px solid #F3F4F6; }
  .sec-head-left { display:flex; align-items:center; gap:14px; flex-wrap:wrap; }
  .sec-head h2 { font-family:'Playfair Display',serif; font-size:28px; color:#111827; font-weight:700; margin:3px 3px; letter-spacing:-0.3px; }
  .sec-age-tag { font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; padding:4px 14px; border-radius:100px; border:1px solid; }
  .sec-age-tag.men    { background:#F0F5FF; color:#1E3A8A; border-color:#C7E0FF; }
  .sec-age-tag.women  { background:#FEF2F5; color:#9D174D; border-color:#FFE0E8; }
  .sec-count { font-size:13px; color:#9CA3AF; font-weight:500; }
  .pl-card { background:#ffffff; border:1px solid #ebe5e5; border-radius:20px; overflow:hidden; cursor:pointer; transition:all 0.35s ease; height:100%; display:flex; flex-direction:column; box-shadow:0 2px 8px rgba(0,0,0,0.02); padding:1px 20px 13px 13px; }
  .pl-card:hover { transform:translateY(-6px); box-shadow:0 24px 48px rgba(0,0,0,0.08); border-color:#E5E5E5; }
  .pl-img-wrap { position:relative; overflow:hidden; width:100%; height:280px; background:#F9F9F9; flex-shrink:0; padding:12px; }
  .pl-img { width:100%; height:100%; object-fit:cover; object-position:center top; transition:transform 0.55s cubic-bezier(0.2,0.9,0.4,1.1); display:block; }
  .pl-card:hover .pl-img { transform:scale(1.06); }
  .pl-tag { position:absolute; top:14px; left:14px; font-size:9px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase; padding:5px 12px; border-radius:100px; border:1px solid; z-index:2; font-family:'Inter',sans-serif; backdrop-filter:blur(2px); height:23px; }
  .pl-wish { position:absolute; top:14px; right:14px; width:36px; height:36px; background:rgba(255,255,255,0.98); border:1px solid #EFEFEF; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.25s ease; z-index:2; box-shadow:0 2px 10px rgba(0,0,0,0.04); }
  .pl-wish:hover { transform:scale(1.12); background:#fff; box-shadow:0 6px 16px rgba(0,0,0,0.1); }
  .heart-on  { color:#E11D48; }
  .heart-off { color:#9CA3AF; }
  .pl-body { padding:14px 16px 16px; flex:1; display:flex; flex-direction:column; background:#fff; transition:background 0.3s ease; }
  .pl-sub { font-size:10px; letter-spacing:2px; text-transform:uppercase; color:#B5975A; font-weight:700; margin-bottom:6px; }
  .pl-name { font-size:14px; line-height:1.3; height:38px; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; }
  .pl-colors { display:flex; gap:8px; align-items:center; margin-bottom:12px; }
  .pl-dot { width:14px; height:14px; border-radius:50%; border:1.5px solid rgba(0,0,0,0.08); cursor:pointer; transition:transform 0.17s,box-shadow 0.17s; flex-shrink:0; }
  .pl-dot:hover  { transform:scale(1.25); }
  .pl-dot.sel    { box-shadow:0 0 0 2.5px #B5975A; transform:scale(1.1); }
  .pl-rating { display:flex; align-items:center; gap:6px; margin-bottom:10px; }
  .pl-star { color:#F59E0B; font-size:11px; }
  .pl-rval { font-size:12px; font-weight:700; color:#374151; margin-left:3px; }
  .pl-rct  { font-size:11px; color:#9CA3AF; }
  .pl-hr { height:1px; background:#F0F0F0; margin:12px 0 12px; }
  .pl-prices { display:flex; align-items:baseline; gap:8px; margin-bottom:16px; flex-wrap:wrap; font-size:16px; }
  .pl-price { font-family:'Playfair Display',serif; font-size:20px; font-weight:700; color:#111827; }
  .pl-orig { font-size:12px; color:#D1D5DB; text-decoration:line-through; font-weight:500; }
  .pl-disc { font-size:10px; font-weight:800; color:#15803D; letter-spacing:0.3px; background:#F0FDF4; padding:3px 10px; border-radius:100px; border:1px solid #BBF7D0; }
  .pl-cart { width:100%; background:#37291f; border:none; color:#ffffff; font-family:'Inter',sans-serif; letter-spacing:1.5px; text-transform:uppercase; font-weight:700; cursor:pointer; border-radius:14px; transition:all 0.25s ease; margin-top:auto; display:flex; align-items:center; justify-content:center; gap:8px; padding:8px 0; font-size:10px; }
  .pl-cart:hover { background:#B5975A; transform:translateY(-2px); box-shadow:0 6px 14px rgba(181,151,90,0.25); }
  .pl-cart:active { transform:translateY(0); }
  .empty-box { text-align:center; padding:80px 20px; background:#FAFAFA; border-radius:28px; }
  .empty-box h3 { font-family:'Playfair Display',serif; font-size:26px; color:#4B5563; margin-bottom:12px; }
  .empty-box p { font-size:15px; color:#9CA3AF; }
  .load-more-area { text-align:center; padding:56px 0 32px; }
  .load-more-btn { display:inline-flex; align-items:center; gap:12px; padding:14px 44px; background:#ffffff; color:#1F2937; font-family:'Inter',sans-serif; font-size:12px; letter-spacing:1.5px; text-transform:uppercase; font-weight:700; border:2px solid #eef1f5; cursor:pointer; border-radius:100px; transition:all 0.24s; }
  .load-more-btn:hover { background:#1F2937; color:#ffffff; transform:translateY(-2px); box-shadow:0 12px 24px rgba(0,0,0,0.1); }
  .shop-nl { background:linear-gradient(135deg,#F9FAFB 0%,#F3F4F6 100%); padding:88px 0; margin-top:80px; position:relative; overflow:hidden; border-top:1px solid #E5E7EB; }
  .nl-blob { position:absolute; width:480px; height:480px; border-radius:50%; background:radial-gradient(circle,rgba(181,151,90,0.08) 0%,transparent 70%); top:-200px; right:-100px; pointer-events:none; }
  .nl-inner { position:relative; z-index:1; text-align:center; max-width:540px; margin:0 auto; }
  .nl-inner h3 { font-family:'Playfair Display',serif; font-size:36px; font-weight:700; color:#111827; margin-bottom:12px; line-height:1.2; }
  .nl-inner p { font-size:15px; color:#6B7280; margin-bottom:32px; line-height:1.65; }
  .nl-form { display:flex; gap:12px; max-width:460px; margin:0 auto; }
  .nl-form input { flex:1; background:#ffffff; border:1.5px solid #E5E7EB; padding:14px 20px; font-family:'Inter',sans-serif; font-size:14px; color:#1F2937; border-radius:14px; outline:none; transition:border-color 0.2s; }
  .nl-form input::placeholder { color:#9CA3AF; }
  .nl-form input:focus { border-color:#B5975A; }
  .nl-form button { background:#1F2937; border:none; padding:14px 28px; font-family:'Inter',sans-serif; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; font-weight:700; cursor:pointer; transition:all 0.24s; border-radius:14px; color:#ffffff; white-space:nowrap; }
  .nl-form button:hover { background:#B5975A; transform:translateY(-2px); }
  .toast-notification { position:fixed; bottom:30px; right:30px; background:#1F2937; color:white; padding:14px 24px; border-radius:12px; font-family:'Inter',sans-serif; font-size:14px; font-weight:500; z-index:1000; animation:slideInRight 0.3s ease; box-shadow:0 4px 12px rgba(0,0,0,0.15); display:flex; align-items:center; gap:12px; border-left:4px solid #B5975A; }
  @keyframes slideInRight { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
  @media (max-width:768px) {
    .filter-inner { flex-direction:column; align-items:stretch; gap:12px; }
    .category-filters { justify-content:center; flex-wrap:wrap; }
    .filter-right { justify-content:space-between; }
    .pl-img-wrap { height:240px; }
    .nl-form { flex-direction:column; gap:12px; }
    .sec-head h2 { font-size:24px; }
    .age-filter-inner { gap:8px; }
    .toast-notification { bottom:20px; right:20px; left:20px; padding:12px 20px; }
  }
`;

// ─── DROPDOWN BUTTON (unchanged) ──────────────────────────────────────────────
function DropdownBtn({ item, activeCategory, activeSubCategory, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const isActive =
    activeCategory === item.label ||
    (item.subs?.includes(activeSubCategory) && activeCategory === item.label);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="dd-wrap" ref={ref}>
      <button
        className={`dd-trigger ${isActive ? "active" : ""} ${open ? "open" : ""}`}
        onClick={() => setOpen((o) => !o)}
      >
        {item.label}
        <FaChevronDown className="dd-chevron" />
      </button>
      {open && (
        <div className="dd-menu">
          <div className="dd-head">
            <div className="dd-head-label">{item.label}</div>
          </div>
          <div className="dd-list">
            <div className="dd-sep" />
            {item.subs.map((sub) => (
              <button
                key={sub}
                className={`dd-item ${
                  activeSubCategory === sub && activeCategory === item.label
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  onSelect(item.label, sub);
                  setOpen(false);
                }}
              >
                <span className="dd-dot" />
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN SHOP PAGE ───────────────────────────────────────────────────────────
export default function ShopPage() {
  const [activeColor, setActiveColor] = useState({});
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [sortBy, setSortBy] = useState("featured");
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [activeAge, setActiveAge] = useState("all");
  const [toast, setToast] = useState({ show: false, message: "" });

  const {
    addToCart,
    addToWishlist: addToStoreWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useStore();

  // ── Pull seller products from context ────────────────────────────────────
  const { products: sellerProducts } = useProducts();

  // ── Merge: static products + seller-added products (no duplicates) ───────
  const allProducts = React.useMemo(() => {
    const staticIds = new Set(staticProducts.map((p) => p.id));
    const onlyNewSeller = sellerProducts.filter((p) => !staticIds.has(p.id));
    return [...staticProducts, ...onlyNewSeller];
  }, [sellerProducts]);

  const showToast = (productName) => {
    setToast({ show: true, message: `${productName} added to cart!` });
    setTimeout(() => setToast({ show: false, message: "" }), 2000);
  };

  const toggleWishlist = (p) =>
    isInWishlist(p.id) ? removeFromWishlist(p.id) : addToStoreWishlist(p);

  const handleSelect = (cat, sub) => {
    setActiveCategory(cat);
    setActiveSubCategory(sub);
    setActiveAge("all");
    setVisibleProducts(8);
  };

  const handleAgeSelect = (val) => {
    setActiveAge(val);
    setVisibleProducts(8);
  };

  const renderStars = (r) =>
    Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className="pl-star"
        style={{ opacity: i < Math.round(r) ? 1 : 0.2 }}
      />
    ));

  // ── Filter from merged list ───────────────────────────────────────────────
  let filtered = allProducts.filter((p) => {
    if (activeCategory === "All") return true;
    if (p.category !== activeCategory) return false;
    if (activeSubCategory && p.subCategory !== activeSubCategory) return false;
    return true;
  });

  const currentAgeLimits = ageLimits[activeCategory];
  if (currentAgeLimits && activeAge !== "all") {
    const chosen = currentAgeLimits.find((a) => a.value === activeAge);
    if (chosen) {
      filtered = filtered.filter((p) => {
        const pAge = productAgeMap[p.id];
        if (!pAge) return true; // seller products have no age restriction
        return pAge.min <= chosen.max && pAge.max >= chosen.min;
      });
    }
  }

  filtered = [...filtered].sort((a, b) => {
    const n = (s) => parseInt(String(s).replace(/[^0-9]/g, ""));
    if (sortBy === "price-low") return n(a.price) - n(b.price);
    if (sortBy === "price-high") return n(b.price) - n(a.price);
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  const displayed = filtered.slice(0, visibleProducts);

  const secTitle =
    activeSubCategory ||
    (activeCategory === "All" ? "All Products" : `All ${activeCategory}`);
  const ageClass =
    activeCategory === "Men"
      ? "men"
      : activeCategory === "Women"
        ? "women"
        : null;
  const theme = ageTheme[activeCategory];

  return (
    <div className="shop-main">
      <style>{globalStyles}</style>

      {/* ── Filter Bar ── */}
      <div className="shop-filters-bar">
        <Container>
          <div className="filter-inner">
            <div className="category-filters">
              <button
                className={`cat-flat-btn ${activeCategory === "All" ? "active" : ""}`}
                onClick={() => handleSelect("All", null)}
              >
                All
              </button>
              {navStructure
                .filter((n) => n.type === "dropdown")
                .map((item) => (
                  <DropdownBtn
                    key={item.label}
                    item={item}
                    activeCategory={activeCategory}
                    activeSubCategory={activeSubCategory}
                    onSelect={handleSelect}
                  />
                ))}
            </div>
            <div className="filter-right">
              <span className="result-count">{filtered.length} items</span>
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setVisibleProducts(8);
                }}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </Container>
      </div>

      {/* ── Age Filter Bar ── */}
      {currentAgeLimits && (
        <div className="age-filter-bar">
          <Container>
            <div className="age-filter-inner">
              <span className="age-filter-label">Age Group</span>
              {currentAgeLimits.map((age) => {
                const isActive = activeAge === age.value;
                return (
                  <button
                    key={age.value}
                    className="age-pill-btn"
                    style={{
                      background: isActive ? theme.activeBg : theme.idleBg,
                      color: isActive ? theme.activeColor : theme.idleColor,
                      borderColor: isActive
                        ? theme.activeBorder
                        : theme.idleBorder,
                    }}
                    onClick={() => handleAgeSelect(age.value)}
                  >
                    {age.label}
                  </button>
                );
              })}
            </div>
          </Container>
        </div>
      )}

      {/* ── Product Grid ── */}
      <Container className="py-5">
        <div className="sec-head">
          <div className="sec-head-left">
            <h2>{secTitle}</h2>
            {ageClass && activeAge !== "all" && (
              <span className={`sec-age-tag ${ageClass}`}>
                Ages{" "}
                {currentAgeLimits.find((a) => a.value === activeAge)?.label}
              </span>
            )}
          </div>
          <span className="sec-count">{filtered.length} products</span>
        </div>

        {displayed.length === 0 ? (
          <div className="empty-box">
            <h3>No products found</h3>
            <p>Try a different category or age group</p>
          </div>
        ) : (
          <Row className="g-4">
            {displayed.map((item) => {
              const tag = tagConfig[item.tag] || {
                bg: "#F3F4F6",
                color: "#4B5563",
                border: "#E5E7EB",
              };
              return (
                <Col key={item.id} xs={12} sm={6} lg={4} xl={3}>
                  <div className="pl-card">
                    <div className="pl-img-wrap">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="pl-img"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700&q=85&auto=format&fit=crop";
                        }}
                      />
                      <span
                        className="pl-tag"
                        style={{
                          background: tag.bg,
                          color: tag.color,
                          borderColor: tag.border,
                        }}
                      >
                        {item.tag}
                      </span>
                      <button
                        className="pl-wish"
                        onClick={() => toggleWishlist(item)}
                      >
                        {isInWishlist(item.id) ? (
                          <FaHeart className="heart-on" size={14} />
                        ) : (
                          <FaRegHeart className="heart-off" size={14} />
                        )}
                      </button>
                    </div>

                    <div className="pl-body">
                      <div className="pl-sub">{item.subCategory}</div>
                      <h3 className="pl-name">{item.name}</h3>

                      <div className="pl-colors">
                        {(item.colors || []).map((c, i) => (
                          <div
                            key={i}
                            className={`pl-dot ${activeColor[item.id] === i ? "sel" : ""}`}
                            style={{ backgroundColor: c }}
                            onClick={() =>
                              setActiveColor((prev) => ({
                                ...prev,
                                [item.id]: i,
                              }))
                            }
                          />
                        ))}
                      </div>

                      <div className="pl-rating">
                        {renderStars(item.rating)}
                        <span className="pl-rval">
                          {item.rating > 0 ? item.rating : "New"}
                        </span>
                        <span className="pl-rct">({item.reviews || 0})</span>
                      </div>

                      <div className="pl-hr" />

                      <div className="pl-prices">
                        <span className="pl-price">{item.price}</span>
                        <span className="pl-orig">{item.originalPrice}</span>
                        <span className="pl-disc">{item.discount}</span>
                      </div>

                      <button
                        className="pl-cart"
                        onClick={() => {
                          addToCart({
                            ...item,
                            price: parseInt(
                              String(item.price).replace(/[^0-9]/g, ""),
                            ),
                          });
                          showToast(item.name);
                        }}
                      >
                        <FaShoppingBag size={12} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        )}

        {visibleProducts < filtered.length && (
          <div className="load-more-area">
            <button
              className="load-more-btn"
              onClick={() => setVisibleProducts((p) => p + 4)}
            >
              Load More <FaArrowRight size={11} />
            </button>
          </div>
        )}
      </Container>

      {/* ── Newsletter ── */}
      <div className="shop-nl">
        <div className="nl-blob" />
        <Container>
          <div className="nl-inner">
            <h3>Join the Nivest Community</h3>
            <p>
              Get 15% off your first order and exclusive access to new arrivals
            </p>
            <form className="nl-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email address" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </Container>
      </div>

      {toast.show && (
        <div className="toast-notification">
          <FaCheckCircle size={18} />
          {toast.message}
        </div>
      )}
    </div>
  );
}
