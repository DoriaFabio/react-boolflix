import { useGlobalContext } from "../context/GlobalContext"
import ListMedia from "../components/ListMedia"
import HandleSearch from "../components/handleSearch";

function MainComponent() {
  const { movies, series, isSearching, popular } = useGlobalContext();
  console.log(movies);
  console.log(series);

  //! Se i dati popolari non sono ancora arrivati
  if (!popular || popular.length === 0) {
    return (
      <main className="flex flex-col items-center text-white mt-10">
        <HandleSearch />
        <p className="text-gray-400 mt-10">Caricamento film popolari...</p>
      </main>
    );
  }

  return (
    <main className="mx-10 py-5 flex flex-col items-center">
      <HandleSearch />
      {!isSearching ? (
        <ListMedia title="Popular movie" list={popular} />
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