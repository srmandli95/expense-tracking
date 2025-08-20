import { useState } from "react";
import { deleteExpense } from "../api/expenses";

export default function DeleteExpenseSimple() {
  const [id, setId] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = id.trim();
    if (!trimmed) {
      setMsg("Please enter an ID to delete.");
      return;
    }

    try {
      setLoading(true);
      await deleteExpense(trimmed);
      setMsg(`✅ Expense ${trimmed} deleted.`);
      setId(""); // clear the input after success
    } catch (e) {
      setMsg(e?.response?.data?.detail || "❌ Delete failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Delete Expense</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full border p-2 rounded"
          type="text"
          placeholder="Enter Expense ID (Order ID)"
          value={id}
          onChange={(e) => setId(e.target.value)}
          disabled={loading}
        />

        <button
          type="submit"
          className={`bg-red-600 text-white px-4 py-2 rounded w-full ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </form>

      {msg && <p className="mt-3 text-sm">{msg}</p>}
    </div>
  );
}
