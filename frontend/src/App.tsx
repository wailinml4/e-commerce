import { Navigate, Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'

import MainLayout from './components/layouts/MainLayout'
import AuthLayout from './components/layouts/AuthLayout'
import AdminLayout from './components/layouts/AdminLayout'

import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import CategoryPage from './pages/CategoryPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import OrderDetailsPage from './pages/OrderDetailsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import UserProfilePage from './pages/UserProfilePage'
import WishlistPage from './pages/WishlistPage'
import SearchPage from './pages/SearchPage'
import CartPage from './pages/CartPage'
import PurchaseSuccessPage from './pages/PurchaseSuccessPage'
import PurchaseCancelPage from './pages/PurchaseCancelPage'

import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminProductsPage from './pages/AdminProductsPage'
import AdminOrdersPage from './pages/AdminOrdersPage'
import AdminReturnsPage from './pages/AdminReturnsPage'
import AdminCustomersPage from './pages/AdminCustomersPage'
import AdminProfilePage from './pages/AdminProfilePage'

import { useAuthStore } from './stores/useAuthStore'
import { useCartStore } from './stores/useCartStore'
import { useWishlistStore } from './stores/useWishlistStore'
import LoadingSpinner from './components/shared/LoadingSpinner'

function App() {
  const { user, checkAuth, checkingAuth } = useAuthStore()
  const { getCartItems } = useCartStore()
  const { getWishlist } = useWishlistStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!user) return
    if (user.role !== 'customer') return

    getCartItems()
    getWishlist()
  }, [getCartItems, getWishlist, user])

  if (checkingAuth) return <LoadingSpinner />

  return (
    <div className="min-h-screen text-gray-900 relative overflow-hidden">
      <div className="relative z-50">
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/cart" element={user?.role === 'customer' ? <CartPage /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user?.role === 'customer' ? <UserProfilePage /> : <Navigate to="/login" />} />
            <Route path="/wishlist" element={user?.role === 'customer' ? <WishlistPage /> : <Navigate to="/login" />} />
            <Route path="/purchase-success" element={user?.role === 'customer' ? <PurchaseSuccessPage /> : <Navigate to="/login" />} />
            <Route path="/purchasesuccess" element={user?.role === 'customer' ? <PurchaseSuccessPage /> : <Navigate to="/login" />} />
            <Route path="/purchase-cancel" element={user?.role === 'customer' ? <PurchaseCancelPage /> : <Navigate to="/login" />} />
            <Route path="/orders" element={user?.role === 'customer' ? <OrderHistoryPage /> : <Navigate to="/login" />} />
            <Route path="/orders/:id" element={user?.role === 'customer' ? <OrderDetailsPage /> : <Navigate to="/login" />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/'} />} />
            <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/'} />} />
          </Route>

          <Route path="/admin" element={user?.role === 'admin' ? <AdminLayout /> : <Navigate to="/login" />}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="returns" element={<AdminReturnsPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
          </Route>

          <Route path="/secret-dashboard" element={<Navigate to="/admin/dashboard" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  )
}

export default App
