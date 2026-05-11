import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { isInWatchlist, toggleWatchlist } from "../utils/watchlist";

import "./VideoDetails.css";

const fallbackImg =
  "https://images.unsplash.com/photo-1519608487953-e999c86e7455";

const netflixBanner =
  "https://image.tmdb.org/t/p/original/7bWxAsNPv9CXHOhZbJVlj2KxgfP.jpg";

const VideoDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [video, setVideo] = useState(null);

  const [similarVideos, setSimilarVideos] = useState([]);

  const [saved, setSaved] = useState(false);

  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchVideo();
    fetchSimilarVideos();
  }, [id]);

  const fetchVideo = async () => {
    try {
      const res = await api.get(`/video/${id}`);

      setVideo(res.data);

      setSaved(isInWatchlist(res.data._id));
    } catch (error) {
      console.log("Video details error:", error);
    }
  };

  const fetchSimilarVideos = async () => {
    try {
      const res = await api.get(`/video/${id}/similar`);

      setSimilarVideos(res.data || []);
    } catch (error) {
      console.log("Similar videos error:", error);

      setSimilarVideos([]);
    }
  };

  const getThumbnail = (item) => {
    return (
      item?.heroImage ||
      item?.thumbnail ||
      item?.thumbnailUrl ||
      netflixBanner
    );
  };

  const getDuration = () => {
    if (!video?.duration) return "HD";

    const minutes = Math.round(video.duration / 60);

    if (minutes <= 0) return "HD";

    return `${minutes} min`;
  };

  if (!video) {
    return (
      <div className="details-loading">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="details-page">
      {/* ================= HERO ================= */}

      <div className="details-hero">
        {/* ================= BANNER ================= */}

        <div className="details-banner">
          <img
            className="details-bg-img"
            src={video.heroImage || netflixBanner}
            alt={video.title}
            onError={(e) => {
              e.target.src = fallbackImg;
            }}
          />

          <div className="details-overlay"></div>
        </div>

        {/* ================= CLOSE ================= */}

        <button
          className="close-btn"
          onClick={() => navigate(-1)}
        >
          ✕
        </button>

        {/* ================= CONTENT ================= */}

        <div className="details-hero-content">
          {video.logoImage ? (
            <img
              className="details-logo"
              src={video.logoImage}
              alt={video.title}
            />
          ) : (
            <h1>{video.title}</h1>
          )}

          {/* ================= META ================= */}

          <div className="details-meta">
            <span className="match">
              {video.matchPercentage || 98}% Match
            </span>

            <span>{video.releaseYear || 2026}</span>

            <span>{video.maturityRating || "13+"}</span>

            <span>{getDuration()}</span>

            <span>{video.category}</span>
          </div>

          {/* ================= DESCRIPTION ================= */}

          <p>{video.description}</p>

          {/* ================= ACTIONS ================= */}

          <div className="details-actions">
            <button
              className="play-btn"
              onClick={() => navigate(`/watch/${video._id}`)}
            >
              ▶ Play
            </button>

            <button
              className="circle-btn"
              title="Add to Watchlist"
              onClick={() => {
                const added = toggleWatchlist(video);

                setSaved(added);
              }}
            >
              {saved ? "✓" : "+"}
            </button>

            <button
              className="circle-btn"
              title="Like"
              onClick={() => setLiked(!liked)}
            >
              {liked ? "👍" : "♡"}
            </button>
          </div>

          {/* ================= EXTRA ================= */}

          <div className="details-extra">
            <p>
              <strong>Language:</strong>{" "}
              {video.language || "English"}
            </p>

            <p>
              <strong>Tags:</strong>{" "}
              {video.tags && video.tags.length > 0
                ? video.tags.join(", ")
                : "Drama, Action, Thriller"}
            </p>
          </div>
        </div>
      </div>

      {/* ================= BODY ================= */}

      <div className="details-body">
        {/* ================= EPISODES ================= */}

        {video.episodes &&
          video.episodes.length > 0 && (
            <>
              <h2>Episodes</h2>

              <div className="episodes-preview-grid">
                {video.episodes.map((episode, index) => (
                  <div
                    className="episode-preview-card"
                    key={index}
                  >
                    <img
                      src={
                        episode.thumbnail ||
                        getThumbnail(video)
                      }
                      alt={episode.title}
                      onError={(e) => {
                        e.target.src = fallbackImg;
                      }}
                    />

                    <div>
                      <h3>
                        {episode.episodeNumber ||
                          index + 1}
                        . {episode.title}
                      </h3>

                      <p>{episode.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

        {/* ================= SIMILAR ================= */}

        <h2>More Like This</h2>

        {similarVideos.length === 0 ? (
          <p className="empty-text">
            No similar videos found.
          </p>
        ) : (
          <div className="similar-grid">
            {similarVideos.map((item) => (
              <div
                className="similar-card"
                key={item._id}
                onClick={() =>
                  navigate(`/video/${item._id}`)
                }
              >
                <img
                  src={getThumbnail(item)}
                  alt={item.title}
                  onError={(e) => {
                    e.target.src = fallbackImg;
                  }}
                />

                <div className="similar-info">
                  <h3>{item.title}</h3>

                  <p>{item.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoDetails;  