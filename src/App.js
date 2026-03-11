import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer"; // Import Footer ở đây
import HomePage from "./pages/HomePage";
import Blog from "./pages/Blog";

function App() {
  return (
    <Router>
      <Header />
      
      {/* Chỉ có phần nội dung bên trong Routes mới thay đổi khi chuyển trang */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<Blog />} />
        {/* Các Route khác... */}
      </Routes>

      <Footer /> {/* Footer nằm ở đây để luôn luôn xuất hiện ở cuối mọi trang */}
    </Router>
  );
}

export default App;