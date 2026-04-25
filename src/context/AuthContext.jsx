// context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);

  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("nivest_user");
    const storedUserType = localStorage.getItem("nivest_user_type");

    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setIsAuthenticated(true);
      setUserType(storedUserType || getUserTypeFromRole(parsed));
      
      // Load profile image
      const savedImg = localStorage.getItem(`profile_image_${parsed.id}`);
      if (savedImg) setProfileImage(savedImg);
    }
    setLoading(false);
  }, []);

  const updateProfileImage = (imageData) => {
    if (user?.id) {
      setProfileImage(imageData);
      localStorage.setItem(`profile_image_${user.id}`, imageData);
    }
  };

  const getUserTypeFromRole = (userObj) => {
    if (userObj.role === "admin" || userObj.isAdmin === true) return "admin";
    if (userObj.isSeller === true || userObj.role === "seller") return "seller";
    return "customer";
  };

  const login = (userData) => {
    // Make sure user has email
    const userObj = {
      ...userData,
      id: userData.id || Math.floor(Date.now() / 1000),
      email: userData.email,
      isSeller: userData.isSeller === true || userData.role === "seller",
      isAdmin: userData.isAdmin === true || userData.role === "admin",
    };
    const userTypeValue = getUserTypeFromRole(userObj);

    setUser(userObj);
    setIsAuthenticated(true);
    setUserType(userTypeValue);
    localStorage.setItem("nivest_user", JSON.stringify(userObj));
    localStorage.setItem("nivest_user_type", userTypeValue);

    // Load user-specific image on login
    const savedImg = localStorage.getItem(`profile_image_${userObj.id}`);
    setProfileImage(savedImg || null);
  };

  const signup = (userData) => {
    // Make sure user has email
    const userObj = {
      ...userData,
      id: userData.id || Math.floor(Date.now() / 1000),
      email: userData.email,
      isSeller: userData.isSeller === true || userData.role === "seller",
      isAdmin: userData.isAdmin === true || userData.role === "admin",
    };
    const userTypeValue = getUserTypeFromRole(userObj);

    setUser(userObj);
    setIsAuthenticated(true);
    setUserType(userTypeValue);
    localStorage.setItem("nivest_user", JSON.stringify(userObj));
    localStorage.setItem("nivest_user_type", userTypeValue);
    setProfileImage(null);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setUserType(null);
    setProfileImage(null);
    localStorage.removeItem("nivest_user");
    localStorage.removeItem("nivest_user_type");
    
    // Clear user-specific locally stored images or other metadata if needed
    // But don't clear onboarding data - keep it for each seller
    
    // Refresh page to reset all contexts to their initial guest state
    window.location.href = "/login";
  };

  const isSeller = user?.isSeller === true || user?.role === "seller";
  const isAdmin = user?.isAdmin === true || user?.role === "admin";
  const isCustomer = !isSeller && !isAdmin && user !== null;

  const hasSellerAccess = () => isAuthenticated && isSeller;
  const hasCustomerAccess = () => isAuthenticated && isCustomer;
  const hasAdminAccess = () => isAuthenticated && isAdmin;
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
        profileImage,
        updateProfileImage,
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
