import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/register", form);
      alert("Đăng ký thành công!");
      navigate("/login");
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.detail || "Thất bại"));
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleRegister}>
        <h2>Đăng ký mới</h2>
        <input
          type="text"
          placeholder="Username"
          required
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email (ví dụ: tri@edu.vn)"
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit">Tạo tài khoản</button>
      </form>
    </div>
  );
};
export default Register;
