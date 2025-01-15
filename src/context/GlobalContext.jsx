import { useContext, createContext, useState } from "react";
import axios from "axios";

//? Import apiUrl e apiKey dal file .env
const apiUrl = import.meta.env.VITE_API_URL
const apiKey = import.meta.env.VITE_API_KEY

const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
    const [movies, setMovies] = useState([]);
    const [series, setSeries] = useState([]);

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

    function search(query) {
        getData(query, "movie");
        getData(query, "tv");
    }
    const data = {
        movies,
        series,
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