import { useContext, createContext, useState, useEffect } from "react";
import useLocalStorageList from "../hooks/useLocalStorageList";
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
  //? Stato di lista (risultati/collezioni)
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [popular, setPopular] = useState([]);

  //? Stato UI
  const [isSearching, setIsSearching] = useState(false);

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
   *! getData
   *todo Ricerca per testo su un endpoint TMDB (movie | tv) e aggiorna lo stato relativo.
   *? @param {string} query - Testo da cercare
   *? @param {"movie"|"tv"} endpoint - Target della ricerca
   */
  async function getData(query, endpoint) {
    const url = `${apiUrl}search/${endpoint}?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Errore nella risposta: ${res.status}`);
      const data = await res.json();
      //! Filtra solo i risultati con popolarità > 35
      const filteredResults = (data.results || []).filter(item => item.vote_average > 3 && item.vote_count > 10);
      if (endpoint === "movie") {
        setMovies(filteredResults);
      } else {
        setSeries(filteredResults);
      }
    } catch (error) {
      console.error("Errore caricamento film:", error);
    } finally {
      //? Qui puoi eventualmente disattivare spinner specifici
    }
  }

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
  async function fetchById(endpoint, id) {
    const url = `${apiUrl}${endpoint}/${id}?api_key=${apiKey}&append_to_response=credits,videos,recommendations`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Errore nella risposta del server");
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Errore caricamento dati film:", err);
      throw err;
    }
  }

  /**
   *! getMediaByPerson
   *todo Ricerca per "persona" e aggiunge in lista i media correlati (movie/tv), senza duplicati.
   *? Nota: si somma ai risultati di getData(query, "movie"/"tv").
   *? @param {string} query - Nome persona (attori, registi, ecc.)
   */
  async function getMediaByPerson(query) {
    try {
      //* 1) Trova persone per query
      const urlPerson = `${apiUrl}search/person?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
      const resPerson = await fetch(urlPerson);
      if (!resPerson.ok) throw new Error(`Errore persone: ${resPerson.status}`);
      const dataPerson = await resPerson.json();
      const persons = dataPerson.results || [];
      //* 2) Per ogni persona, recupera crediti movie/tv in parallelo
      const movieItems = [];
      const tvItems = [];

      await Promise.all(
        persons.map(async (person) => {
          try {
            const [resMovieCredits, resTvCredits] = await Promise.all([
              fetch(`${apiUrl}person/${person.id}/movie_credits?api_key=${apiKey}`),
              fetch(`${apiUrl}person/${person.id}/tv_credits?api_key=${apiKey}`),
            ]);

            if (resMovieCredits?.ok) {
              const credits = await resMovieCredits.json();
              if (credits.cast) movieItems.push(...credits.cast);
              if (credits.crew) movieItems.push(...credits.crew);
            }

            if (resTvCredits?.ok) {
              const credits = await resTvCredits.json();
              if (credits.cast) tvItems.push(...credits.cast);
              if (credits.crew) tvItems.push(...credits.crew);
            }
          } catch (err) {
            console.error(`Errore crediti per la persona ${person.id}:`, err);
          }
        })
      );

      //* 3) Elimina duplicati da un array di oggetti basandosi sull'id e filtra per popolarità > 35
      const uniqueMovies = Array.from(new Map(movieItems.map((m) => [m.id, m])).values()).filter(m => m.vote_average > 3 && m.vote_count > 10);
      const uniqueTv = Array.from(new Map(tvItems.map((t) => [t.id, t])).values()).filter(t => t.vote_average > 3 && t.vote_count > 10);

      //* 4) Merge con stato esistente (evita duplicati)
      setMovies((prev) => {
        const map = new Map(prev.map((p) => [p.id, p]));
        uniqueMovies.forEach((u) => {
          if (!map.has(u.id)) map.set(u.id, u);
        });
        return Array.from(map.values());
      });

      setSeries((prev) => {
        const map = new Map(prev.map((p) => [p.id, p]));
        uniqueTv.forEach((u) => {
          if (!map.has(u.id)) map.set(u.id, u);
        });
        return Array.from(map.values());
      });
    } catch (err) {
      console.error("Errore getMediaByPerson:", err);
    }
  }

  /* ========================================================
    ! API DI RICERCA (coordinamento delle chiamate)
     ======================================================== */

  /**
   *! search
   *todo Esegue la ricerca combinata su film, serie e persone.
   *? - query falsy: reset risultati e stato di ricerca
   *? - query valida: avvia tutte le chiamate e imposta isSearching=true
   */
  function search(query) {
    if (!query) {
      setMovies([]);
      setSeries([]);
      setIsSearching(false);
      return;
    }
    //? Ricerca parallela movie/tv + media da persone
    getData(query, "movie");
    getData(query, "tv");
    getMediaByPerson(query);
    setIsSearching(true);
  }

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
