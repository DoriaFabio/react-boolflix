import { useState } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import ListMedia from "../components/ListMedia";
import HandleSearch from "../components/handleSearch";
import GenreSelect, { GENRES } from "../components/GenreSelect";
import CarouselSkeleton from "../components/CarouselSkeleton";

function Homepage() {
  const { movies, series, isSearching, popular, getPopular } = useGlobalContext();
  const [selectedGenre, setSelectedGenre] = useState(GENRES[0]);

  const handleGenreChange = (e) => {
    const genre = GENRES.find((g) => String(g.id) === e.target.value);
    setSelectedGenre(genre);
    getPopular(genre.id);
  };

  // throw new Error("test 500") // ← decommentare per testare la pagina 500, poi rimuovere

  if (!popular || popular.length === 0) {
    return (
      <main className="mx-5 py-5 flex flex-col items-center">
        <HandleSearch />
        <CarouselSkeleton count={6} />
      </main>
    );
  }

  const listTitle = selectedGenre.id
    ? `Popular · ${selectedGenre.name}`
    : "Popular movies";

  return (
    <main className="mx-5 py-5 flex flex-col items-center">
      <HandleSearch />

      {!isSearching ? (
        <>
          {/* Su mobile: select sotto la barra di ricerca */}
          <div className="mt-4 w-[90%] md:hidden">
            <GenreSelect value={selectedGenre.id} onChange={handleGenreChange} />
          </div>

          {/* Su tablet/desktop: select accanto al titolo (large) */}
          <ListMedia
            title={listTitle}
            list={popular}
            action={
              <div className="hidden md:block">
                <GenreSelect value={selectedGenre.id} onChange={handleGenreChange} large />
              </div>
            }
          />
        </>
      ) : (
        <>
          <ListMedia title="Movies" list={movies} />
          <ListMedia title="Tv series" list={series} />
        </>
      )}
    </main>
  );
}

export default Homepage;
