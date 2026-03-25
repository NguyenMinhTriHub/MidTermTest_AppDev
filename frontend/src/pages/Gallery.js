import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const user = localStorage.getItem("user");

  const loadPhotos = async () => {
    try {
      const res = await axios.get("http://localhost:8000/photos");
      setPhotos(res.data);
    } catch (err) {
      console.error("Lỗi tải ảnh");
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn muốn xóa ảnh này?")) {
      await axios.delete(`http://localhost:8000/photos/${id}`);
      loadPhotos();
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>📸 My Gallery - 23710141</h1>
      <nav style={{ marginBottom: "20px" }}>
        {user ? (
          <div>
            Chào, <b>{user}</b> |{" "}
            <button onClick={handleLogout} style={{ cursor: "pointer" }}>
              Đăng xuất
            </button>
          </div>
        ) : (
          <div>
            <Link to="/login">Đăng nhập</Link> |{" "}
            <Link to="/register">Đăng ký</Link>
          </div>
        )}
      </nav>
      <hr />
      <div className="gallery-grid">
        {photos.map((p) => (
          <div key={p.id} className="photo-card">
            <img
              src={p.url}
              alt={p.title}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            <h3>{p.title}</h3>
            {user && (
              <button onClick={() => handleDelete(p.id)} className="btn-del">
                Xóa ảnh
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
