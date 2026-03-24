import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./HomePage.css";

const API_URL = "http://localhost:9999";
const PRODUCTS_PER_PAGE = 8;
const DISCOUNT_RATE = 0.2;
const USER_ID = 1;

const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [currentPage, setCurrentPage] = useState(Number(localStorage.getItem("currentPage")) || 1);
  const [activeBanner, setActiveBanner] = useState(0);

  const isMember = true;

  const banners = [
    { id: 1, url: "/images/ban1.jpg", title: "Hoa quả tươi mỗi ngày" },
    { id: 2, url: "/images/ban3.jpeg", title: "Nước giải khát cực đã" },
    { id: 3, url: "/images/ban2.jpg", title: "Đồ ăn vặt thơm ngon" }
  ];

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true
  });

  useEffect(() => {
    setLoading(true);

    Promise.all([
      fetch(`${API_URL}/products`).then((res) => res.json()),
      fetch(`${API_URL}/categories`).then((res) => res.json())
    ])
      .then(([productsData, categoriesData]) => {
        setProducts(productsData);
        setCategories(categoriesData);
      })
      .catch((error) => {
        console.error("Lỗi load du lieu:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [banners.length]);

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  const visibleProducts = useMemo(
    () => products.filter((product) => !product.isHidden),
    [products]
  );

  const discountProducts = useMemo(
    () => visibleProducts.filter((product) => product.price < 50000).slice(0, 4),
    [visibleProducts]
  );

  const memberProducts = useMemo(
    () =>
      visibleProducts
        .filter((product) => product.categoryId === "5" || product.isMemberProduct)
        .slice(0, 4),
    [visibleProducts]
  );

  const todayProducts = useMemo(() => {
    if (visibleProducts.length === 0) return [];

    const today = new Date();
    const startIndex = today.getDate() % visibleProducts.length;

    return Array.from({ length: Math.min(4, visibleProducts.length) }, (_, index) => {
      return visibleProducts[(startIndex + index) % visibleProducts.length];
    });
  }, [visibleProducts]);

  const filteredProducts = useMemo(() => {
    return visibleProducts.filter((product) => {
      const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory =
        selectedCategoryId === "all" || String(product.categoryId) === String(selectedCategoryId);

      return matchSearch && matchCategory;
    });
  }, [visibleProducts, searchTerm, selectedCategoryId]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const getOldPrice = (price) => Math.round(price * (1 + DISCOUNT_RATE));

  const addToCart = async (product) => {
    if (product.isMemberProduct && !isMember) {
      Swal.fire({ icon: "info", title: "Đặc quyền hội viên", text: "Vui lòng đăng ký hội viên!" });
      return;
    }

    if (product.stock <= 0) {
      Swal.fire({ icon: "warning", title: "Rất tiếc!", text: "Sản phẩm đã hết hàng." });
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

      Toast.fire({ icon: "success", title: `Đã thêm ${product.name} vào giỏ` });
    } catch (error) {
      console.error("Lỗi thêm giỏ hàng:", error);
      Swal.fire({ icon: "error", title: "Lỗi", text: "Không thể thêm vào giỏ hàng." });
    }
  };

  const openProductDetail = (productId) => {
    navigate(`/products/${productId}`);
  };

  const renderMiniProduct = (product, badgeClass, badgeText, buttonText, extraButtonClass = "") => (
    <div
      className="mini-product-card"
      key={product.id}
      onClick={() => openProductDetail(product.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          openProductDetail(product.id);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className={badgeClass}>{badgeText}</div>
      <img src={product.image} alt={product.name} />
      <h4>{product.name}</h4>
      <div className="price-stack">
        {badgeClass === "sale-badge" && (
          <span className="price-old">{getOldPrice(product.price).toLocaleString()} VND</span>
        )}
        <span className={badgeClass === "sale-badge" ? "price-new" : "price-member"}>
          {product.price.toLocaleString()} VND  
        </span>
      </div>
      <p className={`mini-stock ${product.stock < 10 && product.stock > 0 ? "low-stock" : ""}`}>
        {product.stock > 0 ? `Con lai: ${product.stock}` : "Het hang"}
      </p>
      <button
        type="button"
        className={extraButtonClass}
        onClick={(event) => {
          event.stopPropagation();
          addToCart(product);
        }}
      >
        {buttonText}
      </button>
    </div>
  );

  if (loading) {
    return <div className="loading-spinner">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="home-container">
      <section className="carousel-container">
        {banners.map((banner, index) => (
          <div key={banner.id} className={`slide ${index === activeBanner ? "active" : ""}`}>
            <img src={banner.url} alt={banner.title} />
            <div className="banner-text">
              <p>{banner.title}</p>
            </div>
          </div>
        ))}

        <button
          className="carousel-btn prev"
          onClick={() => setActiveBanner((prev) => (prev - 1 + banners.length) % banners.length)}
        >
          &#10094;
        </button>
        <button
          className="carousel-btn next"
          onClick={() => setActiveBanner((prev) => (prev + 1) % banners.length)}
        >
          &#10095;
        </button>
      </section>

      <div className="full-width-search">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Bạn muốn tìm gì hôm nay?"
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="main-content">
        <aside className="sidebar">
          <h3>Danh mục</h3>
          <ul>
            <li
              className={selectedCategoryId === "all" ? "active" : ""}
              onClick={() => {
                setSelectedCategoryId("all");
                setCurrentPage(1);
              }}
            >
              Tất cả sản phẩm
            </li>
            {categories.map((category) => (
              <li
                key={category.id}
                className={selectedCategoryId === category.id ? "active" : ""}
                onClick={() => {
                  setSelectedCategoryId(category.id);
                  setCurrentPage(1);
                }}
              >
                {category.name}
              </li>
            ))}
          </ul>
        </aside>

        <section className="product-section">
          <div className="special-section-container today-highlight">
            <div className="section-heading">
              <h2 className="section-title">SẢN PHẨM HÔM NAY</h2>
            </div>
            <div className="today-grid">
              {todayProducts.map((product) => (
                <article
                  key={`today-${product.id}`}
                  className="today-card"
                  onClick={() => openProductDetail(product.id)}
                >
                  <div className="today-card-copy">
                    <span className="today-label">Hôm nay</span>
                    <h3>{product.name}</h3>
                    <p>{product.description || "ản phẩm đang được nhiều người quan tâm."}</p>
                    <strong>{product.price.toLocaleString("vi-VN")} VND</strong>
                  </div>
                  <img src={product.image} alt={product.name} />
                </article>
              ))}
            </div>
          </div>

          <div className="special-section-container">
            <h2 className="section-title">UU DAI GIAM GIA</h2>
            <div className="horizontal-list">
              {discountProducts.map((product) =>
                renderMiniProduct(product, "sale-badge", "Sale", "Mua ngay")
              )}
            </div>
          </div>

          <div className="special-section-container member-exclusive">
            <h2 className="section-title">DÀNH CHO HỘI VIÊN</h2>
            <div className="horizontal-list">
              {memberProducts.map((product) =>
                renderMiniProduct(product, "vip-badge", "VIP", "Nhận ưu đãi", "member-btn")
              )}
            </div>
          </div>

          <hr className="section-divider" />

          <div className="product-grid">
            {currentProducts.map((item) => {
              const isDiscounted = item.price < 50000;

              return (
                <div className="product-card" key={item.id}>
                  <div className="image-wrapper" onClick={() => openProductDetail(item.id)}>
                    <img src={item.image} alt={item.name} loading="lazy" />
                    {item.stock <= 0 && <span className="sold-out-overlay">Het hang</span>}
                  </div>

                  <div className="product-info">
                    <h3 className="product-link-title" onClick={() => openProductDetail(item.id)}>
                      {item.name}
                    </h3>

                    {isDiscounted ? (
                      <div className="price-stack align-left">
                        <span className="price-old">{getOldPrice(item.price).toLocaleString()} VND</span>
                        <span className="price-new">{item.price.toLocaleString()} VND</span>
                      </div>
                    ) : (
                      <p className="price">{item.price.toLocaleString()} VND</p>
                    )}

                    <p className={`stock-info ${item.stock < 10 && item.stock > 0 ? "low-stock" : ""}`}>
                      {item.stock > 0 ? `Con lai: ${item.stock}` : "Het hang"}
                    </p>

                    <button
                      type="button"
                      onClick={() => addToCart(item)}
                      disabled={item.stock <= 0}
                      className={item.stock <= 0 ? "disabled-btn" : "add-to-cart-btn"}
                    >
                      {item.stock > 0 ? "Thêm vào giỏ" : "Hết hàng"}
                    </button>

                    <button
                      type="button"
                      className="detail-btn"
                      onClick={() => openProductDetail(item.id)}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((prev) => prev - 1);
                  window.scrollTo({ top: 500, behavior: "smooth" });
                }}
              >
                ‹
              </button>
              <span className="page-number">Trang {currentPage} / {totalPages}</span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((prev) => prev + 1);
                  window.scrollTo({ top: 500, behavior: "smooth" });
                }}
              >
                ›
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
