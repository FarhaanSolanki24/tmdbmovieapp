import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../AllCss/Home.css";
import { FavoritesContext } from "../context/FavoritesContext";

export default function HomePage() {
  const api_key = "4755bfd52ed699ba65ceafa0d34e55d2";
  const [page, setPage] = useState(() => {
    const savedPage = localStorage.getItem("homepage")
    return savedPage ? Number(savedPage) : 1
  });
  const [totalPages, setTotalPages] = useState(1)

  const moviesUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=${page}`;
  const tvUrl = `https://api.themoviedb.org/3/tv/popular?api_key=${api_key}&page=${page}`;

  const { favorites, toggleFavorite } = useContext(FavoritesContext)

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [moviesRes, tvRes] = await Promise.all([
          axios.get(moviesUrl),
          axios.get(tvUrl),
        ]);
        const combined = [
          ...moviesRes.data.results.map(m => ({ ...m, media_type: "movie" })),
          ...tvRes.data.results.map(t => ({ ...t, media_type: "tv" }))
        ];
        setTotalPages(Math.min(moviesRes.data.total_pages, tvRes.data.total_pages));
        const shuffled = combined.sort(() => 0.5 - Math.random());

        setItems(shuffled);
      } catch (error) {
        console.error("Error fetching TMDB data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [page]);

  useEffect(() => {
    localStorage.setItem("homepage", page)
  }, [page])

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="homepage-container">
      <h2 className="section-title">🔥 Trending Now</h2>
      <div className="grid-container">
        {items.slice(0, 18).map((item) => {
          const fav = favorites.some((f) => f.id === item.id)
          return (
            <div key={item.id}>
              <Link to={`/details/${item.media_type}/${item.id}`} className="card-link">
                <div className="card">
                  <img
                    src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                    alt={item.title || item.name}
                  />
                  <p className="card-title">{item.title || item.name}</p>
                </div>
              </Link>
              <button
                className={`fav-btn ${fav ? "remove" : "add"}`}
                onClick={() => toggleFavorite(item.id, item.media_type, fav)}
              >
                {fav ? "❤️ Remove" : "🤍 Favorite"}
              </button>
            </div>
          )
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
