
import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { FaHeart, FaShoppingBag, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, addToCart } = useStore();
  const [message, setMessage] = useState("");

  const handleAddToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
    setMessage(`${product.name} has been moved to cart!`);
    setTimeout(() => setMessage(""), 3000);
  };

  if (wishlist.length === 0) {
    return (
      <div className="empty-wishlist">
        <div className="container">
          <FaHeart size={64} />
          <h2>Your wishlist is empty</h2>
          <p>Save your favorite items here</p>
          <Link to="/shop" className="shop-now-btn">
            Explore Products
          </Link>
        </div>

        <style jsx>{`
          .empty-wishlist {
            background: linear-gradient(135deg, #4b4b4d, #565858, #6f7072);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding-top: 100px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px;
          }
          svg {
            color: #d4a853;
            margin-bottom: 24px;
          }
          h2 {
            font-family: "Playfair Display", serif;
            font-size: 32px;
            font-weight: 400;
            color: #f5f0eb;
            margin-bottom: 12px;
          }
          p {
            font-family: "DM Sans", sans-serif;
            color: #888;
            margin-bottom: 32px;
          }
          .shop-now-btn {
            display: inline-block;
            background: #d4a853;
            color: #0a0a0a;
            padding: 14px 36px;
            font-family: "DM Sans", sans-serif;
            font-size: 12px;
            letter-spacing: 2px;
            text-transform: uppercase;
            text-decoration: none;
            border-radius: 8px;
            transition: all 0.3s;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        {message && <div className="success-message">{message}</div>}

        <div className="wishlist-header">
          <h1>My Wishlist</h1>
        </div>

        <div className="wishlist-grid">
          {wishlist.map((product) => (
            <div key={product.id} className="wishlist-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                <button
                  className="remove-wishlist"
                  onClick={() => {
                    console.log("Delete clicked for product:", product.id);
                    removeFromWishlist(product.id);
                  }}
                >
                  <FaTrash />
                </button>
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-desc">{product.description}</p>
                <div className="product-price">${product.price}</div>
                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  <FaShoppingBag /> Move to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .wishlist-page {
          background: linear-gradient(135deg, #f3f3fa);
          min-height: 100vh;
          padding: 120px 0 80px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .success-message {
          background-color: #4caf50;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: center;
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .wishlist-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .wishlist-header h1 {
          font-family: "Playfair Display", serif;
          font-size: 42px;
          font-weight: 400;
          color: #070707;
          margin-bottom: 8px;
        }

        /* ✅ More columns, smaller cards */
        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 16px;
        }

        .wishlist-card {
          background: #0f0f0f;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid #1a1a1a;
          transition: all 0.3s;
        }

        .wishlist-card:hover {
          transform: translateY(-3px);
          border-color: #2a2a2a;
        }

        /* ✅ Shorter image height */
        .product-image {
          position: relative;
          height: 160px;
          overflow: hidden;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-wishlist {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(0, 0, 0, 0.6);
          border: none;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #fff;
          transition: all 0.3s;
          backdrop-filter: blur(5px);
          z-index: 10;
          font-size: 11px;
        }

        .remove-wishlist:hover {
          background: #ff4444;
          transform: scale(1.05);
        }

        /* ✅ Tighter padding and smaller text */
        .product-info {
          padding: 12px;
        }

        .product-info h3 {
          font-family: "Playfair Display", serif;
          font-size: 13px;
          font-weight: 400;
          color: #f5f0eb;
          margin-bottom: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .product-desc {
          font-family: "DM Sans", sans-serif;
          font-size: 11px;
          color: #666;
          margin-bottom: 8px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-price {
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #d4a853;
          margin-bottom: 10px;
        }

        .add-to-cart-btn {
          width: 100%;
          background: none;
          border: 1px solid #2a2a2a;
          color: #aaa;
          padding: 7px 6px;
          font-size: 10px;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          font-family: "DM Sans", sans-serif;
          transition: all 0.3s;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .add-to-cart-btn:hover {
          border-color: #d4a853;
          color: #d4a853;
        }
      `}</style>
    </div>
  );
};

export default WishlistPage;
