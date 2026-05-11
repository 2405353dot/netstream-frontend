 import { useNavigate } from "react-router-dom";

function MovieCard({ movie }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/video/${movie._id}`)}
      style={{
        minWidth: "220px",
        height: "130px",
        marginRight: "12px",
        borderRadius: "8px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.3s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <img
        src={movie.thumbnailUrl}
        alt={movie.title}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
}

export default MovieCard;