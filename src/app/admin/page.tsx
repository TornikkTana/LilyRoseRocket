'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    const checkSession = () => {
      const cookies = document.cookie.split(';');
      const adminSession = cookies.find((c) => c.trim().startsWith('admin_session='));
      if (adminSession) {
        router.push('/admin/dashboard');
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        // Redirect to dashboard on success
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Authentication failed. Please check credentials.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf8f3] text-[#1a1208] flex items-center justify-center p-6 relative font-sans">
      {/* Return to Home link */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#1a1208] hover:text-[#c8947a] transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to boutique
      </Link>

      <div className="w-full max-w-md bg-white border border-[#ddd4c8] rounded-3xl p-8 md:p-10 shadow-sm flex flex-col gap-8 transition-shadow hover:shadow-xl duration-500">
        {/* Brand identity */}
        <div className="text-center flex flex-col gap-2">
          <span className="font-display text-3xl font-bold tracking-widest text-[#1a1208]">
            LILY ROSE
          </span>
          <span className="text-[10px] bg-[#c8947a]/15 text-[#c8947a] px-3 py-1 rounded-full font-semibold uppercase tracking-widest mx-auto">
            Authorized Admin Entry
          </span>
        </div>

        {/* Info Box */}
        <div className="p-3.5 bg-amber-50/50 border border-amber-200/50 rounded-2xl text-[11px] text-amber-800 leading-relaxed">
          <span className="font-bold">Access Warning:</span> This portal is reserved for flower boutique managers. Unauthorized access attempts are strictly monitored.
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-start gap-3 animate-fade-in">
            <svg
              className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="font-medium">{error}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* Username */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="username"
              className="text-[10px] font-semibold text-[#1a1208] uppercase tracking-widest"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={isLoading}
              className="w-full px-4 py-3.5 bg-[#fdf8f3] border border-[#ddd4c8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c8947a]/50 focus:border-[#c8947a] transition-all text-sm"
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-[10px] font-semibold text-[#1a1208] uppercase tracking-widest"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              disabled={isLoading}
              className="w-full px-4 py-3.5 bg-[#fdf8f3] border border-[#ddd4c8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c8947a]/50 focus:border-[#c8947a] transition-all text-sm"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 flex items-center justify-center gap-2 py-4 bg-[#1a1208] hover:bg-[#c8947a] text-white rounded-xl font-medium tracking-wider shadow-sm hover:shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>Securing Session...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
