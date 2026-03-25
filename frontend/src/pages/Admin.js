import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PhotoCard from "../components/PhotoCard";
import "./Admin.css";

function Admin() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8000/photos/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPhotos(response.data);
    } catch (err) {
      setError("Failed to load photos");
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    if (!token || currentUser?.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchPhotos();
  }, [token, currentUser, navigate, fetchPhotos]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/photos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPhotos(photos.filter((p) => p.id !== id));
    } catch (err) {
      setError("Failed to delete photo");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="header-buttons">
          <button onClick={() => navigate("/gallery")} className="back-btn">
            Back to Gallery
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>
      <div className="admin-content">
        <h2>All Photos</h2>
        {error && <p className="error">{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="photo-grid">
            {photos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                onDelete={handleDelete}
                currentUser={currentUser}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
