import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import Blog from "./pages/Blog";
import CartScreen from "./pages/CartScreen";
import CheckoutPage from "./pages/CheckoutPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FeedBack from "./pages/FeedBack";
import Profile from "./pages/Profile";
import ProductDetail from "./pages/ProductDetail";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/cart" element={<CartScreen />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/bill" element={<CheckoutPage />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/feedback" element={<FeedBack />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
