import { useEffect, useRef, useState } from "react";
import CardMovies from "./CardMovies";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Hook ottimizzato con debounce per evitare troppi re-render durante il resize
function useWindowWidth() {
  const [w, setW] = useState(() => window.innerWidth);
  useEffect(() => {
    let timeoutId = null;
    const onResize = () => {
      // Debounce di 150ms per ridurre i re-render
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setW(window.innerWidth);
      }, 150);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);
  return w;
}

export default function ListMedia({ title, list }) {
  const [mounted, setMounted] = useState(false);
  const sliderRef = useRef(null);
  const width = useWindowWidth();

  // Calcola slidesToShow/ToScroll con i tuoi breakpoint
  const slidesToShow =
    width < 480 ? 1 :
    width < 768 ? 2 :
    width < 1024 ? 3 :
    width < 1280 ? 4 :
    6;

  const slidesToScroll = slidesToShow > 3 ? 2 : 1;

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

  // Configura i dots in base alla larghezza dello schermo
  const dotsClass = width < 1024 ? "slick-dots slick-dots-mobile" : "slick-dots";

  const settings = {
    dots: true,
    dotsClass,
    infinite: true,          // tienilo true: evita glitch al cambio breakpoint
    speed: 500,
    adaptiveHeight: true,    // aiuta il ricalcolo
    slidesToShow,
    slidesToScroll,
    arrows: true,
    swipeToSlide: true,
    // Su mobile/tablet mostra numeri invece di dots con contatore
    ...(width < 1024 && {
      customPaging: (i) => {
        return (
          <div className="slick-number-button">
            {i + 1}
          </div>
        );
      },
      appendDots: (dots) => {
        // Mostra massimo 4 numeri alla volta
        const maxDots = 4;
        const halfMax = Math.floor(maxDots / 2);

        // Se ci sono pochi dots, mostra tutti
        if (dots.length <= maxDots) {
          return (
            <div className="flex items-center justify-center gap-3">
              <ul className="slick-dots-with-numbers">{dots}</ul>
            </div>
          );
        }

        // Trova l'indice del dot attivo
        const activeIndex = dots.findIndex(dot =>
          dot.props.className && dot.props.className.includes('slick-active')
        );

        // Se non troviamo il dot attivo, mostra tutti
        if (activeIndex === -1) {
          return (
            <div className="flex items-center justify-center gap-3">
              <ul className="slick-dots-with-numbers">{dots}</ul>
            </div>
          );
        }

        // Calcola il range di numeri da mostrare
        let start = Math.max(0, activeIndex - halfMax);
        let end = Math.min(dots.length, start + maxDots);

        // Aggiusta se siamo vicini alla fine
        if (end === dots.length) {
          start = Math.max(0, end - maxDots);
        }

        const visibleDots = dots.slice(start, end);

        // Calcola quanti risultati mancano da visualizzare
        const remaining = (dots.length) - (activeIndex + 2);

        return (
          <div className="flex items-center justify-center gap-3">
            <ul className="slick-dots-with-numbers">{visibleDots}</ul>
            {remaining > 0 && (
              <span className="text-white/70 text-xs font-medium whitespace-nowrap pl-3 pt-2">
                +{remaining}
              </span>
            )}
          </div>
        );
      }
    })
  };

  return (
    <section className="py-7 px-5 text-white w-full max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="myh3">{title}</h3>
      </div>

      {/* wrapper con larghezza garantita */}
      <div className="relative w-full min-w-0 p-3 m-3">
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
