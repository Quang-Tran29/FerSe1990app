import React, { useEffect, useState } from "react";
import "./HomePage.css";

const API_URL = "http://localhost:9999";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const userId = 1; // tạm thời fix user 1

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log("Lỗi fetch products:", err));
  }, []);

  const addToCart = async (product) => {
    try {
      // Lấy cart của user
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

      alert("Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.log("Lỗi addToCart:", error);
    }
  };

  return (
    <div className="home-container">
      <h2 className="title">Danh sách sản phẩm</h2>

      <div className="product-grid">
        {products.map((item) => (
          <div className="product-card" key={item.id}>
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p className="price">{item.price.toLocaleString()} đ</p>
            <button onClick={() => addToCart(item)}>
              Thêm vào giỏ
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;