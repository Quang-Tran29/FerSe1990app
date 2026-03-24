import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import "./AdminDashboard.css";

const API_URL = "http://localhost:9999";

const initialFormData = {
  name: "",
  price: "",
  stock: "",
  categoryId: "1",
  image: "",
  description: "",
  manufactureDate: "",
  expiryDate: "",
  origin: ""
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      if (user.email !== "admin@gmail.com") {
        Swal.fire({
          icon: "warning",
          title: "Khong co quyen truy cap",
          text: "Trang nay chi danh cho tai khoan admin."
        }).then(() => {
          navigate("/");
        });
      }
    });

    return () => unsub();
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, ordersRes] = await Promise.all([
        fetch(`${API_URL}/products`),
        fetch(`${API_URL}/categories`),
        fetch(`${API_URL}/orders`)
      ]);

      const [productsData, categoriesData, ordersData] = await Promise.all([
        productsRes.json(),
        categoriesRes.json(),
        ordersRes.json()
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
      setOrders(ordersData);
    } catch (error) {
      console.error("Loi load admin dashboard:", error);
    }
  };

  const dashboardData = useMemo(() => {
    const visibleProducts = products.filter((product) => !product.isHidden).length;
    const hiddenProducts = products.filter((product) => product.isHidden).length;
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

    return {
      totalProducts: products.length,
      visibleProducts,
      hiddenProducts,
      totalOrders: orders.length,
      totalRevenue
    };
  }, [orders, products]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateProduct = async (event) => {
    event.preventDefault();

    if (
      !formData.name ||
      !formData.price ||
      !formData.stock ||
      !formData.image ||
      !formData.description ||
      !formData.manufactureDate ||
      !formData.expiryDate ||
      !formData.origin
    ) {
      Swal.fire({ icon: "warning", title: "Vui long dien day du thong tin san pham" });
      return;
    }

    const nextId = String(
      products.reduce((maxId, product) => Math.max(maxId, Number(product.id)), 0) + 1
    );

    const payload = {
      id: nextId,
      name: formData.name,
      price: Number(formData.price),
      stock: Number(formData.stock),
      categoryId: Number(formData.categoryId),
      image: formData.image,
      description: formData.description,
      manufactureDate: formData.manufactureDate,
      expiryDate: formData.expiryDate,
      origin: formData.origin,
      isHidden: false
    };

    try {
      await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      setFormData(initialFormData);
      await fetchData();
      Swal.fire({ icon: "success", title: "Da them san pham moi" });
    } catch (error) {
      console.error("Loi them san pham:", error);
      Swal.fire({ icon: "error", title: "Khong the them san pham" });
    }
  };

  const handleToggleHidden = async (product) => {
    try {
      await fetch(`${API_URL}/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...product, isHidden: !product.isHidden })
      });

      await fetchData();
      Swal.fire({
        icon: "success",
        title: product.isHidden ? "Da hien san pham" : "Da an san pham",
        timer: 1400,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Loi an/hien san pham:", error);
      Swal.fire({ icon: "error", title: "Khong the cap nhat trang thai san pham" });
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <div className="admin-heading">
          <div>
            <span className="admin-tag">Admin</span>
            <h1>Dashboard quan tri san pham</h1>
            <p>Them san pham moi, an san pham va xem nhanh tinh hinh ban hang.</p>
          </div>
        </div>

        <section className="admin-stats">
          <article className="stat-card">
            <span>Tong san pham</span>
            <strong>{dashboardData.totalProducts}</strong>
          </article>
          <article className="stat-card">
            <span>Dang hien thi</span>
            <strong>{dashboardData.visibleProducts}</strong>
          </article>
          <article className="stat-card">
            <span>Dang an</span>
            <strong>{dashboardData.hiddenProducts}</strong>
          </article>
          <article className="stat-card">
            <span>Don hang</span>
            <strong>{dashboardData.totalOrders}</strong>
          </article>
          <article className="stat-card wide">
            <span>Doanh thu tam tinh</span>
            <strong>{dashboardData.totalRevenue.toLocaleString("vi-VN")} d</strong>
          </article>
        </section>

        <div className="admin-layout">
          <form className="admin-form" onSubmit={handleCreateProduct}>
            <h2>Them san pham moi</h2>
            <input name="name" placeholder="Ten san pham" value={formData.name} onChange={handleChange} />
            <div className="admin-form-grid">
              <input
                name="price"
                type="number"
                placeholder="Gia ban"
                value={formData.price}
                onChange={handleChange}
              />
              <input
                name="stock"
                type="number"
                placeholder="So luong ton"
                value={formData.stock}
                onChange={handleChange}
              />
            </div>
            <select name="categoryId" value={formData.categoryId} onChange={handleChange}>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input
              name="image"
              placeholder="Duong dan anh, vi du /images/tao.jpg"
              value={formData.image}
              onChange={handleChange}
            />
            <textarea
              name="description"
              rows="4"
              placeholder="Mo ta san pham"
              value={formData.description}
              onChange={handleChange}
            />
            <div className="admin-form-grid">
              <label>
                Ngay san xuat
                <input
                  name="manufactureDate"
                  type="date"
                  value={formData.manufactureDate}
                  onChange={handleChange}
                />
              </label>
              <label>
                Han su dung
                <input
                  name="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={handleChange}
                />
              </label>
            </div>
            <input
              name="origin"
              placeholder="Noi san xuat"
              value={formData.origin}
              onChange={handleChange}
            />
            <button type="submit">Them san pham</button>
          </form>

          <section className="admin-products">
            <div className="admin-products-head">
              <h2>Quan ly san pham</h2>
              <button type="button" onClick={fetchData}>
                Tai lai
              </button>
            </div>
            <div className="admin-product-list">
              {products.map((product) => (
                <article className="admin-product-row" key={product.id}>
                  <img src={product.image} alt={product.name} />
                  <div className="admin-product-copy">
                    <h3>{product.name}</h3>
                    <p>{product.origin || "Dang cap nhat noi san xuat"}</p>
                    <span>
                      {product.price.toLocaleString("vi-VN")} d • Ton: {product.stock}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={product.isHidden ? "show-btn" : "hide-btn"}
                    onClick={() => handleToggleHidden(product)}
                  >
                    {product.isHidden ? "Hien san pham" : "An san pham"}
                  </button>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
