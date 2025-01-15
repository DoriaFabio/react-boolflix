import { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";

//? Import apiUrl e apiKey dal file .env
// const apiUrl = import.meta.env.VITE_API_URL
// const apiKey = import.meta.env.VITE_API_KEY
const apiKey = "cc3ab39c39766d9bbdfb7697ef7e22f1"
const apiUrl = "https://api.themoviedb.org/3/"

const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
    const [movies, setMovies] = useState([]);
    const [series, setSeries] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [popular, setPopular] = useState([])

    useEffect(getPopular, []);

    function getData(query, endpoint) {
        axios.get(apiUrl + "search/" + endpoint, {
            params: {
                api_key: apiKey,
                query,
            },
        }).then((res) => {
            if (endpoint === "movie") {
                setMovies(res.data.results);
            } else {
                setSeries(res.data.results);
            }
        })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                console.log("Finito");
            })
    }

    function getPopular() {
        axios.get(apiUrl + "movie/popular", {
            params: {
                api_key: apiKey,
            },
        }).then((res) => {
            setPopular(res.data.results);
        })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                console.log("Finito");
            })
    }

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
    const data = {
        movies,
        series,
        isSearching,
        popular,
        search
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