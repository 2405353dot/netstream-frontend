import { useEffect, useState } from "react";
import API from "../api/axios";
import NetflixHoverCard from "./NetflixHoverCard";

function Row({ title }) {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await API.get("/video");
        console.log("Backend data:", res.data);

        if (Array.isArray(res.data)) {
          setMovies(res.data);
        } else {
          setMovies([]);
        }
      } catch (error) {
        console.log("Error fetching videos:", error);
        setError("Failed to load videos");
      }
    };

    fetchVideos();
  }, []);

  return (
    <div style={{ margin: "20px", position: "relative", zIndex: 2 }}>
      <h2 style={{ marginBottom: "10px", color: "white" }}>{title}</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div
        style={{
          display: "flex",
          overflowX: "auto",
          overflowY: "visible",
          gap: "14px",
          padding: "90px 0 180px 0",
        }}
      >
        {movies.length > 0 ? (
          movies.map((movie, index) => (
            <NetflixHoverCard
              key={movie._id}
              video={movie}
              index={index}
              showTop10={title.toLowerCase().includes("top")}
            />
          ))
        ) : (
          <p style={{ color: "gray" }}>No movies found</p>
        )}
      </div>
    </div>
  );
}

export default Row;  