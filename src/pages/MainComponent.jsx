// import { useState, useEffect } from "react"
import { useGlobalContext } from "../context/GlobalContext"
import ListMovies from "../components/ListMovies"

function MainComponent() {
    const { movies } = useGlobalContext();
    console.log(movies);
    return (
        <main className="mycontainer py-5">
            {movies.length < 1 ? (
                <div className="Nolist">
                    <h2>Prova a cercare un film o una serie tv!</h2>
                </div>
            ) : (
                <>
                <ListMovies title="Movies" list={movies}/>
                </>
            )}
        </main>
    );
}

export default MainComponent