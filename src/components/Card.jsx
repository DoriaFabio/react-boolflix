// import { useState } from "react"
import style from "./Card.module.css";
const imgPath = import.meta.env.VITE_IMG_PATH;

export default function Card({ media }) {
  return (
    <div className={`${style.mycard}`}>
      <img
        src={imgPath + media.poster_path}
        alt={media.title}
      />
    </div>
  )
}
