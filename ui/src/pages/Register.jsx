import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/auth";
import { isAuthenticated, removeToken } from "../utils/auth";

export default function Register() { // Corrected the component name
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  // Redirect and clear token if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      removeToken(); // Delete the token
      nav("/login"); // Redirect to login
    }
  }, [nav]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await API.post("/auth/register", form);
      setMsg("Registered! Redirecting…");
      setTimeout(() => nav("/login"), 700);
    } catch (err) {
      setMsg(err?.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full border p-2 rounded"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={onChange}
          required
        />
        <input
          className="w-full border p-2 rounded"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={onChange}
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Create account
        </button>
      </form>
      {msg && <p className="mt-3 text-sm">{msg}</p>}
    </div>
  );
}