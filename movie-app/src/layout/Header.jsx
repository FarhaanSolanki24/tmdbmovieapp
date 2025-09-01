import { Link, useLocation, useNavigate } from "react-router-dom";
import "../AllCss/Header.css";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId, logout } = useContext(AuthContext);

  const [searchQuery, setSearchQuery] = useState("")

  const links = [
    { path: "/home", label: "Home" },
    { path: "/movies", label: "Movies" },
    { path: "/tvshows", label: "TV Shows" },
    { path: "/upcoming", label: "Upcoming" },
    { path: "/favorites", label: "Favorites" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/search?query=${searchQuery}`)
      setSearchQuery("")
    }
  }

  return (
    <header className="header">
      <nav className="navbar">
        <h1 className="logo">🎬 MovieMania</h1>

        <div className="nav-links">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? "active" : ""
                }`}
            >
              {link.label}
            </Link>
          ))}

          <form onSubmit={handleSearch} className="search-form">
            <input type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input" />
          </form>

          {sessionId ? (
            <button onClick={handleLogout} className="nav-link button">
              Logout
            </button>
          ) : (
            <Link to="/login" className="nav-link button">
              Login
            </Link>
          )}

        </div>
      </nav>
    </header>
  );
}
