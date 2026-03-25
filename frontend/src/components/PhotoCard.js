import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function PhotoCard({ photo, onDelete, currentUser }) {
	const [editing, setEditing] = useState(false);
	const [title, setTitle] = useState(photo.title);
	const [description, setDescription] = useState(photo.description);
	const navigate = useNavigate();
	const token = localStorage.getItem("token");

	// Kiểm tra quyền: Là chủ sở hữu HOẶC là Admin
	const hasPermission =
		currentUser &&
		(currentUser.id === photo.user_id || currentUser.role === "admin");

	const handleUpdate = async () => {
		try {
			await axios.put(
				`http://localhost:8000/photos/${photo.id}`,
				{ title, description },
				{ headers: { Authorization: `Bearer ${token}` } },
			);
			setEditing(false);
			window.location.reload(); // Tải lại để cập nhật thông tin
		} catch (err) {
			alert("Không thể cập nhật ảnh");
		}
	};

	return (
		<div className="photo-card">
			<img
				src={`http://localhost:8000/${photo.image_url}`}
				alt={photo.title}
				onClick={() => navigate(`/photo/${photo.id}`)}
				className="photo-image"
			/>
			<div className="photo-info">
				{" "}
				{editing ? (
					<>
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="edit-input"
						/>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="edit-textarea"
						/>
						<button onClick={handleUpdate}> Lưu </button>{" "}
						<button onClick={() => setEditing(false)}> Hủy </button>{" "}
					</>
				) : (
					<>
						<h3> {photo.title} </h3> <p> {photo.description} </p>{" "}
						{hasPermission && (
							<div className="admin-controls">
								<button onClick={() => setEditing(true)}> Sửa </button>{" "}
								<button
									onClick={() => onDelete(photo.id)}
									style={{ color: "red" }}
								>
									{" "}
									Xóa{" "}
								</button>{" "}
							</div>
						)}{" "}
					</>
				)}{" "}
			</div>{" "}
		</div>
	);
}

export default PhotoCard;
