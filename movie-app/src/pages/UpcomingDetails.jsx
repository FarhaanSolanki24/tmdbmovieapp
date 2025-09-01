import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../AllCss/UpcomingDetails.css";

export default function UpcomingDetails() {
  const { id } = useParams();
  const api_key = "4755bfd52ed699ba65ceafa0d34e55d2";

  const [upcomingDetails, setUpcomingDetails] = useState(null);
  const [upcomingCast, setUpcomingCast] = useState([]);
  const [loader, setLoader] = useState(true);
  const [movieYt, setMovieYt] = useState([]);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    async function fetchUpcomingDetails() {
      try {
        const detailsRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${api_key}`
        );
        setUpcomingDetails(detailsRes.data);

        const castRes = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${api_key}`
        );
        setUpcomingCast(castRes.data.cast);
      } catch (error) {
        console.log("Failed to get details", error);
      } finally {
        setLoader(false);
      }
    }
    fetchUpcomingDetails();
  }, [id]);

  async function playVideo() {
    const MovieYtRes = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${api_key}`
    );
    setMovieYt(MovieYtRes.data.results);
    setShowTrailer(true);
  }

  function closeTrailer() {
    setShowTrailer(false);
  }

  if (loader) return <h2 className="loading">Loading...</h2>;

  return (
    <div className="details-container">
      {/* 🎬 Banner Section */}
      <div
        className="movie-banner"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w1280${upcomingDetails.backdrop_path})`,
        }}
      >
        <div className="overlay">
          <div className="movie-info">
            <img
              src={`https://image.tmdb.org/t/p/w300${upcomingDetails.poster_path}`}
              alt={upcomingDetails.title}
              className="poster"
            />
            <div className="text-content">
              <h2>{upcomingDetails.title}</h2>
              <p className="tagline">{upcomingDetails.tagline}</p>
              <p className="overview">{upcomingDetails.overview}</p>
              <p>
                ⭐ <strong>Rating:</strong> {upcomingDetails.vote_average.toFixed(1)} / 10
              </p>
              <p>
                📅 <strong>Release:</strong> {upcomingDetails.release_date}
              </p>
              <p>
                ⏳ <strong>Runtime:</strong> {upcomingDetails.runtime} mins
              </p>

              {showTrailer ? (
                <div className="trailer">
                  {movieYt
                    .filter((vid) => vid.site === "YouTube")
                    .slice(0, 1)
                    .map((movieTrailer) => (
                      <iframe
                        key={movieTrailer.id}
                        src={`https://www.youtube.com/embed/${movieTrailer.key}`}
                        title={movieTrailer.name}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ))}
                  <button className="trailer-btn close" onClick={closeTrailer}>
                    ❌ Close Trailer
                  </button>
                </div>
              ) : (
                <button className="trailer-btn" onClick={playVideo}>
                  🎬 Play Trailer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 👥 Cast Section */}
      <div className="cast-section">
        <h3 className="cast-title">Top Cast</h3>
        <div className="cast-list">
          {upcomingCast.slice(0, 12).map((cast) => (
            <div key={cast.id} className="cast-card">
              <img
                src={
                  cast.profile_path
                    ? `https://image.tmdb.org/t/p/w200${cast.profile_path}`
                    : "https://via.placeholder.com/200x300?text=No+Image"
                }
                alt={cast.name}
              />
              <p className="actor-name">{cast.name}</p>
              <small className="actor-role">as {cast.character}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
