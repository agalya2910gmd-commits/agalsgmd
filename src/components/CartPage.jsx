import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaShoppingBag,
  FaArrowLeft,
  FaCheckCircle,
  FaTruck,
  FaLock,
  FaEye,
  FaShoppingCart,
  FaTag,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const CartPage = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    wishlist,
    addToWishlist,
    removeFromWishlist,
  } = useStore();
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);

  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Updated: Navigate to checkout page instead of placing order directly
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/checkout");
  };

  const calculateItemTotal = (item) => {
    if (typeof item.price === "number") {
      return item.price * item.quantity;
    } else {
      return parseFloat(item.price.replace("$", "")) * item.quantity;
    }
  };

  const formatPrice = (price) => {
    if (typeof price === "number") {
      return `$${price.toFixed(2)}`;
    }
    return price;
  };

  const isInWishlist = (productId, size) => {
    return wishlist.some((item) => item.id === productId && item.size === size);
  };

  const handleWishlistToggle = (item) => {
    if (isInWishlist(item.id, item.size)) {
      removeFromWishlist(item.id, item.size);
      setWishlistNotificationMessage(`${item.name} removed from wishlist`);
      setShowWishlistNotification(true);
      setTimeout(() => setShowWishlistNotification(false), 2000);
    } else {
      addToWishlist({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        size: item.size,
        category: item.category,
      });
      setWishlistNotificationMessage(`${item.name} added to wishlist`);
      setShowWishlistNotification(true);
      setTimeout(() => setShowWishlistNotification(false), 2000);
    }
  };

  const [showWishlistNotification, setShowWishlistNotification] =
    useState(false);
  const [wishlistNotificationMessage, setWishlistNotificationMessage] =
    useState("");

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <div className="container">
          <div className="empty-cart-icon">
            <FaShoppingBag />
          </div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet</p>
          <Link to="/products" className="shop-now-btn">
            Start Shopping
          </Link>
        </div>

        <style jsx>{`
          .empty-cart {
            background: linear-gradient(135deg, #fff5f0 0%, #ffffff 100%);
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
            text-align: center;
          }

          .empty-cart-icon {
            width: 120px;
            height: 120px;
            margin: 0 auto 24px;
            background: linear-gradient(135deg, #ffe6d5 0%, #ffd4b3 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
          }

          svg {
            color: #e6d160;
            font-size: 60px;
            margin-bottom: 0;
          }

          h2 {
            font-family: "Playfair Display", serif;
            font-size: 48px;
            font-weight: 600;
            color: #2d2d2d;
            margin-bottom: 16px;
            text-align: center;
            letter-spacing: -0.5px;
          }

          p {
            font-family: "DM Sans", sans-serif;
            font-size: 18px;
            color: #6c6c6c;
            margin-bottom: 32px;
            text-align: center;
          }

          .shop-now-btn {
            display: inline-block;
            background: linear-gradient(135deg, #e6d160 0%, #e6d160 100%);
            color: #ffffff;
            padding: 16px 42px;
            font-family: "DM Sans", sans-serif;
            font-size: 14px;
            font-weight: 600;
            letter-spacing: 2px;
            text-transform: uppercase;
            text-decoration: none;
            border-radius: 40px;
            transition: all 0.3s;
            box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
          }

          .shop-now-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        {showWishlistNotification && (
          <div className="wishlist-notification">
            <FaHeart className="notification-icon" />
            <div className="notification-content">
              <p>{wishlistNotificationMessage}</p>
            </div>
          </div>
        )}

        <div className="cart-header">
          <Link to="/products" className="back-link">
            <FaArrowLeft /> Continue Shopping
          </Link>
          <h1>Shopping Cart</h1>
        </div>

        <div className="cart-layout">
          {/* Left Side - Cart Items */}
          <div className="cart-items-section">
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.size || "default"}`}
                className="cart-item"
              >
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>

                <div className="item-details">
                  <h3>{item.name}</h3>
                  {item.size && <p className="item-size">Size: {item.size}</p>}
                  <p className="item-price">{formatPrice(item.price)}</p>

                  <div className="item-actions">
                    <div className="item-quantity">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.size, item.quantity - 1)
                        }
                      >
                        <FaMinus />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.size, item.quantity + 1)
                        }
                      >
                        <FaPlus />
                      </button>
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id, item.size)}
                    >
                      <FaTrash /> Remove
                    </button>

                    <button
                      className={`wishlist-btn ${isInWishlist(item.id, item.size) ? "in-wishlist" : ""}`}
                      onClick={() => handleWishlistToggle(item)}
                    >
                      {isInWishlist(item.id, item.size) ? (
                        <>
                          <FaHeart /> Saved
                        </>
                      ) : (
                        <>
                          <FaRegHeart /> Save
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="item-total">
                  <span className="total-label">Total</span>
                  <span className="total-amount">
                    ${calculateItemTotal(item).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side - Order Summary */}
          <div className="cart-summary">
            <h3>Order Summary</h3>

            <div className="summary-items-list">
              {cart.map((item) => (
                <div key={item.id} className="summary-item-row">
                  <span className="item-name">
                    {item.name} {item.size && `(${item.size})`} ×{" "}
                    {item.quantity}
                  </span>
                  <span className="item-price-summary">
                    ${calculateItemTotal(item).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-calculations">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="summary-row">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>

            <div className="order-benefits">
              <div className="benefit">
                <FaTruck />
                <span>Free shipping on orders over $100</span>
              </div>
              <div className="benefit">
                <FaLock />
                <span>Secure checkout</span>
              </div>
              <div className="benefit">
                <FaTag />
                <span>30-day return policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cart-page {
          background: linear-gradient(135deg, #fffaf7 0%, #ffffff 100%);
          min-height: 100vh;
          padding: 120px 0 80px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Wishlist Notification */
        .wishlist-notification {
          position: fixed;
          top: 100px;
          right: 20px;
          background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%);
          color: #ffffff;
          padding: 16px 24px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 10px 25px -5px rgba(255, 82, 82, 0.3);
          z-index: 1000;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .notification-icon {
          font-size: 20px;
        }

        .notification-content h4 {
          font-size: 14px;
          margin: 0 0 4px 0;
          text-align: left;
        }

        .notification-content p {
          font-size: 12px;
          margin: 0;
          text-align: left;
        }

        .cart-header {
          margin-bottom: 48px;
          text-align: left;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #e6d160;
          text-decoration: none;
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 24px;
          transition: all 0.3s;
          text-align: left;
        }

        .back-link:hover {
          color: #e6d160;
          transform: translateX(-5px);
        }

        .cart-header h1 {
          font-family: "Playfair Display", serif;
          font-size: 56px;
          font-weight: 700;
          color: #2d2d2d;
          margin-bottom: 8px;
          text-align: left;
          letter-spacing: -1px;
        }

        .cart-header p {
          font-family: "DM Sans", sans-serif;
          font-size: 18px;
          color: #6c6c6c;
          text-align: left;
        }

        .cart-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 48px;
          align-items: start;
        }

        /* Cart Items Section */
        .cart-items-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .cart-item {
          display: flex;
          gap: 24px;
          padding: 24px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          transition: all 0.3s;
          border: 1px solid rgba(255, 107, 53, 0.1);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
        }

        .cart-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px -10px rgba(255, 107, 53, 0.15);
          border-color: rgba(255, 107, 53, 0.2);
        }

        .item-image {
          width: 120px;
          height: 120px;
          border-radius: 20px;
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-details {
          flex: 1;
          text-align: left;
        }

        .item-details h3 {
          font-family: "Playfair Display", serif;
          font-size: 20px;
          font-weight: 600;
          color: #2d2d2d;
          margin-bottom: 6px;
          text-align: left;
        }

        .item-size {
          font-family: "DM Sans", sans-serif;
          font-size: 13px;
          color: #e6d160;
          margin-bottom: 8px;
          text-align: left;
          font-weight: 500;
        }

        .item-price {
          font-family: "DM Sans", sans-serif;
          font-size: 18px;
          color: #e6d160;
          font-weight: 700;
          margin-bottom: 16px;
          text-align: left;
        }

        .item-actions {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: nowrap;
        }

        .item-quantity {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          border: 1px solid rgba(255, 107, 53, 0.2);
          border-radius: 40px;
          padding: 4px 8px;
          flex-shrink: 0;
        }

        .item-quantity button {
          background: none;
          border: none;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #e6d160;
          border-radius: 50%;
          transition: all 0.3s;
        }

        .item-quantity button:hover {
          background: rgba(255, 107, 53, 0.1);
          color: #e6d160;
        }

        .item-quantity span {
          font-family: "DM Sans", sans-serif;
          color: #2d2d2d;
          min-width: 24px;
          text-align: center;
          font-size: 14px;
          font-weight: 500;
        }

        .remove-btn,
        .wishlist-btn {
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          border-radius: 40px;
          font-family: "DM Sans", sans-serif;
          font-weight: 500;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .remove-btn {
          color: #999999;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .remove-btn:hover {
          color: #e6d160;
          border-color: #e6d160;
          background: #fff5f5;
        }

        .wishlist-btn {
          color: #e6d160;
          background: #ffffff;
          border: 1px solid rgba(255, 107, 53, 0.2);
        }

        .wishlist-btn:hover {
          background: linear-gradient(135deg, #e6d160 0%, #e6d160 100%);
          color: #ffffff;
          border-color: transparent;
          transform: translateY(-2px);
        }

        .wishlist-btn.in-wishlist {
          background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%);
          color: #ffffff;
          border-color: transparent;
        }

        .wishlist-btn.in-wishlist:hover {
          background: linear-gradient(135deg, #ff5252 0%, #ff3838 100%);
          transform: translateY(-2px);
        }

        .item-total {
          text-align: right;
          min-width: 100px;
        }

        .total-label {
          display: block;
          font-family: "DM Sans", sans-serif;
          font-size: 12px;
          color: #999999;
          margin-bottom: 4px;
          text-align: right;
        }

        .total-amount {
          display: block;
          font-family: "DM Sans", sans-serif;
          font-weight: 700;
          color: #e6d160;
          font-size: 20px;
          text-align: right;
        }

        /* Cart Summary */
        .cart-summary {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 28px;
          border-radius: 24px;
          position: sticky;
          top: 100px;
          border: 1px solid rgba(255, 107, 53, 0.1);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
        }

        .cart-summary h3 {
          font-family: "Playfair Display", serif;
          font-size: 24px;
          font-weight: 600;
          color: #e6d160;
          margin-bottom: 24px;
          text-align: left;
        }

        .summary-items-list {
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(255, 107, 53, 0.1);
        }

        .summary-item-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          color: #6c6c6c;
          text-align: left;
        }

        .item-name {
          flex: 1;
          text-align: left;
        }

        .item-price-summary {
          font-weight: 500;
          color: #e6d160;
          text-align: right;
        }

        .summary-calculations {
          margin-bottom: 24px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          color: #6c6c6c;
          text-align: left;
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          padding: 16px 0;
          font-family: "DM Sans", sans-serif;
          font-weight: 700;
          font-size: 22px;
          color: #2d2d2d;
          border-top: 2px solid rgba(255, 107, 53, 0.2);
          margin-top: 8px;
          text-align: left;
        }

        .checkout-btn {
          width: 100%;
          background: linear-gradient(135deg, #e6d160 0%, #e6d160 100%);
          border: none;
          padding: 16px;
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 40px;
          margin: 24px 0;
          transition: all 0.3s;
          color: #ffffff;
          box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
        }

        .checkout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
        }

        .order-benefits {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 107, 53, 0.1);
        }

        .benefit {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: "DM Sans", sans-serif;
          font-size: 12px;
          color: #6c6c6c;
          text-align: left;
        }

        .benefit svg {
          color: #e6d160;
          font-size: 14px;
        }

        @media (max-width: 968px) {
          .cart-layout {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .cart-item {
            flex-direction: column;
          }

          .item-image {
            width: 100%;
            height: 200px;
          }

          .item-total {
            text-align: left;
            margin-top: 12px;
          }

          .total-label,
          .total-amount {
            text-align: left;
          }

          .item-actions {
            flex-wrap: wrap;
          }

          .cart-header h1 {
            font-size: 42px;
          }
        }

        @media (max-width: 768px) {
          .item-actions {
            flex-wrap: wrap;
          }

          .remove-btn,
          .wishlist-btn {
            white-space: nowrap;
          }
        }
      `}</style>
    </div>
  );
};

export default CartPage;
