import { useState } from "react"
import { useGlobalContext } from "../context/GlobalContext"

function HeaderComponent() {
  const {search} = useGlobalContext();
  const [query, setQuery] = useState("");

  function handleInput(e) {
    setQuery(e.target.value);
  }
  function handleSearch(e) {
    e.preventDefault();
    search(query);
  }

  return (
    <header className='d-flex justify-content-between align-items-center text-white bg-black'>
        <img src="./Netflix_logo.png" alt="Logo Netflix" className="mx-3 my-3 mylogo"/>
        <form className="d-flex mx-3" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Cerca un titolo"
              aria-label="Search"
              name="query"
              id="query"
              onChange={handleInput}
            />
            <button
              className="btn btn-danger"
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