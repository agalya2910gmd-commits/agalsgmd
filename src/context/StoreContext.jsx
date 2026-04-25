// src/context/StoreContext.jsx
import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import { useAuth } from "./AuthContext";

const StoreContext = createContext();

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return context;
};

export const StoreProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const sentCartEmailsRef = useRef(new Set());

  const [guestId] = useState(() => {
    let gid = localStorage.getItem("nivest_guest_id");
    if (!gid) {
      gid = Math.floor(Math.random() * 2000000000);
      localStorage.setItem("nivest_guest_id", gid.toString());
    }
    return parseInt(gid, 10);
  });

  const currentUserId = (isAuthenticated && user?.id) 
    ? (user.id > 2147483647 ? Math.floor(user.id/1000) : user.id) 
    : guestId;

  const [cart, setCart] = useState(() => {
    const key = `cart_${currentUserId}`;
    const savedCart = localStorage.getItem(key);
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const key = `wishlist_${currentUserId}`;
    const savedWishlist = localStorage.getItem(key);
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 3000);
  };

  useEffect(() => {
    localStorage.setItem(`cart_${currentUserId}`, JSON.stringify(cart));
  }, [cart, currentUserId]);

  useEffect(() => {
    localStorage.setItem(`wishlist_${currentUserId}`, JSON.stringify(wishlist));
  }, [wishlist, currentUserId]);

  // Always fetch DB context universally using currentUserId
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const cartRes = await fetch(`http://localhost:5000/api/cart/${currentUserId}`);
        if (cartRes.ok) {
          const cartData = await cartRes.json();
          // FORCED FRONTEND FILTERING: Ensure only items matching currentUserId are accepted
          const filteredCart = cartData
            .filter(item => parseInt(item.user_id) === parseInt(currentUserId))
            .map(item => ({
              id: item.product_id,
              db_id: item.id,
              name: item.product_name,
              price: parseFloat(item.price) || 0,
              image: item.product_image,
              quantity: item.quantity || 1
            }));
          setCart(filteredCart);
        }

        const wishRes = await fetch(`http://localhost:5000/api/wishlist/${currentUserId}`);
        if (wishRes.ok) {
          const wishData = await wishRes.json();
          // FORCED FRONTEND FILTERING: Ensure only items matching currentUserId are accepted
          const filteredWish = wishData
            .filter(item => parseInt(item.user_id) === parseInt(currentUserId))
            .map(item => ({
              id: item.product_id,
              db_id: item.id,
              name: item.product_name,
              price: parseFloat(item.price) || 0,
              image: item.product_image
            }));
          setWishlist(filteredWish);
        }
      } catch (err) {
        console.error("Error fetching DB cart/wishlist", err);
      }
    };
    fetchUserData();
  }, [currentUserId]);

  const addToCart = async (product, size = null, quantity = 1) => {
    let price = product.price;
    if (typeof price === "string") {
      price = parseFloat(price.replace(/[₹,$\s]/g, ""));
    }

    const productId = product.id || product._id;
    const newItemData = {
      product_id: productId,
      product_name: product.name,
      product_image: product.image || (product.images && product.images[0]) || "https://via.placeholder.com/400",
      price: price || 0,
      quantity: quantity
    };

    try {
      const response = await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: currentUserId, ...newItemData })
      });
      if (!response.ok) {
        const errData = await response.json();
        console.error("Cart POST failed:", response.status, errData);
      } else {
        console.log("Cart POST success");
        
        // --- ADD TO CART EMAIL TRIGGER ---
        if (isAuthenticated && user?.email) {
          console.log("Add to Cart Triggered", product);
          console.log("Customer email passed to EmailJS:", user.email);

          try {
            const qtyStr = quantity || 1;
            const priceStr = price ? parseFloat(price).toFixed(2) : "0.00";
            const itemsList = `1. ${product.name} - Quantity: ${qtyStr} - $${(price * quantity).toFixed(2)}`;
            
            const emailParams = {
              order_number: `CART-${Date.now()}`,
              order_date: new Date().toLocaleString(),
              total_amount: `$${(price * quantity).toFixed(2)}`,
              subtotal: `$${(price * quantity).toFixed(2)}`,
              shipping: "0",
              tax: "0",
              discount: "0",
              items: itemsList,
              estimated_delivery: "Pending Checkout",
              payment_method: "N/A",
              customer_name: user?.name || "Customer",
              customer_email: user?.email,
              customer_phone: user?.phone || "N/A",
              customer_address: "N/A",
              to_name: user?.name || "Customer",
              to_email: user?.email,
              product_name: product.name,
              price: priceStr,
              quantity: qtyStr
            };
            
            emailjs.send(
              "service_mwjv4vc",
              "template_vxpz22r",
              emailParams,
              "CnGqkQdJYAqYv2Cz6"
            )
            .then(res => {
              console.log("Mail API Success (Add to Cart)", res);
            })
            .catch(err => {
              console.error("Mail API Error (Add to Cart)", err);
            });
          } catch (e) {
            console.error("Failed to construct email payload", e);
          }
        }
        // ---------------------------------
      }
    } catch (err) {
      console.error("Failed to add to remote cart", err);
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        return prevCart.map((item) => {
          if (item.id === product.id) {
            return { ...item, quantity: item.quantity + quantity };
          }
          return item;
        });
      } else {
        const newItem = {
          id: product.id,
          name: product.name,
          price: price,
          originalPrice: product.originalPrice,
          discount: product.discount,
          image: newItemData.product_image,
          category: product.category || "",
          description: product.description || "",
          colors: product.colors || [],
          size: size,
          quantity: quantity,
          priceDisplay: product.price,
        };
        return [...prevCart, newItem];
      }
    });

    // --- TRIGGER TOAST ---
    showToast("Added to Cart");
  };

  const removeFromCart = async (productId, size = null) => {
    try {
      await fetch("http://localhost:5000/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: currentUserId, product_id: productId })
      });
    } catch (err) {
      console.error("Failed to remove from remote cart", err);
    }

    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = async (productId, size = null, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId, size);
    } else {
      try {
        await fetch("http://localhost:5000/api/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: currentUserId, product_id: productId, quantity: newQuantity })
        });
      } catch (err) {
        console.error("Failed to update remote cart quantity", err);
      }

      setCart((prevCart) =>
        prevCart.map((item) => {
          if (item.id === productId) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
      );
    }
  };

  const clearCart = async () => {
    try {
      await fetch(`http://localhost:5000/api/cart/clear/${currentUserId}`, { method: "DELETE" });
    } catch (err) {
      console.error("Failed to clear remote cart", err);
    }
    
    setCart([]);
    localStorage.removeItem("cart");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      let price = item.price;
      if (typeof price === "string") {
        price = parseFloat(price.replace(/[₹,]/g, ""));
      }
      return total + price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const addToWishlist = async (productOrId) => {
    let productObj = productOrId;
    if (typeof productOrId !== "object") {
      // If only ID is passed, we try to construct a minimal object or find it if we had a products list
      // For now, let's assume we need at least the ID
      productObj = { id: productOrId, name: "Product", image: "" };
    }

    const productId = productObj.id || productObj._id;
    let price = productObj.price;
    if (typeof price === "string") {
      price = parseFloat(price.replace(/[₹,$\s]/g, ""));
    }

    const exists = wishlist.some((item) => item.id === productId);
    if (!exists) {
      // Instant UI update (Optimistic)
      setWishlist((prev) => [...prev, { ...productObj, id: productId }]);

      try {
        const response = await fetch("http://localhost:5000/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: currentUserId,
            product_id: productId,
            product_name: productObj.name || "Product",
            product_image: productObj.image || (productObj.images ? productObj.images[0] : "") || "https://via.placeholder.com/400",
            price: price || 0
          })
        });
        if (!response.ok) {
           const errData = await response.json();
           console.error("Wishlist Background Sync Failed:", response.status, errData);
        } else {
           console.log("Wishlist Background Sync Success");
        }
      } catch (err) {
        console.error("Wishlist Background Sync Error:", err);
      }
      showToast("Added to Wishlist");
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await fetch(`http://localhost:5000/api/wishlist/${currentUserId}/${productId}`, { method: "DELETE" });
    } catch (err) {
      console.error("Failed to remove from remote wishlist", err);
    }
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
    showToast("Removed from Wishlist");
  };

  const toggleWishlist = (productOrId) => {
    const productId = typeof productOrId === "object" ? (productOrId.id || productOrId._id) : productOrId;
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productOrId);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const performSearch = (query, products) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const results = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        (product.description &&
          product.description.toLowerCase().includes(query.toLowerCase())) ||
        (product.category &&
          product.category.toLowerCase().includes(query.toLowerCase())),
    );
    setSearchResults(results);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        searchQuery,
        searchResults,
        isSearchOpen,
        setIsSearchOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        performSearch,
        clearSearch,
        currentUserId, // exported here for access globally
      }}
    >
      {children}
      
      {/* Toast Notification */}
      {toast.show && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '50px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: '600',
          fontSize: '14px',
          animation: 'toast-in-out 3s ease-in-out forwards',
          fontFamily: "'Inter', sans-serif"
        }}>
          <style>
            {`
              @keyframes toast-in-out {
                0% { opacity: 0; transform: translate(-50%, -20px); }
                10% { opacity: 1; transform: translate(-50%, 0); }
                90% { opacity: 1; transform: translate(-50%, 0); }
                100% { opacity: 0; transform: translate(-50%, -20px); }
              }
            `}
          </style>
          <span>✅</span>
          <span>{toast.message}</span>
        </div>
      )}
    </StoreContext.Provider>
  );
};
