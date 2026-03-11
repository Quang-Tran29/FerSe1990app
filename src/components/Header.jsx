import React from "react";
import { Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaFileInvoice,
  FaHome,
  FaInfoCircle,
  FaUser,
  FaStore,
  FaNewspaper // Thêm icon cho Blog
} from "react-icons/fa";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      {/* Logo */}
      <div className="logo">
        <Link to="/" className="logo-link">
          <FaStore className="logo-icon" />
          <span>SuperMarket</span>
        </Link>
      </div>

      <nav className="nav-links">
        <Link to="/" className="nav-item">
          <FaHome /> Trang chủ
        </Link>

        <Link to="/blog" className="nav-item">
          <FaNewspaper /> Tin Tức
        </Link>

        <Link to="/about" className="nav-item">
          <FaInfoCircle /> Liên Hệ
        </Link>

        <Link to="/bill" className="nav-item">
          <FaFileInvoice /> Thanh Toán
        </Link>

        <Link to="/cart" className="nav-item">
          <FaShoppingCart /> Giỏ hàng
        </Link>

        <Link to="/login" className="nav-item login-btn">
          <FaUser /> Đăng nhập
        </Link>
      </nav>
    </header>
  );
};

export default Header;