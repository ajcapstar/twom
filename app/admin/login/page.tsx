"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const trimmedEmail = email.trim().toLowerCase();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      router.refresh();
      router.push("/admin");
    } catch {
      setError("An unexpected network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-twom-bg px-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-8 border border-zinc-200 shadow-sm"
        noValidate
      >
        <h1 className="font-zodiak text-3xl text-twom-title mb-2">
          Admin Login
        </h1>
        <p className="text-twom-muted text-sm mb-6">
          Restricted administrative access.
        </p>

        {error && (
          <div
            role="alert"
            className="p-3 mb-4 text-xs text-red-600 bg-red-50 border border-red-200 rounded"
          >
            {error}
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="admin-email"
            className="block text-xs uppercase tracking-wider text-twom-muted mb-2"
          >
            Email Address
          </label>
          <input
            id="admin-email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="admin@twom.com"
            value={email}
            disabled={loading}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            className="w-full p-3.5 border border-zinc-300 text-sm focus:outline-none focus:border-twom-title disabled:bg-zinc-100 transition-colors"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="admin-password"
            className="block text-xs uppercase tracking-wider text-twom-muted mb-2"
          >
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••••••••"
            value={password}
            disabled={loading}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(null);
            }}
            className="w-full p-3.5 border border-zinc-300 text-sm focus:outline-none focus:border-twom-title disabled:bg-zinc-100 transition-colors"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || !email || !password}
          className="w-full bg-twom-title text-white py-4 text-xs font-medium uppercase tracking-[0.2em] hover:bg-black transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? "Authenticating..." : "Sign In to Admin"}
        </button>
      </form>
    </div>
  );
}
