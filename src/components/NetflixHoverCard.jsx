import React, { useEffect, useRef, useState } from "react";
import {
  FaPlay,
  FaPlus,
  FaCheck,
  FaThumbsUp,
  FaChevronDown,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { isInWatchlist, toggleWatchlist } from "../utils/watchlist";
import "./NetflixHoverCard.css";

const HOVER_CARD_WIDTH = 340;

const NetflixHoverCard = ({ video, index = 0, showTop10 = false }) => {
  const navigate = useNavigate();

  const wrapperRef = useRef(null);
  const trailerRef = useRef(null);

  const [saved, setSaved] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hoverStyle, setHoverStyle] = useState({});

  useEffect(() => {
    if (!video?._id) return;

    setSaved(isInWatchlist(video._id));

    const stored = JSON.parse(localStorage.getItem("continueWatching")) || [];
    const found = stored.find((item) => item._id === video._id);

    if (found?.progress) {
      setProgress(found.progress);
    }
  }, [video]);

  useEffect(() => {
    if (!trailerRef.current) return;

    if (hovered && video?.trailerUrl) {
      trailerRef.current.play().catch(() => {});
    } else {
      trailerRef.current.pause();
      trailerRef.current.currentTime = 0;
    }
  }, [hovered, video]);

  const calculateHoverPosition = () => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    const screenWidth = window.innerWidth;

    let left = rect.left + rect.width / 2 - HOVER_CARD_WIDTH / 2;

    if (left < 20) {
      left = 20;
    }

    if (left + HOVER_CARD_WIDTH > screenWidth - 20) {
      left = screenWidth - HOVER_CARD_WIDTH - 20;
    }

    setHoverStyle({
      position: "fixed",
      top: `${Math.max(rect.top - 55, 80)}px`,
      left: `${left}px`,
      width: `${HOVER_CARD_WIDTH}px`,
    });
  };

  const handleMouseEnter = () => {
    calculateHoverPosition();
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const handleWatchlist = (e) => {
    e.stopPropagation();
    toggleWatchlist(video);
    setSaved(isInWatchlist(video._id));
  };

  const handlePlay = (e) => {
    e.stopPropagation();
    navigate(`/watch/${video._id}`);
  };

  const handleDetails = (e) => {
    e.stopPropagation();
    navigate(`/video/${video._id}`);
  };

  if (!video) return null;

  return (
    <div
      ref={wrapperRef}
      className="netflix-hover-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="normal-card">
        {showTop10 && index < 10 && (
          <div className="top10-mini-badge">#{index + 1}</div>
        )}

        <img
          src={video.thumbnail || video.image}
          alt={video.title}
          className="normal-card-img"
        />

        {progress > 0 && (
          <div className="mini-progress-bar">
            <span style={{ width: `${progress}%` }}></span>
          </div>
        )}
      </div>

      {hovered && (
        <div className="expanded-hover-card" style={hoverStyle}>
          <div className="hover-media">
            {video.trailerUrl ? (
              <video
                ref={trailerRef}
                src={video.trailerUrl}
                muted
                loop
                playsInline
                className="hover-video"
              />
            ) : (
              <img
                src={video.thumbnail || video.image}
                alt={video.title}
                className="hover-video"
              />
            )}

            {showTop10 && index < 10 && (
              <div className="top10-large-badge">TOP {index + 1}</div>
            )}
          </div>

          <div className="hover-content">
            <div className="hover-actions">
              <button className="main-play-btn" onClick={handlePlay}>
                <FaPlay />
                Play
              </button>

              <button className="circle-btn" onClick={handleWatchlist}>
                {saved ? <FaCheck /> : <FaPlus />}
              </button>

              <button className="circle-btn">
                <FaThumbsUp />
              </button>

              <button className="circle-btn right-btn" onClick={handleDetails}>
                <FaChevronDown />
              </button>
            </div>

            <div className="hover-meta">
              <span className="match">98% Match</span>
              <span>{video.year || "2026"}</span>
              <span className="age">U/A 13+</span>
              <span>{video.duration || "2h 10m"}</span>
              <span className="quality">HD</span>
            </div>

            <h3>{video.title}</h3>

            <p className="hover-description">{video.description}</p>

            <div className="hover-tags">
              <span>{video.category || "Drama"}</span>
              <span>•</span>
              <span>Exciting</span>
              <span>•</span>
              <span>Trending</span>
            </div>

            {progress > 0 && (
              <div className="hover-progress-box">
                <div className="hover-progress-info">
                  <span>Continue Watching</span>
                  <span>{progress}%</span>
                </div>

                <div className="hover-progress-bar">
                  <span style={{ width: `${progress}%` }}></span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NetflixHoverCard; 