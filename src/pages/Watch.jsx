import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Hls from "hls.js";
import api from "../api/axios";

import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaUndo,
  FaRedo,
  FaClosedCaptioning,
  FaExpand,
  FaCompress,
  FaStepForward,
  FaLayerGroup,
  FaArrowLeft,
} from "react-icons/fa";

import "./Watch.css";

function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();

  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const controlsTimeout = useRef(null);
  const lastSavedTime = useRef(0);

  const [video, setVideo] = useState(null);
  const [savedProgress, setSavedProgress] = useState(0);
  const [videoError, setVideoError] = useState("");
  const [buffering, setBuffering] = useState(true);

  const [showControls, setShowControls] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [brightness] = useState(100);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const [qualities, setQualities] = useState([]);
  const [selectedQuality, setSelectedQuality] = useState("auto");

  const [showEpisodes, setShowEpisodes] = useState(false);
  const [showIntroButton, setShowIntroButton] = useState(true);

  const [subtitleEnabled, setSubtitleEnabled] = useState(false);
  const [selectedSubtitle, setSelectedSubtitle] = useState("off");

  const [miniPlayer, setMiniPlayer] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    fetchVideo();
    fetchContinueData();

    return () => destroyHls();
  }, [id]);

  useEffect(() => {
    startControlsTimer();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyboardShortcuts);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyboardShortcuts);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      clearTimeout(controlsTimeout.current);
    };
  }, [playing, muted, volume]);

  useEffect(() => {
    if (!video) return;

    setupPlayer();

    return () => destroyHls();
  }, [video, savedProgress]);

  useEffect(() => {
    applySubtitleMode();
  }, [subtitleEnabled, selectedSubtitle, video]);

  const fetchVideo = async () => {
    try {
      const res = await api.get(`/video/${id}`);
      setVideo(res.data);
    } catch (error) {
      console.log("Video fetch error:", error);
      setVideoError("Video failed to load.");
    }
  };

  const fetchContinueData = async () => {
    try {
      const res = await api.get("/watch-history/continue");
      const current = res.data.find((item) => item._id === id);

      if (current?.progress) {
        setSavedProgress(current.progress);
      }
    } catch (error) {
      console.log("Continue data error:", error);
    }
  };

  const destroyHls = () => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  };

  const getVideoUrl = () => {
    return video?.hlsUrl || video?.videoUrl || video?.video || video?.url || "";
  };

  const getPoster = () => {
    return video?.thumbnail || video?.thumbnailUrl || "";
  };

  const setupPlayer = () => {
    const player = videoRef.current;
    const source = getVideoUrl();

    if (!player || !source) return;

    destroyHls();

    setBuffering(true);
    setVideoError("");
    setQualities([]);
    setSelectedQuality("auto");

    player.volume = volume;
    player.muted = muted;
    player.playbackRate = playbackSpeed;

    const isHLS = source.includes(".m3u8");

    if (isHLS && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
      });

      hlsRef.current = hls;

      hls.loadSource(source);
      hls.attachMedia(player);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const levels = hls.levels
          .map((level, index) => ({
            index,
            height: level.height,
            bitrate: level.bitrate,
          }))
          .filter((level) => level.height)
          .sort((a, b) => b.height - a.height);

        setQualities(levels);

        if (savedProgress > 0) {
          player.currentTime = savedProgress;
        }

        applySubtitleMode();

        player.play().catch(() => {
          setPlaying(false);
        });
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        if (hls.autoLevelEnabled) {
          setSelectedQuality("auto");
        } else {
          setSelectedQuality(String(data.level));
        }
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        console.log("HLS Error:", data);

        if (!data.fatal) return;

        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
        } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
        } else {
          setVideoError("This video could not be played.");
          hls.destroy();
        }
      });
    } else {
      player.src = source;

      player.onloadedmetadata = () => {
        if (savedProgress > 0 && savedProgress < player.duration) {
          player.currentTime = savedProgress;
        }

        applySubtitleMode();

        player.play().catch(() => {
          setPlaying(false);
        });
      };
    }
  };

  const saveProgress = async () => {
    const player = videoRef.current;

    if (!player || !video) return;

    try {
      await api.post("/watch-history/progress", {
        videoId: id,
        progress: player.currentTime,
        duration: player.duration || 0,
      });
    } catch (error) {
      console.log("Progress save error:", error);
    }
  };

  const handleLoadedMetadata = () => {
    const player = videoRef.current;
    if (!player) return;

    setDuration(player.duration || 0);
    player.volume = volume;
    player.muted = muted;
    player.playbackRate = playbackSpeed;

    setTimeout(() => {
      applySubtitleMode();
    }, 300);
  };

  const handleTimeUpdate = () => {
    const player = videoRef.current;
    if (!player) return;

    setProgress(player.currentTime);
    setDuration(player.duration || 0);

    if (player.currentTime > 10) {
      setShowIntroButton(false);
    }

    if (player.currentTime - lastSavedTime.current >= 10) {
      lastSavedTime.current = player.currentTime;
      saveProgress();
    }
  };

  const togglePlayPause = () => {
    const player = videoRef.current;
    if (!player) return;

    if (player.paused) {
      player.play();
      setPlaying(true);
    } else {
      player.pause();
      setPlaying(false);
    }
  };

  const handleSeek = (e) => {
    const player = videoRef.current;
    if (!player) return;

    const value = Number(e.target.value);
    player.currentTime = value;
    setProgress(value);
  };

  const toggleMute = () => {
    const player = videoRef.current;
    if (!player) return;

    const nextMuted = !muted;

    player.muted = nextMuted;
    setMuted(nextMuted);

    if (!nextMuted && volume === 0) {
      player.volume = 0.8;
      setVolume(0.8);
    }
  };

  const handleVolumeChange = (e) => {
    const player = videoRef.current;
    if (!player) return;

    const value = Number(e.target.value);

    player.volume = value;
    setVolume(value);

    if (value === 0) {
      player.muted = true;
      setMuted(true);
    } else {
      player.muted = false;
      setMuted(false);
    }
  };

  const changePlaybackSpeed = (speed) => {
    const player = videoRef.current;
    if (!player) return;

    player.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  const changeQuality = (value) => {
    setSelectedQuality(value);

    if (!hlsRef.current) return;

    if (value === "auto") {
      hlsRef.current.currentLevel = -1;
    } else {
      hlsRef.current.currentLevel = Number(value);
    }
  };

  const applySubtitleMode = () => {
    const player = videoRef.current;

    if (!player || !player.textTracks) return;

    for (let i = 0; i < player.textTracks.length; i++) {
      const track = player.textTracks[i];

      if (
        subtitleEnabled &&
        selectedSubtitle !== "off" &&
        String(i) === String(selectedSubtitle)
      ) {
        track.mode = "showing";
      } else {
        track.mode = "hidden";
      }
    }
  };

  const toggleSubtitle = () => {
    const subtitles = video?.subtitles || [];

    if (!subtitles.length) {
      alert("No subtitles available for this video");
      return;
    }

    if (subtitleEnabled) {
      setSubtitleEnabled(false);
      setSelectedSubtitle("off");
    } else {
      const defaultIndex = subtitles.findIndex((sub) => sub.default);

      setSelectedSubtitle(String(defaultIndex >= 0 ? defaultIndex : 0));
      setSubtitleEnabled(true);
    }

    setTimeout(() => {
      applySubtitleMode();
    }, 100);
  };

  const changeSubtitle = (value) => {
    setSelectedSubtitle(value);

    if (value === "off") {
      setSubtitleEnabled(false);
    } else {
      setSubtitleEnabled(true);
    }

    setTimeout(() => {
      applySubtitleMode();
    }, 100);
  };

  const skipIntro = () => {
    const player = videoRef.current;
    if (!player) return;

    player.currentTime = video?.introEnd || 85;
    setShowIntroButton(false);
  };

  const toggleFullscreen = () => {
    const elem = document.querySelector(".watch-page");

    if (!document.fullscreenElement) {
      elem.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleFullscreenChange = () => {
    setIsFullscreen(Boolean(document.fullscreenElement));
  };

  const handleKeyboardShortcuts = (e) => {
    const player = videoRef.current;
    if (!player) return;

    switch (e.key.toLowerCase()) {
      case " ":
        e.preventDefault();
        togglePlayPause();
        break;

      case "arrowright":
        player.currentTime += 10;
        break;

      case "arrowleft":
        player.currentTime -= 10;
        break;

      case "m":
        toggleMute();
        break;

      case "f":
        toggleFullscreen();
        break;

      case "c":
        toggleSubtitle();
        break;

      default:
        break;
    }
  };

  const startControlsTimer = () => {
    clearTimeout(controlsTimeout.current);

    controlsTimeout.current = setTimeout(() => {
      if (playing) {
        setShowControls(false);
      }
    }, 3000);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    startControlsTimer();
  };

  const handleDoubleClick = (e) => {
    const player = videoRef.current;
    if (!player) return;

    const width = window.innerWidth;

    if (e.clientX < width / 2) {
      player.currentTime -= 10;
    } else {
      player.currentTime += 10;
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (!video) {
    return (
      <div className="watch-loading">
        <div className="netflix-loader">N</div>
      </div>
    );
  }

  return (
    <div
      className={`watch-page ${miniPlayer ? "mini-player" : ""}`}
      onMouseMove={handleMouseMove}
      onDoubleClick={handleDoubleClick}
    >
      <video
        ref={videoRef}
        poster={getPoster()}
        autoPlay
        playsInline
        preload="metadata"
        className="watch-video"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setPlaying(true)}
        onPause={() => {
          setPlaying(false);
          saveProgress();
        }}
        onEnded={saveProgress}
        onWaiting={() => setBuffering(true)}
        onPlaying={() => setBuffering(false)}
        onCanPlay={() => setBuffering(false)}
        style={{
          filter: `brightness(${brightness}%)`,
        }}
        onError={() =>
          setVideoError("Video failed to load. Check MP4 or HLS URL.")
        }
      >
        {video?.subtitles?.map((sub, index) => (
          <track
            key={index}
            src={sub.src}
            kind={sub.kind || "subtitles"}
            srcLang={sub.srcLang || sub.srclang || "en"}
            label={sub.label || "English"}
            default={Boolean(sub.default)}
          />
        ))}
      </video>

      {buffering && (
        <div className="buffer-loader">
          <div className="netflix-spinner"></div>
        </div>
      )}

      {showControls && (
        <button className="modern-back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
      )}

      {showControls && (
        <button
          className="modern-mini-btn"
          onClick={() => setMiniPlayer(!miniPlayer)}
        >
          <FaLayerGroup />
        </button>
      )}

      {showControls && (
        <div className="modern-bottom-controls">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={progress}
            onChange={handleSeek}
            className="modern-progress-bar"
          />

          <div className="modern-time-row">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="modern-controls-row">
            <div className="modern-controls-left">
              <button onClick={togglePlayPause} className="modern-icon-btn">
                {playing ? <FaPause /> : <FaPlay />}
              </button>

              <button
                onClick={() => (videoRef.current.currentTime -= 10)}
                className="modern-skip-btn"
              >
                <FaUndo />
                <span>10</span>
              </button>

              <button
                onClick={() => (videoRef.current.currentTime += 10)}
                className="modern-skip-btn"
              >
                <FaRedo />
                <span>10</span>
              </button>

              <div className="volume-control">
                <button onClick={toggleMute} className="modern-icon-btn">
                  {muted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={muted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                />
              </div>
            </div>

            <div className="modern-video-title">
              <strong>{video.title}</strong>
              <span>{video.category}</span>
            </div>

            <div className="modern-controls-right">
              <button className="modern-icon-btn">
                <FaStepForward />
              </button>

              <button
                onClick={() => setShowEpisodes(!showEpisodes)}
                className="modern-icon-btn"
              >
                <FaLayerGroup />
              </button>

              <button
                onClick={toggleSubtitle}
                className={`modern-icon-btn ${
                  subtitleEnabled ? "active-control" : ""
                }`}
                title="Toggle captions"
              >
                <FaClosedCaptioning />
              </button>

              {video?.subtitles?.length > 0 && (
                <select
                  value={selectedSubtitle}
                  onChange={(e) => changeSubtitle(e.target.value)}
                  className="modern-select"
                >
                  <option value="off">CC Off</option>

                  {video.subtitles.map((sub, index) => (
                    <option key={index} value={String(index)}>
                      {sub.label || `Subtitle ${index + 1}`}
                    </option>
                  ))}
                </select>
              )}

              <select
                value={playbackSpeed}
                onChange={(e) => changePlaybackSpeed(Number(e.target.value))}
                className="modern-select"
              >
                <option value="0.5">0.5x</option>
                <option value="1">1x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </select>

              <select
                value={selectedQuality}
                onChange={(e) => changeQuality(e.target.value)}
                className="modern-select"
              >
                <option value="auto">Auto</option>

                {qualities.map((q) => (
                  <option key={q.index} value={q.index}>
                    {q.height}p
                  </option>
                ))}
              </select>

              <button onClick={toggleFullscreen} className="modern-icon-btn">
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>
            </div>
          </div>
        </div>
      )}

      {showIntroButton && (
        <button className="skip-intro-btn" onClick={skipIntro}>
          Skip Intro
        </button>
      )}

      {showEpisodes && video?.episodes?.length > 0 && (
        <div className="episode-sidebar">
          <h3>Episodes</h3>

          {video.episodes.map((ep, index) => (
            <div key={index} className="episode-card">
              <img src={ep.thumbnail} alt={ep.title} />

              <div>
                <h4>{ep.title}</h4>
                <p>{ep.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {videoError && <div className="video-error">{videoError}</div>}
    </div>
  );
}

export default Watch; 