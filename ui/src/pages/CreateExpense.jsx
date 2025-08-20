import { useState, useEffect } from "react";
import { createExpense } from "../api/expenses";
import ExpenseForm from "../components/ExpenseForm";

export default function CreateExpense() {
  const [toast, setToast] = useState(null); // { type: "success" | "error", text: string }
  const [formKey, setFormKey] = useState(0); // to reset the form by remounting

  // Auto-hide toast after 3s
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleCreate = async (data) => {
    try {
      await createExpense(data);
      setToast({ type: "success", text: "Expense created successfully 🎉" });
      setFormKey((k) => k + 1); // reset the form
    } catch (e) {
      const msg = e?.response?.data?.detail || "Create failed. Please try again.";
      setToast({ type: "error", text: msg });
    }
  };

  return (
    <div className="min-h-[60vh] flex items-start justify-center pt-10">
      <div className="w-full max-w-md rounded-2xl border shadow-sm bg-white p-4">
        <h2 className="text-lg font-semibold mb-3">Create Expense</h2>

        <ExpenseForm key={formKey} onSave={handleCreate} />

        {/* Subtle helper text */}
        <p className="mt-3 text-xs text-gray-500">
          Tip: Date and amount fields are validated before submit.
        </p>
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
