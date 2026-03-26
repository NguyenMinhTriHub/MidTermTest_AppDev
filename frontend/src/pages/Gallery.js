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
    const res = await axios.get("http://localhost:8000/photos");
    setPhotos(res.data);
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    await axios.post("http://localhost:8000/upload", formData);
    setTitle("");
    setFile(null);
    loadPhotos();
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>📸 My Gallery - {user || "Guest"}</h1>
      {user ? (
        <div style={{ marginBottom: "20px" }}>
          <button
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/login");
            }}
          >
            Đăng xuất
          </button>
          <br />
          <br />
          <form
            onSubmit={handleUpload}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              display: "inline-block",
            }}
          >
            <h3>Upload ảnh mới</h3>
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
            <button type="submit">Tải lên</button>
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
          marginTop: "30px",
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
              style={{ width: "100%", height: "180px", objectFit: "cover" }}
            />
            <h4>{p.title}</h4>
            <Link
              to={`/photo/${p.id}`}
              style={{ marginRight: "10px", color: "blue" }}
            >
              Xem chi tiết
            </Link>
            {user && (
              <button
                onClick={async () => {
                  await axios.delete(`http://localhost:8000/photos/${p.id}`);
                  loadPhotos();
                }}
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
