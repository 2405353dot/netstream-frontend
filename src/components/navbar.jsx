import { useEffect, useState } from "react";
import { FaSearch, FaBell } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const [showBlack, setShowBlack] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBlack(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${showBlack ? "navbar-black" : ""}`}>
      <div className="navbar-left">
        <h1 className="navbar-logo">NETSTREAM</h1>

        <a href="/">Home</a>
        <a href="/search">Search</a>
        <a href="/watchlist">My List</a>
        <a href="/admin">Admin</a>
      </div>

      <div className="navbar-right">
        <FaSearch className="nav-icon" />
        <FaBell className="nav-icon" />

        <div className="profile-avatar">U</div>
      </div>
    </nav>
  );
}

export default Navbar; 