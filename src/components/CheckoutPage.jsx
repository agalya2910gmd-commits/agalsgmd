// src/components/CheckoutPage.jsx
import React, { useState, useEffect } from "react";
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";
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
  FaEdit,
  FaExchangeAlt,
  FaTimes,
  FaSave,
  FaHome,
  FaBriefcase,
  FaMapMarkerAlt,
  FaChevronDown,
  FaPlus,
} from "react-icons/fa";

// ============================================
// EMAILJS CONFIGURATION
// ============================================
const EMAILJS_CONFIG = {
  SERVICE_ID: "service_mwjv4vc",
  TEMPLATE_ID: "template_vxpz22r",
  PUBLIC_KEY: "CnGqkQdJYAqYv2Cz6",
};

const STORE_OWNER_EMAIL = "agalyasrimurugan2000@gmail.com";
// ============================================

// Mock saved addresses - In real implementation, this would come from backend/context
const getMockSavedAddresses = (currentUser) => {
  const baseAddresses = [
    {
      id: 1,
      name: "Agalya",
      phone: "+91 98765 43210",
      street: "The best pattern center 59, Rajaji Nagar, cotton mill road",
      city: "Tiruppur",
      state: "TAMIL NADU",
      zipCode: "641603",
      country: "India",
      type: "home",
      isDefault: true,
      landmark: "Near cotton mill road",
    },
    {
      id: 2,
      name: "Agalya",
      phone: "+91 98765 43211",
      street: "42, Kumaran Road",
      city: "Coimbatore",
      state: "TAMIL NADU",
      zipCode: "641001",
      country: "India",
      type: "work",
      isDefault: false,
    },
    {
      id: 3,
      name: "Agalya",
      phone: "+91 98765 43212",
      street: "15, Gandhi Street",
      city: "Chennai",
      state: "TAMIL NADU",
      zipCode: "600001",
      country: "India",
      type: "other",
      isDefault: false,
    },
  ];

  if (currentUser && currentUser.email) {
    return baseAddresses.map((addr) => ({
      ...addr,
      name: currentUser.fullName || addr.name,
    }));
  }
  return baseAddresses;
};

const CheckoutPage = () => {
  const { cart, getCartTotal, clearCart, currentUserId } = useStore();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Address state management
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isChangingAddress, setIsChangingAddress] = useState(false);
  const [showAddDeliveryInstructions, setShowAddDeliveryInstructions] =
    useState(false);
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [editFormData, setEditFormData] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    landmark: "",
  });

  const [formData, setFormData] = useState({
    email: "",
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

  // Load saved addresses and set default address
  useEffect(() => {
    const addresses = getMockSavedAddresses(user);
    setSavedAddresses(addresses);
    const defaultAddress =
      addresses.find((addr) => addr.isDefault) || addresses[0];
    if (defaultAddress) {
      setSelectedAddress(defaultAddress);
    }
  }, [user]);

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

  const handleEditAddressChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditAddressSubmit = () => {
    if (!editFormData.name.trim()) {
      alert("Please enter your full name");
      return;
    }
    if (!editFormData.phone.trim()) {
      alert("Please enter your phone number");
      return;
    }
    if (!editFormData.street.trim()) {
      alert("Please enter your street address");
      return;
    }
    if (!editFormData.city.trim()) {
      alert("Please enter your city");
      return;
    }
    if (!editFormData.zipCode.trim()) {
      alert("Please enter your zip code");
      return;
    }

    const updatedAddress = {
      ...selectedAddress,
      name: editFormData.name,
      phone: editFormData.phone,
      street: editFormData.street,
      city: editFormData.city,
      state: editFormData.state,
      zipCode: editFormData.zipCode,
      landmark: editFormData.landmark,
    };

    setSelectedAddress(updatedAddress);
    setSavedAddresses((prev) =>
      prev.map((addr) =>
        addr.id === selectedAddress.id ? updatedAddress : addr,
      ),
    );

    setIsEditingAddress(false);
  };

  const handleChangeAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsChangingAddress(false);
  };

  const openEditModal = () => {
    setEditFormData({
      name: selectedAddress?.name || "",
      phone: selectedAddress?.phone || "",
      street: selectedAddress?.street || "",
      city: selectedAddress?.city || "",
      state: selectedAddress?.state || "",
      zipCode: selectedAddress?.zipCode || "",
      landmark: selectedAddress?.landmark || "",
    });
    setIsEditingAddress(true);
  };

  const getFullAddressString = () => {
    if (!selectedAddress) return "";
    let address = selectedAddress.street;
    if (selectedAddress.landmark) address += `, ${selectedAddress.landmark}`;
    address += `, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.zipCode}, ${selectedAddress.country}`;
    return address;
  };

  const handleApplyPromo = () => {
    if (formData.promoCode?.trim().toUpperCase() === "SAVE10") {
      setPromoApplied(true);
      setPromoDiscount(subtotal * 0.1);
      setPromoError("");
    } else if (formData.promoCode?.trim().toUpperCase() === "FREESHIP") {
      setPromoApplied(true);
      setPromoDiscount(0);
      setPromoError("");
    } else if (formData.promoCode?.trim() !== "") {
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
      const itemsList = orderData.items
        .map((item, index) => {
          const productName = `${item.name}${item.size ? ` (Size: ${item.size})` : ""}${item.color ? `, Color: ${item.color}` : ""}`;
          const quantity = item.quantity;
          const price = (item.price * quantity).toFixed(2);
          return `${index + 1}. ${productName} - Quantity: ${quantity} - $${price}`;
        })
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
          orderData.discount > 0 ? `${orderData.discount.toFixed(2)}` : "$0",
        items: itemsList,
        estimated_delivery: getEstimatedDeliveryDate(),
        payment_method: orderData.paymentMethod.toUpperCase(),
        customer_name: orderData.customerInfo.fullName,
        customer_email: orderData.customerInfo.email,
        customer_phone: orderData.customerInfo.phone,
        customer_address: orderData.customerInfo.address,
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
    if (!formData.email.trim() || !formData.email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }
    if (!selectedAddress) {
      alert("Please select a shipping address");
      return;
    }

    setIsProcessing(true);
    setEmailStatus("sending");

    const orderNumber = `ORD-${Date.now()}`;
    const newOrder = {
      id: Date.now(),
      orderNumber: orderNumber,
      customerInfo: {
        fullName: selectedAddress.name,
        email: formData.email,
        phone: selectedAddress.phone,
        address: getFullAddressString(),
        city: selectedAddress.city,
        zipCode: selectedAddress.zipCode,
        receiveSmsUpdates: formData.receiveSmsUpdates,
        deliveryInstructions: deliveryInstructions,
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

    try {
      await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUserId,
          items: cart,
          shipping_address: getFullAddressString(),
          payment_method: paymentMethod,
          total_amount: total,
          email: formData.email,
          phone: selectedAddress.phone,
          delivery_instructions: deliveryInstructions,
        }),
      });

      await fetch("http://localhost:5000/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUserId,
          full_name: selectedAddress.name,
          phone_number: selectedAddress.phone,
          street: selectedAddress.street,
          city: selectedAddress.city,
          pincode: selectedAddress.zipCode,
          state: selectedAddress.state,
        }),
      });
    } catch (err) {
      console.error("Error saving to db:", err);
    }

    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));

    setEmailStatus("sent");
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

          <div className="order-summary-card">
            <h3>Order Summary</h3>
            <div className="order-info-row">
              <span>Order Number:</span>
              <strong>{placedOrder?.orderNumber}</strong>
            </div>
            <div className="order-info-row">
              <span>Total Items:</span>
              <strong>{placedOrder?.totalItems}</strong>
            </div>
            <div className="order-info-row">
              <span>Order Total:</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
            <div className="order-info-row">
              <span>Delivery to:</span>
              <strong>{selectedAddress?.name}</strong>
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
          <div className="checkout-form">
            {/* DELIVERING TO SECTION - Clean static address display */}
            <div className="delivering-section">
              <div className="section-header">
                <h3 className="section-title">
                  Delivering to {selectedAddress?.name || "Address"}
                </h3>
                <button
                  className="change-link"
                  onClick={() => setIsChangingAddress(true)}
                >
                  Change
                </button>
              </div>

              {selectedAddress && (
                <div className="delivering-address-card">
                  <p className="address-line">
                    {selectedAddress.street}
                    {selectedAddress.landmark &&
                      `, ${selectedAddress.landmark}`}
                  </p>
                  <p className="address-line">
                    {selectedAddress.city}, {selectedAddress.state},{" "}
                    {selectedAddress.zipCode}, {selectedAddress.country}
                  </p>
                  <p className="address-phone">
                    Phone: {selectedAddress.phone}
                  </p>

                  {/* Add delivery instructions */}
                  <div className="delivery-instructions-wrapper">
                    {!showAddDeliveryInstructions ? (
                      <button
                        className="add-delivery-link"
                        onClick={() => setShowAddDeliveryInstructions(true)}
                      >
                        + Add delivery instructions
                      </button>
                    ) : (
                      <div className="delivery-instructions-input">
                        <textarea
                          placeholder="e.g., Leave at back door, call on arrival, etc."
                          value={deliveryInstructions}
                          onChange={(e) =>
                            setDeliveryInstructions(e.target.value)
                          }
                          rows="2"
                        />
                        <div className="instructions-actions">
                          <button
                            className="save-instructions-btn"
                            onClick={() =>
                              setShowAddDeliveryInstructions(false)
                            }
                          >
                            Save
                          </button>
                          <button
                            className="cancel-instructions-btn"
                            onClick={() => {
                              setShowAddDeliveryInstructions(false);
                              setDeliveryInstructions("");
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                    {deliveryInstructions && !showAddDeliveryInstructions && (
                      <div className="saved-instructions">
                        <span className="instructions-label">
                          Instructions:
                        </span>
                        <span>{deliveryInstructions}</span>
                        <button
                          className="edit-instructions-btn"
                          onClick={() => setShowAddDeliveryInstructions(true)}
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="address-actions-row">
                <button
                  className="action-link edit-address-link"
                  onClick={openEditModal}
                >
                  <FaEdit /> Edit address
                </button>
              </div>
            </div>

            {/* PAYMENT METHOD SECTION */}
            <div className="payment-section">
              <div className="section-header">
                <h3 className="section-title">Payment method</h3>
              </div>

              <div className="payment-methods">
                <div className="payment-options">
                  <button
                    className={`payment-option-btn ${paymentMethod === "card" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    <FaCreditCard /> Credit Card
                  </button>
                  <button
                    className={`payment-option-btn ${paymentMethod === "paypal" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("paypal")}
                  >
                    <FaPaypal /> PayPal
                  </button>
                  <button
                    className={`payment-option-btn ${paymentMethod === "apple" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("apple")}
                  >
                    <FaApplePay /> Apple Pay
                  </button>
                  <button
                    className={`payment-option-btn ${paymentMethod === "google" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("google")}
                  >
                    <FaGooglePay /> Google Pay
                  </button>
                </div>
              </div>
            </div>

            {/* CONTACT SECTION */}
            <div className="contact-section">
              <div className="section-header">
                <h3 className="section-title">Contact information</h3>
              </div>
              <div className="contact-form">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                  />
                </div>
                <label className="checkbox-label">
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

            {/* PROMO CODE SECTION */}
            <div className="promo-section">
              <div className="promo-wrapper">
                <input
                  type="text"
                  name="promoCode"
                  value={formData.promoCode || ""}
                  onChange={handleInputChange}
                  placeholder="Promo code (SAVE10 or FREESHIP)"
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
          </div>

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

      {/* EDIT ADDRESS MODAL */}
      {isEditingAddress && (
        <div
          className="modal-overlay"
          onClick={() => setIsEditingAddress(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Shipping Address</h3>
              <button
                className="modal-close"
                onClick={() => setIsEditingAddress(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditAddressChange}
                  placeholder="Full Name"
                />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleEditAddressChange}
                  placeholder="Phone Number"
                />
              </div>
              <div className="form-group">
                <label>Street Address *</label>
                <input
                  type="text"
                  name="street"
                  value={editFormData.street}
                  onChange={handleEditAddressChange}
                  placeholder="Street Address"
                />
              </div>
              <div className="form-group">
                <label>Landmark (Optional)</label>
                <input
                  type="text"
                  name="landmark"
                  value={editFormData.landmark}
                  onChange={handleEditAddressChange}
                  placeholder="Nearby landmark"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={editFormData.city}
                    onChange={handleEditAddressChange}
                    placeholder="City"
                  />
                </div>
                <div className="form-group">
                  <label>State *</label>
                  <input
                    type="text"
                    name="state"
                    value={editFormData.state}
                    onChange={handleEditAddressChange}
                    placeholder="State"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Zip Code *</label>
                <input
                  type="text"
                  name="zipCode"
                  value={editFormData.zipCode}
                  onChange={handleEditAddressChange}
                  placeholder="Zip Code"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setIsEditingAddress(false)}
              >
                Cancel
              </button>
              <button className="save-btn" onClick={handleEditAddressSubmit}>
                <FaSave /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHANGE ADDRESS MODAL */}
      {isChangingAddress && (
        <div
          className="modal-overlay"
          onClick={() => setIsChangingAddress(false)}
        >
          <div
            className="modal-content change-address-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Select Shipping Address</h3>
              <button
                className="modal-close"
                onClick={() => setIsChangingAddress(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="addresses-list">
                {savedAddresses.map((address) => (
                  <div
                    key={address.id}
                    className={`address-option ${selectedAddress?.id === address.id ? "selected" : ""}`}
                    onClick={() => handleChangeAddressSelect(address)}
                  >
                    <div className="address-radio">
                      <div
                        className={`radio-circle ${selectedAddress?.id === address.id ? "selected" : ""}`}
                      >
                        {selectedAddress?.id === address.id && (
                          <div className="radio-inner" />
                        )}
                      </div>
                    </div>
                    <div className="address-option-details">
                      <div className="address-option-header">
                        <span className="address-type">
                          {address.type === "home" && <FaHome />}
                          {address.type === "work" && <FaBriefcase />}
                          {address.type === "other" && <FaMapMarkerAlt />}
                          {address.type === "home"
                            ? "Home"
                            : address.type === "work"
                              ? "Work"
                              : "Other"}
                        </span>
                        {address.isDefault && (
                          <span className="default-tag">Default</span>
                        )}
                      </div>
                      <p className="address-name">{address.name}</p>
                      <p className="address-phone">{address.phone}</p>
                      <p className="address-full">
                        {address.street}
                        {address.landmark && `, ${address.landmark}`}
                        <br />
                        {address.city}, {address.state}, {address.zipCode}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setIsChangingAddress(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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

        /* DELIVERING SECTION - Clean address display */
        .delivering-section {
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid #f0f0f0;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #2d2d2d;
          margin: 0;
        }
        .change-link {
          color: #e6d160;
          background: none;
          border: none;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }
        .change-link:hover {
          text-decoration: underline;
        }
        .delivering-address-card {
          background: #fafaf8;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
        }
        .address-line {
          margin: 4px 0;
          font-size: 14px;
          color: #555;
          line-height: 1.5;
        }
        .address-phone {
          margin: 8px 0 0;
          font-size: 13px;
          color: #888;
        }
        .delivery-instructions-wrapper {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px dashed #e0e0e0;
        }
        .add-delivery-link {
          background: none;
          border: none;
          color: #e6d160;
          font-size: 13px;
          cursor: pointer;
          padding: 0;
          font-weight: 500;
        }
        .add-delivery-link:hover {
          text-decoration: underline;
        }
        .delivery-instructions-input textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 13px;
          font-family: inherit;
          resize: vertical;
        }
        .instructions-actions {
          display: flex;
          gap: 10px;
          margin-top: 8px;
        }
        .save-instructions-btn {
          background: #e6d160;
          border: none;
          padding: 6px 16px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
        }
        .cancel-instructions-btn {
          background: #f0f0f0;
          border: none;
          padding: 6px 16px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
        }
        .saved-instructions {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          flex-wrap: wrap;
          font-size: 13px;
          color: #555;
          background: #fff8e1;
          padding: 8px 12px;
          border-radius: 8px;
        }
        .instructions-label {
          font-weight: 600;
          color: #e6d160;
        }
        .edit-instructions-btn {
          background: none;
          border: none;
          color: #e6d160;
          font-size: 12px;
          cursor: pointer;
          margin-left: auto;
        }
        .address-actions-row {
          display: flex;
          justify-content: flex-end;
        }
        .action-link {
          background: none;
          border: none;
          color: #e6d160;
          font-size: 13px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          transition: all 0.3s;
        }
        .action-link:hover {
          background: #fefcf5;
        }
        .edit-address-link {
          color: #666;
        }

        /* PAYMENT SECTION */
        .payment-section {
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid #f0f0f0;
        }
        .payment-options {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .payment-option-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: #f8f8f8;
          border: 1px solid #e0e0e0;
          border-radius: 40px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .payment-option-btn.active {
          background: #e6d160;
          border-color: #e6d160;
          color: #2d2d2d;
        }
        .payment-option-btn:hover:not(.active) {
          border-color: #e6d160;
          background: #fffaf5;
        }

        /* CONTACT SECTION */
        .contact-section {
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid #f0f0f0;
        }
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .form-group {
          margin-bottom: 0;
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
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #555;
          cursor: pointer;
        }
        .checkbox-label input {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        /* PROMO SECTION */
        .promo-section {
          margin-bottom: 0;
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

        /* ORDER SUMMARY */
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

        /* MODAL STYLES */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .modal-content {
          background: white;
          border-radius: 20px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease;
        }
        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .change-address-modal {
          max-width: 550px;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #eee;
        }
        .modal-header h3 {
          font-size: 20px;
          font-weight: 600;
          color: #2d2d2d;
          margin: 0;
        }
        .modal-close {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #999;
          transition: all 0.3s;
        }
        .modal-close:hover {
          color: #2d2d2d;
        }
        .modal-body {
          padding: 24px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 16px 24px;
          border-top: 1px solid #eee;
        }
        .cancel-btn {
          padding: 10px 20px;
          background: #f0f0f0;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .cancel-btn:hover {
          background: #e0e0e0;
        }
        .save-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
          background: #e6d160;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }
        .save-btn:hover {
          background: #d4c050;
          transform: translateY(-2px);
        }

        /* ADDRESS LIST IN CHANGE MODAL */
        .addresses-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .address-option {
          display: flex;
          gap: 16px;
          padding: 16px;
          border: 2px solid #e8e8e8;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .address-option:hover {
          border-color: #e6d160;
          background: #fefcf5;
        }
        .address-option.selected {
          border-color: #e6d160;
          background: #fefcf5;
        }
        .address-radio {
          flex-shrink: 0;
          padding-top: 2px;
        }
        .radio-circle {
          width: 20px;
          height: 20px;
          border: 2px solid #ccc;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }
        .radio-circle.selected {
          border-color: #e6d160;
        }
        .radio-inner {
          width: 10px;
          height: 10px;
          background: #e6d160;
          border-radius: 50%;
        }
        .address-option-details {
          flex: 1;
        }
        .address-option-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }
        .address-type {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: #666;
          text-transform: capitalize;
        }
        .default-tag {
          background: #e6d160;
          color: #2d2d2d;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
        }
        .address-option-details p {
          margin: 4px 0;
        }
        .address-option-details .address-name {
          font-size: 14px;
          font-weight: 600;
          color: #2d2d2d;
        }
        .address-option-details .address-phone {
          font-size: 12px;
          color: #888;
        }
        .address-option-details .address-full {
          font-size: 13px;
          color: #666;
          line-height: 1.4;
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
          .payment-options {
            flex-direction: column;
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
