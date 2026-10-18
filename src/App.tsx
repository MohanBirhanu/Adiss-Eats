import React from 'react';
import { RouterProvider, usePathname } from '@/src/lib/router';
import { ThemeProvider } from '@/src/context/ThemeContext';
import { AuthProvider } from '@/src/features/auth/AuthContext';
import { FavoritesProvider } from '@/src/features/favorites/FavoritesContext';
import { CartProvider } from '@/src/features/cart/CartContext';

import RootLayout from '@/src/app/layout';
import HomePage from '@/src/app/page';
import MenuPage from '@/src/app/menu/page';
import DishDetailsPage from '@/src/app/menu/[id]/page';
import CartPage from '@/src/app/cart/page';
import CheckoutPage from '@/src/app/checkout/page';
import FavoritesPage from '@/src/app/favorites/page';
import OrdersPage from '@/src/app/orders/page';
import NotFoundPage from '@/src/app/not-found';

import AdminLayout from '@/src/app/admin/layout';
import AdminLoginPage from '@/src/app/admin/login/page';
import AdminDashboardPage from '@/src/app/admin/page';
import AdminMenuPage from '@/src/app/admin/menu/page';
import AdminOrdersPage from '@/src/app/admin/orders/page';

function AppContent() {
  const pathname = usePathname();

  const renderCurrentRoute = () => {
    // Admin routes
    if (pathname === '/admin/login') {
      return (
        <AdminLayout>
          <AdminLoginPage />
        </AdminLayout>
      );
    }
    if (pathname === '/admin') {
      return (
        <AdminLayout>
          <AdminDashboardPage />
        </AdminLayout>
      );
    }
    if (pathname === '/admin/menu') {
      return (
        <AdminLayout>
          <AdminMenuPage />
        </AdminLayout>
      );
    }
    if (pathname === '/admin/orders') {
      return (
        <AdminLayout>
          <AdminOrdersPage />
        </AdminLayout>
      );
    }

    // Dynamic Dish Details route /menu/[id]
    const menuDetailMatch = pathname.match(/^\/menu\/([^/]+)$/);
    if (menuDetailMatch) {
      const dishId = menuDetailMatch[1];
      return <DishDetailsPage id={dishId} />;
    }

    // Customer routes
    if (pathname === '/') {
      return <HomePage />;
    }
    if (pathname === '/menu') {
      return <MenuPage />;
    }
    if (pathname === '/cart') {
      return <CartPage />;
    }
    if (pathname === '/checkout') {
      return <CheckoutPage />;
    }
    if (pathname === '/favorites') {
      return <FavoritesPage />;
    }
    if (pathname === '/orders') {
      return <OrdersPage />;
    }

    // Not found
    return <NotFoundPage />;
  };

  return <RootLayout>{renderCurrentRoute()}</RootLayout>;
}

export default function App() {
  return (
    <RouterProvider>
      <ThemeProvider>
        <AuthProvider>
          <FavoritesProvider>
            <CartProvider>
              <AppContent />
            </CartProvider>
          </FavoritesProvider>
        </AuthProvider>
      </ThemeProvider>
    </RouterProvider>
  );
}
