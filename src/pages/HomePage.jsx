import React, { useEffect, useState, useMemo } from "react";
import "./HomePage.css";

// Các hằng số cấu hình
const API_URL = "http://localhost:9999";
const PRODUCTS_PER_PAGE = 8;

const HomePage = () => {
  // --- STATES ---
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [currentPage, setCurrentPage] = useState(Number(localStorage.getItem("currentPage")) || 1);
  const [activeBanner, setActiveBanner] = useState(0);

  const userId = 1; // Giả định ID người dùng đang đăng nhập

  const banners = [
    { id: 1, url: "/images/ban1.jpg", title: "Hoa quả tươi mỗi ngày" },
    { id: 2, url: "/images/ban3.jpeg", title: "Nước giải khát cực đã" },
    { id: 3, url: "/images/ban2.jpg", title: "Đồ ăn vặt thơm ngon" }
  ];

  // --- SIDE EFFECTS ---
  // Fetch dữ liệu ban đầu
  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/products`).then(res => res.json()),
      fetch(`${API_URL}/categories`).then(res => res.json())
    ]).then(([productsData, categoriesData]) => {
      setProducts(productsData);
      setCategories(categoriesData);
    }).catch(err => console.error("Lỗi khi fetch dữ liệu:", err));
  }, []);

  // Tự động chạy Banner
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [banners.length]);

  // Lưu trang hiện tại vào LocalStorage
  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  // --- LOGIC XỬ LÝ ---
  // Lọc sản phẩm theo Search + Category
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategoryId === "all" || String(p.categoryId) === String(selectedCategoryId);
      return matchSearch && matchCategory;
    });
  }, [products, searchTerm, selectedCategoryId]);

  // Phân trang
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  // Thêm vào giỏ hàng
  const addToCart = async (product) => {
    if (product.stock <= 0) {
      alert("Sản phẩm đã hết hàng!");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/carts?userId=${userId}`);
      const carts = await res.json();

      if (carts.length > 0) {
        const cart = carts[0];
        const existingItem = cart.items.find(item => String(item.productId) === String(product.id));

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.items.push({ productId: product.id, quantity: 1 });
        }

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
      alert(`Đã thêm ${product.name} vào giỏ!`);
    } catch (error) {
      alert("Có lỗi xảy ra khi thêm vào giỏ hàng!");
    }
  };

  
  return (
    <div className="home-container">
      {/* 1. Carousel Banner */}
      <section className="carousel-container">
        {banners.map((banner, index) => (
          <div key={banner.id} className={`slide ${index === activeBanner ? "active" : ""}`}>
            <img src={banner.url} alt={banner.title} />
            <div className="banner-text">{banner.title}</div>
          </div>
        ))}
        <button className="carousel-btn prev" onClick={() => setActiveBanner((prev) => (prev - 1 + banners.length) % banners.length)}>&#10094;</button>
        <button className="carousel-btn next" onClick={() => setActiveBanner((prev) => (prev + 1) % banners.length)}>&#10095;</button>
        <div className="carousel-dots">
          {banners.map((_, index) => (
            <span 
              key={index} 
              className={`dot ${index === activeBanner ? "active" : ""}`}
              onClick={() => setActiveBanner(index)}
            ></span>
          ))}
        </div>
      </section>

      <div className="main-content">
        {/* 2. Sidebar Phân loại */}
        <aside className="sidebar">
          <h3>Danh mục</h3>
          <ul>
            <li 
              className={selectedCategoryId === "all" ? "active" : ""}
              onClick={() => { setSelectedCategoryId("all"); setCurrentPage(1); }}
            >
              Tất cả sản phẩm
            </li>
            {categories.map(cat => (
              <li 
                key={cat.id} 
                className={selectedCategoryId === cat.id ? "active" : ""}
                onClick={() => { setSelectedCategoryId(cat.id); setCurrentPage(1); }}
              >
                {cat.name}
              </li>
            ))}
          </ul>
        </aside>

        {/* 3. Khu vực sản phẩm */}
        <section className="product-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Bạn muốn tìm gì hôm nay?"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>

          <div className="product-grid">
            {currentProducts.length > 0 ? (
              currentProducts.map((item) => (
                <div className="product-card" key={item.id}>
                  <div className="image-wrapper">
                    <img src={item.image} alt={item.name} />
                    {item.stock <= 0 && <span className="sold-out-overlay">Hết hàng</span>}
                  </div>
                  <h3>{item.name}</h3>
                  <p className="price">{item.price.toLocaleString()} đ</p>
                  <p className={`stock-info ${item.stock < 10 ? "low-stock" : ""}`}>
                    Tồn kho: <strong>{item.stock}</strong>
                  </p>
                  <button 
                    onClick={() => addToCart(item)}
                    disabled={item.stock <= 0}
                    className={item.stock <= 0 ? "disabled-btn" : ""}
                  >
                    {item.stock > 0 ? "Thêm vào giỏ" : "Tạm hết"}
                  </button>
                </div>
              ))
            ) : (
              <p className="no-result">Không tìm thấy sản phẩm nào.</p>
            )}
          </div>

          {/* 4. Phân trang */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                disabled={currentPage === 1} 
                onClick={() => { setCurrentPage(prev => prev - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              > ‹ </button>
              <span className="page-number">Trang {currentPage} / {totalPages}</span>
              <button 
                disabled={currentPage === totalPages} 
                onClick={() => { setCurrentPage(prev => prev + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              > › </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;