import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Swal from "sweetalert2";

const STORAGE_KEY = "profile_data";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState("");
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setAvatar(data.avatar || "");
        setFullName(data.fullName || "");
        setDob(data.dob || "");
        setAddress(data.address || "");
      } catch {}
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        navigate("/login");
      } else {
        if (!fullName) {
          setFullName(currentUser.displayName || "");
        }
        if (!avatar && currentUser.photoURL) {
          setAvatar(currentUser.photoURL);
        }
      }
    });
    return () => unsub();
  }, [navigate, fullName, avatar]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = String(reader.result || "");
      setAvatar(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const data = { avatar, fullName, dob, address };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    try {
      const res = await fetch(`http://localhost:9999/users?email=${user.email}`);
      const usersInfo = await res.json();

      if (usersInfo.length > 0) {
        const userId = usersInfo[0].id;
        await fetch(`http://localhost:9999/users/${userId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
             name: fullName,
             avatar: avatar,
             dob: dob,
             address: address
          })
        });
      } else {
        const userPayload = {
          id: String(Date.now()),
          email: user.email,
          name: fullName,
          avatar: avatar,
          dob: dob,
          address: address,
          role: "customer"
        };
        await fetch(`http://localhost:9999/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userPayload)
        });
      }
      
      Swal.fire({
        icon: "success",
        title: "Cập nhật thành công!",
        text: "Hồ sơ của bạn đã được cập nhật.",
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Lỗi cập nhật profile:", error);
      Swal.fire({ icon: "error", title: "Opps! Có lỗi xảy ra." });
    }
  };

  if (!user) return null;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Hồ sơ cá nhân</h2>

        <div style={styles.avatarRow}>
          <div style={styles.avatarWrap}>
            {avatar ? (
              <img src={avatar} alt="avatar" style={styles.avatarImg} />
            ) : (
              <div style={styles.avatarFallback}>
                {(fullName || user.email || "U").slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>
          <label style={styles.uploadBtn}>
            Chỉnh ảnh đại diện
            <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />
          </label>
        </div>

        <div style={styles.form}>
          <label style={styles.label}>Tên</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nhập tên"
            style={styles.input}
          />

          <label style={styles.label}>Ngày tháng năm sinh</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            style={styles.input}
          />

          <label style={styles.label}>Địa chỉ</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Nhập địa chỉ"
            style={styles.input}
          />

          <button onClick={handleSave} style={styles.saveBtn}>
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #e9f5ff, #f7f7ff)",
    padding: "20px"
  },
  card: {
    width: "520px",
    background: "#fff",
    borderRadius: "16px",
    padding: "28px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
    border: "1px solid #eef2f7"
  },
  title: {
    textAlign: "center",
    marginBottom: "20px"
  },
  avatarRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "20px"
  },
  avatarWrap: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#e6f0ff",
    border: "2px solid #dbe7ff"
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  avatarFallback: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#2b59ff"
  },
  uploadBtn: {
    background: "#2563eb",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  label: {
    fontWeight: "bold",
    marginTop: "8px"
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #d1d5db"
  },
  saveBtn: {
    marginTop: "16px",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#16a34a",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer"
  }
};

export default Profile;
