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
  <>
    <Link to="/me" className="hover:underline">Home</Link>
    <Link to="/expenses/create" className="hover:underline">CreateExpense</Link>
    <Link to="/expenses/update" className="hover:underline">UpdateExpense</Link>
    <Link to="/expenses/get" className="hover:underline">GetExpense</Link>
    <Link to="/expenses/delete" className="hover:underline">DeleteExpense</Link>
    <Link to="/expenses/search" className="hover:underline">SearchExpense</Link>
  </>
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
