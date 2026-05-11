import { FaTimes, FaPlay, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./TrailerModal.css";

function TrailerModal({ movie, onClose }) {
  const navigate = useNavigate();

  if (!movie) return null;

  return (
    <div className="trailer-overlay" onClick={onClose}>
      <div
        className="trailer-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="trailer-close" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="trailer-video-box">
          {movie.trailerUrl ? (
            <video
              src={movie.trailerUrl}
              autoPlay
              muted
              loop
              playsInline
              controls
              className="trailer-video"
            />
          ) : (
            <img
              src={movie.thumbnailUrl || movie.thumbnail || movie.image}
              alt={movie.title}
              className="trailer-video"
            />
          )}
        </div>

        <div className="trailer-content">
          <h1>{movie.title}</h1>

          <div className="trailer-actions">
            <button
              className="modal-play"
              onClick={() => navigate(`/watch/${movie._id}`)}
            >
              <FaPlay />
              Play
            </button>

            <button className="modal-add">
              <FaPlus />
            </button>
          </div>

          <div className="trailer-meta">
            <span className="match">98% Match</span>
            <span>{movie.year || "2026"}</span>
            <span>13+</span>
            <span>{movie.category}</span>
            <span>HD</span>
          </div>

          <p>{movie.description}</p>
        </div>
      </div>
    </div>
  );
}

export default TrailerModal;