import { Link } from "react-router-dom";
import { FiBookmark } from "react-icons/fi"; // icona da react-icons

function HeaderComponent() {
  return (
    <header className="flex justify-between items-center text-white bg-black shadow-md px-5 py-4">
      <Link to="/">
        <img
          src="../Netflix_logo.png"
          alt="Logo Netflix"
          className="w-[100px] md:w-[150px] h-auto transition-transform hover:scale-105"
        />
      </Link>

      <Link
        to="/watchlist"
        className="group relative flex items-center gap-2 text-lg font-semibold mr-4 md:mr-10"
      >
        <FiBookmark className="w-5 h-5 text-red-600 group-hover:text-red-500 transition-colors duration-500" />
        <span className="relative">
          Watchlist
          <span className="absolute bottom-[-3px] left-0 w-0 h-[2px] bg-red-600 transition-all duration-300 group-hover:w-full"></span>
        </span>
      </Link>
    </header>
  );
}

export default HeaderComponent;
