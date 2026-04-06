// src/context/StoreContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";

const StoreContext = createContext();

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return context;
};

export const StoreProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product, size = null, quantity = 1) => {
    setCart((prevCart) => {
      let price = product.price;
      if (typeof price === "string") {
        price = parseFloat(price.replace(/[₹,]/g, ""));
      }

      const existingItem = prevCart.find((item) => {
        if (size === null || !item.size) {
          return item.id === product.id;
        }
        return item.id === product.id && item.size === size;
      });

      if (existingItem) {
        return prevCart.map((item) => {
          if (size === null || !item.size) {
            if (item.id === product.id) {
              return { ...item, quantity: item.quantity + quantity };
            }
          } else {
            if (item.id === product.id && item.size === size) {
              return { ...item, quantity: item.quantity + quantity };
            }
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
          image:
            product.image ||
            product.images?.[0] ||
            "https://via.placeholder.com/400",
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
  };

  const removeFromCart = (productId, size = null) => {
    setCart((prevCart) =>
      prevCart.filter((item) => {
        if (size === null) {
          return item.id !== productId;
        }
        return !(item.id === productId && item.size === size);
      }),
    );
  };

  const updateQuantity = (productId, size = null, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId, size);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) => {
          if (size === null) {
            if (item.id === productId) {
              return { ...item, quantity: newQuantity };
            }
          } else {
            if (item.id === productId && item.size === size) {
              return { ...item, quantity: newQuantity };
            }
          }
          return item;
        }),
      );
    }
  };

  // ✅ NEW: Clear entire cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
    // Dispatch custom event for other components to listen
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

  // Store full product objects instead of just IDs
  const addToWishlist = (productOrId) => {
    if (typeof productOrId === "object") {
      // Full product object passed
      const exists = wishlist.some((item) => item.id === productOrId.id);
      if (!exists) {
        setWishlist((prev) => [...prev, productOrId]);
      }
    } else {
      // Only an ID passed — skip (can't store without product data)
      console.warn("addToWishlist: pass the full product object, not just ID");
    }
  };

  // Compare by object's id property
  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const toggleWishlist = (productOrId) => {
    const productId =
      typeof productOrId === "object" ? productOrId.id : productOrId;
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productOrId);
    }
  };

  // Check by object's id property
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
        clearCart, // ✅ EXPORTED HERE
        getCartTotal,
        getCartCount,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        performSearch,
        clearSearch,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
