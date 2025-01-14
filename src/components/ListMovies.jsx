// import { useState } from "react";
import CardMovies from "./CardMovies"
//import Overlay from "./Overlay";

export default function ListMovies({ title, list }) {
  //const [Overlay, setOverlay] = useState(false);
  return (
    <section>
      <h3>{title}</h3>
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
