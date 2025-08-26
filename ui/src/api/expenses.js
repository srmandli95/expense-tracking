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

/* -------------------- NEW: analytics helpers -------------------- */

// Call your /analytics/summary endpoint
export const getExpenseSummary = ({ start_date, end_date } = {}) =>
  API.get("/analytics/summary", { params: { start_date, end_date } });

// Convenience: accepts Date objects or ISO strings
export const getExpenseSummaryRange = (start, end) => {
  const start_date = start instanceof Date ? start.toISOString() : start;
  const end_date   = end   instanceof Date ? end.toISOString()   : end;
  return getExpenseSummary({ start_date, end_date });
};
