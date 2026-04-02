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
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [focusedField, setFocusedField] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

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
    const newUser = {
      id: Date.now(),
      name: form.name,
      email: form.email,
      password: form.password,
      isSeller: form.isSeller,
      createdAt: new Date().toISOString(),
      ...(form.isSeller && {
        storeName: `${form.name}'s Store`,
        storeDescription: "Welcome to my store!",
        totalProducts: 0,
        totalSales: 0,
        sellerRating: 0,
      }),
    };
    users.push(newUser);
    localStorage.setItem("nivest_users", JSON.stringify(users));
    setSuccess("Account created successfully! Redirecting...");
    setTimeout(() => {
      signup(newUser);
      navigate(form.isSeller ? "/seller-dashboard" : "/");
    }, 1000);
  };

  const gold = "#C9A84C";
  const goldLight = "#E8C96D";
  const goldDark = "#A07830";
  const goldGrad = `linear-gradient(135deg, ${goldDark} 0%, ${gold} 50%, ${goldLight} 100%)`;

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      background:
        "linear-gradient(135deg, #f0eeec 0%, )",
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
      maxWidth: "1100px",
      width: "80%",
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
      padding: "2.5rem 2.5rem",
      background: "#ffffff",
      overflowY: "auto",
      maxHeight: "700px",
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
      color: "#aaa",
      fontSize: "0.8rem",
      marginBottom: "1.2rem",
    },
    goldDivider: {
      width: "40px",
      height: "2px",
      background: goldGrad,
      margin: "0 auto 1.4rem auto",
      borderRadius: "2px",
    },
    errorAlert: {
      background: "#fff5f5",
      borderLeft: "3px solid #e53e3e",
      color: "#e53e3e",
      padding: "0.6rem 0.9rem",
      borderRadius: "10px",
      fontSize: "0.78rem",
      marginBottom: "1rem",
    },
    successAlert: {
      background: "#f0fff4",
      borderLeft: "3px solid #38a169",
      color: "#38a169",
      padding: "0.6rem 0.9rem",
      borderRadius: "10px",
      fontSize: "0.78rem",
      marginBottom: "1rem",
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
      padding: "0.78rem 1rem 0.78rem 2.7rem",
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
    sellerToggle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "#fdfaf4",
      padding: "0.85rem 1rem",
      borderRadius: "14px",
      marginBottom: "1.1rem",
      cursor: "pointer",
      transition: "all 0.3s ease",
      border: `1.5px solid transparent`,
    },
    sellerToggleLeft: { display: "flex", alignItems: "center", gap: "0.8rem" },
    sellerCheckbox: {
      accentColor: gold,
      width: "1.2rem",
      height: "1.2rem",
      cursor: "pointer",
    },
    sellerFeatures: {
      background: "linear-gradient(135deg, #fffdf5 0%, #fdf4dc 100%)",
      borderRadius: "14px",
      padding: "1rem",
      marginBottom: "1.1rem",
      border: "1px solid rgba(201,168,76,0.28)",
    },
    sellerFeaturesTitle: {
      fontSize: "0.8rem",
      fontWeight: 700,
      color: goldDark,
      marginBottom: "0.7rem",
    },
    sellerFeatureItem: {
      fontSize: "0.75rem",
      color: "#888",
      marginBottom: "0.4rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      listStyle: "none",
    },
    checkboxGroup: {
      display: "flex",
      alignItems: "center",
      gap: "0.7rem",
      marginBottom: "1.1rem",
    },
    checkbox: {
      width: "1rem",
      height: "1rem",
      accentColor: gold,
      cursor: "pointer",
    },
    checkboxLabel: { fontSize: "0.78rem", color: "#888", cursor: "pointer" },
    link: { color: gold, textDecoration: "none", fontWeight: 700 },
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
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      boxShadow: "0 4px 16px rgba(201,168,76,0.35)",
    },
    divider: {
      textAlign: "center",
      margin: "1rem 0",
      color: "#ddd",
      fontSize: "0.78rem",
    },
    authLink: { textAlign: "center" },
    authLinkText: {
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
      minHeight: "700px",
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
                    <FaEyeSlash size={13} />
                  ) : (
                    <FaEye size={13} />
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

            <div
              style={styles.sellerToggle}
              onClick={() => setForm({ ...form, isSeller: !form.isSeller })}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = gold)}
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "transparent")
              }
            >
              <div style={styles.sellerToggleLeft}>
                {form.isSeller ? (
                  <FaStore size={22} color={gold} />
                ) : (
                  <FaUser size={22} color={gold} />
                )}
                <div>
                  <h4
                    style={{ margin: 0, fontSize: "0.85rem", color: "#1a1a1a" }}
                  >
                    {form.isSeller ? "Seller Account" : "Customer Account"}
                  </h4>
                  <p style={{ margin: 0, fontSize: "0.7rem", color: "#aaa" }}>
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
                    "Marketing tools to boost sales",
                  ].map((item) => (
                    <li key={item} style={styles.sellerFeatureItem}>
                      <FaCheckCircle size={11} color={gold} /> {item}
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
                  Terms & Conditions
                </Link>
              </label>
            </div>

            <button type="submit" style={styles.submitBtn}>
              {form.isSeller ? "Create Seller Account" : "Create Account"}{" "}
              <FaArrowRight size={12} />
            </button>
          </form>

          <div style={styles.divider}>or</div>
          <div style={styles.authLink}>
            <Link to="/login" style={styles.authLinkText}>
              Already have an account? <strong>Sign In</strong>
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

export default Signup;
