import React from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaFileInvoice, FaHome, FaInfoCircle, FaUser, FaStore } from "react-icons/fa";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <FaStore className="logo-icon" />
        <span>SuperMarket</span>
      </div>

      <nav className="nav-links">
        <Link to="/" className="nav-item">
          <FaHome /> Home
        </Link>

        <Link to="/about" className="nav-item">
          <FaInfoCircle /> About
        </Link>

        <Link to="/bill" className="nav-item">
          <FaFileInvoice /> Bill
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