import React, { useEffect, useState, useMemo } from "react";
import "./HomePage.css";
import Swal from "sweetalert2";

const API_URL = "http://localhost:9999";
const PRODUCTS_PER_PAGE = 8;

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [currentPage, setCurrentPage] = useState(Number(localStorage.getItem("currentPage")) || 1);
  const [activeBanner, setActiveBanner] = useState(0);

  const isMember = true; // Giả định trạng thái hội viên
  const userId = 1;

  const banners = [
    { id: 1, url: "/images/ban1.jpg", title: "Hoa quả tươi mỗi ngày" },
    { id: 2, url: "/images/ban3.jpeg", title: "Nước giải khát cực đã" },
    { id: 3, url: "/images/ban2.jpg", title: "Đồ ăn vặt thơm ngon" }
  ];

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API_URL}/products`).then(res => res.json()),
      fetch(`${API_URL}/categories`).then(res => res.json())
    ]).then(([productsData, categoriesData]) => {
      setProducts(productsData);
      setCategories(categoriesData);
      setLoading(false);
    }).catch(err => {
      console.error("Lỗi:", err);
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

  // Logic lọc dữ liệu
  const discountProducts = useMemo(() => products.filter(p => p.price < 50000).slice(0, 4), [products]);
  const memberProducts = useMemo(() => products.filter(p => p.categoryId === "5" || p.isMemberProduct).slice(0, 4), [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategoryId === "all" || String(p.categoryId) === String(selectedCategoryId);
      return matchSearch && matchCategory;
    });
  }, [products, searchTerm, selectedCategoryId]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const currentProducts = filteredProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);

  const addToCart = async (product) => {
    if (product.isMemberProduct && !isMember) {
      Swal.fire({ icon: 'info', title: 'Đặc quyền hội viên', text: 'Vui lòng đăng ký hội viên!' });
      return;
    }
    if (product.stock <= 0) {
      Swal.fire({ icon: 'warning', title: 'Rất tiếc!', text: 'Sản phẩm đã hết hàng.' });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/carts?userId=${userId}`);
      const carts = await res.json();
      if (carts.length > 0) {
        const cart = carts[0];
        const existingItem = cart.items.find(item => String(item.productId) === String(product.id));
        if (existingItem) existingItem.quantity += 1;
        else cart.items.push({ productId: product.id, quantity: 1 });
        await fetch(`${API_URL}/carts/${cart.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cart),
        });
      } else {
        await fetch(`${API_URL}/carts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, items: [{ productId: product.id, quantity: 1 }] }),
        });
      }
      Toast.fire({ icon: 'success', title: `Đã thêm ${product.name} vào giỏ` });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể thêm vào giỏ.' });
    }
  };

  if (loading) return <div className="loading-spinner">Đang tải dữ liệu...</div>;

  return (
    <div className="home-container">
      {/* 1. Banner */}
      <section className="carousel-container">
        {banners.map((banner, index) => (
          <div key={banner.id} className={`slide ${index === activeBanner ? "active" : ""}`}>
            <img src={banner.url} alt={banner.title} />
            <div className="banner-text"><p>{banner.title}</p></div>
          </div>
        ))}
        <button className="carousel-btn prev" onClick={() => setActiveBanner((prev) => (prev - 1 + banners.length) % banners.length)}>&#10094;</button>
        <button className="carousel-btn next" onClick={() => setActiveBanner((prev) => (prev + 1) % banners.length)}>&#10095;</button>
      </section>

      {/* 2. Search Bar (Vị trí mới: Dưới Banner) */}
      <div className="full-width-search">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Bạn muốn tìm gì hôm nay?" 
            value={searchTerm} 
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
          />
        </div>
      </div>

      <div className="main-content">
        {/* 3. Sidebar */}
        <aside className="sidebar">
          <h3><i className="fas fa-bars"></i> Danh mục</h3>
          <ul>
            <li className={selectedCategoryId === "all" ? "active" : ""} onClick={() => { setSelectedCategoryId("all"); setCurrentPage(1); }}>Tất cả sản phẩm</li>
            {categories.map(cat => (
              <li key={cat.id} className={selectedCategoryId === cat.id ? "active" : ""} onClick={() => { setSelectedCategoryId(cat.id); setCurrentPage(1); }}>{cat.name}</li>
            ))}
          </ul>
        </aside>

        {/* 4. Sản phẩm */}
        <section className="product-section">
          {/* Giảm giá */}
          <div className="special-section-container">
            <h2 className="section-title">🔥 GIẢM GIÁ HÔM NAY</h2>
            <div className="horizontal-list">
              {discountProducts.map(p => (
                <div className="mini-product-card" key={p.id}>
                  <div className="sale-badge">Sale</div>
                  <img src={p.image} alt={p.name} />
                  <h4>{p.name}</h4>
                  <p className="price-new">{p.price.toLocaleString()}đ</p>
                  <button onClick={() => addToCart(p)}>Mua ngay</button>
                </div>
              ))}
            </div>
          </div>

          {/* Hội viên */}
          <div className="special-section-container member-exclusive">
            <h2 className="section-title">💎 DÀNH CHO HỘI VIÊN</h2>
            <div className="horizontal-list">
              {memberProducts.map(p => (
                <div className="mini-product-card" key={p.id}>
                  <div className="vip-badge">VIP</div>
                  <img src={p.image} alt={p.name} />
                  <h4>{p.name}</h4>
                  <p className="price-member">{p.price.toLocaleString()}đ</p>
                  <button className="member-btn" onClick={() => addToCart(p)}>Nhận ưu đãi</button>
                </div>
              ))}
            </div>
          </div>

          <hr className="section-divider" />

          {/* Grid chính */}
          <div className="product-grid">
            {currentProducts.map((item) => (
              <div className="product-card" key={item.id}>
                <div className="image-wrapper">
                  <img src={item.image} alt={item.name} loading="lazy" />
                  {item.stock <= 0 && <span className="sold-out-overlay">Hết hàng</span>}
                </div>
                <div className="product-info">
                  <h3>{item.name}</h3>
                  <p className="price">{item.price.toLocaleString()} đ</p>
                  <p className={`stock-info ${item.stock < 10 && item.stock > 0 ? "low-stock" : ""}`}>{item.stock > 0 ? `Còn lại: ${item.stock}` : "Hết hàng"}</p>
                  <button onClick={() => addToCart(item)} disabled={item.stock <= 0} className={item.stock <= 0 ? "disabled-btn" : "add-to-cart-btn"}>{item.stock > 0 ? "Thêm vào giỏ" : "Tạm hết"}</button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={currentPage === 1} onClick={() => { setCurrentPage(prev => prev - 1); window.scrollTo({ top: 500, behavior: 'smooth' }); }}> ‹ </button>
              <span className="page-number">Trang {currentPage} / {totalPages}</span>
              <button disabled={currentPage === totalPages} onClick={() => { setCurrentPage(prev => prev + 1); window.scrollTo({ top: 500, behavior: 'smooth' }); }}> › </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;