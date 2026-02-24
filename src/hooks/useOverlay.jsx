import { useCallback } from "react";


const apiKey = "cc3ab39c39766d9bbdfb7697ef7e22f1";
const apiUrl = "https://api.themoviedb.org/3/";

export default function useOverlay() {
    /**
     *! fetchMoviesByDirector
     *todo Recupera tutti i film diretti da un regista specifico dato il suo ID.
     *? @param {number} directorId - ID del regista su TMDB
     *? @returns {Promise<Array>} - Array di film diretti dal regista
     */
    const fetchMoviesByDirector = useCallback(async (directorId) => {
        try {
            const [movieRes, tvRes] = await Promise.all([
                fetch(`${apiUrl}person/${directorId}/movie_credits?api_key=${apiKey}`),
                fetch(`${apiUrl}person/${directorId}/tv_credits?api_key=${apiKey}`),
            ]);
            if (!movieRes.ok || !tvRes.ok) throw new Error(`Errore nella risposta`);
            const [movieData, tvData] = await Promise.all([movieRes.json(), tvRes.json()]);

            const directedMovies = (movieData.crew || [])
                .filter((item) => item.job === "Director")
                .map((item) => ({ ...item, media_type: "movie" }));

            const directedTv = (tvData.crew || [])
                .filter((item) => item.job === "Director")
                .map((item) => ({ ...item, media_type: "tv" }));

            const all = [...directedMovies, ...directedTv].sort((a, b) => {
                const dateA = new Date(a.release_date || a.first_air_date || 0);
                const dateB = new Date(b.release_date || b.first_air_date || 0);
                return dateB - dateA;
            });

            console.log(`Caricati ${all.length} titoli diretti dal regista ID: ${directorId}`);
            return all;
        } catch (error) {
            console.error("Errore nel caricamento dei film del regista:", error);
            return [];
        }
    }, []);

    //! fetchCollection
    //todo Recupera i dettagli di una collezione dato il suo ID (inclusi i film che ne fanno parte)
    //? @param {number} collectionId - ID della collezione su TMDB
    //? @returns {Promise<object>} - Dettagli della collezione inclusi i film 

    const fetchCollection = useCallback(async (collectionId) => {
        try {
            const url = `${apiUrl}collection/${collectionId}?api_key=${apiKey}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Errore nella risposta del server");
            const data = await res.json();
            console.log(`Caricata collezione ID: ${collectionId}`);
            return data;
        } catch (err) {
            console.error("Errore nel caricamento della collezione:", err);
        }
    }, []);

    //! fetchPerson
    //todo Recupera i dettagli di una persona (attore/regista) includendo i suoi credits (film e serie TV)
    //? @param {number} personId - ID della persona (attore/regista) su TMDB
    //? @returns {Promise<object>} - Dettagli della persona inclusi credits (film e serie TV)

    const fetchPerson = useCallback(async (personId) => {
        try {
            const url = `${apiUrl}person/${personId}?api_key=${apiKey}&append_to_response=movie_credits,tv_credits`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Errore nella risposta del server");
            const data = await res.json();
            console.log(`Caricati dettagli per persona ID: ${personId}`);
            return data;
        } catch (err) {
            console.error("Errore nel caricamento dell'attore:", err);
        }
    }, [])
    return { fetchMoviesByDirector, fetchCollection, fetchPerson };
}

