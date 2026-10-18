import React, { useState } from 'react';
import { Link, usePathname } from '@/src/lib/router';
import { useCart } from '@/src/features/cart/CartContext';
import { useFavorites } from '@/src/features/favorites/FavoritesContext';
import { useTheme } from '@/src/context/ThemeContext';
import { useAuth } from '@/src/features/auth/AuthContext';
import {
  UtensilsCrossed,
  Heart,
  ShoppingBag,
  Clock,
  Sun,
  Moon,
  Menu as MenuIcon,
  X,
  User,
  Shield,
  LogOut,
  LogIn,
} from 'lucide-react';
import { Modal } from '@/src/components/ui/Modal';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';

export function Header() {
  const pathname = usePathname();
  const { totalItemCount } = useCart();
  const { favorites } = useFavorites();
  const { theme, toggleTheme } = useTheme();
  const { user, loginCustomer, logoutCustomer, isAdmin } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [loginName, setLoginName] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginError, setLoginError] = useState('');

  const navLinks = [
    { label: 'Menu', href: '/menu', icon: UtensilsCrossed },
    { label: 'Favorites', href: '/favorites', icon: Heart, count: favorites.length },
    { label: 'Orders', href: '/orders', icon: Clock },
  ];

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginName.trim()) {
      setLoginError('Please enter your name.');
      return;
    }
    const cleanPhone = loginPhone.replace(/\s+/g, '');
    const ethPhoneRegex = /^(09|07|\+2519|\+2517)\d{8}$/;
    if (!ethPhoneRegex.test(cleanPhone)) {
      setLoginError('Enter a valid Ethiopian phone number (e.g. 0911234567).');
      return;
    }
    loginCustomer(loginName.trim(), cleanPhone);
    setAuthModalOpen(false);
    setLoginName('');
    setLoginPhone('');
    setLoginError('');
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-stone-950/90 border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-600/20 group-hover:scale-105 transition-transform">
              <span className="text-xl">🍲</span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                Addis Eats
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                  አዲስ
                </span>
              </span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 font-medium tracking-wide">
                AUTHENTIC FOOD DELIVERY
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              href="/"
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                pathname === '/'
                  ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
                  : 'text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-stone-100 dark:hover:bg-stone-800/60'
              }`}
            >
              Home
            </Link>

            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
                      : 'text-stone-700 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  {link.count !== undefined && link.count > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                      {link.count}
                    </span>
                  )}
                </Link>
              );
            })}

            <Link
              href="/admin"
              className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-colors border ${
                pathname.startsWith('/admin')
                  ? 'border-amber-600 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
                  : 'border-stone-200 dark:border-stone-800 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
              {isAdmin && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
            </Link>
          </nav>

          {/* Right Action Icons: Cart, Theme, Account */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle light and dark mode"
              className="p-2 sm:p-2.5 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-stone-600" />
              )}
            </button>

            {/* Shopping Cart Button with Dynamic Badge */}
            <Link
              href="/cart"
              className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-sm transition-all shadow-xs cursor-pointer ${
                pathname === '/cart'
                  ? 'bg-amber-700 text-white'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
              aria-label={`Shopping cart with ${totalItemCount} items`}
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-white text-amber-800 text-xs px-2 py-0.5 rounded-full font-extrabold shadow-inner">
                {totalItemCount}
              </span>
            </Link>

            {/* Customer Account Button */}
            {user ? (
              <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-stone-200 dark:border-stone-800">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate max-w-[120px]">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 font-mono">
                    {user.phone}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={logoutCustomer}
                  title="Sign out"
                  className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
              >
                <User className="w-4 h-4 text-amber-600" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              aria-label="Toggle mobile navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-stone-200 dark:border-stone-800 space-y-2 animate-in slide-in-from-top duration-200">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl font-semibold text-sm ${
                pathname === '/'
                  ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400'
                  : 'text-stone-700 dark:text-stone-300'
              }`}
            >
              Home
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl font-semibold text-sm ${
                  pathname.startsWith(link.href)
                    ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400'
                    : 'text-stone-700 dark:text-stone-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <link.icon className="w-4 h-4 text-amber-600" />
                  <span>{link.label}</span>
                </div>
                {link.count !== undefined && link.count > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-stone-200 dark:bg-stone-700 rounded-full">
                    {link.count}
                  </span>
                )}
              </Link>
            ))}

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-stone-700 dark:text-stone-300"
            >
              <Shield className="w-4 h-4 text-stone-500" />
              <span>Admin Management</span>
            </Link>

            <div className="pt-2 border-t border-stone-200 dark:border-stone-800 px-4">
              {user ? (
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-xs font-bold text-stone-900 dark:text-stone-100">{user.name}</p>
                    <p className="text-[10px] text-stone-500">{user.phone}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={logoutCustomer}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="primary"
                  className="w-full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                >
                  <LogIn className="w-4 h-4 mr-1.5" /> Sign In to Order
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Customer Quick Sign-in Modal */}
      <Modal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        title="Customer Sign In"
        description="Enter your name and Ethiopian mobile number for seamless delivery checkout."
      >
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Nahom Birhanu"
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
            required
            autoFocus
          />

          <Input
            label="Ethiopian Mobile Number"
            placeholder="09XXXXXXXX or 07XXXXXXXX"
            value={loginPhone}
            onChange={(e) => setLoginPhone(e.target.value)}
            helperText="Used by our delivery drivers to contact you upon arrival"
            required
          />

          {loginError && (
            <p className="text-xs text-red-500 font-semibold bg-red-50 dark:bg-red-950/40 p-2.5 rounded-xl border border-red-200 dark:border-red-900">
              {loginError}
            </p>
          )}

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setAuthModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Continue
            </Button>
          </div>
        </form>
      </Modal>
    </header>
  );
}
