import { useState, useEffect } from "react";

const categories = ["Food", "Transport", "Utilities", "Shopping", "Entertainment", "Other"];
const currencies = ["USD", "INR", "EUR"];

export default function ExpenseForm({ initial, onCancel, onSave }) {
  const [form, setForm] = useState({
    amount: "",
    currency: "USD",
    category: "",
    description: "",
    spent_at: "",
  });

  useEffect(() => {
    if (initial) {
      setForm({
        amount: initial.amount ?? "",
        currency: initial.currency ?? "USD",
        category: initial.category ?? "",
        description: initial.description ?? "",
        spent_at: initial.spent_at ?? "",
      });
    }
  }, [initial]);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    // Validate minimal fields
    if (!form.amount || !form.spent_at || !form.category) {
      alert("Amount, Date, and Category are required");
      return;
    }
    onSave({
      amount: Number(form.amount),
      currency: form.currency,
      category: form.category,
      description: form.description || null,
      spent_at: form.spent_at,
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input
          name="amount"
          type="number"
          step="0.01"
          placeholder="Amount"
          value={form.amount}
          onChange={onChange}
          className="border p-2 rounded"
          required
        />
        <select
          name="currency"
          value={form.currency}
          onChange={onChange}
          className="border p-2 rounded"
        >
          {currencies.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <select
          name="category"
          value={form.category}
          onChange={onChange}
          className="border p-2 rounded"
          required
        >
          <option value="" disabled>Select category</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <input
          name="spent_at"
          type="date"
          value={form.spent_at}
          onChange={onChange}
          className="border p-2 rounded"
          required
        />
      </div>

      <textarea
        name="description"
        placeholder="Description (optional)"
        value={form.description}
        onChange={onChange}
        className="border p-2 rounded w-full"
        rows={3}
      />

      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded border">
          Cancel
        </button>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>
      </div>
    </form>
  );
}
