// Signup.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  FaCalendarAlt,
  FaVenusMars,
} from "react-icons/fa";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    isSeller: false,
    agreeTerms: false,
    storeName: "",
    gstin: "",
    bankAccount: "",
    ifscCode: "",
    dob: "",
    gender: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Single attractive fashion image
  const fashionImage =
    "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&fit=crop";

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get("type");
    if (type === "seller") {
      setForm((prev) => ({ ...prev, isSeller: true }));
    }
  }, []);

  const validateConfirmPassword = (password, confirmPassword) => {
    if (confirmPassword && password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    } else {
      setConfirmPasswordError("");
      return true;
    }
  };

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    const fieldName = e.target.name;

    setForm({ ...form, [fieldName]: value });
    setError("");
    setSuccess("");

    // Validate confirm password when either password or confirmPassword changes
    if (fieldName === "password") {
      validateConfirmPassword(value, form.confirmPassword);
    } else if (fieldName === "confirmPassword") {
      validateConfirmPassword(form.password, value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (form.isSeller) {
      if (
        !form.storeName ||
        !form.gstin ||
        !form.bankAccount ||
        !form.ifscCode
      ) {
        setError("Please fill in all store and bank details");
        return;
      }
    }

    // Frontend password match validation
    if (form.password !== form.confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
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

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          isSeller: form.isSeller,
          store_name: form.storeName,
          gstin: form.gstin,
          bank_account: form.bankAccount,
          ifsc_code: form.ifscCode,
          dob: form.dob,
          gender: form.gender,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Signup failed");
        setIsLoading(false);
        return;
      }

      setSuccess(
        data.message ||
          "Account created successfully. Please login to continue.",
      );

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Signup error:", error);
      setError(
        "Server connection failed. Please make sure the backend server is running.",
      );
      setIsLoading(false);
    }
  };

  const gold = "#C9A84C";
  const goldLight = "#F0D878";
  const goldDark = "#A07830";
  const goldGrad = `linear-gradient(135deg, ${goldDark} 0%, ${gold} 50%, ${goldLight} 100%)`;
  const goldGradShine = `linear-gradient(135deg, #8B6520 0%, #C9A84C 30%, #F0D878 55%, #C9A84C 75%, #A07830 100%)`;

  const keyframes = `
    @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
    @keyframes pulseGlow { 0%, 100% { box-shadow: 0 20px 50px rgba(201,168,76,0.2); } 50% { box-shadow: 0 20px 50px rgba(201,168,76,0.35); } }
    @keyframes floatBlob { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
    @keyframes zoomIn { 0% { transform: scale(1.1); opacity: 0.7; } 100% { transform: scale(1); opacity: 1; } }
    @keyframes slideInRight { 0% { transform: translateX(20px); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
    @keyframes fadeInUp { 0% { transform: translateY(20px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
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
      position: "fixed",
      top: 0,
      left: 0,
      overflow: "hidden",
      padding: 0,
      margin: 0,
    },
    bgCircle1: {
      position: "absolute",
      width: "550px",
      height: "550px",
      borderRadius: "50%",
      background:
        "radial-gradient(circle, rgba(240,216,120,0.22) 0%, rgba(201,168,76,0.08) 45%, transparent 70%)",
      top: "-180px",
      left: "-180px",
      pointerEvents: "none",
      animation: "floatBlob 8s ease-in-out infinite",
    },
    bgCircle2: {
      position: "absolute",
      width: "380px",
      height: "380px",
      borderRadius: "50%",
      background:
        "radial-gradient(circle, rgba(240,216,120,0.18) 0%, rgba(201,168,76,0.06) 50%, transparent 70%)",
      bottom: "-80px",
      right: "-80px",
      pointerEvents: "none",
      animation: "floatBlob 10s ease-in-out infinite reverse",
    },
    bgCircle3: {
      position: "absolute",
      width: "200px",
      height: "200px",
      borderRadius: "50%",
      background:
        "radial-gradient(circle, rgba(255,240,180,0.12) 0%, transparent 70%)",
      top: "25%",
      right: "18%",
      pointerEvents: "none",
    },
    wrapper: {
      display: "flex",
      width: "100%",
      height: "100%",
      background: "linear-gradient(160deg, #ffffff 0%, #fdfbf5 100%)",
      borderRadius: 0,
      overflow: "hidden",
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
    },
    leftSection: {
      width: "50%",
      padding: "2rem 3rem",
      background: "linear-gradient(180deg, #ffffff 0%, #fdfbf6 100%)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      overflowY: "auto",
      paddingTop: "2.5rem",
      paddingBottom: "2.5rem",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
      position: "relative",
      animation: "slideInRight 0.8s ease-out",
    },
    leftGloss: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "100px",
      background:
        "linear-gradient(180deg, rgba(255,252,240,0.7) 0%, transparent 100%)",
      pointerEvents: "none",
      zIndex: 0,
    },
    logoRow: {
      textAlign: "center",
      marginBottom: "0.3rem",
      position: "relative",
      zIndex: 1,
      animation: "fadeInUp 0.6s ease-out",
    },
    logoText: {
      fontSize: "2rem",
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
      fontSize: "0.65rem",
      letterSpacing: "3px",
      color: "#c8ae70",
      marginBottom: "0.2rem",
      textTransform: "uppercase",
    },
    heading: {
      textAlign: "center",
      fontSize: "1.6rem",
      fontWeight: 700,
      color: "#1a1410",
      margin: "0.3rem 0 0.2rem",
      animation: "fadeInUp 0.7s ease-out",
    },
    subText: {
      textAlign: "center",
      color: "#b8a47a",
      fontSize: "0.85rem",
      marginBottom: "1.2rem",
      animation: "fadeInUp 0.8s ease-out",
    },
    goldDivider: {
      width: "48px",
      height: "3px",
      background: goldGradShine,
      backgroundSize: "200% auto",
      animation: "shimmer 3s linear infinite",
      margin: "0 auto 1.2rem auto",
      borderRadius: "2px",
    },
    errorAlert: {
      background: "linear-gradient(135deg, #fff8f8 0%, #fff0f0 100%)",
      borderLeft: "3px solid #e53e3e",
      color: "#c53030",
      padding: "0.6rem 1rem",
      borderRadius: "10px",
      fontSize: "0.75rem",
      marginBottom: "0.8rem",
      animation: "fadeInUp 0.3s ease-out",
    },
    successAlert: {
      background: "linear-gradient(135deg, #f6fff9 0%, #edfff4 100%)",
      borderLeft: "3px solid #38a169",
      color: "#276749",
      padding: "0.6rem 1rem",
      borderRadius: "10px",
      fontSize: "0.75rem",
      marginBottom: "0.8rem",
      animation: "fadeInUp 0.3s ease-out",
    },
    formGroup: { marginBottom: "1rem", animation: "fadeInUp 0.9s ease-out" },
    label: {
      display: "block",
      fontSize: "0.7rem",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "1.2px",
      color: gold,
      marginBottom: "0.4rem",
    },
    inputWrapper: { position: "relative" },
    inputIcon: {
      position: "absolute",
      left: "1rem",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#d4bc88",
      fontSize: "0.9rem",
      pointerEvents: "none",
    },
    input: {
      width: "100%",
      padding: "0.8rem 1rem 0.8rem 2.75rem",
      border: `1.5px solid ${focusedField ? gold : "#e8dcc0"}`,
      borderRadius: "14px",
      fontSize: "0.85rem",
      transition: "all 0.2s ease",
      background: focusedField
        ? "linear-gradient(135deg, #fffef8 0%, #fefbf0 100%)"
        : "linear-gradient(135deg, #fdfaf0 0%, #faf6e8 100%)",
      boxSizing: "border-box",
      outline: "none",
    },
    passwordToggle: {
      position: "absolute",
      right: "1rem",
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      color: "#c4a55a",
      cursor: "pointer",
    },
    sellerFeatures: {
      background: "linear-gradient(135deg, #fffef8 0%, #fef6dc 100%)",
      borderRadius: "14px",
      padding: "0.8rem",
      marginBottom: "1rem",
      border: "1px solid rgba(201,168,76,0.35)",
      animation: "fadeInUp 1.1s ease-out",
    },
    sellerFeaturesTitle: {
      fontSize: "0.8rem",
      fontWeight: 700,
      color: goldDark,
      marginBottom: "0.6rem",
    },
    sellerFeatureItem: {
      fontSize: "0.75rem",
      color: "#8a7550",
      marginBottom: "0.4rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      listStyle: "none",
    },
    checkboxGroup: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      marginBottom: "1rem",
      animation: "fadeInUp 1.3s ease-out",
    },
    checkbox: {
      width: "1.1rem",
      height: "1.1rem",
      accentColor: gold,
      cursor: "pointer",
    },
    checkboxLabel: { fontSize: "0.8rem", color: "#a08858", cursor: "pointer" },
    link: { color: gold, textDecoration: "none", fontWeight: 700 },
    submitBtn: {
      width: "100%",
      padding: "0.9rem",
      border: "none",
      borderRadius: "14px",
      fontWeight: 700,
      fontSize: "0.85rem",
      textTransform: "uppercase",
      letterSpacing: "1.5px",
      background: goldGradShine,
      backgroundSize: "200% auto",
      animation: "shimmer 4s linear infinite",
      color: "#fff",
      cursor: isLoading ? "not-allowed" : "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.75rem",
      boxShadow: "0 6px 20px rgba(201,168,76,0.4)",
      transition: "all 0.3s ease",
      opacity: isLoading ? 0.7 : 1,
    },
    rightSection: {
      width: "50%",
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
      animation: "zoomIn 1.2s ease-out",
      filter: "brightness(1.05) saturate(1.1)",
    },
    imageOverlay: {
      position: "absolute",
      inset: 0,
      background:
        "linear-gradient(160deg, rgba(180,140,48,0.2) 0%, rgba(0,0,0,0.4) 100%)",
    },
    imageShine: {
      position: "absolute",
      top: 0,
      left: "-60%",
      width: "40%",
      height: "100%",
      background:
        "linear-gradient(105deg, transparent 40%, rgba(255,240,180,0.12) 50%, transparent 60%)",
      animation: "shimmer 6s linear infinite",
      pointerEvents: "none",
      zIndex: 2,
    },
    imageBadge: {
      position: "absolute",
      bottom: "2rem",
      left: "2rem",
      right: "2rem",
      background: "rgba(255,255,255,0.12)",
      border: "1px solid rgba(240,216,120,0.6)",
      borderRadius: "16px",
      padding: "1.2rem 1.5rem",
      backdropFilter: "blur(12px)",
      zIndex: 3,
      animation: "slideInRight 0.8s ease-out",
    },
    imageBadgeTitle: {
      fontSize: "0.75rem",
      fontWeight: 700,
      letterSpacing: "2.5px",
      color: goldLight,
      marginBottom: "0.5rem",
      textTransform: "uppercase",
    },
    imageBadgeText: {
      fontSize: "0.8rem",
      color: "rgba(255,255,255,0.9)",
      lineHeight: 1.5,
      margin: 0,
    },
    errorMessage: {
      color: "#e53e3e",
      fontSize: "0.7rem",
      marginTop: "0.4rem",
      marginLeft: "0.5rem",
      display: "flex",
      alignItems: "center",
      gap: "0.3rem",
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
                  fontSize: "2.2rem",
                  color: gold,
                  marginBottom: "0.3rem",
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
                    style={{
                      ...styles.input,
                      borderColor: focusedField === "name" ? gold : "#e8dcc0",
                    }}
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
                    style={{
                      ...styles.input,
                      borderColor: focusedField === "email" ? gold : "#e8dcc0",
                    }}
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
                    style={{
                      ...styles.input,
                      borderColor:
                        focusedField === "password" ? gold : "#e8dcc0",
                    }}
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
                      <FaEyeSlash size={14} />
                    ) : (
                      <FaEye size={14} />
                    )}
                  </button>
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Confirm Password</label>
                <div style={styles.inputWrapper}>
                  <FaLock style={styles.inputIcon} />
                  <input
                    type="password"
                    name="confirmPassword"
                    style={{
                      ...styles.input,
                      borderColor: confirmPasswordError
                        ? "#e53e3e"
                        : focusedField === "confirm"
                          ? gold
                          : "#e8dcc0",
                    }}
                    placeholder="Repeat password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("confirm")}
                    onBlur={() => {
                      setFocusedField(null);
                      validateConfirmPassword(
                        form.password,
                        form.confirmPassword,
                      );
                    }}
                  />
                </div>
                {confirmPasswordError && (
                  <div style={styles.errorMessage}>
                    <span>⚠️</span> {confirmPasswordError}
                  </div>
                )}
              </div>

              {/* Customer-only fields (shown when isSeller is false) */}
              {!form.isSeller && (
                <>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Date of Birth</label>
                    <div style={styles.inputWrapper}>
                      <FaCalendarAlt style={styles.inputIcon} />
                      <input
                        type="date"
                        name="dob"
                        style={{
                          ...styles.input,
                          borderColor:
                            focusedField === "dob" ? gold : "#e8dcc0",
                        }}
                        value={form.dob}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("dob")}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Gender</label>
                    <div style={styles.inputWrapper}>
                      <FaVenusMars style={styles.inputIcon} />
                      <select
                        name="gender"
                        style={{
                          ...styles.input,
                          borderColor:
                            focusedField === "gender" ? gold : "#e8dcc0",
                          appearance: "none",
                        }}
                        value={form.gender}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("gender")}
                        onBlur={() => setFocusedField(null)}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Seller-only fields (shown when isSeller is true) */}
              {form.isSeller && (
                <>
                  <div
                    style={{
                      marginTop: "1.5rem",
                      marginBottom: "1rem",
                      padding: "0.5rem 0",
                      borderTop: "1.5px solid rgba(201,168,76,0.15)",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 800,
                        color: goldDark,
                        textTransform: "uppercase",
                        letterSpacing: "2px",
                        background: "#fff",
                        padding: "0 15px",
                        position: "relative",
                        top: "-20px",
                      }}
                    >
                      Store Details
                    </span>
                  </div>
                  <div style={{ ...styles.formGroup, animationDelay: "0.1s" }}>
                    <label style={styles.label}>Store Name</label>
                    <div style={styles.inputWrapper}>
                      <FaStore style={styles.inputIcon} />
                      <input
                        type="text"
                        name="storeName"
                        style={{
                          ...styles.input,
                          borderColor:
                            focusedField === "storeName" ? gold : "#e8dcc0",
                        }}
                        placeholder="e.g. Fashion Hub"
                        value={form.storeName}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("storeName")}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>
                  </div>
                  <div style={{ ...styles.formGroup, animationDelay: "0.2s" }}>
                    <label style={styles.label}>GST IN</label>
                    <div style={styles.inputWrapper}>
                      <FaCheckCircle style={styles.inputIcon} />
                      <input
                        type="text"
                        name="gstin"
                        style={{
                          ...styles.input,
                          borderColor:
                            focusedField === "gstin" ? gold : "#e8dcc0",
                        }}
                        placeholder="15-digit GST Number"
                        value={form.gstin}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("gstin")}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>
                  </div>
                  <div style={{ ...styles.formGroup, animationDelay: "0.3s" }}>
                    <label style={styles.label}>Bank Account Number</label>
                    <div style={styles.inputWrapper}>
                      <FaLock style={styles.inputIcon} />
                      <input
                        type="text"
                        name="bankAccount"
                        style={{
                          ...styles.input,
                          borderColor:
                            focusedField === "bankAccount" ? gold : "#e8dcc0",
                        }}
                        placeholder="Your Account Number"
                        value={form.bankAccount}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("bankAccount")}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>
                  </div>
                  <div style={{ ...styles.formGroup, animationDelay: "0.4s" }}>
                    <label style={styles.label}>IFSC Code</label>
                    <div style={styles.inputWrapper}>
                      <FaArrowRight style={styles.inputIcon} />
                      <input
                        type="text"
                        name="ifscCode"
                        style={{
                          ...styles.input,
                          borderColor:
                            focusedField === "ifscCode" ? gold : "#e8dcc0",
                        }}
                        placeholder="e.g. SBIN0001234"
                        value={form.ifscCode}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("ifscCode")}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>
                  </div>
                  <div style={styles.sellerFeatures}>
                    <p style={styles.sellerFeaturesTitle}>
                      As a seller, you get:
                    </p>
                    <ul style={{ margin: 0, padding: 0 }}>
                      {[
                        "List unlimited products",
                        "Real-time sales analytics",
                        "Competitive commission rates",
                        "Priority seller support",
                      ].map((item) => (
                        <li key={item} style={styles.sellerFeatureItem}>
                          <FaCheckCircle size={11} color={gold} /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
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
                  <a href="/terms" style={styles.link}>
                    Terms &amp; Conditions
                  </a>
                </label>
              </div>
              <button
                type="submit"
                style={styles.submitBtn}
                disabled={isLoading}
              >
                {isLoading
                  ? "Creating Account..."
                  : form.isSeller
                    ? "Create Seller Account"
                    : "Create Customer Account"}{" "}
                {!isLoading && <FaArrowRight size={12} />}
              </button>
            </form>
          </div>
          <div style={styles.rightSection}>
            <img src={fashionImage} alt="Fashion" style={styles.slidingImage} />
            <div style={styles.imageOverlay} />
            <div style={styles.imageShine} />
            <div style={styles.imageBadge}>
              <p style={styles.imageBadgeTitle}>Join NIVEST</p>
              <p style={styles.imageBadgeText}>
                Exclusive men's &amp; women's fashion. Be the first to explore
                new arrivals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
