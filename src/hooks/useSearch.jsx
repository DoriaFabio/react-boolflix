import { useState } from "react";

const apiKey = "cc3ab39c39766d9bbdfb7697ef7e22f1";
const apiUrl = "https://api.themoviedb.org/3/";

export default function useSearch() {
    const [movies, setMovies] = useState([]);
    const [series, setSeries] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
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
            //! Filtra solo i risultati con genere non documentario (ID 99)
            const filteredResults = (data.results || []).filter(item =>
                !item.genre_ids || !item.genre_ids.includes(99)
            );
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

            //* 3) Elimina duplicati da un array di oggetti basandosi sull'id e filtra i documentari (ID 99)
            const uniqueMovies = Array.from(new Map(movieItems.map((m) => [m.id, m])).values()).filter(m =>
                !m.genre_ids || !m.genre_ids.includes(99)
            );
            const uniqueTv = Array.from(new Map(tvItems.map((t) => [t.id, t])).values()).filter(t =>
                !t.genre_ids || !t.genre_ids.includes(99)
            );

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

    return {
        movies,
        series,
        isSearching,
        search,
    }
}