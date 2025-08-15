import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, removeToken } from "../utils/auth";

export default function Navbar() {
  const nav = useNavigate();
  const logout = () => { removeToken(); nav("/login"); };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <div className="flex gap-4">
        <Link to="/register" className="hover:underline">Register</Link>
        <Link to="/login" className="hover:underline">Login</Link>
       {isAuthenticated() && <Link to="/expenses" className="hover:underline">Expenses</Link>}
      </div>
      {isAuthenticated() && (
        <button onClick={logout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
          Logout
        </button>
      )}
    </nav>
  );
}
