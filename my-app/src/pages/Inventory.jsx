import { useEffect, useState } from "react";

const API = "http://localhost:9999";

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  color: "#0f172a",
};

const cardsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "1rem",
};

const summaryCardStyle = {
  padding: "0.9rem 1rem",
  borderRadius: "16px",
  background:
    "linear-gradient(135deg, rgba(56, 189, 248, 0.12), rgba(16, 185, 129, 0.1))",
  border: "1px solid rgba(148, 163, 184, 0.7)",
};

const tableWrapperStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.96)",
  borderRadius: "18px",
  padding: "1.25rem 1.5rem",
  boxShadow: "0 16px 40px rgba(148, 163, 184, 0.3)",
  border: "1px solid rgba(148, 163, 184, 0.7)",
};

const filterRowStyle = {
  display: "flex",
  gap: "0.75rem",
  marginBottom: "0.9rem",
};

const selectStyle = {
  minWidth: "180px",
  padding: "0.5rem 0.75rem",
  borderRadius: "999px",
  border: "1px solid rgba(148, 163, 184, 0.9)",
  backgroundColor: "rgba(248, 250, 252, 0.95)",
  color: "#0f172a",
  fontSize: "0.85rem",
  outline: "none",
};

const searchInputStyle = {
  flex: 1,
  padding: "0.5rem 0.9rem",
  borderRadius: "999px",
  border: "1px solid rgba(148, 163, 184, 0.9)",
  backgroundColor: "rgba(248, 250, 252, 0.95)",
  color: "#0f172a",
  fontSize: "0.85rem",
  outline: "none",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "0.9rem",
  color: "#0f172a",
};

const thStyle = {
  textAlign: "left",
  padding: "0.6rem 0.75rem",
  borderBottom: "1px solid rgba(148, 163, 184, 0.6)",
  color: "rgb(71 85 105)",
  fontWeight: 600,
};

const tdStyle = {
  padding: "0.55rem 0.75rem",
  borderBottom: "1px solid rgba(226, 232, 240, 1)",
  color: "#111827",
};

function Inventory() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch(`${API}/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));

    fetch(`${API}/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  const totalStock = products.reduce(
    (sum, p) => sum + Number(p.stock || 0),
    0
  );

  const lowStockCount = products.filter((p) => Number(p.stock || 0) < 20).length;

  const getCategoryName = (categoryId) => {
    const found = categories.find(
      (c) => String(c.id) === String(categoryId)
    );
    return found ? found.name : "Không rõ";
  };

  const filteredProducts = products.filter((p) => {
    const matchCategory =
      selectedCategoryId === "all" ||
      String(p.categoryId) === String(selectedCategoryId);

    const name = (p.name || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    const matchSearch = name.includes(search);

    return matchCategory && matchSearch;
  });

  return (
    <div style={containerStyle}>
      <h2 style={{ fontSize: "1.1rem", color: "#0f172a" }}>Quản lý kho</h2>
      <div style={cardsGridStyle}>
        <div style={summaryCardStyle}>
          <div style={{ fontSize: "0.8rem", color: "rgb(148 163 184)" }}>
            Tổng số sản phẩm
          </div>
          <div style={{ fontSize: "1.2rem", fontWeight: 600 }}>
            {products.length}
          </div>
        </div>
        <div style={summaryCardStyle}>
          <div style={{ fontSize: "0.8rem", color: "rgb(148 163 184)" }}>
            Tổng số lượng tồn
          </div>
          <div style={{ fontSize: "1.2rem", fontWeight: 600 }}>
            {totalStock}
          </div>
        </div>
        <div style={summaryCardStyle}>
          <div style={{ fontSize: "0.8rem", color: "rgb(148 163 184)" }}>
            Sản phẩm sắp hết (&lt; 20)
          </div>
          <div style={{ fontSize: "1.2rem", fontWeight: 600 }}>
            {lowStockCount}
          </div>
        </div>
      </div>

      <div style={tableWrapperStyle}>
        <div style={filterRowStyle}>
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            style={selectStyle}
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm..."
            style={searchInputStyle}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Tên sản phẩm</th>
              <th style={thStyle}>Danh mục</th>
              <th style={thStyle}>Số lượng tồn</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.id}>
                <td style={tdStyle}>{p.id}</td>
                <td style={tdStyle}>{p.name}</td>
                <td style={tdStyle}>{getCategoryName(p.categoryId)}</td>
                <td
                  style={{
                    ...tdStyle,
                    color:
                      Number(p.stock || 0) < 20
                        ? "rgb(248 113 113)"
                        : "rgb(190 242 100)",
                    fontWeight: 600,
                  }}
                >
                  {p.stock}
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td style={tdStyle} colSpan={4}>
                  Không có dữ liệu kho.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Inventory;

