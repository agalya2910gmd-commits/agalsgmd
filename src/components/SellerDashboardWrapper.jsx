// components/SellerDashboardWrapper.jsx
import React, { useState, useEffect } from "react";
import SellerOnboarding from "./SellerOnboarding";
import SellerDashboard from "./SellerDashboard";
import { useAuth } from "../context/AuthContext";

const SellerDashboardWrapper = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [showOnboardingForm, setShowOnboardingForm] = useState(false);
  const [savedFormData, setSavedFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !user || !user.email) {
      setLoading(false);
      return;
    }

    try {
      // Use user's email as unique key
      const userOnboardedKey = `nivest_seller_onboarded_${user.email}`;
      const userDataKey = `nivest_seller_onboarding_data_${user.email}`;

      const hasOnboarded = localStorage.getItem(userOnboardedKey) === "true";
      const savedData = localStorage.getItem(userDataKey);

      console.log("Checking onboarding for:", user.email);
      console.log("Has completed:", hasOnboarded);

      if (savedData) {
        setSavedFormData(JSON.parse(savedData));
      }

      setHasCompletedOnboarding(hasOnboarded);
    } catch (error) {
      console.error("Error:", error);
      setHasCompletedOnboarding(false);
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated, authLoading]);

  const handleOnboardingComplete = (formData) => {
    try {
      if (!user || !user.email) return;

      const userOnboardedKey = `nivest_seller_onboarded_${user.email}`;
      const userDataKey = `nivest_seller_onboarding_data_${user.email}`;

      localStorage.setItem(userOnboardedKey, "true");
      localStorage.setItem(userDataKey, JSON.stringify(formData));

      console.log("Onboarding saved for:", user.email);

      setSavedFormData(formData);
      setHasCompletedOnboarding(true);
      setShowOnboardingForm(false);
    } catch (error) {
      console.error("Error saving:", error);
      alert("Error saving. Please try again.");
    }
  };

  const handleEditOnboarding = () => {
    setShowOnboardingForm(true);
  };

  const handleCancelEdit = () => {
    setShowOnboardingForm(false);
  };

  if (authLoading || loading) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>Loading...</div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>Please login</div>
    );
  }

  // Show onboarding form for new sellers or edit mode
  if (showOnboardingForm || !hasCompletedOnboarding) {
    return (
      <SellerOnboarding
        onComplete={handleOnboardingComplete}
        initialData={!hasCompletedOnboarding ? null : savedFormData}
        onCancel={hasCompletedOnboarding ? handleCancelEdit : null}
        isEditMode={hasCompletedOnboarding}
      />
    );
  }

  return (
    <SellerDashboard
      onEditOnboarding={handleEditOnboarding}
      savedOnboardingData={savedFormData}
    />
  );
};

export default SellerDashboardWrapper;
