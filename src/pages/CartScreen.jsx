import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CartScreen.css";
// Khai báo component CartScreen
const CartScreen = () => {
  // dùng State để lưu cart và products 
  const [cart, setCart] = useState(null);
  const [products, setProducts] = useState([]);
// giả lập userId tạm thời 
  const userId = 1;
// Sử dụng useEffect để load cart và products 
  useEffect(() => {
    fetchCart();
    fetchProducts();
  }, []);
// gọi API để lấy cart của user và lưu vào stae , nếu có lỗi sẽ log ra consloe

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
// goi API de lay products va luu vao state , neu co loi se log ra console
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

// ham getProduct de tim ra san pham tuong ung voi id 
  const getProduct = (id) =>
    products.find((p) => Number(p.id) === Number(id));
// ham updateCart de cap nhat cart moi len server va cap nhat State
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

// ham increase de tang so luong san pham len 1 va cap nhat cart
  const increase = (id) => {
    if (!cart) return;

    const newItems = cart.items.map((item) =>
      Number(item.productId) === Number(id)
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    updateCart(newItems);
  };
// ham giam de giam so luong san pham di 1 va cap nhat cart
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
// ham removeItem de xoa san pham khoi Cart
  const removeItem = (id) => {
  if (!cart) return;

  const confirmDelete = window.confirm(
    "Bạn có chắc muốn xóa sản phẩm này?"
  );

  if (!confirmDelete) return;

  const newItems = cart.items.filter(
    (item) => Number(item.productId) !== Number(id)
  );

  updateCart(newItems);
};
// ham total de tinh tong tien cua cart
  const total = () => {
    if (!cart) return 0;

    return cart.items.reduce((sum, item) => {
      const product = getProduct(item.productId);
      if (!product) return sum;

      return sum + product.price * item.quantity;
    }, 0);
  };
  const shippingFee = () => {
  return total() > 500000 ? 0 : 30000;
};
  const clearCart = () => {
  const confirmDelete = window.confirm("Xóa toàn bộ giỏ hàng?");
  if (!confirmDelete) return;

  updateCart([]);
};

  if (!cart || products.length === 0) {
    return <div className="cart-container">Loading...</div>;
  }
  
// render giao dien
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
            <h3>Tóm tắt đơn hàng</h3>
            <p>
              Tạm tính :{total().toLocaleString("vi-VN")} đ
            </p>
            <p>
               Phí vận chuyển: {shippingFee().toLocaleString("vi-VN")} đ
            </p>
            <h2>
              Tổng thanh toán: {(total() + shippingFee()).toLocaleString("vi-VN")} đ
            </h2>
            <hr />
            <h2 className="total-price">
              {total().toLocaleString("vi-VN")} đ
            </h2>
            <button className="checkout-btn">
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