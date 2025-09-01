import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../AllCss/MovieDetails.css";

export default function MovieDetails() {
    const { id } = useParams();
    const api_key = "4755bfd52ed699ba65ceafa0d34e55d2";

    const [details, setDetails] = useState(null);
    const [cast, setCast] = useState([]);
    const [simMovies, setSimMovies] = useState([]);
    const [movieYt, setMovieYt] = useState([])
    const [showTrailer, setShowTrailer] = useState(false)

    useEffect(() => {
        async function fetchMovieDetails() {
            try {
                const moviedetRes = await axios.get(
                    `https://api.themoviedb.org/3/movie/${id}?api_key=${api_key}`
                );
                setDetails(moviedetRes.data);

                const moviecastRes = await axios.get(
                    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${api_key}`
                );
                setCast(moviecastRes.data.cast);

                const similarMovies = await axios.get(
                    `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${api_key}`
                );
                setSimMovies(similarMovies.data.results);
            } catch (error) {
                console.log("Failed to fetch movie details", error);
            }
        }
        fetchMovieDetails();
    }, [id]);

    async function playVideo() {

        const MovieYtRes = await axios.get(
            `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${api_key}`
        );
        setMovieYt(MovieYtRes.data.results)
        console.log(MovieYtRes.data.results)
        setShowTrailer(true)
    }

    function closeTrailer() {
        setShowTrailer(false)
    }

    if (!details) return <h2>Loading....</h2>;

    return (
        <div className="details-container">
            <div className="details-header">
                <img
                    src={`https://image.tmdb.org/t/p/w300${details.poster_path}`}
                    alt={details.title || details.name}
                    className="details-poster"
                />
                <div className="details-info">
                    <h2>{details.title}</h2>
                    <p>{details.overview}</p>
                    <p className="rating">Rating: {details.vote_average} ⭐</p>
                    <p className="release">
                        Release Date: {details.release_date || details.first_air_date}
                    </p>

                    {showTrailer ? (
                        <div>
                            {movieYt.slice(0, 1).map((movieTrailer) => (
                                movieTrailer.site === "YouTube" ? (
                                    <div key={movieTrailer.id}>
                                        <iframe
                                            width="560"
                                            height="315"
                                            src={`https://www.youtube.com/embed/${movieTrailer.key}`}
                                            title={movieTrailer.name}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                ) : null
                            ))}
                             <button className="trailer-btn close" onClick={closeTrailer}>❌ Close Trailer</button>
                        </div>
                    ) : 
                    (
                        <button className="trailer-btn" onClick={playVideo}>🎬 Play Trailer</button>
                    )}
                </div>
            </div>

            <h2 className="cast-title">Top Cast</h2>
            <div className="cast-list">
                {cast.slice(0, 10).map((actor) => (
                    <div key={actor.id} className="cast-card">
                        {actor.profile_path ? (
                            <img
                                src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                                alt={actor.name}
                            />
                        ) : (
                            <div className="placeholder" />
                        )}
                        <p className="actor-name">{actor.name}</p>
                        <small className="actor-role">as {actor.character}</small>
                    </div>
                ))}
            </div>

            <h2 className="similar-title">Similar Movies</h2>
            <div className="similar-list">
                {simMovies.slice(0, 10).map((similar) => (
                    <Link key={similar.id} to={`/movie/${similar.id}`}>
                        <div className="similar-card">
                            <img
                                src={`https://image.tmdb.org/t/p/w300${similar.poster_path}`}
                                alt={similar.title}
                                className="similar-poster"
                            />
                            <div className="similar-info">
                                <h2>{similar.title}</h2>
                                <p>{similar.release_date || "N/A"}</p>
                                <p className="similar-rating">⭐ {similar.vote_average}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
