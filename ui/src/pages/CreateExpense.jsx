import { useState } from "react";
import { createExpense } from "../api/expenses";
import ExpenseForm from "../components/ExpenseForm";

export default function CreateExpense() {
  const [message, setMessage] = useState("");

  const handleCreate = async (data) => {
    try {
      await createExpense(data);
      setMessage("Expense created!");
    } catch (e) {
      setMessage(e?.response?.data?.detail || "Create failed");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Create Expense</h2>
      {message && <p className="mb-3 text-sm">{message}</p>}
      <ExpenseForm onSave={handleCreate} />
    </div>
  );
}