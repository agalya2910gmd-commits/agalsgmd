// src/components/Admin/User.jsx
import React, { useState } from "react";

const UsersManagement = ({ users, setUsers }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const toggleUserStatus = (userId) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === "active" ? "blocked" : "active" }
          : user,
      ),
    );
  };

  const deleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== userId));
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="users-management">
      <div className="management-header">
        <h2>Users Management</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="users-grid">
        {filteredUsers.map((user) => (
          <div key={user.id} className="user-card">
            <div className="user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <div className="user-meta">
                <span className={`role-badge ${user.role}`}>{user.role}</span>
                <span className={`status-badge ${user.status}`}>
                  {user.status}
                </span>
              </div>
              <p className="join-date">Joined: {user.joinDate}</p>
            </div>
            <div className="user-actions">
              <button
                className={`status-btn ${user.status}`}
                onClick={() => toggleUserStatus(user.id)}
              >
                {user.status === "active" ? "Block User" : "Unblock User"}
              </button>
              <button
                className="delete-user-btn"
                onClick={() => deleteUser(user.id)}
              >
                Delete User
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersManagement;
