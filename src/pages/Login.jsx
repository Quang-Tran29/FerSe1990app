import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login, loginWithGoogle, forgotPassword, register } from "./authService";
import { FaShoppingCart, FaGoogle } from "react-icons/fa";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {

            await login(email, password);

            setSuccess("Đăng nhập thành công!");

            setTimeout(() => {
                navigate("/");
            }, 1500);

        } catch (error) {
            try {
                const res = await fetch("http://localhost:9999/users?email=" + email);
                const users = await res.json();
                if (users.length > 0 && String(users[0].password) === String(password)) {
                    await register(email, password);
                    setSuccess("Tài khoản đã được đồng bộ với hệ thống. Đăng nhập thành công!");
                    setTimeout(() => {
                        navigate("/");
                    }, 1500);
                    return;
                }
            } catch (syncErr) {
                console.error("Lỗi đồng bộ tài khoản local:", syncErr);
            }
            setError("Sai email hoặc mật khẩu");
        }
    };

    const handleGoogleLogin = async () => {

        try {

            await loginWithGoogle();

            setSuccess("Đăng nhập Google thành công!");

            setTimeout(() => {
                navigate("/");
            }, 1500);

        } catch {
            setError("Không thể đăng nhập Google");
        }

    };

    const handleForgotPassword = async () => {

        if (!email) {
            setError("Nhập email để reset mật khẩu");
            return;
        }

        try {

            await forgotPassword(email);

            setSuccess("Email reset mật khẩu đã gửi");

        } catch {
            setError("Không thể gửi email reset");
        }

    };

    return (

        <div style={styles.container}>

            {/* LOGO */}
            <div
                style={styles.logo}
                onClick={() => navigate("/")}
            >
                <FaShoppingCart size={30} style={{ marginRight: "8px" }} />
                <span>SuperMarket</span>
            </div>

            <div style={styles.card}>

                <h2 style={styles.title}>Đăng nhập</h2>

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
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />

                    {error && <p style={styles.error}>{error}</p>}
                    {success && <p style={styles.success}>{success}</p>}

                    <button type="submit" style={styles.button}>
                        Đăng nhập
                    </button>

                </form>

                <button
                    onClick={handleGoogleLogin}
                    style={styles.googleButton}
                >
                    <FaGoogle style={{ marginRight: "8px" }} />
                    Đăng nhập bằng Google
                </button>

                <p style={styles.forgot} onClick={handleForgotPassword}>
                    Quên mật khẩu?
                </p>

                <p style={styles.text}>
                    Chưa có tài khoản?
                    <Link to="/register"> Đăng ký</Link>
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
        background: "linear-gradient(135deg,#1e3c72,#2a5298)"
    },

    logo: {
        display: "flex",
        alignItems: "center",
        color: "white",
        fontSize: "26px",
        fontWeight: "bold",
        marginBottom: "25px",
        cursor: "pointer"
    },

    card: {
        width: "360px",
        padding: "30px",
        borderRadius: "12px",
        background: "#fff",
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
    },

    title: {
        textAlign: "center",
        marginBottom: "20px"
    },

    input: {
        width: "100%",
        padding: "10px",
        marginBottom: "12px",
        borderRadius: "8px",
        border: "1px solid #ccc"
    },

    button: {
        width: "100%",
        padding: "10px",
        borderRadius: "8px",
        border: "none",
        background: "#f0ad4e",
        color: "#fff",
        fontWeight: "bold",
        cursor: "pointer"
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
        justifyContent: "center"
    },

    forgot: {
        marginTop: "10px",
        textAlign: "right",
        fontSize: "14px",
        color: "#2a5298",
        cursor: "pointer"
    },

    text: {
        marginTop: "15px",
        textAlign: "center",
        fontSize: "14px"
    },

    error: {
        color: "red",
        marginBottom: "10px",
        fontSize: "14px"
    },

    success: {
        color: "green",
        marginBottom: "10px",
        fontSize: "14px",
        fontWeight: "bold"
    }

};

export default Login;