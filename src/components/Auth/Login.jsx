// components/Auth/Login.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaUserShield,
} from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [focusedField, setFocusedField] = useState(null);

  const loginImages = [
    "https://images.pexels.com/photos/994234/pexels-photo-994234.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",
    "https://images.pexels.com/photos/837140/pexels-photo-837140.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % loginImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [loginImages.length]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  // Pre-defined demo accounts
  const demoAccounts = {
    admin: {
      email: "admin@nivest.com",
      password: "admin123",
      userData: {
        id: 1,
        name: "Admin User",
        email: "admin@nivest.com",
        isAdmin: true,
        role: "admin",
        isSeller: false,
      },
    },
    seller: {
      email: "seller@nivest.com",
      password: "seller123",
      userData: {
        id: 2,
        name: "Seller User",
        email: "seller@nivest.com",
        isSeller: true,
        role: "seller",
        isAdmin: false,
      },
    },
    customer: {
      email: "customer@nivest.com",
      password: "customer123",
      userData: {
        id: 3,
        name: "Customer User",
        email: "customer@nivest.com",
        isSeller: false,
        role: "customer",
        isAdmin: false,
      },
    },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    // Check for demo accounts first
    if (
      form.email === demoAccounts.admin.email &&
      form.password === demoAccounts.admin.password
    ) {
      login(demoAccounts.admin.userData);
      setSuccess("Welcome Admin! Redirecting...");
      setTimeout(() => navigate("/admin"), 1000);
      return;
    }

    if (
      form.email === demoAccounts.seller.email &&
      form.password === demoAccounts.seller.password
    ) {
      login(demoAccounts.seller.userData);
      setSuccess("Welcome Seller! Redirecting...");
      setTimeout(() => navigate("/seller-dashboard"), 1000);
      return;
    }

    if (
      form.email === demoAccounts.customer.email &&
      form.password === demoAccounts.customer.password
    ) {
      login(demoAccounts.customer.userData);
      setSuccess("Welcome back! Redirecting...");
      setTimeout(() => navigate("/"), 1000);
      return;
    }

    // Check localStorage for existing users
    const users = JSON.parse(localStorage.getItem("nivest_users") || "[]");
    const foundUser = users.find(
      (u) => u.email === form.email && u.password === form.password,
    );

    if (foundUser) {
      // Ensure user has proper role fields
      const userToLogin = {
        ...foundUser,
        isAdmin: foundUser.isAdmin || foundUser.role === "admin" || false,
        isSeller: foundUser.isSeller || foundUser.role === "seller" || false,
        role: foundUser.role || (foundUser.isSeller ? "seller" : "customer"),
      };
      login(userToLogin);

      if (userToLogin.isAdmin) {
        setTimeout(() => navigate("/admin"), 1000);
      } else if (userToLogin.isSeller) {
        setTimeout(() => navigate("/seller-dashboard"), 1000);
      } else {
        setTimeout(() => navigate("/"), 1000);
      }
      return;
    }

    setError("Invalid credentials. Use demo accounts or sign up.");
  };

  const fillDemoAccount = (type) => {
    setForm({
      email: demoAccounts[type].email,
      password: demoAccounts[type].password,
    });
    setError("");
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
      width: "800px",
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
      width: "300px",
      height: "300px",
      borderRadius: "50%",
      background:
        "radial-gradient(circle, rgba(255,240,180,0.18) 0%, transparent 70%)",
      top: "30%",
      right: "18%",
      pointerEvents: "none",
    },
    wrapper: {
      display: "flex",
      width: "min(1800px, 92vw)",
      height: "min(620px, 88vh)",
      background: "linear-gradient(160deg, #ffffff 0%, #fdfbf5 100%)",
      borderRadius: "28px",
      overflow: "hidden",
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
      width: "480px",
      minWidth: "420px",
      padding: "2.2rem 2.4rem",
      background: "linear-gradient(180deg, #ffffff 0%, #fdfbf6 100%)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      position: "relative",
    },
    leftGloss: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "180px",
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
      fontSize: "1.8rem",
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
      fontSize: "1.3rem",
      fontWeight: 700,
      color: "#1a1410",
      margin: "0.3rem 0 0.1rem",
      position: "relative",
      zIndex: 1,
    },
    subText: {
      textAlign: "center",
      color: "#b8a47a",
      fontSize: "0.72rem",
      marginBottom: "1rem",
      position: "relative",
      zIndex: 1,
    },
    goldDivider: {
      width: "36px",
      height: "2.5px",
      background: goldGradShine,
      backgroundSize: "200% auto",
      animation: "shimmer 3s linear infinite",
      margin: "0 auto 1.2rem auto",
      borderRadius: "2px",
      position: "relative",
      zIndex: 1,
    },
    errorAlert: {
      background: "linear-gradient(135deg, #fff8f8 0%, #fff0f0 100%)",
      borderLeft: "3px solid #e53e3e",
      color: "#c53030",
      padding: "0.5rem 0.85rem",
      borderRadius: "10px",
      fontSize: "0.72rem",
      marginBottom: "0.85rem",
      boxShadow: "0 2px 8px rgba(229,62,62,0.10)",
      position: "relative",
      zIndex: 1,
    },
    successAlert: {
      background: "linear-gradient(135deg, #f6fff9 0%, #edfff4 100%)",
      borderLeft: "3px solid #38a169",
      color: "#276749",
      padding: "0.5rem 0.85rem",
      borderRadius: "10px",
      fontSize: "0.72rem",
      marginBottom: "0.85rem",
      boxShadow: "0 2px 8px rgba(56,161,105,0.10)",
      position: "relative",
      zIndex: 1,
    },
    demoAccountsContainer: {
      background: "linear-gradient(135deg, #fdfbf0 0%, #faf5e0 100%)",
      borderRadius: "12px",
      padding: "0.75rem",
      marginBottom: "1rem",
      border: "1px solid rgba(201,168,76,0.30)",
      position: "relative",
      zIndex: 1,
    },
    demoTitle: {
      fontSize: "0.65rem",
      fontWeight: 700,
      color: goldDark,
      textAlign: "center",
      marginBottom: "0.5rem",
      textTransform: "uppercase",
      letterSpacing: "1px",
    },
    demoButtons: {
      display: "flex",
      gap: "0.5rem",
      justifyContent: "center",
    },
    demoBtn: {
      background: "transparent",
      border: `1px solid ${gold}`,
      color: goldDark,
      padding: "0.3rem 0.8rem",
      borderRadius: "20px",
      fontSize: "0.65rem",
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    formGroup: { marginBottom: "1rem", position: "relative", zIndex: 1 },
    label: {
      display: "block",
      fontSize: "0.62rem",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "1.2px",
      color: gold,
      marginBottom: "0.28rem",
    },
    inputWrapper: { position: "relative" },
    inputIcon: {
      position: "absolute",
      left: "0.95rem",
      top: "50%",
      transform: "translateY(-50%)",
      color: focusedField ? gold : "#d4bc88",
      fontSize: "0.85rem",
      transition: "color 0.3s ease",
    },
    input: {
      width: "100%",
      padding: "0.75rem 1rem 0.75rem 2.6rem",
      border: `1.5px solid ${focusedField ? gold : "#e8dcc0"}`,
      borderRadius: "12px",
      fontSize: "0.85rem",
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
      fontSize: "0.85rem",
    },
    submitBtn: {
      width: "100%",
      padding: "0.85rem",
      border: "none",
      borderRadius: "12px",
      fontWeight: 700,
      fontSize: "0.78rem",
      textTransform: "uppercase",
      letterSpacing: "1.5px",
      background: goldGradShine,
      backgroundSize: "200% auto",
      animation: "shimmer 4s linear infinite",
      color: "#fff",
      transition: "all 0.3s ease",
      marginTop: "0.5rem",
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
      margin: "0.8rem 0",
      color: "#d4c090",
      fontSize: "0.72rem",
      position: "relative",
      zIndex: 1,
    },
    authLink: { textAlign: "center", position: "relative", zIndex: 1 },
    link: {
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
            <h2 style={styles.heading}>Welcome Back</h2>
            <p style={styles.subText}>Sign in to continue your journey</p>
            <div style={styles.goldDivider} />

            {error && <div style={styles.errorAlert}>{error}</div>}
            {success && <div style={styles.successAlert}>{success}</div>}

            {/* Demo Accounts Section */}
            <div style={styles.demoAccountsContainer}>
              <p style={styles.demoTitle}>✨ Demo Accounts ✨</p>
              <div style={styles.demoButtons}>
                <button
                  style={styles.demoBtn}
                  onClick={() => fillDemoAccount("admin")}
                >
                   Admin
                </button>
                <button
                  style={styles.demoBtn}
                  onClick={() => fillDemoAccount("seller")}
                >
                  Seller
                </button>
                <button
                  style={styles.demoBtn}
                  onClick={() => fillDemoAccount("customer")}
                >
                   Customer
                </button>
              </div>
            </div>

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
                      <FaEyeSlash size={14} />
                    ) : (
                      <FaEye size={14} />
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" style={styles.submitBtn}>
                Sign In <FaArrowRight size={12} />
              </button>
            </form>

            <div style={styles.divider}>— or —</div>
            <div style={styles.authLink}>
              <Link to="/signup" style={styles.link}>
                Don't have an account? <strong>Sign Up</strong>
              </Link>
            </div>
          </div>

          <div style={styles.rightSection}>
            {loginImages.map((img, index) => (
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
              <p style={styles.imageBadgeTitle}>NIVEST Fashion</p>
              <p style={styles.imageBadgeText}>
                Discover premium men's &amp; women's collections curated just
                for you
              </p>
            </div>
            <div style={styles.dotIndicator}>
              {loginImages.map((_, index) => (
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

export default Login;
