import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  const loadPhotos = async (query = "") => {
    try {
      const res = await axios.get(`http://localhost:8000/photos?q=${query}`);
      setPhotos(res.data);
    } catch (err) {
      console.error("Lỗi tải ảnh");
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    loadPhotos(value);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    await axios.post("http://localhost:8000/upload", formData);
    setTitle("");
    setFile(null);
    loadPhotos(searchQuery);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:8000/photos/${editingId}`, {
      title: editTitle,
      description: editDesc,
    });
    setEditingId(null);
    loadPhotos(searchQuery);
  };

  return (
    <div
      style={{
        padding: "20px",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
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
        </div>
      ) : (
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/login">Đăng nhập</Link> |{" "}
          <Link to="/register">Đăng ký</Link>
        </nav>
      )}

      {/* Thanh tìm kiếm [cite: 41] */}
      <div style={{ marginBottom: "30px" }}>
        <input
          type="text"
          placeholder="🔍 Tìm kiếm ảnh theo tên..."
          value={searchQuery}
          onChange={handleSearch}
          style={{
            width: "60%",
            padding: "12px",
            borderRadius: "25px",
            border: "1px solid #ddd",
            fontSize: "16px",
            outline: "none",
          }}
        />
      </div>

      {user && !editingId && (
        <form
          onSubmit={handleUpload}
          style={{
            border: "1px solid #eee",
            padding: "20px",
            display: "inline-block",
            borderRadius: "10px",
            marginBottom: "30px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
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
          <button type="submit">Tải lên</button>
        </form>
      )}

      {editingId && (
        <form
          onSubmit={handleUpdate}
          style={{
            border: "2px solid orange",
            padding: "20px",
            display: "inline-block",
            borderRadius: "10px",
            marginBottom: "30px",
          }}
        >
          <h3>Sửa thông tin ảnh</h3>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            required
          />
          <br />
          <br />
          <textarea
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
          />
          <br />
          <br />
          <button type="submit">Lưu</button>
          <button
            type="button"
            onClick={() => setEditingId(null)}
            style={{ marginLeft: "10px" }}
          >
            Hủy
          </button>
        </form>
      )}

      {/* Vùng hiển thị ảnh hoặc thông báo lỗi */}
      <div style={{ marginTop: "20px" }}>
        {photos.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {photos.map((p) => (
              <div
                key={p.id}
                style={{
                  border: "1px solid #eee",
                  padding: "15px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={p.image_url}
                  alt={p.title}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <h4>{p.title}</h4>
                <Link
                  to={`/photo/${p.id}`}
                  style={{
                    fontSize: "14px",
                    display: "block",
                    marginBottom: "10px",
                    color: "#007bff",
                    textDecoration: "none",
                  }}
                >
                  Xem chi tiết
                </Link>
                {user && (
                  <div style={{ marginTop: "10px" }}>
                    <button
                      onClick={() => {
                        setEditingId(p.id);
                        setEditTitle(p.title);
                        setEditDesc(p.description || "");
                      }}
                      style={{
                        marginRight: "10px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        padding: "5px 12px",
                        borderRadius: "4px",
                      }}
                    >
                      Sửa
                    </button>
                    <button
                      onClick={async () => {
                        if (window.confirm("Xóa ảnh này?")) {
                          await axios.delete(
                            `http://localhost:8000/photos/${p.id}`,
                          );
                          loadPhotos(searchQuery);
                        }
                      }}
                      style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        padding: "5px 12px",
                        borderRadius: "4px",
                      }}
                    >
                      Xóa
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* PHẦN CHỈNH SỬA CHÍNH: Căn giữa dòng thông báo không có kết quả */
          <div
            style={{ width: "100%", padding: "50px 0", textAlign: "center" }}
          >
            <p style={{ fontSize: "18px", color: "#666", fontWeight: "bold" }}>
              🚫 Không tìm thấy ảnh nào khớp với từ khóa "{searchQuery}".
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Gallery;
