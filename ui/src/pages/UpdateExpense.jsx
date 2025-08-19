import { useEffect, useState } from "react";
import { listExpenses, updateExpense } from "../api/expenses";
import ExpenseForm from "../components/ExpenseForm";

export default function UpdateExpense() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await listExpenses({});
        setItems(res.data);
      } catch (e) {
        setMessage(e?.response?.data?.detail || "Failed to load expenses");
      }
    };
    fetchData();
  }, []);

  const handleUpdate = async (data) => {
    try {
      await updateExpense(selected.id, data);
      setMessage("Expense updated!");
      setSelected(null);
    } catch (e) {
      setMessage(e?.response?.data?.detail || "Update failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Update Expense</h2>
      {message && <p className="mb-3 text-sm">{message}</p>}
      {!selected ? (
        <table className="min-w-full text-sm border rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Category</th>
              <th className="text-left p-2">Description</th>
              <th className="text-right p-2">Amount</th>
              <th className="text-left p-2">Currency</th>
              <th className="p-2">Edit</th>
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
                    className="px-2 py-1 border rounded"
                    onClick={() => setSelected(x)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="max-w-lg mx-auto mt-6">
          <ExpenseForm
            initial={selected}
            onCancel={() => setSelected(null)}
            onSave={handleUpdate}
          />
        </div>
      )}
    </div>
  );
}