import { Link } from "react-router-dom";

export default function Recommend({ recommendations }) {
  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold mb-4">Other similar title</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {recommendations.map((p) => (
          <Link
            key={p.id}
            to={`/${p.media_type || "movie"}/${p.id}`}
            className="group relative bg-neutral-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <div className="w-full aspect-[2/3] bg-neutral-800">
              {p.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${p.poster_path}`}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                  No Image
                </div>
              )}
            </div>

            <div className="p-3">
              <p className="font-semibold text-sm line-clamp-1">{p.title}</p>
              <p className="text-xs text-gray-400">{p.release_date}</p>
            </div>

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-center p-4 text-sm">
              <span className="text-gray-200 font-medium">Discover more</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
