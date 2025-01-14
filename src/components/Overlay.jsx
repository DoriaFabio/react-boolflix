//import { useState } from "react";
// import style from "./Card.module.css";

const flags = ["de", "en", "es", "it", "fr", "ja"];

export default function Overlay({ media }) {
  const flag = flags.includes(media.original_language)
    ? media.original_language + ".png"
    : "placeholder.jpg";


  return (
    <div className={`card-body`}>
      <h5>{media.title}</h5>
      <p>{media.overview}</p>
      <div>
        <img src={`/img/flags/${flag}`} alt={flag} className="img-fluid" />
      </div>
      {/* <div>{drawStars()}</div> */}
    </div>
  )
}
