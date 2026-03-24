import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import "./ProductDetail.css";

const API_URL = "http://localhost:9999";
const USER_ID = 1;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [reviews, setReviews] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const [productRes, productsRes, reviewsRes, usersRes] = await Promise.all([
          fetch(`${API_URL}/products/${id}`),
          fetch(`${API_URL}/products`),
          fetch(`${API_URL}/reviews?productId=${id}`),
          fetch(`${API_URL}/users`)
        ]);

        if (!productRes.ok) {
          throw new Error("Product not found");
        }

        const [productData, productsData, reviewsData, usersData] = await Promise.all([
          productRes.json(), 
          productsRes.json(), 
          reviewsRes.json(),
          usersRes.json()
        ]);
        
        setProduct(productData);
        setAllProducts(productsData.filter((item) => !item.isHidden));
        setReviews(reviewsData);
        setAllUsers(usersData);
      } catch (error) {
        console.error("Loi load chi tiet san pham:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];

    return allProducts
      .filter(
        (item) =>
          String(item.id) !== String(product.id) &&
          String(item.categoryId) === String(product.categoryId)
      )
      .slice(0, 4);
  }, [allProducts, product]);

  const addToCart = async () => {
    if (!product || product.stock <= 0) {
      Swal.fire({ icon: "warning", title: "Sản phẩm đã hết hàng" });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/carts?userId=${USER_ID}`);
      const carts = await res.json();

      if (carts.length > 0) {
        const cart = carts[0];
        const existingItem = cart.items.find((item) => String(item.productId) === String(product.id));

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.items.push({ productId: product.id, quantity: 1 });
        }

        await fetch(`${API_URL}/carts/${cart.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cart)
        });
      } else {
        await fetch(`${API_URL}/carts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: USER_ID, items: [{ productId: product.id, quantity: 1 }] })
        });
      }

      Swal.fire({
        icon: "success",
        title: "Đã thêm vào giỏ",
        text: `${product.name} đã được thêm vào giỏ hàng.`,
        timer: 1800,
        showConfirmButton: false
      });
    } catch (error) {
      console.error(" lỗi thêm giỏ hàng:", error);
      Swal.fire({ icon: "error", title: "Không thể thêm vào giỏ" });
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const confirm = await Swal.fire({
      title: "Xác nhận xóa?",
      text: "Bạn sẽ không thể khôi phục lại đánh giá này!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy"
    });

    if (confirm.isConfirmed) {
      try {
        await fetch(`${API_URL}/reviews/${reviewId}`, { method: "DELETE" });
        setReviews(reviews.filter(r => r.id !== reviewId));
        Swal.fire({ icon: "success", title: "Đã xóa đánh giá", timer: 1500, showConfirmButton: false });
      } catch (error) {
        console.error("Lỗi xóa đánh giá:", error);
        Swal.fire({ icon: "error", title: "Không thể xóa đánh giá" });
      }
    }
  };

  const startEdit = (review) => {
    setEditingReviewId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const cancelEdit = () => {
    setEditingReviewId(null);
    setEditRating(5);
    setEditComment("");
  };

  const saveEdit = async (reviewId) => {
    if (!editComment.trim()) {
      Swal.fire({ icon: "warning", title: "Vui lòng nhập bình luận!" });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: Number(editRating), comment: editComment.trim() })
      });
      const updatedReview = await res.json();
      
      setReviews(reviews.map(r => r.id === reviewId ? updatedReview : r));
      setEditingReviewId(null);
      Swal.fire({ icon: "success", title: "Cập nhật thành công", timer: 1500, showConfirmButton: false });
    } catch (error) {
      console.error("Lỗi cập nhật đánh giá:", error);
      Swal.fire({ icon: "error", title: "Không thể cập nhật đánh giá" });
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      Swal.fire({ icon: "warning", title: "Vui lòng nhập bình luận!" });
      return;
    }

    const matchedUser = allUsers.find(u => u.email === currentUser.email);
    const realName = matchedUser?.name || currentUser.displayName;

    const reviewPayload = {
      productId: Number(id),
      userName: realName || currentUser.email || "Khách",
      userEmail: currentUser.email || "Khách",
      rating: Number(rating),
      comment: comment.trim(),
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewPayload)
      });
      const newReview = await res.json();
      setReviews([...reviews, newReview]);
      setComment("");
      setRating(5);
      Swal.fire({ icon: "success", title: "Đã gửi đánh giá", timer: 1500, showConfirmButton: false });
    } catch (error) {
      console.error("Loi gui danh gia:", error);
      Swal.fire({ icon: "error", title: "Không thể gửi đánh giá" });
    }
  };

  if (loading) {
    return <div className="product-detail-page">Dang tai san pham...</div>;
  }

  if (!product || product.isHidden) {
    return (
      <div className="product-detail-page">
        <div className="product-detail-empty">
          <h2>Không tìm thấy sản phẩm</h2>
          <button type="button" onClick={() => navigate("/")}>
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-card">
        <button type="button" className="product-detail-back" onClick={() => navigate(-1)}>
          Quay lai
        </button>

        <div className="product-detail-main">
          <div className="product-detail-image-wrap">
            <img src={product.image} alt={product.name} className="product-detail-image" />
          </div>

          <div className="product-detail-content">
            <span className="product-detail-chip">Chi tiết sản phẩm</span>
            <h1>{product.name}</h1>
            <p className="product-detail-description">
              {product.description || "Sản phẩm đang được cập nhật mô tả ."}
            </p>

            <div className="product-detail-meta">
              <div>
                <span>Giá bán</span>
                <strong>{product.price.toLocaleString("vi-VN")} VND</strong>
              </div>
              <div>
                <span>Tồn kho</span>
                <strong>{product.stock > 0 ? `${product.stock} sản phẩm` : "Hết hàng"}</strong>
              </div>
              <div>
                <span>Ngày sản xuất</span>
                <strong>{product.manufactureDate || "Đang cập nhật"}</strong>
              </div>
              <div>
                <span>Hạn sử dụng</span>
                <strong>{product.expiryDate || "Đang cập nhật"}</strong>
              </div>
              <div className="product-detail-meta-wide">
                <span>Nơi sản xuất</span>
                <strong>{product.origin || "Đang cập nhật"}</strong>
              </div>
            </div>

            <div className="product-detail-actions">
              <button type="button" onClick={addToCart} disabled={product.stock <= 0}>
                {product.stock > 0 ? "Thêm vào giỏ" : "Hết hàng"}
              </button>
              <button type="button" className="secondary-btn" onClick={() => navigate("/cart")}>
                Xem giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="reviews-section">
        <div className="section-heading">
          <h2>Đánh giá sản phẩm</h2>
          <p>Nhận xét và đánh giá từ khách hàng.</p>
        </div>

        <div className="reviews-list">
          {reviews.length > 0 ? (
            reviews.map((rev) => {
              const isAdmin = currentUser?.email === "admin@gmail.com";
              const isAuthor = currentUser?.email === rev.userEmail;
              const canDelete = isAdmin || isAuthor;
              const canEdit = isAuthor;

              if (editingReviewId === rev.id) {
                return (
                  <div key={rev.id} className="review-item edit-mode">
                    <div className="form-group">
                      <select value={editRating} onChange={(e) => setEditRating(Number(e.target.value))} style={{ marginBottom: "10px", width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #d8e8dc" }}>
                        <option value="5">5 Sao (Rất tốt)</option>
                        <option value="4">4 Sao (Tốt)</option>
                        <option value="3">3 Sao (Bình thường)</option>
                        <option value="2">2 Sao (Kém)</option>
                        <option value="1">1 Sao (Rất kém)</option>
                      </select>
                      <textarea
                        rows="3"
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #d8e8dc", fontFamily: "inherit" }}
                      ></textarea>
                    </div>
                    <div className="review-actions" style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                      <button type="button" onClick={() => saveEdit(rev.id)} className="submit-review-btn" style={{ padding: "8px 16px" }}>Lưu lại</button>
                      <button type="button" onClick={cancelEdit} className="secondary-btn" style={{ padding: "8px 16px", background: "transparent", border: "1px solid #229954", color: "#229954", borderRadius: "12px", cursor: "pointer" }}>Hủy</button>
                    </div>
                  </div>
                );
              }

              return (
                <div key={rev.id} className="review-item">
                  <div className="review-meta">
                    <strong>
                      {(() => {
                        const matched = allUsers.find((u) => u.email === rev.userEmail);
                        return matched?.name || rev.userName || rev.userEmail || "Khách";
                      })()}
                    </strong>
                    <span className="review-stars">{"⭐".repeat(rev.rating)}</span>
                    <span className="review-date">
                      {new Date(rev.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <p className="review-comment">{rev.comment}</p>
                  
                  {(canEdit || canDelete) && (
                    <div className="review-item-actions" style={{ marginTop: "12px", display: "flex", gap: "12px" }}>
                      {canEdit && <span onClick={() => startEdit(rev)} style={{ color: "#2563eb", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>Sửa</span>}
                      {canDelete && <span onClick={() => handleDeleteReview(rev.id)} style={{ color: "#dc2626", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>Xóa</span>}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="no-reviews">Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!</p>
          )}
        </div>

        <div className="review-form-container">
          {currentUser ? (
            <form onSubmit={submitReview} className="review-form">
              <h3>Viết đánh giá của bạn</h3>
              <div className="form-group">
                <label>Đánh giá sao:</label>
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                  <option value="5">5 Sao (Rất tốt)</option>
                  <option value="4">4 Sao (Tốt)</option>
                  <option value="3">3 Sao (Bình thường)</option>
                  <option value="2">2 Sao (Kém)</option>
                  <option value="1">1 Sao (Rất kém)</option>
                </select>
              </div>
              <div className="form-group">
                <textarea
                  rows="4"
                  placeholder="Nhập nhận xét của bạn..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                ></textarea>
              </div>
              <button type="submit" className="submit-review-btn">Gửi đánh giá</button>
            </form>
          ) : (
            <div className="login-prompt">
              <p>Vui lòng đăng nhập để đánh giá sản phẩm.</p>
              <button type="button" onClick={() => navigate("/login")} className="secondary-btn">
                Đăng nhập
              </button>
            </div>
          )}
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="related-section">
          <div className="section-heading">
            <h2>Sản phẩm liên quan</h2>
            
          </div>
          <div className="related-grid">
            {relatedProducts.map((item) => (
              <article
                key={item.id}
                className="related-card"
                onClick={() => navigate(`/products/${item.id}`)}
              >
                <img src={item.image} alt={item.name} />
                <h3>{item.name}</h3>
                <p>{item.price.toLocaleString("vi-VN")} VND</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
