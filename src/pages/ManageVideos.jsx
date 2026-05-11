import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function ManageVideos() {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await api.get("/video");
      setVideos(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch videos");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this video?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/video/${id}`);
      alert("Video deleted successfully");
      fetchVideos();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <div>
          <h1 style={headingStyle}>Manage Videos</h1>
          <p style={subText}>Edit, review, and delete Netstream videos.</p>
        </div>

        <button style={backBtn} onClick={() => navigate("/admin")}>
          Back to Admin
        </button>
      </div>

      <div style={tableWrapper}>
        {videos.length === 0 ? (
          <p>No videos found.</p>
        ) : (
          videos.map((video) => (
            <div key={video._id} style={videoCard}>
              <img
                src={video.thumbnail || video.thumbnailUrl}
                alt={video.title}
                style={imageStyle}
                onError={(e) => {
                  e.target.src = "https://picsum.photos/300/180";
                }}
              />

              <div style={infoStyle}>
                <h2 style={{ marginBottom: "8px" }}>{video.title}</h2>

                <p style={{ color: "#aaa", marginBottom: "8px" }}>
                  {video.description}
                </p>

                <p style={categoryStyle}>{video.category}</p>
              </div>

              <div style={actionStyle}>
                <button
                  style={viewBtn}
                  onClick={() => navigate(`/video/${video._id}`)}
                >
                  View
                </button>

                <button
                  style={editBtn}
                  onClick={() => navigate(`/admin/edit-video/${video._id}`)}
                >
                  Edit
                </button>

                <button
                  style={deleteBtn}
                  onClick={() => handleDelete(video._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#0f0f0f",
  color: "white",
  padding: "40px",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
};

const headingStyle = {
  fontSize: "36px",
  marginBottom: "8px",
};

const subText = {
  color: "#aaa",
};

const tableWrapper = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const videoCard = {
  display: "flex",
  alignItems: "center",
  background: "#1a1a1a",
  padding: "16px",
  borderRadius: "12px",
  gap: "20px",
};

const imageStyle = {
  width: "180px",
  height: "100px",
  objectFit: "cover",
  borderRadius: "8px",
};

const infoStyle = {
  flex: 1,
};

const categoryStyle = {
  display: "inline-block",
  background: "#333",
  padding: "6px 10px",
  borderRadius: "20px",
  color: "#ddd",
};

const actionStyle = {
  display: "flex",
  gap: "10px",
};

const viewBtn = {
  padding: "10px 14px",
  background: "#333",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const editBtn = {
  padding: "10px 14px",
  background: "#1f6feb",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const deleteBtn = {
  padding: "10px 14px",
  background: "#e50914",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const backBtn = {
  padding: "10px 14px",
  background: "#333",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

export default ManageVideos; 