import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaSearch,
  FaBell,
  FaPlay,
  FaInfoCircle,
  FaTimes,
  FaPlus,
} from "react-icons/fa";

import api from "../api/axios";
import RecommendationRow from "../components/RecommendationRow";
import "./Home.css";

const fallbackImg =
  "https://images.unsplash.com/photo-1519608487953-e999c86e7455";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const [continueWatching, setContinueWatching] = useState([]);
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [showBlackNav, setShowBlackNav] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState(null);

  const navigate = useNavigate();

  const currentProfile = JSON.parse(localStorage.getItem("netflixProfile"));

  useEffect(() => {
    fetchVideos();
    fetchContinueWatching();
    fetchRecommendations();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBlackNav(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await api.get("/video");
      setVideos(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log("Video fetch error:", error);
    }
  };

  const fetchContinueWatching = async () => {
    try {
      const res = await api.get("/watch-history/continue");
      setContinueWatching(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log("Continue watching error:", error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const res = await api.get("/recommendations");
      setRecommendedVideos(res.data.videos || []);
    } catch (error) {
      console.log("Recommendation error:", error);
    }
  };

  const formatCategory = (category) => {
    if (!category) return "Others";

    return category
      .trim()
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getThumbnail = (video) => {
    return (
      video?.thumbnail?.trim() ||
      video?.thumbnailUrl?.trim() ||
      video?.image?.trim() ||
      fallbackImg
    );
  };

  const getPreviewUrl = (video) => {
    return (
      video?.trailerUrl?.trim() ||
      video?.videoUrl?.trim() ||
      video?.video?.trim() ||
      ""
    );
  };

  const heroMovie = videos[0];

  const categories = {};

  videos.forEach((video) => {
    const categoryName = formatCategory(video.category);

    if (!categories[categoryName]) {
      categories[categoryName] = [];
    }

    categories[categoryName].push(video);
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const renderProfileIcon = (profile) => {
    if (!profile) return "U";

    if (profile.type === "kids") {
      return <span className="nav-kids-text">kids</span>;
    }

    if (profile.type === "add") {
      return <span className="nav-plus-text">+</span>;
    }

    return (
      <div className={`nav-face-box ${profile.type}`}>
        <div className="nav-face">
          <span></span>
          <span></span>
          <div></div>
        </div>
      </div>
    );
  };

  const renderRow = (title, data) => (
    <section className="row compact-row" key={title}>
      <h2>{title}</h2>

      <div className="movie-row premium-movie-row">
        {data.map((video, index) => {
          const isHovered = hoveredVideo === video._id;
          const previewUrl = getPreviewUrl(video);

          return (
            <div
              className="movie-card premium-card"
              key={video._id}
              onMouseEnter={() => setHoveredVideo(video._id)}
              onMouseLeave={() => setHoveredVideo(null)}
              onClick={() => navigate(`/video/${video._id}`)}
            >
              {index < 10 && title.toLowerCase().includes("top") && (
                <div className="top-badge">#{index + 1}</div>
              )}

              <div className="premium-media-box">
                {isHovered && previewUrl ? (
                  <video
                    className="preview-video"
                    src={previewUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={getThumbnail(video)}
                    alt={video.title}
                    onError={(e) => {
                      e.target.src = fallbackImg;
                    }}
                  />
                )}
              </div>

              <div className="premium-card-info">
                <div className="premium-card-buttons">
                  <button
                    className="mini-play"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/watch/${video._id}`);
                    }}
                  >
                    <FaPlay />
                  </button>

                  <button
                    className="mini-circle"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaPlus />
                  </button>

                  <button
                    className="mini-info"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTrailer(video);
                    }}
                  >
                    <FaInfoCircle />
                  </button>
                </div>

                <div className="card-meta">
                  <span className="match">98% Match</span>
                  <span>13+</span>
                  <span>HD</span>
                </div>

                <h3>{video.title}</h3>
                <p>{formatCategory(video.category)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );

  const renderContinueRow = (title, data) => (
    <section className="row compact-row" key="continue">
      <h2>{title}</h2>

      <div className="movie-row premium-movie-row">
        {data.map((video) => {
          const progressPercent =
            video.duration > 0 ? (video.progress / video.duration) * 100 : 0;

          return (
            <div
              className="movie-card premium-card"
              key={video._id}
              onClick={() => navigate(`/watch/${video._id}`)}
            >
              <div className="premium-media-box">
                <img
                  src={getThumbnail(video)}
                  alt={video.title}
                  onError={(e) => {
                    e.target.src = fallbackImg;
                  }}
                />
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              <div className="premium-card-info">
                <h3>{video.title}</h3>
                <p>Continue Watching</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );

  return (
    <div className="home">
      <nav className={`navbar ${showBlackNav ? "navbar-black" : ""}`}>
        <div className="nav-left">
          <div className="nav-logo" onClick={() => navigate("/home")}>
            NETSTREAM
          </div>

          <div className="nav-links">
            <Link to="/home">Home</Link>
            <Link to="/search">Search</Link>
            <Link to="/watchlist">Watchlist</Link>
            <Link to="/admin">Admin</Link>
          </div>
        </div>

        <div className="nav-right">
          <FaSearch className="nav-icon" onClick={() => navigate("/search")} />

          <span className="nav-profile-name">
            {currentProfile?.name || "User"}
          </span>

          <div className="notification-wrapper">
            <FaBell className="nav-icon" />
            <span className="notification-badge">5</span>
          </div>

          <div className="profile-avatar" onClick={() => navigate("/profiles")}>
            {renderProfileIcon(currentProfile)}
          </div>

          <span className="profile-arrow">▾</span>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {heroMovie && (
        <section
          className="hero premium-hero"
          style={{
            backgroundImage: `linear-gradient(
              to right,
              rgba(0,0,0,0.95),
              rgba(0,0,0,0.55),
              rgba(0,0,0,0.05)
            ), url(${getThumbnail(heroMovie)})`,
          }}
        >
          <div className="hero-content">
            <h1>{heroMovie.title}</h1>

            <div className="hero-meta">
              <span className="match">98% Match</span>
              <span>{heroMovie.year || "2026"}</span>
              <span>13+</span>
              <span>{formatCategory(heroMovie.category)}</span>
              <span>HD</span>
            </div>

            <p>{heroMovie.description}</p>

            <div className="hero-buttons">
              <button onClick={() => navigate(`/watch/${heroMovie._id}`)}>
                <FaPlay /> Play
              </button>

              <button
                className="more-btn"
                onClick={() => setSelectedTrailer(heroMovie)}
              >
                <FaInfoCircle /> More Info
              </button>
            </div>
          </div>

          <div className="hero-bottom-fade"></div>
        </section>
      )}

      <main className="rows-after-hero">
        {videos.length > 0 &&
          renderRow("Top 10 in India Today", videos.slice(0, 10))}

        {continueWatching.length > 0 &&
          renderContinueRow("Continue Watching", continueWatching)}

        {recommendedVideos.length > 0 && (
          <div className="compact-row">
            <RecommendationRow
              title="Recommended For You"
              videos={recommendedVideos}
            />
          </div>
        )}

        {Object.keys(categories).map((category) =>
          renderRow(category, categories[category])
        )}
      </main>

      {selectedTrailer && (
        <div className="trailer-overlay" onClick={() => setSelectedTrailer(null)}>
          <div className="trailer-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="trailer-close"
              onClick={() => setSelectedTrailer(null)}
            >
              <FaTimes />
            </button>

            <div className="trailer-video-box">
              {getPreviewUrl(selectedTrailer) ? (
                <video
                  src={getPreviewUrl(selectedTrailer)}
                  autoPlay
                  muted
                  loop
                  controls
                  playsInline
                  className="trailer-video"
                />
              ) : (
                <img
                  src={getThumbnail(selectedTrailer)}
                  alt={selectedTrailer.title}
                  className="trailer-video"
                />
              )}
            </div>

            <div className="trailer-content">
              <h1>{selectedTrailer.title}</h1>

              <div className="trailer-actions">
                <button
                  className="modal-play"
                  onClick={() => navigate(`/watch/${selectedTrailer._id}`)}
                >
                  <FaPlay /> Play
                </button>

                <button className="modal-add">
                  <FaPlus />
                </button>
              </div>

              <div className="trailer-meta">
                <span className="match">98% Match</span>
                <span>{selectedTrailer.year || "2026"}</span>
                <span>13+</span>
                <span>{formatCategory(selectedTrailer.category)}</span>
                <span>HD</span>
              </div>

              <p>{selectedTrailer.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home; 