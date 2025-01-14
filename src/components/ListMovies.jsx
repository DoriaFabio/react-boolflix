// import { useState } from "react";
import CardMovies from "./CardMovies"

export default function ListMovies({ title, list }) {
  return (
    <section className="my-4">
      <h3 className="myh3 my-3">{title}</h3>
      <div className="row gy-4">
        {list.map((media) => (
          <div className="col-12 col-md-4 col-lg-3" key={media.id}>
            <CardMovies media={media}/>
          </div>
        ))}
      </div>
    </section>
  );
}
