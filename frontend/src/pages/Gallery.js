import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
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

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Vui lòng chọn file!");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    try {
      await axios.post("http://localhost:8000/upload", formData);
      alert("Tải ảnh thành công!");
      setTitle("");
      setFile(null);
      loadPhotos();
    } catch (err) {
      alert("Lỗi khi tải ảnh!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn muốn xóa ảnh này?")) {
      await axios.delete(`http://localhost:8000/photos/${id}`);
      loadPhotos();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    alert("Đã đăng xuất!");
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>📸 My Gallery - {user || "Guest"}</h1>

      {user ? (
        <div style={{ marginBottom: "30px" }}>
          <button onClick={handleLogout} style={{ marginBottom: "20px" }}>
            Đăng xuất
          </button>
          <br />
          <form
            onSubmit={handleUpload}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              borderRadius: "10px",
              display: "inline-block",
            }}
          >
            <h3>Tải ảnh mới</h3>
            <input
              type="text"
              placeholder="Tiêu đề"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <br />
            <br />
            <input
              type="file"
              required
              onChange={(e) => setFile(e.target.files[0])}
            />
            <br />
            <br />
            <button type="submit">Upload ngay</button>
          </form>
        </div>
      ) : (
        <nav>
          <Link to="/login">Đăng nhập</Link> |{" "}
          <Link to="/register">Đăng ký</Link>
        </nav>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {photos.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #eee",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            <img
              src={p.image_url}
              alt={p.title}
              style={{ width: "100%", height: "200px", objectFit: "cover" }}
            />
            <h4>{p.title}</h4>
            {user && (
              <button
                onClick={() => handleDelete(p.id)}
                style={{ color: "red" }}
              >
                Xóa
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
