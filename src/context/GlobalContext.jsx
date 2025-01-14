import { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";

//? Import apiUrl e apiKey dal file .env
const apiUrl = import.meta.env.VITE_API_URL
const apiKey = import.meta.env.VITE_API_KEY

const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
    const [movies, setMovies] = useState([]);
    // const [series, setSeries] = useState([]);

    function getData(query) {
        axios.get(apiUrl + "search/movie" + apiKey + query).then((res) => {
            setMovies(res.data.results);
        })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                console.log("Finito");
            })
    }

    function search(query) {
        getData(query)
    }
    const data = {
        movies,
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