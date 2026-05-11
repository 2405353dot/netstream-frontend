import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

function EditVideo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    thumbnail: "",
    videoUrl: "",
  });

  useEffect(() => {
    fetchVideo();
  }, []);

  const fetchVideo = async () => {
    try {
      const res = await api.get(`/video/${id}`);

      setFormData({
        title: res.data.title || "",
        description: res.data.description || "",
        category: res.data.category || "",
        thumbnail: res.data.thumbnail || res.data.thumbnailUrl || "",
        videoUrl: res.data.videoUrl || "",
      });
    } catch (error) {
      console.log(error);
      alert("Failed to load video");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/video/${id}`, formData);

      alert("Video updated successfully");
      navigate("/admin/videos");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to update video");
    }
  };

  return (
    <div style={pageStyle}>
      <h1>Edit Video</h1>
      <p style={subText}>Update video details for Netstream</p>

      <form onSubmit={handleUpdate} style={formStyle}>
        <input
          type="text"
          name="title"
          placeholder="Video Title"
          value={formData.title}
          onChange={handleChange}
          style={inputStyle}
          required
        />

        <textarea
          name="description"
          placeholder="Video Description"
          value={formData.description}
          onChange={handleChange}
          style={textareaStyle}
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          style={inputStyle}
          required
        />

        <input
          type="text"
          name="thumbnail"
          placeholder="Thumbnail Image URL"
          value={formData.thumbnail}
          onChange={handleChange}
          style={inputStyle}
          required
        />

        <input
          type="text"
          name="videoUrl"
          placeholder="Video URL"
          value={formData.videoUrl}
          onChange={handleChange}
          style={inputStyle}
          required
        />

        <button type="submit" style={buttonStyle}>
          Update Video
        </button>

        <button
          type="button"
          style={backButtonStyle}
          onClick={() => navigate("/admin/videos")}
        >
          Back to Manage Videos
        </button>
      </form>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#0f0f0f",
  color: "white",
  padding: "40px",
};

const subText = {
  color: "#aaa",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  maxWidth: "550px",
  marginTop: "30px",
};

const inputStyle = {
  padding: "14px",
  borderRadius: "6px",
  border: "1px solid #333",
  background: "#1a1a1a",
  color: "white",
  fontSize: "16px",
};

const textareaStyle = {
  ...inputStyle,
  minHeight: "120px",
  resize: "vertical",
};

const buttonStyle = {
  padding: "14px",
  background: "#e50914",
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontSize: "16px",
  cursor: "pointer",
};

const backButtonStyle = {
  padding: "14px",
  background: "#333",
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontSize: "16px",
  cursor: "pointer",
};

export default EditVideo;