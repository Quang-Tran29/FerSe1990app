import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import AdminLogin from "./AdminLogin";

const API = "http://localhost:9999";

function RequireAdmin({ children }) {
  const [status, setStatus] = useState("checking"); // checking | ok | unauth

  useEffect(() => {
    const userId = localStorage.getItem("adminUserId");
    if (!userId) {
      setStatus("unauth");
      return;
    }

    const check = async () => {
      try {
        const res = await fetch(`${API}/users/${userId}`);
        const user = await res.json();
        if (user && user.role === "admin") {
          setStatus("ok");
        } else {
          setStatus("unauth");
        }
      } catch (e) {
        console.error(e);
        setStatus("unauth");
      }
    };

    check();
  }, []);

  if (status === "checking") {
    return <div style={{ padding: "2rem", color: "#0f172a" }}>Đang tải...</div>;
  }

  if (status !== "ok") {
    return <AdminLogin />;
  }

  return children;
}

export default RequireAdmin;

