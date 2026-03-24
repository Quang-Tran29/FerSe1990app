import { Navigate } from "react-router-dom";

function RequireHome({ children }) {
  const adminUserId = localStorage.getItem("adminUserId");
  const userId = localStorage.getItem("userId");

  // Nếu đang login admin thì đưa qua khu admin.
  if (adminUserId) {
    return <Navigate to="/admin" replace />;
  }

  // Chỉ cho vào home bình thường khi có user session.
  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RequireHome;

