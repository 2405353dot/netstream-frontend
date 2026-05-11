import { useEffect, useState } from "react";
import API from "../api/axios";
import { FaPlay, FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import TrailerModal from "./TrailerModal";
import "./HeroBanner.css";

function HeroBanner() {
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchHeroMovie = async () => {
      try {
        const res = await API.get("/video");

        if (Array.isArray(res.data) && res.data.length > 0) {
          setMovie(res.data[0]);
        }
      } catch (error) {
        console.log("Hero movie error:", error);
      }
    };

    fetchHeroMovie();
  }, []);

  if (!movie) return null;

  return (
    <>
      <section
        className="hero-banner"
        style={{
          backgroundImage: `linear-gradient(
            to right,
            rgba(0,0,0,0.95),
            rgba(0,0,0,0.55),
            rgba(0,0,0,0.05)
          ), url(${movie.thumbnailUrl || movie.thumbnail || movie.image})`,
        }}
      >
        <div className="hero-content">
          <h1>{movie.title}</h1>

          <div className="hero-meta">
            <span>98% Match</span>
            <span>{movie.year || "2026"}</span>
            <span>13+</span>
            <span>{movie.category}</span>
            <span>HD</span>
          </div>

          <p>
            {movie.description ||
              "A premium cinematic experience selected specially for you."}
          </p>

          <div className="hero-buttons">
            <button
              className="hero-play"
              onClick={() => navigate(`/watch/${movie._id}`)}
            >
              <FaPlay />
              Play
            </button>

            <button
              className="hero-info"
              onClick={() => setShowTrailer(true)}
            >
              <FaInfoCircle />
              More Info
            </button>
          </div>
        </div>

        <div className="hero-bottom-fade"></div>
      </section>

      {showTrailer && (
        <TrailerModal
          movie={movie}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </>
  );
}

export default HeroBanner;