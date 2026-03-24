import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const Feedback = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);

  // Search + filter
  const [search, setSearch] = useState("");
  const [filterRating, setFilterRating] = useState(0);
  const [filterDate, setFilterDate] = useState("");

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true
  });

  const loadFeedbacks = async () => {
    try {
      const res = await fetch("http://localhost:9999/feedbacks");
      const data = await res.json();
      setFeedbacks(data.sort((a, b) => b.id - a.id));
    } catch (error) {
      console.error("Lỗi khi load feedback:", error);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !message.trim()) {
      Toast.fire({ icon: "warning", title: "Vui lòng nhập tên và nội dung feedback!" });
      return;
    }

    const newFeedback = {
      name,
      message,
      rating,
      date: new Date().toISOString().split("T")[0], // yyyy-mm-dd
      image: preview || null
    };

    try {
      await fetch("http://localhost:9999/feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFeedback)
      });

      loadFeedbacks();

      setName("");
      setMessage("");
      setRating(5);
      setImage(null);
      setPreview(null);
      Toast.fire({ icon: "success", title: "Đã gửi feedback!" });
    } catch (error) {
      console.error("Lỗi khi gửi feedback:", error);
      Toast.fire({ icon: "error", title: "Không thể gửi feedback" });
    }
  };

  const renderStars = (num) => "⭐".repeat(num);

  // FILTER LOGIC
  const filteredFeedbacks = feedbacks.filter(fb => {
    const matchSearch =
      fb.name.toLowerCase().includes(search.toLowerCase()) ||
      fb.message.toLowerCase().includes(search.toLowerCase());

    const matchRating =
      filterRating === 0 || fb.rating === filterRating;

    const matchDate =
      !filterDate || fb.date === filterDate;

    return matchSearch && matchRating && matchDate;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", padding: "40px 20px" }}>

      {/* FORM */}
      <div style={{
        maxWidth: "600px",
        margin: "auto",
        background: "white",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.15)"
      }}>
        <h2 style={{ textAlign: "center" }}>⭐ Gửi Feedback</h2>

        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
          <input
            type="text"
            placeholder="Tên của bạn"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "8px" }}
          />

          <textarea
            placeholder="Nội dung feedback"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "8px" }}
          />

          {/* Upload */}
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="imageUpload" style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              borderRadius: "8px",
              cursor: "pointer"
            }}>
              Chọn Ảnh
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>

          {preview && (
            <img src={preview} alt="preview" style={{ width: "120px", marginBottom: "15px" }} />
          )}

          {/* Rating */}
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            style={{ marginBottom: "15px", padding: "10px", borderRadius: "8px" }}
          >
            <option value="5">⭐⭐⭐⭐⭐</option>
            <option value="4">⭐⭐⭐⭐</option>
            <option value="3">⭐⭐⭐</option>
            <option value="2">⭐⭐</option>
            <option value="1">⭐</option>
          </select>

          <button type="submit" style={{
            width: "100%",
            padding: "12px",
            background: "#28a745",
            color: "white",
            borderRadius: "8px"
          }}>
            Gửi Feedback
          </button>
        </form>
      </div>

      {/* LIST */}
      <div style={{ maxWidth: "600px", margin: "40px auto 0" }}>
        <h3>📢 Feedback từ khách hàng</h3>

        {/* FILTER UI */}
        <div style={{ display: "flex", gap: "10px", margin: "20px 0", flexWrap: "wrap" }}>
          
          <input
            type="text"
            placeholder="🔍 Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, padding: "10px", borderRadius: "8px" }}
          />

          <select
            value={filterRating}
            onChange={(e) => setFilterRating(Number(e.target.value))}
            style={{ padding: "10px", borderRadius: "8px" }}
          >
            <option value="0">Tất cả</option>
            <option value="5">5 ⭐</option>
            <option value="4">4 ⭐</option>
            <option value="3">3 ⭐</option>
            <option value="2">2 ⭐</option>
            <option value="1">1 ⭐</option>
          </select>

          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            style={{ padding: "10px", borderRadius: "8px" }}
          />
        </div>

        {/* EMPTY */}
        {filteredFeedbacks.length === 0 && (
          <p style={{ color: "#777" }}>Không tìm thấy feedback.</p>
        )}

        {/* LIST ITEM */}
        {filteredFeedbacks.map(fb => (
          <div key={fb.id} style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "15px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>{fb.name}</strong>
              <span>{renderStars(fb.rating)}</span>
            </div>

            <p>{fb.message}</p>

            {fb.image && (
              <img
                src={fb.image}
                alt="feedback"
                style={{ width: "120px", borderRadius: "6px" }}
              />
            )}

            <small>{fb.date}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feedback;
