import { useEffect, useState } from "react";
import { listExpenses } from "../api/expenses";

export default function GetExpense() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await listExpenses({});
        setItems(res.data);
      } catch (e) {
        setMessage(e?.response?.data?.detail || "Failed to load expenses");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">All Expenses</h2>
      {message && <p className="mb-3 text-sm">{message}</p>}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Category</th>
              <th className="text-left p-2">Description</th>
              <th className="text-right p-2">Amount</th>
              <th className="text-left p-2">Currency</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-3" colSpan={5}>Loading…</td></tr>
            ) : items.length === 0 ? (
              <tr><td className="p-3" colSpan={5}>No expenses found</td></tr>
            ) : (
              items.map((x) => (
                <tr key={x.id} className="border-t">
                  <td className="p-2">{x.spent_at}</td>
                  <td className="p-2">{x.category}</td>
                  <td className="p-2">{x.description || "-"}</td>
                  <td className="p-2 text-right">{x.amount.toFixed(2)}</td>
                  <td className="p-2">{x.currency}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}