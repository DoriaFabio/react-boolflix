import style from "./Card.module.css";
import { Link } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useMemo } from "react";

const imgPath = "https://image.tmdb.org/t/p/w342";
// const flags = ["de", "en", "es", "it", "fr", "ja", "ko"];

export default function CardMovies({ media }) {
  // Memoizza il calcolo della bandiera
  // const flag = useMemo(() =>
  //   flags.includes(media.original_language)
  //     ? media.original_language + ".png"
  //     : "placeholder.jpg",
  //   [media.original_language]
  // );

  const type = media.title ? "movie" : "tv";

  // Memoizza il calcolo delle stelle per evitare ri-creazione ad ogni render
  const stars = useMemo(() => {
    const starsArray = [];
    const rating = Math.round(media.vote_average / 2);
    for (let i = 1; i <= 5; i++) {
      starsArray.push(
        i <= rating ? <FaStar key={i} /> : <FaRegStar key={i} />
      );
    }
    return starsArray;
  }, [media.vote_average]);

  // Memoizza l'URL dell'immagine
  const imageUrl = useMemo(() =>
    media.poster_path
      ? `${imgPath}${media.poster_path}`
      : media.backdrop_path
        ? `${imgPath}${media.backdrop_path}`
        : "../placeholder.jpg",
    [media.poster_path, media.backdrop_path]
  );

  return (
    <Link to={`/${type}/${media.id}`}>
      <div className={`${style.cardImg} relative bg-gray-800 rounded-2xl overflow-hidden shadow-lg`}>
        <img
          src={imageUrl}
          alt={media.title || media.name}
          className="w-full h-full object-cover"
        />

        {/* Overlay del contenuto */}
        <div className={`${style.cardContent} absolute inset-0 bg-black/70 p-4 flex flex-col justify-start`}>
          <h5 className="text-white font-bold text-lg mb-1 myfont1">
            Original Title: {media.original_title || media.original_name}
          </h5>

          <h6 className="text-white text-base mb-2 myfont">
            Title: {media.title || media.name}
          </h6>

          <p className="text-white text-sm mb-3 myfont line-clamp-4">
            {media.overview}
          </p>

          <p className="text-white text-sm mb-3 myfont line-clamp-4">
            Release Date: {media.release_date || media.first_air_date}
          </p>

          <div className="flex flex-col items-center gap-2">
            {/* <img src={flag} alt={flag} className={`${style.flag} w-8 h-auto rounded`} /> */}
            <div className="text-amber-300 flex justify-center">{stars}</div>
          </div>


        </div>
      </div>
    </Link>
  );
}
