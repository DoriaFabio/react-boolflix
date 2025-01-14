// import { useState } from "react";
import CardSeries from "./CardSeries"
//import Overlay from "./Overlay";

export default function ListSeries({ name, list }) {
  //const [Overlay, setOverlay] = useState(false);
  return (
    <section>
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