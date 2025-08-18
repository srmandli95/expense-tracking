import React from "react";

export default function Welcome() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to Expense Tracker!</h1>
      <p className="text-lg text-gray-700 mb-6">
        Manage your expenses efficiently and stay on top of your finances.
      </p>
      <a
        href="/login"
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
      >
        Get Started
      </a>
    </div>
  );
}