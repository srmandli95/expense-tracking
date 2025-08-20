import { useEffect, useState } from "react";
import { listExpenses } from "../api/expenses";

export default function SearchExpense() {
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    category: "",
    min_amount: "",
    max_amount: "",
    description: "",
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', text: string }

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearAll = () => {
    setFilters({
      from: "",
      to: "",
      category: "",
      min_amount: "",
      max_amount: "",
      description: "",
    });
    setResults([]);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    const params = {};
    if (filters.from) params.date_from = filters.from;
    if (filters.to) params.date_to = filters.to;
    if (filters.category) params.category = filters.category.trim();
    if (filters.min_amount) params.min_amount = parseFloat(filters.min_amount);
    if (filters.max_amount) params.max_amount = parseFloat(filters.max_amount);
    if (filters.description) params.q = filters.description.trim();

    try {
      const res = await listExpenses(params);
      setResults(res.data || []);
      setToast({
        type: "success",
        text: `Found ${Array.isArray(res.data) ? res.data.length : 0} result(s).`,
      });
    } catch (e) {
      setResults([]);
      setToast({
        type: "error",
        text: e?.response?.data?.detail || "Search failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const fmtDate = (d) => {
    if (!d) return "-";
    const m = String(d).match(/^(\d{4}-\d{2}-\d{2})/);
    return m ? m[1] : String(d);
  };
  const fmtAmount = (a) => {
    const n = typeof a === "number" ? a : parseFloat(a);
    return Number.isFinite(n) ? n.toFixed(2) : a ?? "-";
  };

  return (
    <div className="min-h-[60vh] flex items-start justify-center pt-10">
      <div className="w-full max-w-4xl">
        {/* Card */}
        <div className="rounded-2xl border shadow-sm bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Search Expenses</h2>
            <div className="flex gap-2">
              <button
                onClick={clearAll}
                className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
                type="button"
              >
                Clear
              </button>
              <button
                form="expense-search-form"
                type="submit"
                className={`rounded-lg px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Searching…" : "Search"}
              </button>
            </div>
          </div>

          {/* Filters */}
          <form
            id="expense-search-form"
            onSubmit={handleSearch}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5"
          >
            <div className="grid gap-1.5">
              <label className="text-sm font-medium">From</label>
              <input
                type="date"
                name="from"
                value={filters.from}
                onChange={handleChange}
                className="border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="From"
              />
            </div>

            <div className="grid gap-1.5">
              <label className="text-sm font-medium">To</label>
              <input
                type="date"
                name="to"
                value={filters.to}
                onChange={handleChange}
                className="border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="To"
              />
            </div>

            <div className="grid gap-1.5">
              <label className="text-sm font-medium">Category</label>
              <input
                type="text"
                name="category"
                value={filters.category}
                onChange={handleChange}
                className="border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Food, Travel"
              />
            </div>

            <div className="grid gap-1.5">
              <label className="text-sm font-medium">Min Amount</label>
              <input
                type="number"
                name="min_amount"
                value={filters.min_amount}
                onChange={handleChange}
                className="border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div className="grid gap-1.5">
              <label className="text-sm font-medium">Max Amount</label>
              <input
                type="number"
                name="max_amount"
                value={filters.max_amount}
                onChange={handleChange}
                className="border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div className="grid gap-1.5 lg:col-span-1 sm:col-span-2">
              <label className="text-sm font-medium">Description</label>
              <input
                type="text"
                name="description"
                value={filters.description}
                onChange={handleChange}
                className="border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search text"
              />
            </div>
          </form>

          {/* Results */}
          <div className="overflow-auto rounded-lg border">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-medium">ID</th>
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-left p-3 font-medium">Category</th>
                  <th className="text-left p-3 font-medium">Description</th>
                  <th className="text-right p-3 font-medium">Amount</th>
                  <th className="text-left p-3 font-medium">Currency</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-4">
                      Loading…
                    </td>
                  </tr>
                ) : results.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-500">
                      No expenses found. Try adjusting your filters.
                    </td>
                  </tr>
                ) : (
                  results.map((x) => (
                    <tr key={x.id} className="border-t">
                      <td className="p-3">{x.id}</td>
                      <td className="p-3">{fmtDate(x.spent_at)}</td>
                      <td className="p-3">{x.category}</td>
                      <td className="p-3">{x.description || "-"}</td>
                      <td className="p-3 text-right">{fmtAmount(x.amount)}</td>
                      <td className="p-3">{x.currency}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-xs text-gray-500">
            Tip: You can search by partial description using the “Description” field.
          </p>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-4 left-1/2 -translate-x-1/2 max-w-sm w-[92%] sm:w-auto px-4 py-3 rounded-lg shadow-lg text-sm
            ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"} text-white`}
        >
          <div className="flex items-start gap-3">
            <span className="font-semibold">
              {toast.type === "success" ? "Success" : "Error"}
            </span>
            <span className="opacity-95">{toast.text}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-auto underline decoration-white/50 hover:decoration-white"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
