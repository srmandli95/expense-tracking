import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";  
import API from "../api/auth";

// ---- helpers
function toLocalInputValue(d) {
  const pad = (n) => n.toString().padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const min = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

function formatMoney(amount, currency = "USD") {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  } catch {
    return `${currency} ${Number(amount || 0).toFixed(2)}`;
  }
}

export default function ExpenseSummary() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [summary, setSummary] = useState(null); // { "Food_USD": 123.45, ... }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // defaults: last 30 days
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
    const arr = Object.entries(summary).map(([key, amount]) => {
      const idx = key.lastIndexOf("_");
      const category = idx >= 0 ? key.slice(0, idx) : key;
      const currency = idx >= 0 ? key.slice(idx + 1) : "";
      return { category, currency, amount: Number(amount || 0) };
    });
    return arr.sort((a, b) => b.amount - a.amount);
  }, [summary]);

  const totalsByCurrency = useMemo(() => {
    const map = new Map();
    for (const r of rows) map.set(r.currency, (map.get(r.currency) || 0) + r.amount);
    return Array.from(map.entries());
  }, [rows]);

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

  useEffect(() => {
    if (start && end) fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, end]);

  function resetToLast30() {
    const now = new Date();
    const startD = new Date(now);
    startD.setDate(now.getDate() - 29);
    startD.setHours(0, 0, 0, 0);
    setStart(toLocalInputValue(startD));
    setEnd(toLocalInputValue(now));
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <div className="mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          Expense summary
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Totals by category for a selected date range.
        </p>
      </div>

      <form onSubmit={fetchSummary} className="rounded-2xl border bg-white p-4 sm:p-5 mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Start date & time</label>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">End date & time</label>
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
              required
            />
          </div>
          <div className="sm:col-span-4 flex gap-2">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
              disabled={loading}
            >
              {loading ? "Loading..." : "Apply"}
            </button>
            <button
              type="button"
              onClick={resetToLast30}
              className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
              disabled={loading}
              title="Reset to last 30 days"
            >
              Reset
            </button>
          </div>
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="rounded-2xl border bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">From</p>
          <p className="mt-1 text-sm font-medium text-gray-800">{start ? new Date(start).toLocaleString() : "—"}</p>
        </div>
        <div className="rounded-2xl border bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">To</p>
          <p className="mt-1 text-sm font-medium text-gray-800">{end ? new Date(end).toLocaleString() : "—"}</p>
        </div>
        <div className="rounded-2xl border bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">Totals by currency</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {rows.length
              ? Array.from(
                  rows.reduce((m, r) => m.set(r.currency, (m.get(r.currency) || 0) + r.amount), new Map())
                ).map(([cur, amt]) => (
                  <span key={cur || "UNK"} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium">
                    {cur || "—"} · {formatMoney(amt, cur || "USD")}
                  </span>
                ))
              : <span className="text-sm text-gray-500">—</span>}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-white overflow-hidden">
        {loading ? (
          <div className="p-5 animate-pulse grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="h-20 bg-gray-100 rounded-xl" />
            <div className="h-20 bg-gray-100 rounded-xl" />
            <div className="h-20 bg-gray-100 rounded-xl" />
          </div>
        ) : rows.length === 0 ? (
          <div className="p-6 text-sm text-gray-600">
            No expenses found for the selected range.{" "}
            <Link to="/expenses/create" className="underline text-indigo-700 hover:text-indigo-900">
              Add an expense
            </Link>.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="p-3 border-b">Category</th>
                  <th className="p-3 border-b">Currency</th>
                  <th className="p-3 border-b text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((r) => (
                  <tr key={`${r.category}_${r.currency}`}>
                    <td className="p-3">{r.category}</td>
                    <td className="p-3">{r.currency}</td>
                    <td className="p-3 text-right">{formatMoney(r.amount, r.currency || "USD")}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                {Array.from(
                  rows.reduce((m, r) => m.set(r.currency, (m.get(r.currency) || 0) + r.amount), new Map())
                ).map(([cur, amt]) => (
                  <tr key={`total_${cur || "UNK"}`}>
                    <td className="p-3 font-semibold" colSpan={2}>Total ({cur || "—"})</td>
                    <td className="p-3 text-right font-semibold">{formatMoney(amt, cur || "USD")}</td>
                  </tr>
                ))}
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
