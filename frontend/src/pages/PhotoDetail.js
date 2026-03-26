import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const PhotoDetail = () => {
  const { id } = useParams();
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/photos/${id}`);
        setPhoto(res.data);
      } catch (err) {
        console.error("Lỗi tải chi tiết ảnh");
      }
    };
    fetchDetail();
  }, [id]);

  if (!photo) return <p>Đang tải dữ liệu...</p>;

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <Link to="/" style={{ textDecoration: "none", color: "gray" }}>
        ← Quay lại Gallery
      </Link>
      <hr style={{ margin: "20px 0" }} />
      <img
        src={photo.image_url}
        alt={photo.title}
        style={{
          maxWidth: "80%",
          maxHeight: "500px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      />
      <h1 style={{ marginTop: "20px" }}>{photo.title}</h1>
      <p style={{ color: "#666", fontSize: "18px" }}>
        {photo.description || "Không có mô tả cho ảnh này."}
      </p>
      <p style={{ fontSize: "14px", color: "#999" }}>
        📅 Ngày đăng: {new Date(photo.uploaded_at).toLocaleString()}
      </p>
    </div>
  );
};
export default PhotoDetail;
