import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

function AddVideo() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    thumbnail: "",
    videoUrl: "",
    hlsUrl: "",
    trailerUrl: "",
    maturityRating: "13+",
    releaseYear: 2026,
    language: "English",
    matchPercentage: 98,
    featured: false,
    trending: false,
    top10: false,
  });

  const [videoFile, setVideoFile] = useState(null);

  const [subtitleFile, setSubtitleFile] = useState(null);

  const [subtitleLabel, setSubtitleLabel] = useState("English");

  const [subtitleLang, setSubtitleLang] = useState("en");

  const [uploading, setUploading] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);

  const [videoPreview, setVideoPreview] = useState("");

  /* =========================================================
     HANDLE INPUT CHANGE
  ========================================================= */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  /* =========================================================
     HANDLE VIDEO FILE
  ========================================================= */

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setVideoFile(file);

    setVideoPreview(URL.createObjectURL(file));
  };

  /* =========================================================
     HANDLE SUBTITLE FILE
  ========================================================= */

  const handleSubtitleChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSubtitleFile(file);
  };

  /* =========================================================
     UPLOAD VIDEO + SUBTITLE
  ========================================================= */

  const uploadFiles = async () => {
    const uploadData = new FormData();

    if (videoFile) {
      uploadData.append("video", videoFile);
    }

    if (subtitleFile) {
      uploadData.append("subtitle", subtitleFile);
    }

    try {
      setUploading(true);

      setUploadProgress(0);

      const res = await axios.post("/video/upload", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },

        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );

          setUploadProgress(percent);
        },
      });

      setUploading(false);

      return res.data;
    } catch (error) {
      setUploading(false);

      console.log(error);

      alert(error.response?.data?.message || "Upload failed");

      return null;
    }
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let finalVideoUrl = formData.videoUrl;

      let finalHlsUrl = formData.hlsUrl;

      let subtitles = [];

      if (videoFile || subtitleFile) {
        const uploadedData = await uploadFiles();

        if (!uploadedData) return;

        finalVideoUrl = uploadedData.videoUrl || "";

        finalHlsUrl = uploadedData.hlsUrl || "";

        if (uploadedData.subtitleUrl) {
          subtitles.push({
            label: subtitleLabel,
            srcLang: subtitleLang,
            src: uploadedData.subtitleUrl,
            default: true,
          });
        }
      }

      const finalData = {
        ...formData,

        videoUrl: finalVideoUrl,

        hlsUrl: finalHlsUrl,

        subtitles,

        trailerUrl:
          formData.trailerUrl ||
          finalVideoUrl ||
          finalHlsUrl,

        releaseYear: Number(formData.releaseYear),

        matchPercentage: Number(
          formData.matchPercentage
        ),
      };

      await axios.post("/video", finalData);

      alert("Video added successfully");

      navigate("/admin/videos");
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Failed to add video");
    }
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Add New Video</h1>

          <p style={{ color: "#aaa" }}>
            Upload and publish a movie/show
          </p>
        </div>

        <button
          style={backButtonStyle}
          onClick={() => navigate("/admin")}
        >
          Back to Admin
        </button>
      </div>

      <form onSubmit={handleSubmit} style={layoutStyle}>
        <div style={formStyle}>
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
            placeholder="Thumbnail URL"
            value={formData.thumbnail}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          {/* VIDEO */}

          <div style={uploadBoxStyle}>
            <h3>Upload Video</h3>

            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              style={fileInputStyle}
            />

            {videoFile && (
              <p style={{ color: "#bbb" }}>
                {videoFile.name}
              </p>
            )}

            {uploading && (
              <>
                <div style={progressWrapperStyle}>
                  <div
                    style={{
                      ...progressBarStyle,
                      width: `${uploadProgress}%`,
                    }}
                  ></div>
                </div>

                <p style={{ color: "#e50914" }}>
                  Uploading & converting...{" "}
                  {uploadProgress}%
                </p>
              </>
            )}
          </div>

          {/* SUBTITLE */}

          <div style={uploadBoxStyle}>
            <h3>Upload Subtitle (.vtt)</h3>

            <input
              type="file"
              accept=".vtt"
              onChange={handleSubtitleChange}
              style={fileInputStyle}
            />

            {subtitleFile && (
              <p style={{ color: "#bbb" }}>
                {subtitleFile.name}
              </p>
            )}

            <div style={gridStyle}>
              <input
                type="text"
                placeholder="Subtitle Label"
                value={subtitleLabel}
                onChange={(e) =>
                  setSubtitleLabel(e.target.value)
                }
                style={inputStyle}
              />

              <input
                type="text"
                placeholder="Language Code"
                value={subtitleLang}
                onChange={(e) =>
                  setSubtitleLang(e.target.value)
                }
                style={inputStyle}
              />
            </div>
          </div>

          <button
            type="submit"
            style={buttonStyle}
            disabled={uploading}
          >
            {uploading
              ? "Uploading..."
              : "Upload & Add Video"}
          </button>
        </div>

        {/* PREVIEW */}

        <div style={previewStyle}>
          <h2>Preview</h2>

          {formData.thumbnail && (
            <img
              src={formData.thumbnail}
              alt="preview"
              style={thumbnailPreviewStyle}
            />
          )}

          {videoPreview && (
            <video
              src={videoPreview}
              controls
              style={videoPreviewStyle}
            />
          )}

          <h3>{formData.title || "Video Title"}</h3>

          <p style={{ color: "#aaa" }}>
            {formData.description ||
              "Description preview"}
          </p>

          {subtitleFile && (
            <p style={{ color: "#0f9" }}>
              Subtitle Ready: {subtitleLabel}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

/* =========================================================
   STYLES
========================================================= */

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
};

const titleStyle = {
  margin: 0,
  fontSize: "34px",
};

const layoutStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 400px",
  gap: "35px",
  marginTop: "30px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
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
};

const uploadBoxStyle = {
  border: "1px dashed #555",
  padding: "18px",
  borderRadius: "10px",
  background: "#161616",
};

const fileInputStyle = {
  width: "100%",
  padding: "12px",
  background: "#111",
  color: "white",
};

const progressWrapperStyle = {
  width: "100%",
  height: "8px",
  background: "#333",
  borderRadius: "999px",
  overflow: "hidden",
  marginTop: "12px",
};

const progressBarStyle = {
  height: "100%",
  background: "#e50914",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
  marginTop: "12px",
};

const buttonStyle = {
  padding: "14px",
  background: "#e50914",
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontWeight: "700",
  cursor: "pointer",
};

const backButtonStyle = {
  padding: "12px 16px",
  background: "#333",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const previewStyle = {
  background: "#181818",
  border: "1px solid #292929",
  borderRadius: "14px",
  padding: "20px",
  height: "fit-content",
};

const thumbnailPreviewStyle = {
  width: "100%",
  borderRadius: "10px",
  marginBottom: "15px",
};

const videoPreviewStyle = {
  width: "100%",
  borderRadius: "10px",
  marginBottom: "15px",
};

export default AddVideo; 