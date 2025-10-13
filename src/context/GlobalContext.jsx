import { useContext, createContext, useState, useEffect } from "react";

//? Import apiUrl e apiKey dal file .env
// const apiUrl = import.meta.env.VITE_API_URL
// const apiKey = import.meta.env.VITE_API_KEY
const apiKey = "cc3ab39c39766d9bbdfb7697ef7e22f1"
const apiUrl = "https://api.themoviedb.org/3/"

const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
    //? Variabili reattive
    const [movies, setMovies] = useState([]);
    const [series, setSeries] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [popular, setPopular] = useState([])

    useEffect(getPopular, []);

    //! Funzione che recupera tutti i dati seguendo quello scritto nella query
    async function getData(query, endpoint) {
        const url = `${apiUrl}search/${endpoint}?api_key=${apiKey}&query=${encodeURIComponent(query)}`;

        try {
            const res = await fetch(url);

            if (!res.ok) {
                throw new Error(`Errore nella risposta: ${res.status}`);
            }

            const data = await res.json();

            if (endpoint === "movie") {
                setMovies(data.results);
            } else {
                setSeries(data.results);
            }
        } catch (error) {
            console.log("Errore:", error);
        } finally {
            () => {
                console.log("Finito");
            }

        }
    }

    //! Funzione che recupera i film più popolari
    function getPopular() {
        const urlPopular = `${apiUrl}movie/popular?api_key=${apiKey}`;
        fetch(urlPopular).then((res) => {
            if (!res.ok) {
                throw new Error(`Errore nella risposta: ${res.status}`)
            } else {
                return res.json();
            }
        }).then((data) => {
            setPopular(data.results);
        })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                console.log("Finito");
            })
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

    //! Funzione asincrona per recuperare un singolo elemento da un endpoint API dato un path e un id
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

    const data = {
        movies,
        series,
        isSearching,
        popular,
        search,
        selectedItem,
        fetchById,
        getItemDetails
    };

    return (
        <GlobalContext.Provider value={data}>{children}</GlobalContext.Provider>
    )
};

function useGlobalContext() {
    const context = useContext(GlobalContext);
    return context;
}

export { GlobalProvider, useGlobalContext };