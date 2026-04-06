// src/components/Admin/DashboardHome.jsx
import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";

const DashboardHome = ({ stats, orders, products, payments }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [animatedValues, setAnimatedValues] = useState({
    revenue: 0,
    sales: 0,
    customers: 0,
    returnRate: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const duration = 1000;
    const step = 20;
    const revenueStep = 23569 / (duration / step);
    const salesStep = 3435 / (duration / step);
    const customersStep = 1245 / (duration / step);
    const returnRateStep = 47 / (duration / step);

    let currentRevenue = 0;
    let currentSales = 0;
    let currentCustomers = 0;
    let currentReturnRate = 0;

    const interval = setInterval(() => {
      currentRevenue = Math.min(currentRevenue + revenueStep, 23569);
      currentSales = Math.min(currentSales + salesStep, 3435);
      currentCustomers = Math.min(currentCustomers + customersStep, 1245);
      currentReturnRate = Math.min(currentReturnRate + returnRateStep, 47);

      setAnimatedValues({
        revenue: currentRevenue,
        sales: Math.floor(currentSales),
        customers: Math.floor(currentCustomers),
        returnRate: currentReturnRate.toFixed(1),
      });

      if (
        currentRevenue >= 23569 &&
        currentSales >= 3435 &&
        currentCustomers >= 1245 &&
        currentReturnRate >= 47
      ) {
        clearInterval(interval);
      }
    }, step);

    return () => clearInterval(interval);
  }, []);

  const monthlySales = [
    12500, 15200, 16800, 18200, 21000, 23500, 25600, 27800, 29100, 30500, 31800,
    33500,
  ];
  const monthlyRevenue = [
    9800, 11200, 12800, 14500, 16800, 18500, 20200, 22500, 24100, 25800, 27200,
    28900,
  ];
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

  return (
    <>
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-animation">
          <div className="wave"></div>
          <div className="wave wave2"></div>
          <div className="wave wave3"></div>
        </div>
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

      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-card-shine">
          <div className="stat-shine-effect"></div>
          <div className="stat-content">
            <h3>REVENUE</h3>
            <div className="stat-value">
              <span className="dollar-sign">$</span>
              <span className="number">
                {Math.floor(animatedValues.revenue).toLocaleString()}
              </span>
            </div>
            <p className="stat-change positive">↑ 12.5%</p>
          </div>
        </div>

        <div className="stat-card-shine">
          <div className="stat-shine-effect"></div>
          <div className="stat-content">
            <h3>SALES</h3>
            <div className="stat-value">
              <span className="number">
                {animatedValues.sales.toLocaleString()}
              </span>
            </div>
            <p className="stat-change positive">↑ 8.2%</p>
          </div>
        </div>

        <div className="stat-card-shine">
          <div className="stat-shine-effect"></div>
          <div className="stat-content">
            <h3>CUSTOMERS</h3>
            <div className="stat-value">
              <span className="number">
                {animatedValues.customers.toLocaleString()}
              </span>
            </div>
            <p className="stat-change positive">↑ 5.0%</p>
          </div>
        </div>

        <div className="stat-card-shine">
          <div className="stat-shine-effect"></div>
          <div className="stat-content">
            <h3>RETURN RATE</h3>
            <div className="stat-value">
              <span className="number">{animatedValues.returnRate}%</span>
            </div>
            <p className="stat-change negative">↓ 2.1%</p>
          </div>
        </div>
      </div>

      {/* Traffic Sources and Sales Overview */}
      <div className="analytics-grid">
        {/* Traffic Sources */}
        <div className="traffic-section">
          <h2>Traffic Sources</h2>
          <div className="pie-chart-container">
            <div className="pie-chart">
              <svg viewBox="0 0 200 200" className="pie-svg">
                {(() => {
                  let startAngle = 0;
                  const colors = ["#4facfe", "#43e97b", "#fa709a"];
                  return trafficSources.map((source, index) => {
                    const angle = (source.percentage / 100) * 360;
                    const endAngle = startAngle + angle;
                    const startRad = (startAngle - 90) * (Math.PI / 180);
                    const endRad = (endAngle - 90) * (Math.PI / 180);
                    const x1 = 100 + 80 * Math.cos(startRad);
                    const y1 = 100 + 80 * Math.sin(startRad);
                    const x2 = 100 + 80 * Math.cos(endRad);
                    const y2 = 100 + 80 * Math.sin(endRad);
                    const largeArc = angle > 180 ? 1 : 0;
                    const pathData = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;
                    const result = (
                      <path
                        key={index}
                        d={pathData}
                        fill={colors[index]}
                        className="pie-slice"
                        style={{ animationDelay: `${index * 0.2}s` }}
                      />
                    );
                    startAngle = endAngle;
                    return result;
                  });
                })()}
              </svg>
            </div>
            <div className="pie-legend">
              {trafficSources.map((source, index) => (
                <div key={index} className="pie-legend-item">
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
        </div>

        {/* Sales Overview */}
        <div className="sales-overview-section">
          <div className="sales-header">
            <h2>Sales Overview</h2>
            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-color sales-color"></span>
                Sales
              </span>
              <span className="legend-item">
                <span className="legend-color revenue-color"></span>
                Revenue
              </span>
            </div>
          </div>
          <div className="line-chart">
            <svg viewBox="0 0 500 300" className="chart-svg">
              <text x="45" y="30" className="y-axis-label">
                $30K
              </text>
              <text x="45" y="90" className="y-axis-label">
                $22.5K
              </text>
              <text x="45" y="150" className="y-axis-label">
                $15K
              </text>
              <text x="45" y="210" className="y-axis-label">
                $7.5K
              </text>
              <text x="45" y="270" className="y-axis-label">
                $0
              </text>

              <line x1="60" y1="30" x2="480" y2="30" className="grid-line" />
              <line x1="60" y1="90" x2="480" y2="90" className="grid-line" />
              <line x1="60" y1="150" x2="480" y2="150" className="grid-line" />
              <line x1="60" y1="210" x2="480" y2="210" className="grid-line" />
              <line x1="60" y1="270" x2="480" y2="270" className="grid-line" />

              <polyline
                points={monthlySales
                  .map((value, index) => {
                    const x = 60 + index * (420 / 11);
                    const y = 270 - (value / 35000) * 240;
                    return `${x},${y}`;
                  })
                  .join(" ")}
                className="sales-line"
                fill="none"
              />

              <polygon
                points={`${monthlySales
                  .map((value, index) => {
                    const x = 60 + index * (420 / 11);
                    const y = 270 - (value / 35000) * 240;
                    return `${x},${y}`;
                  })
                  .join(" ")} 480,270 60,270`}
                className="sales-area"
                fill="rgba(79, 172, 254, 0.1)"
              />

              <polyline
                points={monthlyRevenue
                  .map((value, index) => {
                    const x = 60 + index * (420 / 11);
                    const y = 270 - (value / 35000) * 240;
                    return `${x},${y}`;
                  })
                  .join(" ")}
                className="revenue-line"
                fill="none"
              />

              <polygon
                points={`${monthlyRevenue
                  .map((value, index) => {
                    const x = 60 + index * (420 / 11);
                    const y = 270 - (value / 35000) * 240;
                    return `${x},${y}`;
                  })
                  .join(" ")} 480,270 60,270`}
                className="revenue-area"
                fill="rgba(67, 233, 123, 0.1)"
              />

              {months
                .filter((_, i) => i % 2 === 0)
                .map((month, idx) => {
                  const index = idx * 2;
                  const x = 60 + index * (420 / 11);
                  return (
                    <text key={index} x={x} y="290" className="x-axis-label">
                      {month}
                    </text>
                  );
                })}
            </svg>
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

      {/* Recent Activity and Top Products */}
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
