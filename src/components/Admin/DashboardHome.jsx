// src/components/Admin/DashboardHome.jsx
import React, { useState, useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import "./AdminDashboard.css";

Chart.register(...registerables);

const DashboardHome = () => {
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

  // Animated counters
  useEffect(() => {
    const duration = 1000;
    const step = 20;
    let r = 0,
      s = 0,
      c = 0,
      rt = 0;

    const interval = setInterval(() => {
      r = Math.min(r + 23569 / (duration / step), 23569);
      s = Math.min(s + 3435 / (duration / step), 3435);
      c = Math.min(c + 1245 / (duration / step), 1245);
      rt = Math.min(rt + 47 / (duration / step), 47);

      setAnimatedValues({
        revenue: r,
        sales: Math.floor(s),
        customers: Math.floor(c),
        returnRate: rt.toFixed(1),
      });

      if (r >= 23569) clearInterval(interval);
    }, step);

    return () => clearInterval(interval);
  }, []);

 
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
    if (!lineRef.current) return;

    if (lineChartRef.current) lineChartRef.current.destroy();

    const months = [
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
    ];
    const monthlySales = [
      12500, 15200, 16800, 18200, 21000, 23500, 25600, 27800, 29100, 30500,
      31800, 33500,
    ];
    const monthlyRevenue = [
      9800, 11200, 12800, 14500, 16800, 18500, 20200, 22500, 24100, 25800,
      27200, 28900,
    ];

    lineChartRef.current = new Chart(lineRef.current, {
      type: "line",
      data: {
        labels: months,
        datasets: [
          {
            label: "Sales",
            data: monthlySales,
            borderColor: "#4facfe",
            backgroundColor: "rgba(79,172,254,0.1)",
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            borderWidth: 2,
          },
          {
            label: "Revenue",
            data: monthlyRevenue,
            borderColor: "#43e97b",
            backgroundColor: "rgba(238, 243, 240, 0.1)",
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            borderWidth: 2,
          },
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
              callback: (v) => "" + (v / 1000).toFixed(0) + "k",
            },
          },
        },
      },
    });

    return () => {
      if (lineChartRef.current) lineChartRef.current.destroy();
    };
  }, []);

  const trafficSources = [
    { name: "Direct", percentage: 45, color: "#4facfe" },
    { name: "Social", percentage: 30, color: "#43e97b" },
    { name: "Referral", percentage: 25, color: "#fa709a" },
  ];

  const topProducts = [
    { name: "Premium Widget", sales: 245, revenue: 12250, status: "active" },
    { name: "Standard Package", sales: 189, revenue: 9455, status: "active" },
    { name: "Basic Module", sales: 156, revenue: 4680, status: "active" },
    { name: "Pro Bundle", sales: 98, revenue: 10460, status: "active" },
  ];

  const recentActivities = [
    {
      id: 1,
      title: "New order received",
      description: "Order #12345 from John Doe",
      time: "2 minutes ago",
    },
    {
      id: 2,
      title: "New customer registered",
      description: "Jane Smith joined the platform",
      time: "15 minutes ago",
    },
    {
      id: 3,
      title: "Low stock alert",
      description: "Product SKU #789 is running low",
      time: "1 hour ago",
    },
    {
      id: 4,
      title: "New review posted",
      description: "5-star review for Premium Widget",
      time: "3 hours ago",
    },
  ];

  const monthlySales = [
    12500, 15200, 16800, 18200, 21000, 23500, 25600, 27800, 29100, 30500, 31800,
    33500,
  ];
  const monthlyRevenue = [
    9800, 11200, 12800, 14500, 16800, 18500, 20200, 22500, 24100, 25800, 27200,
    28900,
  ];

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
            value: `${Math.floor(animatedValues.revenue).toLocaleString()}`,
            change: "↑ 12.5%",
            positive: true,
          },
          {
            label: "SALES",
            value: animatedValues.sales.toLocaleString(),
            change: "↑ 8.2%",
            positive: true,
          },
          {
            label: "CUSTOMERS",
            value: animatedValues.customers.toLocaleString(),
            change: "↑ 5.0%",
            positive: true,
          },
          {
            label: "RETURN RATE",
            value: `${animatedValues.returnRate}%`,
            change: "↓ 2.1%",
            positive: false,
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
              <p
                className={`stat-change ${s.positive ? "positive" : "negative"}`}
              >
                {s.change}
              </p>
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
