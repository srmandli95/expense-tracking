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
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <div className="flex gap-4">
        {!auth && (
          <>
            <Link to="/register" className="hover:underline">Register</Link>
            <Link to="/login" className="hover:underline">Login</Link>
          </>
        )}
        {auth && (
          <Link to="/expenses" className="hover:underline">Expenses</Link>
        )}
      </div>
      {auth && (
        <button onClick={logout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
          Logout
        </button>
      )}
    </nav>
  );
}
