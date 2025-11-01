import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";
import { FiPlay, FiPlus, FiStar } from "react-icons/fi";

function DetailPage() {
  const { id, type } = useParams();
  const { fetchById, addToWatchlist } = useGlobalContext(); // opzionale: esponi addToWatchlist
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    async function loadDetails() {
      try {
        setLoading(true);
        const data = await fetchById(type, id); // idealmente include credits
        setDetails(data);
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

  // Estrai regista e cast (fallback sicuro se credits non arriva)
  const director =
    details?.credits?.crew?.find((c) => c.job === "Director") || null;

  const creators =
    type === "tv" && Array.isArray(details?.created_by) ? details.created_by : [];

  const cast = useMemo(() => {
    if (!details?.credits?.cast) return [];
    // priorità ai ruoli principali
    return details.credits.cast
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
      .slice(0, 12);
  }, [details]);

  // Valutazione 0–10 -> stelle 0–5
  const stars = useMemo(() => {
    const score = Number(details?.vote_average || 0);
    const five = Math.round(score) / 2; // 7.8 -> 4
    return Math.max(0, Math.min(5, five));
  }, [details]);

  if (loading) {
    return (
      <div className="animate-pulse max-w-5xl mx-auto my-10 px-6">
        <div className="h-56 rounded-2xl bg-neutral-800 mb-6" />
        <div className="flex gap-6">
          <div className="w-40 h-60 rounded-xl bg-neutral-800" />
          <div className="flex-1 space-y-3">
            <div className="h-8 w-3/4 bg-neutral-800 rounded" />
            <div className="h-4 w-1/2 bg-neutral-800 rounded" />
            <div className="h-20 w-full bg-neutral-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-5 text-red-500">
        Errore: {error}
      </p>
    );
  }

  if (!details) return null;

  const title = details.title || details.name;
  const releaseDate = details.release_date || details.first_air_date;
  const backdrop = details.backdrop_path
    ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
    : null;

  return (
    <div className="text-white">
      {/* HERO con backdrop e gradiente */}
      <section
        className="relative w-full min-h-[280px] md:min-h-[360px] flex items-end"
        style={{
          backgroundImage: backdrop ? `url(${backdrop})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-label="Immagine di copertina"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="relative max-w-5xl mx-auto w-full px-6 py-6">
          <h1 className="text-3xl md:text-5xl font-extrabold drop-shadow">
            {title}
          </h1>
          {details.tagline && (
            <h2 className="italic text-gray-300 mt-2 drop-shadow">
              {details.tagline}
            </h2>
          )}

          {/* CTA */}
          <div className="flex gap-3 mt-4">
            {trailer && (
              <a
                href={`https://www.youtube.com/watch?v=${trailer.key}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 transition-colors px-4 py-2 rounded-full font-semibold"
              >
                <FiPlay className="text-white" />
                Guarda trailer
              </a>
            )}
            <button
              type="button"
              onClick={() => addToWatchlist?.(details)} // opzionale
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 rounded-full"
            >
              <FiPlus />
              Aggiungi a Watchlist
            </button>
          </div>
        </div>
      </section>

      {/* Corpo pagina */}
      <div className="max-w-5xl mx-auto px-6 mt-6 md:mt-8">
        <div className="bg-black/60 backdrop-blur rounded-2xl shadow-xl border border-white/10 p-5">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Poster */}
            {details.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
                alt={`Poster di ${title}`}
                className="rounded-xl shadow-lg w-40 md:w-48 h-auto object-cover"
                loading="lazy"
              />
            )}

            {/* Testo principale */}
            <div className="flex-1">
              {/* Voto con stelle */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar
                      key={i}
                      className={
                        i < Math.round(stars)
                          ? "text-yellow-400"
                          : "text-neutral-600"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-300">
                  {details.vote_average?.toFixed(1)} / 10
                </span>
              </div>

              {/* Trama con “Mostra altro” */}
              {details.overview && (
                <div className="text-gray-200 mb-4">
                  <p className={!expanded ? "line-clamp-4 md:line-clamp-5" : ""}>
                    {details.overview}
                  </p>
                  {details.overview.length > 260 && (
                    <button
                      type="button"
                      onClick={() => setExpanded((v) => !v)}
                      className="text-red-500 hover:text-red-400 font-semibold mt-2"
                    >
                      {expanded ? "Mostra meno" : "Mostra altro"}
                    </button>
                  )}
                </div>
              )}

              {/* Generi */}
              {details.genres?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {details.genres.map((g) => (
                    <span
                      key={g.id}
                      className="bg-white/10 border-white/10 text-white px-3 py-1 rounded-full text-sm"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>)}

              {/* Info tecniche */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-300">
                <p><strong>Tipo:</strong> {type === "movie" ? "Film" : "Serie TV"}</p>
                <p><strong>Data di uscita:</strong> {releaseDate || "—"}</p>

                {type === "movie" && <p><strong>Durata:</strong> {details.runtime ? `${details.runtime} min` : "—"}</p>}
                {type === "tv" && <p><strong>Episodi:</strong> {details.number_of_episodes ?? "—"}</p>}
                {type === "tv" && <p><strong>Stagioni:</strong> {details.number_of_seasons ?? "—"}</p>}

                <p><strong>Lingue:</strong> {details.spoken_languages?.map((l) => l.english_name).join(", ") || "—"}</p>
                <p><strong>Produzione:</strong> {details.production_companies?.map((p) => p.name).join(", ") || "—"}</p>

                {typeof details.budget === "number" && details.budget > 0 && (
                  <p><strong>Budget:</strong> ${details.budget.toLocaleString()}</p>
                )}
                {typeof details.revenue === "number" && details.revenue > 0 && (
                  <p className={(details.budget > details.revenue) ? "text-red-500" : "text-green-500"}>
                    <strong>Incassi:</strong> ${details.revenue.toLocaleString()}
                  </p>
                )}
                <p><strong>Stato:</strong> {details.status || "—"}</p>

                {/* Regista / Creatori */}
                {type === "movie" && (
                  <p><strong>Regia:</strong> {director ? director.name : "—"}</p>
                )}
                {type === "tv" && creators?.length > 0 && (
                  <p><strong>Creato da:</strong> {creators.map(c => c.name).join(", ")}</p>
                )}
              </div>
            </div>
          </div>

          {/* Cast orizzontale */}
          {cast.length > 0 && (
            <div className="mt-8">
              <h3 className="text-2xl font-semibold mb-3">🎭 Cast principale</h3>
              <div className="flex gap-4 overflow-x-hidden pb-2 scroll-none snap-x">
                {cast.map((p) => (
                  <div key={p.cast_id ?? p.credit_id ?? p.id} className="min-w-[120px] snap-start">
                    <div className="w-[120px] h-[170px] bg-neutral-800 rounded-lg overflow-hidden">
                      {p.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w200${p.profile_path}`}
                          alt={p.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                          Nessuna foto
                        </div>
                      )}
                    </div>
                    <p className="mt-2 font-semibold text-sm">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetailPage;
