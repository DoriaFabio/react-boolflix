import { Link } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";

function MediaCard({ item, onRemove }) {
  return (
    <li className="group relative">
      <Link to={`/${item.type}/${item.id}`} className="block">
        <div className="aspect-[2/3] rounded-xl overflow-hidden bg-neutral-800 shadow ring-1 ring-white/10">
          {item.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
        <div className="mt-2">
          <h3 className="font-semibold text-sm line-clamp-1">{item.title}</h3>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="uppercase">{item.type}</span>
            {typeof item.vote_average === "number" && (
              <>
                <span>•</span>
                <span>{item.vote_average.toFixed(1)}/10</span>
              </>
            )}
          </div>
        </div>
      </Link>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          onRemove(item.type, item.id);
        }}
        className="absolute top-2 right-2 inline-flex items-center justify-center
                   w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 border border-white/10
                   opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label={`Rimuovi ${item.title}`}
      >
        <FiTrash2 />
      </button>
    </li>
  );
}

export default MediaCard;
