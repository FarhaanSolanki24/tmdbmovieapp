import axios from "axios";
import { useEffect, useState } from "react";
import "../AllCss/TvShows.css";
import { Link } from "react-router-dom";

export default function TvShows() {
  const [page, setPage] = useState(1);
  const api_key = "4755bfd52ed699ba65ceafa0d34e55d2";
  const tvUrl = `https://api.themoviedb.org/3/tv/popular?api_key=${api_key}&page=${page}`;

  const [tvShows, setTvShows] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    async function fetchTvDetails() {
      try {
        const tvdataRes = await axios.get(tvUrl);
        setTvShows(tvdataRes.data.results);
      } catch (error) {
        console.log("Failed to fetch Tv Shows", error);
      } finally {
        setLoader(false);
      }
    }
    fetchTvDetails();
  }, [page]);

  if (loader) return <h2 className="loading">Loading...</h2>;

  return (
    <div className="tv-page">
      <h2 className="section-title">📺 Popular TV Shows</h2>

      <div className="tv-container">
        {tvShows.slice(0, 14).map((show) => (
          <Link key={show.id} to={`/tvshow/${show.id}`} className="tv-card-link">
            <div className="tv-card">
              <img
                src={`https://image.tmdb.org/t/p/w400${show.poster_path}`}
                alt={show.name}
                className="tv-poster"
              />
              <p className="tv-title">{show.name}</p>
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
