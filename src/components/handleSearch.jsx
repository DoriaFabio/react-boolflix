import { useCallback } from "react";
import { useGlobalContext } from "../context/GlobalContext";

export default function HandleSearch() {
  const { search } = useGlobalContext();

  //! Funzione debounce: limita la frequenza con cui viene chiamata una funzione
  function debounce(callback, delay) {
    let timer;
    return (value) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        callback(value);
      }, delay);
    }
  }

  const debounceSearch = useCallback(
    debounce((value) => {
      search(value);
    }, 500),
    [search]
  );

  return (
    <input
      type="text"
      placeholder="Cerca per titolo"
      onChange={(e) => debounceSearch(e.target.value)}
      className="bg-amber-50 rounded-xl text-black p-2 shadow-md shadow-gray-400 mx-10"
    />
  );
}
