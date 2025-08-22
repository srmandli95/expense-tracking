import { useEffect, useMemo, useState } from "react";
import ExpenseForm from "../components/ExpenseForm";
import { createExpense } from "../api/expenses"; // Option B wrapper: always posts a list

export default function CreateExpense() {
  const [toast, setToast] = useState(null);       // { type: "success" | "error", text: string }
  const [items, setItems] = useState([]);         // [{ id, payload }]
  const [editingId, setEditingId] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [formKey, setFormKey] = useState(0);      // remount form to reset
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const addedCount = items.length;
  const submitBtnLabel = useMemo(
    () => (submitting ? "Submitting..." : `Submit ${addedCount}`),
    [submitting, addedCount]
  );

  const resetForm = () => {
    setInitialData(null);
    setEditingId(null);
    setFormKey((k) => k + 1);
  };

  const normalize = (data) => ({
    ...data,
    // ensure "YYYY-MM-DD" for Pydantic date
    spent_at:
      typeof data.spent_at === "string"
        ? data.spent_at
        : data.spent_at?.toISOString?.().slice(0, 10),
  });

  const handleAddOrUpdate = (data) => {
    const payload = normalize(data);

    if (editingId) {
      setItems((prev) => prev.map((x) => (x.id === editingId ? { ...x, payload } : x)));
      setToast({ type: "success", text: "Expense updated." });
    } else {
      const id = crypto.randomUUID?.() ?? String(Math.random());
      setItems((prev) => [...prev, { id, payload }]);
      setToast({ type: "success", text: "Expense added to list." });
    }
    resetForm();
  };

  const handleEdit = (id) => {
    const found = items.find((x) => x.id === id);
    if (!found) return;
    setEditingId(id);
    setInitialData(found.payload);
    setFormKey((k) => k + 1);
  };

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
    if (editingId === id) resetForm();
  };

  const handleClear = () => {
    setItems([]);
    resetForm();
    setToast({ type: "success", text: "Cleared the list." });
  };

  // SUBMIT ALL AS A LIST (array body)
  const handleSubmitAll = async () => {
    if (items.length === 0) {
      setToast({ type: "error", text: "No expenses to submit." });
      return;
    }

    const payloadArray = items.map((x) => x.payload); // <-- array that backend expects
    setSubmitting(true);
    try {
      // Option B wrapper in expenses.js converts single -> [single], but here we already pass an array
      await createExpense(payloadArray);
      setToast({ type: "success", text: `Created ${payloadArray.length} expense(s). 🎉` });
      handleClear();
    } catch (e) {
      const detail = e?.response?.data?.detail;
      const msg = Array.isArray(detail) ? JSON.stringify(detail) : (detail || "Create failed.");
      setToast({ type: "error", text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  // QUICK SUBMIT (single form, no batching): still sends a list [one]
  const handleQuickSubmit = async (data) => {
    const one = normalize(data);
    setSubmitting(true);
    try {
      await createExpense([one]); // <-- explicitly a list
      setToast({ type: "success", text: "Created 1 expense. 🎉" });
      handleClear();
    } catch (e) {
      const detail = e?.response?.data?.detail;
      const msg = Array.isArray(detail) ? JSON.stringify(detail) : (detail || "Create failed.");
      setToast({ type: "error", text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-start justify-center pt-10">
      <div className="w-full max-w-3xl rounded-2xl border shadow-sm bg-white p-5">
        <h2 className="text-xl font-semibold mb-4">Create Expenses</h2>

        {/* Single simple form */}
        <section className="rounded-xl border p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">
              {editingId ? "Editing expense" : "Add a new expense"}
            </span>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-gray-600 underline"
              >
                Cancel edit
              </button>
            )}
          </div>

          {/* ExpenseForm should call onSave(values). It can accept initialData for editing. */}
          <ExpenseForm key={formKey} initialData={initialData} onSave={handleAddOrUpdate} />

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                // If user wants to submit just this one immediately
                const form = document.querySelector("form"); // assuming the child renders a <form>
                if (!form) return;
                // Let the form component handle validation & emit values via a synthetic submit:
                // Preferably, expose a ref/callback from ExpenseForm. If not, keep the batch flow only.
              }}
              className="hidden rounded border px-3 py-1 text-xs" // hidden by default; batch is primary
            >
              Quick submit
            </button>
            <p className="text-xs text-gray-500">
              Save to add it to the list below. Submit will send the whole list in one request.
            </p>
          </div>
        </section>

        {/* Added items list */}
        <section className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">Added expenses ({items.length})</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleClear}
                disabled={items.length === 0}
                className="text-xs px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50"
              >
                Clear
              </button>
              {/* Optional: single-form quick submit of the latest item */}
              {items.length === 1 && (
                <button
                  type="button"
                  onClick={() => handleQuickSubmit(items[0].payload)}
                  className="text-xs px-3 py-1 rounded border hover:bg-gray-50"
                >
                  Submit 1 now
                </button>
              )}
            </div>
          </div>

          {items.length === 0 ? (
            <p className="text-xs text-gray-500">No items yet. Add your first expense above.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">Amount</th>
                    <th className="p-2 border">Currency</th>
                    <th className="p-2 border">Category</th>
                    <th className="p-2 border">Description</th>
                    <th className="p-2 border w-28">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(({ id, payload }) => (
                    <tr key={id} className="odd:bg-white even:bg-gray-50">
                      <td className="p-2 border">{payload?.spent_at ?? "-"}</td>
                      <td className="p-2 border">{payload?.amount ?? "-"}</td>
                      <td className="p-2 border">{payload?.currency ?? "-"}</td>
                      <td className="p-2 border">{payload?.category ?? "-"}</td>
                      <td className="p-2 border truncate max-w-[16rem]">
                        {payload?.description ?? "-"}
                      </td>
                      <td className="p-2 border">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(id)} className="text-xs underline">
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(id)}
                            className="text-xs text-red-600 underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Submit bar (sends ONE request with an array) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSubmitAll}
            disabled={submitting || items.length === 0}
            className="rounded-lg bg-gray-900 text-white px-4 py-2 hover:bg-black disabled:opacity-50"
          >
            {submitBtnLabel}
          </button>
          <p className="text-xs text-gray-500">Sends one request with a list of expenses.</p>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-4 left-1/2 -translate-x-1/2 max-w-sm w-[90%] sm:w-auto px-4 py-3 rounded-lg shadow-lg text-sm
            ${toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
        >
          <div className="flex items-start gap-3">
            <span className="font-medium">
              {toast.type === "success" ? "Success" : "Error"}
            </span>
            <span className="opacity-90">{toast.text}</span>
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
