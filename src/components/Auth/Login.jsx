// components/Auth/Login.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaStore,
  FaArrowRight,
} from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [userType, setUserType] = useState("customer");
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const customerImages = [
   
    
    
    "https://images.pexels.com/photos/994234/pexels-photo-994234.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",
  ];

  const sellerImages = [
    "https://images.pexels.com/photos/837140/pexels-photo-837140.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",
  ];

  const currentImages = userType === "customer" ? customerImages : sellerImages;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % currentImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [currentImages.length]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleTempSignup = () => {
    if (!form.email || !form.password) {
      setError("Please enter email and password");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    const users = JSON.parse(localStorage.getItem("nivest_users") || "[]");
    const existingUser = users.find((u) => u.email === form.email);
    if (existingUser) {
      if (existingUser.isSeller === (userType === "seller")) {
        login(existingUser);
        navigate(userType === "seller" ? "/seller-dashboard" : "/");
      } else {
        setError(
          `This email is registered as a ${existingUser.isSeller ? "seller" : "customer"}`,
        );
      }
      return;
    }
    const newUser = {
      id: Date.now(),
      name: form.email.split("@")[0],
      email: form.email,
      password: form.password,
      isSeller: userType === "seller",
      createdAt: new Date().toISOString(),
      ...(userType === "seller" && {
        storeName: `${form.email.split("@")[0]}'s Store`,
        storeDescription: "Welcome to my store!",
        totalProducts: 0,
        totalSales: 0,
        sellerRating: 0,
      }),
    };
    users.push(newUser);
    localStorage.setItem("nivest_users", JSON.stringify(users));
    setSuccess("Account created! Logging you in...");
    setTimeout(() => {
      login(newUser);
      navigate(userType === "seller" ? "/seller-dashboard" : "/");
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }
    const users = JSON.parse(localStorage.getItem("nivest_users") || "[]");
    const foundUser = users.find(
      (u) => u.email === form.email && u.password === form.password,
    );
    if (!foundUser) {
      setError(
        "Invalid credentials. Use temporary signup to create an account",
      );
      return;
    }
    if (userType === "seller" && !foundUser.isSeller) {
      setError("This email is not registered as a seller");
      return;
    }
    if (userType === "customer" && foundUser.isSeller) {
      setError("This is a seller account. Please use the Seller tab");
      return;
    }
    login(foundUser);
    navigate(userType === "seller" ? "/seller-dashboard" : "/");
  };

  const gold = "#C9A84C";
  const goldLight = "#E8C96D";
  const goldDark = "#A07830";
  const goldGrad = `linear-gradient(135deg, ${goldDark} 0%, ${gold} 50%, ${goldLight} 100%)`;

  const styles = {
    container: {
      minHeight: "90vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      background:
        "linear-gradient(135deg, #f1efeb 0%, )",
      position: "relative",
      overflow: "hidden",
      
    },
    bgCircle1: {
      position: "absolute",
      width: "400px",
      height: "400px",
      borderRadius: "50%",
      background:
        "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)",
      top: "-100px",
      left: "-100px",
      pointerEvents: "none",
    },
    bgCircle2: {
      position: "absolute",
      width: "300px",
      height: "300px",
      borderRadius: "50%",
      background:
        "radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)",
      bottom: "-80px",
      right: "-80px",
      pointerEvents: "none",
    },
    wrapper: {
      display: "flex",
      maxWidth: "1400px",
      width: "1800px",
      background: "#ffffff",
      borderRadius: "32px",
      overflow: "hidden",
      boxShadow:
        "0 24px 60px rgba(160,120,48,0.18), 0 4px 20px rgba(0,0,0,0.07)",
      border: "1px solid rgba(201,168,76,0.22)",
      transform: isHovered ? "translateY(-3px)" : "translateY(0)",
      transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
    },

    /* ── LEFT: FORM ── */
    leftSection: {
      flex: 1,
      padding: "3rem 2.8rem",
      background: "#ffffff",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      overflowY: "auto",
    },
    logoRow: { textAlign: "center", marginBottom: "0.2rem" },
    logoText: {
      fontSize: "1.8rem",
      fontWeight: 800,
      background: goldGrad,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      letterSpacing: "4px",
    },
    heading: {
      textAlign: "center",
      fontSize: "1.3rem",
      fontWeight: 700,
      color: "#1a1a1a",
      margin: "0.3rem 0 0.15rem",
    },
    subText: {
      textAlign: "center",
      color: "#0c0c0c",
      fontSize: "0.8rem",
      marginBottom: "1.5rem",
    },
    goldDivider: {
      width: "40px",
      height: "2px",
      background: goldGrad,
      margin: "0 auto 1.5rem auto",
      borderRadius: "2px",
    },
    tabs: {
      display: "flex",
      gap: "0.7rem",
      background: "#f8f4ec",
      padding: "0.35rem",
      borderRadius: "50px",
      marginBottom: "1.3rem",
      border: "1px solid rgba(201,168,76,0.2)",
    },
    tabBtn: {
      flex: 1,
      padding: "0.6rem",
      border: "none",
      borderRadius: "50px",
      fontWeight: 600,
      fontSize: "0.82rem",
      transition: "all 0.3s ease",
      background: "transparent",
      color: "#aaa",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.4rem",
    },
    tabBtnActive: {
      background: goldGrad,
      color: "#fff",
      boxShadow: "0 4px 14px rgba(201,168,76,0.38)",
    },
    sellerInfo: {
      background: "linear-gradient(135deg, #fffdf5 0%, #fdf4dc 100%)",
      borderRadius: "12px",
      padding: "0.65rem 1rem",
      marginBottom: "1.1rem",
      textAlign: "center",
      border: "1px solid rgba(201,168,76,0.28)",
      fontSize: "0.78rem",
      color: goldDark,
      fontWeight: 500,
    },
    errorAlert: {
      background: "#fff5f5",
      borderLeft: "3px solid #e53e3e",
      color: "#e53e3e",
      padding: "0.6rem 0.9rem",
      borderRadius: "10px",
      fontSize: "0.78rem",
      marginBottom: "1.1rem",
    },
    successAlert: {
      background: "#f0fff4",
      borderLeft: "3px solid #38a169",
      color: "#38a169",
      padding: "0.6rem 0.9rem",
      borderRadius: "10px",
      fontSize: "0.78rem",
      marginBottom: "1.1rem",
    },
    formGroup: { marginBottom: "1.1rem" },
    label: {
      display: "block",
      fontSize: "0.7rem",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "1px",
      color: gold,
      marginBottom: "0.35rem",
    },
    inputWrapper: { position: "relative" },
    inputIcon: {
      position: "absolute",
      left: "1rem",
      top: "50%",
      transform: "translateY(-50%)",
      color: focusedField ? gold : "#ccc",
      fontSize: "0.9rem",
      transition: "color 0.3s ease",
    },
    input: {
      width: "100%",
      padding: "0.8rem 1rem 0.8rem 2.7rem",
      border: `1.5px solid ${focusedField ? gold : "#e8e0d0"}`,
      borderRadius: "14px",
      fontSize: "0.85rem",
      transition: "all 0.3s ease",
      background: focusedField ? "#fffdf8" : "#fdfaf4",
      boxSizing: "border-box",
      outline: "none",
      color: "#1a1a1a",
    },
    passwordToggle: {
      position: "absolute",
      right: "1rem",
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      color: "#bbb",
      cursor: "pointer",
    },
    submitBtn: {
      width: "100%",
      padding: "0.85rem",
      border: "none",
      borderRadius: "14px",
      fontWeight: 700,
      fontSize: "0.82rem",
      textTransform: "uppercase",
      letterSpacing: "1.5px",
      background: goldGrad,
      color: "#fff",
      transition: "all 0.3s ease",
      marginTop: "0.3rem",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      boxShadow: "0 4px 16px rgba(201,168,76,0.35)",
    },
    tempSignup: {
      background: "#fdfaf4",
      borderRadius: "16px",
      padding: "1rem",
      textAlign: "center",
      marginTop: "1.2rem",
      border: "1px dashed rgba(201,168,76,0.4)",
      fontSize: "0.78rem",
      color: "#999",
    },
    tempBtn: {
      background: "transparent",
      border: `1.5px solid ${gold}`,
      color: gold,
      padding: "0.5rem 1rem",
      borderRadius: "50px",
      fontSize: "0.75rem",
      fontWeight: 600,
      transition: "all 0.3s ease",
      cursor: "pointer",
      marginTop: "0.4rem",
    },
    divider: {
      textAlign: "center",
      margin: "1rem 0",
      color: "#ddd",
      fontSize: "0.78rem",
    },
    authLink: { textAlign: "center" },
    link: {
      color: gold,
      textDecoration: "none",
      fontWeight: 700,
      fontSize: "0.82rem",
    },

    /* ── RIGHT: IMAGE ── */
    rightSection: {
      flex: 1.2,
      position: "relative",
      overflow: "hidden",
      background: "#111",
      minHeight: "620px",
    },
    slidingImage: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      opacity: 0,
      transform: "scale(1.08)",
      transition: "opacity 1.2s ease-in-out, transform 6s ease-in-out",
    },
    activeImage: { opacity: 1, transform: "scale(1)" },
    imageBottomFade: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: "80px",
      background:
        "linear-gradient(to top, rgba(0,0,0,0.32) 0%, transparent 100%)",
    },
    dotIndicator: {
      position: "absolute",
      bottom: "1.1rem",
      left: "1.3rem",
      display: "flex",
      gap: "0.5rem",
    },
    dot: {
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      background: "rgba(255,255,255,0.45)",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    activeDot: { width: "26px", borderRadius: "4px", background: gold },
  };

  return (
    <div style={styles.container}>
      <div style={styles.bgCircle1} />
      <div style={styles.bgCircle2} />
      <div
        style={styles.wrapper}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* ── LEFT: FORM ── */}
        <div style={styles.leftSection}>
          <div style={styles.logoRow}>
            <span style={styles.logoText}>NIVEST</span>
          </div>
          <h2 style={styles.heading}>Login</h2>
          <p style={styles.subText}>Sign in to continue your journey</p>
          <div style={styles.goldDivider} />

          <div style={styles.tabs}>
            <button
              style={{
                ...styles.tabBtn,
                ...(userType === "customer" ? styles.tabBtnActive : {}),
              }}
              onClick={() => {
                setUserType("customer");
                setError("");
                setForm({ email: "", password: "" });
              }}
            >
              <FaUser size={12} /> Customer
            </button>
            <button
              style={{
                ...styles.tabBtn,
                ...(userType === "seller" ? styles.tabBtnActive : {}),
              }}
              onClick={() => {
                setUserType("seller");
                setError("");
                setForm({ email: "", password: "" });
              }}
            >
              <FaStore size={12} /> Seller
            </button>
          </div>

          {userType === "seller" && (
            <div style={styles.sellerInfo}>
              🔐 Secure Seller Portal — Manage Products & Orders
            </div>
          )}

          {error && <div style={styles.errorAlert}>{error}</div>}
          {success && <div style={styles.successAlert}>{success}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrapper}>
                <FaEnvelope style={styles.inputIcon} />
                <input
                  type="email"
                  name="email"
                  style={styles.input}
                  placeholder="hello@example.com"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <FaLock style={styles.inputIcon} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  style={styles.input}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                />
                <button
                  type="button"
                  style={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash size={13} />
                  ) : (
                    <FaEye size={13} />
                  )}
                </button>
              </div>
            </div>
            <button type="submit" style={styles.submitBtn}>
              {userType === "customer" ? "Sign In" : "Access Dashboard"}{" "}
              <FaArrowRight size={12} />
            </button>
          </form>

          <div style={styles.tempSignup}>
            <p style={{ margin: 0 }}>✨ New here? Create a temporary account</p>
            <button style={styles.tempBtn} onClick={handleTempSignup}>
              {userType === "customer"
                ? "Create Customer Account"
                : "Create Seller Account"}
            </button>
            <p
              style={{
                fontSize: "0.65rem",
                marginTop: "0.4rem",
                color: "#bbb",
                marginBottom: 0,
              }}
            >
              Enter email & password above, then click
            </p>
          </div>

          <div style={styles.divider}>or</div>
          <div style={styles.authLink}>
            <Link to="/signup" style={styles.link}>
              Don't have an account? <strong>Sign Up</strong>
            </Link>
          </div>
        </div>

        {/* ── RIGHT: IMAGE ── */}
        <div style={styles.rightSection}>
          {currentImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Slide ${index + 1}`}
              style={{
                ...styles.slidingImage,
                ...(currentImageIndex === index ? styles.activeImage : {}),
              }}
            />
          ))}
          <div style={styles.imageBottomFade} />
          <div style={styles.dotIndicator}>
            {currentImages.map((_, index) => (
              <div
                key={index}
                style={{
                  ...styles.dot,
                  ...(currentImageIndex === index ? styles.activeDot : {}),
                }}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
