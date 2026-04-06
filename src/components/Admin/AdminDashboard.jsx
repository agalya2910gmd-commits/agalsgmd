// src/components/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
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
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalShipping: 0,
    totalReturns: 0,
    totalPayments: 0,
  });

  // Initialize state variables
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Modern Chair",
      price: 99.99,
      category: "Furniture",
      stock: 25,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 2,
      name: "Wooden Table",
      price: 199.99,
      category: "Furniture",
      stock: 10,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 3,
      name: "LED Lamp",
      price: 29.99,
      category: "Lighting",
      stock: 50,
      image: "https://via.placeholder.com/100",
    },
    {
      id: 4,
      name: "Desk Organizer",
      price: 19.99,
      category: "Accessories",
      stock: 5,
      image: "https://via.placeholder.com/100",
    },
  ]);

  const [orders, setOrders] = useState([
    {
      id: 1001,
      customer: "John Doe",
      total: 299.97,
      status: "pending",
      date: "2024-01-15",
      items: 3,
    },
    {
      id: 1002,
      customer: "Jane Smith",
      total: 199.98,
      status: "shipped",
      date: "2024-01-14",
      items: 2,
    },
    {
      id: 1003,
      customer: "Bob Wilson",
      total: 499.95,
      status: "delivered",
      date: "2024-01-13",
      items: 5,
    },
    {
      id: 1004,
      customer: "Alice Brown",
      total: 149.99,
      status: "pending",
      date: "2024-01-16",
      items: 1,
    },
  ]);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "customer",
      status: "active",
      joinDate: "2024-01-01",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "customer",
      status: "active",
      joinDate: "2024-01-02",
    },
    {
      id: 3,
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
      status: "active",
      joinDate: "2024-01-01",
    },
    {
      id: 4,
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "customer",
      status: "blocked",
      joinDate: "2024-01-03",
    },
  ]);

  const [shippingOrders, setShippingOrders] = useState([
    {
      id: "SH001",
      orderId: 1001,
      customer: "John Doe",
      address: "123 Main St, NY",
      status: "pending",
      date: "2024-01-15",
      tracking: "",
    },
    {
      id: "SH002",
      orderId: 1002,
      customer: "Jane Smith",
      address: "456 Oak Ave, CA",
      status: "in-transit",
      date: "2024-01-14",
      tracking: "TRK123456",
    },
    {
      id: "SH003",
      orderId: 1003,
      customer: "Bob Wilson",
      address: "789 Pine Rd, TX",
      status: "delivered",
      date: "2024-01-13",
      tracking: "TRK789012",
    },
  ]);

  const [returns, setReturns] = useState([
    {
      id: "RT001",
      orderId: 1003,
      customer: "Bob Wilson",
      product: "Wooden Table",
      reason: "Damaged",
      status: "pending",
      date: "2024-01-16",
      refund: 199.99,
    },
    {
      id: "RT002",
      orderId: 1001,
      customer: "John Doe",
      product: "Modern Chair",
      reason: "Wrong size",
      status: "approved",
      date: "2024-01-15",
      refund: 99.99,
    },
  ]);

  const [payments, setPayments] = useState([
    {
      id: "PAY001",
      orderId: 1001,
      customer: "John Doe",
      amount: 299.97,
      method: "Credit Card",
      status: "pending",
      date: "2024-01-15",
    },
    {
      id: "PAY002",
      orderId: 1002,
      customer: "Jane Smith",
      amount: 199.98,
      method: "PayPal",
      status: "completed",
      date: "2024-01-14",
    },
    {
      id: "PAY003",
      orderId: 1003,
      customer: "Bob Wilson",
      amount: 499.95,
      method: "Credit Card",
      status: "completed",
      date: "2024-01-13",
    },
  ]);

  useEffect(() => {
    calculateStats();
  }, [products, orders, users, shippingOrders, returns, payments]);

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

  const calculateStats = () => {
    const totalRevenue = payments
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0);
    setStats({
      totalProducts: products.length,
      totalOrders: orders.length,
      totalUsers: users.length,
      totalRevenue: totalRevenue,
      totalShipping: shippingOrders.filter((s) => s.status !== "delivered")
        .length,
      totalReturns: returns.filter((r) => r.status === "pending").length,
      totalPayments: payments.filter((p) => p.status === "pending").length,
    });
  };

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
            products={products}
            payments={payments}
          />
        );
      case "products":
        return (
          <ProductsManagement products={products} setProducts={setProducts} />
        );
      case "orders":
        return <OrdersManagement orders={orders} setOrders={setOrders} />;
      case "shipping":
        return (
          <ShippingManagement
            shippingOrders={shippingOrders}
            setShippingOrders={setShippingOrders}
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
        return <UsersManagement users={users} setUsers={setUsers} />;
      case "analytics":
        return (
          <Analytics
            stats={stats}
            orders={orders}
            products={products}
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
            products={products}
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
        <div className="admin-content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
