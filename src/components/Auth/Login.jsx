// Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaUserShield,
  FaStore,
  FaUser,
} from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fashionImage =
    "https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&fit=crop";

  // Hardcoded private admin credentials (not visible in UI)
  const PRIVATE_ADMIN = {
    email: "admin@nivest.com",
    password: "admin123",
    userData: {
      id: 1,
      name: "Admin User",
      email: "admin@nivest.com",
      role: "admin",
      isAdmin: true,
      isSeller: false,
    },
  };

  const demoAccounts = {
    seller: {
      email: "seller@nivest.com",
      password: "seller123",
      userData: {
        id: 2,
        name: "Demo Seller",
        email: "seller@nivest.com",
        role: "seller",
        isSeller: true,
        isAdmin: false,
      },
    },
    customer: {
      email: "customer@nivest.com",
      password: "customer123",
      userData: {
        id: 3,
        name: "Demo Customer",
        email: "customer@nivest.com",
        role: "customer",
        isSeller: false,
        isAdmin: false,
      },
    },
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    // Check for private admin login first (hardcoded, not in localStorage)
    if (
      form.email === PRIVATE_ADMIN.email &&
      form.password === PRIVATE_ADMIN.password
    ) {
      login(PRIVATE_ADMIN.userData);
      setSuccess(`Welcome ${PRIVATE_ADMIN.userData.name}! Redirecting...`);
      setTimeout(() => navigate("/admin"), 1000);
      setIsLoading(false);
      return;
    }

    // Demo seller login
    if (
      form.email === demoAccounts.seller.email &&
      form.password === demoAccounts.seller.password
    ) {
      login(demoAccounts.seller.userData);
      setSuccess(
        `Welcome ${demoAccounts.seller.userData.name}! Redirecting...`,
      );
      setTimeout(() => navigate("/seller-dashboard"), 1000);
      setIsLoading(false);
      return;
    }

    // Demo customer login
    if (
      form.email === demoAccounts.customer.email &&
      form.password === demoAccounts.customer.password
    ) {
      login(demoAccounts.customer.userData);
      setSuccess(
        `Welcome ${demoAccounts.customer.userData.name}! Redirecting...`,
      );
      setTimeout(() => navigate("/"), 1000);
      setIsLoading(false);
      return;
    }

    // Backend login for registered users
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid credentials");
        setIsLoading(false);
        return;
      }

      // Login successful
      login(data.user);
      setSuccess("Login successful! Redirecting...");

      // Correct redirect logic based on user role
      if (data.user.role === "admin") {
        setTimeout(() => navigate("/admin"), 1000);
      } else if (data.user.role === "seller") {
        setTimeout(() => navigate("/seller-dashboard"), 1000);
      } else {
        setTimeout(() => navigate("/"), 1000);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        "Server connection failed. Please make sure the backend server is running.",
      );
      setIsLoading(false);
    }
  };

  const fillDemoAccount = (type) => {
    setForm({
      email: demoAccounts[type].email,
      password: demoAccounts[type].password,
    });
    setError("");
    setSuccess("");
  };

  const gold = "#C9A84C";

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      background: "#fff",
    },
    left: {
      width: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "40px",
      flexDirection: "column",
    },
    right: {
      width: "50%",
    },
    image: {
      width: "100%",
      height: "100vh",
      objectFit: "cover",
    },
    heading: {
      fontSize: "2rem",
      marginBottom: "10px",
      color: "#111",
    },
    subText: {
      color: "#777",
      marginBottom: "25px",
    },
    inputWrapper: {
      width: "100%",
      maxWidth: "400px",
      position: "relative",
      marginBottom: "18px",
    },
    input: {
      width: "100%",
      padding: "14px 45px",
      borderRadius: "10px",
      border: `1.5px solid #ddd`,
      outline: "none",
      fontSize: "15px",
      transition: "all 0.2s ease",
    },
    icon: {
      position: "absolute",
      top: "50%",
      left: "15px",
      transform: "translateY(-50%)",
      color: gold,
    },
    eyeBtn: {
      position: "absolute",
      top: "50%",
      right: "15px",
      transform: "translateY(-50%)",
      border: "none",
      background: "none",
      cursor: "pointer",
      color: gold,
    },
    button: {
      width: "100%",
      maxWidth: "400px",
      padding: "14px",
      border: "none",
      borderRadius: "10px",
      background: gold,
      color: "#fff",
      fontWeight: "bold",
      cursor: isLoading ? "not-allowed" : "pointer",
      marginTop: "10px",
      opacity: isLoading ? 0.7 : 1,
    },
    linkSection: {
      marginTop: "20px",
      textAlign: "center",
    },
    link: {
      color: gold,
      textDecoration: "none",
      fontWeight: "600",
      display: "block",
      marginTop: "10px",
    },
    demoButtons: {
      display: "flex",
      gap: "10px",
      marginBottom: "20px",
    },
    demoBtn: {
      padding: "8px 15px",
      border: `1px solid ${gold}`,
      borderRadius: "20px",
      background: "transparent",
      cursor: "pointer",
      color: gold,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <FaUserShield size={40} color={gold} />
        <h2 style={styles.heading}>Login</h2>
        <p style={styles.subText}>Sign in to continue your journey</p>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <div style={styles.demoButtons}>
          <button
            style={styles.demoBtn}
            onClick={() => fillDemoAccount("customer")}
          >
            <FaUser />
          </button>
          <button
            style={styles.demoBtn}
            onClick={() => fillDemoAccount("seller")}
          >
            <FaStore />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ width: "100%", maxWidth: "400px" }}
        >
          <div style={styles.inputWrapper}>
            <FaEnvelope style={styles.icon} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              style={{
                ...styles.input,
                border: `1.5px solid ${focusedField === "email" ? gold : "#ddd"}`,
              }}
            />
          </div>

          <div style={styles.inputWrapper}>
            <FaLock style={styles.icon} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              style={{
                ...styles.input,
                border: `1.5px solid ${focusedField === "password" ? gold : "#ddd"}`,
              }}
            />
            <button
              type="button"
              style={styles.eyeBtn}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button type="submit" style={styles.button} disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}{" "}
            {!isLoading && <FaArrowRight />}
          </button>
        </form>

        <div style={styles.linkSection}>
          <Link to="/signup" style={styles.link}>
            Customer Registration
          </Link>

          <Link to="/signup?type=seller" style={styles.link}>
            Register as Seller →
          </Link>
        </div>
      </div>

      <div style={styles.right}>
        <img src={fashionImage} alt="fashion" style={styles.image} />
      </div>
    </div>
  );
}

export default Login;
