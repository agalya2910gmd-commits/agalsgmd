// src/components/Admin/AdminProfile.jsx
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const AdminProfile = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "Admin User",
    email: user?.email || "admin@nivest.com",
    phone: "+1 234 567 8900",
    role: "Administrator",
    department: "Management",
    joinDate: "January 1, 2024",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    // Update user in localStorage
    const updatedUser = { ...user, name: formData.name, email: formData.email };
    localStorage.setItem("nivest_user", JSON.stringify(updatedUser));
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <div className="profile-management">
      <div className="profile-header">
        <div className="profile-avatar-large">
          {formData.name.charAt(0).toUpperCase()}
        </div>
        <h2>{formData.name}</h2>
        <p>{formData.role}</p>
      </div>

      <div className="profile-form">
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="form-group">
          <label>Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="form-group">
          <label>Role</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="form-group">
          <label>Join Date</label>
          <input
            type="text"
            name="joinDate"
            value={formData.joinDate}
            disabled={true}
          />
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
          {!isEditing ? (
            <button className="add-btn" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          ) : (
            <>
              <button className="submit-btn" onClick={handleSave}>
                Save Changes
              </button>
              <button
                className="cancel-btn"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </>
          )}
          <button className="delete-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
