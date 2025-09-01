import "../AllCss/TvDetails.css"
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function TvDetails() {
  const { id } = useParams();
  const api_key = "4755bfd52ed699ba65ceafa0d34e55d2";

  const [tvDetails, setTvDetails] = useState(null);
  const [tvCast, setTvCast] = useState([]);
  const [simTvShows, setSimTvShows] = useState([])
  const [tvYt, setTvYt] = useState([])
  const [showTrailer, setShowTrailer] = useState(false)

  useEffect(() => {
    async function fetchTvDetails() {
      const tvDetailsRes = await axios.get(
        `https://api.themoviedb.org/3/tv/${id}?api_key=${api_key}`
      );
      setTvDetails(tvDetailsRes.data);

      const tvCastRes = await axios.get(
        `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${api_key}`
      );
      setTvCast(tvCastRes.data.cast);

      const similarTvShows = await axios.get(
        `https://api.themoviedb.org/3/tv/${id}/similar?api_key=${api_key}`
      );
      setSimTvShows(similarTvShows.data.results);
    }
    fetchTvDetails();
  }, [id]);

  async function playVideo() {

    const TvYtRes = await axios.get(
      `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${api_key}`
    );
    setTvYt(TvYtRes.data.results)
    console.log(TvYtRes.data.results)

    setShowTrailer(true)
  }

  function closeTrailer() {
    setShowTrailer(false)
  }

  if (!tvDetails) return <h2>Loading...</h2>;

  return (
    <div className="details-container">
      <div className="details-header">
        <img
          src={`https://image.tmdb.org/t/p/w300${tvDetails.poster_path}`}
          alt={tvDetails.name}
          className="details-poster"
        />

        <div className="details-info">
          <h2>{tvDetails.name}</h2>
          <p>{tvDetails.overview}</p>
          <p className="rating">Rating: {tvDetails.vote_average} ⭐</p>
          <p className="release">
            First Air Date: {tvDetails.first_air_date}
          </p>
          {showTrailer ? (
            <>
              {tvYt.slice(0, 1).map((tvTrailer) => (
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
              ))}
              <button className="trailer-btn close" onClick={closeTrailer}>❌ Close Trailer</button>
            </>
          ) : (
            <button className="trailer-btn" onClick={playVideo}>🎬 Play Trailer</button>
          )}
        </div>
      </div>

      <h2 className="cast-title">Top Cast</h2>
      <div className="cast-list">
        {tvCast.slice(0, 10).map((actor) => (
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

      <h2 className="similar-title">Similar Tv Shows</h2>
      <div className="similar-list">
        {simTvShows.slice(0, 10).map((similarTv) => (
          <Link key={similarTv.id} to={`/tvshow/${similarTv.id}`}>
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
    </div>
  );
}
