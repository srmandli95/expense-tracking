import { useEffect, useState } from "react";
import API from "../api/auth";

export default function Me() {
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    API.get("/auth/me")
      .then((r) => setUser(r.data))
      .catch((e) => setMsg(e?.response?.data?.detail || "Not authenticated"));
  }, []);

  if (msg) return <p className="text-center mt-10">{msg}</p>;
  if (!user) return <p className="text-center mt-10">Loading…</p>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-xl font-semibold mb-2">Welcome, {user.email}</h1>
      <div className="border p-3 rounded">
        <p><span className="font-semibold">User ID:</span> {user.id}</p>
        <p><span className="font-semibold">Status:</span> {user.is_active ? "Active" : "Inactive"}</p>
      </div>
    </div>
  );
}
