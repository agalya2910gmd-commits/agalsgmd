// pages/Profile.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
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
} from "react-icons/fa";

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  // State Management
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [wishlist, setWishlist] = useState([
    {
      id: 1,
      name: "Premium Gold Watch",
      price: "$299",
      img: "https://via.placeholder.com/100",
    },
    {
      id: 2,
      name: "Silk Evening Gown",
      price: "$450",
      img: "https://via.placeholder.com/100",
    },
    {
      id: 3,
      name: "Designer Leather Bag",
      price: "$120",
      img: "https://via.placeholder.com/100",
    },
  ]);

  const [formData, setFormData] = useState({
    name: user?.name || "Alex Johnson",
    email: user?.email || "alex.j@example.com",
    phone: user?.phone || "+91 98765 43210",
    address: user?.address || "123 Luxury Lane, Jubilee Hills",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  // Calculate stats
  const orderCount = 12;
  const savedCount = wishlist.length;

  return (
    <div style={styles.container}>
      {/* 3D Background Decorative Elements */}
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>

      <div style={styles.wrapper}>
        {/* Header */}
        <div style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.glassButton}>
            <FaArrowLeft />
          </button>
          <h1 style={styles.titleText}>Account Hub</h1>
          <div style={{ width: 45 }}></div>
        </div>

        <div style={styles.mainLayout}>
          {/* Left Side: 3D Profile Card */}
          <div style={styles.sidebar}>
            {/* 3D Animated Card */}
            <div style={styles.card3d}>
              <div style={styles.cardGradient}></div>
              <div style={styles.avatar3d}>{formData.name.charAt(0)}</div>
              <div style={styles.cardInfo3d}>
                <span style={styles.cardName}>{formData.name}</span>
                <p style={styles.cardRole}>Premium Member</p>
                <div style={styles.stats3d}>
                  <div style={styles.statItem}>
                    <div style={styles.statNum}>{orderCount}</div>
                    <div style={styles.statLabel}>Orders</div>
                  </div>
                  <div style={styles.statItem}>
                    <div style={styles.statNum}>{savedCount}</div>
                    <div style={styles.statLabel}>Saved</div>
                  </div>
                </div>
              </div>
              <button
                style={styles.cardButton}
                onClick={() => setIsEditing(!isEditing)}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scale(1.05)";
                  e.target.style.background = "#D4AF37";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                  e.target.style.background =
                    "linear-gradient(135deg, #D4AF37, #B8860B)";
                }}
              >
                {isEditing ? "Save Profile" : "Edit Profile"}
              </button>
            </div>

            {/* Navigation */}
            <div style={styles.navStack}>
              <button
                onClick={() => setActiveTab("profile")}
                style={
                  activeTab === "profile" ? styles.navBtnActive : styles.navBtn
                }
              >
                <FaUser /> Profile Info
              </button>
              <button
                onClick={() => setActiveTab("wishlist")}
                style={
                  activeTab === "wishlist" ? styles.navBtnActive : styles.navBtn
                }
              >
                <FaHeart /> My Wishlist
              </button>
              <button onClick={logout} style={styles.logoutBtn}>
                <FaSignOutAlt /> Sign Out
              </button>
            </div>
          </div>

          {/* Right Side: Content Area */}
          <div style={styles.contentArea}>
            <div style={styles.glassCardMain}>
              {activeTab === "profile" ? (
                <div className="fade-in">
                  <div style={styles.sectionHeader}>
                    <h3 style={styles.innerTitle}>General Settings</h3>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      style={isEditing ? styles.saveBtn : styles.editBtn}
                    >
                      {isEditing ? (
                        <>
                          <FaSave /> Save
                        </>
                      ) : (
                        <>
                          <FaEdit /> Edit
                        </>
                      )}
                    </button>
                  </div>

                  <div style={styles.formGrid}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Full Name</label>
                      <input
                        disabled={!isEditing}
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        style={
                          isEditing ? styles.inputActive : styles.inputStatic
                        }
                      />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Email Address</label>
                      <input
                        disabled={!isEditing}
                        name="email"
                        value={formData.email}
                        style={styles.inputStatic}
                      />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Phone Number</label>
                      <input
                        disabled={!isEditing}
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        style={
                          isEditing ? styles.inputActive : styles.inputStatic
                        }
                      />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Address</label>
                      <input
                        disabled={!isEditing}
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        style={
                          isEditing ? styles.inputActive : styles.inputStatic
                        }
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="fade-in">
                  <h3 style={styles.innerTitle}>
                    My Wishlist ({wishlist.length})
                  </h3>
                  {wishlist.length > 0 ? (
                    <div style={styles.wishlistGrid}>
                      {wishlist.map((item) => (
                        <div key={item.id} style={styles.wishlistItem}>
                          <img
                            src={item.img}
                            alt="product"
                            style={styles.wishImg}
                          />
                          <div style={{ flex: 1 }}>
                            <h4 style={styles.wishName}>{item.name}</h4>
                            <p style={styles.wishPrice}>{item.price}</p>
                          </div>
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            style={styles.deleteBtn}
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={styles.emptyState}>
                      <FaHeart size={50} color="#D4AF37" />
                      <p>Your wishlist is empty.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #f3f0f0 0%, #1A1A1A 50%, #2C2C2C 100%)",
    padding: "70px 20px",
    fontFamily: "'Poppins', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  blob1: {
    position: "absolute",
    width: "400px",
    height: "400px",
    background: "rgba(212, 175, 55, 0.1)",
    borderRadius: "50%",
    top: "-100px",
    right: "-100px",
    filter: "blur(80px)",
  },
  blob2: {
    position: "absolute",
    width: "300px",
    height: "300px",
    background: "rgba(212, 175, 55, 0.08)",
    borderRadius: "50%",
    bottom: "-50px",
    left: "-50px",
    filter: "blur(60px)",
  },
  wrapper: {
    maxWidth: "1100px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  glassButton: {
    background: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(212, 175, 55, 0.3)",
    padding: "12px",
    borderRadius: "12px",
    cursor: "pointer",
    color: "#D4AF37",
    transition: "all 0.3s ease",
  },
  titleText: {
    fontSize: "28px",
    fontWeight: "800",
    background: "linear-gradient(to right, #D4AF37, #FFFFFF)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  mainLayout: {
    display: "grid",
    gridTemplateColumns: "320px 1fr",
    gap: "30px",
  },
  sidebar: {
    display: "flex",
    flexDirection: "column",
  },
  // 3D Card Styles
  card3d: {
    width: "100%",
    height: "300px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    gap: "10px",
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    borderRadius: "24px",
    position: "relative",
    overflow: "hidden",
    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    marginBottom: "20px",
    cursor: "pointer",
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
    border: "1px solid rgba(212, 175, 55, 0.2)",
  },
  cardGradient: {
    content: '""',
    width: "100%",
    height: "100px",
    position: "absolute",
    top: 0,
    borderTopLeftRadius: "24px",
    borderTopRightRadius: "24px",
    borderBottom: "3px solid rgba(212, 175, 55, 0.8)",
    background:
      "linear-gradient(135deg, #D4AF37 0%, #B8860B 50%, #8B691B 100%)",
    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  avatar3d: {
    width: "90px",
    height: "90px",
    background: "linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)",
    borderRadius: "30px",
    border: "4px solid #D4AF37",
    marginTop: "30px",
    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "40px",
    fontWeight: "bold",
    color: "#000000",
    boxShadow: "0 10px 20px rgba(212, 175, 55, 0.3)",
    zIndex: 1,
  },
  cardInfo3d: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    zIndex: 1,
  },
  cardName: {
    fontWeight: 700,
    fontSize: "22px",
    color: "#FFFFFF",
    marginTop: "12px",
  },
  cardRole: {
    color: "#D4AF37",
    fontSize: "13px",
    margin: 0,
  },
  stats3d: {
    display: "flex",
    gap: "24px",
    marginTop: "8px",
  },
  statItem: {
    textAlign: "center",
  },
  statNum: {
    fontWeight: 800,
    fontSize: "18px",
    color: "#D4AF37",
  },
  statLabel: {
    fontSize: "11px",
    color: "#CCCCCC",
    fontWeight: 500,
  },
  cardButton: {
    textDecoration: "none",
    background: "linear-gradient(135deg, #D4AF37, #B8860B)",
    color: "#000000",
    padding: "8px 24px",
    borderRadius: "40px",
    border: "1px solid rgba(212, 175, 55, 0.5)",
    transition: "all 0.5s ease",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px",
    marginTop: "8px",
    zIndex: 1,
  },
  navStack: {
    background: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(10px)",
    borderRadius: "24px",
    padding: "10px",
    border: "1px solid rgba(212, 175, 55, 0.2)",
  },
  navBtn: {
    width: "100%",
    padding: "15px",
    border: "none",
    background: "transparent",
    textAlign: "left",
    fontSize: "15px",
    fontWeight: "600",
    color: "#CCCCCC",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderRadius: "15px",
    transition: "0.3s",
  },
  navBtnActive: {
    width: "100%",
    padding: "15px",
    border: "none",
    background:
      "linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(184, 134, 11, 0.1))",
    color: "#D4AF37",
    fontSize: "15px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderRadius: "15px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
    border: "1px solid rgba(212, 175, 55, 0.3)",
  },
  logoutBtn: {
    width: "100%",
    padding: "15px",
    border: "none",
    background: "transparent",
    color: "#ff4757",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "10px",
    borderRadius: "15px",
    transition: "0.3s",
  },
  contentArea: { perspective: "1000px" },
  glassCardMain: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(15px)",
    borderRadius: "24px",
    padding: "40px",
    border: "1px solid rgba(212, 175, 55, 0.3)",
    boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
    minHeight: "500px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "30px",
  },
  innerTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#000000",
  },
  editBtn: {
    padding: "8px 20px",
    borderRadius: "12px",
    border: "1px solid #D4AF37",
    color: "#D4AF37",
    background: "transparent",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
  saveBtn: {
    padding: "8px 20px",
    borderRadius: "12px",
    border: "none",
    color: "#000000",
    background: "linear-gradient(135deg, #D4AF37, #B8860B)",
    cursor: "pointer",
    fontWeight: "600",
    boxShadow: "0 5px 15px rgba(212, 175, 55, 0.3)",
    transition: "all 0.3s ease",
  },
  formGrid: { display: "grid", gap: "20px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#666",
    textTransform: "uppercase",
  },
  inputStatic: {
    padding: "15px",
    borderRadius: "15px",
    border: "1px solid #E0E0E0",
    background: "#F9F9F9",
    color: "#333",
    fontSize: "15px",
  },
  inputActive: {
    padding: "15px",
    borderRadius: "15px",
    border: "2px solid #D4AF37",
    background: "#FFFFFF",
    color: "#000000",
    fontSize: "15px",
    outline: "none",
  },
  wishlistGrid: { display: "flex", flexDirection: "column", gap: "15px" },
  wishlistItem: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    padding: "15px",
    background: "#FFFFFF",
    borderRadius: "20px",
    border: "1px solid #F0F0F0",
    transition: "0.3s ease",
  },
  wishImg: {
    width: "70px",
    height: "70px",
    borderRadius: "15px",
    objectFit: "cover",
  },
  wishName: { fontSize: "16px", fontWeight: "600", color: "#000000" },
  wishPrice: { color: "#D4AF37", fontWeight: "700" },
  deleteBtn: {
    background: "#FFF0F0",
    color: "#FF4757",
    border: "none",
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  emptyState: { textAlign: "center", padding: "100px 0", color: "#999" },
};

// Add hover effects via CSS injection
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap');
  
  .fade-in {
    animation: fadeIn 0.5s ease forwards;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  button:active { transform: scale(0.95); }
  
  .wishlistItem:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(212, 175, 55, 0.1);
    border-color: #D4AF37;
  }
  
  /* 3D Card Hover Effects */
  .card-3d:hover {
    transform: scale(1.02);
    box-shadow: 0 20px 40px rgba(212, 175, 55, 0.2);
  }
  
  .navBtn:hover, .logoutBtn:hover {
    background: rgba(212, 175, 55, 0.1);
    transform: translateX(5px);
  }
  
  .editBtn:hover {
    background: rgba(212, 175, 55, 0.1);
  }
  
  .deleteBtn:hover {
    background: #FFE0E0;
    transform: scale(1.05);
  }
`;

// Add hover effect to the card
const addCardHover = () => {
  const cards = document.querySelectorAll(".card-3d");
  cards.forEach((card) => {
    card.addEventListener("mouseenter", (e) => {
      const gradient = card.querySelector(".card-gradient");
      if (gradient) {
        gradient.style.height = "100%";
        gradient.style.borderRadius = "24px";
      }
      const avatar = card.querySelector(".avatar-3d");
      if (avatar) avatar.style.transform = "scale(1.05)";
      const info = card.querySelector(".card-info-3d");
      if (info) info.style.transform = "translate(0%, -10%)";
    });
    card.addEventListener("mouseleave", (e) => {
      const gradient = card.querySelector(".card-gradient");
      if (gradient) {
        gradient.style.height = "100px";
        gradient.style.borderRadius = "24px 24px 0 0";
      }
      const avatar = card.querySelector(".avatar-3d");
      if (avatar) avatar.style.transform = "scale(1)";
      const info = card.querySelector(".card-info-3d");
      if (info) info.style.transform = "translate(0%, 0%)";
    });
  });
};

// Run after component mount
setTimeout(addCardHover, 100);

document.head.appendChild(styleSheet);

export default Profile;
