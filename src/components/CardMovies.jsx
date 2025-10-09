// import { useState } from "react"
import style from "./Card.module.css";
// const imgPath = import.meta.env.VITE_IMG_PATH;
const imgPath = "https://image.tmdb.org/t/p/w342/"
import { FaStar, FaRegStar } from "react-icons/fa"

const flags = ["de", "en", "es", "it", "fr", "ja", "ko"];
export default function Card({ media }) {
  const flag = flags.includes(media.original_language)
    ? media.original_language + ".png"
    : "placeholder.jpg";

  const drawStars = () => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      const star = i <= Math.ceil(media.vote_average / 2) ? (
        <FaStar key={i} />
      ) : (
        <FaRegStar key={i} />
      );
      stars.push(star);
    }
    return stars;
  };

  return (
    <div className={`${style.cardImg} relative bg-gray-800 rounded-2xl overflow-hidden shadow-lg`}>
      <img
        src={imgPath + media.poster_path}
        alt={media.title || media.name}
        className="w-full h-full object-cover"
      />

      {/* Overlay del contenuto (equivalente a card-body) */}
      <div className={`${style.cardContent} absolute inset-0 bg-black/70 p-4 flex flex-col justify-start`}>
        <h5 className="text-white font-bold text-lg mb-1 myfont1">
          Titolo originale: {media.original_title}
        </h5>

        <h6 className="text-white text-base mb-2 myfont">
          Titolo: {media.title || media.name}
        </h6>

        <p className="text-white text-sm mb-3 myfont line-clamp-4">
          {media.overview}
        </p>

        <div className="flex flex-col items-center gap-2">
          <img
            src={flag}
            alt={flag}
            className={`${style.flag} w-8 h-auto rounded`}
          />
          <div className={`text-amber-300 flex justify-center`}>
            {drawStars()}
          </div>
        </div>
      </div>
    </div>

  )
}
