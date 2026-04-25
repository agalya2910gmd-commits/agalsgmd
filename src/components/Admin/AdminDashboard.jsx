// src/components/Admin/AdminDashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import DashboardHome from "./DashboardHome";
import ProductsManagement from "./ProductsManagement";
import OrdersManagement from "./OrdersManagement";
import UsersManagement from "./User";
import Analytics from "./Analytics";
import ShippingManagement from "./ShippingManagement";
import ReturnsManagement from "./ReturnsManagement";
import PaymentsManagement from "./PaymentsManagement";
import AdminProfile from "./AdminProfile";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { products: globalProducts, fetchProducts } = useProducts();
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [usersCount, setUsersCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [users, setUsers] = useState([]);
  const [returns, setReturns] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0
  });

  // FETCH real-time data from backend
  const fetchData = useCallback(() => {
    console.log("[Admin] Refreshing dashboard data...");
    
    // USERS
    fetch("http://localhost:5000/api/admin-all-users")
      .then(res => res.json())
      .then(data => {
        setUsers(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error("Users fetch error:", err));

    // GENERAL STATS
    fetch("http://localhost:5000/api/admin/general-stats")
      .then(res => res.json())
      .then(data => {
        setUsersCount(data.totalUsers || 0);
        setStats({
          totalUsers: data.totalUsers || 0,
          totalOrders: data.totalOrders || 0,
          totalProducts: data.totalProducts || 0,
          totalRevenue: data.totalRevenue || 0
        });
      })
      .catch(err => console.error("Stats fetch error:", err));

    // ORDERS
    fetch("http://localhost:5000/api/admin-all-orders")
      .then(res => res.json())
      .then(data => {
        console.log("Orders:", data);
        if (Array.isArray(data)) {
          setOrders(data.map(o => ({
            id: o.id,
            customer: o.user_name || o.customer || o.user_id || "Guest",
            date: (o.created_at || o.date)?.split('T')[0] || o.date || "N/A",
            items: parseInt(o.quantity || o.items || 1),
            total: parseFloat(o.total_amount || o.total || 0),
            status: (o.order_status || o.status || "pending").toLowerCase(),
            product_name: o.product_name,
            price: parseFloat(o.price || 0),
            seller_id: o.seller_id,
            seller_name: o.seller_name,
            shippingAddress: o.shipping_address || o.shippingAddress,
            payment_method: o.payment_method || o.paymentMethod || o.payment_mode
        })));
      }
    })
      .catch(err => console.error("Orders fetch error:", err));

    // PAYMENTS
    fetch("http://localhost:5000/api/admin-all-payments")
      .then(res => res.json())
      .then(data => {
        console.log("Payments:", data);
        if (Array.isArray(data)) {
          setPayments(data.map(p => ({
            id: String(p.payment_id),
            orderId: p.order_id,
            customer: p.customer_name || p.customer_id || "Customer",
            amount: parseFloat(p.amount || 0),
            method: p.payment_method || "Online",
            date: p.created_at?.split('T')[0] || "N/A",
            status: (p.payment_status || "pending").toLowerCase()
          })));
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Payments fetch error:", err);
        setIsLoading(false);
      });

    // DELIVERIES
    fetch("http://localhost:5000/api/admin-all-deliveries")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDeliveries(data.map(d => ({
            id: String(d.delivery_id),
            orderId: d.order_id,
            customer: "Customer",
            address: d.shipping_address_snapshot || "N/A",
            status: (d.shipping_status || "pending").toLowerCase(),
            tracking: d.awb_code || "",
            courier_name: d.courier_name || "N/A"
          })));
        }
      })
      .catch(err => console.error("Deliveries fetch error:", err));
  }, []);

  useEffect(() => {
    fetchData();
    // Use interval as requested for "Re-render After New Order" effect
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  useEffect(() => {
    const path = location.pathname;
    if (path === "/admin" || path === "/admin/") setActiveTab("dashboard");
    else if (path.includes("/products")) setActiveTab("products");
    else if (path.includes("/orders")) setActiveTab("orders");
    else if (path.includes("/shipping")) setActiveTab("shipping");
    else if (path.includes("/returns")) setActiveTab("returns");
    else if (path.includes("/payments")) setActiveTab("payments");
    else if (path.includes("/users")) setActiveTab("users");
    else if (path.includes("/analytics")) setActiveTab("analytics");
    else if (path.includes("/profile")) setActiveTab("profile");
    else setActiveTab("dashboard");
  }, [location.pathname]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      );
    }

    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardHome
            stats={stats}
            orders={orders}
            products={globalProducts}
            payments={payments}
          />
        );
      case "products":
        return (
          <ProductsManagement />
        );
      case "orders":
        return <OrdersManagement orders={orders} setOrders={setOrders} />;
      case "shipping":
        return (
          <ShippingManagement
            shippingOrders={deliveries}
            setShippingOrders={setDeliveries}
            orders={orders}
          />
        );
      case "returns":
        return (
          <ReturnsManagement
            returns={returns}
            setReturns={setReturns}
            orders={orders}
          />
        );
      case "payments":
        return (
          <PaymentsManagement
            payments={payments}
            setPayments={setPayments}
            orders={orders}
          />
        );
      case "users":
        return <UsersManagement users={users} setUsers={setUsers} usersCount={usersCount} />;
      case "analytics":
        return (
          <Analytics
            stats={stats}
            orders={orders}
            products={globalProducts}
            payments={payments}
          />
        );
      case "profile":
        return <AdminProfile />;
      default:
        return (
          <DashboardHome
            stats={stats}
            orders={orders}
            products={globalProducts}
            payments={payments}
          />
        );
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      localStorage.removeItem("nivest_user");
      localStorage.removeItem("nivest_user_type");
      navigate("/login");
    }
  };

  const getAdminName = () => {
    const user = localStorage.getItem("nivest_user");
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.name || "Admin";
    }
    return "Admin";
  };

  return (
    <div className="admin-dashboard">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="admin-main">
        <div className="admin-header">
          <div className="header-left">
            <h1>Admin Dashboard</h1>
            <p className="header-subtitle">Manage your store efficiently</p>
          </div>
          <div className="admin-user">
            <div className="admin-info-header">
              <span className="admin-name">Welcome, {getAdminName()}</span>
              <span className="admin-role">Administrator</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
        <div className={`admin-content ${activeTab === "analytics" ? "full-screen-content" : ""}`}>
          {isLoading ? (
            <div className="loading-container" style={{ padding: "40px", textAlign: "center" }}>
              <h2 style={{ color: "#1a1d23" }}>Loading...</h2>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
