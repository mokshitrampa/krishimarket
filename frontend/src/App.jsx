import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { CompareProvider } from './context/CompareContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Layouts
import { MainLayout } from './layouts/MainLayout';
import { CustomerLayout } from './layouts/CustomerLayout';
import { FarmerLayout } from './layouts/FarmerLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { MarketplacePage } from './pages/public/MarketplacePage';
import { ProductDetailsPage } from './pages/public/ProductDetailsPage';
import { FarmerDirectoryPage } from './pages/public/FarmerDirectoryPage';
import { FarmerProfilePage } from './pages/public/FarmerProfilePage';
import { FarmerComparisonPage } from './pages/public/FarmerComparisonPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { AboutPage } from './pages/public/AboutPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { CustomerRegisterPage } from './pages/auth/CustomerRegisterPage';
import { FarmerRegisterPage } from './pages/auth/FarmerRegisterPage';

// Customer Pages
import { CustomerDashboardPage } from './pages/customer/CustomerDashboardPage';
import { CustomerOrdersPage } from './pages/customer/CustomerOrdersPage';
import { OrderDetailsPage } from './pages/customer/OrderDetailsPage';
import { SavedFarmersPage } from './pages/customer/SavedFarmersPage';
import { CartPage } from './pages/customer/CartPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';

// Farmer Pages
import { FarmerDashboardPage } from './pages/farmer/FarmerDashboardPage';
import { FarmerProductsPage } from './pages/farmer/FarmerProductsPage';
import { FarmerOrdersPage } from './pages/farmer/FarmerOrdersPage';
import { FarmerAnalyticsPage } from './pages/farmer/FarmerAnalyticsPage';
import { FarmerProfileSettingsPage } from './pages/farmer/FarmerProfileSettingsPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminFarmerApprovalsPage } from './pages/admin/AdminFarmerApprovalsPage';
import { AdminFarmersPage } from './pages/admin/AdminFarmersPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminDisputesPage } from './pages/admin/AdminDisputesPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <CompareProvider>
            <Routes>
              {/* Public Routes with MainLayout */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/products/:id" element={<ProductDetailsPage />} />
                <Route path="/farmers" element={<FarmerDirectoryPage />} />
                <Route path="/farmers/:id" element={<FarmerProfilePage />} />
                <Route path="/compare-farmers" element={<FarmerComparisonPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register/customer" element={<CustomerRegisterPage />} />
                <Route path="/register/farmer" element={<FarmerRegisterPage />} />
              </Route>

              {/* Customer Routes with CustomerLayout */}
              <Route
                path="/customer"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <CustomerLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/customer/dashboard" replace />} />
                <Route path="dashboard" element={<CustomerDashboardPage />} />
                <Route path="orders" element={<CustomerOrdersPage />} />
                <Route path="orders/:id" element={<OrderDetailsPage />} />
                <Route path="saved-farmers" element={<SavedFarmersPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
              </Route>

              {/* Farmer Routes with FarmerLayout */}
              <Route
                path="/farmer"
                element={
                  <ProtectedRoute allowedRoles={['farmer']}>
                    <FarmerLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/farmer/dashboard" replace />} />
                <Route path="dashboard" element={<FarmerDashboardPage />} />
                <Route path="products" element={<FarmerProductsPage />} />
                <Route path="orders" element={<FarmerOrdersPage />} />
                <Route path="analytics" element={<FarmerAnalyticsPage />} />
                <Route path="profile" element={<FarmerProfileSettingsPage />} />
              </Route>

              {/* Admin Routes with AdminLayout */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="approvals" element={<AdminFarmerApprovalsPage />} />
                <Route path="farmers" element={<AdminFarmersPage />} />
                <Route path="customers" element={<AdminCustomersPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="reviews" element={<AdminReviewsPage />} />
                <Route path="disputes" element={<AdminDisputesPage />} />
                <Route path="analytics" element={<AdminAnalyticsPage />} />
              </Route>

              {/* Fallback 404 */}
              <Route element={<MainLayout />}>
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </CompareProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;