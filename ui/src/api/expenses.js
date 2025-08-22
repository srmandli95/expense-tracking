import API from "./auth";

export const listExpenses   = (params = {}) => API.get("/expenses", { params });
export const getExpense     = (id) => API.get(`/expenses/${id}`);
export const updateExpense  = (id, data) => API.patch(`/expenses/${id}`, data);
export const replaceExpense = (id, data) => API.put(`/expenses/${id}`, data);
export const deleteExpense  = (id) => API.delete(`/expenses/${id}`);

// ✅ ALWAYS send a list
export const createExpense = (dataOrArray) => {
  const body = Array.isArray(dataOrArray) ? dataOrArray : [dataOrArray];
  return API.post("/expenses", body);
};
