import { useEffect, useRef, useState } from "react";
import CardMovies from "./CardMovies";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { useWindowWidth, getCarouselSettings, getSlidesToShow } from "./CarouselSettings";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

// Freccia precedente personalizzata
function PrevArrow({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute left-[-40px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-red-600 rounded-full transition-all duration-300 group"
      aria-label="Previous"
    >
      <IoChevronBack className="text-white text-2xl group-hover:scale-110 transition-transform" />
    </button>
  );
}

// Freccia successiva personalizzata
function NextArrow({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute right-[-40px] top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-red-600 rounded-full transition-all duration-300 group"
      aria-label="Next"
    >
      <IoChevronForward className="text-white text-2xl group-hover:scale-110 transition-transform" />
    </button>
  );
}

export default function ListMedia({ title, list }) {
  const [mounted, setMounted] = useState(false);
  const sliderRef = useRef(null);
  const width = useWindowWidth();

  // Ottieni le impostazioni del carosello dal file separato
  const baseSettings = getCarouselSettings(width);
  const slidesToShow = getSlidesToShow(width);

  // Aggiungi le frecce personalizzate alle impostazioni
  const settings = {
    ...baseSettings,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

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

      {/* wrapper con larghezza garantita e spazio per i dots */}
      <div className="relative w-full min-w-0 px-3 pb-12 pt-3 mx-1">
        {mounted && (
          <Slider
            ref={sliderRef}
            {...settings}
            // forza re-init quando cambia il numero di slide visibili
            key={slidesToShow}
          >
            {list.map((media) => (
              <div key={media.id} className="flex justify-center">
                <CardMovies media={media} />
              </div>
            ))}
          </Slider>
        )}
      </div>
    </section>
  );
}
