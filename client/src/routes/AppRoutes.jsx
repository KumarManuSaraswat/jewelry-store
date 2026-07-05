import { Routes, Route } from "react-router-dom";
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

import LoginPage from "../pages/auth/LoginPage";

import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminProductsPage from "../pages/admin/AdminProductsPage";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminCustomersPage from "../pages/admin/AdminCustomersPage";

import ProtectedAdminRoute from "./ProtectedAdminRoute";
import AdminLayout from "../components/admin/AdminLayout";

function StoreLayout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "80vh" }}>{children}</main>
      <Footer />
    </>
  );
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

      <Route
        path="/checkout"
        element={
          <StoreLayout>
            <CheckoutPage />
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

      <Route
        path="/my-orders"
        element={
          <StoreLayout>
            <MyOrdersPage />
          </StoreLayout>
        }
      />

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

      <Route
        path="/login"
        element={
          <StoreLayout>
            <LoginPage />
          </StoreLayout>
        }
      />

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