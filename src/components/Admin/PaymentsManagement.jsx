// src/components/Admin/PaymentsManagement.jsx
import React, { useState } from "react";

const PaymentsManagement = ({ payments, setPayments, orders }) => {
  const [filter, setFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentNote, setPaymentNote] = useState("");

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#f59e0b";
      case "completed":
        return "#10b981";
      case "failed":
        return "#ef4444";
      case "refunded":
        return "#8b5cf6";
      case "processing":
        return "#3b82f6";
      default:
        return "#6c757d";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "completed":
        return "Completed";
      case "failed":
        return "Failed";
      case "refunded":
        return "Refunded";
      case "processing":
        return "Processing";
      default:
        return status;
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "Credit Card":
        return "💳";
      case "PayPal":
        return "💰";
      case "Bank Transfer":
        return "🏦";
      case "Cash on Delivery":
        return "💵";
      default:
        return "💳";
    }
  };

  const updatePaymentStatus = (id, newStatus, note = "") => {
    setPayments(
      payments.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, status: newStatus };
          if (note) updatedItem.note = note;
          if (newStatus === "completed")
            updatedItem.completedDate = new Date().toISOString().split("T")[0];
          if (newStatus === "refunded")
            updatedItem.refundDate = new Date().toISOString().split("T")[0];
          return updatedItem;
        }
        return item;
      }),
    );
    setShowPaymentModal(false);
    setSelectedPayment(null);
    setPaymentNote("");
  };

  const deletePayment = (id) => {
    if (
      window.confirm("Are you sure you want to delete this payment record?")
    ) {
      setPayments(payments.filter((item) => item.id !== id));
    }
  };

  const addNewPayment = (newPayment) => {
    const newPaymentObj = {
      id: `PAY${String(payments.length + 1).padStart(3, "0")}`,
      ...newPayment,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
    };
    setPayments([...payments, newPaymentObj]);
  };

  const filteredPayments =
    filter === "all"
      ? payments
      : payments.filter((item) => item.status === filter);

  const getPaymentCountByStatus = (status) => {
    if (status === "all") return payments.length;
    return payments.filter((item) => item.status === status).length;
  };

  const totalPending = payments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalCompleted = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalRefunded = payments
    .filter((p) => p.status === "refunded")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="payments-management">
      <div className="management-header">
        <h2>Payments Management</h2>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({getPaymentCountByStatus("all")})
          </button>
          <button
            className={`filter-btn ${filter === "pending" ? "active" : ""}`}
            onClick={() => setFilter("pending")}
          >
            Pending ({getPaymentCountByStatus("pending")})
          </button>
          <button
            className={`filter-btn ${filter === "processing" ? "active" : ""}`}
            onClick={() => setFilter("processing")}
          >
            Processing ({getPaymentCountByStatus("processing")})
          </button>
          <button
            className={`filter-btn ${filter === "completed" ? "active" : ""}`}
            onClick={() => setFilter("completed")}
          >
            Completed ({getPaymentCountByStatus("completed")})
          </button>
          <button
            className={`filter-btn ${filter === "failed" ? "active" : ""}`}
            onClick={() => setFilter("failed")}
          >
            Failed ({getPaymentCountByStatus("failed")})
          </button>
          <button
            className={`filter-btn ${filter === "refunded" ? "active" : ""}`}
            onClick={() => setFilter("refunded")}
          >
            Refunded ({getPaymentCountByStatus("refunded")})
          </button>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="payments-summary">
        <div className="summary-card">
          <h4>Total Revenue</h4>
          <p className="summary-amount">
            {(totalCompleted + totalPending).toLocaleString()}
          </p>
        </div>
        <div className="summary-card">
          <h4>Completed Payments</h4>
          <p className="summary-amount success">
            {totalCompleted.toLocaleString()}
          </p>
        </div>
        <div className="summary-card">
          <h4>Pending Payments</h4>
          <p className="summary-amount warning">
            {totalPending.toLocaleString()}
          </p>
        </div>
        <div className="summary-card">
          <h4>Refunded Amount</h4>
          <p className="summary-amount refunded">
            {totalRefunded.toLocaleString()}
          </p>
        </div>
      </div>

      {filteredPayments.length === 0 ? (
        <div className="empty-state">
          <p>No payment records found</p>
        </div>
      ) : (
        <div className="payments-table-container">
          <table className="payments-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((item) => (
                <tr key={item.id}>
                  <td>
                    <strong>{item.id}</strong>
                  </td>
                  <td>#{item.orderId}</td>
                  <td>{item.customer}</td>
                  <td className="amount-cell">
                    {item.amount.toLocaleString()}
                  </td>
                  <td>
                    <span className="payment-method">
                      {getPaymentMethodIcon(item.method)} {item.method}
                    </span>
                  </td>
                  <td>{item.date}</td>
                  <td>
                    <span
                      className="order-status"
                      style={{ background: getStatusColor(item.status) }}
                    >
                      {getStatusText(item.status)}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <select
                        value={item.status}
                        onChange={(e) =>
                          updatePaymentStatus(item.id, e.target.value)
                        }
                        className="status-select-small"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Complete</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refund</option>
                      </select>
                      <button
                        className="view-btn-small"
                        onClick={() => {
                          setSelectedPayment(item);
                          setShowPaymentModal(true);
                        }}
                      >
                        View
                      </button>
                      <button
                        className="delete-btn-small"
                        onClick={() => deletePayment(item.id)}
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

      {/* Payment Details Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Payment Details</h3>
              <button
                className="close-btn"
                onClick={() => setShowPaymentModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="details-grid">
                <div className="detail-item">
                  <label>Payment ID:</label>
                  <span>{selectedPayment.id}</span>
                </div>
                <div className="detail-item">
                  <label>Order ID:</label>
                  <span>#{selectedPayment.orderId}</span>
                </div>
                <div className="detail-item">
                  <label>Customer:</label>
                  <span>{selectedPayment.customer}</span>
                </div>
                <div className="detail-item">
                  <label>Amount:</label>
                  <span>{selectedPayment.amount.toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <label>Payment Method:</label>
                  <span>{selectedPayment.method}</span>
                </div>
                <div className="detail-item">
                  <label>Date:</label>
                  <span>{selectedPayment.date}</span>
                </div>
                <div className="detail-item">
                  <label>Status:</label>
                  <span
                    className="order-status"
                    style={{
                      background: getStatusColor(selectedPayment.status),
                      display: "inline-block",
                      padding: "4px 12px",
                    }}
                  >
                    {getStatusText(selectedPayment.status)}
                  </span>
                </div>
                {selectedPayment.completedDate && (
                  <div className="detail-item">
                    <label>Completed Date:</label>
                    <span>{selectedPayment.completedDate}</span>
                  </div>
                )}
                {selectedPayment.refundDate && (
                  <div className="detail-item">
                    <label>Refund Date:</label>
                    <span>{selectedPayment.refundDate}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setShowPaymentModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsManagement;
