import React, { useState, useEffect, useMemo } from 'react';
import { FaBell, FaCheckCircle, FaShoppingBag, FaCreditCard, FaInfoCircle, FaTimes } from 'react-icons/fa';

const NotificationPanel = ({ isOpen, onClose, user, isAdmin, isSeller }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [readIds, setReadIds] = useState(() => {
    const saved = localStorage.getItem('read_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const allNotifs = [];
      
      // If seller, we need their products to filter orders
      let myProductIds = [];
      if (isSeller && user?.id) {
        const prodRes = await fetch(`http://localhost:5000/api/products`);
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          myProductIds = prodData
            .filter(p => String(p.seller_id) === String(user.id))
            .map(p => String(p.id));
        }
      }

      // 1. Fetch Orders as Notifications
      let ordersUrl = "http://localhost:5000/api/admin-all-orders";
      if (!isAdmin && !isSeller && user?.id) {
        ordersUrl = `http://localhost:5000/api/orders/${user.id}`;
      }
      
      const ordersRes = await fetch(ordersUrl);
      if (ordersRes.ok) {
        let ordersData = await ordersRes.json();
        
        // Filter for Sellers: Only orders containing their products
        if (isSeller) {
          ordersData = ordersData.filter(order => {
             return (order.items || []).some(item => 
               String(item.seller_id) === String(user.id) || 
               myProductIds.includes(String(item.product_id || item.id))
             );
          });
        }

        ordersData.forEach(order => {
          allNotifs.push({
            id: `order-${order.id || order.orderNumber}`,
            title: isAdmin || isSeller ? "New Order Received" : "Order Placed Successfully",
            description: `Order ${order.orderNumber || `#${order.id}`} for ₹${order.total || order.total_amount} is ${order.status || 'confirmed'}`,
            time: new Date(order.created_at || order.orderDate || Date.now()),
            type: 'order',
            status: order.status
          });
        });
      }

      // 2. Fetch Payments (Admin Only)
      if (isAdmin) {
        const paymentsRes = await fetch("http://localhost:5000/api/admin-all-payments");
        if (paymentsRes.ok) {
          const paymentsData = await paymentsRes.json();
          paymentsData.forEach(payment => {
            allNotifs.push({
              id: `pay-${payment.id}`,
              title: "Payment Received",
              description: `Payment of ₹${payment.amount} received for Order #${payment.order_id}`,
              time: new Date(payment.created_at),
              type: 'payment',
              status: payment.payment_status
            });
          });
        }
      }

      // Sort by time descending
      allNotifs.sort((a, b) => b.time - a.time);
      setNotifications(allNotifs);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, isAdmin, isSeller, user?.id]);

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    const newReadIds = [...new Set([...readIds, ...allIds])];
    setReadIds(newReadIds);
    localStorage.setItem('read_notifications', JSON.stringify(newReadIds));
  };

  const markAsRead = (id) => {
    if (!readIds.includes(id)) {
      const newReadIds = [...readIds, id];
      setReadIds(newReadIds);
      localStorage.setItem('read_notifications', JSON.stringify(newReadIds));
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay to close when clicking outside */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 998,
          background: 'transparent'
        }} 
        onClick={onClose}
      />
      
      <div style={{
        position: 'absolute',
        top: '60px',
        right: '0',
        width: '360px',
        maxHeight: '500px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        border: '1px solid #f0f0f0',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'slideDown 0.3s ease-out'
      }}>
        <style>
          {`
            @keyframes slideDown {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .notif-item:hover { background-color: #f9f9f9; }
            .notif-scroll::-webkit-scrollbar { width: 6px; }
            .notif-scroll::-webkit-scrollbar-track { background: #f1f1f1; }
            .notif-scroll::-webkit-scrollbar-thumb { background: #e6d160; border-radius: 10px; }
          `}
        </style>

        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fff'
        }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1a1a1a' }}>Notifications</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={markAllAsRead}
              style={{
                background: 'none',
                border: 'none',
                color: '#D4AF37',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              Mark all as read
            </button>
            <button 
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', display: 'flex', alignItems: 'center' }}
            >
              <FaTimes size={14} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="notif-scroll" style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px 0'
        }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>Loading...</div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <FaBell size={32} style={{ color: '#eee', marginBottom: '12px' }} />
              <p style={{ margin: 0, color: '#999', fontSize: '14px' }}>No Notifications Found</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const isRead = readIds.includes(notif.id);
              return (
                <div 
                  key={notif.id}
                  className="notif-item"
                  onClick={() => markAsRead(notif.id)}
                  style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #f8f8f8',
                    cursor: 'pointer',
                    backgroundColor: isRead ? 'transparent' : 'rgba(212, 175, 55, 0.05)',
                    transition: 'background-color 0.2s',
                    display: 'flex',
                    gap: '12px'
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: notif.type === 'order' ? '#e8f5e9' : '#fff3e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: notif.type === 'order' ? '#4caf50' : '#ff9800',
                    flexShrink: 0
                  }}>
                    {notif.type === 'order' ? <FaShoppingBag size={18} /> : <FaCreditCard size={18} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a' }}>{notif.title}</span>
                      {!isRead && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D4AF37' }} />}
                    </div>
                    <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#666', lineHeight: '1.4' }}>
                      {notif.description}
                    </p>
                    <span style={{ fontSize: '11px', color: '#999', fontWeight: '500' }}>
                      {getTimeAgo(notif.time)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px',
          textAlign: 'center',
          borderTop: '1px solid #f0f0f0',
          backgroundColor: '#fafafa'
        }}>
          <span style={{ fontSize: '12px', color: '#999' }}>Showing latest updates</span>
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;
