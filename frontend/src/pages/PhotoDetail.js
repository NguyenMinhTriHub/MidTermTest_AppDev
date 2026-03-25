import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function PhotoDetail({ currentUser }) {
	const { id } = useParams();
	const [photo, setPhoto] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const token = localStorage.getItem("token");

	useEffect(() => {
		if (!token) {
			navigate("/login");
			return;
		}
		fetchPhoto();
	}, [id, token]);

	const fetchPhoto = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`http://localhost:8000/photos/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setPhoto(response.data);
		} catch (err) {
			setError("Không thể tải thông tin ảnh");
		}
		setLoading(false);
	};

	const handleDelete = async () => {
		if (window.confirm("Bạn có chắc chắn muốn xóa ảnh này?")) {
			try {
				await axios.delete(`http://localhost:8000/photos/${id}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				navigate("/"); // Quay lại trang chủ sau khi xóa
			} catch (err) {
				alert("Lỗi khi xóa ảnh");
			}
		}
	};

	if (loading) return <p> Đang tải... </p>;
	if (error) return <p style={{ color: "red" }}> {error} </p>;
	if (!photo) return <p> Không tìm thấy ảnh </p>;

	// Kiểm tra quyền sở hữu hoặc Admin
	const hasPermission =
		currentUser &&
		(currentUser.id === photo.user_id || currentUser.role === "admin");

	return (
		<div className="photo-detail-container">
			<button onClick={() => navigate(-1)}> Quay lại </button>{" "}
			<h1> {photo.title} </h1>{" "}
			<img
				src={`http://localhost:8000/${photo.image_url}`}
				alt={photo.title}
				style={{ maxWidth: "100%" }}
			/>{" "}
			<div className="metadata">
				<p>
					{" "}
					<strong> Mô tả: </strong> {photo.description}{" "}
				</p>{" "}
				<p>
					{" "}
					<strong> Ngày tải lên: </strong>{" "}
					{new Date(photo.uploaded_at).toLocaleString()}{" "}
				</p>{" "}
				<p>
					{" "}
					<strong> Người đăng: </strong> {photo.user_id}{" "}
				</p>{" "}
			</div>{" "}
			{hasPermission && (
				<div className="action-buttons">
					<button onClick={handleDelete} className="btn-delete">
						{" "}
						Xóa ảnh này{" "}
					</button>{" "}
				</div>
			)}{" "}
		</div>
	);
}

export default PhotoDetail;
