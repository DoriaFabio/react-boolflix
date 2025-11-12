function CastComponent({ cast }) {
    return (
        <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-3">🎭 Main cast </h3>
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {cast.map((p) => (
                    <div key={p.cast_id ?? p.credit_id ?? p.id} className="min-w-[120px] snap-start">
                        <div className="w-[120px] h-[170px] bg-neutral-800 rounded-lg overflow-hidden">
                            {p.profile_path ? (
                                <img
                                    src={`https://image.tmdb.org/t/p/w200${p.profile_path}`}
                                    alt={p.name}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                                    No Image
                                </div>
                            )}
                        </div>
                        <p className="mt-2 font-semibold text-sm">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.character}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CastComponent