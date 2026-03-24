import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaFileInvoice,
  FaHome,
  FaInfoCircle,
  FaStore,
  FaNewspaper
} from "react-icons/fa";
import { FaUserCircle, FaCommentDots } from "react-icons/fa";
import Swal from "sweetalert2";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../pages/firebase";
import "./Header.css";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setIsAdmin(user?.email === "admin@gmail.com");
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const closeOnOutside = (event) => {
      const target = event.target;
      if (!target.closest(".user-menu")) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("click", closeOnOutside);
    return () => document.removeEventListener("click", closeOnOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setOpenMenu(false);
      navigate("/login");
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    }
  };

  const handleCheckoutClick = (event) => {
    if (auth.currentUser) return;

    event.preventDefault();
    Swal.fire({
      icon: "info",
      title: "Cần đăng nhập",
      text: "Bạn cần đăng nhập trước khi thanh toán."
    }).then(() => {
      navigate("/login");
    });
  };

  return (
    <header className="header">
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
          <FaNewspaper /> Tin tức
        </Link>

        <Link to="/feedback" className="nav-item">
          <FaCommentDots /> Feedback
        </Link>

        <Link to="/about" className="nav-item">
          <FaInfoCircle /> Liên hệ
        </Link>

        <Link to="/checkout" className="nav-item" onClick={handleCheckoutClick}>
          <FaFileInvoice /> Thanh toán
        </Link>

        <Link to="/cart" className="nav-item">
          <FaShoppingCart /> Giỏ hàng
        </Link>

        {isLoggedIn ? (
          <div className="nav-item login-btn user-menu" style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setOpenMenu((prev) => !prev)}
              style={{
                background: "transparent",
                border: "none",
                color: "inherit",
                cursor: "pointer",
                display: "flex",
                alignItems: "center"
              }}
            >
              <FaUserCircle />
            </button>

            {openMenu && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 8px)",
                  background: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                  border: "1px solid #eee",
                  minWidth: "180px",
                  zIndex: 10
                }}
              >
                <Link
                  to="/profile"
                  onClick={() => setOpenMenu(false)}
                  style={{
                    display: "block",
                    padding: "10px 14px",
                    color: "#111",
                    textDecoration: "none"
                  }}
                >
                  Profile
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setOpenMenu(false)}
                    style={{
                      display: "block",
                      padding: "10px 14px",
                      color: "#111",
                      textDecoration: "none"
                    }}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 14px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "#dc2626"
                  }}
                >
                  Dang xuat
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="nav-item login-btn">
            Dang nhap
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
