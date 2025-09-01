import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../AllCss/UpcomingMovies.css";

export default function UpcomingMovies() {
  const api_key = "4755bfd52ed699ba65ceafa0d34e55d2";
  const [page, setPage] = useState(1);
  const [showMovies, setShowMovies] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    async function fetchUpcomingMovies() {
      try {
        const upcomingRes = await axios.get(
          `https://api.themoviedb.org/3/movie/upcoming?api_key=${api_key}&page=${page}`
        );
        setShowMovies(upcomingRes.data.results);
      } catch (error) {
        console.log("Failed to fetch Movies", error);
      } finally {
        setLoader(false);
      }
    }
    fetchUpcomingMovies();
  }, [page]);

  if (loader) return <h2 className="loading">Loading upcoming movies...</h2>;

  return (
    <div className="upcoming-page">
      <h2 className="section-title">🎬 Upcoming Movies</h2>

      <div className="upcoming-container">
        {showMovies.slice(0,12).map((upcoming) => (
          <Link key={upcoming.id} to={`/upcoming/${upcoming.id}`} className="movie-link">
            <div className="movie-card">
              <img
                className="poster"
                src={`https://image.tmdb.org/t/p/w400${upcoming.poster_path}`}
                alt={upcoming.title}
              />
              <div className="movie-info">
                <h2>{upcoming.title}</h2>
                <p className="release-date">📅 {upcoming.release_date}</p>
                <p className="overview">{upcoming.overview}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          ⬅ Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage((p) => p + 1)}>Next ➡</button>
      </div>
    </div>
  );
}
