import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../AllCss/Movies.css";
import { FavoritesContext } from "../context/FavoritesContext";

export default function Movies() {
  const api_key = "4755bfd52ed699ba65ceafa0d34e55d2";
  const [page, setPage] = useState(() => {
    const savedPage = localStorage.getItem("moviepage")
    return savedPage ? Number(savedPage) : 1
  });

  const [totalPages, setTotalPages] = useState(1)
  const moviesUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=${page}`;

  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  const [movies, setMovies] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await axios.get(moviesUrl);
        setTotalPages(res.data.total_pages)
        setMovies(res.data.results);
      } catch (error) {
        console.log("Failed to fetch", error);
      } finally {
        setLoader(false);
      }
    }
    fetchMovies();
  }, [page]);

  useEffect(() => {
    localStorage.setItem("moviepage", page)
  }, [page])

  if (loader) return <h2 className="loading">Loading...</h2>;

  return (
    <div className="movies-page">
      <h2 className="section-title">🎬 Popular Movies</h2>

      <div className="movies-container">
        {movies.slice(0, 14).map((movie) => {
          const isFav = favorites.some((fav) => fav.id === movie.id);

          return (
            <div key={movie.id} className="movie-card">
              <Link to={`/movie/${movie.id}`} className="movie-card-link">
                <img
                  src={`https://image.tmdb.org/t/p/w400${movie.poster_path}`}
                  alt={movie.title}
                  className="movie-poster"
                />
                <div className="movie-info">
                  <h3 className="movie-title">{movie.title}</h3>
                  <p className="movie-date">{movie.release_date}</p>
                </div>
              </Link>

              <button
                className={`fav-btn ${isFav ? "remove" : "add"}`}
                onClick={() => toggleFavorite(movie.id, "movie", isFav)}
              >
                {isFav ? "❤️ Remove from Favorites" : "🤍 Add to Favorites"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          ⬅ Previous
        </button>
        <span>Page {page}</span>
        <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next ➡</button>
      </div>
    </div>
  );
}
