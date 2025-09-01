import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import "../AllCss/Details.css";


export default function DetailsPage() {
  const { type, id } = useParams();
  const api_key = "4755bfd52ed699ba65ceafa0d34e55d2";

  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [simMovies, setSimMovies] = useState([]);
  const [simTvShows, setSimTvShows] = useState([])
  const [movieYt, setMovieYt] = useState([])
  const [tvYt, setTvYt] = useState([])
  const [showTrailer, setShowTrailer] = useState(false)

  useEffect(() => {
    async function fetchDetails() {
      try {
        const detailsRes = await axios.get(
          `https://api.themoviedb.org/3/${type}/${id}?api_key=${api_key}`
        );
        setDetails(detailsRes.data);

        const creditsRes = await axios.get(
          `https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${api_key}`
        );
        setCast(creditsRes.data.cast);

        if (type === "movie") {
          const similarMovies = await axios.get(
            `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${api_key}`
          );
          setSimMovies(similarMovies.data.results);
        } else if (type === "tv") {
          const similarTvShows = await axios.get(
            `https://api.themoviedb.org/3/tv/${id}/similar?api_key=${api_key}`
          );
          setSimTvShows(similarTvShows.data.results);
        }

      } catch (error) {
        console.error("Error fetching details:", error);
      }
    }
    fetchDetails();

  }, [type, id]);

  async function playVideo() {
    if (type === "movie") {
      const MovieYtRes = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${api_key}`
      );
      setMovieYt(MovieYtRes.data.results)
      console.log(MovieYtRes.data.results)
    } else if (type === "tv") {
      const TvYtRes = await axios.get(
        `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${api_key}`
      );
      setTvYt(TvYtRes.data.results)
      console.log(TvYtRes.data.results)
    }
    setShowTrailer(true)
  }

  function closeTrailer() {
    setShowTrailer(false)
  }

  if (!details) return <p className="loading">Loading...</p>;

  return (
    <div className="details-container">
      <div className="details-header">
        <img
          src={`https://image.tmdb.org/t/p/w300${details.poster_path}`}
          alt={details.title || details.name}
          className="details-poster"
        />

        <div className="details-info">
          <h1>{details.title || details.name}</h1>
          <p>{details.overview}</p>
          <p className="rating">Rating: {details.vote_average} ⭐</p>
          <p className="release">
            Release Date: {details.release_date || details.first_air_date}
          </p>

          {showTrailer ? (
            <>
              {type === "movie" &&
                movieYt.slice(0, 1).map((movieTrailer) => (
                  movieTrailer.site === "YouTube" ? (
                    <div key={movieTrailer.id} className="trailer">
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
                ))
              }
              {type === "tv" &&
                tvYt.slice(0, 1).map((tvTrailer) => (
                  tvTrailer.site === "YouTube" ? (
                    <div key={tvTrailer.id} className="trailer">
                      <iframe
                        width="560"
                        height="315"
                        src={`https://www.youtube.com/embed/${tvTrailer.key}`}
                        title={tvTrailer.name}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : null
                ))
              }
              <button className="trailer-btn close" onClick={closeTrailer}>❌ Close Trailer</button>
            </>
          ) : (
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


      {type === "movie" && simMovies.length > 0 && (
        <>
          <h2 className="similar-title">Similar Movies</h2>
          <div className="similar-list">
            {simMovies.slice(0, 10).map((similar) => (
              <Link key={similar.id} to={`/details/movie/${similar.id}`}>
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
        </>
      )}

      {type === "tv" && simTvShows.length > 0 && (
        <>
          <h2 className="similar-title">Similar Tv Shows</h2>
          <div className="similar-list">
            {simTvShows.slice(0, 10).map((similarTv) => (
              <Link key={similarTv.id} to={`/details/tv/${similarTv.id}`}>
                <div className="similar-card">
                  <img
                    src={`https://image.tmdb.org/t/p/w300${similarTv.poster_path}`}
                    alt={similarTv.name}
                    className="similar-poster"
                  />
                  <div className="similar-info">
                    <h2>{similarTv.name}</h2>
                    <p>{similarTv.first_air_date || "N/A"}</p>
                    <p className="similar-rating">⭐ {similarTv.vote_average}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
