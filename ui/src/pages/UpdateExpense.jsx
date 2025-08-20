import React, { useEffect, useState } from "react";
import { getExpense, updateExpense } from "../api/expenses";
import { useParams, useNavigate } from "react-router-dom";

export default function UpdateExpense() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState({ description: "", amount: "", category: "" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function fetchExpense() {
      try {
        const res = await getExpense(id);
        setForm(res.data);
      } catch (err) {
        setMsg("Failed to fetch expense.");
      }
    }
    fetchExpense();
  }, [id]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateExpense(id, form);
      setMsg("Expense updated!");
      setTimeout(() => nav("/get-expenses"), 700);
    } catch (err) {
      setMsg("Update failed.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Update Expense</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full border p-2 rounded"
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={onChange}
          required
        />
        <input
          className="w-full border p-2 rounded"
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={onChange}
          required
        />
        <input
          className="w-full border p-2 rounded"
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={onChange}
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Update Expense
        </button>
      </form>
      {msg && <p className="mt-3 text-sm">{msg}</p>}
    </div>
  );
}