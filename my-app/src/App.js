import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./pages/AdminLayout";
import Home from "./pages/Home";
import Create from "./pages/Create";
import CreateCategory from "./pages/CreateCategory";
import Users from "./pages/Users";
import Inventory from "./pages/Inventory";
import RequireAdmin from "./pages/RequireAdmin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;