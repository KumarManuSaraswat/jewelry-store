import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import HomePage from "../pages/store/HomePage";
import ShopPage from "../pages/store/ShopPage";
import ProductPage from "../pages/store/ProductPage";
import CartPage from "../pages/store/CartPage";
import CheckoutPage from "../pages/store/CheckoutPage";
import OrderDetailsPage from "../pages/store/OrderDetailsPage";
import MyOrdersPage from "../pages/store/MyOrdersPage";
import AboutPage from "../pages/store/AboutPage";
import ContactPage from "../pages/store/ContactPage";
import NotFoundPage from "../pages/store/NotFoundPage";

import LoginPage from "../pages/store/LoginPage";
import RegisterPage from "../pages/store/RegisterPage";
import ForgotPasswordPage from "../pages/store/ForgotPasswordPage";
import ResetPasswordPage from "../pages/store/ResetPasswordPage";

import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminProductsPage from "../pages/admin/AdminProductsPage";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";
import AdminOrderDetailsPage from "../pages/admin/AdminOrderDetailsPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminCustomersPage from "../pages/admin/AdminCustomersPage";

import ProtectedAdminRoute from "./ProtectedAdminRoute";
import AdminLayout from "../components/admin/AdminLayout";
import { getUserInfo } from "../utils/auth";

function StoreLayout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "80vh" }}>{children}</main>
      <Footer />
    </>
  );
}

function ProtectedCustomerRoute() {
  const user = getUserInfo();
  return user?.token ? <Outlet /> : <Navigate to="/login" replace />;
}

function GuestOnlyRoute() {
  const user = getUserInfo();
  return user?.token ? <Navigate to="/" replace /> : <Outlet />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <StoreLayout>
            <HomePage />
          </StoreLayout>
        }
      />

      <Route
        path="/shop"
        element={
          <StoreLayout>
            <ShopPage />
          </StoreLayout>
        }
      />

      <Route
        path="/product/:slug"
        element={
          <StoreLayout>
            <ProductPage />
          </StoreLayout>
        }
      />

      <Route
        path="/cart"
        element={
          <StoreLayout>
            <CartPage />
          </StoreLayout>
        }
      />

      <Route element={<ProtectedCustomerRoute />}>
        <Route
          path="/checkout"
          element={
            <StoreLayout>
              <CheckoutPage />
            </StoreLayout>
          }
        />

        <Route
          path="/my-orders"
          element={
            <StoreLayout>
              <MyOrdersPage />
            </StoreLayout>
          }
        />

        <Route
          path="/orders/:id"
          element={
            <StoreLayout>
              <OrderDetailsPage />
            </StoreLayout>
          }
        />
      </Route>

      <Route
        path="/about"
        element={
          <StoreLayout>
            <AboutPage />
          </StoreLayout>
        }
      />

      <Route
        path="/contact"
        element={
          <StoreLayout>
            <ContactPage />
          </StoreLayout>
        }
      />

      <Route element={<GuestOnlyRoute />}>
        <Route
          path="/login"
          element={
            <StoreLayout>
              <LoginPage />
            </StoreLayout>
          }
        />

        <Route
          path="/register"
          element={
            <StoreLayout>
              <RegisterPage />
            </StoreLayout>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <StoreLayout>
              <ForgotPasswordPage />
            </StoreLayout>
          }
        />

        <Route
          path="/reset-password/:token"
          element={
            <StoreLayout>
              <ResetPasswordPage />
            </StoreLayout>
          }
        />
      </Route>

      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route element={<ProtectedAdminRoute />}>
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <AdminDashboardPage />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/products"
          element={
            <AdminLayout>
              <AdminProductsPage />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminLayout>
              <AdminOrdersPage />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/orders/:id"
          element={
            <AdminLayout>
              <AdminOrderDetailsPage />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminLayout>
              <AdminUsersPage />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/customers"
          element={
            <AdminLayout>
              <AdminCustomersPage />
            </AdminLayout>
          }
        />
      </Route>

      <Route
        path="*"
        element={
          <StoreLayout>
            <NotFoundPage />
          </StoreLayout>
        }
      />
    </Routes>
  );
}

export default AppRoutes;