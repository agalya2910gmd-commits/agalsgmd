// components/Auth/Signup.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaStore,
  FaArrowRight,
  FaCheckCircle,
  FaUserShield,
} from "react-icons/fa";

function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    isSeller: false,
    isAdmin: false, // Add admin flag
    adminSecret: "", // Add secret code for admin creation
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [focusedField, setFocusedField] = useState(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const customerImages = [
    "https://images.pexels.com/photos/4386327/pexels-photo-4386327.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",
  ];
  const sellerImages = [
    "https://images.pexels.com/photos/837140/pexels-photo-837140.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",
  ];
  const currentImages = form.isSeller ? sellerImages : customerImages;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % currentImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [currentImages.length]);

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (!form.agreeTerms) {
      setError("Please agree to the Terms & Conditions");
      return;
    }

    const users = JSON.parse(localStorage.getItem("nivest_users") || "[]");
    if (users.find((u) => u.email === form.email)) {
      setError("An account with this email already exists");
      return;
    }

    // Check for admin secret code
    let isAdmin = false;
    if (form.adminSecret === "ADMIN2024") {
      isAdmin = true;
    }

    const newUser = {
      id: Date.now(),
      name: form.name,
      email: form.email,
      password: form.password,
      isSeller: form.isSeller && !isAdmin, // Can't be both seller and admin
      isAdmin: isAdmin,
      role: isAdmin ? "admin" : form.isSeller ? "seller" : "customer",
      createdAt: new Date().toISOString(),
      ...(form.isSeller &&
        !isAdmin && {
          storeName: `${form.name}'s Store`,
          storeDescription: "Welcome to my store!",
          totalProducts: 0,
          totalSales: 0,
          sellerRating: 0,
        }),
    };

    users.push(newUser);
    localStorage.setItem("nivest_users", JSON.stringify(users));

    setSuccess(
      isAdmin
        ? "Admin account created! Redirecting..."
        : "Account created successfully! Redirecting...",
    );

    setTimeout(() => {
      signup(newUser);
      if (isAdmin) {
        navigate("/admin");
      } else if (form.isSeller) {
        navigate("/seller-dashboard");
      } else {
        navigate("/");
      }
    }, 1000);
  };

  const gold = "#C9A84C";
  const goldLight = "#F0D878";
  const goldDark = "#A07830";
  const goldGrad = `linear-gradient(135deg, ${goldDark} 0%, ${gold} 50%, ${goldLight} 100%)`;
  const goldGradShine = `linear-gradient(135deg, #8B6520 0%, #C9A84C 30%, #F0D878 55%, #C9A84C 75%, #A07830 100%)`;

  const keyframes = `
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 32px 80px rgba(201,168,76,0.28), 0 4px 24px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.9); }
      50%       { box-shadow: 0 32px 80px rgba(201,168,76,0.42), 0 4px 24px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.9); }
    }
    @keyframes floatBlob {
      0%, 100% { transform: scale(1) translate(0, 0); }
      50%       { transform: scale(1.08) translate(12px, -12px); }
    }
  `;

  const styles = {
    container: {
      height: "100vh",
      width: "100vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background:
        "linear-gradient(145deg, #fdfaf3 0%, #f7f0e0 45%, #f2e8cc 100%)",
      position: "relative",
      overflow: "hidden",
    },
    bgCircle1: {
      position: "absolute",
      width: "500px",
      height: "500px",
      borderRadius: "50%",
      background:
        "radial-gradient(circle, rgba(240,216,120,0.30) 0%, rgba(201,168,76,0.12) 45%, transparent 70%)",
      top: "-150px",
      left: "-150px",
      pointerEvents: "none",
      animation: "floatBlob 8s ease-in-out infinite",
    },
    bgCircle2: {
      position: "absolute",
      width: "460px",
      height: "460px",
      borderRadius: "50%",
      background:
        "radial-gradient(circle, rgba(240,216,120,0.22) 0%, rgba(201,168,76,0.08) 50%, transparent 70%)",
      bottom: "-100px",
      right: "-100px",
      pointerEvents: "none",
      animation: "floatBlob 10s ease-in-out infinite reverse",
    },
    bgCircle3: {
      position: "absolute",
      width: "280px",
      height: "280px",
      borderRadius: "50%",
      background:
        "radial-gradient(circle, rgba(255,240,180,0.18) 0%, transparent 70%)",
      top: "25%",
      right: "20%",
      pointerEvents: "none",
    },
    wrapper: {
      display: "flex",
      width: "min(1060px, 92vw)",
      height: "min(700px, 94vh)",
      background: "linear-gradient(160deg, #ffffff 0%, #fdfbf5 100%)",
      borderRadius: "28px",
      overflow: "auto",
      animation: "pulseGlow 5s ease-in-out infinite",
      border: "1px solid rgba(240,216,120,0.50)",
      position: "relative",
      zIndex: 1,
    },
    cardGloss: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "3px",
      background: goldGradShine,
      backgroundSize: "200% auto",
      animation: "shimmer 3s linear infinite",
      zIndex: 10,
      borderRadius: "28px 28px 0 0",
    },
    leftSection: {
      width: "420px",
      minWidth: "420px",
      padding: "1.8rem 2.4rem",
      background: "linear-gradient(180deg, #ffffff 0%, #fdfbf6 100%)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      overflowY: "auto",
      position: "relative",
    },
    leftGloss: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "160px",
      background:
        "linear-gradient(180deg, rgba(255,252,240,0.85) 0%, transparent 100%)",
      pointerEvents: "none",
      zIndex: 0,
    },
    logoRow: {
      textAlign: "center",
      marginBottom: "0.1rem",
      position: "relative",
      zIndex: 1,
    },
    logoText: {
      fontSize: "1.7rem",
      fontWeight: 800,
      background: goldGradShine,
      backgroundSize: "200% auto",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      letterSpacing: "5px",
      animation: "shimmer 4s linear infinite",
    },
    logoTagline: {
      textAlign: "center",
      fontSize: "0.6rem",
      letterSpacing: "2.5px",
      color: "#c8ae70",
      marginBottom: "0.1rem",
      textTransform: "uppercase",
      position: "relative",
      zIndex: 1,
    },
    heading: {
      textAlign: "center",
      fontSize: "1.15rem",
      fontWeight: 700,
      color: "#1a1410",
      margin: "0.3rem 0 0.08rem",
      position: "relative",
      zIndex: 1,
    },
    subText: {
      textAlign: "center",
      color: "#b8a47a",
      fontSize: "0.72rem",
      marginBottom: "0.85rem",
      position: "relative",
      zIndex: 1,
    },
    goldDivider: {
      width: "36px",
      height: "2.5px",
      background: goldGradShine,
      backgroundSize: "200% auto",
      animation: "shimmer 3s linear infinite",
      margin: "0 auto 0.9rem auto",
      borderRadius: "2px",
      position: "relative",
      zIndex: 1,
    },
    errorAlert: {
      background: "linear-gradient(135deg, #fff8f8 0%, #fff0f0 100%)",
      borderLeft: "3px solid #e53e3e",
      color: "#c53030",
      padding: "0.45rem 0.85rem",
      borderRadius: "10px",
      fontSize: "0.72rem",
      marginBottom: "0.75rem",
      boxShadow: "0 2px 8px rgba(229,62,62,0.10)",
      position: "relative",
      zIndex: 1,
    },
    successAlert: {
      background: "linear-gradient(135deg, #f6fff9 0%, #edfff4 100%)",
      borderLeft: "3px solid #38a169",
      color: "#276749",
      padding: "0.45rem 0.85rem",
      borderRadius: "10px",
      fontSize: "0.72rem",
      marginBottom: "0.75rem",
      boxShadow: "0 2px 8px rgba(56,161,105,0.10)",
      position: "relative",
      zIndex: 1,
    },
    formGroup: { marginBottom: "0.75rem", position: "relative", zIndex: 1 },
    label: {
      display: "block",
      fontSize: "0.62rem",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "1.2px",
      color: gold,
      marginBottom: "0.25rem",
    },
    inputWrapper: { position: "relative" },
    inputIcon: {
      position: "absolute",
      left: "0.95rem",
      top: "50%",
      transform: "translateY(-50%)",
      color: focusedField ? gold : "#d4bc88",
      fontSize: "0.8rem",
      transition: "color 0.3s ease",
    },
    input: {
      width: "100%",
      padding: "0.65rem 1rem 0.65rem 2.6rem",
      border: `1.5px solid ${focusedField ? gold : "#e8dcc0"}`,
      borderRadius: "12px",
      fontSize: "0.82rem",
      transition: "all 0.3s ease",
      background: focusedField
        ? "linear-gradient(135deg, #fffef8 0%, #fefbf0 100%)"
        : "linear-gradient(135deg, #fdfaf0 0%, #faf6e8 100%)",
      boxShadow: focusedField
        ? "0 0 0 3px rgba(201,168,76,0.15), 0 2px 8px rgba(201,168,76,0.12)"
        : "0 1px 4px rgba(160,120,48,0.06)",
      boxSizing: "border-box",
      outline: "none",
      color: "#1a1410",
    },
    passwordToggle: {
      position: "absolute",
      right: "0.95rem",
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      color: "#c4a55a",
      cursor: "pointer",
      fontSize: "0.8rem",
    },
    sellerToggle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "linear-gradient(135deg, #fdfbf0 0%, #faf5e0 100%)",
      padding: "0.65rem 0.9rem",
      borderRadius: "12px",
      marginBottom: "0.75rem",
      cursor: "pointer",
      transition: "all 0.3s ease",
      border: "1.5px solid rgba(201,168,76,0.28)",
      boxShadow: "0 2px 8px rgba(201,168,76,0.08)",
      position: "relative",
      zIndex: 1,
    },
    sellerToggleLeft: { display: "flex", alignItems: "center", gap: "0.75rem" },
    sellerCheckbox: {
      accentColor: gold,
      width: "1.1rem",
      height: "1.1rem",
      cursor: "pointer",
    },
    sellerFeatures: {
      background: "linear-gradient(135deg, #fffef8 0%, #fef6dc 100%)",
      borderRadius: "12px",
      padding: "0.75rem 1rem",
      marginBottom: "0.75rem",
      border: "1px solid rgba(201,168,76,0.35)",
      boxShadow: "0 3px 12px rgba(201,168,76,0.12)",
      position: "relative",
      zIndex: 1,
    },
    sellerFeaturesTitle: {
      fontSize: "0.72rem",
      fontWeight: 700,
      color: goldDark,
      marginBottom: "0.5rem",
    },
    sellerFeatureItem: {
      fontSize: "0.68rem",
      color: "#8a7550",
      marginBottom: "0.3rem",
      display: "flex",
      alignItems: "center",
      gap: "0.45rem",
      listStyle: "none",
    },
    adminSecretContainer: {
      background: "linear-gradient(135deg, #fff8f0 0%, #fff0e0 100%)",
      borderRadius: "12px",
      padding: "0.65rem 0.9rem",
      marginBottom: "0.75rem",
      border: "1px dashed rgba(201,168,76,0.50)",
      position: "relative",
      zIndex: 1,
    },
    adminSecretLabel: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      fontSize: "0.7rem",
      color: goldDark,
      marginBottom: "0.4rem",
      cursor: "pointer",
    },
    adminSecretInput: {
      width: "100%",
      padding: "0.5rem",
      border: `1px solid ${gold}`,
      borderRadius: "8px",
      fontSize: "0.75rem",
      background: "white",
      outline: "none",
    },
    checkboxGroup: {
      display: "flex",
      alignItems: "center",
      gap: "0.6rem",
      marginBottom: "0.85rem",
      position: "relative",
      zIndex: 1,
    },
    checkbox: {
      width: "1rem",
      height: "1rem",
      accentColor: gold,
      cursor: "pointer",
    },
    checkboxLabel: { fontSize: "0.72rem", color: "#a08858", cursor: "pointer" },
    link: { color: gold, textDecoration: "none", fontWeight: 700 },
    submitBtn: {
      width: "100%",
      padding: "0.78rem",
      border: "none",
      borderRadius: "12px",
      fontWeight: 700,
      fontSize: "0.75rem",
      textTransform: "uppercase",
      letterSpacing: "1.5px",
      background: goldGradShine,
      backgroundSize: "200% auto",
      animation: "shimmer 4s linear infinite",
      color: "#fff",
      transition: "all 0.3s ease",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      boxShadow:
        "0 6px 20px rgba(201,168,76,0.52), 0 2px 6px rgba(160,120,48,0.20), inset 0 1px 0 rgba(255,255,255,0.25)",
      position: "relative",
      zIndex: 1,
    },
    divider: {
      textAlign: "center",
      margin: "0.65rem 0",
      color: "#d4c090",
      fontSize: "0.72rem",
      position: "relative",
      zIndex: 1,
    },
    authLink: { textAlign: "center", position: "relative", zIndex: 1 },
    authLinkText: {
      color: gold,
      textDecoration: "none",
      fontWeight: 700,
      fontSize: "0.78rem",
    },
    rightSection: {
      flex: 1,
      position: "relative",
      overflow: "hidden",
      background: "#111",
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
      filter: "brightness(1.08) saturate(1.10)",
    },
    activeImage: { opacity: 0.88, transform: "scale(1)" },
    imageOverlay: {
      position: "absolute",
      inset: 0,
      background:
        "linear-gradient(160deg, rgba(180,140,48,0.30) 0%, rgba(0,0,0,0.48) 100%)",
      pointerEvents: "none",
    },
    imageShine: {
      position: "absolute",
      top: 0,
      left: "-60%",
      width: "40%",
      height: "100%",
      background:
        "linear-gradient(105deg, transparent 40%, rgba(255,240,180,0.10) 50%, transparent 60%)",
      animation: "shimmer 6s linear infinite",
      backgroundSize: "200% 100%",
      pointerEvents: "none",
      zIndex: 2,
    },
    imageBadge: {
      position: "absolute",
      bottom: "1.5rem",
      left: "1.5rem",
      right: "1.5rem",
      background: "rgba(255,255,255,0.10)",
      border: "1px solid rgba(240,216,120,0.55)",
      borderRadius: "14px",
      padding: "1rem 1.2rem",
      backdropFilter: "blur(10px)",
      boxShadow:
        "0 4px 24px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.15)",
      zIndex: 3,
    },
    imageBadgeTitle: {
      fontSize: "0.7rem",
      fontWeight: 700,
      letterSpacing: "2.5px",
      color: goldLight,
      marginBottom: "0.3rem",
      textTransform: "uppercase",
    },
    imageBadgeText: {
      fontSize: "0.72rem",
      color: "rgba(255,255,255,0.82)",
      lineHeight: 1.5,
      margin: 0,
    },
    dotIndicator: {
      position: "absolute",
      top: "1.2rem",
      right: "1.2rem",
      display: "flex",
      gap: "0.45rem",
      zIndex: 3,
    },
    dot: {
      width: "7px",
      height: "7px",
      borderRadius: "50%",
      background: "rgba(255,255,255,0.40)",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    activeDot: {
      width: "22px",
      borderRadius: "4px",
      background: goldGrad,
      boxShadow: "0 0 8px rgba(201,168,76,0.60)",
    },
  };

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.container}>
        <div style={styles.bgCircle1} />
        <div style={styles.bgCircle2} />
        <div style={styles.bgCircle3} />

        <div style={styles.wrapper}>
          <div style={styles.cardGloss} />

          <div style={styles.leftSection}>
            <div style={styles.leftGloss} />

            <div style={styles.logoRow}>
              <FaUserShield
                style={{
                  fontSize: "2rem",
                  color: gold,
                  marginBottom: "0.5rem",
                }}
              />
            </div>
            <p style={styles.logoTagline}>Men's &amp; Women's Collection</p>
            <h2 style={styles.heading}>Create Account</h2>
            <p style={styles.subText}>Join us and start your journey today</p>
            <div style={styles.goldDivider} />

            {error && <div style={styles.errorAlert}>{error}</div>}
            {success && <div style={styles.successAlert}>{success}</div>}

            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name</label>
                <div style={styles.inputWrapper}>
                  <FaUser style={styles.inputIcon} />
                  <input
                    type="text"
                    name="name"
                    style={styles.input}
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>

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
                    placeholder="Min. 6 characters"
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
                      <FaEyeSlash size={12} />
                    ) : (
                      <FaEye size={12} />
                    )}
                  </button>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Confirm Password</label>
                <div style={styles.inputWrapper}>
                  <FaLock style={styles.inputIcon} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    style={styles.input}
                    placeholder="Repeat password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("confirm")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>

              {/* Seller toggle */}
              <div
                style={styles.sellerToggle}
                onClick={() => setForm({ ...form, isSeller: !form.isSeller })}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = gold)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(201,168,76,0.28)")
                }
              >
                <div style={styles.sellerToggleLeft}>
                  {form.isSeller ? (
                    <FaStore size={18} color={gold} />
                  ) : (
                    <FaUser size={18} color={gold} />
                  )}
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: "#1a1410",
                      }}
                    >
                      {form.isSeller ? "Seller Account" : "Customer Account"}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.65rem",
                        color: "#b09060",
                      }}
                    >
                      {form.isSeller
                        ? "Sell products & manage your store"
                        : "Shop & discover amazing products"}
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  name="isSeller"
                  checked={form.isSeller}
                  onChange={handleChange}
                  style={styles.sellerCheckbox}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Admin Secret Code Section - Hidden by default, click to show */}
              <div style={styles.adminSecretContainer}>
                <div
                  style={styles.adminSecretLabel}
                  onClick={() => setShowAdminPanel(!showAdminPanel)}
                >
                  <FaUserShield size={14} />
                  <span>{showAdminPanel ? "Hide" : "Show"} Admin Options</span>
                </div>
                {showAdminPanel && (
                  <input
                    type="password"
                    name="adminSecret"
                    style={styles.adminSecretInput}
                    placeholder="Enter admin secret code"
                    value={form.adminSecret}
                    onChange={handleChange}
                  />
                )}
              </div>

              {form.isSeller && (
                <div style={styles.sellerFeatures}>
                  <p style={styles.sellerFeaturesTitle}>
                    ✨ As a seller, you get:
                  </p>
                  <ul style={{ margin: 0, padding: 0 }}>
                    {[
                      "List unlimited products",
                      "Real-time sales analytics",
                      "Competitive commission rates",
                      "Priority seller support",
                    ].map((item) => (
                      <li key={item} style={styles.sellerFeatureItem}>
                        <FaCheckCircle size={10} color={gold} /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={form.agreeTerms}
                  onChange={handleChange}
                  style={styles.checkbox}
                />
                <label htmlFor="agreeTerms" style={styles.checkboxLabel}>
                  I agree to the{" "}
                  <Link to="/terms" style={styles.link}>
                    Terms &amp; Conditions
                  </Link>
                </label>
              </div>

              <button type="submit" style={styles.submitBtn}>
                {form.isSeller ? "Create Seller Account" : "Create Account"}{" "}
                <FaArrowRight size={11} />
              </button>
            </form>

            <div style={styles.divider}>— or —</div>
            <div style={styles.authLink}>
              <Link to="/login" style={styles.authLinkText}>
                Already have an account? <strong>Sign In</strong>
              </Link>
            </div>
          </div>

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
            <div style={styles.imageOverlay} />
            <div style={styles.imageShine} />
            <div style={styles.imageBadge}>
              <p style={styles.imageBadgeTitle}>Join NIVEST</p>
              <p style={styles.imageBadgeText}>
                Exclusive men's &amp; women's fashion. Be the first to explore
                new arrivals.
              </p>
            </div>
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
    </>
  );
}

export default Signup;
