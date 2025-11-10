import { FiHeart, FiMinus, FiPlay, FiPlus } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

function HeroDetail({
    title,
    tagline,
    backdrop,          // url background
    trailerKey,        // stringa YouTube key
    inWatchlist,       // boolean
    inFavourite,
    onToggleWatchlist, // funzione da chiamare al click
    onToggleFavorite,  // funzione da chiamare al click
}) {
    return (
        <section
            className="relative w-full min-h-[280px] md:min-h-[360px] flex items-end"
            style={{
                backgroundImage: backdrop ? `url(${backdrop})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
            aria-label="Immagine di copertina"
        >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="relative max-w-5xl mx-auto w-full px-6 py-6">
                {!!title && (
                    <h1 className="text-3xl md:text-5xl font-extrabold drop-shadow">
                        {title}
                    </h1>
                )}
                {!!tagline && (
                    <h2 className="italic text-gray-300 mt-2 drop-shadow">{tagline}</h2>
                )}

                <div className="flex gap-3 mt-4">
                    {!!trailerKey && (
                        <a
                            href={`https://www.youtube.com/watch?v=${trailerKey}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 transition-colors px-4 py-2 rounded-full font-semibold"
                        >
                            <FiPlay className="text-white" />
                            Guarda trailer
                        </a>
                    )}

                    <button
                        type="button"
                        onClick={onToggleWatchlist}
                        className={"inline-flex items-center gap-2 px-4 py-2 rounded-full transition-colors bg-white/10 hover:bg-white/20"}
                    >
                        {inWatchlist ? <FiMinus /> : <FiPlus />}
                        {inWatchlist ? "Rimuovi dalla Watchlist" : "Aggiungi a Watchlist"}
                    </button>
                    <button
                        type="button"
                        onClick={onToggleFavorite}
                        className={"inline-flex items-center gap-2 px-4 py-2 rounded-full transition-colors bg-white/10 hover:bg-white/20"}>
                            {inFavourite ? <FaHeart className="text-red-500" /> : <FiHeart className="text-red-500"/>}
                    </button>
                </div>
            </div>
        </section>
    );
}

export default HeroDetail;
