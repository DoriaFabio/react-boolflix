import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";

function DetailPage() {
    const { id, type } = useParams(); // ← id passato dall’URL
    const { fetchById } = useGlobalContext(); // ← funzione dal context
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadDetails() {
            try {
                setLoading(true);
                const data = await fetchById(type, id);
                setDetails(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadDetails();
    }, [id, type, fetchById]);

    if (loading) return <p className="text-center mt-5">Caricamento...</p>;
    if (error) return <p className="text-center mt-5 text-red-500">Errore: {error}</p>;
    if (!details) return null;

    // trova trailer di YouTube (se esiste)
    const trailer = details.videos?.results?.find(v => v.type === "Trailer" && v.site === "YouTube");

    return (

        <div className="flex flex-col items-center justify-center text-white my-10 px-6">
            <div className="flex flex-col md:flex-row items-start gap-6 max-w-2xl mb-5">
                {/* Poster */}
                {details.poster_path && (
                    <img
                        src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
                        alt={details.title || details.name}
                        className="rounded-xl shadow-lg w-50 flex-shrink-0 h-auto"
                    />
                )}
                <div className="flex-1">
                    {/* Titolo */}
                    <h1 className="text-3xl font-bold mb-2">{details.title || details.name}</h1>
                    {/* Tagline */}
                    {details.tagline && <h2 className="italic text-gray-400 mb-4">{details.tagline}</h2>}
                    {/* Trama */}
                    <p className="text-gray-200 mb-6">{details.overview}</p>
                    {/* Badge dei generi */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {details.genres?.map(g => (
                            <span
                                key={g.id}
                                className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm"
                            >
                                {g.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            {/* Dati principali */}
            <div className="mt-10 flex flex-col max-w-2xl">
                {/* Informazioni tecniche */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-300">
                    <p><strong>Tipo:</strong> {type === "movie" ? "Film" : "Serie TV"}</p>
                    <p><strong>Voto medio:</strong> {details.vote_average?.toFixed(1)} / 10</p>
                    <p><strong>Data di uscita:</strong> {details.release_date || details.first_air_date}</p>
                    {type === "movie" && <p><strong>Durata:</strong> {details.runtime} min</p>}
                    {type === "tv" && <p><strong>Episodi:</strong> {details.number_of_episodes}</p>}
                    {type === "tv" && <p><strong>Stagioni:</strong> {details.number_of_seasons}</p>}
                    <p><strong>Lingue:</strong> {details.spoken_languages?.map(l => l.english_name).join(", ")}</p>
                    <p><strong>Produzione:</strong> {details.production_companies?.map(p => p.name).join(", ")}</p>
                    {details.budget > 0 && (
                        <p><strong>Budget:</strong> ${details.budget.toLocaleString()}</p>
                    )}
                    {details.revenue > 0 && (
                        <p className={(details.budget > details.revenue) ? "text-red-500" : "text-green-500"}><strong>Incassi:</strong> ${details.revenue.toLocaleString()}</p>
                    )}
                    <p><strong>Stato:</strong> {details.status}</p>
                </div>

                {/* Trailer */}
                {trailer && (
                    <div className="mt-8">
                        <h3 className="text-2xl font-semibold mb-3">🎥 Trailer</h3>
                        <iframe
                            width="100%"
                            height="315"
                            src={`https://www.youtube.com/embed/${trailer.key}`}
                            title="Trailer"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded-xl shadow-lg"
                        ></iframe>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DetailPage;
