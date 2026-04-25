import React, { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import NotificationPanel from './NotificationPanel';

const NotificationBell = ({ user, isAdmin, isSeller }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const checkUnread = async () => {
    try {
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

      let ordersUrl = "http://localhost:5000/api/admin-all-orders";
      if (!isAdmin && !isSeller && user?.id) {
        ordersUrl = `http://localhost:5000/api/orders/${user.id}`;
      }
      
      const ordersRes = await fetch(ordersUrl);
      if (ordersRes.ok) {
        let ordersData = await ordersRes.json();
        
        // Filter for Sellers
        if (isSeller) {
          ordersData = ordersData.filter(order => {
             return (order.items || []).some(item => 
               String(item.seller_id) === String(user.id) || 
               myProductIds.includes(String(item.product_id || item.id))
             );
          });
        }

        const readIds = JSON.parse(localStorage.getItem('read_notifications') || "[]");
        
        let count = 0;
        ordersData.forEach(order => {
          if (!readIds.includes(`order-${order.id || order.orderNumber}`)) {
            count++;
          }
        });

        if (isAdmin) {
          const paymentsRes = await fetch("http://localhost:5000/api/admin-all-payments");
          if (paymentsRes.ok) {
            const paymentsData = await paymentsRes.json();
            paymentsData.forEach(payment => {
              if (!readIds.includes(`pay-${payment.id}`)) {
                count++;
              }
            });
          }
        }
        
        setUnreadCount(count);
      }
    } catch (err) {
      console.error("Error checking unread notifications:", err);
    }
  };

  useEffect(() => {
    checkUnread();
    const interval = setInterval(checkUnread, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [isAdmin, isSeller, user?.id]);

  // Also check when closing panel
  useEffect(() => {
    if (!isOpen) {
      checkUnread();
    }
  }, [isOpen]);

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          border: 'none',
          padding: '8px',
          cursor: 'pointer',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#333',
          transition: 'color 0.2s',
          borderRadius: '50%'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        id="notification-bell"
      >
        <FaBell size={20} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            backgroundColor: '#ef4444',
            color: 'white',
            fontSize: '10px',
            fontWeight: '700',
            minWidth: '16px',
            height: '16px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 4px',
            border: '2px solid white'
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <NotificationPanel 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        user={user}
        isAdmin={isAdmin}
        isSeller={isSeller}
      />
    </div>
  );
};

export default NotificationBell;
