// import { useState } from "react";
import CardSeries from "./CardSeries"

export default function ListSeries({ name, list }) {
  return (
    <section className="py-4">
      <h3>{name}</h3>
      <div className="row gy-4">
        {list.map((media) => (
          <div className="col-12 col-md-4 col-lg-3" key={media.id}>
            <CardSeries media={media}/>
          </div>
        ))}
      </div>
    </section>
  );
}