import React, { ReactNode, useEffect } from 'react';
import { useAuth } from '@/src/features/auth/AuthContext';
import { useRouter, usePathname, Link } from '@/src/lib/router';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  LogOut,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isAdmin, logoutAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // If on login page, render children directly without admin shell
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isAdmin && !isLoginPage) {
      router.replace('/admin/login');
    }
  }, [isAdmin, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isAdmin) {
    return null; // Will redirect via useEffect
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Menu Management', href: '/admin/menu', icon: UtensilsCrossed },
    { label: 'Order Pipeline', href: '/admin/orders', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-stone-900 text-stone-300 border-r border-stone-800 p-4 sm:p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Admin Header */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-lg">
                🍲
              </div>
              <div>
                <div className="font-extrabold text-sm text-white tracking-tight">Addis Eats</div>
                <div className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Admin Portal
                </div>
              </div>
            </div>

            <Link
              href="/"
              title="Return to Customer Store"
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          {/* Admin Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);

              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-stone-400 hover:text-white hover:bg-stone-800/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-white/70" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Admin Footer & Logout */}
        <div className="pt-6 border-t border-stone-800 space-y-3">
          <div className="bg-stone-800/80 p-3 rounded-xl text-[11px] text-stone-400 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>Demonstration admin mode (sessionStorage).</span>
          </div>

          <button
            type="button"
            onClick={() => {
              logoutAdmin();
              router.push('/admin/login');
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-stone-400 hover:text-red-400 hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Admin Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Admin Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
