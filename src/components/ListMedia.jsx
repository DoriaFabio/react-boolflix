import { useEffect, useRef, useState } from "react";
import CardMovies from "./CardMovies";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useWindowWidth, getCarouselSettings, getSlidesToShow } from "./CarouselSettings";

export default function ListMedia({ title, list }) {
  const [mounted, setMounted] = useState(false);
  const sliderRef = useRef(null);
  const width = useWindowWidth();

  // Ottieni le impostazioni del carosello dal file separato
  const settings = getCarouselSettings(width);
  const slidesToShow = getSlidesToShow(width);

  // Monta lo slider solo quando ci sono dati e dopo che il layout è pronto
  useEffect(() => {
    if (list && list.length > 0) {
      const t = setTimeout(() => {
        setMounted(true);
        // forza slick a ricalcolare dimensioni dopo il mount
        setTimeout(() => window.dispatchEvent(new Event("resize")), 100);
      }, 50);
      return () => clearTimeout(t);
    }
  }, [list]);

  if (!list || list.length === 0) {
    return (
      <section className="py-10 text-white text-center">
        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="text-gray-400">Nessun risultato trovato.</p>
      </section>
    );
  }

  return (
    <section className="py-7 px-5 text-white w-full max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="myh3">{title}</h3>
      </div>

      {/* wrapper con larghezza garantita */}
      <div className="relative w-full min-w-0 p-3 m-1">
        {mounted && (
          <Slider
            ref={sliderRef}
            {...settings}
            // forza re-init quando cambia il numero di slide visibili
            key={slidesToShow}
          >
            {list.map((media) => (
              <div key={media.id} className="px-2 flex justify-center">
                <CardMovies media={media} />
              </div>
            ))}
          </Slider>
        )}
      </div>
    </section>
  );
}
