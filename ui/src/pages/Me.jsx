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

  if (msg) return <p className="text-center mt-10 text-red-600">{msg}</p>;
  if (!user) return (
    <div className="flex justify-center items-center h-40">
      <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></span>
      <span className="ml-3 text-gray-500">Loading…</span>
    </div>
  );

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="bg-blue-600 text-white rounded-full h-12 w-12 flex items-center justify-center text-xl font-bold mr-4">
            {user.email[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Welcome, {user.email}</h1>
            <p className="text-sm text-gray-500">Your personal dashboard</p>
          </div>
        </div>
        <div className="border-t pt-4 space-y-2">
          <p>
            <span className="font-semibold">User ID:</span>
            <span className="ml-2 text-gray-700">{user.id}</span>
          </p>
          <p>
            <span className="font-semibold">Status:</span>
            <span className={`ml-2 font-semibold ${user.is_active ? "text-green-600" : "text-red-600"}`}>
              {user.is_active ? "Active" : "Inactive"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}