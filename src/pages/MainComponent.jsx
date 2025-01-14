import ListMovies from "../components/ListMovies"
import ListSeries from "../components/ListSeries"

function MainComponent() {
    return (
        <main>
            <div className="container">
                <ListMovies />
                <ListSeries />
            </div>
        </main>
    )
}

export default MainComponent