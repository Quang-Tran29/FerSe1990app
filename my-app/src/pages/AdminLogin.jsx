import { useEffect, useState } from "react";

const API = "http://localhost:9999";

const pageStyle = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "1rem",
  background:
    "radial-gradient(circle at top left, #fef3c7 0, #fefce8 40%, #e0f2fe 100%)",
};

const cardStyle = {
  width: "100%",
  maxWidth: "420px",
  background: "rgba(255, 255, 255, 0.96)",
  borderRadius: "20px",
  border: "1px solid rgba(148, 163, 184, 0.7)",
  boxShadow: "0 18px 45px rgba(15, 23, 42, 0.18)",
  padding: "1.5rem 1.5rem",
};

const titleStyle = {
  fontSize: "1.3rem",
  fontWeight: 700,
  marginBottom: "0.35rem",
  color: "#0f172a",
};

const subtitleStyle = {
  fontSize: "0.95rem",
  color: "rgb(100 116 139)",
  marginBottom: "1.25rem",
};

const labelStyle = {
  display: "block",
  fontWeight: 600,
  marginBottom: "0.35rem",
  color: "#0f172a",
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "999px",
  border: "1px solid rgba(148, 163, 184, 0.9)",
  outline: "none",
  marginBottom: "0.9rem",
};

const buttonStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "999px",
  border: "1px solid rgba(15, 23, 42, 0.85)",
  background: "linear-gradient(135deg, #0f172a 0%, #111827 45%, #030712 100%)",
  color: "white",
  cursor: "pointer",
  fontWeight: 700,
  marginTop: "0.35rem",
};

const errorStyle = {
  background: "rgba(220, 38, 38, 0.12)",
  border: "1px solid rgba(220, 38, 38, 0.35)",
  color: "#b91c1c",
  borderRadius: "14px",
  padding: "0.65rem 0.8rem",
  marginTop: "0.75rem",
  fontSize: "0.9rem",
};

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError("");
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/users`);
      const users = await res.json();

      const normalizedEmail = (email || "").trim().toLowerCase();
      const found = users.find(
        (u) =>
          String(u.email || "").trim().toLowerCase() === normalizedEmail &&
          String(u.password || "") === String(password || "") &&
          u.role === "admin"
      );

      if (!found) {
        setError("Email hoặc mật khẩu không đúng (hoặc không phải admin).");
        setLoading(false);
        return;
      }

      // Lưu session đơn giản (client-side) để chặn route admin.
      localStorage.setItem("adminUserId", String(found.id));
      localStorage.setItem("adminEmail", String(found.email || ""));

      // Tránh trường hợp đang ở route "/" mà RequireAdmin không re-check lại.
      // Reload để RequireAdmin mount lại và cập nhật trạng thái auth.
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      setError("Lỗi kết nối API, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={titleStyle}>Đăng nhập Admin</div>
        <div style={subtitleStyle}>Chỉ tài khoản có role là `admin` mới vào được.</div>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            style={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@gmail.com"
            required
          />

          <label style={labelStyle}>Mật khẩu</label>
          <input
            type="password"
            style={inputStyle}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? "Đang kiểm tra..." : "Vào trang quản trị"}
          </button>

          {error && <div style={errorStyle}>{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;

