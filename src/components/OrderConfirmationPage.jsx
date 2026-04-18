// OrderConfirmationPage.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaTruck,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaPrint,
  FaEnvelope,
  FaShare,
  FaArrowLeft,
  FaDownload,
} from "react-icons/fa";

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [countdown, setCountdown] = useState(40);

  useEffect(() => {
    // Get the most recent order from localStorage
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");

    if (orders.length > 0) {
      const latestOrder = orders[orders.length - 1];
      setOrder(latestOrder);

      // Calculate estimated delivery date (5-7 business days from order date)
      const orderDate = new Date(latestOrder.orderDate);
      const deliveryDateCalc = new Date(orderDate);
      deliveryDateCalc.setDate(orderDate.getDate() + 5);
      setDeliveryDate(deliveryDateCalc);
    }
  }, []);

  // Auto-redirect after 40 seconds
  useEffect(() => {
    if (order) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/shop");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [order, navigate]);

  const handlePrint = () => {
    window.print();
  };

  // Show loading state while checking for order
  if (!order) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading order details...</p>
        <style jsx>{`
          .loading-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 20px;
            background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
          }
          .loader {
            width: 50px;
            height: 50px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #e6d160;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="confirmation-page">
      <div className="container">
        {/* Auto-redirect Countdown Bar */}
        <div className="countdown-bar">
          <div className="countdown-content">
            <span>Redirecting to shop in </span>
            <strong>{countdown}</strong>
            <span> seconds</span>
            <button
              onClick={() => navigate("/shop")}
              className="redirect-now-btn"
            >
              Redirect Now
            </button>
          </div>
          <div className="countdown-progress">
            <div
              className="countdown-progress-bar"
              style={{ width: `${(countdown / 40) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Success Header */}
        <div className="success-header">
          <div className="success-animation">
            <div className="checkmark-circle">
              <FaCheckCircle className="checkmark" />
            </div>
          </div>
          <h1>Thank you for your order!</h1>
          <p className="order-number">
            Order Number: <strong>{order.orderNumber}</strong>
          </p>
          <p className="confirmation-message">
            We've received your order and will notify you when it ships.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button onClick={handlePrint} className="action-btn">
            <FaPrint /> Print
          </button>
          <button className="action-btn">
            <FaEnvelope /> Email
          </button>
          <button className="action-btn">
            <FaShare /> Share
          </button>
          <Link to="/shop" className="action-btn primary">
            <FaArrowLeft /> Continue Shopping
          </Link>
        </div>

        {/* Delivery Information */}
        <div className="delivery-card">
          <div className="delivery-header">
            <FaTruck className="delivery-icon" />
            <h3>Delivery Information</h3>
          </div>
          <div className="delivery-details">
            <div className="delivery-row">
              <div className="delivery-item">
                <FaCalendarAlt className="item-icon" />
                <div>
                  <span className="label">Estimated Delivery Date:</span>
                  <strong>
                    {deliveryDate?.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </strong>
                </div>
              </div>
              <div className="delivery-item">
                <FaClock className="item-icon" />
                <div>
                  <span className="label">Order Placed:</span>
                  <strong>
                    {new Date(order.orderDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </strong>
                </div>
              </div>
              <div className="delivery-item">
                <FaMapMarkerAlt className="item-icon" />
                <div>
                  <span className="label">Shipping Address:</span>
                  <strong>{order.customerInfo?.fullName}</strong>
                  <p className="address-detail">
                    {order.customerInfo?.phone}
                    <br />
                    {order.customerInfo?.email}
                    <br />
                    {order.customerInfo?.address}, {order.customerInfo?.city},{" "}
                    {order.customerInfo?.zipCode}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="order-summary-card">
          <div className="summary-header">
            <h3>Order Summary</h3>
            <Link to="/orders" className="view-link">
              View All Orders →
            </Link>
          </div>

          {/* Order Items Table */}
          <div className="items-table">
            <div className="table-header">
              <div className="col-product">Product</div>
              <div className="col-price">Price</div>
              <div className="col-quantity">Quantity</div>
              <div className="col-total">Total</div>
            </div>
            <div className="table-body">
              {order.items &&
                order.items.map((item, idx) => (
                  <div key={idx} className="table-row">
                    <div className="col-product">
                      <div className="product-info">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="product-thumb"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/60";
                            }}
                          />
                        )}
                        <div className="product-details">
                          <span className="product-name">{item.name}</span>
                          {item.size && (
                            <span className="product-size">
                              Size: {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="product-color">
                              Color: {item.color}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-price">₹{item.price.toFixed(2)}</div>
                    <div className="col-quantity">× {item.quantity}</div>
                    <div className="col-total">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Order Totals */}
          <div className="totals-section">
            <div className="totals-card">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>₹{order.subtotal?.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span>
                  {order.shipping === 0
                    ? "Free"
                    : `₹${order.shipping?.toFixed(2)}`}
                </span>
              </div>
              <div className="total-row">
                <span>Tax (10%):</span>
                <span>₹{order.tax?.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="total-row discount">
                  <span>Discount:</span>
                  <span>-₹{order.discount?.toFixed(2)}</span>
                </div>
              )}
              <div className="total-row grand-total">
                <span>Grand Total:</span>
                <span>₹{order.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="payment-info">
            <h4>Payment Information</h4>
            <div className="payment-details">
              <div className="payment-row">
                <span>Payment Method:</span>
                <strong className="payment-method-badge">
                  {order.paymentMethod?.toUpperCase() || "CARD"}
                </strong>
              </div>
              <div className="payment-row">
                <span>Payment Status:</span>
                <span className="status-paid">Paid ✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps Section */}
        <div className="next-steps">
          <h3>What's Next?</h3>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Order Confirmation</h4>
                <p>
                  We've sent a confirmation email to {order.customerInfo?.email}
                </p>
              </div>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Order Processing</h4>
                <p>We'll prepare your items for shipping (1-2 business days)</p>
              </div>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Shipping Confirmation</h4>
                <p>We'll send tracking info once your order ships</p>
              </div>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>Delivery</h4>
                <p>Your order will arrive on the estimated delivery date</p>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="help-section">
          <div className="help-card">
            <h4>Need Help?</h4>
            <p>
              Have questions about your order? Our customer service team is here
              to help.
            </p>
            <div className="help-buttons">
              <Link to="/contact" className="help-btn">
                Contact Support
              </Link>
              <Link to="/faq" className="help-btn secondary">
                Visit FAQ
              </Link>
            </div>
          </div>
          <div className="download-card">
            <FaDownload className="download-icon" />
            <div>
              <h4>Save Order Details</h4>
              <p>Download invoice for your records</p>
            </div>
            <button onClick={handlePrint} className="download-btn">
              Download PDF
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .confirmation-page {
          background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
          min-height: 100vh;
          padding: 100px 0 60px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Countdown Bar */
        .countdown-bar {
          background: #1f2937;
          border-radius: 12px;
          margin-bottom: 32px;
          overflow: hidden;
          animation: slideDown 0.5s ease-out;
        }

        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .countdown-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px 24px;
          color: white;
          font-size: 14px;
          background: #374151;
        }

        .countdown-content strong {
          font-size: 20px;
          font-weight: 700;
          color: #e6d160;
          min-width: 30px;
          text-align: center;
        }

        .redirect-now-btn {
          margin-left: 16px;
          padding: 6px 16px;
          background: #e6d160;
          border: none;
          border-radius: 20px;
          color: #1f2937;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 12px;
        }

        .redirect-now-btn:hover {
          transform: scale(1.05);
          background: #f0e080;
        }

        .countdown-progress {
          height: 4px;
          background: #4b5563;
        }

        .countdown-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #e6d160, #f0e080);
          transition: width 0.3s linear;
        }

        /* Success Header */
        .success-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .success-animation {
          margin-bottom: 24px;
        }

        .checkmark-circle {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          animation: scaleIn 0.5s ease-out;
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .checkmark {
          font-size: 48px;
          color: white;
        }

        .success-header h1 {
          font-family: "Playfair Display", serif;
          font-size: 36px;
          color: #2d2d2d;
          margin-bottom: 12px;
        }

        .order-number {
          font-family: "DM Sans", sans-serif;
          font-size: 16px;
          color: #6c6c6c;
          margin-bottom: 8px;
        }

        .order-number strong {
          color: #e6d160;
          font-size: 18px;
        }

        .confirmation-message {
          font-family: "DM Sans", sans-serif;
          color: #6c6c6c;
        }

        /* Action Buttons */
        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 40px;
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          color: #2d2d2d;
          cursor: pointer;
          transition: all 0.3s;
          text-decoration: none;
        }

        .action-btn:hover {
          border-color: #e6d160;
          transform: translateY(-2px);
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #e6d160 0%, #e6d160 100%);
          color: white;
          border: none;
        }

        /* Delivery Card */
        .delivery-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 32px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(230, 209, 96, 0.2);
        }

        .delivery-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 2px solid #e6d160;
        }

        .delivery-icon {
          font-size: 28px;
          color: #e6d160;
        }

        .delivery-header h3 {
          font-family: "Playfair Display", serif;
          font-size: 22px;
          color: #2d2d2d;
        }

        .delivery-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .delivery-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .item-icon {
          font-size: 20px;
          color: #e6d160;
          margin-top: 3px;
        }

        .label {
          display: block;
          font-family: "DM Sans", sans-serif;
          font-size: 12px;
          color: #999;
          margin-bottom: 4px;
        }

        .delivery-item strong {
          font-family: "DM Sans", sans-serif;
          font-size: 15px;
          color: #2d2d2d;
        }

        .address-detail {
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          color: #6c6c6c;
          margin-top: 8px;
          line-height: 1.4;
        }

        /* Order Summary Card */
        .order-summary-card {
          background: white;
          border-radius: 16px;
          padding: 28px;
          margin-bottom: 32px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .summary-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f0f0f0;
        }

        .summary-header h3 {
          font-family: "Playfair Display", serif;
          font-size: 22px;
          color: #2d2d2d;
        }

        .view-link {
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          color: #e6d160;
          text-decoration: none;
        }

        .view-link:hover {
          text-decoration: underline;
        }

        /* Items Table */
        .items-table {
          overflow-x: auto;
          margin-bottom: 24px;
        }

        .table-header {
          display: grid;
          grid-template-columns: 3fr 1fr 1fr 1.5fr;
          background: #f8f9fa;
          padding: 12px 16px;
          border-radius: 8px;
          font-family: "DM Sans", sans-serif;
          font-weight: 600;
          font-size: 14px;
          color: #2d2d2d;
        }

        .table-row {
          display: grid;
          grid-template-columns: 3fr 1fr 1fr 1.5fr;
          padding: 16px;
          border-bottom: 1px solid #f0f0f0;
          align-items: center;
        }

        .product-info {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .product-thumb {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 8px;
        }

        .product-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .product-name {
          font-family: "DM Sans", sans-serif;
          font-weight: 600;
          color: #2d2d2d;
        }

        .product-size,
        .product-color {
          font-family: "DM Sans", sans-serif;
          font-size: 12px;
          color: #999;
        }

        .col-price,
        .col-quantity,
        .col-total {
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          color: #6c6c6c;
        }

        .col-total {
          font-weight: 600;
          color: #e6d160;
        }

        /* Totals Section */
        .totals-section {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 24px;
          padding-top: 16px;
          border-top: 1px solid #f0f0f0;
        }

        .totals-card {
          width: 300px;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          color: #6c6c6c;
        }

        .total-row.discount {
          color: #4caf50;
        }

        .grand-total {
          font-size: 18px;
          font-weight: 700;
          color: #2d2d2d;
          border-top: 2px solid #e6d160;
          margin-top: 8px;
          padding-top: 12px;
        }

        /* Payment Information */
        .payment-info {
          padding-top: 20px;
          border-top: 1px solid #f0f0f0;
        }

        .payment-info h4 {
          font-family: "DM Sans", sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #2d2d2d;
          margin-bottom: 12px;
        }

        .payment-details {
          display: flex;
          gap: 32px;
        }

        .payment-row {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .payment-row span:first-child {
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          color: #999;
        }

        .payment-method-badge {
          background: #f8f9fa;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          color: #e6d160;
        }

        .status-paid {
          color: #4caf50;
          font-weight: 600;
        }

        /* Next Steps */
        .next-steps {
          margin-bottom: 32px;
        }

        .next-steps h3 {
          font-family: "Playfair Display", serif;
          font-size: 22px;
          color: #2d2d2d;
          margin-bottom: 24px;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }

        .step-card {
          display: flex;
          gap: 16px;
          padding: 20px;
          background: white;
          border-radius: 12px;
          transition: all 0.3s;
        }

        .step-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .step-number {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #e6d160 0%, #e6d160 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
        }

        .step-content h4 {
          font-family: "DM Sans", sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #2d2d2d;
          margin-bottom: 8px;
        }

        .step-content p {
          font-family: "DM Sans", sans-serif;
          font-size: 13px;
          color: #6c6c6c;
          line-height: 1.4;
        }

        /* Help Section */
        .help-section {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        .help-card,
        .download-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
        }

        .help-card h4 {
          font-family: "DM Sans", sans-serif;
          font-size: 18px;
          font-weight: 600;
          color: #2d2d2d;
          margin-bottom: 12px;
        }

        .help-card p {
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          color: #6c6c6c;
          margin-bottom: 20px;
        }

        .help-buttons {
          display: flex;
          gap: 12px;
        }

        .help-btn {
          padding: 10px 20px;
          background: #f8f9fa;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          color: #2d2d2d;
          text-decoration: none;
          transition: all 0.3s;
        }

        .help-btn:hover {
          border-color: #e6d160;
        }

        .help-btn.secondary {
          background: transparent;
        }

        .download-card {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .download-icon {
          font-size: 32px;
          color: #e6d160;
        }

        .download-card h4 {
          font-family: "DM Sans", sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #2d2d2d;
          margin-bottom: 4px;
        }

        .download-card p {
          font-family: "DM Sans", sans-serif;
          font-size: 12px;
          color: #6c6c6c;
        }

        .download-btn {
          margin-left: auto;
          padding: 8px 16px;
          background: transparent;
          border: 1px solid #e6d160;
          border-radius: 8px;
          color: #e6d160;
          cursor: pointer;
          transition: all 0.3s;
        }

        .download-btn:hover {
          background: #e6d160;
          color: white;
        }

        @media (max-width: 768px) {
          .table-header,
          .table-row {
            grid-template-columns: 2fr 1fr 1fr 1fr;
            font-size: 12px;
          }

          .product-info {
            flex-direction: column;
            text-align: left;
            align-items: flex-start;
          }

          .help-section {
            grid-template-columns: 1fr;
          }

          .success-header h1 {
            font-size: 28px;
          }

          .countdown-content {
            font-size: 12px;
            padding: 12px 16px;
          }
        }

        @media print {
          .action-buttons,
          .help-section,
          .next-steps,
          .view-link,
          .countdown-bar {
            display: none;
          }

          .confirmation-page {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderConfirmationPage;
