import { useEffect, useState } from "react";
import {
  listExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../api/expenses";
import ExpenseForm from "../components/ExpenseForm";

export default function Expenses() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    min_amount: "",
    max_amount: "",
    date_from: "",
    date_to: "",
    q: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [message, setMessage] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.min_amount) params.min_amount = Number(filters.min_amount);
      if (filters.max_amount) params.max_amount = Number(filters.max_amount);
      if (filters.date_from) params.date_from = filters.date_from;
      if (filters.date_to) params.date_to = filters.date_to;
      if (filters.q) params.q = filters.q;

      const res = await listExpenses(params);
      setItems(res.data);
    } catch (e) {
      setMessage(e?.response?.data?.detail || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const onCreate = async (data) => {
    try {
      await createExpense(data);
      setShowForm(false);
      setMessage("Expense created");
      await fetchData();
    } catch (e) {
      setMessage(e?.response?.data?.detail || "Create failed");
    }
  };

  const onUpdate = async (data) => {
    try {
      await updateExpense(editRow.id, data);
      setEditRow(null);
      setMessage("Expense updated");
      await fetchData();
    } catch (e) {
      setMessage(e?.response?.data?.detail || "Update failed");
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this expense?")) return;
    try {
      await deleteExpense(id);
      setMessage("Expense deleted");
      await fetchData();
    } catch (e) {
      setMessage(e?.response?.data?.detail || "Delete failed");
    }
  };

  const applyFilters = async (e) => {
    e.preventDefault();
    await fetchData();
  };

  const clearFilters = async () => {
    setFilters({ category: "", min_amount: "", max_amount: "", date_from: "", date_to: "", q: "" });
    await fetchData();
  };

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Expenses</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => { setEditRow(null); setShowForm(true); }}
        >
          + New Expense
        </button>
      </div>

      {/* Filters */}
      <form onSubmit={applyFilters} className="grid md:grid-cols-6 grid-cols-2 gap-2 mb-4">
        <input
          placeholder="Category"
          className="border p-2 rounded"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        />
        <input
          placeholder="Min"
          type="number"
          step="0.01"
          className="border p-2 rounded"
          value={filters.min_amount}
          onChange={(e) => setFilters({ ...filters, min_amount: e.target.value })}
        />
        <input
          placeholder="Max"
          type="number"
          step="0.01"
          className="border p-2 rounded"
          value={filters.max_amount}
          onChange={(e) => setFilters({ ...filters, max_amount: e.target.value })}
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={filters.date_from}
          onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={filters.date_to}
          onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
        />
        <input
          placeholder="Search"
          className="border p-2 rounded"
          value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
        />

        <div className="col-span-2 md:col-span-6 flex gap-2 mt-1">
          <button className="border px-3 py-2 rounded" type="button" onClick={clearFilters}>
            Clear
          </button>
          <button className="bg-gray-900 text-white px-3 py-2 rounded" type="submit">
            Apply
          </button>
        </div>
      </form>

      {message && <p className="mb-3 text-sm">{message}</p>}

      {/* Table */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Category</th>
              <th className="text-left p-2">Description</th>
              <th className="text-right p-2">Amount</th>
              <th className="text-left p-2">Currency</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-3" colSpan={6}>Loading…</td></tr>
            ) : items.length === 0 ? (
              <tr><td className="p-3" colSpan={6}>No expenses found</td></tr>
            ) : (
              items.map((x) => (
                <tr key={x.id} className="border-t">
                  <td className="p-2">{x.spent_at}</td>
                  <td className="p-2">{x.category}</td>
                  <td className="p-2">{x.description || "-"}</td>
                  <td className="p-2 text-right">{x.amount.toFixed(2)}</td>
                  <td className="p-2">{x.currency}</td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <button
                        className="px-2 py-1 border rounded"
                        onClick={() => { setEditRow(x); setShowForm(true); }}
                      >
                        Edit
                      </button>
                      <button
                        className="px-2 py-1 border rounded text-red-600"
                        onClick={() => onDelete(x.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Drawer/Modal substitute */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded p-4 w-full max-w-lg">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">
                {editRow ? "Edit Expense" : "New Expense"}
              </h2>
              <button onClick={() => { setShowForm(false); setEditRow(null); }}>✕</button>
            </div>

            <ExpenseForm
              initial={editRow}
              onCancel={() => { setShowForm(false); setEditRow(null); }}
              onSave={(data) => {
                if (editRow) onUpdate(data);
                else onCreate(data);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
