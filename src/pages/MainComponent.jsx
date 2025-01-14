// import { useState, useEffect } from "react"
import { useGlobalContext } from "../context/GlobalContext"
import ListMovies from "../components/ListMovies"
import ListSeries from "../components/ListSeries";

function MainComponent() {
    const { movies, series } = useGlobalContext();
    console.log(movies);
    console.log(series);
    return (
        <main className="mycontainer py-5">
            {movies.length < 1 ? (
                <div className="Nolist">
                    <h2>Prova a cercare un film o una serie tv!</h2>
                </div>
            ) : (
                <>
                <ListMovies title="Movies" list={movies}/>
                <ListSeries name="tv" list={series}/>
                </>
            )}
        </main>
    );
}

export default MainComponent