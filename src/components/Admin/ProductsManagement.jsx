// src/components/Admin/ProductsManagement.jsx
import React, { useState, useEffect } from "react";
import { useProducts } from "../../context/ProductContext";
import { useStore } from "../../context/StoreContext";

const ProductsManagement = () => {
  const {
    products: sellerProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();
  const { products: storeProducts } = useStore();

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [imagePreview, setImagePreview] = useState("");
  const [allProducts, setAllProducts] = useState([]); // State to manage all products

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalPrice: "",
    discount: "",
    category: "",
    subCategory: "",
    rating: 4.0,
    reviews: 0,
    image: "",
    description: "",
    tag: "NEW IN",
    colors: [],
    stock: 0,
  });

  // Available tags for products
  const availableTags = ["NEW IN", "TRENDING", "BESTSELLER", "HOT"];

  // Categories structure matching your shop
  const categories = [
    {
      id: "Men",
      name: "Men",
      subcategories: ["Shirts", "Men Fashion", "T-Shirts", "Pants"],
    },
    {
      id: "Women",
      name: "Women",
      subcategories: ["Saree", "Women Fashion", "Western Dress"],
    },
    {
      id: "Accessories",
      name: "Accessories",
      subcategories: ["Sandals", "Accessories", "Jewelry"],
    },
  ];

  // Static products data
  const staticProductsData = [
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
      stock: 45,
      isStatic: true,
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
      stock: 32,
      isStatic: true,
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
      stock: 28,
      isStatic: true,
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
      stock: 56,
      isStatic: true,
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
      stock: 89,
      isStatic: true,
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
      stock: 120,
      isStatic: true,
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
      stock: 34,
      isStatic: true,
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
      stock: 23,
      isStatic: true,
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
      stock: 18,
      isStatic: true,
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
      stock: 42,
      isStatic: true,
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
      stock: 67,
      isStatic: true,
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
      stock: 31,
      isStatic: true,
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
      image:
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&q=90&auto=format&fit=crop",
      tag: "TRENDING",
      colors: ["#D4AF37", "#8B0000", "#2C1810"],
      description: "Pure Banarasi silk with intricate zari border",
      stock: 15,
      isStatic: true,
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
      image:
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&q=90&auto=format&fit=crop",
      tag: "HOT",
      colors: ["#B76E6E", "#D4AF37", "#4A6FA5"],
      description: "Authentic Kanjivaram silk with golden zari work",
      stock: 12,
      isStatic: true,
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
      stock: 44,
      isStatic: true,
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
      stock: 29,
      isStatic: true,
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
      stock: 19,
      isStatic: true,
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
      stock: 52,
      isStatic: true,
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
      stock: 27,
      isStatic: true,
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
      stock: 41,
      isStatic: true,
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
      stock: 63,
      isStatic: true,
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
      stock: 48,
      isStatic: true,
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
      stock: 34,
      isStatic: true,
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
      stock: 56,
      isStatic: true,
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
      stock: 23,
      isStatic: true,
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
      stock: 31,
      isStatic: true,
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
      stock: 47,
      isStatic: true,
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
      stock: 19,
      isStatic: true,
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
      stock: 38,
      isStatic: true,
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
      stock: 53,
      isStatic: true,
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
      stock: 16,
      isStatic: true,
    },
  ];

  // Helper function to parse price string to number
  const parsePriceToNumber = (priceStr) => {
    return parseInt(String(priceStr).replace(/[^0-9]/g, ""));
  };

  // Helper function to format price to INR
  const formatToINR = (priceNum) => {
    return `₹${priceNum.toLocaleString("en-IN")}`;
  };

  // Load and combine products
  useEffect(() => {
    const sellerProductsWithFlag = sellerProducts.map((p) => ({
      ...p,
      isStatic: false,
    }));

    // Get stored deleted static products from localStorage
    const deletedStaticProducts = JSON.parse(
      localStorage.getItem("deletedStaticProducts") || "[]",
    );

    // Filter out deleted static products
    const availableStaticProducts = staticProductsData.filter(
      (product) => !deletedStaticProducts.includes(product.id),
    );

    setAllProducts([...availableStaticProducts, ...sellerProductsWithFlag]);
  }, [sellerProducts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "colors") {
      const colorsArray = value.split(",").map((c) => c.trim());
      setFormData((prev) => ({ ...prev, colors: colorsArray }));
    } else {
      setFormData((prev) => {
        const updated = { ...prev, [name]: value };
        if (name === "category") {
          updated.subCategory = "";
        }
        return updated;
      });
    }
  };

  const handleImageChange = (e) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, image: url }));
    setImagePreview(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Detailed validation to find exactly what's missing
    const missing = [];
    if (!formData.name) missing.push("Product Name");
    if (!formData.category) missing.push("Category");
    if (!formData.subCategory) missing.push("Subcategory");
    if (!formData.price) missing.push("Selling Price");

    if (missing.length > 0) {
      alert(`Please fill: ${missing.join(", ")}`);
      return;
    }

    const sellingPriceNum = parsePriceToNumber(formData.price);
    if (sellingPriceNum <= 0) {
      alert("Selling price must be greater than 0");
      return;
    }

    try {
      const productData = {
        name: formData.name,
        price: sellingPriceNum, // Send raw number
        originalPrice: parsePriceToNumber(formData.originalPrice || formData.price),
        discount: formData.discount || "",
        category: formData.category,
        subCategory: formData.subCategory,
        rating: parseFloat(formData.rating) || 4.5,
        reviews: parseInt(formData.reviews) || 0,
        image: formData.image,
        description: formData.description,
        tag: formData.tag,
        colors: Array.isArray(formData.colors) ? formData.colors : [],
        stock: parseInt(formData.stock) || 0,
        seller_id: 1 // Default for admin-added products
      };

      if (editingProduct) {
        if (editingProduct.isStatic) {
          await addProduct(productData, 1);
          alert("Static product copied and added successfully!");
        } else {
          await updateProduct(editingProduct.id, productData);
          alert("Product updated successfully!");
        }
      } else {
        await addProduct(productData, 1);
        alert("Product added successfully!");
      }
      resetForm();
    } catch (error) {
      console.error("Save product error:", error);
      alert("Failed to save product: " + error.message);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: parsePriceToNumber(product.price).toString(),
      originalPrice: parsePriceToNumber(product.originalPrice).toString(),
      discount: product.discount || "",
      category: product.category,
      subCategory: product.subCategory,
      rating: product.rating,
      reviews: product.reviews,
      image: product.image,
      description: product.description,
      tag: product.tag,
      colors: Array.isArray(product.colors) ? product.colors.join(", ") : "",
      stock: product.stock,
    });
    setImagePreview(product.image);
    setShowModal(true);
  };

  const handleDelete = async (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        if (product.isStatic) {
          // For static products, store in localStorage to remember deletion
          const deletedStaticProducts = JSON.parse(
            localStorage.getItem("deletedStaticProducts") || "[]"
          );
          if (!deletedStaticProducts.includes(product.id)) {
            deletedStaticProducts.push(product.id);
            localStorage.setItem(
              "deletedStaticProducts",
              JSON.stringify(deletedStaticProducts)
            );
          }
          // Update the allProducts state to remove the product
          setAllProducts((prevProducts) =>
            prevProducts.filter((p) => p.id !== product.id)
          );
          alert("Static product deleted successfully!");
        } else {
          // For user-added products, use the context function with await
          await deleteProduct(product.id);
          alert("Product deleted successfully!");
        }
      } catch (error) {
        console.error("Delete failure:", error);
        alert("Failed to delete product: " + error.message);
      }
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setEditingProduct(null);
    setImagePreview("");
    setCurrentPage(1);
    setFormData({
      name: "",
      price: "",
      originalPrice: "",
      discount: "",
      category: "",
      subCategory: "",
      rating: 4.0,
      reviews: 0,
      image: "",
      description: "",
      tag: "NEW IN",
      colors: [],
      stock: 0,
    });
  };

  const getCategoryCount = (categoryId) => {
    if (categoryId === "all") return allProducts.length;
    return allProducts.filter((p) => p.category === categoryId).length;
  };

  const filteredProducts = React.useMemo(() => {
    const filtered =
      selectedCategory === "all"
        ? allProducts
        : allProducts.filter((p) => p.category === selectedCategory);
    return filtered;
  }, [allProducts, selectedCategory]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    document
      .querySelector(".products-table-container")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Reset to first page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  return (
    <div className="products-management">
      <style>{`
        .products-management {
          padding: 20px;
          background: #f8f9fa;
          min-height: 100vh;
        }
        
        .management-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }
        
        .management-header h2 {
          font-size: 24px;
          color: #1f2937;
          margin: 0;
        }
        
        .add-btn {
          background: #1f2937;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .add-btn:hover {
          background: #374151;
          transform: translateY(-2px);
        }
        
        .category-tabs {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          flex-wrap: wrap;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 12px;
        }
        
        .category-tab {
          background: none;
          border: none;
          padding: 8px 16px;
          cursor: pointer;
          font-weight: 500;
          color: #6b7280;
          transition: all 0.3s ease;
          border-radius: 6px;
        }
        
        .category-tab:hover {
          color: #1f2937;
          background: #f3f4f6;
        }
        
        .category-tab.active {
          color: #1f2937;
          background: #e5e7eb;
          font-weight: 600;
        }
        
        .products-table-container {
          background: white;
          border-radius: 12px;
          overflow-x: auto;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .products-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }
        
        .products-table th,
        .products-table td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .products-table th {
          background: #f9fafb;
          font-weight: 600;
          color: #374151;
        }
        
        .products-table tr:hover {
          background: #f9fafb;
        }
        
        .product-image {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 8px;
        }
        
        .static-badge {
          display: inline-block;
          background: #e5e7eb;
          color: #6b7280;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
          margin-left: 8px;
        }
        
        .category-badge {
          display: inline-block;
          background: #dbeafe;
          color: #1e40af;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .stock-badge {
          display: inline-block;
          background: #dcfce7;
          color: #166534;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .stock-badge.low-stock {
          background: #fee2e2;
          color: #991b1b;
        }
        
        .edit-btn,
        .delete-btn {
          padding: 6px 12px;
          margin: 0 4px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        
        .edit-btn {
          background: #e0e7ff;
          color: #3730a3;
        }
        
        .edit-btn:hover {
          background: #c7d2fe;
        }
        
        .delete-btn {
          background: #fee2e2;
          color: #991b1b;
        }
        
        .delete-btn:hover {
          background: #fecaca;
        }
        
        /* Pagination Styles */
        .pagination-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
          padding: 16px;
          background: white;
          border-radius: 12px;
          flex-wrap: wrap;
          gap: 16px;
        }
        
        .items-per-page {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .items-per-page label {
          color: #6b7280;
          font-size: 14px;
        }
        
        .items-per-page select {
          padding: 6px 10px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          cursor: pointer;
          background: white;
        }
        
        .pagination {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }
        
        .page-btn {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          background: white;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s ease;
          font-size: 14px;
        }
        
        .page-btn:hover:not(:disabled) {
          background: #f3f4f6;
          border-color: #9ca3af;
        }
        
        .page-btn.active {
          background: #1f2937;
          color: white;
          border-color: #1f2937;
        }
        
        .page-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .page-info {
          color: #6b7280;
          font-size: 14px;
        }
        
        /* Modal Styles */
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .modal-content {
          background: white;
          border-radius: 16px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease;
        }
        
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .modal-header h3 {
          margin: 0;
          color: #1f2937;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 28px;
          cursor: pointer;
          color: #6b7280;
          transition: color 0.2s;
        }
        
        .close-btn:hover {
          color: #1f2937;
        }
        
        form {
          padding: 24px;
        }
        
        .form-group {
          margin-bottom: 16px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
          color: #374151;
          font-size: 14px;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #1f2937;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        
        .image-preview {
          margin-top: 8px;
          max-width: 100%;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .image-preview img {
          width: 100%;
          max-height: 200px;
          object-fit: cover;
        }
        
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
        }
        
        .cancel-btn,
        .submit-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }
        
        .cancel-btn {
          background: #f3f4f6;
          color: #374151;
        }
        
        .cancel-btn:hover {
          background: #e5e7eb;
        }
        
        .submit-btn {
          background: #1f2937;
          color: white;
        }
        
        .submit-btn:hover {
          background: #374151;
          transform: translateY(-1px);
        }
        
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .pagination-container {
            flex-direction: column;
            align-items: stretch;
          }
          
          .pagination {
            justify-content: center;
          }
        }
      `}</style>

      <div className="management-header">
        <h2>Products Management</h2>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          + Add New Product
        </button>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        <button
          className={`category-tab ${selectedCategory === "all" ? "active" : ""}`}
          onClick={() => setSelectedCategory("all")}
        >
          All Products ({getCategoryCount("all")})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`category-tab ${selectedCategory === cat.id ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.name} ({getCategoryCount(cat.id)})
          </button>
        ))}
      </div>

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Subcategory</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img
                      src={product.image || "https://via.placeholder.com/100"}
                      alt={product.name}
                      className="product-image"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/100";
                      }}
                    />
                  </td>
                  <td>
                    <strong>{product.name}</strong>
                    {product.isStatic && (
                      <span className="static-badge">Static</span>
                    )}
                  </td>
                  <td>
                    <span className="category-badge">{product.category}</span>
                  </td>
                  <td>{product.subCategory || "-"}</td>
                  <td>{product.price}</td>
                  <td>
                    <span
                      className={`stock-badge ${product.stock < 10 ? "low-stock" : ""}`}
                    >
                      {product.stock || 0}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: "#f59e0b" }}>★</span>{" "}
                    {product.rating || "N/A"}
                  </td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(product)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  style={{ textAlign: "center", padding: "40px" }}
                >
                  No products found in this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <div className="pagination-container">
          <div className="items-per-page">
            <label>Show:</label>
            <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>

          <div className="pagination">
            <button
              className="page-btn"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              className="page-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {(() => {
              const pageNumbers = [];
              const maxVisiblePages = 5;
              let startPage = Math.max(
                1,
                currentPage - Math.floor(maxVisiblePages / 2),
              );
              let endPage = Math.min(
                totalPages,
                startPage + maxVisiblePages - 1,
              );

              if (endPage - startPage + 1 < maxVisiblePages) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
              }

              for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(
                  <button
                    key={i}
                    className={`page-btn ${currentPage === i ? "active" : ""}`}
                    onClick={() => handlePageChange(i)}
                  >
                    {i}
                  </button>,
                );
              }
              return pageNumbers;
            })()}

            <button
              className="page-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button
              className="page-btn"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </button>
          </div>

          <div className="page-info">
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, filteredProducts.length)} of{" "}
            {filteredProducts.length} entries
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
              <button className="close-btn" onClick={resetForm}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter product name"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Subcategory *</label>
                  <select
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Subcategory</option>
                    {formData.category ? (
                      categories
                        .find((c) => c.id === formData.category)
                        ?.subcategories.map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))
                    ) : (
                      <option disabled>Please select a category first</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Selling Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 1799"
                  />
                </div>

                <div className="form-group">
                  <label>Original Price (₹) *</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 2999"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Stock Quantity *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Product Tag</label>
                  <select
                    name="tag"
                    value={formData.tag}
                    onChange={handleInputChange}
                  >
                    {availableTags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Rating (0-5)</label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    max="5"
                    placeholder="4.5"
                  />
                </div>

                <div className="form-group">
                  <label>Number of Reviews</label>
                  <input
                    type="number"
                    name="reviews"
                    value={formData.reviews}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Colors (comma separated)</label>
                <input
                  type="text"
                  name="colors"
                  value={
                    Array.isArray(formData.colors)
                      ? formData.colors.join(", ")
                      : formData.colors
                  }
                  onChange={handleInputChange}
                  placeholder="#FFFFFF, #000000, #FF0000"
                />
                <small style={{ color: "#6b7280", fontSize: "12px" }}>
                  Enter hex color codes separated by commas
                </small>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Product description..."
                />
              </div>

              <div className="form-group">
                <label>Image URL *</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleImageChange}
                  required
                  placeholder="https://example.com/image.jpg"
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingProduct ? "Update" : "Add"} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;
