import { useMemo, useEffect } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { FiSearch } from "react-icons/fi";

export default function HandleSearch() {
  const { search } = useGlobalContext();

  //! Funzione debounce semplice
  function debounce(callback, delay) {
    let timer;
    return (value) => {
      clearTimeout(timer);
      timer = setTimeout(() => callback(value), delay);
    };
  }

  //! Crea la funzione dentro useMemo
  const debounceSearch = useMemo(() => {
    return debounce((value) => search(value), 500);
  }, [search]);

  //! Cancella eventuali timer al dismount
  useEffect(() => {
    return () => {
      if (debounceSearch.cancel) debounceSearch.cancel();
    };
  }, [debounceSearch]);

  return (
    <div className="relative w-[90%] md:w-[400px] mx-auto group">
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" />
      <input
        id="search"
        type="text"
        placeholder="Search by title, director, actor..."
        onChange={(e) => debounceSearch(e.target.value)}
        className="
          bg-[#000000]
          text-white
          placeholder-gray-400
          rounded-full
          pl-10 pr-4 py-2
          w-full
          outline-none
          border border-transparent
          focus:border-red-600
          focus:shadow-[0_0_10px_rgba(229,9,20,0.5)]
          transition-all duration-300
        "
      />
    </div>
  );
}
