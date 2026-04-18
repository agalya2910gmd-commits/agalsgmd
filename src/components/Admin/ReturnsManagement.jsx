// src/components/Admin/ReturnsManagement.jsx
import React, { useState } from "react";

const ReturnsManagement = ({ returns, setReturns, orders }) => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#f59e0b";
      case "approved":
        return "#10b981";
      case "rejected":
        return "#ef4444";
      case "processing":
        return "#3b82f6";
      case "refunded":
        return "#8b5cf6";
      default:
        return "#6c757d";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      case "processing":
        return "Processing";
      case "refunded":
        return "Refunded";
      default:
        return status;
    }
  };

  const updateStatus = (id, status) => {
    setReturns(
      returns.map((item) => (item.id === id ? { ...item, status } : item)),
    );
  };

  const deleteReturn = (id) => {
    if (
      window.confirm("Are you sure you want to delete this return request?")
    ) {
      setReturns(returns.filter((item) => item.id !== id));
    }
  };

  const filteredReturns = returns.filter((item) => {
    const matchesFilter = filter === "all" || item.status === filter;
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.orderId.toString().includes(searchTerm) ||
      item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getReturnCountByStatus = (status) => {
    if (status === "all") return returns.length;
    return returns.filter((item) => item.status === status).length;
  };

  const pendingCount = returns.filter((r) => r.status === "pending").length;
  const approvedCount = returns.filter((r) => r.status === "approved").length;
  const rejectedCount = returns.filter((r) => r.status === "rejected").length;
  const totalRefundAmount = returns
    .filter((r) => r.status === "approved" || r.status === "refunded")
    .reduce((sum, r) => sum + r.refund, 0);

  // Limit displayed returns to prevent scrolling
  const displayedReturns = filteredReturns.slice(0, 6);

  return (
    <div
      className="returns-management"
      style={{ height: "100%", overflow: "hidden" }}
    >
      <div className="management-header" style={{ marginBottom: "12px" }}>
        <h2 style={{ fontSize: "18px", margin: 0 }}>Returns Management</h2>
        <div className="search-box" style={{ width: "200px" }}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            style={{ padding: "6px 10px", fontSize: "12px" }}
          />
        </div>
      </div>

      {/* Returns Stats Summary - Compact */}
      <div
        className="returns-stats"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
          marginBottom: "12px",
        }}
      >
        <div
          className="returns-stat-card"
          style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            padding: "10px",
            borderRadius: "8px",
            textAlign: "center",
            color: "white",
          }}
        >
          <span
            className="stat-label"
            style={{ fontSize: "10px", opacity: 0.8 }}
          >
            Total Returns
          </span>
          <span
            className="stat-value"
            style={{ fontSize: "20px", fontWeight: "bold", display: "block" }}
          >
            {returns.length}
          </span>
        </div>
        <div
          className="returns-stat-card"
          style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            padding: "10px",
            borderRadius: "8px",
            textAlign: "center",
            color: "white",
          }}
        >
          <span
            className="stat-label"
            style={{ fontSize: "10px", opacity: 0.8 }}
          >
            Pending
          </span>
          <span
            className="stat-value"
            style={{ fontSize: "20px", fontWeight: "bold", display: "block" }}
          >
            {pendingCount}
          </span>
        </div>
        <div
          className="returns-stat-card"
          style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            padding: "10px",
            borderRadius: "8px",
            textAlign: "center",
            color: "white",
          }}
        >
          <span
            className="stat-label"
            style={{ fontSize: "10px", opacity: 0.8 }}
          >
            Approved
          </span>
          <span
            className="stat-value"
            style={{ fontSize: "20px", fontWeight: "bold", display: "block" }}
          >
            {approvedCount}
          </span>
        </div>
        <div
          className="returns-stat-card"
          style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            padding: "10px",
            borderRadius: "8px",
            textAlign: "center",
            color: "white",
          }}
        >
          <span
            className="stat-label"
            style={{ fontSize: "10px", opacity: 0.8 }}
          >
            Refunded
          </span>
          <span
            className="stat-value"
            style={{ fontSize: "20px", fontWeight: "bold", display: "block" }}
          >
            {totalRefundAmount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Filter Tabs - Compact */}
      <div
        className="filter-tabs"
        style={{
          display: "flex",
          gap: "6px",
          marginBottom: "12px",
          flexWrap: "wrap",
          paddingBottom: "0",
        }}
      >
        <button
          className={`filter-tab ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
          style={{ padding: "4px 10px", fontSize: "11px", borderRadius: "6px" }}
        >
          All ({getReturnCountByStatus("all")})
        </button>
        <button
          className={`filter-tab ${filter === "pending" ? "active" : ""}`}
          onClick={() => setFilter("pending")}
          style={{ padding: "4px 10px", fontSize: "11px", borderRadius: "6px" }}
        >
          Pending ({getReturnCountByStatus("pending")})
        </button>
        <button
          className={`filter-tab ${filter === "approved" ? "active" : ""}`}
          onClick={() => setFilter("approved")}
          style={{ padding: "4px 10px", fontSize: "11px", borderRadius: "6px" }}
        >
          Approved ({getReturnCountByStatus("approved")})
        </button>
        <button
          className={`filter-tab ${filter === "rejected" ? "active" : ""}`}
          onClick={() => setFilter("rejected")}
          style={{ padding: "4px 10px", fontSize: "11px", borderRadius: "6px" }}
        >
          Rejected ({getReturnCountByStatus("rejected")})
        </button>
      </div>

      {displayedReturns.length === 0 ? (
        <div
          className="empty-state"
          style={{ padding: "30px", textAlign: "center" }}
        >
          <p>No return requests found</p>
        </div>
      ) : (
        <div className="returns-table-container" style={{ overflow: "hidden" }}>
          <table
            className="returns-table"
            style={{ width: "100%", fontSize: "11px" }}
          >
            <thead>
              <tr>
                <th style={{ padding: "8px 6px" }}>Return ID</th>
                <th style={{ padding: "8px 6px" }}>Order ID</th>
                <th style={{ padding: "8px 6px" }}>Customer</th>
                <th style={{ padding: "8px 6px" }}>Product</th>
                <th style={{ padding: "8px 6px" }}>Reason</th>
                <th style={{ padding: "8px 6px" }}>Refund</th>
                <th style={{ padding: "8px 6px" }}>Status</th>
                <th style={{ padding: "8px 6px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedReturns.map((item) => (
                <tr key={item.id}>
                  <td style={{ padding: "8px 6px", fontWeight: "bold" }}>
                    #{item.id}
                  </td>
                  <td style={{ padding: "8px 6px" }}>#{item.orderId}</td>
                  <td style={{ padding: "8px 6px" }}>{item.customer}</td>
                  <td style={{ padding: "8px 6px" }}>{item.product}</td>
                  <td
                    style={{
                      padding: "8px 6px",
                      maxWidth: "120px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.reason}
                  </td>
                  <td
                    style={{
                      padding: "8px 6px",
                      fontWeight: "bold",
                      color: "#10b981",
                    }}
                  >
                    {item.refund}
                  </td>
                  <td style={{ padding: "8px 6px" }}>
                    <span
                      className="order-status-badge"
                      style={{
                        background: getStatusColor(item.status),
                        padding: "2px 6px",
                        fontSize: "9px",
                        borderRadius: "10px",
                        color: "white",
                      }}
                    >
                      {getStatusText(item.status)}
                    </span>
                  </td>
                  <td style={{ padding: "8px 6px" }}>
                    <div
                      className="action-buttons"
                      style={{ display: "flex", gap: "4px" }}
                    >
                      <select
                        value={item.status}
                        onChange={(e) => updateStatus(item.id, e.target.value)}
                        className="status-select-small"
                        style={{
                          padding: "2px 4px",
                          fontSize: "9px",
                          width: "75px",
                          borderRadius: "4px",
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approve</option>
                        <option value="rejected">Reject</option>
                      </select>
                      <button
                        className="view-btn-small"
                        style={{
                          padding: "2px 6px",
                          fontSize: "9px",
                          background: "#3b82f6",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setSelectedReturn(item);
                          setShowReturnModal(true);
                        }}
                      >
                        View
                      </button>
                      <button
                        className="delete-btn-small"
                        style={{
                          padding: "2px 6px",
                          fontSize: "9px",
                          background: "#ef4444",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                        onClick={() => deleteReturn(item.id)}
                      >
                        Del
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Return Details Modal */}
      {showReturnModal && selectedReturn && (
        <div className="modal" onClick={() => setShowReturnModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "400px" }}
          >
            <div className="modal-header" style={{ padding: "10px 16px" }}>
              <h3 style={{ fontSize: "14px", margin: 0 }}>
                Return Details - {selectedReturn.id}
              </h3>
              <button
                className="close-btn"
                onClick={() => setShowReturnModal(false)}
                style={{ fontSize: "18px" }}
              >
                ×
              </button>
            </div>
            <div className="modal-body" style={{ padding: "10px 16px" }}>
              <div
                className="details-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                }}
              >
                <div className="detail-item">
                  <label style={{ fontSize: "10px", color: "#6c757d" }}>
                    Return ID:
                  </label>
                  <span style={{ fontSize: "11px", display: "block" }}>
                    {selectedReturn.id}
                  </span>
                </div>
                <div className="detail-item">
                  <label style={{ fontSize: "10px", color: "#6c757d" }}>
                    Order ID:
                  </label>
                  <span style={{ fontSize: "11px", display: "block" }}>
                    #{selectedReturn.orderId}
                  </span>
                </div>
                <div className="detail-item">
                  <label style={{ fontSize: "10px", color: "#6c757d" }}>
                    Customer:
                  </label>
                  <span style={{ fontSize: "11px", display: "block" }}>
                    {selectedReturn.customer}
                  </span>
                </div>
                <div className="detail-item">
                  <label style={{ fontSize: "10px", color: "#6c757d" }}>
                    Product:
                  </label>
                  <span style={{ fontSize: "11px", display: "block" }}>
                    {selectedReturn.product}
                  </span>
                </div>
                <div className="detail-item" style={{ gridColumn: "span 2" }}>
                  <label style={{ fontSize: "10px", color: "#6c757d" }}>
                    Reason:
                  </label>
                  <span style={{ fontSize: "11px", display: "block" }}>
                    {selectedReturn.reason}
                  </span>
                </div>
                <div className="detail-item">
                  <label style={{ fontSize: "10px", color: "#6c757d" }}>
                    Refund Amount:
                  </label>
                  <span
                    style={{
                      fontSize: "11px",
                      display: "block",
                      fontWeight: "bold",
                      color: "#10b981",
                    }}
                  >
                    {selectedReturn.refund}
                  </span>
                </div>
                <div className="detail-item">
                  <label style={{ fontSize: "10px", color: "#6c757d" }}>
                    Status:
                  </label>
                  <span
                    className="order-status-badge"
                    style={{
                      background: getStatusColor(selectedReturn.status),
                      padding: "2px 8px",
                      fontSize: "10px",
                      borderRadius: "10px",
                      color: "white",
                      display: "inline-block",
                    }}
                  >
                    {getStatusText(selectedReturn.status)}
                  </span>
                </div>
              </div>
            </div>
            <div
              className="modal-footer"
              style={{
                padding: "10px 16px",
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <button
                className="cancel-btn"
                onClick={() => setShowReturnModal(false)}
                style={{
                  padding: "4px 12px",
                  fontSize: "11px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
              {selectedReturn.status === "pending" && (
                <>
                  <button
                    className="approve-btn"
                    style={{
                      padding: "4px 12px",
                      fontSize: "11px",
                      background: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      updateStatus(selectedReturn.id, "approved");
                      setShowReturnModal(false);
                    }}
                  >
                    Approve
                  </button>
                  <button
                    className="reject-btn"
                    style={{
                      padding: "4px 12px",
                      fontSize: "11px",
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      updateStatus(selectedReturn.id, "rejected");
                      setShowReturnModal(false);
                    }}
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnsManagement;
