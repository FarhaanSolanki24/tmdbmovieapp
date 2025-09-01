import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FavoritesContext } from "../context/FavoritesContext";
import "../AllCss/Movies.css";

export default function Favorites() {
    const { favorites, toggleFavorite } = useContext(FavoritesContext);

    const [page, setPage] = useState(() => {
        const savedPage = localStorage.getItem("favPage");
        return savedPage ? Number(savedPage) : 1;
    });

    const itemsPerPage = 7;

    useEffect(() => {
        localStorage.setItem("favPage", page);
    }, [page]);

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentFavorites = favorites.slice(startIndex, endIndex);

    const totalPages = Math.ceil(favorites.length / itemsPerPage);

    if (favorites.length === 0) {
        return <h2 style={{ textAlign: "center" }}>No Favorites yet ❤️</h2>;
    }

    return (
        <div className="movies-page">
            <h2 className="section-title">⭐ Your Favorites</h2>

            <div className="movies-container">
                {currentFavorites.map((fav) => {
                    const isFav = favorites.some((f) => f.id === fav.id);

                    return (
                        <div key={fav.id} className="movie-card">
                            <Link
                                to={`/details/${fav.media_type}/${fav.id}`}
                                className="movie-card-link"
                            >
                                <img
                                    src={`https://image.tmdb.org/t/p/w400${fav.poster_path}`}
                                    alt={fav.title || fav.name}
                                    className="movie-poster"
                                />
                                <div className="movie-info">
                                    <h3 className="movie-title">{fav.title || fav.name}</h3>
                                    <p className="movie-date">
                                        {fav.release_date || fav.first_air_date}
                                    </p>
                                </div>
                            </Link>

                            <button
                                className="fav-btn"
                                onClick={() => toggleFavorite(fav.id, fav.media_type, isFav)}
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
                <span>
                    Page {page} of {totalPages}
                </span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                >
                    Next ➡
                </button>
            </div>
        </div>
    );
}
