import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import Swal from "sweetalert2";
import { auth } from "./firebase";
import "./CheckoutPage.css";

const API_URL = "http://localhost:9999";
const USER_ID = 1;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [products, setProducts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    note: "",
    paymentMethod: "cod"
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        Swal.fire({
          icon: "info",
          title: "Cần đăng nhập",
          text: "Bạn cần đăng nhập để tiếp tục thanh toán."
        }).then(() => {
          navigate("/login");
        });
      }
    });

    return () => unsub();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cartRes, productsRes] = await Promise.all([
          fetch(`${API_URL}/carts?userId=${USER_ID}`),
          fetch(`${API_URL}/products`)
        ]);

        const [cartData, productsData] = await Promise.all([cartRes.json(), productsRes.json()]);
        setCart(cartData[0] || { items: [] });
        setProducts(productsData);
      } catch (error) {
        console.error("Loi load checkout:", error);
      }
    };

    fetchData();
  }, []);

  const checkoutItems = useMemo(() => {
    if (!cart) return [];

    return cart.items
      .map((item) => {
        const product = products.find((productItem) => Number(productItem.id) === Number(item.productId));
        if (!product) return null;

        return { ...item, product };
      })
      .filter(Boolean);
  }, [cart, products]);

  const subtotal = useMemo(() => {
    return checkoutItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [checkoutItems]);

  const shippingFee = subtotal > 500000 || subtotal === 0 ? 0 : 30000;
  const totalAmount = subtotal + shippingFee;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (checkoutItems.length === 0) {
      Swal.fire({ icon: "info", title: "Không có sản phẩm để thanh toán" });
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.address) {
      Swal.fire({ icon: "warning", title: "Vui lòng điền đầy đủ thông tin giao hàng" });
      return;
    }

    const invalidStockItem = checkoutItems.find((item) => item.quantity > item.product.stock);
    if (invalidStockItem) {
      Swal.fire({
        icon: "warning",
        title: "Số lượng vượt tồn kho",
        text: `${invalidStockItem.product.name} chỉ còn ${invalidStockItem.product.stock} sản phẩm.`
      });
      return;
    }

    setSubmitting(true);

    try {
      const orderPayload = {
        userId: USER_ID,
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        note: formData.note,
        paymentMethod: formData.paymentMethod,
        totalAmount,
        shippingFee,
        status: "pending",
        createdAt: new Date().toISOString().slice(0, 10),
        items: checkoutItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        }))
      };

      await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      });

      await Promise.all(
        checkoutItems.map((item) =>
          fetch(`${API_URL}/products/${item.product.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...item.product,
              stock: item.product.stock - item.quantity
            })
          })
        )
      );

      if (cart?.id) {
        await fetch(`${API_URL}/carts/${cart.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...cart, items: [] })
        });
      }

      await Swal.fire({
        icon: "success",
        title: "Đặt hàng thành công",
        text: "Đơn hàng của bạn đã được tạo và giỏ hàng đã được làm mới."
      });

      navigate("/");
    } catch (error) {
      console.error(" lỗi thanh toán:", error);
      Swal.fire({ icon: "error", title: "Thanh toán thất bại" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-shell">
        <div className="checkout-header">
          <div>
            <span className="checkout-tag">Thanh toán</span>
            <h1>Hoàn tất đơn hàng của bạn</h1>
            <p>Kiểm tra lại thông tin giao nhận và chọn cách thanh toán phù hợp.</p>
          </div>
          <button type="button" className="checkout-back" onClick={() => navigate("/cart")}>
            Về giỏ hàng 
          </button>
        </div>

        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h2>Thông tin nhận hàng</h2>

            <label>
              Họ và tên
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nhập tên người nhận"
              />
            </label>

            <label>
              Số điện thoại
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
              />
            </label>

            <label>
              Địa chỉ giao hàng
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Nhập địa chỉ cụ thể"
                rows="4"
              />
            </label>

            <label>
              Ghi chú
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder="Them ghi chu cho nguoi giao hang neu can"
                rows="3"
              />
            </label>

            <div className="payment-methods">
              <p>Phương thức thanh toán</p>
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === "cod"}
                  onChange={handleChange}
                />
                Thanh toán khi nhận hàng  
              </label>
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="banking"
                  checked={formData.paymentMethod === "banking"}
                  onChange={handleChange}
                />
                Chuyển khoản ngân hàng
              </label>

              {formData.paymentMethod === "banking" && (
                <div className="qr-code-section" style={{ marginTop: "15px", textAlign: "center", padding: "15px", border: "1px dashed #ccc", borderRadius: "8px", background: "#f9f9f9" }}>
                  <p style={{ fontWeight: "bold", marginBottom: "10px" }}>Vui lòng quét mã QR để thanh toán</p>
                  {/* Đường dẫn tới ảnh QR CODE */}
                  <img src="/images/QR.jpg" alt="Mã QR Thanh Toán" style={{ width: "200px", height: "200px", objectFit: "contain", borderRadius: "8px" }} />
                  <p style={{ fontSize: "14px", color: "#555", marginTop: "10px" }}>Số tiền: <strong style={{ color: "#d32f2f" }}>{totalAmount.toLocaleString("vi-VN")} VND</strong></p>
                  <p style={{ fontSize: "14px", color: "#555" }}>Nội dung CK: <strong>THANHTOAN {formData.phone || ""}</strong></p>
                </div>
              )}
            </div>

            <button type="submit" className="place-order-btn" disabled={submitting}>
              {submitting ? "Đang xử lý..." : "Đặt hàng ngay"}
            </button>
          </form>

          <aside className="checkout-summary">
            <h2>Đơn hàng của bạn</h2>

            {checkoutItems.length === 0 ? (
              <div className="empty-checkout">
                <p>Chưa có sản phẩm nào trong giỏ hàng.</p>
                <button type="button" onClick={() => navigate("/")}>
                  Mua sắm ngay
                </button>
              </div>
            ) : (
              <>
                <div className="checkout-items">
                  {checkoutItems.map((item) => (
                    <div className="checkout-item" key={item.product.id}>
                      <img src={item.product.image} alt={item.product.name} />
                      <div>
                        <h3>{item.product.name}</h3>
                        <p>So luong: {item.quantity}</p>
                      </div>
                      <strong>{(item.product.price * item.quantity).toLocaleString("vi-VN")} d</strong>
                    </div>
                  ))}
                </div>

                <div className="summary-row">
                  <span>Tạm tính</span>
                  <strong>{subtotal.toLocaleString("vi-VN")} d</strong>
                </div>
                <div className="summary-row">
                  <span>Vận chuyển</span>
                  <strong>{shippingFee.toLocaleString("vi-VN")} d</strong>
                </div>
                <div className="summary-row total">
                  <span> Tổng thanh toán</span>
                  <strong>{totalAmount.toLocaleString("vi-VN")} d</strong>
                </div>
              </>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
