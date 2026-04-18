// src/components/Admin/OrdersManagement.jsx
import React, { useState } from "react";

const OrdersManagement = ({ orders, setOrders }) => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#ff9800";
      case "processing":
        return "#2196F3";
      case "shipped":
        return "#8b5cf6";
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
      case "shipped":
        return "Shipped";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order,
      ),
    );
  };

  const deleteOrder = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      setOrders(orders.filter((order) => order.id !== orderId));
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === "all" || order.status === filter;
    const matchesSearch =
      order.id.toString().includes(searchTerm) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getOrderCountByStatus = (status) => {
    if (status === "all") return orders.length;
    return orders.filter((o) => o.status === status).length;
  };

  const totalRevenue = filteredOrders.reduce(
    (sum, order) => sum + order.total,
    0,
  );
  const averageOrderValue =
    filteredOrders.length > 0
      ? (totalRevenue / filteredOrders.length).toFixed(2)
      : 0;

  return (
    <div className="orders-management">
      <div className="management-header">
        <h2>Orders Management</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by order ID or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Order Stats Summary */}
      <div className="order-stats">
        <div className="order-stat-card">
          <span className="stat-label">Total Orders</span>
          <span className="stat-value">{filteredOrders.length}</span>
        </div>
        <div className="order-stat-card">
          <span className="stat-label">Total Revenue</span>
          <span className="stat-value">{totalRevenue.toLocaleString()}</span>
        </div>
        <div className="order-stat-card">
          <span className="stat-label">Average Order</span>
          <span className="stat-value">{averageOrderValue}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All Orders ({getOrderCountByStatus("all")})
        </button>
        <button
          className={`filter-tab ${filter === "pending" ? "active" : ""}`}
          onClick={() => setFilter("pending")}
        >
          Pending ({getOrderCountByStatus("pending")})
        </button>
        <button
          className={`filter-tab ${filter === "processing" ? "active" : ""}`}
          onClick={() => setFilter("processing")}
        >
          Processing ({getOrderCountByStatus("processing")})
        </button>
        <button
          className={`filter-tab ${filter === "shipped" ? "active" : ""}`}
          onClick={() => setFilter("shipped")}
        >
          Shipped ({getOrderCountByStatus("shipped")})
        </button>
        <button
          className={`filter-tab ${filter === "delivered" ? "active" : ""}`}
          onClick={() => setFilter("delivered")}
        >
          Delivered ({getOrderCountByStatus("delivered")})
        </button>
        <button
          className={`filter-tab ${filter === "cancelled" ? "active" : ""}`}
          onClick={() => setFilter("cancelled")}
        >
          Cancelled ({getOrderCountByStatus("cancelled")})
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <p>No orders found</p>
        </div>
      ) : (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="order-row">
                  <td className="order-id-cell">#{order.id}</td>
                  <td className="customer-cell">{order.customer}</td>
                  <td>{order.date}</td>
                  <td>{order.items} items</td>
                  <td className="amount-cell">${order.total.toFixed(2)}</td>
                  <td>
                    <span
                      className="order-status-badge"
                      style={{ background: getStatusColor(order.status) }}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order.id, e.target.value)
                        }
                        className="status-select-small"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button
                        className="view-btn-small"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowDetailsModal(true);
                        }}
                      >
                        View
                      </button>
                      <button
                        className="delete-btn-small"
                        onClick={() => deleteOrder(order.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="modal" onClick={() => setShowDetailsModal(false)}>
          <div
            className="modal-content order-details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Order Details - #{selectedOrder.id}</h3>
              <button
                className="close-btn"
                onClick={() => setShowDetailsModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="details-section">
                <h4>Customer Information</h4>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Customer Name:</label>
                    <span>{selectedOrder.customer}</span>
                  </div>
                  <div className="detail-item">
                    <label>Order Date:</label>
                    <span>{selectedOrder.date}</span>
                  </div>
                  <div className="detail-item">
                    <label>Total Items:</label>
                    <span>{selectedOrder.items}</span>
                  </div>
                  <div className="detail-item">
                    <label>Total Amount:</label>
                    <span>{selectedOrder.total.toFixed(2)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Order Status:</label>
                    <span
                      className="order-status-badge"
                      style={{
                        background: getStatusColor(selectedOrder.status),
                        display: "inline-block",
                        padding: "4px 12px",
                      }}
                    >
                      {getStatusText(selectedOrder.status)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Payment Status:</label>
                    <span>{selectedOrder.payment || "Pending"}</span>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h4>Shipping Information</h4>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Shipping Address:</label>
                    <span>
                      {selectedOrder.shippingAddress ||
                        "123 Main St, New York, NY 10001"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Shipping Method:</label>
                    <span>
                      {selectedOrder.shippingMethod || "Standard Shipping"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Tracking Number:</label>
                    <span>{selectedOrder.tracking || "Not available"}</span>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h4>Order Items</h4>
                <table className="order-items-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Sample Product</td>
                      <td>{selectedOrder.items}</td>
                      <td>
                        
                        {(selectedOrder.total / selectedOrder.items).toFixed(2)}
                      </td>
                      <td>{selectedOrder.total.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </button>
              <button
                className="submit-btn"
                onClick={() => {
                  updateOrderStatus(selectedOrder.id, "processing");
                  setShowDetailsModal(false);
                }}
              >
                Process Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
