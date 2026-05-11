import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWatchlist, toggleWatchlist } from "../utils/watchlist";
import "./Watchlist.css";

const Watchlist = () => {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setList(getWatchlist());
  }, []);

  const getThumbnail = (video) => {
    return video.thumbnail || video.thumbnailUrl || "https://picsum.photos/300/180";
  };

  const removeFromWatchlist = (video) => {
    toggleWatchlist(video);
    setList(getWatchlist());
  };

  return (
    <div className="watchlist-page">
      <h1>My Watchlist</h1>

      {list.length === 0 ? (
        <p>No movies added yet.</p>
      ) : (
        <div className="watchlist-grid">
          {list.map((video) => (
            <div className="watchlist-card" key={video._id}>
              <img
                src={getThumbnail(video)}
                alt={video.title}
                onClick={() => navigate(`/video/${video._id}`)}
                onError={(e) => {
                  e.target.src = "https://picsum.photos/300/180";
                }}
              />

              <h3>{video.title}</h3>

              <div className="watchlist-actions">
                <button onClick={() => navigate(`/watch/${video._id}`)}>
                  ▶ Play
                </button>

                <button onClick={() => removeFromWatchlist(video)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;  