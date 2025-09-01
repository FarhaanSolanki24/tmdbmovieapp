import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { FavoritesContext } from "../context/FavoritesContext";
import "../AllCss/Search.css"

export default function SearchPage() {
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const query = queryParams.get("query")
    const api_key = "4755bfd52ed699ba65ceafa0d34e55d2";

    const { favorites, toggleFavorite } = useContext(FavoritesContext)

    const [results, setResults] = useState([]);

    useEffect(() => {
        if (query) {
            fetchResults();
        }
    }, [query])

    const fetchResults = async () => {
        try {
            const res = await axios.get(
                `https://api.themoviedb.org/3/search/multi?api_key=${api_key}&query=${query}`
            )
            setResults(res.data.results)
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    }

    return (
        <div className="search-page">
            <h2>Search Results for "{query}"</h2>
            <div className="search-results">
                {results.length > 0 ? (
                    results.map((item) => {
                        const isFav = favorites.some((f) => f.id === item.id)
                        return (
                            <div key={item.id} >
                                <Link to={`/details/${item.media_type}/${item.id}`}>
                                    <div className="result-card">
                                        <img
                                            src={
                                                item.poster_path
                                                    ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                                                    : "https://via.placeholder.com/200x300?text=No+Image"
                                            }
                                            alt={item.title || item.name}
                                        />
                                        <h3>{item.title || item.name}</h3>
                                        <p>{item.media_type}</p>
                                    </div>
                                </Link>
                                <button
                                    className={`fav-btn ${isFav ? "remove" : "add"}`}
                                    onClick={() => toggleFavorite(item.id, item.media_type, isFav)}
                                >
                                    {isFav ? "❤️ Remove" : "🤍 Favorite"}
                                </button>
                            </div>
                        );
                    })
                ) : (
                    <p className="no-results">No Results Found</p>
                )}
            </div>
        </div>
    );

}