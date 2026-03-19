import { useEffect, useState } from "react";

const API = "http://localhost:9999";

const tableWrapperStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  borderRadius: "18px",
  padding: "1.25rem 1.5rem",
  boxShadow: "0 16px 40px rgba(148, 163, 184, 0.3)",
  border: "1px solid rgba(148, 163, 184, 0.7)",
  color: "#0f172a",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "0.9rem",
};

const thStyle = {
  textAlign: "left",
  padding: "0.6rem 0.75rem",
  borderBottom: "1px solid rgba(148, 163, 184, 0.6)",
  color: "rgb(209 213 219)",
  fontWeight: 600,
};

const tdStyle = {
  padding: "0.55rem 0.75rem",
  borderBottom: "1px solid rgba(226, 232, 240, 1)",
  color: "#111827",
};

const roleBadgeStyle = {
  borderRadius: "999px",
  padding: "0.1rem 0.6rem",
  fontSize: "0.78rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`${API}/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "#0f172a" }}>
        Quản lý người dùng
      </h2>
      <div style={tableWrapperStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Tên</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Vai trò</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={tdStyle}>{u.id}</td>
                <td style={tdStyle}>{u.name}</td>
                <td style={tdStyle}>{u.email}</td>
                <td style={tdStyle}>
                  <span
                    style={{
                      ...roleBadgeStyle,
                      backgroundColor:
                        u.role === "admin"
                          ? "rgba(248, 250, 252, 0.15)"
                          : "rgba(59, 130, 246, 0.15)",
                      color:
                        u.role === "admin" ? "rgb(251, 191, 36)" : "rgb(96, 165, 250)",
                      border:
                        u.role === "admin"
                          ? "1px solid rgba(251, 191, 36, 0.7)"
                          : "1px solid rgba(59, 130, 246, 0.7)",
                    }}
                  >
                    {u.role}
                  </span>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td style={tdStyle} colSpan={4}>
                  Không có người dùng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;

