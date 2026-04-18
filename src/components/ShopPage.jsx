// components/ShopPage.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
  FaArrowLeft,
  FaChevronDown,
  FaCheckCircle,
  FaTruck,
  FaExchangeAlt,
  FaShieldAlt,
  FaCalendarAlt,
  FaThumbsUp,
  FaMinus,
  FaPlus,
  FaBolt,
  FaClock,
} from "react-icons/fa";
import { useStore } from "../context/StoreContext";
import { useProducts } from "../context/ProductContext";

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
    colorNames: ["White", "Blue", "Green"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Classic Oxford weave, button-down collar, slim fit. A timeless staple crafted for the modern professional.",
    material: "100% Cotton Oxford Weave",
    care: "Machine wash cold.",
    brand: "Classic Edge",
    inStock: true,
    delivery: "Free delivery by Tomorrow",
    returns: "30 days easy returns",
    warranty: "3 months warranty",
    highlights: [
      "Oxford weave fabric",
      "Button-down collar",
      "Slim fit",
      "Easy care",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Ravi K.",
        rating: 5,
        date: "10 Feb 2024",
        title: "Perfect shirt!",
        comment: "Great quality and fit. Very comfortable for office wear.",
        helpful: 34,
        verified: true,
      },
      {
        id: 2,
        user: "Suresh M.",
        rating: 4,
        date: "5 Feb 2024",
        title: "Good buy",
        comment: "Nice fabric, holds shape well after washing.",
        helpful: 21,
        verified: true,
      },
    ],
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
    colorNames: ["Sand", "Sky", "Sage"],
    sizes: ["S", "M", "L", "XL"],
    description:
      "Breathable linen-cotton blend, perfect for summer. Relaxed fit keeps you cool all day long.",
    material: "55% Linen, 45% Cotton",
    care: "Machine wash cold, line dry.",
    brand: "Urban Heritage",
    inStock: true,
    delivery: "Free delivery by 2 days",
    returns: "30 days easy returns",
    warranty: "3 months warranty",
    highlights: [
      "Linen-cotton blend",
      "Relaxed fit",
      "Breathable fabric",
      "Summer ready",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Amit R.",
        rating: 5,
        date: "12 Feb 2024",
        title: "Love this shirt!",
        comment: "Perfect for summer. The linen fabric feels amazing.",
        helpful: 28,
        verified: true,
      },
      {
        id: 2,
        user: "Vijay S.",
        rating: 4,
        date: "8 Feb 2024",
        title: "Great summer shirt",
        comment: "Very breathable. Gets better after every wash.",
        helpful: 19,
        verified: true,
      },
    ],
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
    colorNames: ["White", "Off-White"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Crisp cotton poplin, spread collar, regular fit. The ultimate formal shirt for every occasion.",
    material: "100% Cotton Poplin",
    care: "Machine wash warm, iron medium.",
    brand: "Modern Fit",
    inStock: true,
    delivery: "Free delivery by Tomorrow",
    returns: "30 days easy returns",
    warranty: "3 months warranty",
    highlights: [
      "Cotton poplin fabric",
      "Spread collar",
      "Regular fit",
      "Wrinkle resistant",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Deepak N.",
        rating: 5,
        date: "14 Feb 2024",
        title: "Best formal shirt",
        comment: "Excellent quality. Looks very sharp in office.",
        helpful: 52,
        verified: true,
      },
      {
        id: 2,
        user: "Karan S.",
        rating: 5,
        date: "9 Feb 2024",
        title: "Highly recommend",
        comment: "Perfect fit and great fabric. Worth every rupee.",
        helpful: 38,
        verified: true,
      },
    ],
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
    colorNames: ["White", "Navy", "Forest"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Premium cotton pique, classic fit with ribbed collar. The polo that goes from casual to smart effortlessly.",
    material: "100% Combed Pique Cotton",
    care: "Machine wash warm.",
    brand: "Classic Edge",
    inStock: true,
    delivery: "Free delivery by Tomorrow",
    returns: "30 days easy returns",
    warranty: "3 months warranty",
    highlights: [
      "Pique cotton fabric",
      "Ribbed collar & cuffs",
      "Classic fit",
      "Colour fast",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Vikram R.",
        rating: 4,
        date: "11 Feb 2024",
        title: "Good polo",
        comment: "Nice fabric and fit. Pique texture feels premium.",
        helpful: 25,
        verified: true,
      },
      {
        id: 2,
        user: "Naveen P.",
        rating: 5,
        date: "6 Feb 2024",
        title: "Excellent!",
        comment: "Best polo at this price. Very comfortable.",
        helpful: 31,
        verified: true,
      },
    ],
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
    colorNames: ["Black", "Blue", "Red"],
    sizes: ["S", "M", "L", "XL"],
    description:
      "Soft 100% cotton, relaxed fit, bold graphic print. Express yourself with this statement tee.",
    material: "100% Cotton",
    care: "Machine wash cold inside out.",
    brand: "Street Style",
    inStock: true,
    delivery: "Free delivery by 2 days",
    returns: "30 days easy returns",
    warranty: "3 months warranty",
    highlights: [
      "100% cotton",
      "Relaxed fit",
      "Bold graphic",
      "Pre-shrunk fabric",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Arjun K.",
        rating: 4,
        date: "13 Feb 2024",
        title: "Cool tee!",
        comment: "Love the graphic. Fabric is soft and comfortable.",
        helpful: 29,
        verified: true,
      },
      {
        id: 2,
        user: "Rahul M.",
        rating: 5,
        date: "7 Feb 2024",
        title: "Great design",
        comment: "Graphic print is vibrant even after washing.",
        helpful: 22,
        verified: true,
      },
    ],
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
    colorNames: ["White", "Navy", "Brown"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "Ultra-soft cotton, slim v-neck, everyday essential. The tee you'll reach for every single day.",
    material: "100% Combed Cotton",
    care: "Machine wash cold.",
    brand: "Modern Fit",
    inStock: true,
    delivery: "Free delivery by Tomorrow",
    returns: "30 days easy returns",
    warranty: "3 months warranty",
    highlights: [
      "Ultra-soft cotton",
      "Slim v-neck",
      "Pre-shrunk",
      "Everyday wear",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Gaurav T.",
        rating: 5,
        date: "10 Feb 2024",
        title: "My go-to tee",
        comment: "So soft and comfortable. I bought 3 colours!",
        helpful: 67,
        verified: true,
      },
      {
        id: 2,
        user: "Siddharth V.",
        rating: 4,
        date: "4 Feb 2024",
        title: "Great value",
        comment: "Good quality for the price. Fits well.",
        helpful: 41,
        verified: true,
      },
    ],
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
    colorNames: ["Green", "Camel", "Blue"],
    sizes: ["S", "M", "L", "XL"],
    description:
      "Vibrant tropical print, camp collar, resort style. Make a statement wherever you go.",
    material: "100% Viscose",
    care: "Hand wash cold.",
    brand: "Urban Heritage",
    inStock: true,
    delivery: "Free delivery by 2 days",
    returns: "30 days easy returns",
    warranty: "3 months warranty",
    highlights: [
      "Vibrant print",
      "Camp collar",
      "Resort style",
      "Lightweight fabric",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Priya S.",
        rating: 5,
        date: "9 Feb 2024",
        title: "Love it!",
        comment: "Perfect for beach vacations. So many compliments!",
        helpful: 33,
        verified: true,
      },
      {
        id: 2,
        user: "Anjali P.",
        rating: 4,
        date: "3 Feb 2024",
        title: "Fun shirt",
        comment: "Bright colours look great. Fabric is lightweight.",
        helpful: 18,
        verified: true,
      },
    ],
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
    colorNames: ["Black", "Brown", "Green"],
    sizes: ["S", "M", "L", "XL"],
    description:
      "Bold floral print, open camp collar, relaxed fit. The statement piece your wardrobe needs.",
    material: "100% Rayon",
    care: "Hand wash cold.",
    brand: "Street Style",
    inStock: true,
    delivery: "Free delivery by 3 days",
    returns: "30 days easy returns",
    warranty: "3 months warranty",
    highlights: [
      "Bold floral print",
      "Camp collar",
      "Relaxed fit",
      "Soft rayon fabric",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Meera S.",
        rating: 5,
        date: "8 Feb 2024",
        title: "Stunning!",
        comment: "Looks amazing. The floral print is bold and beautiful.",
        helpful: 27,
        verified: true,
      },
      {
        id: 2,
        user: "Rajesh K.",
        rating: 4,
        date: "2 Feb 2024",
        title: "Great shirt",
        comment: "Very stylish. Got lots of compliments.",
        helpful: 16,
        verified: true,
      },
    ],
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
    colorNames: ["Blue", "Cream", "Navy"],
    sizes: ["S", "M", "L", "XL"],
    description:
      "Contemporary abstract print, modern slim fit. Art meets fashion in this unique piece.",
    material: "100% Viscose",
    care: "Hand wash cold.",
    brand: "Modern Fit",
    inStock: true,
    delivery: "Free delivery by 2 days",
    returns: "30 days easy returns",
    warranty: "3 months warranty",
    highlights: [
      "Abstract print",
      "Modern slim fit",
      "Soft viscose",
      "Unique design",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Vikram R.",
        rating: 5,
        date: "11 Feb 2024",
        title: "Very unique!",
        comment: "The abstract print is a real head-turner.",
        helpful: 22,
        verified: true,
      },
      {
        id: 2,
        user: "Deepak N.",
        rating: 4,
        date: "5 Feb 2024",
        title: "Stylish choice",
        comment: "Good quality fabric and interesting print.",
        helpful: 14,
        verified: true,
      },
    ],
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
    colorNames: ["Khaki", "Navy", "Grey"],
    sizes: ["28", "30", "32", "34", "36", "38"],
    description:
      "Stretch cotton twill, slim tapered fit. From boardroom to brunch without missing a beat.",
    material: "98% Cotton, 2% Elastane",
    care: "Machine wash cold.",
    brand: "Modern Fit",
    inStock: true,
    delivery: "Free delivery by Tomorrow",
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
        date: "13 Feb 2024",
        title: "Perfect fit!",
        comment:
          "Great quality. The stretch fabric makes it comfortable all day.",
        helpful: 45,
        verified: true,
      },
      {
        id: 2,
        user: "Karan S.",
        rating: 4,
        date: "7 Feb 2024",
        title: "Good chinos",
        comment: "Nice fit and colour. Slightly check sizing.",
        helpful: 28,
        verified: true,
      },
    ],
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
    colorNames: ["Light Blue", "Dark Blue", "Black"],
    sizes: ["28", "30", "32", "34", "36"],
    description:
      "Premium denim, straight cut, timeless style. The jeans you'll wear for years.",
    material: "99% Cotton, 1% Elastane",
    care: "Machine wash cold inside out.",
    brand: "Denim Co.",
    inStock: true,
    delivery: "Free delivery by 2 days",
    returns: "30 days easy returns",
    warranty: "6 months warranty",
    highlights: [
      "Premium denim",
      "Straight cut",
      "5-pocket style",
      "Timeless design",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Naveen P.",
        rating: 5,
        date: "12 Feb 2024",
        title: "Best jeans!",
        comment: "Premium quality. Very comfortable and looks great.",
        helpful: 78,
        verified: true,
      },
      {
        id: 2,
        user: "Arjun K.",
        rating: 5,
        date: "6 Feb 2024",
        title: "Love these jeans",
        comment: "Perfect fit and excellent denim quality.",
        helpful: 55,
        verified: true,
      },
    ],
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
    colorNames: ["Black", "Navy", "Brown"],
    sizes: ["28", "30", "32", "34", "36"],
    description:
      "Wool-blend formal trousers, tailored cut. Impeccable for boardroom and formal events.",
    material: "70% Wool, 30% Polyester",
    care: "Dry clean only.",
    brand: "Classic Edge",
    inStock: true,
    delivery: "Free delivery by 3 days",
    returns: "30 days easy returns",
    warranty: "3 months warranty",
    highlights: [
      "Wool-blend fabric",
      "Tailored cut",
      "Formal style",
      "Comfortable waistband",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Rahul M.",
        rating: 5,
        date: "10 Feb 2024",
        title: "Excellent trousers",
        comment: "Perfect for formal occasions. Great tailored look.",
        helpful: 36,
        verified: true,
      },
      {
        id: 2,
        user: "Gaurav T.",
        rating: 4,
        date: "4 Feb 2024",
        title: "Good quality",
        comment: "Wool blend fabric feels premium. Nice drape.",
        helpful: 24,
        verified: true,
      },
    ],
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
    colorNames: ["Gold", "Crimson", "Dark Brown"],
    sizes: ["Free Size"],
    description:
      "Pure Banarasi silk with intricate zari border. A timeless piece of Indian heritage.",
    material: "Pure Banarasi Silk with Zari",
    care: "Dry clean only.",
    brand: "Ethnic Essence",
    inStock: true,
    delivery: "Free delivery by 3 days",
    returns: "Exchange only",
    warranty: "1 year craftsmanship warranty",
    highlights: [
      "Pure Banarasi silk",
      "Intricate zari border",
      "Heritage weave",
      "Festive wear",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Anjali P.",
        rating: 5,
        date: "13 Feb 2024",
        title: "Gorgeous saree!",
        comment: "The zari work is stunning. Perfect for weddings.",
        helpful: 89,
        verified: true,
      },
      {
        id: 2,
        user: "Meera S.",
        rating: 5,
        date: "7 Feb 2024",
        title: "Worth every rupee",
        comment: "Quality is superb. Received so many compliments.",
        helpful: 62,
        verified: true,
      },
    ],
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
    colorNames: ["Ivory", "Tan", "Blue"],
    sizes: ["Free Size"],
    description:
      "Lightweight chiffon, floral embroidery, elegant drape. Perfect for parties and events.",
    material: "100% Chiffon with Embroidery",
    care: "Dry clean recommended.",
    brand: "Royal Heritage",
    inStock: true,
    delivery: "Free delivery by 2 days",
    returns: "30 days easy returns",
    warranty: "3 months warranty",
    highlights: [
      "Lightweight chiffon",
      "Floral embroidery",
      "Elegant drape",
      "Party wear",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Priya S.",
        rating: 5,
        date: "11 Feb 2024",
        title: "Beautiful saree!",
        comment: "The embroidery is so delicate. Looks stunning.",
        helpful: 44,
        verified: true,
      },
      {
        id: 2,
        user: "Rajesh K.",
        rating: 4,
        date: "5 Feb 2024",
        title: "Lovely drape",
        comment: "Chiffon fabric drapes beautifully. Very elegant.",
        helpful: 31,
        verified: true,
      },
    ],
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
    colorNames: ["Gold", "Brown", "Green"],
    sizes: ["Free Size"],
    description:
      "Pure handloom cotton, traditional weave, daily wear. Comfortable and beautiful for everyday use.",
    material: "100% Handloom Cotton",
    care: "Machine wash cold.",
    brand: "Ethnic Essence",
    inStock: true,
    delivery: "Free delivery by Tomorrow",
    returns: "30 days easy returns",
    warranty: "3 months warranty",
    highlights: [
      "Pure handloom cotton",
      "Traditional weave",
      "Daily wear",
      "Easy to drape",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Anjali P.",
        rating: 5,
        date: "14 Feb 2024",
        title: "Best everyday saree",
        comment: "Very comfortable for daily wear. Washes well too.",
        helpful: 56,
        verified: true,
      },
      {
        id: 2,
        user: "Meera S.",
        rating: 5,
        date: "8 Feb 2024",
        title: "Love the weave",
        comment: "Traditional handloom quality. Very authentic.",
        helpful: 43,
        verified: true,
      },
    ],
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
    colorNames: ["Rose", "Gold", "Blue"],
    sizes: ["Free Size"],
    description:
      "Authentic Kanjivaram silk with golden zari work. The crown jewel of South Indian silk sarees.",
    material: "Pure Kanjivaram Silk with Zari",
    care: "Dry clean only.",
    brand: "Royal Heritage",
    inStock: true,
    delivery: "Free delivery by 5 days",
    returns: "Exchange only",
    warranty: "1 year craftsmanship warranty",
    highlights: [
      "Pure Kanjivaram silk",
      "Golden zari work",
      "Heirloom quality",
      "Bridal wear",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Priya S.",
        rating: 5,
        date: "12 Feb 2024",
        title: "Absolutely regal!",
        comment: "The silk quality is exceptional. Perfect for my wedding.",
        helpful: 97,
        verified: true,
      },
      {
        id: 2,
        user: "Anjali P.",
        rating: 5,
        date: "6 Feb 2024",
        title: "Worth every rupee",
        comment: "Authentic Kanjivaram quality. Stunning colours.",
        helpful: 74,
        verified: true,
      },
    ],
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
    colorNames: ["White", "Red", "Black"],
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "Trendy off-shoulder ruffle top, elasticated neckline. The perfect party-ready top.",
    material: "100% Polyester Chiffon",
    care: "Hand wash cold.",
    brand: "Street Style",
    inStock: true,
    delivery: "Free delivery by 2 days",
    returns: "30 days easy returns",
    warranty: "3 months warranty",
    highlights: [
      "Off-shoulder design",
      "Ruffle detail",
      "Elasticated neck",
      "Party ready",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Meera S.",
        rating: 5,
        date: "13 Feb 2024",
        title: "So cute!",
        comment: "Love this top. Perfect for parties and outings.",
        helpful: 38,
        verified: true,
      },
      {
        id: 2,
        user: "Priya S.",
        rating: 4,
        date: "7 Feb 2024",
        title: "Trendy pick",
        comment: "Nice design. Fabric is good quality.",
        helpful: 24,
        verified: true,
      },
    ],
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
    colorNames: ["Cream", "Blue", "Green"],
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "Coordinated crop top + flowy palazzo set. The complete outfit that does all the work for you.",
    material: "95% Polyester, 5% Spandex",
    care: "Machine wash cold.",
    brand: "Urban Heritage",
    inStock: true,
    delivery: "Free delivery by Tomorrow",
    returns: "30 days easy returns",
    warranty: "3 months warranty",
    highlights: [
      "Matching set",
      "Flowy palazzo",
      "Crop top",
      "Coordinated look",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Anjali P.",
        rating: 5,
        date: "12 Feb 2024",
        title: "Perfect set!",
        comment: "Love how it's already coordinated. Looks great.",
        helpful: 42,
        verified: true,
      },
      {
        id: 2,
        user: "Meera S.",
        rating: 4,
        date: "6 Feb 2024",
        title: "Very stylish",
        comment: "Nice fabric and the palazzo flows beautifully.",
        helpful: 29,
        verified: true,
      },
    ],
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
    colorNames: ["Light Wash", "Dark Wash", "Black"],
    sizes: ["XS", "S", "M", "L"],
    description:
      "Classic denim jacket paired with mini skirt. The coordinated denim set for effortless cool.",
    material: "100% Cotton Denim",
    care: "Machine wash cold inside out.",
    brand: "Denim Co.",
    inStock: true,
    delivery: "Free delivery by 3 days",
    returns: "30 days easy returns",
    warranty: "6 months warranty",
    highlights: [
      "Matching denim set",
      "Classic jacket",
      "Mini skirt",
      "Coordinated look",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Priya S.",
        rating: 5,
        date: "11 Feb 2024",
        title: "Denim love!",
        comment: "Both pieces are great quality. Love the matching set.",
        helpful: 35,
        verified: true,
      },
      {
        id: 2,
        user: "Anjali P.",
        rating: 5,
        date: "5 Feb 2024",
        title: "So stylish",
        comment: "The denim quality is really good. Perfect fit.",
        helpful: 27,
        verified: true,
      },
    ],
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
    colorNames: ["Ivory", "Gold", "Brown"],
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "Elegant flowy maxi dress with floral print, perfect for summer. Grace in motion.",
    material: "100% Chiffon",
    care: "Hand wash cold.",
    brand: "Ethnic Essence",
    inStock: true,
    delivery: "Free delivery by Tomorrow",
    returns: "30 days easy returns",
    warranty: "3 months warranty",
    highlights: [
      "Flowy maxi length",
      "Floral print",
      "Summer perfect",
      "Elegant silhouette",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Meera S.",
        rating: 5,
        date: "14 Feb 2024",
        title: "Stunning dress!",
        comment: "So elegant and comfortable. Perfect for summer events.",
        helpful: 58,
        verified: true,
      },
      {
        id: 2,
        user: "Priya S.",
        rating: 5,
        date: "8 Feb 2024",
        title: "Beautiful!",
        comment: "The floral print is gorgeous. Flows beautifully.",
        helpful: 44,
        verified: true,
      },
    ],
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
    colorNames: ["Silver", "Gold"],
    sizes: ["Free Size"],
    description:
      "925 Sterling silver necklace with pendant. Elegant everyday jewellery that goes with everything.",
    material: "925 Sterling Silver",
    care: "Clean with silver cloth.",
    brand: "Classic Edge",
    inStock: true,
    delivery: "Free delivery by 2 days",
    returns: "30 days easy returns",
    warranty: "6 months warranty",
    highlights: [
      "925 Sterling silver",
      "Delicate pendant",
      "Everyday wear",
      "Gift ready",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Anjali P.",
        rating: 5,
        date: "13 Feb 2024",
        title: "Beautiful necklace!",
        comment: "Very delicate and elegant. Perfect gift.",
        helpful: 52,
        verified: true,
      },
      {
        id: 2,
        user: "Meera S.",
        rating: 5,
        date: "7 Feb 2024",
        title: "Love it!",
        comment: "Quality is great. Looks very premium.",
        helpful: 38,
        verified: true,
      },
    ],
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
    colorNames: ["Gold", "Silver"],
    sizes: ["Free Size"],
    description:
      "Elegant gold plated earrings, lightweight design. The perfect finishing touch to any outfit.",
    material: "Gold Plated Brass",
    care: "Avoid water and perfume.",
    brand: "Royal Heritage",
    inStock: true,
    delivery: "Free delivery by Tomorrow",
    returns: "30 days easy returns",
    warranty: "3 months warranty",
    highlights: [
      "Gold plated",
      "Lightweight design",
      "Set of 3 pairs",
      "Anti-tarnish coating",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Priya S.",
        rating: 5,
        date: "11 Feb 2024",
        title: "Gorgeous earrings!",
        comment: "The gold plating looks very real and premium.",
        helpful: 41,
        verified: true,
      },
      {
        id: 2,
        user: "Anjali P.",
        rating: 4,
        date: "5 Feb 2024",
        title: "Great set",
        comment: "3 pairs for this price is a great deal.",
        helpful: 28,
        verified: true,
      },
    ],
  },
  {
    id: 23,
    name: "Necklace Set",
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
    colorNames: ["Brown", "Blue", "Gold"],
    sizes: ["Free Size"],
    description:
      "Handcrafted beaded necklace set, adjustable size. Bohemian style meets everyday elegance.",
    material: "Semi-precious beads, alloy",
    care: "Avoid water and humidity.",
    brand: "Urban Heritage",
    inStock: true,
    delivery: "Free delivery by 2 days",
    returns: "30 days easy returns",
    warranty: "3 months warranty",
    highlights: ["Handcrafted", "Adjustable length", "Boho style", "Set of 2"],
    reviewsList: [
      {
        id: 1,
        user: "Meera S.",
        rating: 5,
        date: "10 Feb 2024",
        title: "Beautiful set!",
        comment: "The beads are so pretty. Handcrafted quality shows.",
        helpful: 29,
        verified: true,
      },
      {
        id: 2,
        user: "Priya S.",
        rating: 4,
        date: "4 Feb 2024",
        title: "Good value",
        comment: "Nice necklaces for everyday wear.",
        helpful: 18,
        verified: true,
      },
    ],
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
    colorNames: ["Silver", "Gold"],
    sizes: ["Free Size"],
    description:
      "Stackable rings set, adjustable fit. Minimalist beauty for the modern woman.",
    material: "Sterling Silver / Gold Plated",
    care: "Clean with soft cloth.",
    brand: "Classic Edge",
    inStock: true,
    delivery: "Free delivery by Tomorrow",
    returns: "30 days easy returns",
    warranty: "6 months warranty",
    highlights: [
      "Set of 5 rings",
      "Stackable design",
      "Adjustable fit",
      "Minimalist style",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Anjali P.",
        rating: 5,
        date: "12 Feb 2024",
        title: "Perfect rings!",
        comment: "Love the minimalist design. Stack them up!",
        helpful: 67,
        verified: true,
      },
      {
        id: 2,
        user: "Meera S.",
        rating: 5,
        date: "6 Feb 2024",
        title: "Beautiful set",
        comment: "Quality is excellent. Adjustable so fits perfectly.",
        helpful: 49,
        verified: true,
      },
    ],
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
    colorNames: ["Tan", "Brown", "Black"],
    sizes: ["36", "37", "38", "39", "40", "41"],
    description:
      "Genuine leather straps, cushioned footbed. Walk in comfort and style all day long.",
    material: "Genuine Leather Upper, Rubber Sole",
    care: "Wipe clean with damp cloth.",
    brand: "Urban Heritage",
    inStock: true,
    delivery: "Free delivery by 2 days",
    returns: "30 days easy returns",
    warranty: "6 months warranty",
    highlights: [
      "Genuine leather",
      "Cushioned footbed",
      "Adjustable straps",
      "All-day comfort",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Priya S.",
        rating: 5,
        date: "13 Feb 2024",
        title: "Amazing sandals!",
        comment: "So comfortable and stylish. Leather quality is great.",
        helpful: 44,
        verified: true,
      },
      {
        id: 2,
        user: "Meera S.",
        rating: 4,
        date: "7 Feb 2024",
        title: "Good buy",
        comment: "Nice sandals. The cushioned footbed is very comfortable.",
        helpful: 31,
        verified: true,
      },
    ],
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
    colorNames: ["Tan", "Brown", "Camel"],
    sizes: ["36", "37", "38", "39", "40", "41"],
    description:
      "Comfortable flat sandals, slip-on style. Your easy everyday go-to.",
    material: "Synthetic Upper, EVA Sole",
    care: "Wipe clean.",
    brand: "Modern Fit",
    inStock: true,
    delivery: "Free delivery by Tomorrow",
    returns: "30 days easy returns",
    warranty: "3 months warranty",
    highlights: [
      "Slip-on style",
      "Flat sole",
      "Lightweight",
      "Easy everyday wear",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Anjali P.",
        rating: 5,
        date: "11 Feb 2024",
        title: "Love these!",
        comment: "So easy to slip on. Very comfortable for daily use.",
        helpful: 33,
        verified: true,
      },
      {
        id: 2,
        user: "Priya S.",
        rating: 4,
        date: "5 Feb 2024",
        title: "Good value",
        comment: "Nice sandals for the price. Comfortable sole.",
        helpful: 22,
        verified: true,
      },
    ],
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
    colorNames: ["Black", "Brown", "White"],
    sizes: ["36", "37", "38", "39", "40"],
    description:
      "Stable block heel, ankle strap, all-day comfort. Elevated style without the discomfort.",
    material: "Faux Leather, Block Heel",
    care: "Wipe clean with damp cloth.",
    brand: "Classic Edge",
    inStock: true,
    delivery: "Free delivery by 2 days",
    returns: "30 days easy returns",
    warranty: "6 months warranty",
    highlights: [
      "Block heel",
      "Ankle strap",
      "Stable footing",
      "All-day comfort",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Meera S.",
        rating: 5,
        date: "12 Feb 2024",
        title: "Perfect heels!",
        comment: "Block heel is so stable. Can wear all day comfortably.",
        helpful: 47,
        verified: true,
      },
      {
        id: 2,
        user: "Anjali P.",
        rating: 4,
        date: "6 Feb 2024",
        title: "Great sandals",
        comment: "Nice design and very stable on the block heel.",
        helpful: 34,
        verified: true,
      },
    ],
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
    colorNames: ["Brown", "Black", "Tan"],
    sizes: ["36", "37", "38", "39", "40", "41"],
    description:
      "Trendy gladiator style, multiple straps, flat sole. Channel your inner warrior goddess.",
    material: "Genuine Leather Straps, Rubber Sole",
    care: "Wipe clean.",
    brand: "Street Style",
    inStock: true,
    delivery: "Free delivery by 3 days",
    returns: "30 days easy returns",
    warranty: "6 months warranty",
    highlights: [
      "Gladiator style",
      "Multiple straps",
      "Flat sole",
      "Genuine leather",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Priya S.",
        rating: 5,
        date: "10 Feb 2024",
        title: "Love these!",
        comment: "Gladiator style looks so cool. Leather quality is great.",
        helpful: 38,
        verified: true,
      },
      {
        id: 2,
        user: "Meera S.",
        rating: 4,
        date: "4 Feb 2024",
        title: "Stylish sandals",
        comment: "Great look. The straps are well made.",
        helpful: 25,
        verified: true,
      },
    ],
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
    colorNames: ["Brown", "Dark Brown", "Black"],
    sizes: ["28", "30", "32", "34", "36", "38"],
    description:
      "Genuine leather belt with polished buckle. The finishing touch that elevates every outfit.",
    material: "100% Genuine Leather",
    care: "Wipe clean, condition regularly.",
    brand: "Classic Edge",
    inStock: true,
    delivery: "Free delivery by Tomorrow",
    returns: "30 days easy returns",
    warranty: "1 year warranty",
    highlights: [
      "Genuine leather",
      "Polished buckle",
      "Adjustable",
      "Timeless design",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Ravi K.",
        rating: 5,
        date: "13 Feb 2024",
        title: "Quality belt!",
        comment: "Excellent leather quality. Buckle is very sturdy.",
        helpful: 41,
        verified: true,
      },
      {
        id: 2,
        user: "Suresh M.",
        rating: 4,
        date: "7 Feb 2024",
        title: "Good belt",
        comment: "Nice leather finish. Perfect for formal wear.",
        helpful: 28,
        verified: true,
      },
    ],
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
    colorNames: ["Silver", "Gold", "Black"],
    sizes: ["Free Size"],
    description:
      "Elegant minimalist watch, stainless steel case. Time, kept beautifully.",
    material: "Stainless Steel Case, Leather Strap",
    care: "Wipe clean with soft cloth.",
    brand: "Classic Edge",
    inStock: true,
    delivery: "Free delivery by 2 days",
    returns: "30 days easy returns",
    warranty: "1 year warranty",
    highlights: [
      "Minimalist design",
      "Stainless steel case",
      "Leather strap",
      "Water resistant",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Vikram R.",
        rating: 5,
        date: "14 Feb 2024",
        title: "Stunning watch!",
        comment: "Looks so elegant. The minimalist design is perfect.",
        helpful: 89,
        verified: true,
      },
      {
        id: 2,
        user: "Karan S.",
        rating: 5,
        date: "8 Feb 2024",
        title: "Great timepiece",
        comment: "Quality is excellent. Leather strap is very comfortable.",
        helpful: 67,
        verified: true,
      },
    ],
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
    colorNames: ["Black", "Brown", "Navy"],
    sizes: ["Free Size"],
    description:
      "Polarized UV protection, classic aviator style. See the world in style.",
    material: "Metal Frame, Polarized Lens",
    care: "Clean with microfiber cloth.",
    brand: "Street Style",
    inStock: true,
    delivery: "Free delivery by Tomorrow",
    returns: "30 days easy returns",
    warranty: "6 months warranty",
    highlights: [
      "100% UV protection",
      "Polarized lenses",
      "Classic aviator",
      "Lightweight frame",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Arjun K.",
        rating: 5,
        date: "12 Feb 2024",
        title: "Classic shades!",
        comment: "Perfect aviator style. Polarized lenses are great.",
        helpful: 55,
        verified: true,
      },
      {
        id: 2,
        user: "Naveen P.",
        rating: 5,
        date: "6 Feb 2024",
        title: "Love them!",
        comment: "Very stylish and good UV protection.",
        helpful: 42,
        verified: true,
      },
    ],
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
    colorNames: ["Tan", "Dark Brown", "Cognac"],
    sizes: ["Free Size"],
    description:
      "Premium leather wallet with multiple card slots. Slim, stylish and built to last.",
    material: "100% Genuine Leather",
    care: "Condition with leather oil.",
    brand: "Classic Edge",
    inStock: true,
    delivery: "Free delivery by 2 days",
    returns: "30 days easy returns",
    warranty: "1 year warranty",
    highlights: [
      "Genuine leather",
      "8 card slots",
      "Slim profile",
      "RFID protection",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Gaurav T.",
        rating: 5,
        date: "11 Feb 2024",
        title: "Best wallet!",
        comment: "Excellent leather quality. Slim and fits perfectly.",
        helpful: 72,
        verified: true,
      },
      {
        id: 2,
        user: "Siddharth V.",
        rating: 5,
        date: "5 Feb 2024",
        title: "Premium quality",
        comment: "RFID protection is a great feature. Very slim.",
        helpful: 54,
        verified: true,
      },
    ],
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
    colorNames: ["Tan", "Dark Brown", "Black"],
    sizes: ["Free Size"],
    description:
      "Handcrafted leather backpack, laptop compartment. Carry everything in timeless style.",
    material: "100% Full-Grain Leather",
    care: "Professional leather clean.",
    brand: "Urban Heritage",
    inStock: true,
    delivery: "Free delivery by 3 days",
    returns: "15 days returns",
    warranty: "1 year warranty",
    highlights: [
      "Full-grain leather",
      "Laptop compartment",
      "Multiple pockets",
      "Handcrafted",
    ],
    reviewsList: [
      {
        id: 1,
        user: "Vikram R.",
        rating: 5,
        date: "13 Feb 2024",
        title: "Dream backpack!",
        comment: "The leather quality is exceptional. Spacious and stylish.",
        helpful: 87,
        verified: true,
      },
      {
        id: 2,
        user: "Naveen P.",
        rating: 5,
        date: "7 Feb 2024",
        title: "Worth every rupee",
        comment: "Handcrafted quality shows. Gets better with age.",
        helpful: 63,
        verified: true,
      },
    ],
  },
];

// ─── Tag styles: Gold & Black theme ──────────────────────────────────────────
const tagStyles = {
  "NEW IN": { bg: "#B5975A", color: "#0F0F0F" },
  TRENDING: { bg: "#0F0F0F", color: "#B5975A" },
  BESTSELLER: { bg: "#B5975A", color: "#0F0F0F" },
  HOT: { bg: "#0F0F0F", color: "#D4AF6A" },
};

// kept for listing card tags (original soft colours)
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

/* ══════════════════════════════════════════════════════════════════════════════
   CSS - FIXED VERSION WITH PROPER CATEGORY NAVIGATION POSITIONING
══════════════════════════════════════════════════════════════════════════════ */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700&family=Jost:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; }

  /* ── Listing page ── */
  .shop-main { 
    background:#ffffff; 
    min-height:100vh; 
    padding-top:0; 
    font-family:'Inter',sans-serif; 
  }
  
  /* Category Filters Bar - Sticky below navbar */
  .shop-filters-bar { 
    background:#0F0F0F; 
    border-bottom:1px solid #222; 
    position:sticky; 
    top: 0;
    z-index:500; 
    box-shadow:0 1px 8px rgba(0,0,0,0.1); 
  }
  
  .filter-inner { 
    display:flex; 
    justify-content:space-between; 
    align-items:center; 
    padding:12px 0; 
    flex-wrap:wrap; 
    gap:15px; 
  }
  
  .category-filters { 
    display:flex; 
    align-items:center; 
    gap:8px; 
    flex-wrap:wrap; 
  }
  
  .cat-flat-btn { 
    font-family:'Inter',sans-serif; 
    font-size:13px; 
    font-weight:600; 
    letter-spacing:0.3px; 
    padding:8px 24px; 
    border-radius:100px; 
    border:1.5px solid #333; 
    background:#0F0F0F; 
    color:#999; 
    cursor:pointer; 
    transition:all 0.2s; 
    white-space:nowrap; 
  }
  
  .cat-flat-btn:hover { 
    border-color:#D4AF37; 
    color:#D4AF37; 
  }
  
  .cat-flat-btn.active { 
    background:#D4AF37; 
    color:#0F0F0F; 
    border-color:#D4AF37; 
  }
  
  .dd-wrap { position:relative; }
  .dd-trigger { 
    font-family:'Inter',sans-serif; 
    font-size:13px; 
    font-weight:600; 
    letter-spacing:0.3px; 
    padding:8px 20px; 
    border-radius:100px; 
    border:1.5px solid #333; 
    background:#0F0F0F; 
    color:#999; 
    cursor:pointer; 
    transition:all 0.2s; 
    display:inline-flex; 
    align-items:center; 
    gap:8px; 
    white-space:nowrap; 
  }
  .dd-trigger:hover { border-color:#D4AF37; color:#D4AF37; }
  .dd-trigger.active { background:#D4AF37; color:#0F0F0F; border-color:#D4AF37; }
  .dd-chevron { transition:transform 0.22s; flex-shrink:0; font-size:10px; }
  .dd-trigger.open .dd-chevron { transform:rotate(180deg); }
  .dd-menu { 
    position:absolute; 
    top:calc(100% + 8px); 
    left:0; 
    background:#fff; 
    border:1px solid #EEEEEE; 
    border-radius:20px; 
    box-shadow:0 20px 40px rgba(0,0,0,0.08); 
    min-width:210px; 
    z-index:600; 
    overflow:hidden; 
    animation:ddIn 0.17s ease; 
  }
  @keyframes ddIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
  .dd-head { padding:14px 18px 10px; border-bottom:1px solid #F5F5F5; background:#f9f9f9; }
  .dd-head-label { font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#D4AF37; }
  .dd-list { padding:8px 0; }
  .dd-item { 
    width:100%; 
    background:none; 
    border:none; 
    text-align:left; 
    padding:10px 18px; 
    font-family:'Inter',sans-serif; 
    font-size:13px; 
    color:#0c0d0e; 
    cursor:pointer; 
    transition:background 0.13s; 
    display:flex; 
    align-items:center; 
    gap:10px; 
    font-weight:500; 
  }
  .dd-dot { width:6px; height:6px; border-radius:50%; background:#D1D5DB; flex-shrink:0; transition:background 0.13s; }
  .dd-item:hover { background:#F9FAFB; }
  .dd-item:hover .dd-dot { background:#D4AF37; }
  .dd-item.active { background:#FEF7E6; color:#0F0F0F; font-weight:600; }
  .dd-item.active .dd-dot { background:#D4AF37; }
  .dd-sep { height:1px; background:#F2F2F2; margin:4px 0; }
  .filter-right { display:flex; align-items:center; gap:16px; }
  .result-count { font-size:13px; color:#9CA3AF; font-weight:500; white-space:nowrap; }
  .sort-select { 
    font-family:'Inter',sans-serif; 
    font-size:12px; 
    font-weight:500; 
    background:#0F0F0F; 
    border:1.5px solid #333; 
    padding:8px 14px; 
    border-radius:10px; 
    color:#999; 
    cursor:pointer; 
    outline:none; 
    transition:border-color 0.2s; 
  }
  .sort-select:focus { border-color:#D4AF37; color:#D4AF37; }
  .age-filter-bar { background:#f9f9f9; border-bottom:1px solid #eee; padding:10px 0; animation:ageFadeIn 0.22s ease; }
  @keyframes ageFadeIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
  .age-filter-inner { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
  .age-filter-label { font-size:11px; font-weight:700; letter-spacing:1.8px; text-transform:uppercase; color:#333; margin-right:4px; white-space:nowrap; }
  .age-pill-btn { 
    font-family:'Inter',sans-serif; 
    font-size:12px; 
    font-weight:600; 
    padding:6px 18px; 
    border-radius:100px; 
    border:1.5px solid; 
    cursor:pointer; 
    transition:all 0.2s ease; 
    white-space:nowrap; 
    letter-spacing:0.2px; 
  }
  .age-pill-btn:hover { transform:translateY(-1px); box-shadow:0 4px 10px rgba(0,0,0,0.1); }
  .sec-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:32px; padding-bottom:16px; border-bottom:2px solid #F3F4F6; }
  .sec-head-left { display:flex; align-items:center; gap:14px; flex-wrap:wrap; }
  .sec-head h2 { font-family:'Playfair Display',serif; font-size:28px; color:#111827; font-weight:700; margin:3px 3px; letter-spacing:-0.3px; }
  .sec-age-tag { font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; padding:4px 14px; border-radius:100px; border:1px solid; }
  .sec-age-tag.men    { background:#F0F5FF; color:#1E3A8A; border-color:#C7E0FF; }
  .sec-age-tag.women  { background:#FEF2F5; color:#9D174D; border-color:#FFE0E8; }
  .sec-count { font-size:13px; color:#9CA3AF; font-weight:500; }
  .pl-card { background:#ffffff; border:1px solid #f0f0f0; border-radius:16px; overflow:hidden; cursor:pointer; transition:all 0.3s ease; height:100%; display:flex; flex-direction:column; box-shadow:0 2px 8px rgba(0,0,0,0.02); padding:0; }
  .pl-card:hover { transform:translateY(-8px); box-shadow:0 20px 40px rgba(0,0,0,0.08); border-color:#D4AF37; }
  .pl-img-wrap { position:relative; overflow:hidden; width:100%; height:240px; background:#F9F9F9; flex-shrink:0; }
  .pl-img { width:100%; height:100%; object-fit:cover; object-position:center top; transition:transform 0.5s ease; display:block; }
  .pl-card:hover .pl-img { transform:scale(1.08); }
  .pl-tag { position:absolute; top:12px; left:12px; font-size:9px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase; padding:5px 12px; border-radius:4px; background:#D4AF37; color:#0F0F0F; z-index:2; font-family:'Inter',sans-serif; height:auto; line-height:1; }
  .pl-wish { position:absolute; top:12px; right:12px; width:34px; height:34px; background:white; border:none; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.2s ease; z-index:2; box-shadow:0 4px 10px rgba(0,0,0,0.1); }
  .pl-wish:hover { transform:scale(1.1); background:#0F0F0F; color:white; }
  .heart-on  { color:#E11D48; }
  .heart-off { color:#9CA3AF; }
  .pl-body { padding:10px; flex:1; display:flex; flex-direction:column; align-items:flex-start; text-align:left; background:#fff; }
  .pl-sub { font-size:9px; letter-spacing:1.5px; text-transform:uppercase; color:#D4AF37; font-weight:700; margin-bottom:4px; text-align:left; }
  .pl-name { font-size:14px; line-height:1.3; height:36px; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; margin-bottom:6px; color:#0F0F0F; font-weight:600; width:100%; text-align:left; }
  .pl-colors { display:flex; gap:6px; align-items:center; margin-bottom:8px; justify-content:flex-start; width:100%; }
  .pl-dot { width:12px; height:12px; border-radius:50%; border:1px solid rgba(0,0,0,0.1); cursor:pointer; transition:all 0.2s; flex-shrink:0; }
  .pl-dot:hover  { transform:scale(1.2); }
  .pl-dot.sel    { box-shadow:0 0 0 2px #D4AF37; transform:scale(1.1); }
  .pl-rating { display:flex; align-items:center; gap:5px; margin-bottom:8px; justify-content:flex-start; width:100%; }
  .pl-star { color:#FFB800; font-size:11px; }
  .pl-rval { font-size:12px; font-weight:700; color:#0F0F0F; margin-left:2px; }
  .pl-rct  { font-size:11px; color:#999; }
  .pl-hr { height:1px; background:#f0f0f0; margin:10px 0 14px; width:100%; }
  .pl-prices { display:flex; align-items:baseline; gap:8px; margin-bottom:12px; justify-content:flex-start; width:100%; }
  .pl-price { font-family:'Playfair Display',serif; font-size:20px; font-weight:700; color:#0F0F0F; }
  .pl-orig { font-size:13px; color:#999; text-decoration:line-through; font-weight:500; }
  .pl-disc { font-size:10px; font-weight:800; color:#0F0F0F; background:#D4AF37; padding:2px 8px; border-radius:4px; }
  .pl-cart { width:100%; background:#0F0F0F; border:1px solid #0F0F0F; color:#D4AF37; font-family:'Inter',sans-serif; letter-spacing:1px; text-transform:uppercase; font-weight:700; cursor:pointer; border-radius:6px; transition:all 0.3s ease; margin-top:auto; display:flex; align-items:center; justify-content:center; gap:8px; padding:8px 0; font-size:10px; }
  .pl-cart:hover { background:#D4AF37; color:#0F0F0F; border-color:#D4AF37; transform:translateY(-2px); box-shadow:0 8px 16px rgba(212,175,55,0.2); }
  .empty-box { text-align:center; padding:80px 20px; background:#FAFAFA; border-radius:28px; }
  .empty-box h3 { font-family:'Playfair Display',serif; font-size:26px; color:#4B5563; margin-bottom:12px; }
  .empty-box p { font-size:15px; color:#9CA3AF; }
  .load-more-area { text-align:center; padding:56px 0 32px; }
  .load-more-btn { display:inline-flex; align-items:center; gap:12px; padding:12px 36px; background:#0F0F0F; color:#D4AF37; font-family:'Inter',sans-serif; font-size:11px; letter-spacing:1px; text-transform:uppercase; font-weight:700; border:1.5px solid #0F0F0F; cursor:pointer; border-radius:100px; transition:all 0.3s; }
  .load-more-btn:hover { background:#D4AF37; color:#0F0F0F; border-color:#D4AF37; transform:translateY(-2px); }
  .shop-nl { background:#0F0F0F; padding:80px 0; margin-top:80px; position:relative; overflow:hidden; border-top:1px solid #222; }
  .nl-blob { position:absolute; width:480px; height:480px; border-radius:50%; background:radial-gradient(circle,rgba(212,175,55,0.05) 0%,transparent 70%); top:-200px; right:-100px; pointer-events:none; }
  .nl-inner { position:relative; z-index:1; text-align:center; max-width:540px; margin:0 auto; }
  .nl-inner h3 { font-family:'Playfair Display',serif; font-size:32px; font-weight:700; color:#D4AF37; margin-bottom:12px; line-height:1.2; }
  .nl-inner p { font-size:14px; color:#999; margin-bottom:32px; line-height:1.6; }
  .nl-form { display:flex; gap:12px; max-width:440px; margin:0 auto; }
  .nl-form input { flex:1; background:#1a1a1a; border:1px solid #333; padding:12px 20px; font-family:'Inter',sans-serif; font-size:14px; color:#fff; border-radius:8px; outline:none; transition:border-color 0.2s; }
  .nl-form input::placeholder { color:#666; }
  .nl-form input:focus { border-color:#D4AF37; }
  .nl-form button { background:#D4AF37; border:none; padding:12px 24px; font-family:'Inter',sans-serif; font-size:11px; letter-spacing:1px; text-transform:uppercase; font-weight:700; cursor:pointer; transition:all 0.3s; border-radius:8px; color:#0F0F0F; white-space:nowrap; }
  .nl-form button:hover { background:#fff; transform:translateY(-2px); }
  .toast-notification { position:fixed; bottom:30px; right:30px; background:#0F0F0F; color:white; padding:14px 24px; border-radius:8px; font-family:'Inter',sans-serif; font-size:14px; font-weight:500; z-index:9998; animation:slideInRight 0.3s ease; box-shadow:0 8px 24px rgba(0,0,0,0.2); display:flex; align-items:center; gap:12px; border-left:4px solid #D4AF37; }
  @keyframes slideInRight { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
  
  /* Responsive adjustments */
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

  /* ══════════════════ DETAIL OVERLAY ══════════════════ */
  :root {
    --gold:#B5975A; --dark:#0F0F0F; --mid:#6B6B6B;
    --light:#F8F5F0; --border:#E8E4DC; --success:#27AE60;
    --danger:#E74C3C;
  }
  .pdp-overlay { position:fixed; inset:0; background:#fff; z-index:3000; overflow-y:auto; overflow-x:hidden; font-family:'Jost',sans-serif; }
  .pdp-overlay.entering { animation:pdpIn .4s cubic-bezier(.22,1,.36,1) forwards }
  .pdp-overlay.exiting  { animation:pdpOut .3s cubic-bezier(.55,0,1,.45) forwards }
  @keyframes pdpIn  { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
  @keyframes pdpOut { from{transform:translateX(0);opacity:1} to{transform:translateX(100%);opacity:0} }

  .pdp-nav { position:sticky; top:0; z-index:50; background:rgba(255,255,255,.97); backdrop-filter:blur(12px); border-bottom:1px solid var(--border); padding:11px 28px; display:flex; justify-content:space-between; align-items:center; }
  @media(max-width:576px){.pdp-nav{padding:10px 14px}}
  .pdp-back-btn { display:flex; align-items:center; gap:8px; background:none; border:1px solid var(--border); font-family:'Jost',sans-serif; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:var(--dark); padding:7px 15px; border-radius:6px; cursor:pointer; transition:all .22s; }
  .pdp-back-btn:hover { background:var(--dark); color:#fff; border-color:var(--dark); }
  .pdp-nav-title { font-family:'Playfair Display',serif; font-size:14px; font-weight:600; color:var(--dark); max-width:320px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .pdp-nav-wish { display:flex; align-items:center; gap:7px; border:1px solid var(--border); background:none; padding:7px 14px; border-radius:6px; font-family:'Jost',sans-serif; font-size:11px; cursor:pointer; transition:all .22s; color:var(--dark); }
  .pdp-nav-wish:hover { border-color:var(--danger); }
  .pdp-nav-wish.wished { border-color:var(--danger); background:#fdfbfb; color:var(--danger); }

  .pdp-crumb { font-size:11px; color:var(--mid); display:flex; align-items:center; gap:5px; padding:12px 28px 0; }
  @media(max-width:576px){.pdp-crumb{padding:10px 14px 0}}
  .pdp-crumb-link { color:var(--dark); font-weight:500; cursor:pointer; }
  .pdp-crumb-sep { color:#ccc; }

  .pdp-hero { display:grid; grid-template-columns:1fr 1fr; gap:0 44px; max-width:1200px; margin:0 auto; padding:18px 28px 0; align-items:start; }
  @media(max-width:860px){.pdp-hero{grid-template-columns:1fr;gap:20px;padding:14px 14px 0}}
  .pdp-gcol { position:sticky; top:56px; display:flex; gap:10px; align-self:start; }
  @media(max-width:860px){.pdp-gcol{position:static}}
  .pdp-thumbs { display:flex; flex-direction:column; gap:8px; width:66px; flex-shrink:0; }
  .pdp-thumb { width:66px; height:80px; border-radius:7px; overflow:hidden; cursor:pointer; border:2px solid transparent; flex-shrink:0; background:var(--light); transition:border-color .18s,transform .18s; }
  .pdp-thumb.active { border-color:var(--gold); }
  .pdp-thumb:hover:not(.active) { border-color:#ccc; transform:scale(1.04); }
  .pdp-thumb img { width:100%; height:100%; object-fit:cover; display:block; }
  .pdp-mwrap-col { flex:1; position:relative; }
  .pdp-mwrap { width:100%; aspect-ratio:3/4; border-radius:12px; overflow:hidden; background:var(--light); position:relative; cursor:crosshair; box-shadow:0 4px 18px rgba(0,0,0,.08); }
  .pdp-mimg { width:100%; height:100%; object-fit:cover; object-position:center top; display:block; pointer-events:none; }
  .pdp-tbadge { position:absolute; top:12px; left:12px; font-size:9px; font-weight:700; letter-spacing:2px; padding:4px 10px; border-radius:5px; z-index:2; font-family:'Jost',sans-serif; pointer-events:none; text-transform:uppercase; }
  .zoom-lens { position:absolute; top:0; left:0; width:118px; height:118px; border:2px solid var(--gold); background:rgba(181,151,90,.07); border-radius:4px; pointer-events:none; z-index:15; opacity:0; visibility:hidden; transition:opacity .12s; will-change:transform; }
  .zoom-lens.active { opacity:1; visibility:visible; }
  .zoom-preview { position:absolute; top:0; left:calc(100% + 10px); width:270px; height:100%; overflow:hidden; border-radius:10px; box-shadow:0 10px 26px rgba(0,0,0,.18); z-index:20; pointer-events:none; border:1px solid var(--border); background-repeat:no-repeat; opacity:0; visibility:hidden; transition:opacity .14s; }
  .zoom-preview.active { opacity:1; visibility:visible; }
  @media(max-width:1160px){.zoom-preview{display:none!important}}

  .pdp-icol { padding-top:0; }
  .pdp-brand  { font-size:10px; letter-spacing:3.5px; text-transform:uppercase; color:var(--mid); font-weight:500; margin-bottom:4px; text-align:left; }
  .pdp-pname  { font-family:'Playfair Display',serif; font-size:clamp(20px,2vw,26px); font-weight:700; color:var(--dark); line-height:1.2; margin-bottom:8px; text-align:left; }
  .pdp-rrow   { display:flex; align-items:center; gap:7px; flex-wrap:wrap; margin-bottom:10px; justify-content:flex-start; }
  .pdp-rstars { display:flex; gap:2px; }
  .pdp-rnum   { font-size:13px; font-weight:600; color:var(--dark); }
  .pdp-rcnt   { font-size:12px; color:var(--mid); }
  .pdp-rsep   { color:#ddd; }
  .pdp-hr     { border:none; border-top:1px solid var(--border); margin:10px 0; }
  .pdp-prices { display:flex; align-items:baseline; gap:10px; flex-wrap:wrap; margin-bottom:2px; justify-content:flex-start; }
  .pdp-price  { font-family:'Playfair Display',serif; font-size:26px; font-weight:700; color:var(--dark); }
  .pdp-oprice { font-size:15px; color:#bbb; text-decoration:line-through; }
  .pdp-dbadge { font-size:11px; font-weight:700; letter-spacing:.8px; color:#0F0F0F; background:var(--gold); padding:3px 8px; border-radius:4px; }
  .pdp-save   { font-size:11px; color:var(--success); margin-bottom:8px; text-align:left; }
  .pdp-stock  { display:inline-flex; align-items:center; gap:6px; font-size:12px; font-weight:500; margin-bottom:10px; color:var(--success); }
  .pdp-sdot   { width:7px; height:7px; border-radius:50%; background:var(--success); }
  .pdp-desc   { font-size:12.5px; color:#555; line-height:1.75; margin-bottom:12px; text-align:left; }
  .pdp-lbl    { font-size:9px; letter-spacing:2.5px; text-transform:uppercase; color:var(--mid); font-weight:600; margin-bottom:8px; text-align:left; }
  .pdp-clist  { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:14px; justify-content:flex-start; }
  .pdp-copt   { display:flex; flex-direction:column; align-items:center; gap:4px; border:none; background:none; cursor:pointer; padding:0; }
  .pdp-csw    { width:26px; height:26px; border-radius:50%; border:2px solid transparent; outline:2px solid transparent; transition:all .18s; box-shadow:0 1px 4px rgba(0,0,0,.14); }
  .pdp-copt.active .pdp-csw { outline:2px solid var(--gold); outline-offset:2px; }
  .pdp-cname  { font-size:8px; color:var(--mid); }
  .pdp-slist  { display:flex; gap:7px; flex-wrap:wrap; margin-bottom:14px; justify-content:flex-start; }
  .pdp-sbtn   { min-width:50px; padding:7px 11px; border:1.5px solid var(--border); border-radius:7px; background:transparent; font-family:'Jost',sans-serif; font-size:12px; font-weight:500; color:var(--dark); cursor:pointer; transition:all .18s; text-align:center; }
  .pdp-sbtn:hover { border-color:var(--gold); }
  .pdp-sbtn.active { background:var(--dark); color:#fff; border-color:var(--dark); }
  .pdp-qrow   { display:flex; align-items:center; gap:12px; margin-bottom:14px; justify-content:flex-start; }
  .pdp-qty    { display:flex; align-items:center; border:1.5px solid var(--border); border-radius:8px; overflow:hidden; }
  .pdp-qbtn   { width:36px; height:38px; border:none; background:#f9f9f9; cursor:pointer; display:flex; align-items:center; justify-content:center; color:var(--dark); transition:background .18s; }
  .pdp-qbtn:hover { background:var(--gold); color:#fff; }
  .pdp-qnum   { width:42px; text-align:center; font-size:14px; font-weight:600; color:var(--dark); }
  .pdp-brow   { display:flex; gap:10px; margin-bottom:14px; }
  .pdp-bcart  { flex:1; padding:13px 16px; background:var(--dark); color:#fff; border:none; border-radius:8px; font-family:'Jost',sans-serif; font-size:11px; letter-spacing:2px; text-transform:uppercase; cursor:pointer; transition:background .25s,transform .15s; display:flex; align-items:center; justify-content:center; gap:8px; }
  .pdp-bcart:hover { background:#333; transform:translateY(-1px); }
  .pdp-bcart.added { background:var(--gold); color:#0F0F0F; }
  .pdp-bbuy   { flex:1; padding:13px 16px; background:var(--gold); color:#0F0F0F; border:none; border-radius:8px; font-family:'Jost',sans-serif; font-size:11px; letter-spacing:2px; text-transform:uppercase; cursor:pointer; transition:background .25s,transform .15s; display:flex; align-items:center; justify-content:center; gap:8px; font-weight:700; }
  .pdp-bbuy:hover { background:#c9a96a; transform:translateY(-1px); }
  .pdp-trust  { display:flex; gap:10px; flex-wrap:wrap; padding:10px 0; border-top:1px solid var(--border); border-bottom:1px solid var(--border); }
  .pdp-titem  { display:flex; align-items:center; gap:6px; font-size:10px; color:var(--mid); }
  .pdp-ticon  { color:var(--gold); }

  .pdp-below  { max-width:1200px; margin:0 auto; padding:44px 28px 80px; }
  @media(max-width:576px){.pdp-below{padding:32px 14px 60px}}
  .pdp-sey    { font-size:10px; letter-spacing:5px; text-transform:uppercase; color:var(--gold); font-weight:600; margin-bottom:5px; text-align:left; }
  .pdp-sh     { font-family:'Playfair Display',serif; font-size:clamp(20px,2.6vw,28px); font-weight:700; color:var(--dark); margin-bottom:22px; text-align:left; }
  .pdp-sh em  { font-style:italic; color:var(--gold); }
  .pdp-sdiv   { border:none; border-top:1px solid var(--border); margin:42px 0 34px; }
  .pdp-rsum   { display:flex; align-items:center; gap:28px; flex-wrap:wrap; margin-bottom:22px; }
  .pdp-bigr   { text-align:left; min-width:72px; }
  .pdp-bnum   { font-family:'Playfair Display',serif; font-size:46px; font-weight:700; color:var(--dark); line-height:1; }
  .pdp-bstars { display:flex; justify-content:flex-start; gap:3px; margin:5px 0; }
  .pdp-bcnt   { font-size:11px; color:var(--mid); }
  .pdp-bars   { flex:1; }
  .pdp-br     { display:flex; align-items:center; gap:10px; margin-bottom:6px; }
  .pdp-blbl   { font-size:11px; color:var(--mid); min-width:28px; text-align:right; }
  .pdp-btrk   { flex:1; height:5px; background:var(--border); border-radius:3px; overflow:hidden; }
  .pdp-bfil   { height:100%; background:var(--gold); border-radius:3px; }
  .pdp-bcn    { font-size:11px; color:var(--mid); min-width:20px; }
  .pdp-rdiv   { border:none; border-top:1px solid var(--border); margin:0 0 14px; }
  .pdp-rcard  { padding:18px 0; border-bottom:1px solid var(--border); }
  .pdp-rcard:last-child { border-bottom:none; }
  .pdp-rhead  { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:7px; }
  .pdp-rname  { font-weight:600; font-size:13px; color:var(--dark); margin-bottom:3px; text-align:left; }
  .pdp-rmeta  { display:flex; align-items:center; gap:8px; }
  .pdp-rstars2{ display:flex; gap:2px; }
  .pdp-verified { font-size:9px; letter-spacing:1px; color:var(--success); font-weight:600; }
  .pdp-rdate  { font-size:11px; color:#bbb; display:flex; align-items:center; gap:4px; }
  .pdp-rtitle { font-weight:600; font-size:13px; color:var(--dark); margin-bottom:4px; text-align:left; }
  .pdp-rbody  { font-size:12.5px; color:#555; line-height:1.7; text-align:left; }
  .pdp-helpful{ margin-top:9px; background:none; border:none; color:var(--gold); cursor:pointer; font-size:11px; display:flex; align-items:center; gap:5px; font-family:'Jost',sans-serif; padding:0; transition:transform .18s; }
  .pdp-helpful:hover { transform:translateX(3px); }
  .pdp-review-form-wrap { background:var(--light,#f8f8f5); border-radius:12px; padding:18px 20px; margin-bottom:16px; border:1px solid var(--border,#e8e0d5); }
  .pdp-review-form { display:flex; flex-direction:column; gap:10px; }
  .pdp-rf-row { display:flex; flex-direction:column; gap:4px; }
  .pdp-rf-label { font-size:11.5px; font-weight:600; color:var(--dark,#1a1a1a); letter-spacing:.5px; text-align:left; }
  .pdp-rf-stars { display:flex; align-items:center; }
  .pdp-rf-input { width:100%; padding:8px 11px; border:1px solid var(--border,#e0d8ce); border-radius:7px; font-family:'Jost',sans-serif; font-size:12.5px; background:#fff; color:var(--dark); outline:none; transition:border-color .2s; }
  .pdp-rf-input:focus { border-color:var(--gold,#B5975A); }
  .pdp-rf-textarea { width:100%; padding:8px 11px; border:1px solid var(--border,#e0d8ce); border-radius:7px; font-family:'Jost',sans-serif; font-size:12.5px; background:#fff; color:var(--dark); outline:none; resize:vertical; transition:border-color .2s; }
  .pdp-rf-textarea:focus { border-color:var(--gold,#B5975A); }
  .pdp-rf-submit { align-self:flex-start; padding:9px 22px; background:var(--gold,#B5975A); color:#0F0F0F; border:none; border-radius:7px; font-family:'Jost',sans-serif; font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; cursor:pointer; transition:background .2s,transform .18s; }
  .pdp-rf-submit:hover:not(:disabled) { background:#a0814a; transform:translateY(-1px); }
  .pdp-rf-submit:disabled { opacity:.6; cursor:not-allowed; }
  .pdp-rf-msg { font-size:12px; padding:8px 12px; border-radius:6px; font-family:'Jost',sans-serif; }
  .pdp-rf-msg.success { background:#e8f5e9; color:#2e7d32; border:1px solid #c8e6c9; }
  .pdp-rf-msg.error { background:#fce4ec; color:#b71c1c; border:1px solid #f8bbd0; }
  .pdp-pgrid  { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
  @media(max-width:860px){.pdp-pgrid{grid-template-columns:repeat(3,1fr)}}
  @media(max-width:560px){.pdp-pgrid{grid-template-columns:repeat(2,1fr);gap:10px}}
  .pdp-pc     { border-radius:10px; overflow:hidden; background:#fff; border:1px solid var(--border); cursor:pointer; transition:box-shadow .26s,transform .26s; display:flex; flex-direction:column; }
  .pdp-pc:hover { box-shadow:0 8px 22px rgba(0,0,0,.10); transform:translateY(-4px); }
  .pdp-pimgw  { position:relative; aspect-ratio:4/3; overflow:hidden; background:var(--light); }
  .pdp-pimg   { width:100%; height:100%; object-fit:cover; transition:transform .46s; }
  .pdp-pc:hover .pdp-pimg { transform:scale(1.07); }
  .pdp-povl   { position:absolute; inset:0; background:rgba(15,15,15,.52); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity .26s; }
  .pdp-pc:hover .pdp-povl { opacity:1; }
  .pdp-pabtn  { padding:7px 13px; background:var(--gold); color:#0F0F0F; border:none; border-radius:6px; font-family:'Jost',sans-serif; font-size:10px; letter-spacing:2px; text-transform:uppercase; cursor:pointer; display:flex; align-items:center; gap:5px; font-weight:700; }
  .pdp-pabtn:hover { background:#fff; color:var(--dark); }
  .pdp-pbadge { position:absolute; top:8px; left:8px; z-index:1; font-size:8px; font-weight:700; letter-spacing:1.5px; padding:3px 7px; border-radius:4px; font-family:'Jost',sans-serif; text-transform:uppercase; }
  .pdp-rvbadge{ position:absolute; top:8px; right:8px; z-index:1; background:rgba(0,0,0,.75); color:var(--gold); font-size:8px; letter-spacing:1px; padding:3px 7px; border-radius:10px; font-family:'Jost',sans-serif; display:flex; align-items:center; gap:4px; }
  .pdp-pbody  { padding:8px 10px; flex:1; display:flex; flex-direction:column; }
  .pdp-pcat   { font-size:8.5px; letter-spacing:1.5px; text-transform:uppercase; color:var(--gold); font-weight:500; margin-bottom:2px; text-align:left; }
  .pdp-pnam   { font-family:'Playfair Display',serif; font-size:12px; font-weight:600; color:var(--dark); margin-bottom:4px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; text-align:left; }
  .pdp-ppr    { display:flex; align-items:baseline; gap:4px; justify-content:flex-start; }
  .pdp-pp     { font-family:'Playfair Display',serif; font-size:13px; font-weight:700; color:var(--dark); }
  .pdp-po     { font-size:10px; color:#bbb; text-decoration:line-through; }
  .pdp-pd     { font-size:9px; color:var(--success); font-weight:600; }

  /* ── Enhanced Info Sections ── */
  .pdp-info-section{margin-bottom:26px}
  .pdp-section-heading{font-size:12px;font-weight:700;color:var(--dark);margin-bottom:13px;padding-bottom:9px;border-bottom:2px solid var(--border);text-align:left;display:flex;align-items:center;gap:7px;font-family:'Jost',sans-serif;letter-spacing:.5px;text-transform:uppercase}
  .pdp-hl-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(148px,1fr));gap:10px}
  .pdp-hl-card{background:var(--light);border:1px solid var(--border);border-radius:9px;padding:11px 13px;display:flex;flex-direction:column;gap:3px}
  .pdp-hl-label{font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--mid);font-weight:600}
  .pdp-hl-value{font-size:13px;font-weight:600;color:var(--dark)}
  .pdp-about-list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px}
  .pdp-about-item{display:flex;gap:10px;align-items:flex-start;font-size:13px;color:#444;line-height:1.65;text-align:left}
  .pdp-about-dot{width:6px;height:6px;border-radius:50%;background:var(--gold);flex-shrink:0;margin-top:7px}
  .pdp-dtable{width:100%;border-collapse:collapse}
  .pdp-dtable tr{border-bottom:1px solid var(--border)}
  .pdp-dtable tr:last-child{border-bottom:none}
  .pdp-dtable td{padding:9px 4px;font-size:13px;text-align:left;vertical-align:top}
  .pdp-dtable td:first-child{color:var(--mid);font-weight:600;white-space:nowrap;padding-right:20px;min-width:150px}
  .pdp-dtable td:last-child{color:var(--dark)}
  .pdp-style-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px 20px}
  .pdp-style-item{padding:8px 0;border-bottom:1px solid var(--border)}
  .pdp-style-label{font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--mid);font-weight:600;margin-bottom:2px}
  .pdp-style-value{font-size:13px;color:var(--dark);font-weight:500}
  .pdp-measure-row{display:flex;gap:14px;flex-wrap:wrap}
  .pdp-measure-item{background:var(--light);border:1px solid var(--border);border-radius:9px;padding:13px 17px;flex:1;min-width:130px}
  .pdp-measure-label{font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:var(--mid);font-weight:600;margin-bottom:3px}
  .pdp-measure-value{font-size:14px;font-weight:700;color:var(--dark)}
  .pdp-offer-band{background:linear-gradient(135deg,#f0fff4,#e8f5e9);border:1px solid #c8e6c9;border-radius:9px;padding:10px 14px;margin-bottom:10px;display:flex;align-items:center;gap:10px;flex-wrap:wrap}
  .pdp-offer-pill{background:#27AE60;color:#fff;font-size:10px;font-weight:700;letter-spacing:.6px;padding:3px 9px;border-radius:20px;white-space:nowrap}
  .pdp-offer-text{font-size:12px;color:#1B5E20;font-weight:500}
  @media(max-width:576px){.pdp-hl-grid{grid-template-columns:repeat(2,1fr)}.pdp-style-grid{grid-template-columns:1fr}}
`;

/* ══════════════════════════════════════════════════════════════════════════════
   DETAIL PAGE COMPONENT WITH WORKING SIZE SELECTION
══════════════════════════════════════════════════════════════════════════════ */
const parsePrice = (s) => parseFloat(String(s).replace(/[₹,]/g, ""));

const DetailPage = ({
  product,
  detailAnim,
  onClose,
  onAddToCart,
  onWishlist,
  isInWishlistFn,
  onProductClick,
  recentlyViewed,
  allProducts,
}) => {
  const navigate = useNavigate();
  const [mainImg, setMainImg] = useState(0);
  const [selColor, setSelColor] = useState(0);
  const [selSize, setSelSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [cartAdded, setCartAdded] = useState(false);

  // ── Dynamic Reviews ──
  const { user } = useAuth();
  const [dbReviews, setDbReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: "",
    body: "",
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMsg, setReviewMsg] = useState({ text: "", type: "" });

  const fetchReviews = useCallback(async (pid) => {
    if (!pid) return;
    setReviewsLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/reviews/${pid}`);
      if (res.ok) {
        const data = await res.json();
        setDbReviews(Array.isArray(data) ? data : []);
      } else {
        setDbReviews([]);
      }
    } catch {
      setDbReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (product?.id) fetchReviews(product.id);
  }, [product?.id, fetchReviews]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.body.trim()) {
      setReviewMsg({ text: "Review comment is required.", type: "error" });
      return;
    }
    if (!reviewForm.rating || reviewForm.rating < 1 || reviewForm.rating > 5) {
      setReviewMsg({ text: "Please select a valid rating.", type: "error" });
      return;
    }
    if (!product?.id) {
      setReviewMsg({ text: "Product not found.", type: "error" });
      return;
    }
    setReviewSubmitting(true);
    setReviewMsg({ text: "", type: "" });
    try {
      const res = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product.id,
          customer_id: user?.id || null,
          order_item_id: null,
          order_id: null,
          rating: reviewForm.rating,
          title: reviewForm.title.trim() || null,
          body: reviewForm.body.trim(),
          reviewer_name: user?.name || "Guest",
        }),
      });
      const data = await res.json();
      if (res.ok || res.status === 201) {
        setReviewMsg({ text: "Review submitted! Thank you.", type: "success" });
        setReviewForm({ rating: 5, title: "", body: "" });
        fetchReviews(product.id);
      } else {
        setReviewMsg({
          text: data.message || "Could not submit review.",
          type: "error",
        });
      }
    } catch {
      setReviewMsg({ text: "Network error. Please try again.", type: "error" });
    } finally {
      setReviewSubmitting(false);
    }
  };

  const zoomRef = useRef(null);
  const lensRef = useRef(null);
  const previewRef = useRef(null);
  const rafRef = useRef(null);
  const activeRef = useRef(false);
  const overlayRef = useRef(null);

  const tagSt = tagStyles[product.tag] || { bg: "#B5975A", color: "#0F0F0F" };
  const isWish = isInWishlistFn(product.id);
  const saving = parsePrice(product.originalPrice) - parsePrice(product.price);

  const images = product.images
    ? product.images
    : [product.image, product.image, product.image, product.image];

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

  const similar = allProducts
    .filter(
      (x) =>
        x.category === product.category &&
        x.id !== product.id &&
        !x.sellerAdded,
    )
    .slice(0, 4);
  const rvList = recentlyViewed.filter((p) => p.id !== product.id).slice(0, 4);
  const bars = [
    { l: "5★", p: 70, c: Math.round((product.reviews || 0) * 0.7) },
    { l: "4★", p: 18, c: Math.round((product.reviews || 0) * 0.18) },
    { l: "3★", p: 7, c: Math.round((product.reviews || 0) * 0.07) },
    { l: "2★", p: 3, c: Math.round((product.reviews || 0) * 0.03) },
    { l: "1★", p: 2, c: Math.round((product.reviews || 0) * 0.02) },
  ];

  // Updated handleCart to include selected size
  const handleCart = () => {
    onAddToCart({ ...product, selectedSize: selSize }, qty);
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 1600);
  };

  // Updated handleBuyNow to include selected size
  const handleBuyNow = () => {
    onAddToCart({ ...product, selectedSize: selSize }, qty);
    navigate("/checkout");
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

  const doZoom = (cx, cy) => {
    if (!zoomRef.current || !lensRef.current || !previewRef.current) return;
    const r = zoomRef.current.getBoundingClientRect();
    let rx = Math.min(Math.max((cx - r.left) / r.width, 0), 1);
    let ry = Math.min(Math.max((cy - r.top) / r.height, 0), 1);
    const lw = 118,
      lh = 118;
    const ll = Math.min(Math.max(rx * r.width - lw / 2, 0), r.width - lw);
    const lt = Math.min(Math.max(ry * r.height - lh / 2, 0), r.height - lh);
    lensRef.current.style.transform = `translate3d(${ll}px,${lt}px,0)`;
    previewRef.current.style.backgroundPosition = `${rx * 100}% ${ry * 100}%`;
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
      previewRef.current.style.backgroundImage = `url(${images[mainImg]})`;
    }
  }, [mainImg, images]);

  const curImg = images[mainImg];
  const colorNames =
    product.colorNames ||
    (product.colors || []).map((_, i) => `Color ${i + 1}`);
  const sizes = product.sizes || ["S", "M", "L", "XL"];

  return (
    <div className={`pdp-overlay ${detailAnim}`} ref={overlayRef}>
      <div className="pdp-nav">
        <button className="pdp-back-btn" onClick={onClose}>
          <FaArrowLeft size={10} /> Back to Shop
        </button>
        <span className="pdp-nav-title">{product.name}</span>
        <button
          className={`pdp-nav-wish ${isWish ? "wished" : ""}`}
          onClick={() => onWishlist(product)}
        >
          {isWish ? <FaHeart size={12} /> : <FaRegHeart size={12} />}{" "}
          {isWish ? "Wishlisted" : "Wishlist"}
        </button>
      </div>

      <div className="pdp-crumb">
        <span className="pdp-crumb-link" onClick={onClose}>
          Shop
        </span>
        <span className="pdp-crumb-sep">/</span>
        <span>{product.category}</span>
        <span className="pdp-crumb-sep">/</span>
        <span style={{ color: "var(--mid)" }}>{product.name}</span>
      </div>

      <div className="pdp-hero">
        <div className="pdp-gcol">
          <div className="pdp-thumbs">
            {images.map((img, i) => (
              <div
                key={i}
                className={`pdp-thumb ${mainImg === i ? "active" : ""}`}
                onClick={() => setMainImg(i)}
              >
                <img
                  src={img}
                  alt={`${product.name} ${i + 1}`}
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&q=80";
                  }}
                />
              </div>
            ))}
          </div>
          <div className="pdp-mwrap-col">
            <div
              ref={zoomRef}
              className="pdp-mwrap"
              onMouseEnter={onEnter}
              onMouseLeave={onLeave}
              onMouseMove={onMove}
            >
              <img
                src={curImg}
                alt={product.name}
                className="pdp-mimg"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700&q=85";
                }}
              />
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

        <div className="pdp-icol">
          <div className="pdp-brand">
            {product.brand || product.subCategory}
          </div>
          <h1 className="pdp-pname">{product.name}</h1>
          <div className="pdp-rrow">
            <div className="pdp-rstars">{stars(product.rating)}</div>
            <span className="pdp-rnum">{product.rating}</span>
            <span className="pdp-rsep">·</span>
            <span className="pdp-rcnt">{product.reviews || 0} reviews</span>
          </div>
          <div className="pdp-prices">
            <span className="pdp-price">{product.price}</span>
            <span className="pdp-oprice">{product.originalPrice}</span>
            <span className="pdp-dbadge">{product.discount}</span>
          </div>
          <p className="pdp-save">You save ₹{saving.toLocaleString("en-IN")}</p>
          {product.discount && saving > 0 && (
            <div className="pdp-offer-band">
              <span className="pdp-offer-pill">{product.discount}</span>
              <span className="pdp-offer-text">
                Limited time offer — save ₹{saving.toLocaleString("en-IN")} on
                this item
              </span>
            </div>
          )}
          <div className="pdp-stock">
            <span className="pdp-sdot" /> In Stock
          </div>
          <p className="pdp-desc">{product.description}</p>
          <hr className="pdp-hr" />

          {(product.colors || []).length > 0 && (
            <>
              <div className="pdp-lbl">Select Colors</div>
              <div className="pdp-clist">
                {(product.colors || []).map((c, i) => (
                  <button
                    key={i}
                    className={`pdp-copt ${selColor === i ? "active" : ""}`}
                    onClick={() => {
                      setSelColor(i);
                      if (
                        product.colorImages &&
                        product.colorImages[i] !== undefined
                      ) {
                        setMainImg(product.colorImages[i]);
                      }
                    }}
                  >
                    <div className="pdp-csw" style={{ backgroundColor: c }} />
                    <span className="pdp-cname">{colorNames[i]}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* SIZE SELECTION - Click to select, active style shows dark background */}
          <div className="pdp-lbl">Choose Size</div>
          <div className="pdp-slist">
            {sizes.map((s) => (
              <button
                key={s}
                className={`pdp-sbtn ${selSize === s ? "active" : ""}`}
                onClick={() => setSelSize(s)}
              >
                {s}
              </button>
            ))}
          </div>

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

          <div className="pdp-brow">
            <button
              className={`pdp-bcart ${cartAdded ? "added" : ""}`}
              onClick={handleCart}
            >
              <FaShoppingBag size={11} />{" "}
              {cartAdded ? "Added ✓" : "Add to Cart"}
            </button>
            <button className="pdp-bbuy" onClick={handleBuyNow}>
              <FaBolt size={11} /> Buy Now
            </button>
          </div>

          <div className="pdp-trust">
            <div className="pdp-titem">
              <FaTruck className="pdp-ticon" size={11} />{" "}
              {product.delivery || "Free delivery"}
            </div>
            <div className="pdp-titem">
              <FaExchangeAlt className="pdp-ticon" size={11} />{" "}
              {product.returns || "30 days easy returns"}
            </div>
            <div className="pdp-titem">
              <FaShieldAlt className="pdp-ticon" size={11} />{" "}
              {product.warranty || "3 months warranty"}
            </div>
          </div>
        </div>
      </div>

      <div className="pdp-below">
        {/* TOP HIGHLIGHTS */}
        {(() => {
          const hlItems = [
            { label: "Material", value: product.material },
            { label: "Brand", value: product.brand },
            { label: "Care", value: product.care },
            { label: "Collection", value: product.collection },
            { label: "Metal Type", value: product.metalType },
            { label: "Country of Origin", value: product.country },
          ].filter((h) => h.value);
          return hlItems.length > 0 ? (
            <div className="pdp-info-section">
              <div className="pdp-section-heading">🏷️ Top Highlights</div>
              <div className="pdp-hl-grid">
                {hlItems.map((h, i) => (
                  <div key={i} className="pdp-hl-card">
                    <div className="pdp-hl-label">{h.label}</div>
                    <div className="pdp-hl-value">{h.value}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : null;
        })()}

        {/* ABOUT THIS ITEM */}
        {Array.isArray(product.highlights) && product.highlights.length > 0 && (
          <div className="pdp-info-section">
            <div className="pdp-section-heading">📋 About This Item</div>
            <ul className="pdp-about-list">
              {product.highlights.map((h, i) => (
                <li key={i} className="pdp-about-item">
                  <span className="pdp-about-dot" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* PRODUCT DETAILS */}
        {(() => {
          const dtRows = [
            ["Material", product.material],
            ["Care Instructions", product.care],
            ["Metal Type", product.metalType],
            ["Metal Stamp", product.metalStamp],
            ["Country of Origin", product.country],
            ["Manufacturer", product.manufacturer || product.brand],
            ["Collection Name", product.collection],
          ].filter(([, v]) => v);
          return dtRows.length > 0 ? (
            <div className="pdp-info-section">
              <div className="pdp-section-heading">ℹ️ Product Details</div>
              <table className="pdp-dtable">
                <tbody>
                  {dtRows.map(([k, v]) => (
                    <tr key={k}>
                      <td>{k}</td>
                      <td className="pdp-dvalue">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null;
        })()}

        {/* STYLE DETAILS */}
        {(() => {
          const sItems = [
            ["Colour", (product.colorNames || [])[selColor]],
            ["Occasion", product.occasion],
            ["Style Name", product.styleName],
            ["Item Shape", product.itemShape],
            ["Stone Color", product.stoneColor],
            ["Stone Shape", product.stoneShape],
            ["Charm Design", product.charmDesign],
          ].filter(([, v]) => v);
          return sItems.length > 0 ? (
            <div className="pdp-info-section">
              <div className="pdp-section-heading">✨ Style Details</div>
              <div className="pdp-style-grid">
                {sItems.map(([k, v]) => (
                  <div key={k} className="pdp-style-item">
                    <div className="pdp-style-label">{k}</div>
                    <div className="pdp-style-value">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : null;
        })()}

        {/* MEASUREMENTS */}
        {(() => {
          const hasDim =
            product.length ||
            product.breadth ||
            product.height ||
            product.dimensions;
          const dimText =
            product.dimensions ||
            (hasDim
              ? `${product.length || 0}L x ${product.breadth || 0}W x ${product.height || 0}H cm`
              : null);
          const hasWeight = product.weight;
          const weightText = hasWeight ? `${product.weight} kg` : null;

          if (!dimText && !weightText) return null;

          return (
            <div className="pdp-info-section">
              <div className="pdp-section-heading">📐 Measurements</div>
              <div className="pdp-measure-row">
                {dimText && (
                  <div className="pdp-measure-item">
                    <div className="pdp-measure-label">Item Dimensions</div>
                    <div className="pdp-measure-value">{dimText}</div>
                  </div>
                )}
                {weightText && (
                  <div className="pdp-measure-item">
                    <div className="pdp-measure-label">Item Weight</div>
                    <div className="pdp-measure-value">{weightText}</div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        <p className="pdp-sey">— Customer Feedback —</p>
        <h2 className="pdp-sh">
          What Our Customers <em>Say</em>
        </h2>
        <div className="pdp-rsum">
          <div className="pdp-bigr">
            <div className="pdp-bnum">{product.rating || "—"}</div>
            <div className="pdp-bstars">{stars(product.rating || 0, 13)}</div>
            <div className="pdp-bcnt">
              {dbReviews.length} review{dbReviews.length !== 1 ? "s" : ""}
            </div>
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

        <div className="pdp-review-form-wrap">
          <div
            className="pdp-rtitle"
            style={{
              fontSize: 13,
              marginBottom: 10,
              fontWeight: 600,
              color: "var(--gold, #B5975A)",
            }}
          >
            Write a Review
          </div>
          <form onSubmit={handleReviewSubmit} className="pdp-review-form">
            <div className="pdp-rf-row">
              <label className="pdp-rf-label">Your Rating</label>
              <div className="pdp-rf-stars">
                {[1, 2, 3, 4, 5].map((n) => (
                  <FaStar
                    key={n}
                    size={18}
                    style={{
                      cursor: "pointer",
                      color: n <= reviewForm.rating ? "#B5975A" : "#ccc",
                      marginRight: 3,
                    }}
                    onClick={() => setReviewForm((f) => ({ ...f, rating: n }))}
                  />
                ))}
              </div>
            </div>
            <div className="pdp-rf-row">
              <label className="pdp-rf-label">
                Title{" "}
                <span style={{ color: "#aaa", fontWeight: 400 }}>
                  (optional)
                </span>
              </label>
              <input
                className="pdp-rf-input"
                type="text"
                maxLength={120}
                placeholder="Summarize your experience"
                value={reviewForm.title}
                onChange={(e) =>
                  setReviewForm((f) => ({ ...f, title: e.target.value }))
                }
              />
            </div>
            <div className="pdp-rf-row">
              <label className="pdp-rf-label">
                Comment <span style={{ color: "#c00" }}>*</span>
              </label>
              <textarea
                className="pdp-rf-textarea"
                rows={3}
                maxLength={1000}
                placeholder="Share your experience with this product..."
                value={reviewForm.body}
                onChange={(e) =>
                  setReviewForm((f) => ({ ...f, body: e.target.value }))
                }
              />
            </div>
            {reviewMsg.text && (
              <div className={`pdp-rf-msg ${reviewMsg.type}`}>
                {reviewMsg.text}
              </div>
            )}
            <button
              type="submit"
              className="pdp-rf-submit"
              disabled={reviewSubmitting}
            >
              {reviewSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
        <hr className="pdp-rdiv" />

        {reviewsLoading ? (
          <div
            style={{
              textAlign: "center",
              padding: "18px 0",
              color: "#888",
              fontSize: 13,
            }}
          >
            Loading reviews...
          </div>
        ) : dbReviews.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "22px 0",
              color: "#aaa",
              fontSize: 13,
              fontStyle: "italic",
            }}
          >
            No reviews yet — be the first to share your experience!
          </div>
        ) : (
          dbReviews.map((r) => (
            <div className="pdp-rcard" key={r.review_id}>
              <div className="pdp-rhead">
                <div>
                  <div className="pdp-rname">
                    {r.reviewer_name || "Anonymous"}
                  </div>
                  <div className="pdp-rmeta">
                    <div className="pdp-rstars2">{stars(r.rating, 11)}</div>
                    <span className="pdp-verified">✓ Verified</span>
                  </div>
                </div>
                <span className="pdp-rdate">
                  <FaCalendarAlt size={9} />{" "}
                  {r.created_at
                    ? new Date(r.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : ""}
                </span>
              </div>
              {r.title && <div className="pdp-rtitle">{r.title}</div>}
              <div className="pdp-rbody">{r.body}</div>
            </div>
          ))
        )}

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
                  bg: "#B5975A",
                  color: "#0F0F0F",
                };
                return (
                  <div
                    key={sp.id}
                    className="pdp-pc"
                    onClick={() => handlePClick(sp)}
                  >
                    <div className="pdp-pimgw">
                      <img
                        src={sp.image || (sp.images && sp.images[0])}
                        alt={sp.name}
                        className="pdp-pimg"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80";
                        }}
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
                            onAddToCart(sp, 1);
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
                  bg: "#B5975A",
                  color: "#0F0F0F",
                };
                return (
                  <div
                    key={rv.id}
                    className="pdp-pc"
                    onClick={() => handlePClick(rv)}
                  >
                    <div className="pdp-pimgw">
                      <img
                        src={rv.image || (rv.images && rv.images[0])}
                        alt={rv.name}
                        className="pdp-pimg"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80";
                        }}
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
                            onAddToCart(rv, 1);
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

/* ══════════════════════════════════════════════════════════════════════════════
   DROPDOWN BUTTON
══════════════════════════════════════════════════════════════════════════════ */
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
                className={`dd-item ${activeSubCategory === sub && activeCategory === item.label ? "active" : ""}`}
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

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN SHOP PAGE
══════════════════════════════════════════════════════════════════════════════ */
export default function ShopPage() {
  const [activeColor, setActiveColor] = useState({});
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [sortBy, setSortBy] = useState("featured");
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [activeAge, setActiveAge] = useState("all");
  const [toast, setToast] = useState({ show: false, message: "" });

  const [detailProduct, setDetailProduct] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailAnim, setDetailAnim] = useState("entering");
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  const {
    addToCart,
    addToWishlist: addToStoreWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useStore();
  const { products: sellerProducts, deleteProduct } = useProducts();

  const allProducts = React.useMemo(
    () => [...sellerProducts, ...staticProducts],
    [sellerProducts],
  );

  const showToast = (productName) => {
    setToast({ show: true, message: `${productName} added to cart!` });
    setTimeout(() => setToast({ show: false, message: "" }), 2000);
  };

  const toggleWishlist = (p) =>
    isInWishlist(p.id) ? removeFromWishlist(p.id) : addToStoreWishlist(p);

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
        ...item,
        price: parseInt(String(item.price).replace(/[^0-9]/g, "")),
        quantity,
      });
      showToast(item.name);
    },
    [addToCart],
  );

  const handleProductClick = useCallback((p) => {
    setDetailProduct(p);
    setDetailAnim("entering");
    setRecentlyViewed((prev) =>
      [p, ...prev.filter((x) => x.id !== p.id)].slice(0, 8),
    );
  }, []);

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
        if (!pAge) return true;
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

      {detailVisible && detailProduct && (
        <DetailPage
          product={detailProduct}
          detailAnim={detailAnim}
          onClose={closeDetail}
          onAddToCart={handleAddToCart}
          onWishlist={toggleWishlist}
          isInWishlistFn={isInWishlist}
          onProductClick={handleProductClick}
          recentlyViewed={recentlyViewed}
          allProducts={allProducts}
        />
      )}

      {/* Category Filters Bar - Positioned directly below navbar */}
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
              const uniqueKey = item.sellerAdded
                ? `seller-${item.id}`
                : `static-${item.id}`;
              const tag = tagConfig[item.tag] || {
                bg: "#F3F4F6",
                color: "#4B5563",
                border: "#E5E7EB",
              };
              return (
                <Col key={uniqueKey} xs={12} sm={6} lg={4} xl={3}>
                  <div className="pl-card" onClick={() => openDetail(item)}>
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
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(item);
                        }}
                      >
                        {isInWishlist(item.id) ? (
                          <FaHeart className="heart-on" size={14} />
                        ) : (
                          <FaRegHeart className="heart-off" size={14} />
                        )}
                      </button>
                    </div>

                    <div className="pl-body">
                      <div className="pl-sub">
                        {item.category} • {item.subCategory}
                      </div>
                      <h3 className="pl-name">{item.name}</h3>
                      <div className="pl-colors">
                        {(item.colors || []).map((c, i) => (
                          <div
                            key={i}
                            className={`pl-dot ${activeColor[item.id] === i ? "sel" : ""}`}
                            style={{ backgroundColor: c }}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(item);
                        }}
                      >
                        <FaShoppingBag size={12} /> Add to Cart
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
