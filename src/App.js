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
import { ProductProvider } from "./context/ProductContext";

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
import CheckoutPage from "./components/CheckoutPage";
import OrderConfirmationPage from "./components/OrderConfirmationPage";
import WishlistPage from "./components/WishlistPage";
import SearchPage from "./components/SearchPage";
import ContactPage from "./components/ContactPage";
import ProfilePage from "./components/ProfilePage";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import SellerDashboard from "./components/SellerDashboard";
import AdminDashboard from "./components/Admin/AdminDashboard";

// Home page with navbar only inside hero section
function HomePage() {
  return (
    <>
      <div className="hero-navbar-wrapper">
        <Navbar />
        <HeroSection image="https://images.unsplash.com/photo-1520975661595-6453be3f7070?q=80&w=1974&auto=format&fit=crop" />
      </div>
      <ProductListing />
      <About />
      <New_arrivals />
      <Women />
      <Testimoni />
      <Footer />
    </>
  );
}

// Wrapper component for routes
function AppContent() {
  const location = useLocation();

  // Check if current route is admin route
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route
          path="/shop"
          element={
            <>
              <Navbar />
              <ShopPage />
            </>
          }
        />
        <Route
          path="/company"
          element={
            <>
              <Navbar />
              <CompanyPage />
            </>
          }
        />
        <Route
          path="/blog"
          element={
            <>
              <Navbar />
              <BlogPage />
            </>
          }
        />
        <Route
          path="/cart"
          element={
            <>
              <Navbar />
              <CartPage />
            </>
          }
        />
        <Route
          path="/checkout"
          element={
            <>
              <Navbar />
              <CheckoutPage />
            </>
          }
        />
        <Route
          path="/order-confirmation"
          element={
            <>
              <Navbar />
              <OrderConfirmationPage />
            </>
          }
        />
        <Route
          path="/wishlist"
          element={
            <>
              <Navbar />
              <WishlistPage />
            </>
          }
        />
        <Route
          path="/search"
          element={
            <>
              <Navbar />
              <SearchPage />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <Navbar />
              <ContactPage />
            </>
          }
        />

        {/* Auth Routes - No Navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Profile Route */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <ProfilePage />
              </>
            </ProtectedRoute>
          }
        />

        {/* Seller Dashboard Protected Route - No Navbar */}
        <Route
          path="/seller-dashboard"
          element={
            <ProtectedRoute requireSeller={true}>
              <SellerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard Routes - No Navbar, Full page admin dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/shipping"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/returns"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </div>
  );
}

// Main App
function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <ProductProvider>
          <Router>
            <AppContent />
          </Router>
        </ProductProvider>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;
