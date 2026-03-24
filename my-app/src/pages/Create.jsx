import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:9999";

function Create() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    image: "",
    name: "",
    categoryId: "",
    price: "",
    stock: "",
    description: "",
  });

  useEffect(() => {
    fetch(`${API}/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data));

    fetch(`${API}/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nextId =
      products.length > 0
        ? Math.max(
            ...products.map((p) => {
              const numericId = Number(p.id);
              return Number.isNaN(numericId) ? 0 : numericId;
            })
          ) + 1
        : 1;

    const payload = {
      id: nextId,
      image: form.image.trim() || null,
      name: form.name.trim(),
      categoryId: Number(form.categoryId),
      price: Number(form.price),
      stock: Number(form.stock),
      description: form.description.trim(),
    };

    fetch(`${API}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(() => navigate("/admin"))
      .catch((err) => console.error(err));
  };

  const formStyle = {
    maxWidth: "480px",
    margin: "2rem auto",
    padding: "1.5rem",
    border: "3px solid black",
  };
  const inputStyle = {
    width: "100%",
    padding: "8px",
    marginTop: "4px",
    marginBottom: "12px",
    border: "2px solid #333",
    boxSizing: "border-box",
  };
  const labelStyle = { display: "block", fontWeight: 600, marginBottom: "4px" };
  const buttonStyle = {
    padding: "10px 20px",
    border: "3px solid black",
    background: "white",
    cursor: "pointer",
    marginTop: "8px",
  };

  return (
    <div style={{ padding: "0 1rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Thêm sản phẩm mới</h2>
      <form style={formStyle} onSubmit={handleSubmit}>
        <label style={labelStyle}>
          Link ảnh
          <input
            type="url"
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="https://..."
            style={inputStyle}
          />
        </label>
        <label style={labelStyle}>
          Tên sản phẩm
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="VD: Táo Fuji"
            style={inputStyle}
          />
        </label>
        <label style={labelStyle}>
          Loại sản phẩm
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">-- Chọn loại --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} (id {c.id})
              </option>
            ))}
          </select>
        </label>
        <label style={labelStyle}>
          Giá
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
            placeholder="45000"
            style={inputStyle}
          />
        </label>
        <label style={labelStyle}>
          Số lượng thêm
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            required
            min="0"
            placeholder="100"
            style={inputStyle}
          />
        </label>
        <label style={labelStyle}>
          Mô tả
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            placeholder="Mô tả sản phẩm..."
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </label>
        <button type="submit" style={buttonStyle}>
          Thêm sản phẩm
        </button>
      </form>
    </div>
  );
}

export default Create;
