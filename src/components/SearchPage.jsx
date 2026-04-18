// components/SearchPage.jsx
import React, { useState, useEffect } from "react";
import { useStore } from "../context/StoreContext";
import {
  FaSearch,
  FaHeart,
  FaShoppingBag,
  FaTimes,
  FaFilter,
  FaStar,
  FaRegStar,
} from "react-icons/fa";
import { Link, useSearchParams } from "react-router-dom";

const allProducts = [
  {
    id: 1,
    name: "Nivest Classic Tee",
    price: 49,
    originalPrice: 69,
    category: "Men",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop",
    description: "Premium cotton, relaxed fit",
    rating: 5,
    reviews: 128,
    tag: "Best Seller",
  },
  {
    id: 2,
    name: "Signature Hoodie",
    price: 89,
    originalPrice: null,
    category: "Men",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop",
    description: "French terry, oversized silhouette",
    rating: 4,
    reviews: 89,
    tag: "New",
  },
  {
    id: 3,
    name: "Slim Chinos",
    price: 69,
    originalPrice: 89,
    category: "Men",
    image:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop",
    description: "Stretch cotton, tailored fit",
    rating: 5,
    reviews: 234,
    tag: "Sale",
  },
  {
    id: 4,
    name: "Linen Shirt",
    price: 59,
    originalPrice: null,
    category: "Women",
    image:
      "https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=600&h=800&fit=crop",
    description: "Breathable European linen",
    rating: 4,
    reviews: 67,
    tag: "",
  },
  {
    id: 5,
    name: "Utility Jacket",
    price: 129,
    originalPrice: 159,
    category: "Men",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop",
    description: "Waxed canvas, water-resistant",
    rating: 5,
    reviews: 45,
    tag: "Limited",
  },
  {
    id: 6,
    name: "Canvas Sneakers",
    price: 79,
    originalPrice: null,
    category: "Women",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=800&fit=crop",
    description: "Vulcanized rubber sole",
    rating: 4,
    reviews: 312,
    tag: "Trending",
  },
  {
    id: 7,
    name: "Cashmere Sweater",
    price: 159,
    originalPrice: 229,
    category: "Women",
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop",
    description: "Ultra-soft Mongolian cashmere",
    rating: 5,
    reviews: 78,
    tag: "Premium",
  },
  {
    id: 8,
    name: "Leather Backpack",
    price: 199,
    originalPrice: null,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop",
    description: "Full-grain Italian leather",
    rating: 5,
    reviews: 156,
    tag: "Bestseller",
  },
];

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [localQuery, setLocalQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState("relevance");
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const { addToCart, addToWishlist, isInWishlist } = useStore();

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    let results = allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()),
    );

    if (selectedCategory !== "All") {
      results = results.filter((p) => p.category === selectedCategory);
    }

    results = results.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );

    switch (sortBy) {
      case "price_low":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        results.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        results.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    setSearchResults(results);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(localQuery);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) =>
      i < rating ? (
        <FaStar key={i} size={12} color="#e8c97e" />
      ) : (
        <FaRegStar key={i} size={12} color="#4a4a4a" />
      ),
    );
  };

  const categories = ["All", "Men", "Women", "Accessories"];

  return (
    <div className="search-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .search-page {
          background: #0a0a0a;
          min-height: 100vh;
        }

        /* Hero Section */
        .search-hero {
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
          padding: 120px 20px 80px;
          position: relative;
          border-bottom: 1px solid rgba(232, 201, 126, 0.15);
        }

        .search-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 30% 50%, rgba(232, 201, 126, 0.03) 0%, transparent 70%);
          pointer-events: none;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
          z-index: 2;
        }

        .hero-content {
          text-align: left;
          margin-bottom: 48px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #e8c97e;
          margin-bottom: 20px;
        }

        .hero-badge::before {
          content: '';
          width: 28px;
          height: 1.5px;
          background: #e8c97e;
          display: inline-block;
        }

        .hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(48px, 8vw, 80px);
          font-weight: 400;
          color: #ffffff;
          margin-bottom: 16px;
          letter-spacing: 2px;
          line-height: 1;
        }

        .hero-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          color: rgba(255, 255, 255, 0.6);
          max-width: 500px;
          font-weight: 300;
        }

        /* Search Form */
        .search-form {
          max-width: 700px;
          display: flex;
          gap: 16px;
        }

        .search-input-wrapper {
          flex: 1;
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.4);
          font-size: 18px;
          z-index: 2;
        }

        .search-input-wrapper input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 16px 50px 16px 50px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          color: #ffffff;
          outline: none;
          transition: all 0.3s;
        }

        .search-input-wrapper input:focus {
          border-color: #e8c97e;
          background: rgba(255, 255, 255, 0.08);
        }

        .search-input-wrapper input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        .clear-input {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          padding: 4px;
          display: flex;
          transition: color 0.3s;
        }

        .clear-input:hover {
          color: #e8c97e;
        }

        .search-button {
          background: #e8c97e;
          border: none;
          padding: 16px 32px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          letter-spacing: 2px;
          font-weight: 500;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #0a0a0a;
        }

        .search-button:hover {
          background: #d4b86a;
          transform: translateY(-2px);
        }

        /* Search Stats */
        .search-content {
          padding: 48px 0 80px;
        }

        .search-stats {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .stats-info h2 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          font-weight: 400;
          color: #ffffff;
          margin-bottom: 8px;
          letter-spacing: 1px;
        }

        .stats-info p {
          font-family: 'DM Sans', sans-serif;
          color: rgba(255, 255, 255, 0.5);
          font-size: 14px;
        }

        .filter-toggle {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 10px 24px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.7);
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .filter-toggle:hover {
          border-color: #e8c97e;
          color: #e8c97e;
        }

        /* Filters Panel */
        .filters-panel {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 28px;
          margin-bottom: 48px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 32px;
        }

        .filter-group h4 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          font-weight: 400;
          color: #ffffff;
          margin-bottom: 16px;
          letter-spacing: 1px;
        }

        .category-filters {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .category-filter {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 8px 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.6);
          transition: all 0.3s;
        }

        .category-filter:hover,
        .category-filter.active {
          border-color: #e8c97e;
          color: #e8c97e;
          background: rgba(232, 201, 126, 0.05);
        }

        .price-range {
          padding: 0 8px;
        }

        .price-range input {
          width: 100%;
          height: 3px;
          -webkit-appearance: none;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          outline: none;
        }

        .price-range input::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #e8c97e;
          cursor: pointer;
        }

        .price-values {
          display: flex;
          justify-content: space-between;
          margin-top: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
        }

        .sort-select {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 10px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #ffffff;
          cursor: pointer;
        }

        /* Popular Section */
        .popular-section {
          margin-top: 40px;
        }

        .section-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .section-header h3 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 36px;
          font-weight: 400;
          color: #ffffff;
          margin-bottom: 12px;
          letter-spacing: 1px;
        }

        .section-header p {
          font-family: 'DM Sans', sans-serif;
          color: rgba(255, 255, 255, 0.5);
          font-size: 14px;
        }

        .popular-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 24px;
        }

        .popular-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 32px 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
        }

        .popular-card:hover {
          border-color: #e8c97e;
          transform: translateY(-5px);
          background: rgba(232, 201, 126, 0.05);
        }

        .popular-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .popular-card h4 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px;
          font-weight: 400;
          color: #ffffff;
          margin-bottom: 8px;
          letter-spacing: 1px;
        }

        .popular-card span {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          color: #e8c97e;
          letter-spacing: 1px;
        }

        /* Products Grid */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 40px;
          margin-top: 32px;
        }

        .product-card {
          background: rgba(255, 255, 255, 0.02);
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.3s;
          animation: fadeInUp 0.5s ease;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .product-card:hover {
          transform: translateY(-8px);
          border-color: rgba(232, 201, 126, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        .product-image-container {
          position: relative;
          overflow: hidden;
        }

        .product-image {
          position: relative;
          height: 380px;
          overflow: hidden;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s;
        }

        .product-card:hover .product-image img {
          transform: scale(1.05);
        }

        .product-tag {
          position: absolute;
          top: 16px;
          left: 16px;
          padding: 5px 12px;
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 1px;
          text-transform: uppercase;
          font-family: 'DM Sans', sans-serif;
          z-index: 2;
          background: #e8c97e;
          color: #0a0a0a;
        }

        .product-tag.new {
          background: #4a9eff;
          color: #fff;
        }

        .product-tag.sale {
          background: #ff4444;
          color: #fff;
        }

        .product-tag.limited {
          background: #9b59b6;
          color: #fff;
        }

        .product-tag.trending {
          background: #e67e22;
          color: #fff;
        }

        .product-tag.premium {
          background: linear-gradient(135deg, #e8c97e, #d4b86a);
          color: #0a0a0a;
        }

        .wishlist-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(5px);
          border: none;
          border-radius: 50%;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #fff;
          transition: all 0.3s;
          z-index: 2;
        }

        .wishlist-btn:hover {
          background: #ff4444;
          transform: scale(1.1);
        }

        .wishlist-btn.active {
          background: #ff4444;
          color: #fff;
        }

        .quick-actions {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
          transform: translateY(100%);
          transition: transform 0.3s;
        }

        .product-card:hover .quick-actions {
          transform: translateY(0);
        }

        .quick-view {
          width: 100%;
          background: #e8c97e;
          border: none;
          padding: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s;
          color: #0a0a0a;
        }

        .quick-view:hover {
          background: #d4b86a;
        }

        .product-info {
          padding: 12px 15px;
        }

        .product-category {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px;
          color: #e8c97e;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 4px;
        }

        .product-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          font-weight: 400;
          color: #ffffff;
          margin-bottom: 6px;
          letter-spacing: 0.5px;
        }

        .product-description {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 8px;
          line-height: 1.3;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .stars {
          display: flex;
          gap: 3px;
        }

        .reviews {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.4);
        }

        .product-price-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .prices {
          display: flex;
          gap: 10px;
          align-items: baseline;
        }

        .current-price {
          font-family: 'DM Sans', sans-serif;
          font-size: 20px;
          font-weight: 600;
          color: #e8c97e;
        }

        .original-price {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.4);
          text-decoration: line-through;
        }

        .discount-badge {
          background: rgba(255, 68, 68, 0.15);
          color: #ff6666;
          padding: 3px 8px;
          font-size: 10px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
        }

        .add-to-cart-btn {
          width: 100%;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.7);
          padding: 10px;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .add-to-cart-btn:hover {
          border-color: #e8c97e;
          color: #e8c97e;
          background: rgba(232, 201, 126, 0.05);
        }

        /* No Results */
        .no-results {
          text-align: center;
          padding: 80px 20px;
        }

        .no-results-icon {
          font-size: 80px;
          margin-bottom: 24px;
        }

        .no-results h3 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 32px;
          color: #ffffff;
          margin-bottom: 12px;
          letter-spacing: 1px;
        }

        .no-results p {
          font-family: 'DM Sans', sans-serif;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 32px;
        }

        .suggestions p {
          font-size: 14px;
          margin-bottom: 16px;
        }

        .suggestion-tags {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .suggestion-tags button {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 8px 24px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.6);
          transition: all 0.3s;
        }

        .suggestion-tags button:hover {
          border-color: #e8c97e;
          color: #e8c97e;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 42px;
          }

          .search-form {
            flex-direction: column;
          }

          .products-grid {
            grid-template-columns: 1fr;
          }

          .search-stats {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .popular-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      {/* Hero Section */}
      <div className="search-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">Discover Your Style</div>
            <h1 className="hero-title">Find Your Perfect Piece</h1>
            <p className="hero-subtitle">
              Explore our curated collection of premium essentials
            </p>
          </div>
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search for products, categories, styles..."
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                autoFocus
              />
              {localQuery && (
                <button
                  type="button"
                  className="clear-input"
                  onClick={() => setLocalQuery("")}
                >
                  <FaTimes />
                </button>
              )}
            </div>
            <button type="submit" className="search-button">
              <FaSearch /> Search
            </button>
          </form>
        </div>
      </div>

      <div className="search-content">
        <div className="container">
          {/* Search Stats & Filter Toggle */}
          {initialQuery && (
            <div className="search-stats">
              <div className="stats-info">
                <h2>Results for "{initialQuery}"</h2>
                <p>{searchResults.length} products found</p>
              </div>
              <button
                className="filter-toggle"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter /> Filters
              </button>
            </div>
          )}

          {/* Filters Panel */}
          {showFilters && initialQuery && (
            <div className="filters-panel">
              <div className="filter-group">
                <h4>Category</h4>
                <div className="category-filters">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      className={`category-filter ${selectedCategory === cat ? "active" : ""}`}
                      onClick={() => {
                        setSelectedCategory(cat);
                        performSearch(localQuery);
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <h4>Price Range</h4>
                <div className="price-range">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[1]}
                    onChange={(e) => {
                      setPriceRange([0, parseInt(e.target.value)]);
                      performSearch(localQuery);
                    }}
                  />
                  <div className="price-values">
                    <span>$0</span>
                    <span>${priceRange[1]}+</span>
                  </div>
                </div>
              </div>

              <div className="filter-group">
                <h4>Sort By</h4>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    performSearch(localQuery);
                  }}
                  className="sort-select"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          )}

          {/* Popular Searches - Show when no search query */}
          {!initialQuery && (
            <div className="popular-section">
              <div className="section-header">
                <h3>Popular Searches</h3>
                <p>Trending now in the Nivest community</p>
              </div>
              <div className="popular-grid">
                {[
                  "Dress",
                  "Hoodie",
                  "Jacket",
                  "Sneakers",
                  "Shirt",
                  "Bag",
                  "Jeans",
                  "Sweater",
                ].map((tag) => (
                  <button
                    key={tag}
                    className="popular-card"
                    onClick={() => {
                      setLocalQuery(tag);
                      performSearch(tag);
                    }}
                  >
                    <div className="popular-icon">
                      {tag === "Dress" && "👗"}
                      {tag === "Hoodie" && "👕"}
                      {tag === "Jacket" && "🧥"}
                      {tag === "Sneakers" && "👟"}
                      {tag === "Shirt" && "👔"}
                      {tag === "Bag" && "👜"}
                      {tag === "Jeans" && "👖"}
                      {tag === "Sweater" && "🧶"}
                    </div>
                    <h4>{tag}</h4>
                    <span>Shop Now →</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {initialQuery && (
            <>
              {searchResults.length > 0 ? (
                <div className="products-grid">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      className="product-card"
                      onMouseEnter={() => setHoveredProduct(product.id)}
                      onMouseLeave={() => setHoveredProduct(null)}
                    >
                      <div className="product-image-container">
                        <div className="product-image">
                          <img src={product.image} alt={product.name} />
                          {product.tag && (
                            <span
                              className={`product-tag ${product.tag.toLowerCase().replace(/\s/g, "-")}`}
                            >
                              {product.tag}
                            </span>
                          )}
                          <button
                            className={`wishlist-btn ${isInWishlist(product.id) ? "active" : ""}`}
                            onClick={() => addToWishlist(product)}
                          >
                            <FaHeart />
                          </button>
                          {hoveredProduct === product.id && (
                            <div className="quick-actions">
                              <button
                                className="quick-view"
                                onClick={() =>
                                  alert(`Quick view for ${product.name}`)
                                }
                              >
                                Quick View
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="product-info">
                        <div className="product-category">
                          {product.category}
                        </div>
                        <h3 className="product-name">{product.name}</h3>
                        <p className="product-description">
                          {product.description}
                        </p>
                        <div className="product-rating">
                          <div className="stars">
                            {renderStars(product.rating)}
                          </div>
                          <span className="reviews">({product.reviews})</span>
                        </div>
                        <div className="product-price-section">
                          <div className="prices">
                            <span className="current-price">
                              ${product.price}
                            </span>
                            {product.originalPrice && (
                              <span className="original-price">
                                ${product.originalPrice}
                              </span>
                            )}
                          </div>
                          {product.originalPrice && (
                            <span className="discount-badge">
                              {Math.round(
                                ((product.originalPrice - product.price) /
                                  product.originalPrice) *
                                  100,
                              )}
                              % OFF
                            </span>
                          )}
                        </div>
                        <button
                          className="add-to-cart-btn"
                          onClick={() => addToCart(product)}
                        >
                          <FaShoppingBag /> Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <h3>No products found</h3>
                  <p>We couldn't find any products matching "{initialQuery}"</p>
                  <div className="suggestions">
                    <p>Try searching for:</p>
                    <div className="suggestion-tags">
                      {["Dress", "T-shirt", "Jacket", "Sneakers"].map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setLocalQuery(s);
                            performSearch(s);
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
