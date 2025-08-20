import React, { useEffect, useMemo, useState } from "react";
import { getExpense, updateExpense } from "../api/expenses";

const EXCLUDED_KEYS = new Set(["id", "owner_id", "created_at", "updated_at"]);

export default function UpdateExpense() {
  const [expenseId, setExpenseId] = useState("");
  const [form, setForm] = useState(null);
  const [toast, setToast] = useState(null); // {type: 'success'|'error', text: string}
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // auto-hide toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const fetchExpense = async () => {
    const id = expenseId.trim();
    if (!id) {
      setToast({ type: "error", text: "Please enter an Expense ID." });
      return;
    }
    try {
      setLoading(true);
      const res = await getExpense(id);
      setForm(res.data || {});
      setToast(null);
    } catch {
      setForm(null);
      setToast({ type: "error", text: "Expense not found." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    // keep numbers as strings to avoid NaN while typing
    setForm((prev) => ({ ...prev, [name]: type === "number" ? value : value }));
  };

  const payload = useMemo(() => {
    if (!form) return {};
    return Object.keys(form).reduce((acc, k) => {
      if (!EXCLUDED_KEYS.has(k)) acc[k] = form[k];
      return acc;
    }, {});
  }, [form]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateExpense(expenseId.trim(), payload);
      setToast({ type: "success", text: "Expense updated successfully 🎉" });

      // clear fields after submit
      setForm(null);
      setExpenseId("");
    } catch (e) {
      setToast({
        type: "error",
        text: e?.response?.data?.detail || "Failed to update expense.",
      });
    } finally {
      setSaving(false);
    }
  };

  // pretty labels
  const pretty = (s) =>
    s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  // choose better input types
  const isNumberKey = (k) =>
    /amount|total|price|cost|qty|quantity|count|limit|max|min/i.test(k);
  const isDateKey = (k) => /date|_at$|time/i.test(k);

  const editableKeys = form
    ? Object.keys(form).filter((k) => !EXCLUDED_KEYS.has(k))
    : [];

  return (
    <div className="min-h-[60vh] flex items-start justify-center pt-10">
      <div className="w-full max-w-md rounded-2xl border shadow-sm bg-white p-5">
        <h1 className="text-lg font-semibold mb-4">Update Expense</h1>

        {/* Fetch card (hidden after fetch) */}
        {!form && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Expense ID</label>
            <input
              className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              placeholder="Enter Expense ID"
              value={expenseId}
              onChange={(e) => setExpenseId(e.target.value)}
              disabled={loading}
            />
            <button
              className={`mt-3 w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              onClick={fetchExpense}
              disabled={loading}
            >
              {loading ? "Fetching…" : "Fetch Expense"}
            </button>
            <p className="mt-2 text-xs text-gray-500">
              Enter the ID and fetch to edit details.
            </p>
          </div>
        )}

        {/* Update form */}
        {form && (
          <form onSubmit={handleSubmit} className="space-y-3">
            {editableKeys.map((key) => {
              const val = form[key] ?? "";
              const isNum = isNumberKey(key);
              const isDate = isDateKey(key);

              let inputValue = val;
              if (isDate && typeof val === "string") {
                const m = val.match(/^(\d{4}-\d{2}-\d{2})/);
                if (m) inputValue = m[1];
              }

              return (
                <div key={key} className="grid gap-1.5">
                  <label className="text-sm font-medium">{pretty(key)}</label>
                  <input
                    className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                    type={isDate ? "date" : isNum ? "number" : "text"}
                    step={isNum ? "any" : undefined}
                    name={key}
                    value={inputValue}
                    onChange={handleChange}
                  />
                </div>
              );
            })}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setForm(null)}
                className="w-1/3 rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`w-2/3 rounded-lg px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition ${
                  saving ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={saving}
              >
                {saving ? "Saving…" : "Update Expense"}
              </button>
            </div>
          </form>
        )}
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
