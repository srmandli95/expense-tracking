import { useEffect, useMemo, useState } from "react";
import API from "../api/auth"; // your axios instance with token interceptor

function toLocalInputValue(d) {
  // returns "YYYY-MM-DDTHH:mm" for <input type="datetime-local">
  const pad = (n) => n.toString().padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const min = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

export default function ExpenseSummary() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null); // { "Food_USD": 123.45, ... }
  const [error, setError] = useState("");

  // sensible defaults: last 30 days (local tz)
  useEffect(() => {
    const now = new Date();
    const startD = new Date(now);
    startD.setDate(now.getDate() - 29);
    startD.setHours(0, 0, 0, 0);
    setStart(toLocalInputValue(startD));
    setEnd(toLocalInputValue(now));
  }, []);

  const rows = useMemo(() => {
    if (!summary) return [];
    return Object.entries(summary).map(([key, amount]) => {
      const idx = key.lastIndexOf("_");
      const category = idx >= 0 ? key.slice(0, idx) : key;
      const currency = idx >= 0 ? key.slice(idx + 1) : "";
      return { category, currency, amount: Number(amount || 0) };
    });
  }, [summary]);

  const total = useMemo(
    () => rows.reduce((acc, r) => acc + (r.amount || 0), 0),
    [rows]
  );

  async function fetchSummary(e) {
    e?.preventDefault?.();
    setError("");
    setSummary(null);

    if (!start || !end) {
      setError("Please select both start and end datetimes.");
      return;
    }

    const startISO = new Date(start).toISOString();
    const endISO = new Date(end).toISOString();
    if (new Date(startISO) > new Date(endISO)) {
      setError("Start date must be before end date.");
      return;
    }

    try {
      setLoading(true);
      const res = await API.get("/analytics/summary", {
        params: { start_date: startISO, end_date: endISO },
      });
      setSummary(res.data || {});
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to fetch expense summary.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Expense Summary</h1>

      <form
        onSubmit={fetchSummary}
        className="rounded-2xl border bg-white p-4 sm:p-5 mb-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Start date & time
            </label>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              End date & time
            </label>
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
              disabled={loading}
            >
              {loading ? "Loading..." : "Get summary"}
            </button>
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </form>

      <div className="rounded-2xl border bg-white">
        {!loading && summary && rows.length === 0 && (
          <div className="p-5 text-sm text-gray-500">
            No expenses found for the selected range.
          </div>
        )}

        {loading && (
          <div className="p-5 animate-pulse grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="h-20 bg-gray-100 rounded-xl" />
            <div className="h-20 bg-gray-100 rounded-xl" />
            <div className="h-20 bg-gray-100 rounded-xl" />
          </div>
        )}

        {!loading && rows.length > 0 && (
          <>
            {/* KPI row */}
            <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-3 border-b">
              <div className="rounded-xl border p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  From
                </p>
                <p className="mt-1 text-sm font-medium text-gray-800">
                  {new Date(start).toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl border p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  To
                </p>
                <p className="mt-1 text-sm font-medium text-gray-800">
                  {new Date(end).toLocaleString()}
                </p>
              </div>
              <div className="rounded-xl border p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Total (all categories)
                </p>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {total.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 border-b">Category</th>
                    <th className="text-left p-3 border-b">Currency</th>
                    <th className="text-right p-3 border-b">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={`${r.category}_${r.currency}`}>
                      <td className="p-3 border-b">{r.category}</td>
                      <td className="p-3 border-b">{r.currency}</td>
                      <td className="p-3 border-b text-right">
                        {r.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="p-3 font-semibold" colSpan={2}>
                      Grand Total
                    </td>
                    <td className="p-3 text-right font-semibold">
                      {total.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
