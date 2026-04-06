// context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null); // "customer", "seller", or "admin"

  useEffect(() => {
    const storedUser = localStorage.getItem("nivest_user");
    const storedUserType = localStorage.getItem("nivest_user_type");

    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setIsAuthenticated(true);
      setUserType(storedUserType || getUserTypeFromRole(parsed));
    }
    setLoading(false);
  }, []);

  // Helper function to determine user type from user object
  const getUserTypeFromRole = (userObj) => {
    if (userObj.role === "admin" || userObj.isAdmin === true) return "admin";
    if (userObj.isSeller === true || userObj.role === "seller") return "seller";
    return "customer";
  };

  const login = (userData) => {
    const userObj = {
      ...userData,
      isSeller: userData.isSeller === true || userData.role === "seller",
      isAdmin: userData.isAdmin === true || userData.role === "admin",
    };
    const userTypeValue = getUserTypeFromRole(userObj);

    setUser(userObj);
    setIsAuthenticated(true);
    setUserType(userTypeValue);
    localStorage.setItem("nivest_user", JSON.stringify(userObj));
    localStorage.setItem("nivest_user_type", userTypeValue);
  };

  const signup = (userData) => {
    const userObj = {
      ...userData,
      isSeller: userData.isSeller === true || userData.role === "seller",
      isAdmin: userData.isAdmin === true || userData.role === "admin",
    };
    const userTypeValue = getUserTypeFromRole(userObj);

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

  // Role check helpers
  const isSeller = user?.isSeller === true || user?.role === "seller";
  const isAdmin = user?.isAdmin === true || user?.role === "admin";
  const isCustomer = !isSeller && !isAdmin && user !== null;

  // Helper function to check if user has seller access
  const hasSellerAccess = () => {
    return isAuthenticated && isSeller;
  };

  // Helper function to check if user has customer access
  const hasCustomerAccess = () => {
    return isAuthenticated && isCustomer;
  };

  // Helper function to check if user has admin access
  const hasAdminAccess = () => {
    return isAuthenticated && isAdmin;
  };

  // Helper function to get user role
  const getUserRole = () => {
    if (isAdmin) return "admin";
    if (isSeller) return "seller";
    if (isCustomer) return "customer";
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        userType,
        isSeller,
        isAdmin,
        isCustomer,
        login,
        signup,
        logout,
        hasSellerAccess,
        hasCustomerAccess,
        hasAdminAccess,
        getUserRole,
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
