import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./Search.css";

function Search() {
  const [videos, setVideos] = useState([]);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await api.get("/video");
      setVideos(res.data);
    } catch (error) {
      console.log("Search fetch error:", error);
    }
  };

  const getThumbnail = (video) => {
    return (
      video.thumbnail ||
      video.thumbnailUrl ||
      video.image ||
      "https://picsum.photos/300/180"
    );
  };

  const filteredVideos = videos.filter((video) =>
    video.title?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="search-page">
      <h1>Search Movies</h1>

      <input
        type="text"
        placeholder="Search by movie title..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="search-input"
      />

      <div className="search-grid">
        {filteredVideos.map((video) => (
          <div
            className="search-card"
            key={video._id}
            onClick={() => navigate(`/video/${video._id}`)}
          >
            <img
              src={getThumbnail(video)}
              alt={video.title}
              onError={(e) => {
                e.target.src = "https://picsum.photos/300/180";
              }}
            />

            <div className="search-info">
              <h2>{video.title}</h2>
              <p>{video.category}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/watch/${video._id}`);
                }}
              >
                ▶ Play
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search; 