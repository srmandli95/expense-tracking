import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Welcome() {
  const nav = useNavigate();

  useEffect(() => {
    const onKey = (e) => e.key === "Enter" && nav("/login");
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nav]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <div className="w-full max-w-4xl px-6">
        <div className="relative rounded-3xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-md shadow-xl overflow-hidden">
          {/* subtle corner glow */}
          <div className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-r from-indigo-300/20 via-fuchsia-300/20 to-cyan-300/20" />

          <div className="relative grid grid-cols-1 md:grid-cols-5">
            {/* Illustration / Accent */}
            <div className="hidden md:flex md:col-span-2 items-center justify-center bg-gradient-to-b from-indigo-600/10 via-transparent to-cyan-500/10 p-8">
              <div className="relative">
                <div className="absolute -inset-6 blur-3xl bg-gradient-to-tr from-indigo-400/30 via-fuchsia-400/20 to-cyan-400/30 rounded-full" />
                <div className="relative rounded-2xl border border-white/20 bg-white/10 backdrop-blur p-6">
                  {/* Simple chart/finance icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-indigo-600 dark:text-cyan-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3v18h18M7 13h2v5H7v-5zm4-6h2v11h-2V7zm4 4h2v7h-2v-7z"
                    />
                  </svg>
                </div>
                <p className="mt-3 text-center text-xs text-gray-600 dark:text-gray-300">
                  Track • Search • Optimize
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="col-span-1 md:col-span-3 p-8 sm:p-10">
              <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 text-gray-700 dark:text-gray-200 mb-4">
                <span>💸</span> Expense Tracker
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-cyan-600 drop-shadow-sm">
                  Clarity for every dollar
                </span>
              </h1>

              <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                A simple, modern way to manage spending. Fast to add, easy to search, and designed to look great.
              </p>

              {/* CTA row */}
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => nav("/login")}
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition shadow-sm"
                >
                  Get Started
                  <span className="ml-2">↗</span>
                </button>

                <Link
                  to="/register"
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10 transition"
                >
                  Create an account
                </Link>
              </div>

              {/* Feature chips */}
              <div className="mt-6 flex flex-wrap gap-2">
                {["Private", "Beautiful", "Lightning Fast"].map((t) => (
                  <span
                    key={t}
                    className="text-[11px] tracking-wide uppercase rounded-full px-3 py-1 bg-black/5 dark:bg-white/10 text-gray-700 dark:text-gray-200"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                Tip: Press{" "}
                <kbd className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15">
                  Enter
                </kbd>{" "}
                to continue.
              </p>
            </div>
          </div>
        </div>

        {/* Tiny footer */}
        <div className="text-center mt-4 text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Expense Tracker
        </div>
      </div>
    </div>
  );
}
