import axios from "axios";
import { ArrowLeft, RotateCcw, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Trash = () => {
  const [trashPhotos, setTrashPhotos] = useState([]);

  const fetchTrash = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/photos/trash", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrashPhotos(res.data);
    } catch (err) {
      console.error("Failed to fetch trash", err);
    }
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  // Chức năng khôi phục ảnh
  const handleRestore = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8000/photos/${id}/restore`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      fetchTrash(); // Tải lại danh sách sau khi khôi phục
    } catch (err) {
      console.error("Failed to restore photo", err);
    }
  };

  // Chức năng XÓA VĨNH VIỄN (Sử dụng Trash2 tại đây)
  const handlePermanentDelete = async (id) => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa vĩnh viễn ảnh này? Không thể hoàn tác!",
      )
    ) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8000/photos/${id}/permanent`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchTrash(); // Tải lại danh sách sau khi xóa sạch
      } catch (err) {
        console.error("Failed to permanently delete", err);
        alert("Lỗi khi xóa vĩnh viễn!");
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link
          title="Back"
          to="/"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">
          Recycle Bin (Thùng rác)
        </h1>
      </div>

      {trashPhotos.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-xl">
          <p className="text-gray-500">
            Your trash is empty. No deleted photos found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {trashPhotos.map((photo) => (
            <div
              key={photo.id}
              className="border rounded-xl p-3 shadow-sm bg-white hover:shadow-md transition-shadow"
            >
              <img
                src={`http://localhost:8000/${photo.url}`}
                alt={photo.title}
                className="w-full h-40 object-cover rounded-lg mb-3 opacity-50 grayscale hover:opacity-80 transition-opacity"
              />
              <h3 className="font-semibold text-gray-700 truncate">
                {photo.title}
              </h3>

              <div className="flex items-center justify-between mt-4 border-t pt-3">
                {/* Nút Khôi phục */}
                <button
                  onClick={() => handleRestore(photo.id)}
                  className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
                  title="Restore"
                >
                  <RotateCcw className="w-4 h-4" /> Restore
                </button>

                {/* Nút Xóa vĩnh viễn - Đã sử dụng Trash2 để hết gạch vàng */}
                <button
                  onClick={() => handlePermanentDelete(photo.id)}
                  className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-700"
                  title="Delete Permanently"
                >
                  <Trash2 className="w-4 h-4" /> Clear
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Trash;
