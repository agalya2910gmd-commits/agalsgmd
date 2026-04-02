
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
  FaShieldAlt,
  FaCreditCard,
  FaEye,
  FaShoppingCart,
  FaGift,
  FaLock,
  FaTag,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useStore();
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const newOrder = {
      id: Date.now(),
      orderNumber: `ORD-${Date.now()}`,
      items: cart.map((item) => ({
        ...item,
        itemTotal: calculateItemTotal(item),
      })),
      subtotal: subtotal,
      shipping: shipping,
      tax: tax,
      total: total,
      totalItems: totalItems,
      orderDate: new Date().toISOString(),
      status: "Confirmed",
    };
    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));

    localStorage.removeItem("cart");

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("cartUpdated"));
    }

    setOrderPlaced(true);
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
      setTimeout(() => {
        navigate("/orders");
      }, 2000);
    }, 3000);
  };

  const handleOrderSingleProduct = () => {
    if (!selectedProduct) {
      alert("Please select a product first!");
      return;
    }

    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const productTotal = calculateItemTotal(selectedProduct);
    const singleShipping = productTotal > 100 ? 0 : 10;
    const singleTax = productTotal * 0.1;
    const singleTotal = productTotal + singleShipping + singleTax;

    const newOrder = {
      id: Date.now(),
      orderNumber: `ORD-${Date.now()}`,
      items: [
        {
          ...selectedProduct,
          itemTotal: productTotal,
        },
      ],
      subtotal: productTotal,
      shipping: singleShipping,
      tax: singleTax,
      total: singleTotal,
      totalItems: selectedProduct.quantity,
      orderDate: new Date().toISOString(),
      status: "Confirmed",
    };
    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));

    removeFromCart(selectedProduct.id, selectedProduct.size);

    setShowNotification(true);
    setSelectedProduct(null);

    setTimeout(() => {
      setShowNotification(false);
      setTimeout(() => {
        navigate("/orders");
      }, 2000);
    }, 3000);
  };

  const handleViewProductDetails = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseProductDetails = () => {
    setSelectedProduct(null);
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

  if (cart.length === 0 && !orderPlaced) {
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
            color: #ff6b35;
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
            background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
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

  if (orderPlaced && cart.length === 0) {
    return (
      <div className="order-success">
        <div className="container">
          <div className="success-icon">
            <FaCheckCircle />
          </div>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your purchase. Your order has been confirmed.</p>
          <div className="order-details-summary">
            <h3>Order Summary</h3>
            <div className="order-info">
              <p>Order ID: #{Date.now()}</p>
              <p>Total Items: {totalItems}</p>
              <p>Order Total: ${total.toFixed(2)}</p>
            </div>
          </div>
          <div className="button-group">
            <Link to="/orders" className="view-orders">
              View My Orders
            </Link>
          </div>
        </div>

        <style jsx>{`
          .order-success {
            background: linear-gradient(135deg, #f0fff4 0%, #ffffff 100%);
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

          .success-icon {
            width: 100px;
            height: 100px;
            margin: 0 auto 24px;
            background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          svg {
            color: #4caf50;
            font-size: 60px;
            margin-bottom: 0;
          }

          h2 {
            font-family: "Playfair Display", serif;
            font-size: 42px;
            font-weight: 600;
            color: #2d2d2d;
            margin-bottom: 16px;
            text-align: center;
          }

          p {
            font-family: "DM Sans", sans-serif;
            font-size: 18px;
            color: #6c6c6c;
            margin-bottom: 32px;
            text-align: center;
          }

          .order-details-summary {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            padding: 28px;
            border-radius: 20px;
            margin: 24px 0;
            text-align: left;
            border: 1px solid rgba(255, 107, 53, 0.2);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          }

          .order-details-summary h3 {
            font-family: "Playfair Display", serif;
            font-size: 24px;
            color: #ff6b35;
            margin-bottom: 16px;
            text-align: left;
          }

          .order-info p {
            margin-bottom: 12px;
            font-size: 16px;
            color: #6c6c6c;
            text-align: left;
          }

          .button-group {
            display: flex;
            gap: 16px;
            justify-content: center;
          }

          .view-orders {
            display: inline-block;
            padding: 16px 28px;
            font-family: "DM Sans", sans-serif;
            font-size: 14px;
            font-weight: 600;
            letter-spacing: 2px;
            text-transform: uppercase;
            text-decoration: none;
            border-radius: 40px;
            transition: all 0.3s;
            background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
            color: #ffffff;
            box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
          }

          .view-orders:hover {
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
        {showNotification && (
          <div className="success-notification">
            <FaCheckCircle className="notification-icon" />
            <div className="notification-content">
              <h4>Order Placed Successfully!</h4>
              <p>
                Your order has been confirmed. Thank you for shopping with us!
              </p>
            </div>
          </div>
        )}

        {selectedProduct && (
          <div className="modal-overlay" onClick={handleCloseProductDetails}>
            <div
              className="product-details-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-modal"
                onClick={handleCloseProductDetails}
              >
                ×
              </button>
              <div className="modal-content">
                <div className="modal-image">
                  <img src={selectedProduct.image} alt={selectedProduct.name} />
                </div>
                <div className="modal-info">
                  <h2>{selectedProduct.name}</h2>
                  <p className="modal-category">{selectedProduct.category}</p>
                  {selectedProduct.size && (
                    <p className="modal-size">Size: {selectedProduct.size}</p>
                  )}
                  <div className="modal-price">
                    <span className="current-price">
                      {formatPrice(selectedProduct.price)}
                    </span>
                    {selectedProduct.originalPrice && (
                      <span className="original-price">
                        {formatPrice(selectedProduct.originalPrice)}
                      </span>
                    )}
                  </div>
                  <div className="modal-quantity">
                    <span>Quantity: {selectedProduct.quantity}</span>
                  </div>
                  <div className="modal-total">
                    <strong>Item Total: </strong>
                    <span>
                      ${calculateItemTotal(selectedProduct).toFixed(2)}
                    </span>
                  </div>

                  <button
                    className="order-now-btn"
                    onClick={handleOrderSingleProduct}
                  >
                    <FaShoppingCart /> Order Now • $
                    {calculateItemTotal(selectedProduct).toFixed(2)}
                  </button>

                  <p className="order-note">
                    This will place an order only for this product and remove it
                    from your cart.
                  </p>
                </div>
              </div>
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
                      className="quick-order-btn"
                      onClick={() => handleViewProductDetails(item)}
                    >
                      <FaEye /> Quick Order
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

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }

        .product-details-modal {
          background: #ffffff;
          border-radius: 30px;
          max-width: 900px;
          width: 90%;
          max-height: 85vh;
          overflow-y: auto;
          position: relative;
          animation: modalSlideIn 0.3s ease-out;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        @keyframes modalSlideIn {
          from {
            transform: translateY(-50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .close-modal {
          position: absolute;
          top: 20px;
          right: 25px;
          background: rgba(255, 107, 53, 0.1);
          border: none;
          font-size: 28px;
          cursor: pointer;
          color: #161515;
          z-index: 1;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }

        .close-modal:hover {
          background: #ff6b35;
          color: white;
          transform: rotate(90deg);
        }

        .modal-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          padding: 32px;
        }

        .modal-image img {
          width: 100%;
          height: auto;
          border-radius: 20px;
          object-fit: cover;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .modal-info {
          text-align: left;
        }

        .modal-info h2 {
          font-family: "Playfair Display", serif;
          font-size: 28px;
          font-weight: 600;
          color: #2d2d2d;
          margin-bottom: 12px;
          text-align: left;
        }

        .modal-category {
          font-family: "DM Sans", sans-serif;
          font-size: 13px;
          color: #ff6b35;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 12px;
          text-align: left;
          font-weight: 600;
        }

        .modal-size {
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          color: #6c6c6c;
          margin-bottom: 12px;
          text-align: left;
        }

        .modal-price {
          margin-bottom: 20px;
          text-align: left;
        }

        .current-price {
          font-size: 28px;
          font-weight: 700;
          color: #ff6b35;
        }

        .original-price {
          font-size: 18px;
          color: #999999;
          text-decoration: line-through;
          margin-left: 12px;
        }

        .modal-quantity {
          margin-bottom: 20px;
          font-size: 16px;
          color: #6c6c6c;
          text-align: left;
        }

        .modal-total {
          font-size: 20px;
          color: #2d2d2d;
          padding-top: 20px;
          border-top: 1px solid #f0f0f0;
          margin-bottom: 24px;
          text-align: left;
        }

        .order-now-btn {
          width: 100%;
          background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
          border: none;
          padding: 14px;
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 40px;
          margin: 16px 0;
          transition: all 0.3s;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
        }

        .order-now-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
        }

        .order-note {
          font-size: 12px;
          color: #999999;
          text-align: center;
          margin-top: 12px;
        }

        /* Success Notification */
        .success-notification {
          position: fixed;
          top: 100px;
          right: 20px;
          background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
          color: #ffffff;
          padding: 16px 24px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 10px 25px -5px rgba(76, 175, 80, 0.3);
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
          color: #ff6b35;
          text-decoration: none;
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 24px;
          transition: all 0.3s;
          text-align: left;
        }

        .back-link:hover {
          color: #ff8c5a;
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
          color: #ff6b35;
          margin-bottom: 8px;
          text-align: left;
          font-weight: 500;
        }

        .item-price {
          font-family: "DM Sans", sans-serif;
          font-size: 18px;
          color: #ff6b35;
          font-weight: 700;
          margin-bottom: 16px;
          text-align: left;
        }

        .item-actions {
          display: flex;
          gap: 16px;
          align-items: center;
          flex-wrap: wrap;
        }

        .item-quantity {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #ffffff;
          border: 1px solid rgba(255, 107, 53, 0.2);
          border-radius: 40px;
          padding: 4px 12px;
        }

        .item-quantity button {
          background: none;
          border: none;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #ff6b35;
          border-radius: 50%;
          transition: all 0.3s;
        }

        .item-quantity button:hover {
          background: rgba(255, 107, 53, 0.1);
          color: #ff8c5a;
        }

        .item-quantity span {
          font-family: "DM Sans", sans-serif;
          color: #2d2d2d;
          min-width: 30px;
          text-align: center;
          font-size: 14px;
          font-weight: 500;
        }

        .remove-btn,
        .quick-order-btn {
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 40px;
          font-family: "DM Sans", sans-serif;
          font-weight: 500;
        }

        .remove-btn {
          color: #999999;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .remove-btn:hover {
          color: #ff4444;
          border-color: #ff4444;
          background: #fff5f5;
        }

        .quick-order-btn {
          color: #ff6b35;
          background: #ffffff;
          border: 1px solid rgba(255, 107, 53, 0.2);
        }

        .quick-order-btn:hover {
          background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
          color: #ffffff;
          border-color: transparent;
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
          color: #ff6b35;
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
          color: #ff6b35;
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
          color: #ff6b35;
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
          background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
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
          color: #ff6b35;
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

          .modal-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default CartPage;
