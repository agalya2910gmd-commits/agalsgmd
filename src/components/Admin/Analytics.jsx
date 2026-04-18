// src/components/Admin/Analytics.jsx
import React, { useState } from "react";

const Analytics = ({ stats, orders, products, payments }) => {
  const [timeRange, setTimeRange] = useState("yearly");
  const [viewMode, setViewMode] = useState("all");

  const averageOrderValue =
    stats.totalOrders > 0
      ? (stats.totalRevenue / stats.totalOrders).toFixed(2)
      : 0;

  const recentOrders = orders.slice(0, 5);
  const lowStockProducts = products.filter((p) => p.stock < 10);

  // Yearly data with monthly breakdown
  const yearlyData = {
    labels: ["2022", "2023", "2024"],
    revenue: [189000, 245000, 312000],
    orders: [1890, 2450, 3120],
    monthlyBreakdown: {
      2022: {
        first6: [85000, 104000],
        last6: [104000, 85000],
        labels: ["Jan-Jun", "Jul-Dec"],
      },
      2023: {
        first6: [112000, 133000],
        last6: [133000, 112000],
        labels: ["Jan-Jun", "Jul-Dec"],
      },
      2024: {
        first6: [148000, 164000],
        last6: [164000, 148000],
        labels: ["Jan-Jun", "Jul-Dec"],
      },
    },
  };

  // Monthly data (12 months)
  const monthlyData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    revenue: [
      12500, 15200, 16800, 18200, 21000, 23500, 25600, 27800, 29100, 30500,
      31800, 33500,
    ],
    orders: [125, 152, 168, 182, 210, 235, 256, 278, 291, 305, 318, 335],
  };

  // Weekly data (last 4 weeks)
  const weeklyData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    revenue: [5800, 7200, 6900, 8500],
    orders: [58, 72, 69, 85],
  };

  // Get current data based on time range
  const getCurrentData = () => {
    switch (timeRange) {
      case "weekly":
        return weeklyData;
      case "monthly":
        return monthlyData;
      case "yearly":
      default:
        if (viewMode === "first6") {
          return {
            labels: yearlyData.labels,
            revenue: yearlyData.revenue.map(
              (_, idx) =>
                yearlyData.monthlyBreakdown[yearlyData.labels[idx]].first6[0],
            ),
            orders: yearlyData.orders.map((_, idx) =>
              Math.floor(yearlyData.orders[idx] * 0.45),
            ),
            subtitle: "First 6 Months (Jan - Jun)",
          };
        } else if (viewMode === "last6") {
          return {
            labels: yearlyData.labels,
            revenue: yearlyData.revenue.map(
              (_, idx) =>
                yearlyData.monthlyBreakdown[yearlyData.labels[idx]].last6[0],
            ),
            orders: yearlyData.orders.map((_, idx) =>
              Math.floor(yearlyData.orders[idx] * 0.55),
            ),
            subtitle: "Last 6 Months (Jul - Dec)",
          };
        }
        return yearlyData;
    }
  };

  const currentData = getCurrentData();
  const maxRevenue = Math.max(...currentData.revenue);
  const maxOrders = Math.max(...currentData.orders);

  // Calculate category distribution
  const categoryStats = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  const totalProducts = products.length;
  const categoryPercentages = Object.entries(categoryStats).map(
    ([category, count]) => ({
      category,
      percentage: ((count / totalProducts) * 100).toFixed(1),
    }),
  );

  const styles = {
    container: {
      padding: "16px",
      height: "100%",
      overflow: "hidden",
    },
    header: {
      marginBottom: "16px",
    },
    title: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#1a1a2e",
      margin: "0 0 12px 0",
    },
    timeRangeButtons: {
      display: "flex",
      gap: "10px",
      marginBottom: "16px",
      flexWrap: "wrap",
    },
    timeBtn: {
      padding: "6px 16px",
      border: "1px solid #e9ecef",
      background: "white",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "12px",
      fontWeight: "500",
      transition: "all 0.3s ease",
    },
    timeBtnActive: {
      background: "#1a1a2e",
      color: "white",
      borderColor: "#1a1a2e",
    },
    viewModeButtons: {
      display: "flex",
      gap: "8px",
      marginBottom: "16px",
      flexWrap: "wrap",
    },
    viewBtn: {
      padding: "4px 12px",
      border: "1px solid #e9ecef",
      background: "white",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "11px",
      fontWeight: "500",
      transition: "all 0.3s ease",
    },
    viewBtnActive: {
      background: "#1a1a2e",
      color: "white",
      borderColor: "#1a1a2e",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "12px",
      marginBottom: "20px",
    },
    statCard: {
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      padding: "14px",
      borderRadius: "12px",
      textAlign: "center",
      color: "white",
    },
    statLabel: {
      fontSize: "11px",
      opacity: 0.8,
      marginBottom: "6px",
      textTransform: "uppercase",
    },
    statValue: {
      fontSize: "22px",
      fontWeight: "700",
    },
    warningValue: {
      color: "#f59e0b",
    },
    chartSection: {
      background: "white",
      borderRadius: "12px",
      padding: "16px",
      marginBottom: "20px",
      border: "1px solid #e9ecef",
    },
    chartTitle: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#1a1a2e",
      marginBottom: "8px",
    },
    chartSubtitle: {
      fontSize: "11px",
      color: "#6c757d",
      marginBottom: "16px",
    },
    chartContainer: {
      overflowX: "auto",
    },
    barChart: {
      display: "flex",
      alignItems: "flex-end",
      gap: "20px",
      minWidth: "300px",
      height: "200px",
    },
    barWrapper: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "8px",
    },
    barContainer: {
      width: "100%",
      height: "160px",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      gap: "4px",
    },
    revenueBar: {
      width: "35px",
      background: "linear-gradient(180deg, #4facfe 0%, #00f2fe 100%)",
      borderRadius: "4px 4px 0 0",
      transition: "height 0.5s ease",
    },
    ordersBar: {
      width: "35px",
      background: "linear-gradient(180deg, #43e97b 0%, #38f9d7 100%)",
      borderRadius: "4px 4px 0 0",
      transition: "height 0.5s ease",
    },
    barLabel: {
      fontSize: "11px",
      fontWeight: "600",
      color: "#1a1a2e",
      textAlign: "center",
    },
    barValue: {
      fontSize: "10px",
      fontWeight: "500",
      color: "#4a5568",
      marginBottom: "4px",
    },
    analyticsSections: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "16px",
    },
    recentOrders: {
      background: "white",
      borderRadius: "12px",
      padding: "16px",
      border: "1px solid #e9ecef",
    },
    sectionTitle: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#1a1a2e",
      marginBottom: "12px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    tableHeader: {
      padding: "8px",
      textAlign: "left",
      fontSize: "11px",
      fontWeight: "600",
      color: "#6c757d",
      borderBottom: "1px solid #e9ecef",
    },
    tableCell: {
      padding: "8px",
      fontSize: "12px",
      color: "#4a5568",
      borderBottom: "1px solid #e9ecef",
    },
    statusText: {
      fontWeight: "500",
    },
    categoryPerformance: {
      background: "white",
      borderRadius: "12px",
      padding: "16px",
      border: "1px solid #e9ecef",
    },
    categoryList: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    categoryItem: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    categoryName: {
      width: "100px",
      fontSize: "12px",
      fontWeight: "500",
      color: "#4a5568",
    },
    progressBar: {
      flex: 1,
      height: "6px",
      background: "#e9ecef",
      borderRadius: "3px",
      overflow: "hidden",
    },
    progress: {
      height: "100%",
      background: "linear-gradient(90deg, #667eea, #764ba2)",
      borderRadius: "3px",
      transition: "width 0.3s ease",
    },
    percentage: {
      width: "45px",
      fontSize: "11px",
      fontWeight: "600",
      color: "#1a1a2e",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Analytics Overview</h2>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Average Order Value</div>
          <div style={styles.statValue}>{averageOrderValue}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Conversion Rate</div>
          <div style={styles.statValue}>12.5%</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Low Stock Items</div>
          <div
            style={{
              ...styles.statValue,
              ...(lowStockProducts.length > 0 ? styles.warningValue : {}),
            }}
          >
            {lowStockProducts.length}
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div style={styles.timeRangeButtons}>
        <button
          style={{
            ...styles.timeBtn,
            ...(timeRange === "weekly" ? styles.timeBtnActive : {}),
          }}
          onClick={() => {
            setTimeRange("weekly");
            setViewMode("all");
          }}
        >
          Weekly
        </button>
        <button
          style={{
            ...styles.timeBtn,
            ...(timeRange === "monthly" ? styles.timeBtnActive : {}),
          }}
          onClick={() => {
            setTimeRange("monthly");
            setViewMode("all");
          }}
        >
          Monthly
        </button>
        <button
          style={{
            ...styles.timeBtn,
            ...(timeRange === "yearly" ? styles.timeBtnActive : {}),
          }}
          onClick={() => {
            setTimeRange("yearly");
            setViewMode("all");
          }}
        >
          Yearly
        </button>
      </div>

      {/* Yearly Split View (First 6 Months / Last 6 Months) */}
      {timeRange === "yearly" && (
        <div style={styles.viewModeButtons}>
          <button
            style={{
              ...styles.viewBtn,
              ...(viewMode === "all" ? styles.viewBtnActive : {}),
            }}
            onClick={() => setViewMode("all")}
          >
            Full Year
          </button>
          <button
            style={{
              ...styles.viewBtn,
              ...(viewMode === "first6" ? styles.viewBtnActive : {}),
            }}
            onClick={() => setViewMode("first6")}
          >
            First 6 Months (Jan-Jun)
          </button>
          <button
            style={{
              ...styles.viewBtn,
              ...(viewMode === "last6" ? styles.viewBtnActive : {}),
            }}
            onClick={() => setViewMode("last6")}
          >
            Last 6 Months (Jul-Dec)
          </button>
        </div>
      )}

      {/* Revenue Chart */}
      <div style={styles.chartSection}>
        <h3 style={styles.chartTitle}>
          {timeRange === "weekly"
            ? "Weekly"
            : timeRange === "monthly"
              ? "Monthly"
              : "Yearly"}{" "}
          Revenue & Orders
        </h3>
        {timeRange === "yearly" && viewMode !== "all" && (
          <div style={styles.chartSubtitle}>
            {viewMode === "first6"
              ? "Showing First 6 Months (January - June)"
              : "Showing Last 6 Months (July - December)"}
          </div>
        )}
        <div style={styles.chartContainer}>
          <div style={styles.barChart}>
            {currentData.labels.map((label, index) => {
              const revenueHeight =
                (currentData.revenue[index] / maxRevenue) * 140;
              const ordersHeight =
                (currentData.orders[index] / maxOrders) * 140;
              return (
                <div key={index} style={styles.barWrapper}>
                  <div style={styles.barValue}>
                    ${(currentData.revenue[index] / 1000).toFixed(0)}k
                  </div>
                  <div style={styles.barContainer}>
                    <div
                      style={{
                        ...styles.revenueBar,
                        height: `${revenueHeight}px`,
                      }}
                    ></div>
                    <div
                      style={{
                        ...styles.ordersBar,
                        height: `${ordersHeight}px`,
                      }}
                    ></div>
                  </div>
                  <div style={styles.barLabel}>{label}</div>
                  <div
                    style={{
                      fontSize: "9px",
                      color: "#6c757d",
                      textAlign: "center",
                    }}
                  >
                    {currentData.orders[index]} orders
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginTop: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                background: "#4facfe",
                borderRadius: "2px",
              }}
            ></div>
            <span style={{ fontSize: "10px", color: "#6c757d" }}>Revenue</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                background: "#43e97b",
                borderRadius: "2px",
              }}
            ></div>
            <span style={{ fontSize: "10px", color: "#6c757d" }}>Orders</span>
          </div>
        </div>
      </div>

      {/* Recent Orders and Category Distribution */}
      <div style={styles.analyticsSections}>
        <div style={styles.recentOrders}>
          <h3 style={styles.sectionTitle}>Recent Orders</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Order ID</th>
                <th style={styles.tableHeader}>Customer</th>
                <th style={styles.tableHeader}>Amount</th>
                <th style={styles.tableHeader}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td style={styles.tableCell}>#{order.id}</td>
                  <td style={styles.tableCell}>{order.customer}</td>
                  <td style={styles.tableCell}>{order.total}</td>
                  <td style={styles.tableCell}>
                    <span
                      style={{
                        ...styles.statusText,
                        color:
                          order.status === "delivered"
                            ? "#10b981"
                            : order.status === "shipped"
                              ? "#3b82f6"
                              : "#f59e0b",
                      }}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={styles.categoryPerformance}>
          <h3 style={styles.sectionTitle}>Category Distribution</h3>
          <div style={styles.categoryList}>
            {categoryPercentages.map((item, index) => (
              <div key={index} style={styles.categoryItem}>
                <span style={styles.categoryName}>{item.category}</span>
                <div style={styles.progressBar}>
                  <div
                    style={{ ...styles.progress, width: `${item.percentage}%` }}
                  ></div>
                </div>
                <span style={styles.percentage}>{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
