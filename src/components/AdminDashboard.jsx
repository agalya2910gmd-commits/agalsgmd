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
  const { products: contextProducts, setProducts: setContextProducts, fetchProducts } = useProducts();
  
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

  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [shippingOrders, setShippingOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [payments, setPayments] = useState([]);

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch Stats
      const statsRes = await fetch("http://localhost:5000/api/admin/general-stats");
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(prev => ({ ...prev, ...data }));
      }

      // 2. Fetch Orders
      const ordersRes = await fetch("http://localhost:5000/api/admin-all-orders");
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(data);
      }

      // 3. Fetch Users
      const usersRes = await fetch("http://localhost:5000/api/admin-all-users");
      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data);
      }

      // 4. Fetch Products (via Context)
      if (fetchProducts) {
        fetchProducts();
      }

      // 4. Fetch Deliveries (Shipping)
      const shippingRes = await fetch("http://localhost:5000/api/admin-all-deliveries");
      if (shippingRes.ok) {
        const data = await shippingRes.json();
        setShippingOrders(data.map(d => ({
          id: `SH${String(d.delivery_id).padStart(3, '0')}`,
          orderId: d.order_id,
          customer: d.customer_name || "N/A",
          address: d.shipping_address_snapshot,
          status: d.shipping_status?.toLowerCase() || "pending",
          date: d.created_at ? new Date(d.created_at).toISOString().split('T')[0] : 'N/A',
          tracking: d.tracking_number || ""
        })));
      }

      // 5. Fetch Payments
      const paymentsRes = await fetch("http://localhost:5000/api/admin-all-payments");
      if (paymentsRes.ok) {
        const data = await paymentsRes.json();
        setPayments(data.map(p => ({
          id: `PAY${String(p.id).padStart(3, '0')}`,
          orderId: p.order_id,
          customer: p.customer_name || "N/A",
          amount: parseFloat(p.amount),
          method: p.payment_method,
          status: p.payment_status?.toLowerCase() || "pending",
          date: p.created_at ? new Date(p.created_at).toISOString().split('T')[0] : 'N/A'
        })));
      }
    } catch (err) {
      console.error("Error fetching admin dashboard data:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 20000); // Poll every 20 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Primary stats come from API via fetchDashboardData
  }, [payments]);

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
              <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
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
