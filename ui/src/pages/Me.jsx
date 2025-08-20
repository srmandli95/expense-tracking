import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/auth";

export default function Me() {
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setMsg("");
      const r = await API.get("/auth/me");
      setUser(r.data);
    } catch (e) {
      setUser(null);
      setMsg(e?.response?.data?.detail || "Not authenticated");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(user?.email || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-[80vh] bg-gradient-to-b from-indigo-50 via-white to-white">
      {/* Hero */}
      <div className="mx-auto max-w-5xl px-4 pt-10 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          Welcome{user ? `, ${user.email.split("@")[0]}` : ""} 👋
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Your personal dashboard for managing expenses.
        </p>
      </div>

      <div className="mx-auto max-w-5xl px-4">
        {/* Content card */}
        <div className="relative rounded-2xl border border-gray-100/80 bg-white/80 shadow-sm backdrop-blur p-5">
          {/* Loader */}
          {loading && (
            <div className="animate-pulse">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-gray-200" />
                <div className="flex-1">
                  <div className="h-4 w-44 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-72 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-24 bg-gray-100 rounded-xl" />
                <div className="h-24 bg-gray-100 rounded-xl" />
              </div>
            </div>
          )}

          {/* Error state */}
          {!loading && msg && (
            <div className="text-center py-10">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-xl mb-3">
                ✖
              </div>
              <p className="text-red-600 font-medium">{msg}</p>
              <p className="text-sm text-gray-500 mt-1">
                Please log in and try again.
              </p>
              <button
                onClick={load}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
              >
                ↻ Retry
              </button>
            </div>
          )}

          {/* Profile */}
          {!loading && user && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-indigo-600 text-white rounded-full h-14 w-14 flex items-center justify-center text-xl font-bold mr-4 shadow-sm">
                    {user.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold text-gray-900">
                        {user.email}
                      </h2>
                      <button
                        onClick={copyEmail}
                        className="text-xs px-2 py-1 rounded border hover:bg-gray-50"
                        title="Copy email"
                      >
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Your personal dashboard
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                    user.is_active
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                      : "bg-red-50 text-red-700 ring-1 ring-red-200"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      user.is_active ? "bg-emerald-600" : "bg-red-600"
                    }`}
                  />
                  {user.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Details */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl border bg-white p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    User ID
                  </p>
                  <p className="mt-1 font-mono text-sm text-gray-800 break-all">
                    {user.id}
                  </p>
                </div>

                <div className="rounded-xl border bg-white p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Status
                  </p>
                  <p
                    className={`mt-1 text-sm font-semibold ${
                      user.is_active ? "text-emerald-700" : "text-red-700"
                    }`}
                  >
                    {user.is_active ? "Active" : "Inactive"}
                  </p>
                </div>

                <div className="rounded-xl border bg-white p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Email
                  </p>
                  <p className="mt-1 text-sm text-gray-800">{user.email}</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Quick actions
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Link
                    to="/expenses/create"
                    className="group rounded-xl border bg-white p-4 hover:shadow-sm transition"
                  >
                    <div className="text-2xl group-hover:scale-105 transition">
                      ➕
                    </div>
                    <div className="mt-2 text-sm font-medium">Create</div>
                    <div className="text-xs text-gray-500">
                      Add a new expense
                    </div>
                  </Link>

                  <Link
                    to="/expenses/search"
                    className="group rounded-xl border bg-white p-4 hover:shadow-sm transition"
                  >
                    <div className="text-2xl group-hover:scale-105 transition">
                      🔎
                    </div>
                    <div className="mt-2 text-sm font-medium">Search</div>
                    <div className="text-xs text-gray-500">
                      Find past expenses
                    </div>
                  </Link>

                  <Link
                    to="/expenses/update"
                    className="group rounded-xl border bg-white p-4 hover:shadow-sm transition"
                  >
                    <div className="text-2xl group-hover:scale-105 transition">
                      ✏️
                    </div>
                    <div className="mt-2 text-sm font-medium">Update</div>
                    <div className="text-xs text-gray-500">
                      Edit an expense
                    </div>
                  </Link>

                  <Link
                    to="/expenses/delete"
                    className="group rounded-xl border bg-white p-4 hover:shadow-sm transition"
                  >
                    <div className="text-2xl group-hover:scale-105 transition">
                      🗑️
                    </div>
                    <div className="mt-2 text-sm font-medium">Delete</div>
                    <div className="text-xs text-gray-500">
                      Remove by ID
                    </div>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tiny toast for copy */}
      {copied && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg shadow text-sm bg-gray-900 text-white"
        >
          Email copied
        </div>
      )}
    </div>
  );
}
