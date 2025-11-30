import { Link, useNavigate } from "react-router-dom";
import { FiBookmark } from "react-icons/fi"; // icona da react-icons
import { useGlobalContext } from "../context/GlobalContext";

function HeaderComponent() {
  const { getPopular, search } = useGlobalContext();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    search(""); // Reset della ricerca
    getPopular(); // Ricarica i film popolari
    navigate("/"); // Torna alla home
  };

  return (
    <header className="flex justify-between items-center text-white bg-black shadow-md px-5 py-4">
      <button onClick={handleLogoClick} className="cursor-pointer bg-transparent border-none p-0">
        <img
          src="../Netflix_logo.png"
          alt="Logo Netflix"
          className="w-[100px] md:w-[150px] h-auto transition-transform hover:scale-105"
        />
      </button>
      <div className="flex">
        <Link
          to="/favourites"
          className="group relative flex items-center gap-2 text-lg font-semibold mr-4 md:mr-10"
        >
          <FiBookmark className="md:w-5 md:h-5 w-4 h-4 text-red-600 group-hover:text-red-500 transition-colors duration-500" />
          <span className="relative text-[14px] md:text-lg">
            Favourites
            <span className="absolute bottom-[-3px] left-0 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full"></span>
          </span>
        </Link>
        <Link
          to="/watchlist"
          className="group relative flex items-center gap-2 text-lg font-semibold mr-4 md:mr-10"
        >
          <FiBookmark className="md:w-5 md:h-5 w-4 h-4 text-red-600 group-hover:text-red-500 transition-colors duration-500" />
          <span className="relative text-[14px] md:text-lg">
            Watchlist
            <span className="absolute bottom-[-3px] left-0 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full"></span>
          </span>
        </Link>
      </div>
    </header>
  );
}

export default HeaderComponent;
