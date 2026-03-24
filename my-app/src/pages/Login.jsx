import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, loginWithGoogle, forgotPassword } from "./authService";

const API = "http://localhost:9999";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const checkRoleAndRedirect = async (userEmail) => {
    try {
      const res = await fetch(`${API}/users`);
      const users = await res.json();

      const normalizedEmail = String(userEmail || "").trim().toLowerCase();
      const found = users.find(
        (u) =>
          String(u.email || "").trim().toLowerCase() === normalizedEmail
      );

      if (!found) {
        setError("Tai khoan chua co trong he thong (bang users).");
        localStorage.removeItem("adminUserId");
        localStorage.removeItem("adminEmail");
        localStorage.removeItem("userId");
        return;
      }

      if (found && found.role === "admin") {
        localStorage.setItem("adminUserId", String(found.id));
        localStorage.setItem("adminEmail", String(found.email || ""));
        localStorage.removeItem("userId");
        localStorage.removeItem("userEmail");
        navigate("/admin");
        return;
      }

      localStorage.removeItem("adminUserId");
      localStorage.removeItem("adminEmail");
      localStorage.setItem("userId", String(found.id));
      localStorage.setItem("userEmail", String(found.email || ""));
      navigate("/");
    } catch (e) {
      console.error(e);
      localStorage.removeItem("adminUserId");
      localStorage.removeItem("adminEmail");
      localStorage.removeItem("userId");
      localStorage.removeItem("userEmail");
      navigate("/");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await login(email, password);
      setSuccess("Dang nhap thanh cong!");

      setTimeout(() => {
        // Với login email/password thì lấy email từ form để match bảng `users`.
        checkRoleAndRedirect(email);
      }, 1500);
    } catch {
      setError("Sai email hoac mat khau");
      localStorage.removeItem("adminUserId");
      localStorage.removeItem("adminEmail");
      localStorage.removeItem("userId");
      localStorage.removeItem("userEmail");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const cred = await loginWithGoogle();
      setSuccess("Dang nhap Google thanh cong!");

      setTimeout(() => {
        checkRoleAndRedirect(cred?.user?.email);
      }, 1500);
    } catch {
      setError("Khong the dang nhap Google");
      localStorage.removeItem("adminUserId");
      localStorage.removeItem("adminEmail");
      localStorage.removeItem("userId");
      localStorage.removeItem("userEmail");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Nhap email de reset mat khau");
      return;
    }

    try {
      await forgotPassword(email);
      setSuccess("Email reset mat khau da gui");
    } catch {
      setError("Khong the gui email reset");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.logo} onClick={() => navigate("/")}>
        <span>SuperMarket</span>
      </div>

      <div style={styles.card}>
        <h2 style={styles.title}>Dang nhap</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Mat khau"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />

          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}

          <button type="submit" style={styles.button}>
            Dang nhap
          </button>
        </form>

        <button onClick={handleGoogleLogin} style={styles.googleButton}>
          Dang nhap bang Google
        </button>

        <p style={styles.forgot} onClick={handleForgotPassword}>
          Quen mat khau?
        </p>

        <p style={styles.text}>
          Chua co tai khoan?
          <Link to="/register"> Dang ky</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#1e3c72,#2a5298)",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    color: "white",
    fontSize: "26px",
    fontWeight: "bold",
    marginBottom: "25px",
    cursor: "pointer",
  },
  card: {
    width: "360px",
    padding: "30px",
    borderRadius: "12px",
    background: "#fff",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#f0ad4e",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  googleButton: {
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    background: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  forgot: {
    marginTop: "10px",
    textAlign: "right",
    fontSize: "14px",
    color: "#2a5298",
    cursor: "pointer",
  },
  text: {
    marginTop: "15px",
    textAlign: "center",
    fontSize: "14px",
  },
  error: {
    color: "red",
    marginBottom: "10px",
    fontSize: "14px",
  },
  success: {
    color: "green",
    marginBottom: "10px",
    fontSize: "14px",
    fontWeight: "bold",
  },
};

export default Login;

