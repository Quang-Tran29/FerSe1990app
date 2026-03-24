import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./pages/AdminLayout";
import AdminLogin from "./pages/AdminLogin";
import Home from "./pages/Home";
import Create from "./pages/Create";
import CreateCategory from "./pages/CreateCategory";
import Users from "./pages/Users";
import Inventory from "./pages/Inventory";
import Orders from "./pages/Orders";
import RequireAdmin from "./pages/RequireAdmin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<Home />} />
          <Route path="create" element={<Create />} />
          <Route path="create-category" element={<CreateCategory />} />
          <Route path="users" element={<Users />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="orders" element={<Orders />} />
        </Route>

        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;