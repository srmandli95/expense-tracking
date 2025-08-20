import { Link, useNavigate, useLocation } from "react-router-dom";
import { isAuthenticated, removeToken } from "../utils/auth";
import { useEffect, useState } from "react";

export default function Navbar() {
  const nav = useNavigate();
  const location = useLocation();
  const [auth, setAuth] = useState(isAuthenticated());

  useEffect(() => {
    // Re-evaluate auth state on route changes
    setAuth(isAuthenticated());
  }, [location]);

  const logout = () => {
    removeToken();
    setAuth(false);
    nav("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-gray-900 text-white shadow">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex gap-4 items-center">
          {!auth ? (
            <>
              <Link to="/register" className="hover:underline">
                Register
              </Link>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
            </>
          ) : (
            <Link to="/me" className="hover:underline font-medium">
              Home
            </Link>
          )}
        </div>

        {auth && (
          <button
            onClick={logout}
            className="bg-red-500 px-3 py-1.5 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}
