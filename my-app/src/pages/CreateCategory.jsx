import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:9999";

function CreateCategory() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    slug: "",
  });

  useEffect(() => {
    fetch(`${API}/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = form.name.trim();
    let trimmedSlug = form.slug.trim();

    if (!trimmedName) {
      return;
    }

    if (!trimmedSlug) {
      trimmedSlug = trimmedName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    const nextId =
      categories.length > 0
        ? Math.max(
            ...categories.map((c) => {
              const numericId = Number(c.id);
              return Number.isNaN(numericId) ? 0 : numericId;
            })
          ) + 1
        : 1;

    const payload = {
      id: nextId,
      name: trimmedName,
      slug: trimmedSlug,
    };

    fetch(`${API}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(() => navigate("/"))
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

  const labelStyle = {
    display: "block",
    fontWeight: 600,
    marginBottom: "4px",
  };

  const buttonStyle = {
    padding: "10px 20px",
    border: "3px solid black",
    background: "white",
    cursor: "pointer",
    marginTop: "8px",
  };

  return (
    <div style={{ padding: "0 1rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Thêm danh mục mới</h2>
      <form style={formStyle} onSubmit={handleSubmit}>
        <label style={labelStyle}>
          Tên danh mục
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="VD: Hoa quả"
            style={inputStyle}
          />
        </label>
        <label style={labelStyle}>
          Slug (tự tạo nếu để trống)
          <input
            type="text"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            placeholder="vd: hoa-qua"
            style={inputStyle}
          />
        </label>
        <button type="submit" style={buttonStyle}>
          Thêm danh mục
        </button>
      </form>
    </div>
  );
}

export default CreateCategory;

