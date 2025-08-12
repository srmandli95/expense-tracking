import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/auth";
import { saveToken } from "../utils/auth";

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await API.post("/auth/login", form);
      saveToken(res.data.access_token);
      nav("/me");
    } catch (err) {
      setMsg(err?.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border p-2 rounded" type="email" name="email"
               placeholder="Email" value={form.email} onChange={onChange} required />
        <input className="w-full border p-2 rounded" type="password" name="password"
               placeholder="Password" value={form.password} onChange={onChange} required />
        <button className="bg-green-600 text-white px-4 py-2 rounded w-full">Sign in</button>
      </form>
      {msg && <p className="mt-3 text-sm">{msg}</p>}
    </div>
  );
}
