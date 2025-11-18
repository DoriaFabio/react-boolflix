import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";
import HeroDetail from "../components/HeroDetail";
import CastComponent from "../components/CastComponent";
import DirectorMoviesOverlay from "../components/DirectorMoviesOverlay";
import { FiStar } from "react-icons/fi";

function DetailPage() {
  const { id, type } = useParams();
  const { fetchById, addToWatchlist, removeFromWatchlist, isInWatchlist, isInFavourites, addToFavourites, removeFromFavourites, fetchMoviesByDirector } = useGlobalContext();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [showDirectorOverlay, setShowDirectorOverlay] = useState(false);
  const [selectedDirector, setSelectedDirector] = useState(null);

  useEffect(() => {
    async function loadDetails() {
      try {
        setLoading(true);
        const data = await fetchById(type, id);
        setDetails(data);
        console.log(data);
      } catch (err) {
        setError(err.message || "Impossibile caricare i dettagli");
      } finally {
        setLoading(false);
      }
    }
    loadDetails();
  }, [id, type, fetchById]);

  const trailer = details?.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

  const director = details?.credits?.crew?.find((c) => c.job === "Director") || null;
  const creators = type === "tv" && Array.isArray(details?.created_by) ? details.created_by : [];

  const cast = useMemo(() => {
    if (!details?.credits?.cast) return [];
    return details.credits.cast
      .slice()
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
      .slice(0, 12);
  }, [details]);

  const stars = useMemo(() => {
    const score = Number(details?.vote_average || 0);
    const five = Math.round(score) / 2;
    return Math.max(0, Math.min(5, five));
  }, [details]);

  if (loading) return <h3 className="text-center mt-10 text-3xl">Loading...</h3>;
  if (error) return <h3 className="text-center mt-10 text-3xl">Data display error</h3>;
  if (!details) return null;

  const title = details.title || details.name;
  const releaseDate = details.release_date || details.first_air_date;
  const backdrop = details.backdrop_path
    ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
    : null;

  //!  stato watchlist calcolato con il context
  const inList = isInWatchlist(type, details.id);
  const inList2 = isInFavourites(type, details.id); 
  const handleToggleWatchlist = () => {
    if (inList) removeFromWatchlist(type, details.id);
    else addToWatchlist(details);
  };
  const handleToggleFavorite = () => {
    if (inList2) removeFromFavourites(type, details.id);
    else addToFavourites(details);
  }
  const handleDirectorClick = () => {
    if (director) {
      setSelectedDirector(director);
      setShowDirectorOverlay(true);
    }
  };

  return (
    <div className="text-white">
      <HeroDetail
        title={title}
        tagline={details.tagline}
        backdrop={backdrop}
        trailerKey={trailer?.key}
        inWatchlist={inList}
        inFavourite={inList2}
        onToggleWatchlist={handleToggleWatchlist}
        onToggleFavorite={handleToggleFavorite}
      />

      <div className="max-w-5xl mx-auto px-6 mt-4 md:mt-4">
        <div className="bg-black/60 backdrop-blur rounded-2xl shadow-xl border border-white/10 p-5">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {details.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
                alt={`Poster di ${title}`}
                className="rounded-xl shadow-lg w-40 md:w-48 h-auto object-cover"
                loading="lazy"
              />
            )}

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar
                      key={i}
                      className={i < Math.round(stars) ? "text-yellow-400" : "text-neutral-600"}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-300">
                  {details.vote_average?.toFixed(1)} / 10
                </span>
              </div>

              {details.overview && (
                <div className="text-gray-200 mb-4">
                  <p className={!expanded ? "line-clamp-3" : ""}>{details.overview}</p>
                  {details.overview.length > 275 && (
                    <button
                      type="button"
                      onClick={() => setExpanded((v) => !v)}
                      className="text-red-500 hover:text-red-400 font-semibold mt-2"
                    >
                      {expanded ? "Show less" : "Show more"}
                    </button>
                  )}
                </div>
              )}

              {details.genres?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {details.genres.map((g) => (
                    <span
                      key={g.id}
                      className="bg-white/10 border border-white/10 text-white px-3 py-1 rounded-full text-sm"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-300">
                <p><strong>Type:</strong> {type === "movie" ? "Film" : "Serie TV"}</p>
                <p><strong>Release Date:</strong> {releaseDate || "—"}</p>
                {type === "movie" && <p><strong>Runtime:</strong> {details.runtime ? `${details.runtime} min` : "—"}</p>}
                {type === "tv" && <p><strong>Episodes:</strong> {details.number_of_episodes ?? "—"}</p>}
                {type === "tv" && <p><strong>Seasons:</strong> {details.number_of_seasons ?? "—"}</p>}
                <p><strong>Languages:</strong> {details.spoken_languages?.map((l) => l.english_name).join(", ") || "—"}</p>
                <p><strong>Production:</strong> {details.production_companies?.map((p) => p.name).join(", ") || "—"}</p>
                {typeof details.budget === "number" && details.budget > 0 && (
                  <p><strong>Budget:</strong> ${details.budget.toLocaleString()}</p>
                )}
                {typeof details.revenue === "number" && details.revenue > 0 && (
                  <p className={(details.budget > details.revenue) ? "text-red-500" : (!details.budget) ? "text-gray-300" : "text-green-500"}>
                    <strong>Revenue:</strong> ${details.revenue.toLocaleString()}
                  </p>
                )}
                <p><strong>Status:</strong> {details.status || "—"}</p>
                {type === "movie" && (
                  <p>
                    <strong>Director:</strong>{" "}
                    {director ? (
                      <button
                        type="button"
                        onClick={handleDirectorClick}
                        className="text-red-500 hover:text-red-400 underline transition-colors cursor-pointer"
                      >
                        {director.name}
                      </button>
                    ) : (
                      "—"
                    )}
                  </p>
                )}
                {type === "tv" && creators?.length > 0 && (
                  <p><strong>Create by:</strong> {creators.map((c) => c.name).join(", ")}</p>
                )}
              </div>
            </div>
          </div>
          {cast.length > 0 && <CastComponent cast={cast} />}
        </div>
      </div>

      {/* Overlay per i film del regista */}
      <DirectorMoviesOverlay
        isOpen={showDirectorOverlay}
        onClose={() => setShowDirectorOverlay(false)}
        director={selectedDirector}
        fetchMoviesByDirector={fetchMoviesByDirector}
      />
    </div>
  );
}

export default DetailPage;
