// components/Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  FaSearch,
  FaHeart,
  FaShoppingBag,
  FaUser,
  FaChevronDown,
  FaSignOutAlt,
  FaUserCircle,
  FaTachometerAlt,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap');
  
  * { margin: 0; padding: 0; box-sizing: border-box; }

  .nav-link {
    background: none; 
    border: none; 
    color: #1a1a1a; 
    cursor: pointer;
    font-family: 'Inter', sans-serif; 
    font-size: 14px; 
    letter-spacing: 0.5px;
    font-weight: 500; 
    padding: 8px 0; 
    position: relative;
    transition: all 0.3s ease; 
    text-decoration: none;
  }
  .nav-link:hover, .nav-link.active { color: #D4AF37; }
  .nav-link.active::after {
    content: ''; 
    position: absolute; 
    bottom: -2px; 
    left: 0; 
    right: 0;
    height: 2px; 
    background: #D4AF37; 
    border-radius: 2px;
  }

  .icon-btn {
    background: transparent; 
    border: none; 
    color: #1a1a1a;
    cursor: pointer; 
    padding: 10px; 
    transition: all 0.3s ease;
    display: flex; 
    align-items: center; 
    justify-content: center;
    position: relative; 
    text-decoration: none; 
    width: 44px; 
    height: 44px; 
    border-radius: 50%;
  }
  .icon-btn:hover { 
    background: rgba(212, 175, 55, 0.1); 
    color: #D4AF37; 
    transform: translateY(-1px); 
  }

  .badge {
    position: absolute; 
    top: -5px; 
    right: 2px;
    background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%);
    color: #ffffff; 
    font-size: 10px; 
    font-weight: 700; 
    border-radius: 20px;
    min-width: 18px; 
    height: 18px; 
    display: flex; 
    align-items: center; 
    justify-content: center;
    border: 1px solid rgba(255, 255, 255, 0.5);
  }

  .login-btn {
    display: flex; 
    align-items: center; 
    gap: 10px; 
    padding: 10px 28px;
    background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%);
    color: #ffffff; 
    text-decoration: none;
    border-radius: 100px; 
    font-size: 14px; 
    font-weight: 600;
    font-family: 'Inter', sans-serif; 
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
  }
  .login-btn:hover { 
    background: linear-gradient(135deg, #C5A028 0%, #A8760A 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
  }

  .user-menu { position: relative; }
  .user-menu-trigger {
    background: transparent; 
    border: 1px solid #e0e0e0;
    cursor: pointer; 
    padding: 8px 16px 8px 12px; 
    border-radius: 100px;
    display: flex; 
    align-items: center; 
    gap: 10px; 
    color: #1a1a1a; 
    transition: all 0.3s ease;
    font-family: 'Inter', sans-serif;
  }
  .user-menu-trigger:hover { 
    border-color: #D4AF37; 
    background: rgba(212, 175, 55, 0.05);
  }

  .user-dropdown {
    position: absolute; 
    top: calc(100% + 12px); 
    right: 0;
    background: #ffffff; 
    border-radius: 16px; 
    min-width: 260px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1); 
    border: 1px solid #e0e0e0;
    overflow: hidden; 
    z-index: 1000; 
    animation: dropdownSlide 0.25s ease-out;
  }
  @keyframes dropdownSlide {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .user-info {
    padding: 20px; 
    display: flex; 
    align-items: center; 
    gap: 12px;
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.05), rgba(184, 134, 11, 0.02));
    border-bottom: 1px solid #f0f0f0;
  }
  .user-name-full { 
    color: #1a1a1a; 
    font-size: 15px; 
    font-weight: 600; 
    font-family: 'Inter', sans-serif; 
    margin-bottom: 2px;
  }
  .user-email { 
    color: #666; 
    font-size: 12px; 
    font-family: 'Inter', sans-serif; 
  }

  .dropdown-divider { 
    height: 1px; 
    background: #f0f0f0; 
    margin: 4px 0;
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 12px 20px;
    background: transparent;
    border: none;
    cursor: pointer;
    color: #1a1a1a;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    transition: all 0.2s ease;
    text-align: left;
    gap: 12px;
  }

  .dropdown-item .item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    font-size: 16px;
    color: #D4AF37;
    flex-shrink: 0;
  }

  .dropdown-item:hover {
    background: rgba(212, 175, 55, 0.08);
    color: #D4AF37;
  }

  .dropdown-item.logout { 
    color: #dc2626; 
  }
  .dropdown-item.logout .item-icon { 
    color: #dc2626; 
  }
  .dropdown-item.logout:hover { 
    background: rgba(220, 38, 38, 0.08); 
  }

  .admin-badge {
    background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%);
    color: white;
    font-size: 10px;
    font-weight: bold;
    padding: 2px 8px;
    border-radius: 12px;
    margin-left: 8px;
    letter-spacing: 0.5px;
  }

  .search-overlay {
    position: fixed; 
    inset: 0; 
    z-index: 9999; 
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px); 
    display: flex; 
    align-items: flex-start;
    justify-content: center; 
    padding-top: 150px;
  }
  .search-input-line {
    background: none; 
    border: none; 
    border-bottom: 2px solid #D4AF37;
    color: #1a1a1a; 
    font-family: 'Playfair Display', serif; 
    font-size: 32px;
    width: 100%; 
    outline: none; 
    padding-bottom: 14px;
  }
  .search-input-line::placeholder {
    color: #ccc;
  }
`;

if (!document.getElementById("nivest-css")) {
  const s = document.createElement("style");
  s.id = "nivest-css";
  s.textContent = globalCSS;
  document.head.appendChild(s);
}

const T = {
  serif: { fontFamily: "'Playfair Display', serif" },
  sans: { fontFamily: "'Inter', sans-serif" },
};

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartCount, wishlist } = useStore();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Debug log to check values
  useEffect(() => {
    console.log("Navbar - User:", user);
    console.log("Navbar - isAdmin:", isAdmin);
    console.log("Navbar - isAuthenticated:", isAuthenticated);
  }, [user, isAdmin, isAuthenticated]);

  useEffect(() => {
    const closeMenu = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))
        setShowUserMenu(false);
    };
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  return (
    <>
      <nav
        style={{
          position: "sticky",
          top: 0,
          width: "100%",
          zIndex: 100,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 48px",
          background: "#ffffff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        {/* Left Nav Links */}
        <div style={{ display: "flex", gap: 32 }}>
          {["shop", "company", "blog", "contact"].map((p) => (
            <Link
              key={p}
              to={`/${p}`}
              className={`nav-link ${location.pathname === `/${p}` ? "active" : ""}`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Link>
          ))}
        </div>

        {/* Center Logo */}
        <Link to="/" style={{ textDecoration: "none" }}>
          <h2
            style={{
              ...T.serif,
              fontWeight: 800,
              letterSpacing: 3,
              color: "#D4AF37",
              fontSize: 26,
              margin: 0,
            }}
          >
            NIVEST
          </h2>
        </Link>

        {/* Right Icons */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button className="icon-btn" onClick={() => setSearchOpen(true)}>
            <FaSearch size={18} />
          </button>

          <Link to="/wishlist" className="icon-btn">
            <FaHeart size={18} />
            {wishlist.length > 0 && (
              <span className="badge">{wishlist.length}</span>
            )}
          </Link>

          <Link to="/cart" className="icon-btn">
            <FaShoppingBag size={18} />
            {getCartCount() > 0 && (
              <span className="badge">{getCartCount()}</span>
            )}
          </Link>

          <div
            style={{
              width: 1,
              height: 30,
              background: "#e0e0e0",
              margin: "0 8px",
            }}
          />

          {/* User Menu (when logged in) */}
          {isAuthenticated ? (
            <div className="user-menu" ref={userMenuRef}>
              <button
                className="user-menu-trigger"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <FaUserCircle size={22} style={{ color: "#D4AF37" }} />
                <span style={{ ...T.sans, fontSize: 14, fontWeight: 500 }}>
                  {user?.name?.split(" ")[0] ||
                    user?.email?.split("@")[0] ||
                    "User"}
                </span>
                {isAdmin && <span className="admin-badge">Admin</span>}
                <FaChevronDown
                  size={11}
                  style={{
                    opacity: 0.6,
                    transform: showUserMenu ? "rotate(180deg)" : "none",
                    transition: "transform 0.3s ease",
                  }}
                />
              </button>

              {showUserMenu && (
                <div className="user-dropdown">
                  {/* User Info Header */}
                  <div className="user-info">
                    <FaUserCircle size={44} style={{ color: "#D4AF37" }} />
                    <div>
                      <p className="user-name-full">
                        {user?.name || user?.email}
                        {isAdmin && (
                          <span
                            className="admin-badge"
                            style={{ marginLeft: "8px" }}
                          >
                            Admin
                          </span>
                        )}
                      </p>
                      <p className="user-email">{user?.email}</p>
                    </div>
                  </div>

                  {/* My Profile */}
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      navigate("/profile");
                      setShowUserMenu(false);
                    }}
                  >
                    <span className="item-icon">
                      <FaUserCircle />
                    </span>
                    <span>My Profile</span>
                  </button>

                  {/* Admin Dashboard - Show for admin users */}
                  {isAdmin && (
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        navigate("/admin");
                        setShowUserMenu(false);
                      }}
                    >
                      <span className="item-icon">
                        <FaTachometerAlt />
                      </span>
                      <span>Admin Dashboard</span>
                    </button>
                  )}

                  <div className="dropdown-divider" />

                  {/* Logout */}
                  <button
                    className="dropdown-item logout"
                    onClick={() => {
                      logout();
                      navigate("/");
                      setShowUserMenu(false);
                    }}
                  >
                    <span className="item-icon">
                      <FaSignOutAlt />
                    </span>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-btn">
              <FaUser size={13} />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="search-overlay" onClick={() => setSearchOpen(false)}>
          <div
            style={{ width: "100%", maxWidth: 600, padding: "0 24px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              autoFocus
              className="search-input-line"
              placeholder="Search products..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  navigate(`/search?q=${e.target.value.trim()}`);
                  setSearchOpen(false);
                }
                if (e.key === "Escape") setSearchOpen(false);
              }}
            />
            <p
              style={{
                color: "#999",
                fontSize: 13,
                marginTop: 16,
                fontFamily: "'Inter', sans-serif",
                textAlign: "center",
              }}
            >
              Press Enter to search · Esc to close
            </p>
          </div>
        </div>
      )}
    </>
  );
}
