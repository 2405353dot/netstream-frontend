import { useNavigate } from "react-router-dom";
import "./RecommendationRow.css";

function RecommendationRow({ title, videos }) {
  const navigate = useNavigate();

  if (!videos || videos.length === 0) return null;

  const getThumbnail = (video) => {
    return video.thumbnail || video.thumbnailUrl || "https://picsum.photos/300/180";
  };

  return (
    <div className="recommendation-row">
      <h2>{title}</h2>

      <div className="recommendation-list">
        {videos.map((video) => (
          <div
            className="recommendation-card"
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

            <div className="recommendation-overlay">
              <h3>{video.title}</h3>
              <p>{video.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecommendationRow; 