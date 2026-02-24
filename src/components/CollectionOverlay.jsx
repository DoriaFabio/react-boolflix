import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiX } from "react-icons/fi";

function CollectionOverlay({ isOpen, onClose, collection, fetchCollection }) {
  const [movies, setMovies] = useState([]);
  const [collectionData, setCollectionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadCollection = useCallback(async () => {
    if (!collection?.id) return;
    try {
      setLoading(true);
      const data = await fetchCollection(collection.id);
      setCollectionData(data);
      setMovies(data?.parts || []);
    } catch (error) {
      console.error("Errore nel caricamento della collezione:", error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, [collection?.id, fetchCollection]);

  useEffect(() => {
    if (isOpen && collection?.id) {
      loadCollection();
    }
  }, [isOpen, collection?.id, loadCollection]);

  const handleMovieClick = (movieId) => {
    onClose();
    navigate(`/movie/${movieId}`);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-neutral-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-neutral-900/95 backdrop-blur border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Collection</h2>
            <p className="text-red-500 text-lg font-semibold">{collection?.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            aria-label="Chiudi overlay"
          >
            <FiX className="text-gray-400 text-2xl" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(80vh-88px)] p-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Loading...</p>
            </div>
          ) : movies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No movies found</p>
            </div>
          ) : (
            <>
              {collectionData?.overview && (
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  {collectionData.overview}
                </p>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                {movies
                  .slice()
                  .sort((a, b) => new Date(a.release_date || 0) - new Date(b.release_date || 0))
                  .map((movie) => (
                    <div
                      key={movie.id}
                      className="group cursor-pointer"
                      onClick={() => handleMovieClick(movie.id)}
                    >
                      <div className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 group-hover:scale-105">
                        {movie.poster_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            className="w-full h-auto object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full aspect-[2/3] bg-neutral-800 flex items-center justify-center">
                            <p className="text-gray-500 text-sm px-2 text-center">
                              Image not available
                            </p>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <h3 className="text-white text-sm font-medium mt-2 line-clamp-2 group-hover:text-red-500 transition-colors">
                        {movie.title}
                      </h3>
                      {movie.release_date && (
                        <p className="text-gray-400 text-xs mt-1">
                          {new Date(movie.release_date).getFullYear()}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CollectionOverlay;
