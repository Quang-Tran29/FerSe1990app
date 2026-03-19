import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductDetail.css";

const API_URL = "http://localhost:9999";

function ProductDetail() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch(`${API_URL}/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, [id]);

  if (!product) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="detail-container">

      {/* nút quay lại */}
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Quay lại
      </button>

      <div className="detail-card">

        {/* ảnh */}
        <div className="detail-image">
          <img src={product.image} alt={product.name} />
        </div>

        {/* thông tin */}
        <div className="detail-info">

          <h1 className="product-title">
            {product.name}
          </h1>

          <p className="price">
            {product.price.toLocaleString()} đ
          </p>

          {/* đã bán */}
          <p className="sold">
            Đã bán {product.sold} sản phẩm
          </p>

          <p className="description">
            {product.description}
          </p>

          <div className="info-box">
            <p><b>Xuất xứ:</b> {product.origin}</p>
            <p><b>Ngày sản xuất:</b> {product.manufactureDate}</p>
            <p><b>Hạn sử dụng:</b> {product.expiryDate}</p>
            <p><b>Số lượng còn:</b> {product.stock}</p>
          </div>

          {/* quantity */}
          <div className="quantity">

            <button
              onClick={() => setQuantity(quantity - 1)}
              disabled={quantity <= 1}
            >
              -
            </button>

            <span>{quantity}</span>

            <button
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>

          </div>

          {/* buttons */}
          <div className="buttons">

            <button className="cart-btn">
              Thêm vào giỏ
            </button>

            <button className="buy-btn">
              Mua ngay
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default ProductDetail;