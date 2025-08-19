import { useEffect, useState } from "react";
import { listExpenses, deleteExpense } from "../api/expenses";

export default function DeleteExpense() {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  const fetchData = async () => {
    try {
      const res = await listExpenses({});
      setItems(res.data);
    } catch (e) {
      setMessage(e?.response?.data?.detail || "Failed to load expenses");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await deleteExpense(id);
      setMessage("Expense deleted!");
      fetchData();
    } catch (e) {
      setMessage(e?.response?.data?.detail || "Delete failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Delete Expense</h2>
      {message && <p className="mb-3 text-sm">{message}</p>}
      <table className="min-w-full text-sm border rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2">Date</th>
            <th className="text-left p-2">Category</th>
            <th className="text-left p-2">Description</th>
            <th className="text-right p-2">Amount</th>
            <th className="text-left p-2">Currency</th>
            <th className="p-2">Delete</th>
          </tr>
        </thead>
        <tbody>
          {items.map((x) => (
            <tr key={x.id} className="border-t">
              <td className="p-2">{x.spent_at}</td>
              <td className="p-2">{x.category}</td>
              <td className="p-2">{x.description || "-"}</td>
              <td className="p-2 text-right">{x.amount.toFixed(2)}</td>
              <td className="p-2">{x.currency}</td>
              <td className="p-2">
                <button
                  className="px-2 py-1 border rounded text-red-600"
                  onClick={() => handleDelete(x.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}