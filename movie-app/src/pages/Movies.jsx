import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../AllCss/Movies.css";

export default function Movies() {
  const api_key = "4755bfd52ed699ba65ceafa0d34e55d2";
  const [page, setPage] = useState(1);
  const moviesUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=${page}`;

  const [movies, setMovies] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await axios.get(moviesUrl);
        setMovies(res.data.results);
      } catch (error) {
        console.log("Failed to fetch", error);
      } finally {
        setLoader(false);
      }
    }
    fetchMovies();
  }, [page]);

  if (loader) return <h2 className="loading">Loading...</h2>;

  return (
    <div className="movies-page">
      <h2 className="section-title">🎬 Popular Movies</h2>

      <div className="movies-container">
        {movies.slice(0, 14).map((movie) => (
          <Link key={movie.id} to={`/movie/${movie.id}`} className="movie-card-link">
            <div className="movie-card">
              <img
                src={`https://image.tmdb.org/t/p/w400${movie.poster_path}`}
                alt={movie.title}
                className="movie-poster"
              />
              <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <p className="movie-date">{movie.release_date}</p>
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
