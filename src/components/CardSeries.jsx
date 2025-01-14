// import { useState } from "react"
import style from "./Card.module.css";
const imgPath = import.meta.env.VITE_IMG_PATH;

const flags = ["de", "en", "es", "it", "fr", "ja"];
export default function Card({ media }) {
    const flag = flags.includes(media.original_language)
        ? media.original_language + ".png"
        : "placeholder.jpg";
    return (
        <div className={`${style.cardImg} card`}>
            <img
                src={imgPath + media.poster_path}
                alt={media.name}
            />
            <div className={`${style.cardContent} card-body`}>
                <h5 className="card-title text-white myfont1">Titolo originale: {media.original_name}</h5>
                <h6 className="card-title text-white myfont">Titolo: {media.name}</h6>
                <p className="card-text text-white myfont">{media.overview}</p>
                <div className="d-flex justify-content-center">
                    <img src={`${flag}`} alt={flag} className={`${style.flag}`} />
                </div>
                {/* <div className={style.cardStar}>{drawStars()}</div> */}
            </div>
        </div>
    )
}