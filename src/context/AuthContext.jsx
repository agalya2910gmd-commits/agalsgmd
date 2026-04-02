// context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null); // "customer" or "seller"

  useEffect(() => {
    const storedUser = localStorage.getItem("nivest_user");
    const storedUserType = localStorage.getItem("nivest_user_type");

    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setIsAuthenticated(true);
      setUserType(storedUserType || (parsed.isSeller ? "seller" : "customer"));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const userObj = {
      ...userData,
      isSeller: userData.isSeller === true,
    };
    const userTypeValue = userObj.isSeller ? "seller" : "customer";

    setUser(userObj);
    setIsAuthenticated(true);
    setUserType(userTypeValue);
    localStorage.setItem("nivest_user", JSON.stringify(userObj));
    localStorage.setItem("nivest_user_type", userTypeValue);
  };

  const signup = (userData) => {
    const userObj = {
      ...userData,
      isSeller: userData.isSeller === true,
    };
    const userTypeValue = userObj.isSeller ? "seller" : "customer";

    setUser(userObj);
    setIsAuthenticated(true);
    setUserType(userTypeValue);
    localStorage.setItem("nivest_user", JSON.stringify(userObj));
    localStorage.setItem("nivest_user_type", userTypeValue);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setUserType(null);
    localStorage.removeItem("nivest_user");
    localStorage.removeItem("nivest_user_type");
  };

  const isSeller = user?.isSeller === true;
  const isCustomer = user?.isSeller === false || (user && !user.isSeller);

  // Helper function to check if user has seller access
  const hasSellerAccess = () => {
    return isAuthenticated && isSeller;
  };

  // Helper function to check if user has customer access
  const hasCustomerAccess = () => {
    return isAuthenticated && isCustomer;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        userType,
        isSeller,
        isCustomer,
        login,
        signup,
        logout,
        hasSellerAccess,
        hasCustomerAccess,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
