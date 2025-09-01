import { Link, useLocation, useNavigate, } from "react-router-dom";
import "../AllCss/Header.css";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate()
   const { sessionId, logout } = useContext(AuthContext);

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

 return (
    <header className="header">
      <nav className="navbar">
        <h1 className="logo">🎬 MovieMania</h1>

        <div className="nav-links">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${
                location.pathname === link.path ? "active" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}

          {sessionId ? (
            <button onClick={handleLogout} className="nav-link">
              Logout
            </button>
          ) : (
            <Link to="/login" className="nav-link">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
