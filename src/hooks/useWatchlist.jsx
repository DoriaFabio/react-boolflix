import { useState, useEffect, useCallback } from "react";

//! Chiave di default per il localStorage
const LS_KEY_DEFAULT = "watchlist";

/**
 *! Carica e parse-a un valore da localStorage.
 *todo @param {string} key - chiave di localStorage
 *todo @param {*} fallback - valore di fallback se assente o non leggibile
 *todo @returns {*} il valore parsato oppure fallback
 */
function safeLoad(key, fallback = []) {
    if (typeof window === "undefined") return fallback; // SSR/ambienti non browser
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
        console.warn(`Impossibile leggere/parsing da localStorage: ${key}`, err);
        return fallback;
    }
}
/**
 *! Salva un valore in localStorage in modo sicuro.
 *todo @param {string} key
 *todo @param {*} value
 */
function safeSave(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        console.warn("Impossibile salvare in localStorage");
    }
}

/* =======================================================
   ! Hook: useWatchlist
   todo - Gestisce una lista (film/serie) persistita su localStorage.
   todo - Espone API per aggiungere/rimuovere/controllare presenza, e ottenere l’elenco.
   todo - Sincronizza automaticamente tra più tab del browser.
   ======================================================= */
export default function useWatchlist(key = LS_KEY_DEFAULT) {
    //? Stato iniziale: carica da localStorage una sola volta (init function di useState)
    const [watchlist, setWatchlist] = useState(() => safeLoad(key, []));

    /* ---------------- Persistenza locale ---------------- !*/
    //todo Ogni volta che cambia la watchlist, salva su localStorage
    useEffect(() => {
        safeSave(key, watchlist);
    }, [key, watchlist]);

    /* ---------------- Sincronizzazione tra tab ---------------- */
    //todo Se un'altra tab modifica la stessa chiave, aggiorna lo stato locale
    useEffect(() => {
        const handler = (e) => {
            if (e.key === key) {
                setWatchlist(safeLoad(key, []));
            }
        };
        window.addEventListener("storage", handler);
        return () => window.removeEventListener("storage", handler);
    }, [key]);

    /* ---------------- Helpers ---------------- */
    /**
     *todo Crea una chiave univoca di confronto a partire da type+id.
     *? Esempio: "movie:550"
     */
    const makeKey = useCallback((type, id) => `${type}:${id}`, []);

    //* Ritorna true se (type,id) è già presente in watchlist.
    const isInWatchlist = useCallback(
        (type, id) => {
            const keyStr = makeKey(type, id);
            return watchlist.some((it) => makeKey(it.type, it.id) === keyStr);
        },
        [watchlist, makeKey]
    );

    //* Aggiunge un elemento alla watchlist (se non già presente).
    const addToWatchlist = useCallback(
        (item) => {
            if (!item || !item.id) return;
            const type = item.title ? "movie" : "tv";
            if (isInWatchlist(type, item.id)) return; //? già in lista

            //? Normalizzazione payload salvato
            const normalized = {
                id: item.id,
                type,
                title: item.title || item.name || "",
                poster_path: item.poster_path || null,
                vote_average: item.vote_average ?? null,
            };

            setWatchlist((prev) => [normalized, ...prev]);
        },
        [isInWatchlist]
    );

    //* Rimuove un elemento dalla watchlist dato type+id.
    const removeFromWatchlist = useCallback((type, id) => {
        setWatchlist((prev) =>
            prev.filter((it) => !(it.type === type && it.id === Number(id)))
        );
    }, []);
    //* Restituisce l’array corrente (comodo per evitare dipendenze esterne)
    const getWatchlist = useCallback(() => watchlist, [watchlist]);

    return {
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        getWatchlist,
    };
}