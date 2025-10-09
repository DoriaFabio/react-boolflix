// import { useState } from "react";
import CardMovies from "./CardMovies"

export default function ListMovies({ title, list }) {
  return (
    <section className="py-7">
      <h3 className="myh3 my-3">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-5">
        {list.map((media) => (
          <div key={media.id}>
            <CardMovies media={media}/>
          </div>
        ))}
      </div>
    </section>
  );
}
