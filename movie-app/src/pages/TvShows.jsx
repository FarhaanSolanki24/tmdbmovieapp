import axios from "axios";
import { useContext, useEffect, useState } from "react";
import "../AllCss/TvShows.css";
import { Link } from "react-router-dom";
import { FavoritesContext } from "../context/FavoritesContext";

export default function TvShows() {
  const [page, setPage] = useState(() => {
    const savedPage = localStorage.getItem("tvpage")
    return savedPage ? Number(savedPage) : 1
  });
  const [totalPages, setTotalPages] = useState(1)

  const api_key = "4755bfd52ed699ba65ceafa0d34e55d2";
  const tvUrl = `https://api.themoviedb.org/3/tv/popular?api_key=${api_key}&page=${page}`;

  const { favorites, toggleFavorite } = useContext(FavoritesContext)

  const [tvShows, setTvShows] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    async function fetchTvDetails() {
      try {
        const tvdataRes = await axios.get(tvUrl);
        setTvShows(tvdataRes.data.results);
        setTotalPages(tvdataRes.data.total_pages)
      } catch (error) {
        console.log("Failed to fetch Tv Shows", error);
      } finally {
        setLoader(false);
      }
    }
    fetchTvDetails();
  }, [page]);

  useEffect(() => {
    localStorage.setItem("tvpage", page)
  }, [page])

  if (loader) return <h2 className="loading">Loading...</h2>;

  return (
    <div className="tv-page">
      <h2 className="section-title">📺 Popular TV Shows</h2>

      <div className="tv-container">
        {tvShows.slice(0, 14).map((show) => {
          const tvFav = favorites.some((fav) => fav.id === show.id)
          return (
            <div key={show.id}>
              <Link to={`/tvshow/${show.id}`} className="tv-card-link">
                <div className="tv-card">
                  <img
                    src={`https://image.tmdb.org/t/p/w400${show.poster_path}`}
                    alt={show.name}
                    className="tv-poster"
                  />
                  <p className="tv-title">{show.name}</p>
                </div>
              </Link>

              <button
                className={`fav-btn ${tvFav ? "remove" : "add"}`}
                onClick={() => toggleFavorite(show.id, "tv", tvFav)}>
                {tvFav ? "❤️ Remove from Favorites" : "🤍 Add to Favorites"}
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
