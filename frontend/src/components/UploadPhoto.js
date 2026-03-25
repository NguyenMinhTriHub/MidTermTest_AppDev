import axios from "axios";
import React, { useState } from "react";

function UploadPhoto({ onUpload }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); // Dòng 6 đã hết lỗi vàng
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8000/photos/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Reset form sau khi thành công
      setTitle("");
      setDescription("");
      setFile(null);
      alert("Upload success!");
      onUpload();
    } catch (err) {
      console.error(err);
      alert("Upload failed!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description (Optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        required
      />
      <button type="submit">Upload Photo</button>
    </form>
  );
}

export default UploadPhoto;
