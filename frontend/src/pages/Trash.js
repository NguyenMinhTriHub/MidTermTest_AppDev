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

	const handleRestore = async (id) => {
		const token = localStorage.getItem("token");
		await axios.put(
			`http://localhost:8000/photos/${id}/restore`,
			{},
			{
				headers: { Authorization: `Bearer ${token}` },
			},
		);
		fetchTrash(); // Refresh list
	};

	return (
		<div className="p-6">
			<div className="flex items-center gap-4 mb-6">
				<Link title="Back" to="/">
					<ArrowLeft className="w-6 h-6" />
				</Link>
				<h1 className="text-2xl font-bold">Recycle Bin</h1>
			</div>

			{trashPhotos.length === 0 ? (
				<p className="text-gray-500">Your trash is empty.</p>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{trashPhotos.map((photo) => (
						<div
							key={photo.id}
							className="border rounded-lg p-3 shadow-sm bg-gray-50"
						>
							<img
								src={`http://localhost:8000/${photo.url}`}
								alt={photo.title}
								className="w-full h-40 object-cover rounded mb-2 opacity-60"
							/>
							<h3 className="font-semibold">{photo.title}</h3>
							<div className="flex justify-between mt-3">
								<button
									onClick={() => handleRestore(photo.id)}
									className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
								>
									<RotateCcw className="w-4 h-4" /> Restore
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
