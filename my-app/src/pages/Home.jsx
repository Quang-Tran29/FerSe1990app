import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = "http://localhost:9999";

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
 
  // 1. Thêm state để lưu từ khóa tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const isAdmin = Boolean(localStorage.getItem("adminUserId"));

  const loadData = () => {
    fetch(`${API}/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data));

    fetch(`${API}/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    fetch(`${API}/products/${id}`, { method: "DELETE" })
      .then(() => {
        fetch(`${API}/products`)
          .then((res) => res.json())
          .then((data) => setProducts(data));
      })
      .catch((err) => console.error(err));
  };

  // 2. Cập nhật logic lọc: Lọc kết hợp cả Danh mục VÀ Từ khóa tìm kiếm
  const filteredProducts = products.filter((product) => {
    // Kiểm tra xem sản phẩm có khớp danh mục không
    const matchCategory = selectedCategoryId === "all" || String(product.categoryId) === String(selectedCategoryId);
    
    // Kiểm tra xem tên sản phẩm có chứa từ khóa không (không phân biệt hoa thường)
    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchCategory && matchSearch;
  });

  const wrapperStyle = {
    maxWidth: "1120px",
    margin: "0 auto",
    padding: "1.25rem 1.5rem",
    background:
      "radial-gradient(circle at top left, #fef3c7 0, #fefce8 40%, #e0f2fe 100%)",
    borderRadius: "24px",
    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.35)",
    border: "1px solid rgba(148, 163, 184, 0.6)",
  };

  const topControlsStyle = {
    display: "flex",
    gap: "16px",
    marginBottom: "1.75rem",
    flexWrap: "wrap",
    alignItems: "stretch",
  };

  const actionButtonStyle = {
    padding: "14px 22px",
    borderRadius: "999px",
    border: "1px solid rgba(15, 23, 42, 0.85)",
    background:
      "linear-gradient(135deg, #0f172a 0%, #111827 45%, #030712 100%)",
    color: "white",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.45)",
    cursor: "pointer",
    fontSize: "1rem",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "80px",
    fontWeight: "bold",
    transition: "transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s",
    whiteSpace: "nowrap",
  };

  const searchInputStyle = {
    padding: "14px 18px",
    borderRadius: "999px",
    border: "1px solid rgba(15, 23, 42, 0.5)",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    fontSize: "1rem",
    outline: "none",
    flex: 1,
    minWidth: "250px",
    boxShadow: "0 8px 20px rgba(148, 163, 184, 0.35)",
  };

  const mainContentStyle = {
    display: "flex",
    gap: "24px",
  };

  const sidebarStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    minWidth: "150px",
  };

  const categoryButtonStyle = {
    padding: "10px 14px",
    borderRadius: "999px",
    border: "1px solid rgba(15, 23, 42, 0.75)",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    cursor: "pointer",
    fontSize: "0.95rem",
    textAlign: "left",
    fontWeight: 500,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 4px 12px rgba(148, 163, 184, 0.4)",
    transition: "transform 0.12s ease, box-shadow 0.12s ease, background-color 0.12s",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gridAutoRows: "auto",
    gap: "18px",
  };

  const cardStyle = {
    borderRadius: "20px",
    minHeight: "240px",
    padding: "1rem 1rem 0.85rem",
    background: "rgba(255, 255, 255, 0.98)",
    boxShadow: "0 14px 30px rgba(15, 23, 42, 0.25)",
    border: "1px solid rgba(148, 163, 184, 0.5)",
    cursor: "pointer",
    transition: "transform 0.15s ease, box-shadow 0.15s ease, translate 0.15s",
  };

  const circleStyle = {
    width: "120px",
    height: "120px",
    border: "2px solid rgba(15, 23, 42, 0.85)",
    borderRadius: "50%",
    marginBottom: "1rem",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1rem auto",
  };

  const deleteButtonStyle = {
    padding: "6px 12px",
    borderRadius: "999px",
    border: "1px solid rgba(220, 38, 38, 0.85)",
    background: "rgba(248, 250, 252, 0.9)",
    cursor: "pointer",
    fontSize: "0.9rem",
    marginTop: "8px",
    alignSelf: "flex-end",
    color: "#b91c1c",
  };

  const modalOverlayStyle = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    padding: "1rem",
  };

  const modalContentStyle = {
    width: "100%",
    maxWidth: "560px",
    backgroundColor: "white",
    borderRadius: "24px",
    boxShadow: "0 20px 45px rgba(15, 23, 42, 0.45)",
    padding: "1.75rem 2rem",
    position: "relative",
    border: "1px solid rgba(148, 163, 184, 0.8)",
    display: "flex",
    gap: "1.5rem",
  };

  const closeButtonStyle = {
    position: "absolute",
    top: "12px",
    right: "14px",
    borderRadius: "999px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "1.4rem",
    lineHeight: 1,
    padding: "4px",
  };

  const ProductCard = ({ product, onDelete, onSelect }) => (
    <div
      style={{ ...cardStyle, display: "flex", flexDirection: "column" }}
      onClick={() => onSelect(product)}
    >
      <div style={circleStyle}>
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : null}
      </div>
      <div
        style={{
          textAlign: "center",
          flex: 1,
          padding: "0.25rem 0.25rem 0.6rem",
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: "4px" }}>
          {product.name || "Không rõ tên"}
        </div>
        <div style={{ marginBottom: "4px", color: "#16a34a", fontWeight: 600 }}>
          {product.price !== undefined && product.price !== null
            ? `${Number(product.price).toLocaleString()} VNĐ`
            : "Chưa có giá"}
        </div>
        {product.description && (
          <div
            style={{
              fontSize: "0.9rem",
              textAlign: "left",
              color: "#4b5563",
            }}
          >
            {product.description}
          </div>
        )}
      </div>
      {isAdmin && (
        <button
          type="button"
          style={deleteButtonStyle}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(product.id);
          }}
        >
          Xóa
        </button>
      )}
    </div>
  );

  return (
    <div style={wrapperStyle}>
      <div style={topControlsStyle}>
        {isAdmin && (
          <>
            <Link to="/admin/create" style={actionButtonStyle}>
              Thêm mới sản phẩm
            </Link>
            <Link to="/admin/create-category" style={actionButtonStyle}>
              Thêm mới danh mục
            </Link>
          </>
        )}

        <input 
          type="text" 
          placeholder="Search........" 
          style={searchInputStyle}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={mainContentStyle}>
        <div style={sidebarStyle}>
          <button
            onClick={() => setSelectedCategoryId("all")}
            style={{
              ...categoryButtonStyle,
              backgroundColor: selectedCategoryId === "all" ? "#e0e0e0" : "white",
            }}
          >
            All
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategoryId(category.id)}
              style={{
                ...categoryButtonStyle,
                backgroundColor:
                  String(selectedCategoryId) === String(category.id) ? "#e0e0e0" : "white",
              }}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }}>
          <div style={gridStyle}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={handleDelete}
                onSelect={setSelectedProduct}
              />
            ))}

            {filteredProducts.length === 0 && (
              <div style={{ gridColumn: "span 3", textAlign: "center", padding: "2rem" }}>
                Không tìm thấy sản phẩm nào phù hợp.
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedProduct && (
        <div
          style={modalOverlayStyle}
          onClick={() => setSelectedProduct(null)}
        >
          <div
            style={modalContentStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              style={closeButtonStyle}
              onClick={() => setSelectedProduct(null)}
            >
              ×
            </button>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ ...circleStyle, margin: 0 }}>
                {selectedProduct.image && (
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                )}
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ margin: "0 0 6px", fontSize: "1.4rem" }}>
                {selectedProduct.name}
              </h3>
              <div style={{ marginBottom: "8px", fontWeight: 600, color: "#0f172a" }}>
                {Number(selectedProduct.price).toLocaleString()} VNĐ
              </div>
              <div style={{ marginBottom: "6px", fontSize: "0.95rem", color: "#374151" }}>
                Số lượng trong kho:{" "}
                <span style={{ fontWeight: 600 }}>{selectedProduct.stock}</span>
              </div>
              <div style={{ fontSize: "0.95rem", lineHeight: 1.5, color: "#4b5563" }}>
                {selectedProduct.description}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;