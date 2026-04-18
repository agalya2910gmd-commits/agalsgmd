// src/components/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ProductsManagement from "./ProductsManagement";
import OrdersManagement from "./OrdersManagement";
import UsersManagement from "./User";
import Analytics from "./Analytics";
import ShippingManagement from "./ShippingManagement";
import ReturnsManagement from "./ReturnsManagement";
import PaymentsManagement from "./PaymentsManagement";
import AdminProfile from "./AdminProfile";
import { useProducts } from "../context/ProductContext";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("products");
  const { products: contextProducts, setProducts: setContextProducts } = useProducts();
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalShipping: 0,
    totalReturns: 0,
    totalPayments: 0,
  });

  const [products, setProducts] = useState(contextProducts);

  useEffect(() => {
    setProducts(contextProducts);
  }, [contextProducts]);

  const [orders, setOrders] = useState([
    {
      id: 1001,
      customer: "John Doe",
      total: 299.97,
      status: "pending",
      date: "2024-01-15",
      items: 3,
      shipping: "pending",
      payment: "pending",
    },
    {
      id: 1002,
      customer: "Jane Smith",
      total: 199.98,
      status: "shipped",
      date: "2024-01-14",
      items: 2,
      shipping: "shipped",
      payment: "completed",
    },
    {
      id: 1003,
      customer: "Bob Wilson",
      total: 499.95,
      status: "delivered",
      date: "2024-01-13",
      items: 5,
      shipping: "delivered",
      payment: "completed",
    },
    {
      id: 1004,
      customer: "Alice Brown",
      total: 149.99,
      status: "pending",
      date: "2024-01-16",
      items: 1,
      shipping: "pending",
      payment: "pending",
    },
  ]);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John ",
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
    switch (activeTab) {
      case "products":
        return (
          <ProductsManagement products={products} setProducts={setProducts} />
        );
      case "orders":
        return <OrdersManagement orders={orders} setOrders={setOrders} />;
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
      case "profile":
        return <AdminProfile />;
      default:
        return (
          <ProductsManagement products={products} setProducts={setProducts} />
        );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("nivest_user");
    localStorage.removeItem("nivest_user_type");
    window.location.href = "/login";
  };

  return (
    <div className="admin-dashboard">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="admin-main">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <div className="admin-user">
            <span>Welcome, Admin</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <h3>{stats.totalProducts}</h3>
              <p>Total Products</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <h3>{stats.totalOrders}</h3>
              <p>Total Orders</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <h3>${stats.totalRevenue.toLocaleString()}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <h3>{stats.totalShipping}</h3>
              <p>Active Shipping</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <h3>{stats.totalReturns}</h3>
              <p>Pending Returns</p>
            </div>
          </div>
        </div>

        <div className="admin-content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
