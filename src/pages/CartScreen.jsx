import { FiPlus, FiMinus, FiTrash2, FiShoppingBag } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CartScreen.css";

const CartScreen = () => {
  const [cart, setCart] = useState(null);
  const [products, setProducts] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();
  const userId = 1;

  useEffect(() => {
    fetchCart();
    fetchProducts();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:9999/carts?userId=${userId}`);
      if (res.data.length > 0) {
        setCart(res.data[0]);
      }
    } catch (error) {
      console.error("Lỗi load cart:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:9999/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Lỗi load products:", error);
    }
  };

  const getProduct = (id) => products.find((p) => Number(p.id) === Number(id));

  const updateCart = async (newItems) => {
    try {
      await axios.put(`http://localhost:9999/carts/${cart.id}`, { ...cart, items: newItems });
      setCart({ ...cart, items: newItems });
    } catch (error) {
      console.error("Lỗi update cart:", error);
    }
  };

  const increase = (id) => {
    if (!cart) return;
    const newItems = cart.items.map((item) =>
      Number(item.productId) === Number(id) ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(newItems);
  };

  const decrease = (id) => {
    if (!cart) return;
    const newItems = cart.items
      .map((item) =>
        Number(item.productId) === Number(id) ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);
    updateCart(newItems);
  };

  const removeItem = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDeleteItem = () => {
    const newItems = cart.items.filter((item) => Number(item.productId) !== Number(deleteId));
    updateCart(newItems);
    setShowConfirm(false);
  };

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
    return (
      <div className="cart-wrapper">
        <div className="cart-container" style={{ textAlign: "center", padding: "50px" }}>
          <h2 style={{ color: '#2c3e50'}}>Đang tải giỏ hàng...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-wrapper">
      <div className="cart-container">
        <h2 className="cart-title">
          <FiShoppingBag /> Giỏ hàng của bạn
        </h2>

        {cart.items.length === 0 ? (
          <div className="empty-cart-message">
            <h3>Giỏ hàng của bạn đang trống</h3>
            <p>Hãy khám phá thêm các sản phẩm tuyệt vời của chúng tôi nhé!</p>
            <button className="continue-shopping" style={{ width: 'auto', padding: '12px 30px', background: '#2ecc71', color: 'white', borderColor: '#2ecc71' }} onClick={() => navigate("/")}>
              Bắt đầu mua sắm
            </button>
          </div>
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
                      <p className="price">{product.price.toLocaleString("vi-VN")} đ</p>
                    </div>

                    <div className="cart-quantity">
                      <button className="qty-btn" onClick={() => decrease(item.productId)}>
                        <FiMinus size={18} />
                      </button>
                      <span className="qty-number">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => increase(item.productId)}>
                        <FiPlus size={18} />
                      </button>
                    </div>

                    <div className="cart-item-actions">
                      <p className="item-total-price">
                        {(product.price * item.quantity).toLocaleString("vi-VN")} đ
                      </p>
                      <button className="remove-btn" onClick={() => removeItem(item.productId)}>
                        <FiTrash2 style={{ marginRight: '5px' }} /> Xóa
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-summary">
              <h3>Tóm tắt đơn hàng</h3>
              <div className="summary-row">
                <span>Tạm tính</span>
                <span>{total().toLocaleString("vi-VN")} đ</span>
              </div>
              <div className="summary-row">
                <span>Phí vận chuyển</span>
                <span>{shippingFee().toLocaleString("vi-VN")} đ</span>
              </div>
              <div className="summary-row total">
                <span>Tổng cộng</span>
                <span>{(total() + shippingFee()).toLocaleString("vi-VN")} đ</span>
              </div>
              
              <button className="btn-checkout" onClick={() => navigate("/checkout", { state: { cart, products } })}>
                Tiến hành thanh toán
              </button>
              
              <button className="continue-shopping" onClick={() => navigate("/")}>
                ← Tiếp tục mua sắm
              </button>
              
              <button className="clear-cart" onClick={clearCart}>
                Xóa toàn bộ giỏ hàng
              </button>
            </div>
          </div>
        )}

        {showConfirm && (
          <div className="modal-overlay">
            <div className="confirm-modal">
              <h3>Xác nhận xóa</h3>
              <p style={{ color: '#7f8c8d', marginBottom: '25px' }}>Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng không?</p>
              <div className="modal-buttons">
                <button className="cancel-btn" onClick={() => setShowConfirm(false)}>
                  Hủy
                </button>
                <button className="confirm-btn" onClick={confirmDeleteItem}>
                  Xóa sản phẩm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartScreen;