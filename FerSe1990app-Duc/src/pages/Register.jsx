import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from ".pages/authService";
import { FaShoppingCart } from "react-icons/fa";

const Register = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Mật khẩu không khớp");
            return;
        }

        try {

            await register(email, password);

            setSuccess("Đăng ký thành công!");

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch {
            setError("Không thể đăng ký tài khoản");
        }

    };

    return (

        <div style={styles.container}>

            <div
                style={styles.logo}
                onClick={() => navigate("/")}
            >
                <FaShoppingCart size={28} style={{ marginRight: "8px" }} />
                <span>SuperMarket</span>
            </div>

            <div style={styles.card}>

                <h2>Đăng ký</h2>

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

                    <input
                        type="password"
                        placeholder="Nhập lại mật khẩu"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={styles.input}
                    />

                    {error && <p style={styles.error}>{error}</p>}
                    {success && <p style={styles.success}>{success}</p>}

                    <button type="submit" style={styles.button}>
                        Đăng ký
                    </button>

                    <p style={styles.text}>
                        Đã có tài khoản?
                        <Link to="/login"> Đăng nhập</Link>
                    </p>

                </form>

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

    error: {
        color: "red",
        marginBottom: "10px"
    },

    success: {
        color: "green",
        marginBottom: "10px",
        fontWeight: "bold"
    },

    text: {
        marginTop: "15px",
        textAlign: "center"
    }

};

export default Register;