// src/components/Admin/Analytics.jsx
import React, { useState, useEffect } from "react";
import { 
  Users, 
  ShoppingBag, 
  Package, 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight,
  Filter
} from "lucide-react";

const Analytics = ({ stats: initialStats, orders = [], products = [], payments = [] }) => {
  const [timeRange, setTimeRange] = useState("monthly");
  const [revenueData, setRevenueData] = useState({
    labels: [],
    revenue: [],
    orders: []
  });
  const [generalStats, setGeneralStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [statsRes, revenueRes] = await Promise.all([
          fetch("http://localhost:5000/api/admin/general-stats"),
          fetch(`http://localhost:5000/api/analytics/revenue?period=${timeRange}`)
        ]);

        if (!statsRes.ok || !revenueRes.ok) {
          throw new Error("Failed to fetch analytics data");
        }

        const statsData = await statsRes.json();
        const rawRevenueData = await revenueRes.json();

        setGeneralStats({
          totalUsers: statsData.totalUsers || 0,
          totalOrders: statsData.totalOrders || 0,
          totalProducts: statsData.totalProducts || 0,
          totalRevenue: statsData.totalRevenue || 0
        });

        let labels = [];
        let revenue = [];
        let ordersArr = [];

        if (timeRange === 'monthly') {
          labels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
          revenue = new Array(12).fill(0);
          ordersArr = new Array(12).fill(0);
          rawRevenueData.forEach(d => {
            const idx = parseInt(d.label) - 1;
            if (idx >= 0 && idx < 12) {
              revenue[idx] = parseFloat(d.value);
              ordersArr[idx] = Math.floor(parseFloat(d.value) / 100) || 0;
            }
          });
        } else if (timeRange === 'weekly') {
          const maxWeek = Math.max(...rawRevenueData.map(d => parseInt(d.label)), 4);
          const minWeek = Math.max(1, maxWeek - 7);
          for (let i = minWeek; i <= maxWeek; i++) {
            labels.push(`Week ${i}`);
            const match = rawRevenueData.find(d => parseInt(d.label) === i);
            revenue.push(match ? parseFloat(match.value) : 0);
            ordersArr.push(match ? Math.floor(parseFloat(match.value) / 100) : 0);
          }
        } else if (timeRange === 'quarterly') {
          labels = ["Q1", "Q2", "Q3", "Q4"];
          revenue = new Array(4).fill(0);
          ordersArr = new Array(4).fill(0);
          rawRevenueData.forEach(d => {
            const idx = parseInt(d.label) - 1;
            if (idx >= 0 && idx < 4) {
              revenue[idx] = parseFloat(d.value);
              ordersArr[idx] = Math.floor(parseFloat(d.value) / 100) || 0;
            }
          });
        } else {
          const currentYear = new Date().getFullYear();
          for (let i = currentYear - 2; i <= currentYear; i++) {
            labels.push(i.toString());
            const match = rawRevenueData.find(d => parseInt(d.label) === i);
            revenue.push(match ? parseFloat(match.value) : 0);
            ordersArr.push(match ? Math.floor(parseFloat(match.value) / 100) : 0);
          }
        }

        setRevenueData({ labels, revenue, orders: ordersArr });
      } catch (err) {
        console.error("Analytics fetch error:", err);
        setError("Failed to load analytics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const recentOrders = Array.isArray(orders) ? orders.slice(0, 6) : [];
  
  const currentData = revenueData.labels.length > 0 ? revenueData : { labels: ["No Data"], revenue: [0], orders: [0] };
  const maxRevenue = Math.max(...currentData.revenue, 1);
  const maxOrdersCount = Math.max(...currentData.orders, 1);

  const categoryStats = Array.isArray(products) ? products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {}) : {};

  const totalProductsCount = products.length || 1;
  const categoryPercentages = Object.entries(categoryStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([category, count]) => ({
      category,
      percentage: ((count / totalProductsCount) * 100).toFixed(1),
    }));

  const styles = {
    dashboard: {
      padding: "24px",
      background: "#f8fafc",
      minHeight: "100%",
      fontFamily: "'Inter', sans-serif",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "32px",
    },
    headerTitle: {
      margin: 0,
      fontSize: "28px",
      fontWeight: "800",
      color: "#0f172a",
      letterSpacing: "-0.02em",
    },
    headerSubtitle: {
      margin: "4px 0 0 0",
      fontSize: "14px",
      color: "#64748b",
    },
    filterGroup: {
      display: "flex",
      background: "#fff",
      padding: "4px",
      borderRadius: "12px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      border: "1px solid #e2e8f0",
    },
    filterBtn: {
      padding: "8px 16px",
      border: "none",
      background: "transparent",
      borderRadius: "8px",
      fontSize: "13px",
      fontWeight: "600",
      color: "#64748b",
      cursor: "pointer",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    filterBtnActive: {
      background: "#0f172a",
      color: "#fff",
      boxShadow: "0 4px 12px rgba(15, 23, 42, 0.15)",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "24px",
      marginBottom: "32px",
    },
    card: {
      background: "#fff",
      padding: "24px",
      borderRadius: "20px",
      border: "1px solid #e2e8f0",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      cursor: "default",
    },
    cardIcon: {
      width: "48px",
      height: "48px",
      borderRadius: "14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "16px",
    },
    cardLabel: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#64748b",
      marginBottom: "4px",
    },
    cardValue: {
      fontSize: "28px",
      fontWeight: "800",
      color: "#0f172a",
      display: "flex",
      alignItems: "baseline",
      gap: "4px",
    },
    cardTrend: {
      fontSize: "12px",
      fontWeight: "700",
      color: "#10b981",
      display: "flex",
      alignItems: "center",
      gap: "2px",
      marginTop: "8px",
    },
    chartsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "24px",
      marginBottom: "32px",
    },
    chartCard: {
      background: "#fff",
      padding: "24px",
      borderRadius: "24px",
      border: "1px solid #e2e8f0",
      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)",
    },
    chartHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "24px",
    },
    chartTitle: {
      margin: 0,
      fontSize: "18px",
      fontWeight: "700",
      color: "#1e293b",
    },
    chartVisual: {
      height: "220px",
      display: "flex",
      alignItems: "flex-end",
      gap: "12px",
      paddingTop: "20px",
    },
    barGroup: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      height: "100%",
      justifyContent: "flex-end",
    },
    bar: {
      width: "100%",
      maxWidth: "32px",
      borderRadius: "6px 6px 2px 2px",
      transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
      position: "relative",
    },
    barLabel: {
      marginTop: "12px",
      fontSize: "11px",
      fontWeight: "600",
      color: "#94a3b8",
    },
    tableSection: {
      display: "grid",
      gridTemplateColumns: "1.5fr 1fr",
      gap: "24px",
    },
    tableCard: {
      background: "#fff",
      borderRadius: "24px",
      border: "1px solid #e2e8f0",
      overflow: "hidden",
    },
    tableHeader: {
      padding: "20px 24px",
      borderBottom: "1px solid #f1f5f9",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    th: {
      textAlign: "left",
      padding: "16px 24px",
      fontSize: "12px",
      fontWeight: "700",
      color: "#64748b",
      textTransform: "uppercase",
      background: "#f8fafc",
    },
    td: {
      padding: "16px 24px",
      fontSize: "14px",
      color: "#334155",
      borderBottom: "1px solid #f1f5f9",
    },
    badge: {
      padding: "4px 10px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "600",
    },
    progressContainer: {
      padding: "24px",
    },
    progressItem: {
      marginBottom: "20px",
    },
    progressLabel: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "8px",
      fontSize: "13px",
      fontWeight: "600",
      color: "#334155",
    },
    progressBar: {
      height: "8px",
      background: "#f1f5f9",
      borderRadius: "4px",
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      borderRadius: "4px",
      transition: "width 1s ease-out",
    },
  };

  if (isLoading) {
    return (
      <div style={{ ...styles.dashboard, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#64748b', fontWeight: '600' }}>Generating Insights...</p>
        </div>
      </div>
    );
  }

  const statItems = [
    { 
        label: "Total Sales", 
        value: `₹${generalStats.totalRevenue.toLocaleString()}`, 
        icon: DollarSign, 
        color: "#e0f2fe", 
        iconColor: "#0ea5e9",
        trend: "+12.5%"
    },
    { 
        label: "Total Orders", 
        value: generalStats.totalOrders, 
        icon: ShoppingBag, 
        color: "#f0fdf4", 
        iconColor: "#22c55e",
        trend: "+8.2%"
    },
    { 
        label: "Total Users", 
        value: generalStats.totalUsers, 
        icon: Users, 
        color: "#fef2f2", 
        iconColor: "#ef4444",
        trend: "+5.1%"
    },
    { 
        label: "Products", 
        value: generalStats.totalProducts, 
        icon: Package, 
        color: "#faf5ff", 
        iconColor: "#a855f7",
        trend: "+2 new"
    }
  ];

  return (
    <div style={styles.dashboard}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.headerTitle}>Analytics Dashboard</h2>
          <p style={styles.headerSubtitle}>Overview of sales, orders, and performance</p>
        </div>
        <div style={styles.filterGroup}>
          {["weekly", "monthly", "quarterly", "yearly"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                ...styles.filterBtn,
                ...(timeRange === range ? styles.filterBtnActive : {}),
              }}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div style={styles.statsGrid}>
        {statItems.map((item, i) => (
          <div key={i} style={styles.card} className="hover-card">
            <div style={{ ...styles.cardIcon, background: item.color }}>
                <item.icon size={24} color={item.iconColor} />
            </div>
            <div style={styles.cardLabel}>{item.label}</div>
            <div style={styles.cardValue}>{item.value}</div>
            <div style={styles.cardTrend}>
                <ArrowUpRight size={14} />
                {item.trend} <span style={{color: "#94a3b8", fontWeight: 500, marginLeft: 4}}>vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div style={styles.chartsGrid}>
        {/* Sales Chart */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <div>
                <h3 style={styles.chartTitle}>Revenue Growth</h3>
                <p style={{ ...styles.headerSubtitle, fontSize: "12px" }}>Monthly performance tracking</p>
            </div>
            <TrendingUp size={20} color="#64748b" />
          </div>
          <div style={styles.chartVisual}>
            {currentData.labels.map((label, idx) => (
              <div key={idx} style={styles.barGroup}>
                <div 
                  style={{ 
                    ...styles.bar, 
                    height: `${(currentData.revenue[idx] / maxRevenue) * 100}%`,
                    background: "linear-gradient(to top, #3b82f6, #60a5fa)",
                    minHeight: "4px"
                  }}
                  title={`₹${currentData.revenue[idx]}`}
                ></div>
                <span style={styles.barLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders Chart */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <div>
                <h3 style={styles.chartTitle}>Order Volume</h3>
                <p style={{ ...styles.headerSubtitle, fontSize: "12px" }}>Success rate by period</p>
            </div>
            <ShoppingBag size={20} color="#64748b" />
          </div>
          <div style={styles.chartVisual}>
            {currentData.labels.map((label, idx) => (
              <div key={idx} style={styles.barGroup}>
                <div 
                  style={{ 
                    ...styles.bar, 
                    height: `${(currentData.orders[idx] / maxOrdersCount) * 100}%`,
                    background: "linear-gradient(to top, #10b981, #34d399)",
                    minHeight: "4px"
                  }}
                  title={`${currentData.orders[idx]} orders`}
                ></div>
                <span style={styles.barLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div style={styles.tableSection}>
        {/* Recent Orders Table */}
        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <h3 style={styles.chartTitle}>Recent Orders</h3>
            <button style={{ ...styles.filterBtn, fontSize: "12px", background: "#f1f5f9", color: "#475569" }}>View All</button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, idx) => (
                  <tr key={idx}>
                    <td style={styles.td}>
                        <div style={{ fontWeight: 700, color: "#0f172a" }}>{order.customer}</div>
                        <div style={{ fontSize: "11px", color: "#94a3b8" }}>Order #{order.id}</div>
                    </td>
                    <td style={styles.td}>{order.date}</td>
                    <td style={styles.td}>
                        <span style={{ fontWeight: 700 }}>₹{order.total?.toLocaleString()}</span>
                    </td>
                    <td style={styles.td}>
                        <span style={{
                            ...styles.badge,
                            background: order.status === "delivered" ? "#dcfce7" : order.status === "pending" ? "#fef9c3" : "#f1f5f9",
                            color: order.status === "delivered" ? "#166534" : order.status === "pending" ? "#854d0e" : "#475569"
                        }}>
                            {order.status?.toUpperCase()}
                        </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Performance */}
        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <h3 style={styles.chartTitle}>Category Distribution</h3>
            <Filter size={18} color="#64748b" />
          </div>
          <div style={styles.progressContainer}>
            {categoryPercentages.map((item, idx) => (
              <div key={idx} style={styles.progressItem}>
                <div style={styles.progressLabel}>
                  <span>{item.category}</span>
                  <span>{item.percentage}%</span>
                </div>
                <div style={styles.progressBar}>
                  <div
                    style={{ 
                        ...styles.progressFill, 
                        width: `${item.percentage}%`,
                        background: `linear-gradient(to right, ${["#3b82f6", "#10b981", "#ef4444", "#f59e0b", "#8b5cf6"][idx % 5]}, ${["#60a5fa", "#34d399", "#f87171", "#fbbf24", "#a78bfa"][idx % 5]})`
                    }}
                  ></div>
                </div>
              </div>
            ))}
            {categoryPercentages.length === 0 && (
                <p style={{ textAlign: "center", color: "#94a3b8", marginTop: "40px" }}>No category data available</p>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hover-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
        }
      `}} />
    </div>
  );
};

export default Analytics;
