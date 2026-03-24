import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { auth } from "./firebase";
import "./CartScreen.css";

const API_URL = "http://localhost:9999";
const USER_ID = 1;

const CartScreen = () => {
  const [cart, setCart] = useState(null);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true
  });

  useEffect(() => {
    fetchCart();
    fetchProducts();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await fetch(`${API_URL}/carts?userId=${USER_ID}`);
      const data = await res.json();
      setCart(data[0] || { items: [] });
    } catch (error) {
      console.error("Loi load cart:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Loi load products:", error);
    }
  };

  const getProduct = (id) => products.find((product) => Number(product.id) === Number(id));

  const updateCart = async (newItems) => {
    if (!cart?.id) {
      setCart({ id: null, items: newItems });
      return;
    }

    try {
      await fetch(`${API_URL}/carts/${cart.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...cart, userId: USER_ID, items: newItems })
      });

      setCart({ ...cart, items: newItems });
    } catch (error) {
      console.error("Loi update cart:", error);
    }
  };

  const increase = (id) => {
    if (!cart) return;

    const product = getProduct(id);
    const currentItem = cart.items.find((item) => Number(item.productId) === Number(id));

    if (!product || !currentItem) return;

    if (product.stock !== undefined && currentItem.quantity >= product.stock) {
      Toast.fire({ icon: "warning", title: "Bạn đã đặt tối đa số lượng tồn kho" });
      return;
    }

    const newItems = cart.items.map((item) =>
      Number(item.productId) === Number(id) ? { ...item, quantity: item.quantity + 1 } : item
    );

    updateCart(newItems);
  };

  const decrease = async (id) => {
    if (!cart) return;

    const currentItem = cart.items.find((item) => Number(item.productId) === Number(id));
    if (!currentItem) return;

    if (currentItem.quantity === 1) {
      const result = await Swal.fire({
        title: "Xóa sản phẩm?",
        text: "Số lượng đang là 1. Bạn có muốn xóa sản phẩm khỏi giỏ không?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy"
      });

      if (!result.isConfirmed) return;

      const newItems = cart.items.filter((item) => Number(item.productId) !== Number(id));
      updateCart(newItems);
      return;
    }

    const newItems = cart.items.map((item) =>
      Number(item.productId) === Number(id) ? { ...item, quantity: item.quantity - 1 } : item
    );

    updateCart(newItems);
  };

  const removeItem = async (id) => {
    if (!cart) return;

    const result = await Swal.fire({
      title: "Xóa sản phẩm?",
      text: "Bạn có chắc muốn xóa sản phẩm này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy"
    });

    if (!result.isConfirmed) return;

    const newItems = cart.items.filter((item) => Number(item.productId) !== Number(id));
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

  const shippingFee = () => (total() > 500000 ? 0 : 30000);

  const clearCart = async () => {
    const result = await Swal.fire({
      title: "Xóa toàn bộ giỏ hàng?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy"
    });

    if (!result.isConfirmed) return;

    updateCart([]);
  };

  const handleCheckout = () => {
    if (!cart || cart.items.length === 0) {
      Toast.fire({ icon: "info", title: "Giỏ hàng đang trống" });
      return;
    }

    if (!auth.currentUser) {
      Swal.fire({
        icon: "info",
        title: "Cần đăng nhập",
        text: "Bạn hãy đăng nhập trước khi thanh toán."
      }).then(() => {
        navigate("/login");
      });
      return;
    }

    navigate("/checkout");
  };

  if (!cart || products.length === 0) {
    return <div className="cart-container">Loading...</div>;
  }

  return (
    <div className="cart-container">
      <button
        className="back-home-btn"
        onClick={() => navigate("/")}
        style={{
          marginBottom: "16px",
          padding: "10px 14px",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
          background: "#fff",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Về trang chủ
      </button>

      <h2 className="cart-title">Giỏ hàng của bạn</h2>

      {cart.items.length === 0 ? (
        <p>Giỏ hàng đang trống</p>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.items.map((item) => {
              const product = getProduct(item.productId);
              if (!product) return null;

              return (
                <div key={item.productId} className="cart-card">
                  <img src={product.image} alt={product.name} className="cart-image" />

                  <div className="cart-info">
                    <h4>{product.name}</h4>
                    <p className="price">{product.price.toLocaleString("vi-VN")} VND </p>
                  </div>

                  <div className="cart-quantity">
                    <button type="button" onClick={() => decrease(item.productId)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => increase(item.productId)}>
                      +
                    </button>
                  </div>

                  <div className="cart-total">
                    <p>{(product.price * item.quantity).toLocaleString("vi-VN")} VND</p>
                    <button className="remove-btn" onClick={() => removeItem(item.productId)}>
                      Xóa
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <h3>Tóm tắt đơn hàng</h3>
            <p>Tạm tính: {total().toLocaleString("vi-VN")} VND</p>
            <p>Phí vận chuyển: {shippingFee().toLocaleString("vi-VN")} VND</p>
            <h2> Tổng thanh toán: {(total() + shippingFee()).toLocaleString("vi-VN")} VND</h2>
            <hr />
            <h2 className="total-price">{total().toLocaleString("vi-VN")} VND</h2>
            <button className="checkout-btn" onClick={handleCheckout}>
              Thanh toán
            </button>
            <button className="clear-cart-btn" onClick={clearCart}>
              Xóa toàn bộ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartScreen;
