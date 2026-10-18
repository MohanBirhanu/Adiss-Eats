import React, { useState } from 'react';
import { useAuth } from '@/src/features/auth/AuthContext';
import { useRouter, Link } from '@/src/lib/router';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { Shield, Lock, ArrowLeft, KeyRound, AlertTriangle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin, isAdmin } = useAuth();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, provide direct forward
  if (isAdmin) {
    router.replace('/admin');
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const success = loginAdmin(username, password);
      if (success) {
        router.push('/admin');
      } else {
        setError('Invalid username or password. Check demo credentials below.');
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-6">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Addis Eats Store</span>
          </Link>
        </div>

        {/* Card Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-700 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-600/30">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Admin Authentication
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Manage Addis Eats dishes, live orders, statuses, and performance analytics.
          </p>
        </div>

        {/* Login Form Box */}
        <div className="bg-white dark:bg-stone-900 py-8 px-6 shadow-xl rounded-3xl border border-stone-200 dark:border-stone-800 space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Admin Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {error && (
              <p className="text-xs text-red-500 font-medium bg-red-50 dark:bg-red-950/40 p-3 rounded-xl border border-red-200 dark:border-red-900">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full text-sm shadow-md"
              isLoading={isLoading}
              rightIcon={<KeyRound className="w-4 h-4" />}
            >
              Sign In to Admin
            </Button>
          </form>

          {/* Educational Credentials Callout */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Educational Course Simulation</span>
            </div>
            <p className="text-stone-600 dark:text-stone-400 text-[11px] leading-relaxed">
              This is a demonstration authentication system using sessionStorage for the course requirement.
            </p>
            <div className="bg-white/80 dark:bg-stone-900/80 p-2.5 rounded-xl font-mono text-[11px] text-stone-700 dark:text-stone-300 border border-amber-200 dark:border-stone-800 space-y-1">
              <div>Username: <strong className="text-amber-600">admin</strong></div>
              <div>Password: <strong className="text-amber-600">admin123</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
