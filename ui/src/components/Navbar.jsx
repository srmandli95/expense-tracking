import { Link, useNavigate, useLocation } from "react-router-dom";
import { isAuthenticated, removeToken } from "../utils/auth";
import { useEffect, useMemo, useState } from "react";

export default function Navbar() {
  const nav = useNavigate();
  const location = useLocation();
  const [auth, setAuth] = useState(isAuthenticated());

  useEffect(() => {
    setAuth(isAuthenticated());
  }, [location]);

  const logout = () => {
    removeToken();
    setAuth(false);
    nav("/login");
  };

  const isHome = useMemo(() => location.pathname.startsWith("/me"), [location.pathname]);

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 text-white shadow">
      {/* subtle top accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-400 opacity-60" />
      <nav className="backdrop-blur supports-[backdrop-filter]:bg-white/5">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex gap-4 items-center">
            {!auth ? (
              <>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-md hover:bg-white/10 transition outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-md hover:bg-white/10 transition outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                >
                  Login
                </Link>
              </>
            ) : (
              <Link
                to="/me"
                className={`relative px-3 py-1.5 rounded-md transition outline-none focus-visible:ring-2 focus-visible:ring-white/50 hover:bg-white/10 ${
                  isHome ? "bg-white/10" : ""
                }`}
              >
                Home
                {/* active underline */}
                <span
                  className={`absolute left-3 right-3 -bottom-[2px] h-[2px] rounded-full transition-all ${
                    isHome ? "bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-cyan-400 opacity-90"
                    : "opacity-0 group-hover:opacity-60"
                  }`}
                />
              </Link>
            )}
          </div>

          {auth && (
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-md bg-red-500 hover:bg-red-600 active:bg-red-700 transition shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-red-300"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
