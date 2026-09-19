import { useEffect } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HomePage from "../pages/store/HomePage";
import LandingPage from "../pages/store/LandingPage";
import SiteMotion from "../components/SiteMotion";
import { updatePageMetadata } from "../utils/pageMetadata";
import ShopPage from "../pages/store/ShopPage";
import ProductPage from "../pages/store/ProductPage";
import CartPage from "../pages/store/CartPage";
import CheckoutPage from "../pages/store/CheckoutPage";
import OrderDetailsPage from "../pages/store/OrderDetailsPage";
import MyOrdersPage from "../pages/store/MyOrdersPage";
import AboutPage from "../pages/store/AboutPage";
import ContactPage from "../pages/store/ContactPage";
import NotFoundPage from "../pages/store/NotFoundPage";
import AuthPage from "../pages/store/AuthPage";
import InfoPage from "../pages/store/InfoPage";
import WishlistPage from "../pages/store/WishlistPage";
import ForgotPasswordPage from "../pages/store/ForgotPasswordPage";
import ResetPasswordPage from "../pages/store/ResetPasswordPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminProductsPage from "../pages/admin/AdminProductsPage";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";
import AdminOrderDetailsPage from "../pages/admin/AdminOrderDetailsPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminCustomersPage from "../pages/admin/AdminCustomersPage";
import ProtectedAdminRoute from "./ProtectedAdminRoute";
import AdminLayout from "../components/admin/AdminLayout";
import useUserInfo from "../hooks/useUserInfo";
function StoreLayout() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
function ProtectedCustomerRoute() {
  const location = useLocation();
  const user = useUserInfo();
  return user?.token ? (
    <Outlet />
  ) : (
    <Navigate
      to="/login"
      replace
      state={{ from: location.pathname + location.search }}
    />
  );
}
function ProductRoute() {
  const { pathname } = useLocation();
  return <ProductPage key={pathname} />;
}
export default function AppRoutes() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    updatePageMetadata(pathname);
  }, [pathname]);
  return (
    <>
      <SiteMotion />
      <Routes>
        <Route element={<StoreLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="collections" element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="product/:slug" element={<ProductRoute />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="care" element={<InfoPage type="care" />} />
          <Route
            path="shipping-returns"
            element={<InfoPage type="shipping" />}
          />
          <Route path="login" element={<AuthPage />} />
          <Route path="register" element={<AuthPage mode="register" />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password/:token" element={<ResetPasswordPage />} />
          <Route element={<ProtectedCustomerRoute />}>
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="my-orders" element={<MyOrdersPage />} />
            <Route path="orders/:id" element={<OrderDetailsPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route
          path="admin/login"
          element={<Navigate to="/login" replace state={{ from: "/admin" }} />}
        />
        <Route element={<ProtectedAdminRoute />}>
          <Route
            path="admin"
            element={
              <AdminLayout>
                <Outlet />
              </AdminLayout>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="orders/:id" element={<AdminOrderDetailsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
