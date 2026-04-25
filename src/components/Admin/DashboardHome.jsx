// src/components/Admin/DashboardHome.jsx
import React, { useState, useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import "./AdminDashboard.css";

Chart.register(...registerables);

const DashboardHome = ({ stats }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [animatedValues, setAnimatedValues] = useState({
    revenue: 0,
    sales: 0,
    customers: 0,
    returnRate: 0,
  });

  const pieRef = useRef(null);
  const lineRef = useRef(null);
  const pieChartRef = useRef(null);
  const lineChartRef = useRef(null);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Pie Chart
  useEffect(() => {
    if (!pieRef.current) return;
    if (pieChartRef.current) pieChartRef.current.destroy();

    pieChartRef.current = new Chart(pieRef.current, {
      type: "doughnut",
      data: {
        labels: ["Direct", "Social", "Referral"],
        datasets: [
          {
            data: [45, 30, 25],
            backgroundColor: ["#4facfe", "#43e97b", "#fa709a"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "60%",
        plugins: {
          legend: { display: false },
        },
      },
    });

    return () => {
      if (pieChartRef.current) pieChartRef.current.destroy();
    };
  }, []);

  // Line Chart
  useEffect(() => {
    const fetchLineData = async () => {
        if (!lineRef.current) return;
        try {
            const response = await fetch("http://localhost:5000/api/analytics/revenue?period=monthly");
            if (response.ok) {
                const data = await response.json();
                const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const revenueValues = new Array(12).fill(0);
                
                data.forEach(item => {
                    revenueValues[item.label - 1] = parseFloat(item.value);
                });

                if (lineChartRef.current) lineChartRef.current.destroy();

                lineChartRef.current = new Chart(lineRef.current, {
                  type: "line",
                  data: {
                    labels: labels,
                    datasets: [
                      {
                        label: "Revenue",
                        data: revenueValues,
                        borderColor: "#43e97b",
                        backgroundColor: "rgba(67, 233, 123, 0.1)",
                        fill: true,
                        tension: 0.4,
                        pointRadius: 3,
                        borderWidth: 2,
                      }
                    ],
                  },
                  options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      x: {
                        ticks: { font: { size: 11 }, maxRotation: 0 },
                      },
                      y: {
                        ticks: {
                          font: { size: 11 },
                          callback: (v) => "" + (v >= 1000 ? (v / 1000).toFixed(0) + "k" : v),
                        },
                      },
                    },
                  },
                });
            }
        } catch (err) {
            console.error("Failed to fetch line chart data:", err);
        }
    };

    fetchLineData();

    return () => {
      if (lineChartRef.current) lineChartRef.current.destroy();
    };
  }, []);

  const trafficSources = [];
  const topProducts = [];
  const recentActivities = [];
  const monthlySales = [];
  const monthlyRevenue = [];

  return (
    <>
     
      <div className="welcome-section" style={{ padding: "14px 24px" }}>
        <div className="welcome-content">
          <h1 className="welcome-title">Welcome Back, Admin!</h1>
          <p className="welcome-subtitle">
            Here's what's happening with your store today
          </p>
          <div className="current-time">
            <span className="time">{currentTime.toLocaleTimeString()}</span>
            <span className="date">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

     
      <div className="stats-row">
        {[
          {
            label: "REVENUE",
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            positive: true,
          },
          {
            label: "SALES",
            value: stats.totalOrders.toLocaleString(),
            positive: true,
          },
          {
            label: "CUSTOMERS",
            value: stats.totalUsers.toLocaleString(),
            positive: true,
          },
          {
            label: "PRODUCTS",
            value: stats.totalProducts.toLocaleString(),
            positive: true,
          },
        ].map((s, i) => (
          <div
            key={i}
            className="stat-card-shine"
            style={{ padding: "12px 16px" }}
          >
            <div className="stat-shine-effect"></div>
            <div className="stat-content">
              <h3 style={{ fontSize: "11px" }}>{s.label}</h3>
              <div className="stat-value">
                <span className="number" style={{ fontSize: "22px" }}>
                  {s.value}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="analytics-grid">
        {/* Traffic Sources */}
        <div className="traffic-section">
          <h2>Traffic Sources</h2>
          <div style={{ position: "relative", height: "200px" }}>
            <canvas ref={pieRef}></canvas>
          </div>
          <div className="pie-legend">
            {trafficSources.map((source, i) => (
              <div key={i} className="pie-legend-item">
                <span
                  className="legend-dot"
                  style={{ background: source.color }}
                ></span>
                <span className="legend-name">{source.name}</span>
                <span className="legend-percent">{source.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Overview */}
        <div className="sales-overview-section">
          <div className="sales-header">
            <h2>Sales Overview</h2>
            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-color sales-color"></span> Sales
              </span>
              <span className="legend-item">
                <span className="legend-color revenue-color"></span> Revenue
              </span>
            </div>
          </div>
          <div style={{ position: "relative", height: "200px" }}>
            <canvas ref={lineRef}></canvas>
          </div>
          <div className="chart-summary">
            <div className="summary-item">
              <span className="summary-label">Total Sales</span>
              <span className="summary-value">
                ${monthlySales.reduce((a, b) => a + b, 0).toLocaleString()}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Revenue</span>
              <span className="summary-value">
                ${monthlyRevenue.reduce((a, b) => a + b, 0).toLocaleString()}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Growth</span>
              <span className="summary-value positive">+18.5%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bottom-section">
        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {recentActivities.map((activity, index) => (
              <div
                key={activity.id}
                className="activity-item"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="activity-content">
                  <h4>{activity.title}</h4>
                  <p>{activity.description}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="top-products-section">
          <h2>Top Products</h2>
          <div className="products-table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>PRODUCT</th>
                  <th>SALES</th>
                  <th>REVENUE</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr
                    key={index}
                    className="product-row"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <td className="product-name">{product.name}</td>
                    <td>{product.sales}</td>
                    <td>${product.revenue.toLocaleString()}</td>
                    <td>
                      <span className="status-badge active">
                        {product.status}
                      </span>
                    </td>
                    <td>
                      <button className="edit-product-btn">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardHome;
