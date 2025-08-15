import API from "./auth"; // <- this is the axios instance we made earlier (baseURL + token)

export const listExpenses = (params = {}) =>
  API.get("/expenses", { params });

export const getExpense = (id) =>
  API.get(`/expenses/${id}`);

export const createExpense = (data) =>
  API.post("/expenses", data);

export const updateExpense = (id, data) =>
  API.patch(`/expenses/${id}`, data); // partial updates

export const replaceExpense = (id, data) =>
  API.put(`/expenses/${id}`, data); // full replace

export const deleteExpense = (id) =>
  API.delete(`/expenses/${id}`);
