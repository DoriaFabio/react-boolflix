// import { useState, useEffect } from "react"
import { useGlobalContext } from "../context/GlobalContext"
import ListMedia from "../components/ListMedia"

function MainComponent() {
    const { movies, series, isSearching, popular } = useGlobalContext();
    console.log(movies);
    console.log(series);
    return (
        <main className="mx-10 py-5">
            {!isSearching ? (
                <ListMedia title="popular movie" list={popular} />
                // <div className="Nolist">
                //     <h2>Prova a cercare un film o una serie tv!</h2>
                // </div>
            ) : (
                <>
                    <ListMedia title="Movies" list={movies} />
                    <ListMedia title="Serie tv" list={series} />
                </>
            )}
        </main>
    );
}

export default MainComponent