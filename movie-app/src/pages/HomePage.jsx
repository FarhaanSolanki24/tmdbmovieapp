import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../AllCss/Home.css";

export default function HomePage() {
  const api_key = "4755bfd52ed699ba65ceafa0d34e55d2";
  const [page, setPage] = useState(1);

  const moviesUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=${page}`;
  const tvUrl = `https://api.themoviedb.org/3/tv/popular?api_key=${api_key}&page=${page}`;

  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [moviesRes, tvRes] = await Promise.all([
          axios.get(moviesUrl),
          axios.get(tvUrl),
        ]);
        setMovies(moviesRes.data.results);
        setTvShows(tvRes.data.results);
        console.log(tvRes.data.results);
      } catch (error) {
        console.error("Error fetching TMDB data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [page]);

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="homepage-container">
      <h2 className="section-title">🍿 Popular Movies</h2>
      <div className="horizontal-scroll">
        {movies.slice(0, 10).map((movie) => (
          <Link key={movie.id} to={`/details/movie/${movie.id}`} className="card-link">
            <div className="card">
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
              />
              <p className="card-title">{movie.title}</p>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="section-title">📺 Popular TV Shows</h2>
      <div className="horizontal-scroll">
        {tvShows.slice(0, 10).map((show) => (
          <Link key={show.id} to={`/details/tv/${show.id}`} className="card-link">
            <div className="card">
              <img
                src={`https://image.tmdb.org/t/p/w300${show.poster_path}`}
                alt={show.name}
              />
              <p className="card-title">{show.name}</p>
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
