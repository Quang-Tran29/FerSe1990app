import { NavLink, Outlet } from "react-router-dom";

const layoutStyle = {
  minHeight: "100vh",
  display: "flex",
  background:
    "radial-gradient(circle at top left, #fef3c7 0, #fefce8 40%, #e0f2fe 100%)",
  color: "#0f172a",
};

const sidebarStyle = {
  width: "240px",
  padding: "1.5rem 1.25rem",
  borderRight: "1px solid rgba(148, 163, 184, 0.4)",
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
  backgroundColor: "rgba(248, 250, 252, 0.9)",
  backdropFilter: "blur(10px)",
  boxShadow: "6px 0 18px rgba(148, 163, 184, 0.35)",
};

const logoStyle = {
  fontSize: "1.25rem",
  fontWeight: 700,
  letterSpacing: "0.05em",
};

const navStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
};

const navItemBase = {
  padding: "0.6rem 0.9rem",
  borderRadius: "0.75rem",
  color: "#0f172a",
  textDecoration: "none",
  fontSize: "0.95rem",
  display: "block",
};

const contentWrapperStyle = {
  flex: 1,
  background: "transparent",
  padding: "1.5rem 1.75rem",
  overflow: "auto",
};

const headerStyle = {
  marginBottom: "1.5rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const titleStyle = {
  fontSize: "1.4rem",
  fontWeight: 600,
  color: "#0f172a",
};

const subtitleStyle = {
  fontSize: "0.9rem",
  color: "rgb(100 116 139)",
};

const logoutButtonStyle = {
  padding: "10px 14px",
  borderRadius: "999px",
  border: "1px solid rgba(15, 23, 42, 0.85)",
  background: "white",
  color: "#0f172a",
  cursor: "pointer",
  fontWeight: 700,
  boxShadow: "0 10px 25px rgba(15, 23, 42, 0.12)",
};

function AdminLayout() {
  const handleLogout = () => {
    localStorage.removeItem("adminUserId");
    localStorage.removeItem("adminEmail");
    window.location.href = "/login";
  };

  return (
    <div style={layoutStyle}>
      <aside style={sidebarStyle}>
        <div style={logoStyle}>SuperMarket Admin</div>
        <nav style={navStyle}>
          <NavLink
            to="/admin"
            end
            style={({ isActive }) => ({
              ...navItemBase,
              backgroundColor: isActive ? "rgba(248, 250, 252, 0.12)" : "transparent",
              border: isActive
                ? "1px solid rgba(248, 250, 252, 0.35)"
                : "1px solid transparent",
            })}
          >
            Quản lý sản phẩm
          </NavLink>
          <NavLink
            to="/admin/users"
            style={({ isActive }) => ({
              ...navItemBase,
              backgroundColor: isActive ? "rgba(248, 250, 252, 0.12)" : "transparent",
              border: isActive
                ? "1px solid rgba(248, 250, 252, 0.35)"
                : "1px solid transparent",
            })}
          >
            Quản lý người dùng
          </NavLink>
          <NavLink
            to="/admin/inventory"
            style={({ isActive }) => ({
              ...navItemBase,
              backgroundColor: isActive ? "rgba(248, 250, 252, 0.12)" : "transparent",
              border: isActive
                ? "1px solid rgba(248, 250, 252, 0.35)"
                : "1px solid transparent",
            })}
          >
            Quản lý kho
          </NavLink>
          <NavLink
            to="/admin/orders"
            style={({ isActive }) => ({
              ...navItemBase,
              backgroundColor: isActive ? "rgba(248, 250, 252, 0.12)" : "transparent",
              border: isActive
                ? "1px solid rgba(248, 250, 252, 0.35)"
                : "1px solid transparent",
            })}
          >
            Quản lý đơn hàng
          </NavLink>
        </nav>
      </aside>
      <main style={contentWrapperStyle}>
        <header style={headerStyle}>
          <div>
            <div style={titleStyle}>Bảng điều khiển quản trị</div>
            <div style={subtitleStyle}>
              Quản lý sản phẩm, người dùng, tồn kho và đơn hàng của cửa hàng.
            </div>
          </div>
          <button type="button" style={logoutButtonStyle} onClick={handleLogout}>
            Đăng xuất
          </button>
        </header>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;

