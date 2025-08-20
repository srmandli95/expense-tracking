import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/auth";
import { saveToken, isAuthenticated, removeToken } from "../utils/auth";

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // {type:'success'|'error', text:string}
  const [showPwd, setShowPwd] = useState(false);

  // Force a clean login if already authed
  useEffect(() => {
    if (isAuthenticated()) {
      removeToken();
      nav("/login");
    }
  }, [nav]);

  // Auto-hide toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password.trim()) {
      setToast({ type: "error", text: "Please enter email and password." });
      return;
    }
    try {
      setLoading(true);
      const res = await API.post("/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });
      saveToken(res.data.access_token);
      setToast({ type: "success", text: "Welcome back! Redirecting…" });
      setForm({ email: "", password: "" }); // clear fields
      // Tiny delay so the toast is visible
      setTimeout(() => nav("/me"), 600);
    } catch (err) {
      setToast({
        type: "error",
        text: err?.response?.data?.detail || "Login failed. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-start justify-center pt-12 bg-gradient-to-b from-indigo-50 via-white to-white">
      <div className="w-full max-w-sm rounded-2xl border shadow-sm bg-white p-5">
        <h1 className="text-lg font-semibold mb-4">Sign in to your account</h1>

        <form onSubmit={onSubmit} className="space-y-3">
          <div className="grid gap-1.5">
            <label className="text-sm font-medium">Email</label>
            <input
              className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={onChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="grid gap-1.5">
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <input
                className="w-full border rounded-lg p-2.5 text-sm pr-20 outline-none focus:ring-2 focus:ring-blue-500"
                type={showPwd ? "text" : "password"}
                name="password"
                placeholder="Your password"
                value={form.password}
                onChange={onChange}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute inset-y-0 right-1 my-1 px-2 text-xs rounded-md border hover:bg-gray-50"
                tabIndex={-1}
              >
                {showPwd ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-3 text-xs text-gray-500">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Create one
          </Link>
          .
        </p>
      </div>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-4 left-1/2 -translate-x-1/2 max-w-sm w-[92%] sm:w-auto px-4 py-3 rounded-lg shadow-lg text-sm
            ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"} text-white`}
        >
          <div className="flex items-start gap-3">
            <span className="font-semibold">
              {toast.type === "success" ? "Success" : "Error"}
            </span>
            <span className="opacity-95">{toast.text}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-auto underline decoration-white/50 hover:decoration-white"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
