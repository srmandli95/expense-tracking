import { useState } from "react";
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    const params = {};
    if (filters.from) params.date_from = filters.from;
    if (filters.to) params.date_to = filters.to;
    if (filters.category) params.category = filters.category;
    if (filters.min_amount) params.min_amount = parseFloat(filters.min_amount);
    if (filters.max_amount) params.max_amount = parseFloat(filters.max_amount);
    if (filters.description) params.q = filters.description;

    try {
      const res = await listExpenses(params);
      setResults(res.data);
    } catch {
      setResults([]);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Search Expenses</h2>

      <form className="flex flex-wrap gap-4 mb-6" onSubmit={handleSearch}>
        <input
          type="date"
          name="from"
          value={filters.from}
          onChange={handleChange}
          className="border rounded px-2 py-1"
          placeholder="From"
        />
        <input
          type="date"
          name="to"
          value={filters.to}
          onChange={handleChange}
          className="border rounded px-2 py-1"
          placeholder="To"
        />
        <input
          type="text"
          name="category"
          value={filters.category}
          onChange={handleChange}
          className="border rounded px-2 py-1"
          placeholder="Category"
        />
        <input
          type="number"
          name="min_amount"
          value={filters.min_amount}
          onChange={handleChange}
          className="border rounded px-2 py-1"
          placeholder="Min Amount"
          min="0"
          step="0.01"
        />
        <input
          type="number"
          name="max_amount"
          value={filters.max_amount}
          onChange={handleChange}
          className="border rounded px-2 py-1"
          placeholder="Max Amount"
          min="0"
          step="0.01"
        />
        <input
          type="text"
          name="description"
          value={filters.description}
          onChange={handleChange}
          className="border rounded px-2 py-1"
          placeholder="Description"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </form>

      <table className="min-w-full text-sm border rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2">ID</th>
            <th className="text-left p-2">Date</th>
            <th className="text-left p-2">Category</th>
            <th className="text-left p-2">Description</th>
            <th className="text-right p-2">Amount</th>
            <th className="text-left p-2">Currency</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td className="p-3" colSpan={6}>
                Loading…
              </td>
            </tr>
          ) : results.length === 0 ? (
            <tr>
              <td className="p-3" colSpan={6}>
                No expenses found
              </td>
            </tr>
          ) : (
            results.map((x) => (
              <tr key={x.id} className="border-t">
                <td className="p-2">{x.id}</td>
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
  );
}
