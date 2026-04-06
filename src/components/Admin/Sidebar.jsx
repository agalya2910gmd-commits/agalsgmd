// src/components/Admin/Sidebar.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "dashboard", name: "Dashboard", path: "/admin" },
    { id: "products", name: "Products", path: "/admin/products" },
    { id: "orders", name: "Orders", path: "/admin/orders" },
    { id: "shipping", name: "Shipping", path: "/admin/shipping" },
    { id: "returns", name: "Returns", path: "/admin/returns" },
    { id: "payments", name: "Payments", path: "/admin/payments" },
    { id: "users", name: "Users", path: "/admin/users" },
    { id: "analytics", name: "Analytics", path: "/admin/analytics" },
    { id: "profile", name: "Profile", path: "/admin/profile" },
  ];

  const handleNavigation = (item) => {
    setActiveTab(item.id);
    navigate(item.path);
  };

  React.useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath === "/admin" || currentPath === "/admin/") {
      setActiveTab("dashboard");
    } else {
      const currentItem = menuItems.find((item) => item.path === currentPath);
      if (currentItem && currentItem.id !== activeTab) {
        setActiveTab(currentItem.id);
      }
    }
  }, [location.pathname]);

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h2>ADMIN PANEL</h2>
        <p>Dashboard</p>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-item ${activeTab === item.id ? "active" : ""}`}
            onClick={() => handleNavigation(item)}
          >
            <span className="sidebar-name">{item.name}</span>
            {activeTab === item.id && (
              <span className="active-indicator"></span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="admin-info">
          <div className="admin-avatar">A</div>
          <div>
            <p>Admin User</p>
            <small>admin@nivest.com</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
