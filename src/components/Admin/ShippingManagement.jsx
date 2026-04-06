// src/components/Admin/ShippingManagement.jsx
import React, { useState } from "react";

const ShippingManagement = ({ shippingOrders, setShippingOrders, orders }) => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#f59e0b";
      case "processing":
        return "#3b82f6";
      case "in-transit":
        return "#8b5cf6";
      case "out-for-delivery":
        return "#06b6d4";
      case "delivered":
        return "#10b981";
      case "cancelled":
        return "#ef4444";
      default:
        return "#6c757d";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "processing":
        return "Processing";
      case "in-transit":
        return "In Transit";
      case "out-for-delivery":
        return "Out for Delivery";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const updateShippingStatus = (id, newStatus) => {
    setShippingOrders(
      shippingOrders.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item,
      ),
    );
  };

  const updateTrackingNumber = (id, tracking) => {
    setShippingOrders(
      shippingOrders.map((item) =>
        item.id === id ? { ...item, tracking, status: "processing" } : item,
      ),
    );
    setShowTrackingModal(false);
    setTrackingNumber("");
    setSelectedOrder(null);
  };

  const deleteShippingOrder = (id) => {
    if (
      window.confirm("Are you sure you want to delete this shipping order?")
    ) {
      setShippingOrders(shippingOrders.filter((item) => item.id !== id));
    }
  };

  const filteredOrders = shippingOrders.filter((item) => {
    const matchesFilter = filter === "all" || item.status === filter;
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.orderId.toString().includes(searchTerm) ||
      item.customer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getOrderCountByStatus = (status) => {
    if (status === "all") return shippingOrders.length;
    return shippingOrders.filter((item) => item.status === status).length;
  };

  const pendingCount = shippingOrders.filter(
    (s) => s.status === "pending",
  ).length;
  const inTransitCount = shippingOrders.filter(
    (s) => s.status === "in-transit",
  ).length;
  const deliveredCount = shippingOrders.filter(
    (s) => s.status === "delivered",
  ).length;

  // Limit displayed orders to prevent scrolling
  const displayedOrders = filteredOrders.slice(0, 5);

  return (
    <div
      className="shipping-management"
      style={{ height: "100%", overflow: "hidden" }}
    >
      <div className="management-header" style={{ marginBottom: "12px" }}>
        <h2 style={{ fontSize: "18px", margin: 0 }}>Shipping Management</h2>
        <div className="search-box" style={{ width: "220px" }}>
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

      {/* Shipping Stats Summary - Compact */}
      <div
        className="shipping-stats"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
          marginBottom: "12px",
        }}
      >
        <div className="shipping-stat-card" style={{ padding: "10px" }}>
          <span className="stat-label" style={{ fontSize: "10px" }}>
            Total Shipments
          </span>
          <span className="stat-value white-text" style={{ fontSize: "20px" }}>
            {shippingOrders.length}
          </span>
        </div>
        <div className="shipping-stat-card" style={{ padding: "10px" }}>
          <span className="stat-label" style={{ fontSize: "10px" }}>
            Pending
          </span>
          <span className="stat-value white-text" style={{ fontSize: "20px" }}>
            {pendingCount}
          </span>
        </div>
        <div className="shipping-stat-card" style={{ padding: "10px" }}>
          <span className="stat-label" style={{ fontSize: "10px" }}>
            In Transit
          </span>
          <span className="stat-value white-text" style={{ fontSize: "20px" }}>
            {inTransitCount}
          </span>
        </div>
        <div className="shipping-stat-card" style={{ padding: "10px" }}>
          <span className="stat-label" style={{ fontSize: "10px" }}>
            Delivered
          </span>
          <span className="stat-value white-text" style={{ fontSize: "20px" }}>
            {deliveredCount}
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
          style={{ padding: "4px 10px", fontSize: "11px" }}
        >
          All ({getOrderCountByStatus("all")})
        </button>
        <button
          className={`filter-tab ${filter === "pending" ? "active" : ""}`}
          onClick={() => setFilter("pending")}
          style={{ padding: "4px 10px", fontSize: "11px" }}
        >
          Pending ({getOrderCountByStatus("pending")})
        </button>
        <button
          className={`filter-tab ${filter === "processing" ? "active" : ""}`}
          onClick={() => setFilter("processing")}
          style={{ padding: "4px 10px", fontSize: "11px" }}
        >
          Processing ({getOrderCountByStatus("processing")})
        </button>
        <button
          className={`filter-tab ${filter === "in-transit" ? "active" : ""}`}
          onClick={() => setFilter("in-transit")}
          style={{ padding: "4px 10px", fontSize: "11px" }}
        >
          In Transit ({getOrderCountByStatus("in-transit")})
        </button>
        <button
          className={`filter-tab ${filter === "delivered" ? "active" : ""}`}
          onClick={() => setFilter("delivered")}
          style={{ padding: "4px 10px", fontSize: "11px" }}
        >
          Delivered ({getOrderCountByStatus("delivered")})
        </button>
      </div>

      {displayedOrders.length === 0 ? (
        <div
          className="empty-state"
          style={{ padding: "30px", textAlign: "center" }}
        >
          <p>No shipping orders found</p>
        </div>
      ) : (
        <div
          className="shipping-table-container"
          style={{ overflow: "hidden" }}
        >
          <table
            className="shipping-table"
            style={{ width: "100%", fontSize: "11px" }}
          >
            <thead>
              <tr>
                <th style={{ padding: "8px 6px" }}>Shipping ID</th>
                <th style={{ padding: "8px 6px" }}>Order ID</th>
                <th style={{ padding: "8px 6px" }}>Customer</th>
                <th style={{ padding: "8px 6px" }}>Address</th>
                <th style={{ padding: "8px 6px" }}>Status</th>
                <th style={{ padding: "8px 6px" }}>Tracking</th>
                <th style={{ padding: "8px 6px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedOrders.map((item) => (
                <tr key={item.id} className="shipping-row">
                  <td style={{ padding: "8px 6px" }}>#{item.id}</td>
                  <td style={{ padding: "8px 6px" }}>#{item.orderId}</td>
                  <td style={{ padding: "8px 6px" }}>{item.customer}</td>
                  <td
                    style={{
                      padding: "8px 6px",
                      maxWidth: "150px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.address}
                  </td>
                  <td style={{ padding: "8px 6px" }}>
                    <span
                      className="order-status-badge"
                      style={{
                        background: getStatusColor(item.status),
                        padding: "2px 6px",
                        fontSize: "9px",
                      }}
                    >
                      {getStatusText(item.status)}
                    </span>
                  </td>
                  <td style={{ padding: "8px 6px" }}>
                    {item.tracking ? (
                      <span
                        className="tracking-number"
                        style={{ fontSize: "10px", padding: "2px 5px" }}
                      >
                        {item.tracking}
                      </span>
                    ) : (
                      <span
                        className="no-tracking"
                        style={{ fontSize: "10px", padding: "2px 5px" }}
                      >
                        Not assigned
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "8px 6px" }}>
                    <div
                      className="action-buttons"
                      style={{ display: "flex", gap: "4px" }}
                    >
                      <select
                        value={item.status}
                        onChange={(e) =>
                          updateShippingStatus(item.id, e.target.value)
                        }
                        className="status-select-small"
                        style={{
                          padding: "2px 4px",
                          fontSize: "9px",
                          width: "70px",
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Process</option>
                        <option value="in-transit">Transit</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancel</option>
                      </select>
                      <button
                        className="tracking-btn"
                        style={{ padding: "2px 6px", fontSize: "9px" }}
                        onClick={() => {
                          setSelectedOrder(item);
                          setTrackingNumber(item.tracking || "");
                          setShowTrackingModal(true);
                        }}
                      >
                        Tracking
                      </button>
                      <button
                        className="delete-btn-small"
                        style={{
                          padding: "2px 6px",
                          fontSize: "9px",
                          background: "#ef4444",
                        }}
                        onClick={() => deleteShippingOrder(item.id)}
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

      {/* Tracking Number Modal */}
      {showTrackingModal && selectedOrder && (
        <div className="modal" onClick={() => setShowTrackingModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "400px" }}
          >
            <div className="modal-header" style={{ padding: "10px 16px" }}>
              <h3 style={{ fontSize: "14px", margin: 0 }}>
                Add Tracking Number
              </h3>
              <button
                className="close-btn"
                onClick={() => setShowTrackingModal(false)}
                style={{ fontSize: "18px" }}
              >
                ×
              </button>
            </div>
            <div className="modal-body" style={{ padding: "10px 16px" }}>
              <div className="details-section" style={{ marginBottom: "10px" }}>
                <div
                  className="details-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                  }}
                >
                  <div className="detail-item">
                    <label style={{ fontSize: "10px" }}>Shipping ID:</label>
                    <span style={{ fontSize: "11px" }}>
                      #{selectedOrder.id}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label style={{ fontSize: "10px" }}>Order ID:</label>
                    <span style={{ fontSize: "11px" }}>
                      #{selectedOrder.orderId}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label style={{ fontSize: "10px" }}>Customer:</label>
                    <span style={{ fontSize: "11px" }}>
                      {selectedOrder.customer}
                    </span>
                  </div>
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: "10px" }}>
                <label style={{ fontSize: "11px", marginBottom: "4px" }}>
                  Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  style={{ padding: "6px", fontSize: "11px" }}
                />
              </div>
            </div>
            <div
              className="modal-footer"
              style={{ padding: "10px 16px", gap: "8px" }}
            >
              <button
                className="cancel-btn"
                onClick={() => setShowTrackingModal(false)}
                style={{ padding: "4px 12px", fontSize: "11px" }}
              >
                Cancel
              </button>
              <button
                className="submit-btn"
                onClick={() =>
                  updateTrackingNumber(selectedOrder.id, trackingNumber)
                }
                style={{ padding: "4px 12px", fontSize: "11px" }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingManagement;
