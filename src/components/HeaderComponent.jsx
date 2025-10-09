import { useState } from "react"
import { useGlobalContext } from "../context/GlobalContext"

function HeaderComponent() {
  const { search } = useGlobalContext();
  const [query, setQuery] = useState("");

  function handleInput(e) {
    setQuery(e.target.value);
  }
  function handleSearch(e) {
    e.preventDefault();
    search(query);
  }

  return (
    <header className='flex justify-between items-center text-white bg-black'>
      <img src="./Netflix_logo.png" alt="Logo Netflix" className="ml-5 my-5 w-[150px] h-auto" />
      <form className="flex mx-3" role="search">
        <input
          className="form-control mr-5"
          type="search"
          placeholder="Cerca un titolo"
          aria-label="Search"
          name="query"
          id="query"
          onChange={handleInput}
        />
        <button
          className=""
          type="search"
          onClick={handleSearch}
        >
          Cerca
        </button>
      </form>
    </header>
  )
}

export default HeaderComponent