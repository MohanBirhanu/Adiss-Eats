import React, { ReactNode } from 'react';
import { Header } from '@/src/components/layout/Header';
import { Footer } from '@/src/components/layout/Footer';
import { usePathname } from '@/src/lib/router';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
      {/* Hide customer global header on admin routes to allow clean admin layout */}
      {!isAdminRoute && <Header />}

      <main className="flex-1">
        {children}
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}
