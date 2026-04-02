// App.js
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { StoreProvider } from "./context/StoreContext";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HeroSection from "./components/Herosection";
import ProductListing from "./components/Productlisting";
import About from "./components/About";
import New_arrivals from "./components/New arrivals";
import Women from "./components/Women";
import Testimoni from "./components/Testimoni";
import ShopPage from "./components/ShopPage";
import CompanyPage from "./components/CompanyPage";
import BlogPage from "./components/BlogPage";
import CartPage from "./components/CartPage";
import WishlistPage from "./components/WishlistPage";
import SearchPage from "./components/SearchPage";
import ContactPage from "./components/ContactPage";
import ProfilePage from "./components/ProfilePage";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import SellerDashboard from "./components/SellerDashboard";

function HomePage() {
  return (
    <>
      <HeroSection image="https://images.unsplash.com/photo-1520975661595-6453be3f7070?q=80&w=1974&auto=format&fit=crop" />
      <ProductListing />
      <About />
      <New_arrivals />
      <Women />
      <Testimoni />
      <Footer />
    </>
  );
}

// Create a wrapper component to handle conditional Navbar rendering
function AppContent() {
  const location = useLocation();
  // Hide navbar on these routes
  const hideNavbarRoutes = ["/seller-dashboard", "/login", "/signup"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="App">
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/company" element={<CompanyPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes - Require Authentication */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Seller Dashboard - Protected Route */}
        <Route
          path="/seller-dashboard"
          element={
            <ProtectedRoute>
              <SellerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <Router>
          <AppContent />
        </Router>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;
