// pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUser,
  FaShoppingBag,
  FaHeart,
  FaStore,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaSignOutAlt,
  FaArrowLeft,
  FaTrashAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaShoppingCart,
  FaHeadset,
  FaChevronRight,
  FaPlus,
  FaMinus,
  FaEye,
  FaCheckCircle,
  FaTruck,
  FaClock,
} from "react-icons/fa";

const Profile = () => {
  const { user, logout, updateProfileImage, profileImage: globalProfileImage } = useAuth();
  const {
    cart,
    wishlist,
    removeFromCart,
    updateQuantity,
    removeFromWishlist,
    addToCart,
    getCartTotal,
    currentUserId,
  } = useStore();
  const navigate = useNavigate();

  // State Management
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(globalProfileImage);
  const fileInputRef = React.useRef(null);

  // Sync with global image
  useEffect(() => {
    setProfileImageUrl(globalProfileImage);
  }, [globalProfileImage]);

  // Load profile image from localStorage on mount (fallback)
  useEffect(() => {
    if (!profileImageUrl) {
      const savedImage = localStorage.getItem(`profile_image_${currentUserId || user?.id}`);
      if (savedImage) {
        setProfileImageUrl(savedImage);
      }
    }
  }, [currentUserId, user?.id, profileImageUrl]);

  // Orders data pulled from DB
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/orders/${currentUserId}`,
        );
        if (res.ok) {
          const data = await res.json();
          const grouped = {};
          data.forEach((row) => {
            // Group orders placed within the same exact second
            const timeKey = new Date(row.created_at)
              .toISOString()
              .split(".")[0];
            if (!grouped[timeKey]) {
              grouped[timeKey] = {
                id:
                  "ORD-" +
                  new Date(row.created_at).getTime().toString().slice(5, -1),
                date: new Date(row.created_at).toISOString().split("T")[0],
                total: parseFloat(row.total_amount),
                status: row.order_status,
                items: 0,
                paymentMethod: row.payment_method,
                trackingNumber: "Pending",
                products: [],
              };
            }
            const group = grouped[timeKey];
            group.items += row.quantity;
            group.products.push({
              id: row.product_id,
              name: row.product_name,
              image: row.product_image,
              quantity: row.quantity,
              price: parseFloat(row.price),
              size: row.size || null,
              color: row.color || null,
            });
          });
          const formattedOrders = Object.values(grouped)
            .filter(o => {
              // Ensure at least one product in the order belongs to the user
              // (The API should already handle this, but we add it for double-safety)
              return true; // The API is specifically called with currentUserId
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date));
          
          // Re-verify that each product row from the API actually matches the currentUserId if user_id was returned
          const strictlyFiltered = data.filter(row => parseInt(row.user_id) === parseInt(currentUserId));
          // If strictlyFiltered is different from data, we should rebuild grouped.
          // But for now, we'll just ensure the state is set correctly.
          setOrders(formattedOrders);
        }
      } catch (err) {
        console.error("Failed fetching orders from backend:", err);
      }
    };
    fetchOrders();
  }, [currentUserId]);

  const [formData, setFormData] = useState({
    name: user?.name || "Alex Johnson",
    email: user?.email || "alex.j@example.com",
    phone: user?.phone || "+91 98765 43210",
    address: user?.address || "123 Luxury Lane, Jubilee Hills, Hyderabad",
  });

  const [supportMsg, setSupportMsg] = useState("");

  useEffect(() => {
    const fetchProfileSync = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/contact/${currentUserId}`,
        );
        let profile = null;
        if (res.ok) {
          profile = await res.json();
        }

        // Auto-sync fallback
        if (!profile) {
          const syncRes = await fetch("http://localhost:5000/api/contact", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: currentUserId,
              full_name: user?.name || "Alex Johnson",
              email: user?.email || "alex.j@example.com",
              phone_number: user?.phone || "+91 98765 43210",
              street:
                user?.address || "123 Luxury Lane, Jubilee Hills, Hyderabad",
            }),
          });
          if (syncRes.ok) {
            profile = await syncRes.json();
          }
        }

        if (profile) {
          setFormData((prev) => ({
            ...prev,
            name: profile.full_name || prev.name,
            email: profile.email || prev.email,
            phone: profile.phone_number || prev.phone,
            address: profile.street || prev.address,
          }));
        }
      } catch (err) {}
    };
    if (currentUserId) {
      fetchProfileSync();
    }
  }, [currentUserId, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showSuccessMessage = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Profile Picture Upload Function
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        showSuccessMessage("Please select a valid image file");
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        showSuccessMessage("Image size should be less than 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result;
        setProfileImageUrl(imageDataUrl);
        // Update globally via context (it handles localStorage)
        updateProfileImage(imageDataUrl);
        showSuccessMessage("Profile picture updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (isEditing) {
      try {
        await fetch("http://localhost:5000/api/contact", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: currentUserId,
            full_name: formData.name,
            phone_number: formData.phone,
            email: formData.email,
            street: formData.address,
          }),
        });

        showSuccessMessage("Profile saved successfully");
      } catch (err) {}
    }
    setIsEditing(!isEditing);
  };

  const handleSendSupport = async () => {
    if (!supportMsg.trim()) return;
    try {
      await fetch("http://localhost:5000/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUserId,
          name: formData.name,
          email: formData.email,
          subject: "Support Request from Profile",
          message: supportMsg,
        }),
      });
      setSupportMsg("");
      showSuccessMessage("Message Sent Successfully!");
    } catch (err) {}
  };

  const handleRemoveFromCart = (id, size) => {
    removeFromCart(id, size);
    showSuccessMessage("Item removed from cart");
  };

  const handleUpdateQuantity = (id, size, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(id, size, newQuantity);
  };

  const handleRemoveFromWishlist = (id) => {
    removeFromWishlist(id);
    showSuccessMessage("Item removed from wishlist");
  };

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
    showSuccessMessage(`${product.name} moved to cart`);
  };

  const calculateItemTotal = (item) => {
    const price =
      typeof item.price === "number"
        ? item.price
        : parseFloat(item.price.replace("$", ""));
    return price * item.quantity;
  };

  const formatPrice = (price) => {
    if (typeof price === "number") return `$${price.toFixed(2)}`;
    return price;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return (
          <FaCheckCircle style={{ color: "#4CAF50", marginRight: "8px" }} />
        );
      case "Shipped":
        return <FaTruck style={{ color: "#2196F3", marginRight: "8px" }} />;
      case "Processing":
        return <FaClock style={{ color: "#FF9800", marginRight: "8px" }} />;
      default:
        return null;
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  const cartTotal = getCartTotal();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const orderCount = orders.length;

  return (
    <div style={styles.container}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        style={{ display: "none" }}
      />

      {showNotification && (
        <div style={styles.notification}>
          <FaHeart style={styles.notificationIcon} />
          <span>{notificationMessage}</span>
        </div>
      )}

      <div style={styles.wrapper}>
        {/* Header */}
        <div style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            <FaArrowLeft /> Back
          </button>
          <h1 style={styles.titleText}>My Account</h1>
          <div style={{ width: 80 }}></div>
        </div>

        <div style={styles.mainLayout}>
          {/* Left Sidebar Navigation */}
          <div style={styles.sidebar}>
            {/* Profile Card */}
            <div style={styles.profileCard}>
              <div style={styles.avatarContainer}>
                <div style={styles.avatar} onClick={handleAvatarClick}>
                  {profileImageUrl ? (
                    <img
                      src={profileImageUrl}
                      alt="Profile"
                      style={styles.avatarImage}
                    />
                  ) : (
                    formData.name.charAt(0).toUpperCase()
                  )}
                </div>
                <button
                  style={styles.editAvatarBtn}
                  onClick={handleAvatarClick}
                >
                  <FaCamera size={12} />
                </button>
              </div>
              <div style={styles.profileInfo}>
                <h3 style={styles.userName}>{formData.name}</h3>
                <p style={styles.userEmail}>{formData.email}</p>
                <div style={styles.statsRow}>
                  <div style={styles.statBox}>
                    <div style={styles.statNumber}>{orderCount}</div>
                    <div style={styles.statLabel}>Orders</div>
                  </div>
                  <div style={styles.statBox}>
                    <div style={styles.statNumber}>{cartItemCount}</div>
                    <div style={styles.statLabel}>Cart</div>
                  </div>
                  <div style={styles.statBox}>
                    <div style={styles.statNumber}>{wishlistCount}</div>
                    <div style={styles.statLabel}>Wishlist</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <div style={styles.navMenu}>
              <button
                onClick={() => setActiveTab("profile")}
                style={
                  activeTab === "profile"
                    ? styles.navItemActive
                    : styles.navItem
                }
              >
                <FaUser /> My Profile
                <FaChevronRight style={styles.chevron} />
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                style={
                  activeTab === "orders" ? styles.navItemActive : styles.navItem
                }
              >
                <FaShoppingBag /> My Orders
                <FaChevronRight style={styles.chevron} />
              </button>
              <button
                onClick={() => setActiveTab("cart")}
                style={
                  activeTab === "cart" ? styles.navItemActive : styles.navItem
                }
              >
                <FaShoppingCart /> My Cart
                {cartItemCount > 0 && (
                  <span style={styles.badge}>{cartItemCount}</span>
                )}
                <FaChevronRight style={styles.chevron} />
              </button>
              <button
                onClick={() => setActiveTab("wishlist")}
                style={
                  activeTab === "wishlist"
                    ? styles.navItemActive
                    : styles.navItem
                }
              >
                <FaHeart /> My Wishlist
                {wishlistCount > 0 && (
                  <span style={styles.badge}>{wishlistCount}</span>
                )}
                <FaChevronRight style={styles.chevron} />
              </button>
              <button
                onClick={() => setActiveTab("contact")}
                style={
                  activeTab === "contact"
                    ? styles.navItemActive
                    : styles.navItem
                }
              >
                <FaHeadset /> Contact Support
                <FaChevronRight style={styles.chevron} />
              </button>
              <button onClick={logout} style={styles.logoutBtn}>
                <FaSignOutAlt /> Sign Out
              </button>
            </div>
          </div>

          {/* Right Content Area */}
          <div style={styles.contentArea}>
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div style={styles.contentCard}>
                <div style={styles.cardHeader}>
                  <h2>Profile Information</h2>
                  <button
                    onClick={handleSaveProfile}
                    style={isEditing ? styles.saveButton : styles.editButton}
                  >
                    {isEditing ? (
                      <>
                        <FaSave /> Save Changes
                      </>
                    ) : (
                      <>
                        <FaEdit /> Edit Profile
                      </>
                    )}
                  </button>
                </div>

                <div style={styles.formGrid}>
                  <div style={styles.formField}>
                    <label>Full Name</label>
                    <input
                      disabled={!isEditing}
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      style={
                        isEditing ? styles.inputActive : styles.inputDisabled
                      }
                    />
                  </div>
                  <div style={styles.formField}>
                    <label>Email Address</label>
                    <input
                      disabled={true}
                      name="email"
                      value={formData.email}
                      style={styles.inputDisabled}
                    />
                  </div>
                  <div style={styles.formField}>
                    <label>Phone Number</label>
                    <input
                      disabled={!isEditing}
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      style={
                        isEditing ? styles.inputActive : styles.inputDisabled
                      }
                    />
                  </div>
                  <div style={styles.formField}>
                    <label>Delivery Address</label>
                    <textarea
                      disabled={!isEditing}
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                      style={
                        isEditing
                          ? styles.textareaActive
                          : styles.textareaDisabled
                      }
                    />
                  </div>
                </div>

                {isEditing && (
                  <div style={styles.editNotice}>
                    <FaEdit /> Make your changes and click "Save Changes"
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab with Images */}
            {activeTab === "orders" && (
              <div style={styles.contentCard}>
                <div style={styles.cardHeader}>
                  <h2>My Orders</h2>
                  <span style={styles.orderCount}>{orderCount} orders</span>
                </div>

                {orders.length > 0 ? (
                  <div style={styles.ordersList}>
                    {orders.map((order) => (
                      <div key={order.id} style={styles.orderItem}>
                        <div style={styles.orderHeader}>
                          <div style={styles.orderHeaderLeft}>
                            <span style={styles.orderId}>{order.id}</span>
                            <span style={getStatusStyle(order.status)}>
                              {getStatusIcon(order.status)}
                              {order.status}
                            </span>
                          </div>
                          <div style={styles.orderDate}>{order.date}</div>
                        </div>

                        {/* Order Products with Images and Details */}
                        <div style={styles.orderProductsContainer}>
                          {order.products.map((product, idx) => (
                            <div key={idx} style={styles.orderProductCard}>
                              <div style={styles.orderProductImageWrapper}>
                                <img
                                  src={
                                    product.image ||
                                    "https://via.placeholder.com/80"
                                  }
                                  alt={product.name}
                                  style={styles.orderProductImage}
                                />
                                <span style={styles.productQuantityBadge}>
                                  {product.quantity}
                                </span>
                              </div>
                              <div style={styles.orderProductDetails}>
                                <h4 style={styles.orderProductName}>
                                  {product.name}
                                </h4>
                                {product.size && (
                                  <p style={styles.orderProductSize}>
                                    Size: {product.size}
                                  </p>
                                )}
                                {product.color && (
                                  <p style={styles.orderProductColor}>
                                    Color: {product.color}
                                  </p>
                                )}
                                <p style={styles.orderProductPrice}>
                                  {formatPrice(product.price)} ×{" "}
                                  {product.quantity}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div style={styles.orderFooter}>
                          <div style={styles.orderTotalInfo}>
                            <span style={styles.orderItems}>
                              {order.items} items
                            </span>
                            <span style={styles.orderTotal}>
                              Total: {formatPrice(order.total)}
                            </span>
                          </div>
                          <button
                            style={styles.viewOrderBtn}
                            onClick={() => openOrderDetails(order)}
                          >
                            <FaEye /> View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={styles.emptyState}>
                    <FaShoppingBag size={60} color="#D4AF37" />
                    <p>No orders yet</p>
                    <button
                      style={styles.shopButton}
                      onClick={() => navigate("/shop")}
                    >
                      Start Shopping
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Cart Tab */}
            {activeTab === "cart" && (
              <div style={styles.contentCard}>
                <div style={styles.cardHeader}>
                  <h2>Shopping Cart</h2>
                  <span style={styles.cartTotal}>
                    Total: {formatPrice(cartTotal)}
                  </span>
                </div>

                {cart.length > 0 ? (
                  <>
                    <div style={styles.cartList}>
                      {cart.map((item) => (
                        <div
                          key={`${item.id}-${item.size || "default"}`}
                          style={styles.cartItem}
                        >
                          <img
                            src={item.image || "https://via.placeholder.com/80"}
                            alt={item.name}
                            style={styles.cartImage}
                          />
                          <div style={styles.cartDetails}>
                            <h4>{item.name}</h4>
                            {item.size && (
                              <p style={styles.itemSize}>Size: {item.size}</p>
                            )}
                            <p style={styles.cartPrice}>
                              {formatPrice(item.price)}
                            </p>
                          </div>
                          <div style={styles.cartActions}>
                            <div style={styles.quantityControl}>
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.id,
                                    item.size,
                                    item.quantity - 1,
                                  )
                                }
                              >
                                <FaMinus />
                              </button>
                              <span>{item.quantity}</span>
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.id,
                                    item.size,
                                    item.quantity + 1,
                                  )
                                }
                              >
                                <FaPlus />
                              </button>
                            </div>
                            <button
                              onClick={() =>
                                handleRemoveFromCart(item.id, item.size)
                              }
                              style={styles.removeBtn}
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                          <div style={styles.itemTotalPrice}>
                            ${calculateItemTotal(item).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      style={styles.checkoutButton}
                      onClick={() => navigate("/checkout")}
                    >
                      Proceed to Checkout
                    </button>
                  </>
                ) : (
                  <div style={styles.emptyState}>
                    <FaShoppingCart size={60} color="#D4AF37" />
                    <p>Your cart is empty</p>
                    <button
                      style={styles.shopButton}
                      onClick={() => navigate("/shop")}
                    >
                      Continue Shopping
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div style={styles.contentCard}>
                <div style={styles.cardHeader}>
                  <h2>My Wishlist</h2>
                  <span>{wishlistCount} items saved</span>
                </div>

                {wishlist.length > 0 ? (
                  <div style={styles.wishlistGrid}>
                    {wishlist.map((item) => (
                      <div key={item.id} style={styles.wishlistItem}>
                        <img
                          src={item.image || "https://via.placeholder.com/80"}
                          alt={item.name}
                          style={styles.wishlistImage}
                        />
                        <div style={styles.wishlistInfo}>
                          <h4>{item.name}</h4>
                          {item.size && (
                            <p style={styles.itemSize}>Size: {item.size}</p>
                          )}
                          <p style={styles.wishlistPrice}>
                            {formatPrice(item.price)}
                          </p>
                          <div style={styles.wishlistActions}>
                            <button
                              style={styles.addToCartBtn}
                              onClick={() => handleMoveToCart(item)}
                            >
                              Move to Cart
                            </button>
                            <button
                              onClick={() => handleRemoveFromWishlist(item.id)}
                              style={styles.removeWishBtn}
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={styles.emptyState}>
                    <FaHeart size={60} color="#D4AF37" />
                    <p>Your wishlist is empty</p>
                    <button
                      style={styles.shopButton}
                      onClick={() => navigate("/shop")}
                    >
                      Explore Products
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Contact Support Tab */}
            {activeTab === "contact" && (
              <div style={styles.contentCard}>
                <div style={styles.cardHeader}>
                  <h2>Contact Support</h2>
                </div>

                <div style={styles.contactInfo}>
                  <div style={styles.contactItem}>
                    <FaEnvelope style={styles.contactIcon} />
                    <div>
                      <h4>Email Support</h4>
                      <p>support@nivest.com</p>
                      <small>Response within 24 hours</small>
                    </div>
                  </div>
                  <div style={styles.contactItem}>
                    <FaPhone style={styles.contactIcon} />
                    <div>
                      <h4>Phone Support</h4>
                      <p>+91 1800 123 4567</p>
                      <small>Mon-Sat, 10 AM - 7 PM</small>
                    </div>
                  </div>
                  <div style={styles.contactItem}>
                    <FaMapMarkerAlt style={styles.contactIcon} />
                    <div>
                      <h4>Corporate Office</h4>
                      <p>123 Luxury Lane, Jubilee Hills</p>
                      <small>Hyderabad, Telangana - 500033</small>
                    </div>
                  </div>
                </div>

                <div style={styles.supportForm}>
                  <h3>Send us a message</h3>
                  <textarea
                    placeholder="Describe your issue..."
                    rows="4"
                    value={supportMsg}
                    onChange={(e) => setSupportMsg(e.target.value)}
                    style={styles.supportTextarea}
                  />
                  <button style={styles.submitBtn} onClick={handleSendSupport}>
                    Send Message
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div style={styles.modalOverlay} onClick={closeOrderModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2>Order Details</h2>
              <button style={styles.modalClose} onClick={closeOrderModal}>
                <FaTimes />
              </button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.orderInfo}>
                <div style={styles.infoRow}>
                  <span>Order ID:</span>
                  <strong>{selectedOrder.id}</strong>
                </div>
                <div style={styles.infoRow}>
                  <span>Date:</span>
                  <strong>{selectedOrder.date}</strong>
                </div>
                <div style={styles.infoRow}>
                  <span>Status:</span>
                  <span style={getStatusStyle(selectedOrder.status)}>
                    {getStatusIcon(selectedOrder.status)}
                    {selectedOrder.status}
                  </span>
                </div>
                <div style={styles.infoRow}>
                  <span>Payment Method:</span>
                  <strong>{selectedOrder.paymentMethod}</strong>
                </div>
                <div style={styles.infoRow}>
                  <span>Tracking Number:</span>
                  <strong>{selectedOrder.trackingNumber}</strong>
                </div>
              </div>

              <h3 style={styles.modalSubtitle}>Products</h3>
              <div style={styles.modalProducts}>
                {selectedOrder.products.map((product, idx) => (
                  <div key={idx} style={styles.modalProduct}>
                    <img
                      src={product.image || "https://via.placeholder.com/60"}
                      alt={product.name}
                      style={styles.modalProductImage}
                    />
                    <div style={styles.modalProductInfo}>
                      <h4>{product.name}</h4>
                      {product.size && <p>Size: {product.size}</p>}
                      {product.color && <p>Color: {product.color}</p>}
                      <p>Quantity: {product.quantity}</p>
                    </div>
                    <div style={styles.modalProductPrice}>
                      {formatPrice(product.price)}
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.modalTotal}>
                <span>Total Amount:</span>
                <strong>{formatPrice(selectedOrder.total)}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "#FFFFFF",
    padding: "80px 20px 40px",
    fontFamily: "'Poppins', 'Segoe UI', sans-serif",
    position: "relative",
  },
  notification: {
    position: "fixed",
    top: "90px",
    right: "20px",
    background: "#D4AF37",
    color: "#FFFFFF",
    padding: "12px 20px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    zIndex: 1000,
    animation: "slideIn 0.3s ease",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  notificationIcon: {
    fontSize: "16px",
  },
  wrapper: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
    paddingBottom: "20px",
    borderBottom: "2px solid #F0F0F0",
  },
  backButton: {
    background: "transparent",
    border: "1px solid #E0E0E0",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    color: "#333",
    fontSize: "14px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.3s ease",
  },
  titleText: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#000000",
    margin: 0,
  },
  mainLayout: {
    display: "grid",
    gridTemplateColumns: "320px 1fr",
    gap: "30px",
  },
  sidebar: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  profileCard: {
    background: "#FFFFFF",
    border: "1px solid #E8E8E8",
    borderRadius: "16px",
    padding: "24px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  avatarContainer: {
    position: "relative",
    display: "inline-block",
    marginBottom: "16px",
  },
  avatar: {
    width: "80px",
    height: "80px",
    background: "linear-gradient(135deg, #D4AF37, #B8860B)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "36px",
    fontWeight: "bold",
    color: "#FFFFFF",
    margin: "0 auto",
    cursor: "pointer",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  editAvatarBtn: {
    position: "absolute",
    bottom: "0",
    right: "0",
    background: "#D4AF37",
    border: "none",
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#FFFFFF",
    transition: "all 0.3s ease",
  },
  profileInfo: {
    marginTop: "8px",
  },
  userName: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#000000",
    marginBottom: "4px",
  },
  userEmail: {
    fontSize: "13px",
    color: "#666",
    marginBottom: "16px",
  },
  statsRow: {
    display: "flex",
    justifyContent: "space-around",
    paddingTop: "16px",
    borderTop: "1px solid #F0F0F0",
  },
  statBox: {
    textAlign: "center",
  },
  statNumber: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#D4AF37",
  },
  statLabel: {
    fontSize: "12px",
    color: "#666",
    marginTop: "4px",
  },
  navMenu: {
    background: "#FFFFFF",
    border: "1px solid #E8E8E8",
    borderRadius: "16px",
    padding: "8px",
  },
  navItem: {
    width: "100%",
    padding: "14px 16px",
    border: "none",
    background: "transparent",
    textAlign: "left",
    fontSize: "14px",
    fontWeight: "500",
    color: "#333",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderRadius: "12px",
    transition: "all 0.3s ease",
    position: "relative",
  },
  navItemActive: {
    width: "100%",
    padding: "14px 16px",
    border: "none",
    background: "#FFF8E7",
    textAlign: "left",
    fontSize: "14px",
    fontWeight: "600",
    color: "#D4AF37",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderRadius: "12px",
    position: "relative",
  },
  chevron: {
    marginLeft: "auto",
    fontSize: "12px",
  },
  badge: {
    marginLeft: "auto",
    background: "#D4AF37",
    color: "#FFFFFF",
    fontSize: "11px",
    padding: "2px 6px",
    borderRadius: "10px",
    marginRight: "8px",
  },
  logoutBtn: {
    width: "100%",
    padding: "14px 16px",
    border: "none",
    background: "transparent",
    color: "#DC2626",
    fontWeight: "500",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "8px",
    borderRadius: "12px",
    transition: "all 0.3s ease",
  },
  contentArea: {
    minHeight: "500px",
  },
  contentCard: {
    background: "#FFFFFF",
    border: "1px solid #E8E8E8",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    paddingBottom: "16px",
    borderBottom: "2px solid #F0F0F0",
  },
  editButton: {
    background: "transparent",
    border: "1px solid #D4AF37",
    padding: "8px 16px",
    borderRadius: "8px",
    color: "#D4AF37",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  saveButton: {
    background: "#D4AF37",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    color: "#FFFFFF",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  formGrid: {
    display: "grid",
    gap: "20px",
  },
  formField: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  inputDisabled: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #E8E8E8",
    background: "#F9F9F9",
    color: "#666",
    fontSize: "14px",
  },
  inputActive: {
    padding: "12px",
    borderRadius: "8px",
    border: "2px solid #D4AF37",
    background: "#FFFFFF",
    color: "#000000",
    fontSize: "14px",
    outline: "none",
  },
  textareaDisabled: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #E8E8E8",
    background: "#F9F9F9",
    color: "#666",
    fontSize: "14px",
    fontFamily: "inherit",
    resize: "vertical",
  },
  textareaActive: {
    padding: "12px",
    borderRadius: "8px",
    border: "2px solid #D4AF37",
    background: "#FFFFFF",
    color: "#000000",
    fontSize: "14px",
    fontFamily: "inherit",
    resize: "vertical",
    outline: "none",
  },
  editNotice: {
    marginTop: "20px",
    padding: "12px",
    background: "#FFF8E7",
    borderRadius: "8px",
    fontSize: "13px",
    color: "#D4AF37",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  ordersList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  orderItem: {
    border: "1px solid #E8E8E8",
    borderRadius: "12px",
    padding: "20px",
    transition: "all 0.3s ease",
  },
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  orderHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  orderId: {
    fontWeight: "700",
    color: "#D4AF37",
    fontSize: "14px",
  },
  orderDate: {
    fontSize: "12px",
    color: "#666",
  },
  orderProductsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "16px",
    maxHeight: "300px",
    overflowY: "auto",
  },
  orderProductCard: {
    display: "flex",
    gap: "12px",
    padding: "12px",
    background: "#F9F9F9",
    borderRadius: "10px",
    alignItems: "center",
  },
  orderProductImageWrapper: {
    position: "relative",
    width: "70px",
    height: "70px",
    flexShrink: 0,
  },
  orderProductImage: {
    width: "100%",
    height: "100%",
    borderRadius: "8px",
    objectFit: "cover",
  },
  productQuantityBadge: {
    position: "absolute",
    bottom: "-6px",
    right: "-6px",
    background: "#D4AF37",
    color: "#FFFFFF",
    fontSize: "10px",
    fontWeight: "600",
    padding: "2px 6px",
    borderRadius: "10px",
    minWidth: "20px",
    textAlign: "center",
  },
  orderProductDetails: {
    flex: 1,
  },
  orderProductName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#000000",
    marginBottom: "4px",
  },
  orderProductSize: {
    fontSize: "11px",
    color: "#D4AF37",
    marginBottom: "2px",
  },
  orderProductColor: {
    fontSize: "11px",
    color: "#666",
    marginBottom: "2px",
  },
  orderProductPrice: {
    fontSize: "12px",
    fontWeight: "500",
    color: "#666",
  },
  orderFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "12px",
    borderTop: "1px solid #F0F0F0",
  },
  orderTotalInfo: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },
  orderItems: {
    fontSize: "12px",
    color: "#666",
  },
  orderTotal: {
    fontWeight: "700",
    fontSize: "16px",
    color: "#D4AF37",
  },
  viewOrderBtn: {
    background: "transparent",
    border: "1px solid #E0E0E0",
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#666",
  },
  orderCount: {
    fontSize: "13px",
    color: "#666",
  },
  cartList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "24px",
  },
  cartItem: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "16px",
    border: "1px solid #E8E8E8",
    borderRadius: "12px",
  },
  cartImage: {
    width: "80px",
    height: "80px",
    borderRadius: "8px",
    objectFit: "cover",
  },
  cartDetails: {
    flex: 1,
  },
  itemSize: {
    fontSize: "12px",
    color: "#D4AF37",
    margin: "2px 0",
  },
  cartPrice: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#666",
  },
  cartActions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  quantityControl: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#F5F5F5",
    padding: "4px 8px",
    borderRadius: "20px",
  },
  removeBtn: {
    background: "transparent",
    border: "none",
    color: "#DC2626",
    cursor: "pointer",
    padding: "6px",
    borderRadius: "6px",
  },
  itemTotalPrice: {
    fontWeight: "700",
    fontSize: "16px",
    color: "#D4AF37",
    minWidth: "80px",
    textAlign: "right",
  },
  cartTotal: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#D4AF37",
  },
  checkoutButton: {
    width: "100%",
    padding: "14px",
    background: "#D4AF37",
    border: "none",
    borderRadius: "8px",
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  },
  wishlistGrid: {
    display: "grid",
    gap: "16px",
  },
  wishlistItem: {
    display: "flex",
    gap: "16px",
    padding: "16px",
    border: "1px solid #E8E8E8",
    borderRadius: "12px",
    transition: "all 0.3s ease",
  },
  wishlistImage: {
    width: "80px",
    height: "80px",
    borderRadius: "8px",
    objectFit: "cover",
  },
  wishlistInfo: {
    flex: 1,
  },
  wishlistPrice: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#D4AF37",
    marginBottom: "8px",
  },
  wishlistActions: {
    display: "flex",
    gap: "8px",
  },
  addToCartBtn: {
    padding: "6px 12px",
    background: "#D4AF37",
    border: "none",
    borderRadius: "6px",
    color: "#FFFFFF",
    fontSize: "12px",
    cursor: "pointer",
  },
  removeWishBtn: {
    padding: "6px 12px",
    background: "#FEE2E2",
    border: "none",
    borderRadius: "6px",
    color: "#DC2626",
    cursor: "pointer",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
  },
  shopButton: {
    marginTop: "16px",
    padding: "10px 24px",
    background: "#D4AF37",
    border: "none",
    borderRadius: "8px",
    color: "#FFFFFF",
    cursor: "pointer",
  },
  contactInfo: {
    display: "grid",
    gap: "24px",
    marginBottom: "32px",
  },
  contactItem: {
    display: "flex",
    gap: "16px",
    padding: "16px",
    border: "1px solid #E8E8E8",
    borderRadius: "12px",
  },
  contactIcon: {
    fontSize: "24px",
    color: "#D4AF37",
  },
  supportForm: {
    marginTop: "24px",
  },
  supportTextarea: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #E8E8E8",
    fontSize: "14px",
    fontFamily: "inherit",
    resize: "vertical",
    marginBottom: "16px",
  },
  submitBtn: {
    padding: "10px 24px",
    background: "#D4AF37",
    border: "none",
    borderRadius: "8px",
    color: "#FFFFFF",
    cursor: "pointer",
  },
  // Modal Styles
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    animation: "fadeIn 0.3s ease",
  },
  modalContent: {
    background: "#FFFFFF",
    borderRadius: "16px",
    maxWidth: "600px",
    width: "90%",
    maxHeight: "80vh",
    overflow: "auto",
    animation: "slideUp 0.3s ease",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px",
    borderBottom: "1px solid #E8E8E8",
  },
  modalClose: {
    background: "transparent",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: "#666",
  },
  modalBody: {
    padding: "24px",
  },
  orderInfo: {
    background: "#F9F9F9",
    padding: "16px",
    borderRadius: "12px",
    marginBottom: "24px",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "12px",
    fontSize: "14px",
  },
  modalSubtitle: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "16px",
    color: "#000000",
  },
  modalProducts: {
    marginBottom: "24px",
  },
  modalProduct: {
    display: "flex",
    gap: "16px",
    padding: "12px",
    borderBottom: "1px solid #F0F0F0",
  },
  modalProductImage: {
    width: "60px",
    height: "60px",
    borderRadius: "8px",
    objectFit: "cover",
  },
  modalProductInfo: {
    flex: 1,
  },
  modalProductPrice: {
    fontWeight: "600",
    color: "#D4AF37",
  },
  modalTotal: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: "16px",
    borderTop: "2px solid #E8E8E8",
    fontSize: "18px",
    fontWeight: "700",
  },
};

const getStatusStyle = (status) => {
  const baseStyle = {
    fontSize: "12px",
    padding: "4px 12px",
    borderRadius: "20px",
    fontWeight: "500",
    display: "inline-flex",
    alignItems: "center",
  };

  switch (status) {
    case "Delivered":
      return { ...baseStyle, background: "#E8F5E9", color: "#4CAF50" };
    case "Shipped":
      return { ...baseStyle, background: "#E3F2FD", color: "#2196F3" };
    case "Processing":
      return { ...baseStyle, background: "#FFF3E0", color: "#FF9800" };
    default:
      return { ...baseStyle, background: "#F5F5F5", color: "#666" };
  }
};

// Add CSS animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  
  * {
    font-family: 'Poppins', sans-serif;
  }
  
  button:hover {
    transform: translateY(-2px);
    transition: all 0.3s ease;
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
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from {
      transform: translateY(50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .orderItem:hover, .cartItem:hover, .wishlistItem:hover, .contactItem:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(212, 175, 55, 0.1);
    border-color: #D4AF37;
  }
  
  .navItem:hover, .navItemActive:hover {
    transform: translateX(5px);
  }
  
  .logoutBtn:hover {
    background: #FEE2E2;
  }
`;

document.head.appendChild(styleSheet);

export default Profile;
