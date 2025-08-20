import React, { useEffect, useState } from "react";
import { listExpenses, deleteExpense } from "../api/expenses";
import { useNavigate } from "react-router-dom";

export default function GetExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await listExpenses();
        setExpenses(res.data);
      } catch (err) {
        // handle error
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleEdit = (id) => {
    nav(`/update-expense/${id}`);
  };

  const handleDelete = async (id) => {
    await deleteExpense(id);
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Expenses</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border p-2">Description</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td className="border p-2">{expense.description}</td>
                <td className="border p-2">{expense.amount}</td>
                <td className="border p-2">{expense.category}</td>
                <td className="border p-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => handleEdit(expense.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(expense.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}