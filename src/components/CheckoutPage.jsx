// src/components/CheckoutPage.jsx
import React, { useState, useEffect } from "react";
import { useStore } from "../context/StoreContext";
import { Link, useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import {
  FaArrowLeft,
  FaLock,
  FaTruck,
  FaTag,
  FaCheckCircle,
  FaCreditCard,
  FaPaypal,
  FaApplePay,
  FaGooglePay,
  FaTrash,
  FaPlus,
  FaMinus,
} from "react-icons/fa";

// ============================================
// EMAILJS CONFIGURATION - YOUR ACTUAL CREDENTIALS
// ============================================
const EMAILJS_CONFIG = {
  SERVICE_ID: "service_mwjv4vc",
  TEMPLATE_ID: "template_vxpz22r",
  PUBLIC_KEY: "CnGqkQdJYAqYv2Cz6",
};

const STORE_OWNER_EMAIL = "agalyasrimurugan2000@gmail.com";
// ============================================

const CheckoutPage = () => {
  const { cart, getCartTotal, clearCart, removeFromCart, updateQuantity } =
    useStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    promoCode: "",
    receiveSmsUpdates: false,
  });

  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [emailStatus, setEmailStatus] = useState(null);
  const [placedOrder, setPlacedOrder] = useState(null);

  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.1;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shipping + tax - discount;

  useEffect(() => {
    if (cart.length === 0 && !orderPlaced) {
      navigate("/cart");
    }
  }, [cart, navigate, orderPlaced]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleApplyPromo = () => {
    if (formData.promoCode.trim().toUpperCase() === "SAVE10") {
      setPromoApplied(true);
      setPromoDiscount(subtotal * 0.1);
      setPromoError("");
    } else if (formData.promoCode.trim().toUpperCase() === "FREESHIP") {
      setPromoApplied(true);
      setPromoDiscount(0);
      setPromoError("");
    } else if (formData.promoCode.trim() !== "") {
      setPromoError("Invalid promo code");
      setPromoApplied(false);
      setPromoDiscount(0);
    } else {
      setPromoError("Please enter a promo code");
    }
  };

  const getEstimatedDeliveryDate = () => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);
    return deliveryDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const sendConfirmationEmails = async (orderData) => {
    try {
      const itemsHtml = orderData.items
        .map(
          (item) => `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 12px; text-align: left;">${item.name}${item.size ? ` (${item.size})` : ""}${item.color ? `, ${item.color}` : ""}</td>
              <td style="padding: 12px; text-align: center;">${item.quantity}</td>
              <td style="padding: 12px; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          `,
        )
        .join("");

      const itemsText = orderData.items
        .map(
          (item) =>
            `${item.name}${item.size ? ` (${item.size})` : ""}${item.color ? `, ${item.color}` : ""} - Quantity: ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`,
        )
        .join("\n");

      const baseParams = {
        order_number: orderData.orderNumber,
        order_date: new Date(orderData.orderDate).toLocaleString(),
        total_amount: `$${orderData.total.toFixed(2)}`,
        subtotal: `$${orderData.subtotal.toFixed(2)}`,
        shipping:
          orderData.shipping === 0
            ? "Free"
            : `$${orderData.shipping.toFixed(2)}`,
        tax: `$${orderData.tax.toFixed(2)}`,
        discount:
          orderData.discount > 0 ? `-$${orderData.discount.toFixed(2)}` : "$0",
        items: itemsText,
        items_html: itemsHtml,
        estimated_delivery: getEstimatedDeliveryDate(),
        payment_method: orderData.paymentMethod.toUpperCase(),
        customer_name: orderData.customerInfo.fullName,
        customer_email: orderData.customerInfo.email,
        customer_phone: orderData.customerInfo.phone,
        receive_sms: orderData.customerInfo.receiveSmsUpdates ? "Yes" : "No",
      };

      const customerParams = {
        ...baseParams,
        to_name: orderData.customerInfo.fullName,
        to_email: orderData.customerInfo.email,
      };
      const ownerParams = {
        ...baseParams,
        to_name: "Store Owner",
        to_email: STORE_OWNER_EMAIL,
      };

      await Promise.all([
        emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_ID,
          customerParams,
          EMAILJS_CONFIG.PUBLIC_KEY,
        ),
        emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_ID,
          ownerParams,
          EMAILJS_CONFIG.PUBLIC_KEY,
        ),
      ]);
      return true;
    } catch (error) {
      console.error("Failed to send emails:", error);
      return false;
    }
  };

  const handlePlaceOrder = async () => {
    if (!formData.fullName.trim()) {
      alert("Please enter your full name");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }
    if (!formData.phone.trim()) {
      alert("Please enter your phone number");
      return;
    }
    if (!formData.address.trim()) {
      alert("Please enter your address");
      return;
    }
    if (!formData.city.trim()) {
      alert("Please enter your city");
      return;
    }
    if (!formData.zipCode.trim()) {
      alert("Please enter your zip code");
      return;
    }

    setIsProcessing(true);
    setEmailStatus("sending");

    const orderNumber = `ORD-${Date.now()}`;
    const newOrder = {
      id: Date.now(),
      orderNumber: orderNumber,
      customerInfo: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
        receiveSmsUpdates: formData.receiveSmsUpdates,
      },
      items: cart.map((item) => ({
        ...item,
        itemTotal: item.price * item.quantity,
      })),
      subtotal: subtotal,
      shipping: shipping,
      tax: tax,
      discount: discount,
      total: total,
      totalItems: cart.reduce((sum, item) => sum + item.quantity, 0),
      orderDate: new Date().toISOString(),
      status: "Confirmed",
      paymentMethod: paymentMethod,
      promoApplied: promoApplied ? formData.promoCode : null,
    };

    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));

    const emailsSent = await sendConfirmationEmails(newOrder);
    setEmailStatus(emailsSent ? "sent" : "error");
    setPlacedOrder(newOrder);
    clearCart();
    setOrderPlaced(true);

    setTimeout(() => {
      navigate("/order-confirmation");
    }, 2000);
  };

  if (orderPlaced) {
    return (
      <div className="order-success-page">
        <div className="success-container">
          <div className="success-icon-wrapper">
            <FaCheckCircle className="success-icon" />
          </div>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your purchase. Your order has been confirmed.</p>

          {emailStatus === "sending" && (
            <div className="email-status sending">
              <div className="email-spinner"></div>
              <span>Sending confirmation email to {formData.email}...</span>
            </div>
          )}
          {emailStatus === "sent" && (
            <div className="email-status success">
              <FaCheckCircle className="status-icon" />
              <span>✓ Order confirmation sent to {formData.email}</span>
            </div>
          )}
          {emailStatus === "error" && (
            <div className="email-status error">
              <span>⚠️ Order placed but email notification failed.</span>
            </div>
          )}

          <div className="order-summary-card">
            <h3>Order Summary</h3>
            <div className="order-info-row">
              <span>Order Number:</span>
              <strong>{placedOrder?.orderNumber}</strong>
            </div>
            <div className="order-info-row">
              <span>Total Items:</span>
              <strong>
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </strong>
            </div>
            <div className="order-info-row">
              <span>Order Total:</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
            <div className="order-info-row">
              <span>Delivery to:</span>
              <strong>{formData.fullName}</strong>
            </div>
          </div>

          <div className="button-group-checkout">
            <Link to="/order-confirmation" className="view-orders-btn">
              View Order Details
            </Link>
            <Link to="/shop" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        </div>

        <style jsx>{`
          .order-success-page {
            background: linear-gradient(135deg, #f0fff4 0%, #ffffff 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 100px 24px;
          }
          .success-container {
            max-width: 550px;
            width: 100%;
            background: white;
            border-radius: 32px;
            padding: 48px 40px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          }
          .success-icon-wrapper {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
          }
          .success-icon {
            font-size: 48px;
            color: #4caf50;
          }
          h2 {
            font-size: 32px;
            color: #2d2d2d;
            margin-bottom: 12px;
          }
          p {
            color: #6c6c6c;
            margin-bottom: 24px;
          }
          .email-status {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            padding: 12px 20px;
            border-radius: 12px;
            margin-bottom: 24px;
            font-size: 14px;
          }
          .email-status.sending {
            background: #fff3e0;
            color: #ff9800;
          }
          .email-status.success {
            background: #e8f5e9;
            color: #4caf50;
          }
          .email-status.error {
            background: #ffebee;
            color: #f44336;
          }
          .email-spinner {
            width: 20px;
            height: 20px;
            border: 2px solid #ff9800;
            border-top-color: transparent;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
          .order-summary-card {
            background: #f8f9fa;
            border-radius: 20px;
            padding: 20px;
            margin-bottom: 32px;
            text-align: left;
          }
          .order-summary-card h3 {
            font-size: 18px;
            color: #e6d160;
            margin-bottom: 16px;
          }
          .order-info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            font-size: 14px;
          }
          .order-info-row span {
            color: #6c6c6c;
          }
          .order-info-row strong {
            color: #2d2d2d;
          }
          .button-group-checkout {
            display: flex;
            gap: 16px;
            justify-content: center;
          }
          .view-orders-btn,
          .continue-shopping-btn {
            padding: 12px 24px;
            font-weight: 600;
            text-decoration: none;
            border-radius: 40px;
            transition: all 0.3s;
          }
          .view-orders-btn {
            background: #e6d160;
            color: white;
          }
          .continue-shopping-btn {
            background: transparent;
            color: #e6d160;
            border: 1px solid #e6d160;
          }
          .view-orders-btn:hover,
          .continue-shopping-btn:hover {
            transform: translateY(-2px);
          }
          @media (max-width: 500px) {
            .success-container {
              padding: 32px 24px;
            }
            h2 {
              font-size: 24px;
            }
          }
        `}</style>
      </div>
    );
  }

  if (cart.length === 0) return null;

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Header */}
        <div className="checkout-header">
          <Link to="/cart" className="back-link">
            <FaArrowLeft /> Back to Cart
          </Link>
          <div className="checkout-steps">
            <span className="step completed">Cart</span>
            <span className="step-separator">→</span>
            <span className="step active">Checkout</span>
            <span className="step-separator">→</span>
            <span className="step">Confirmation</span>
          </div>
        </div>

        <div className="checkout-grid">
          {/* Left Column - Checkout Form */}
          <div className="checkout-form">
            <div className="form-section">
              <h3 className="section-title">Contact Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(555) 555-1234"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">Shipping Address</h3>
              <div className="form-group">
                <label>Street Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Main Street"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="New York"
                  />
                </div>
                <div className="form-group">
                  <label>Zip Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="10001"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">Promo Code</h3>
              <div className="promo-wrapper">
                <input
                  type="text"
                  name="promoCode"
                  value={formData.promoCode}
                  onChange={handleInputChange}
                  placeholder="SAVE10 or FREESHIP"
                  disabled={promoApplied}
                />
                <button onClick={handleApplyPromo} disabled={promoApplied}>
                  Apply
                </button>
              </div>
              {promoError && <span className="promo-error">{promoError}</span>}
              {promoApplied && (
                <span className="promo-success">
                  ✓ Promo applied! You saved ${discount.toFixed(2)}
                </span>
              )}
            </div>

            <div className="form-section">
              <h3 className="section-title">Payment Method</h3>
              <div className="payment-grid">
                <button
                  className={`payment-btn ${paymentMethod === "card" ? "active" : ""}`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <FaCreditCard /> Credit Card
                </button>
                <button
                  className={`payment-btn ${paymentMethod === "paypal" ? "active" : ""}`}
                  onClick={() => setPaymentMethod("paypal")}
                >
                  <FaPaypal /> PayPal
                </button>
                <button
                  className={`payment-btn ${paymentMethod === "apple" ? "active" : ""}`}
                  onClick={() => setPaymentMethod("apple")}
                >
                  <FaApplePay /> Apple Pay
                </button>
                <button
                  className={`payment-btn ${paymentMethod === "google" ? "active" : ""}`}
                  onClick={() => setPaymentMethod("google")}
                >
                  <FaGooglePay /> Google Pay
                </button>
              </div>
            </div>

            <div className="form-section">
              <label className="checkbox">
                <input
                  type="checkbox"
                  name="receiveSmsUpdates"
                  checked={formData.receiveSmsUpdates}
                  onChange={handleInputChange}
                />
                <span>Send me SMS updates about my order</span>
              </label>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="order-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>

              <div className="cart-items">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="cart-item">
                    <img
                      src={item.image || "https://via.placeholder.com/60"}
                      alt={item.name}
                      className="item-image"
                    />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      {item.size && (
                        <p className="item-variant">Size: {item.size}</p>
                      )}
                      {item.color && (
                        <p className="item-variant">Color: {item.color}</p>
                      )}
                      <div className="item-actions">
                        <span className="item-price">
                          ${item.price.toFixed(2)}
                        </span>
                        <span className="item-quantity">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <div className="item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-totals">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="total-row">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {promoApplied && (
                  <div className="total-row discount">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="total-row grand-total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                className="place-order-btn"
                onClick={handlePlaceOrder}
                disabled={isProcessing}
              >
                {isProcessing
                  ? "Processing..."
                  : `Place Order • $${total.toFixed(2)}`}
              </button>

              <div className="secure-badge">
                <FaLock /> Secure Checkout
              </div>

              <div className="guarantee">
                <FaTruck /> Free shipping on orders over $100
                <FaTag /> 30-day return policy
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .checkout-page {
          background: #f5f5f5;
          min-height: 100vh;
          padding: 100px 0 60px;
        }
        .checkout-container {
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .checkout-header {
          margin-bottom: 32px;
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #e6d160;
          text-decoration: none;
          font-weight: 500;
          margin-bottom: 20px;
          transition: all 0.3s;
        }
        .back-link:hover {
          transform: translateX(-5px);
        }
        .checkout-steps {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
        }
        .step {
          color: #ccc;
        }
        .step.completed {
          color: #4caf50;
        }
        .step.active {
          color: #e6d160;
          font-weight: 600;
        }
        .step-separator {
          color: #ddd;
        }
        .checkout-grid {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 32px;
        }
        .checkout-form {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .form-section {
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid #eee;
        }
        .form-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #2d2d2d;
          margin-bottom: 20px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .form-group {
          margin-bottom: 16px;
        }
        .form-group label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #555;
          margin-bottom: 6px;
        }
        .form-group input {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #e0e0e0;
          border-radius: 10px;
          font-size: 14px;
          transition: all 0.3s;
        }
        .form-group input:focus {
          outline: none;
          border-color: #e6d160;
          box-shadow: 0 0 0 3px rgba(230, 209, 96, 0.1);
        }
        .promo-wrapper {
          display: flex;
          gap: 12px;
        }
        .promo-wrapper input {
          flex: 1;
          padding: 12px 14px;
          border: 1px solid #e0e0e0;
          border-radius: 10px;
          font-size: 14px;
        }
        .promo-wrapper button {
          padding: 12px 24px;
          background: #2d2d2d;
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }
        .promo-wrapper button:hover:not(:disabled) {
          background: #e6d160;
          color: #2d2d2d;
        }
        .promo-wrapper button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .promo-error {
          display: block;
          color: #ff5252;
          font-size: 12px;
          margin-top: 8px;
        }
        .promo-success {
          display: block;
          color: #4caf50;
          font-size: 12px;
          margin-top: 8px;
        }
        .payment-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .payment-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          background: #f8f8f8;
          border: 1px solid #e0e0e0;
          border-radius: 10px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .payment-btn.active {
          background: #e6d160;
          border-color: #e6d160;
          color: white;
        }
        .payment-btn:hover:not(.active) {
          border-color: #e6d160;
          background: #fffaf5;
        }
        .checkbox {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-size: 14px;
          color: #555;
        }
        .checkbox input {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
        .order-summary {
          position: sticky;
          top: 100px;
          height: fit-content;
        }
        .summary-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .summary-card h3 {
          font-size: 20px;
          font-weight: 600;
          color: #2d2d2d;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 2px solid #e6d160;
        }
        .cart-items {
          max-height: 400px;
          overflow-y: auto;
          margin-bottom: 20px;
        }
        .cart-item {
          display: flex;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .item-image {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 8px;
          background: #f5f5f5;
        }
        .item-details {
          flex: 1;
        }
        .item-details h4 {
          font-size: 14px;
          font-weight: 600;
          color: #2d2d2d;
          margin-bottom: 4px;
        }
        .item-variant {
          font-size: 12px;
          color: #999;
          margin-bottom: 4px;
        }
        .item-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .item-price {
          font-size: 13px;
          font-weight: 500;
          color: #e6d160;
        }
        .item-quantity {
          font-size: 12px;
          color: #999;
        }
        .item-total {
          font-weight: 600;
          color: #2d2d2d;
          font-size: 14px;
        }
        .summary-totals {
          padding-top: 16px;
          border-top: 1px solid #eee;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 14px;
          color: #666;
        }
        .total-row.discount {
          color: #4caf50;
        }
        .grand-total {
          font-size: 18px;
          font-weight: 700;
          color: #2d2d2d;
          padding-top: 12px;
          margin-top: 8px;
          border-top: 1px solid #e0e0e0;
        }
        .place-order-btn {
          width: 100%;
          background: #e6d160;
          color: #2d2d2d;
          border: none;
          padding: 16px;
          border-radius: 40px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          margin: 20px 0 16px;
        }
        .place-order-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(230, 209, 96, 0.3);
        }
        .place-order-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .secure-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 12px;
          color: #999;
          margin-bottom: 16px;
        }
        .guarantee {
          display: flex;
          justify-content: center;
          gap: 20px;
          font-size: 11px;
          color: #aaa;
          padding-top: 16px;
          border-top: 1px solid #eee;
        }
        @media (max-width: 968px) {
          .checkout-grid {
            grid-template-columns: 1fr;
          }
          .order-summary {
            position: static;
          }
          .form-row {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }
        @media (max-width: 500px) {
          .checkout-form {
            padding: 20px;
          }
          .payment-grid {
            grid-template-columns: 1fr;
          }
          .cart-item {
            flex-wrap: wrap;
          }
          .item-total {
            margin-left: 72px;
          }
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;
