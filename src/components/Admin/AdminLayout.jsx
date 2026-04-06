// src/components/Admin/AdminLayout.jsx
import React from "react";
import AdminDashboard from "./AdminDashboard";

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <AdminDashboard />
      {children}
    </div>
  );
};

export default AdminLayout;
