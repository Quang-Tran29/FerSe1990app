import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiCreditCard } from "react-icons/fi";
import "./CheckoutPage.css";
import axios from "axios";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [success, setSuccess] = useState(false);
  const [cart, setCart] = useState(null);
  const [products, setProducts] = useState([]);
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    // Nhận dữ liệu từ CartScreen thông qua location.state
    if (location.state && location.state.cart && location.state.products) {
      setCart(location.state.cart);
      setProducts(location.state.products);
    } else {
      // Nếu không có dữ liệu (truy cập trực tiếp), quay lại giỏ hàng
      navigate("/cart");
    }
  }, [location, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePayment = async () => {
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert("Vui lòng điền đầy đủ thông tin giao hàng!");
      return;
    }

    // Ở đây bạn có thể gọi API để tạo đơn hàng mới,
    // sau đó xóa giỏ hàng nếu muốn.
    // Ví dụ xóa giỏ hàng:
    try {
      if (cart && cart.id) {
        await axios.put(`http://localhost:9999/carts/${cart.id}`, { ...cart, items: [] });
      }
    } catch (error) {
      console.error("Lỗi xóa giỏ hàng sau khi thanh toán:", error);
    }

    setSuccess(true);
  };

  const getProduct = (id) => products.find((p) => Number(p.id) === Number(id));

  const subTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum, item) => {
      const product = getProduct(item.productId);
      if (!product) return sum;
      return sum + product.price * item.quantity;
    }, 0);
  };

  const shippingFee = () => {
    return subTotal() > 500000 ? 0 : 30000;
  };

  const finalTotal = subTotal() + shippingFee();

  if (!cart) {
    return (
      <div className="checkout-wrapper">
        <h2 style={{ color: '#2c3e50', textAlign: 'center', marginTop: '50px' }}>Đang tải thông tin thanh toán...</h2>
      </div>
    );
  }

  // Nếu người dùng xóa hết giỏ hàng thì không cần thanh toán
  if (cart.items.length === 0 && !success) {
    return (
      <div className="checkout-wrapper">
        <div style={{ textAlign: "center", width: "100%", marginTop: "50px" }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Giỏ hàng của bạn đang trống</h2>
          <button className="back-home-btn" onClick={() => navigate("/")}>Về trang chủ</button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-wrapper">
      {success ? (
        <div className="success-container">
          <div className="success-card">
            <div className="success-icon">
              <FiCheckCircle />
            </div>
            <h1>Thanh toán thành công!</h1>
            <p>
              Cảm ơn <strong>{formData.fullName}</strong> đã đặt hàng.<br/>
              Đơn hàng của bạn sẽ được giao đến địa chỉ:<br/>
              <strong>{formData.address}</strong> trong thời gian sớm nhất.
            </p>
            <button onClick={() => navigate("/")} className="back-home-btn">
              Trở về trang chủ
            </button>
          </div>
        </div>
      ) : (
        <div className="checkout-inner">
          <div className="checkout-section">
            <h2>Thông tin giao hàng</h2>
            <div className="checkout-form">
              <div className="input-group">
                <label>Họ và tên</label>
                <input 
                  type="text" 
                  name="fullName"
                  className="checkout-input" 
                  placeholder="Nhập họ và tên người nhận"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>Số điện thoại</label>
                <input 
                  type="text" 
                  name="phone"
                  className="checkout-input" 
                  placeholder="Nhập số điện thoại liên hệ"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>Địa chỉ giao hàng</label>
                <input 
                  type="text" 
                  name="address"
                  className="checkout-input" 
                  placeholder="Nhập địa chỉ nhà, tên đường, phường/xã..."
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="payment-method">
                <h3>Phương thức thanh toán</h3>
                <div className="method-card active">
                  <div className="radio-custom"></div>
                  <div className="method-name">Thanh toán khi nhận hàng (COD)</div>
                </div>
              </div>

              <button className="confirm-pay-btn" onClick={handlePayment}>
                <FiCreditCard size={20} style={{ marginRight: '10px' }}/>
                Xác nhận đặt hàng - {finalTotal.toLocaleString("vi-VN")} đ
              </button>
            </div>
          </div>

          <div className="checkout-section">
            <h3>Đơn hàng của bạn</h3>
            
            <div className="summary-items">
              {cart.items.map((item) => {
                const product = getProduct(item.productId);
                if (!product) return null;
                return (
                  <div key={item.productId} className="summary-item">
                    <img src={product.image} alt={product.name} className="summary-item-img" />
                    <div className="summary-item-info">
                      <p className="summary-item-name">{product.name}</p>
                      <p className="summary-item-qty">Số lượng: {item.quantity}</p>
                    </div>
                    <div className="summary-item-price">
                      {(product.price * item.quantity).toLocaleString("vi-VN")} đ
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Tạm tính ({cart.items.length} sản phẩm)</span>
                <span>{subTotal().toLocaleString("vi-VN")} đ</span>
              </div>
              <div className="summary-row">
                <span>Phí vận chuyển</span>
                <span>{shippingFee().toLocaleString("vi-VN")} đ</span>
              </div>
              <div className="summary-row total">
                <span>Tổng thanh toán</span>
                <span>{finalTotal.toLocaleString("vi-VN")} đ</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;