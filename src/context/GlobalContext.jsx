import { useContext, createContext, useState, useEffect, useCallback } from "react";
import useLocalStorageList from "../hooks/useLocalStorageList";
import useSearch from "../hooks/useSearch";

/* =====================================================
  ! CONFIG / COSTANTI
  ? - In produzione preferisci leggere API_URL e API_KEY da variabili d'ambiente.
   ===================================================== */
const apiKey = "cc3ab39c39766d9bbdfb7697ef7e22f1";
const apiUrl = "https://api.themoviedb.org/3/";

//! Creazione del contesto globale
const GlobalContext = createContext();

/* =====================================================
  ! PROVIDER
  ? - Mantiene lo stato globale dell’app (risultati ricerca, popolari, selezione, ecc.)
  ? - Espone le API per cercare, leggere dettagli, e gestire la watchlist (tramite hook).
   ===================================================== */
const GlobalProvider = ({ children }) => {
  //? Stato di lista (popolari)
  const [popular, setPopular] = useState([]);

  //todo Hook di ricerca (gestisce movies, series, isSearching e funzioni di ricerca)
  const {
    movies,
    series,
    isSearching,
    search,
  } = useSearch();

  //todo Watchlist (delegata al custom hook generico)
  const {
    list: watchlist,
    addToList: addToWatchlist,
    removeFromList: removeFromWatchlist,
    isInList: isInWatchlist,
    getList: getWatchlist,
  } = useLocalStorageList("watchlist");

  //todo Favourites (delegata al custom hook generico)
  const {
    list: favourites,
    addToList: addToFavourites,
    removeFromList: removeFromFavourites,
    isInList: isInFavourites,
    getList: getFavourite,
  } = useLocalStorageList("favourites");

  //! Caricamento iniziale dei popolari
  useEffect(() => {
    getPopular();
  }, []);

  /* ============================================
    ! FUNZIONI API TMDB
     ============================================ */
  /**
   *! getPopular
   *todo Recupera i film popolari (prima schermata/landing).
   */
  function getPopular() {
    const urlPopular = `${apiUrl}movie/popular?api_key=${apiKey}`;

    fetch(urlPopular)
      .then((res) => {
        if (!res.ok) throw new Error(`Errore nella risposta: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setPopular(data.results || []);
      })
      .catch((error) => {
        console.error("Errore caricamento film popolari:", error);
      });
  }

  /**
   *! fetchById
   *todo Recupera i dettagli di un singolo media (movie/tv) includendo credits, video, e raccomandazioni.
   *? @param {"movie"|"tv"} endpoint
   *? @param {string|number} id
   *? @returns {Promise<object>}
   */
  const fetchById = useCallback(async (endpoint, id) => {
    const url = `${apiUrl}${endpoint}/${id}?api_key=${apiKey}&append_to_response=credits,videos,recommendations`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Errore nella risposta del server");
      const data = await res.json();
      console.log(`Caricati dettagli per ${endpoint} ID: ${id}`);

      return data;
    } catch (err) {
      console.error("Errore caricamento dati film:", err);
      throw err;
    }
  }, []);

  /**
   *! fetchMoviesByDirector
   *todo Recupera tutti i film diretti da un regista specifico dato il suo ID.
   *? @param {number} directorId - ID del regista su TMDB
   *? @returns {Promise<Array>} - Array di film diretti dal regista
   */
  const fetchMoviesByDirector = useCallback(async (directorId) => {
    try {
      const url = `${apiUrl}person/${directorId}/movie_credits?api_key=${apiKey}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Errore nella risposta: ${res.status}`);
      const data = await res.json();

      // Filtra solo i film dove la persona è regista (job: "Director")
      const directedMovies = (data.crew || [])
        .filter((item) => item.job === "Director")
        .sort((a, b) => {
          // Ordina per data di uscita (più recenti prima)
          const dateA = a.release_date ? new Date(a.release_date) : new Date(0);
          const dateB = b.release_date ? new Date(b.release_date) : new Date(0);
          return dateB - dateA;
        });
        console.log(`Caricati ${directedMovies.length} film diretti dal regista ID: ${directorId}`);
      return directedMovies;
    } catch (error) {
      console.error("Errore nel caricamento dei film del regista:", error);
      return [];
    }
  }, []);

  /* =========================================================
    ! VALORE ESPORTATO DAL CONTESTO
     ========================================================= */
  const contextValue = {
    //todo Stato risultati
    movies,
    series,
    popular,
    isSearching,

    //todo Azioni di ricerca/dettagli
    search,
    fetchById,
    fetchMoviesByDirector,

    //todo Watchlist API (dal custom hook)
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    getWatchlist,

    //todo Favourites API
    favourites,
    addToFavourites,
    removeFromFavourites,
    isInFavourites,
    getFavourite,
  };

  return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>;
};

/* ===========================================================
  ! HOOK COMODO PER CONSUMARE IL CONTESTO
   =========================================================== */
function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (!context) {
    //? opzionale: messaggio d'aiuto per debug se usato fuori dal provider
    console.warn("useGlobalContext deve essere usato dentro <GlobalProvider />");
  }
  return context;
}

export { GlobalProvider, useGlobalContext };
