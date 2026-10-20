"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FaLeaf,
  FaLock,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaShieldHalved,
  FaArrowLeft,
  FaCircleExclamation,
} from "react-icons/fa6";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/admin/emails";

  const [email, setEmail] = useState("admin@nettleregenerative.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed. Please check your credentials.");
        setLoading(false);
        return;
      }

      // Successful login -> Navigate to protected dashboard
      router.push(redirectPath);
      router.refresh();
    } catch {
      setError("Network or server connection error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9F6] flex flex-col justify-between selection:bg-[#84C135] selection:text-[#11231A]">
      {/* Top Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#52665B] hover:text-[#113B27] transition-colors"
        >
          <FaArrowLeft className="w-3.5 h-3.5" />
          Back to Nettle Regenerative
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-[#708579] font-medium">
          <FaShieldHalved className="text-[#84C135]" />
          <span>Encrypted Admin Portal</span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card Wrapper */}
          <div className="bg-white rounded-3xl border border-[#113B27]/10 shadow-[0_20px_50px_-15px_rgba(17,59,39,0.08)] p-8 sm:p-10">
            {/* Brand Logo & Heading */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#EBF7D9] text-[#113B27] mb-4 shadow-inner">
                <FaLeaf className="w-7 h-7 text-[#84C135]" />
              </div>
              <h1 className="text-2xl font-bold text-[#113B27] tracking-tight">
                Email Management Hub
              </h1>
              <p className="text-sm text-[#52665B] mt-1.5">
                Sign in to manage customer inquiries and messages
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200/80 text-red-700 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in">
                <FaCircleExclamation className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#113B27] uppercase tracking-wider mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#708579]">
                    <FaEnvelope className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@nettleregenerative.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#F7F9F6] border border-[#113B27]/15 rounded-xl text-sm text-[#11231A] placeholder:text-[#8B9E93] focus:outline-none focus:ring-2 focus:ring-[#84C135] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#113B27] uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#708579]">
                    <FaLock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter admin password"
                    className="w-full pl-10 pr-11 py-3 bg-[#F7F9F6] border border-[#113B27]/15 rounded-xl text-sm text-[#11231A] placeholder:text-[#8B9E93] focus:outline-none focus:ring-2 focus:ring-[#84C135] focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#708579] hover:text-[#113B27] transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-4 bg-[#113B27] hover:bg-[#174A32] active:bg-[#091E14] text-white font-medium text-sm rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <FaSpinner className="w-4 h-4 animate-spin" />
                    <span>Verifying session...</span>
                  </>
                ) : (
                  <span>Access Dashboard</span>
                )}
              </button>
            </form>

            {/* Hint for local dev */}
            <div className="mt-6 pt-5 border-t border-[#113B27]/10 text-center">
              <p className="text-xs text-[#708579] leading-relaxed">
                Credentials are authenticated against server environment variables (<code className="bg-[#EBF7D9] text-[#113B27] px-1 py-0.5 rounded font-mono text-[11px]">ADMIN_PASSWORD</code>).
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-4 text-center text-xs text-[#708579]">
        © {new Date().getFullYear()} Nettle Regenerative Ltd. All rights reserved.
      </footer>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F9F6] flex items-center justify-center">
          <FaSpinner className="w-8 h-8 animate-spin text-[#84C135]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

