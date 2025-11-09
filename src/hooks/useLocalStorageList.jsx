import { useState, useEffect, useCallback } from "react";

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
   ! Hook Generico: useLocalStorageList
   todo - Gestisce una lista (film/serie) persistita su localStorage.
   todo - Espone API per aggiungere/rimuovere/controllare presenza, e ottenere l'elenco.
   todo - Sincronizza automaticamente tra più tab del browser.
   todo - Riutilizzabile per qualsiasi tipo di lista (watchlist, favourites, ecc.)
   ======================================================= */
export default function useLocalStorageList(storageKey) {
    //? Stato iniziale: carica da localStorage una sola volta (init function di useState)
    const [list, setList] = useState(() => safeLoad(storageKey, []));

    /* ---------------- Persistenza locale ---------------- !*/
    //todo Ogni volta che cambia la lista, salva su localStorage
    useEffect(() => {
        safeSave(storageKey, list);
    }, [storageKey, list]);

    /* ---------------- Sincronizzazione tra tab ---------------- */
    //todo Se un'altra tab modifica la stessa chiave, aggiorna lo stato locale
    useEffect(() => {
        const handler = (e) => {
            if (e.key === storageKey) {
                setList(safeLoad(storageKey, []));
            }
        };
        window.addEventListener("storage", handler);
        return () => window.removeEventListener("storage", handler);
    }, [storageKey]);

    /* ---------------- Helpers ---------------- */
    /**
     *todo Crea una chiave univoca di confronto a partire da type+id.
     *? Esempio: "movie:550"
     */
    const makeKey = useCallback((type, id) => `${type}:${id}`, []);

    //* Ritorna true se (type,id) è già presente nella lista.
    const isInList = useCallback(
        (type, id) => {
            const keyStr = makeKey(type, id);
            return list.some((it) => makeKey(it.type, it.id) === keyStr);
        },
        [list, makeKey]
    );

    //* Aggiunge un elemento alla lista (se non già presente).
    const addToList = useCallback(
        (item) => {
            if (!item || !item.id) return;
            const type = item.title ? "movie" : "tv";
            if (isInList(type, item.id)) return; //? già in lista

            //? Normalizzazione payload salvato
            const normalized = {
                id: item.id,
                type,
                title: item.title || item.name || "",
                poster_path: item.poster_path || null,
                vote_average: item.vote_average ?? null,
            };

            setList((prev) => [normalized, ...prev]);
        },
        [isInList]
    );

    //* Rimuove un elemento dalla lista dato type+id.
    const removeFromList = useCallback((type, id) => {
        setList((prev) =>
            prev.filter((it) => !(it.type === type && it.id === Number(id)))
        );
    }, []);

    //* Restituisce l'array corrente (comodo per evitare dipendenze esterne)
    const getList = useCallback(() => list, [list]);

    return {
        list,
        addToList,
        removeFromList,
        isInList,
        getList,
    };
}