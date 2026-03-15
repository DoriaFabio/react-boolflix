import { Link } from "react-router-dom";
import { FiFilm } from "react-icons/fi";
import MediaCard from "./MediaCard";

function WatchFavGrid({ title, emptyMessage, items, onRemove }) {
  if (!items.length) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 text-white text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
          <FiFilm size={24} />
        </div>
        <h1 className="text-3xl font-extrabold mb-2">{emptyMessage}</h1>
        <p className="text-gray-300 mb-6">
          Add movies and series from detail page to keep track of them.
        </p>
        <Link
          to="/"
          className="inline-block bg-red-600 hover:bg-red-700 transition-colors px-5 py-2 rounded-full font-semibold"
        >
          Browse Movies & TV Shows
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 text-white">
      <h1 className="text-3xl font-bold mb-6 myh3">{title}</h1>

      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-5">
        {items.map((it) => (
          <MediaCard key={`${it.type}:${it.id}`} item={it} onRemove={onRemove} />
        ))}
      </ul>
    </div>
  );
}

export default WatchFavGrid;
