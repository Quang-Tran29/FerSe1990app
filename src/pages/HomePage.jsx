import React, { useEffect, useState } from "react";
import { FiCheckCircle } from "react-icons/fi";
import "./HomePage.css";

const API_URL = "http://localhost:9999";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "" });
  const userId = 1; 

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log("Lỗi fetch products:", err));
  }, []);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: "" });
    }, 3000); // Ẩn đi sau 3 giây
  };

  const addToCart = async (product) => {
    try {
      const res = await fetch(`${API_URL}/carts?userId=${userId}`);
      const carts = await res.json();

      if (carts.length > 0) {
        const cart = carts[0];

        const existingItem = cart.items.find(
          (item) => item.productId === product.id
        );

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.items.push({
            productId: product.id,
            quantity: 1,
          });
        }

        await fetch(`${API_URL}/carts/${cart.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cart),
        });
      } else {
        await fetch(`${API_URL}/carts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userId,
            items: [
              {
                productId: product.id,
                quantity: 1,
              },
            ],
          }),
        });
      }

      // Xoá cái alert cùi bắp và thay bằng Toast tuỳ chỉnh
      showToast(`Đã thêm "${product.name}" vào giỏ hàng!`);
    } catch (error) {
      console.log("Lỗi addToCart:", error);
    }
  };

  return (
    <div className="home-container">
      {/* Cấu trúc của Toast notification */}
      <div className={`toast-notification ${toast.show ? "show" : ""}`}>
        <FiCheckCircle size={28} color="#27ae60" style={{ flexShrink: 0 }} />
        <span>{toast.message}</span>
      </div>

      <h2 className="title">Danh sách sản phẩm</h2>

      <div className="product-grid">
        {products.map((item, index) => (
          <div 
            className="product-card" 
            key={item.id}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="image-wrapper">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="product-info">
              <h3>{item.name}</h3>
              <p className="price">{item.price.toLocaleString("vi-VN")} đ</p>
              <button 
                className="add-cart-btn" 
                onClick={() => addToCart(item)}
              >
                Thêm vào giỏ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;