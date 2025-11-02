import { useContext, createContext, useState, useEffect, useCallback } from "react";
// const apiUrl = import.meta.env.VITE_API_URL
// const apiKey = import.meta.env.VITE_API_KEY
const apiKey = "cc3ab39c39766d9bbdfb7697ef7e22f1";
const apiUrl = "https://api.themoviedb.org/3/";

const GlobalContext = createContext();

const LS_KEY = "watchlist"; // ← chiave locale

// Helpers sicuri per localStorage
function safeLoad(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function safeSave(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn("Impossibile salvare in localStorage");
  }
}

const GlobalProvider = ({ children }) => {
  //? Variabili reattive
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [popular, setPopular] = useState([]);

  // --- WATCHLIST STATE ---
  const [watchlist, setWatchlist] = useState(() => safeLoad(LS_KEY, []));
  // Ogni item: { id, type: "movie"|"tv", title/name, poster_path, vote_average, addedAt }

  // Persistenza locale
  useEffect(() => {
    safeSave(LS_KEY, watchlist);
  }, [watchlist]);

  // Sync tra tab/finestra
  useEffect(() => {
    const handler = (e) => {
      if (e.key === LS_KEY) {
        setWatchlist(safeLoad(LS_KEY, []));
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  useEffect(getPopular, []);

  //! Funzione che recupera tutti i dati seguendo quello scritto nella query
  async function getData(query, endpoint) {
    const url = `${apiUrl}search/${endpoint}?api_key=${apiKey}&query=${encodeURIComponent(query)}`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Errore nella risposta: ${res.status}`);
      const data = await res.json();

      if (endpoint === "movie") setMovies(data.results);
      else setSeries(data.results);
    } catch (error) {
      console.log("Errore:", error);
    } finally {
      () => {
        console.log("Finito");
      };
    }
  }

  //! Funzione che recupera i film più popolari
  function getPopular() {
    const urlPopular = `${apiUrl}movie/popular?api_key=${apiKey}`;
    fetch(urlPopular)
      .then((res) => {
        if (!res.ok) throw new Error(`Errore nella risposta: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setPopular(data.results);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        console.log("Finito");
      });
  }

  //! Funzione che richiama i dati
  function search(query) {
    if (!query) {
      setMovies([]);
      setSeries([]);
      setIsSearching(false);
    } else {
      getData(query, "movie");
      getData(query, "tv");
      setIsSearching(true);
    }
  }

  //! Fetch dettaglio
  async function fetchById(endpoint, id) {
    const url = `${apiUrl}${endpoint}/${id}?api_key=${apiKey}&append_to_response=credits,videos,recommendations`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Errore nella risposta del server");
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Errore nel caricamento dei dati:", err);
      throw err;
    }
  }

  const [selectedItem, setSelectedItem] = useState(null);

  async function getItemDetails(endpoint, id) {
    try {
      const data = await fetchById(endpoint, id);
      setSelectedItem(data);
    } catch (error) {
      console.error("Errore nel recupero dettagli:", error);
    }
  }

  // ------- WATCHLIST API -------

  // Chiave unica: `${type}:${id}`
  const makeKey = useCallback((type, id) => `${type}:${id}`, []);

  const isInWatchlist = useCallback(
    (type, id) => {
      const key = makeKey(type, id);
      return watchlist.some((it) => makeKey(it.type, it.id) === key);
    },
    [watchlist, makeKey]
  );

  const addToWatchlist = useCallback(
    (item) => {
      // item: oggetto TMDB dettagliato (movie o tv)
      if (!item || !item.id) return;
      const type = item.title ? "movie" : "tv";
      if (isInWatchlist(type, item.id)) return; // evita duplicati

      const normalized = {
        id: item.id,
        type,
        title: item.title || item.name || "",
        poster_path: item.poster_path || null,
        vote_average: item.vote_average ?? null,
        addedAt: Date.now(),
      };

      setWatchlist((prev) => [normalized, ...prev]);
    },
    [isInWatchlist]
  );

  const removeFromWatchlist = useCallback((type, id) => {
    setWatchlist((prev) =>
      prev.filter((it) => !(it.type === type && it.id === Number(id)))
    );
  }, []);

  const getWatchlist = useCallback(() => watchlist, [watchlist]);

  const data = {
    movies,
    series,
    isSearching,
    popular,
    search,
    selectedItem,
    fetchById,
    getItemDetails,

    // Watchlist API
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    getWatchlist,
  };

  return <GlobalContext.Provider value={data}>{children}</GlobalContext.Provider>;
};

function useGlobalContext() {
  const context = useContext(GlobalContext);
  return context;
}

export { GlobalProvider, useGlobalContext };
