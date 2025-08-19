import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Me from "./pages/Me";
import Welcome from "./pages/Welcome";
import CreateExpense from "./pages/CreateExpense";
import UpdateExpense from "./pages/UpdateExpense";
import GetExpense from "./pages/GetExpense";
import DeleteExpense from "./pages/DeleteExpense";
import SearchExpense from "./pages/SearchExpense";

function AppContent() {
  const location = useLocation();

  return (
    <>
      {/* Conditionally render Navbar */}
      {location.pathname !== "/" && <Navbar />}
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/me" element={<ProtectedRoute><Me /></ProtectedRoute>} />
          <Route path="/expenses/create" element={<CreateExpense />} />
          <Route path="/expenses/update" element={<UpdateExpense />} />
          <Route path="/expenses/get" element={<GetExpense />} />
          <Route path="/expenses/delete" element={<DeleteExpense />} />
          <Route path="/expenses/search" element={<SearchExpense />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}