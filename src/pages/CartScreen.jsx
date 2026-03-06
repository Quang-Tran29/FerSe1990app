import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CartScreen.css";

const CartScreen = () => {
  const [cart, setCart] = useState(null);
  const [products, setProducts] = useState([]);

  const userId = 1;

  useEffect(() => {
    fetchCart();
    fetchProducts();
  }, []);


  const fetchCart = async () => {
    try {
      const res = await axios.get(
        `http://localhost:9999/carts?userId=${userId}`
      );

      if (res.data.length > 0) {
        setCart(res.data[0]);
      }
    } catch (error) {
      console.error("Lỗi load cart:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:9999/products"
      );
      setProducts(res.data);
    } catch (error) {
      console.error("Lỗi load products:", error);
    }
  };


  const getProduct = (id) =>
    products.find((p) => Number(p.id) === Number(id));

  const updateCart = async (newItems) => {
    try {
      await axios.put(
        `http://localhost:9999/carts/${cart.id}`,
        { ...cart, items: newItems }
      );

      setCart({ ...cart, items: newItems });
    } catch (error) {
      console.error("Lỗi update cart:", error);
    }
  };


  const increase = (id) => {
    if (!cart) return;

    const newItems = cart.items.map((item) =>
      Number(item.productId) === Number(id)
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    updateCart(newItems);
  };

  const decrease = (id) => {
    if (!cart) return;

    const newItems = cart.items
      .map((item) =>
        Number(item.productId) === Number(id)
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    updateCart(newItems);
  };

  const removeItem = (id) => {
    if (!cart) return;

    const newItems = cart.items.filter(
      (item) => Number(item.productId) !== Number(id)
    );

    updateCart(newItems);
  };

  const total = () => {
    if (!cart) return 0;

    return cart.items.reduce((sum, item) => {
      const product = getProduct(item.productId);
      if (!product) return sum;

      return sum + product.price * item.quantity;
    }, 0);
  };

  if (!cart || products.length === 0) {
    return <div className="cart-container">Loading...</div>;
  }

  return (
    <div className="cart-container">
      <h2 className="cart-title">🛒 Giỏ hàng của bạn</h2>

      {cart.items.length === 0 ? (
        <p>Giỏ hàng trống</p>
      ) : (
        <div className="cart-layout">
          {/* Danh sách sản phẩm */}
          <div className="cart-items">
            {cart.items.map((item) => {
              const product = getProduct(item.productId);

              if (!product) return null; // 🔥 chống crash

              return (
                <div key={item.productId} className="cart-card">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="cart-image"
                  />

                  <div className="cart-info">
                    <h4>{product.name}</h4>
                    <p className="price">
                      {product.price.toLocaleString("vi-VN")} đ
                    </p>
                  </div>

                  <div className="cart-quantity">
                    <button onClick={() => decrease(item.productId)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increase(item.productId)}>
                      +
                    </button>
                  </div>

                  <div className="cart-total">
                    <p>
                      {(product.price * item.quantity).toLocaleString(
                        "vi-VN"
                      )} đ
                    </p>
                    <button
                      className="remove-btn"
                      onClick={() => removeItem(item.productId)}
                    >
                      Xoá
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tổng tiền */}
          <div className="cart-summary">
            <h3>Tổng tiền</h3>
            <hr />
            <h2 className="total-price">
              {total().toLocaleString("vi-VN")} đ
            </h2>
            <button className="checkout-btn">
              Thanh toán
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartScreen;