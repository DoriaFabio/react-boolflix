import { useMemo } from "react";
import { Link } from "react-router-dom";
import { FiFilm, FiTrash2 } from "react-icons/fi";
import { useGlobalContext } from "../context/GlobalContext";

function Favourites() {
  const { favourites, removeFromFavourites } = useGlobalContext();

  const items = useMemo(() => {
    return [...favourites].sort((a, b) => (b.addedAt ?? 0) - (a.addedAt ?? 0));
  }, [favourites]);

  if (!items.length) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 text-white text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
          <FiFilm size={24} />
        </div>
        <h1 className="text-3xl font-extrabold mb-2">La tua lista dei preferiti è vuota</h1>
        <p className="text-gray-300 mb-6">
          Aggiungi film e serie dalla pagina dettaglio per tenerli d&apos;occhio.
        </p>
        <Link
          to="/"
          className="inline-block bg-red-600 hover:bg-red-700 transition-colors px-5 py-2 rounded-full font-semibold"
        >
          Scopri i popolari
        </Link>
      </div>
    );
  }

  return (
      <div className="max-w-6xl mx-auto px-6 py-8 text-white">
        <h1 className="text-3xl font-bold mb-6 myh3">Favourites</h1>
  
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-5">
          {items.map((it) => (
            <li key={`${it.type}:${it.id}`} className="group relative">
              {/* Card */}
              <Link
                to={`/${it.type}/${it.id}`} // adatta al tuo schema di routing
                className="block"
              >
                <div className="aspect-[2/3] rounded-xl overflow-hidden bg-neutral-800 shadow ring-1 ring-white/10">
                  {it.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w342${it.poster_path}`}
                      alt={it.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Nessun film/serie tv
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <h3 className="font-semibold text-sm line-clamp-1">{it.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="uppercase">{it.type}</span>
                    {typeof it.vote_average === "number" && (
                      <>
                        <span>•</span>
                        <span>{it.vote_average.toFixed(1)}/10</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
  
              {/* Pulsante rimuovi */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  removeFromFavourites(it.type, it.id);
                }}
                className="absolute top-2 right-2 inline-flex items-center justify-center
                           w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 border border-white/10
                           opacity-0 group-hover:opacity-100 transition-opacity"
                title="Rimuovi dalla Watchlist"
                aria-label={`Rimuovi ${it.title} dalla Watchlist`}
              >
                <FiTrash2 />
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
}

export default Favourites