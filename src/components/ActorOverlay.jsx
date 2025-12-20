import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiX } from "react-icons/fi";

/**
 * ActorOverlay
 * Overlay modale che mostra informazioni dettagliate su un attore
 * inclusi biografia, età, data di nascita e filmografia
 *
 * @param {boolean} isOpen - Controlla la visibilità dell'overlay
 * @param {function} onClose - Callback per chiudere l'overlay
 * @param {object} actor - Oggetto attore con id e name
 * @param {function} fetchPerson - Funzione per recuperare i dettagli dell'attore
 */
function ActorOverlay({ isOpen, onClose, actor, fetchPerson }) {
  const [personData, setPersonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Calcola l'età dalla data di nascita
  const calculateAge = (birthday) => {
    if (!birthday) return null;
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Formatta la data in formato leggibile
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-EN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Carica i dettagli dell'attore
  const loadActorDetails = useCallback(async () => {
    if (!actor?.id) return;

    try {
      setLoading(true);
      const data = await fetchPerson(actor.id);
      setPersonData(data);
      console.log("Actor details loaded:", data);
    } catch (error) {
      console.error("Errore nel caricamento dei dettagli dell'attore:", error);
      setPersonData(null);
    } finally {
      setLoading(false);
    }
  }, [actor?.id, fetchPerson]);

  useEffect(() => {
    if (isOpen && actor?.id) {
      loadActorDetails();
    }
  }, [isOpen, actor?.id, loadActorDetails]);

  const handleMovieClick = (movie) => {
    onClose();
    // Determina se è un film o una serie TV
    const type = movie.media_type === "tv" ? "tv" : "movie";
    navigate(`/${type}/${movie.id}`);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Combina film e serie TV, ordina per popolarità e prende i primi 10
  const getTopCredits = () => {
    if (!personData) return [];

    const movies = personData.movie_credits?.cast || [];
    const tvShows = personData.tv_credits?.cast || [];

    const allCredits = [...movies, ...tvShows]
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 10);

    return allCredits;
  };

  const topCredits = getTopCredits();
  const age = calculateAge(personData?.birthday);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-neutral-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-neutral-900/95 backdrop-blur border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{actor?.name}</h2>
            {personData?.known_for_department && (
              <p className="text-red-500 text-sm font-semibold">
                {personData.known_for_department}
              </p>
            )}
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
        <div className="overflow-y-auto max-h-[calc(85vh-88px)] p-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Loading...</p>
            </div>
          ) : !personData ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Info not available</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Sezione Informazioni Personali */}
              <div className="flex flex-col md:flex-row gap-6">
                {/* Foto profilo */}
                {personData.profile_path && (
                  <div className="flex-shrink-0">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${personData.profile_path}`}
                      alt={personData.name}
                      className="rounded-xl shadow-lg w-48 h-auto object-cover"
                    />
                  </div>
                )}

                {/* Dettagli personali */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">Info</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      {personData.birthday && (
                        <div>
                          <p className="text-gray-400">Date of Birth</p>
                          <p className="text-white font-medium">{formatDate(personData.birthday)}</p>
                        </div>
                      )}
                      {age && (
                        <div>
                          <p className="text-gray-400">Age</p>
                          <p className="text-white font-medium">{age}</p>
                        </div>
                      )}
                      {personData.place_of_birth && (
                        <div className="sm:col-span-2">
                          <p className="text-gray-400">Birthplace</p>
                          <p className="text-white font-medium">{personData.place_of_birth}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Biografia */}
                  {personData.biography && (
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Biography</h3>
                      <p className="text-gray-300 text-sm leading-relaxed max-h-48 overflow-y-auto">
                        {personData.biography}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sezione Filmografia */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">
                  Popular films & TV Shows
                </h3>
                {topCredits.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">Film not found</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {topCredits.map((credit) => {
                      const title = credit.title || credit.name;
                      const releaseDate = credit.release_date || credit.first_air_date;
                      const posterPath = credit.poster_path;

                      return (
                        <div
                          key={`${credit.id}-${credit.credit_id}`}
                          className="group cursor-pointer"
                          onClick={() => handleMovieClick(credit)}
                        >
                          <div className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 group-hover:scale-105">
                            {posterPath ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w500${posterPath}`}
                                alt={title}
                                className="w-full h-auto object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full aspect-[2/3] bg-neutral-800 flex items-center justify-center">
                                <p className="text-gray-500 text-xs px-2 text-center">
                                  Image not available
                                </p>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <h4 className="text-white text-xs font-medium mt-2 line-clamp-2 group-hover:text-red-500 transition-colors">
                            {title}
                          </h4>
                          {credit.character && (
                            <p className="text-gray-400 text-xs mt-1 line-clamp-1">
                              {credit.character}
                            </p>
                          )}
                          {releaseDate && (
                            <p className="text-gray-500 text-xs">
                              {new Date(releaseDate).getFullYear()}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActorOverlay;
