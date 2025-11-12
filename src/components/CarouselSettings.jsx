import { useEffect, useState } from "react";

// Hook ottimizzato con debounce per evitare troppi re-render durante il resize
export function useWindowWidth() {
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

// Calcola slidesToShow in base alla larghezza dello schermo
export function getSlidesToShow(width) {
  if (width < 480) return 1;
  if (width < 768) return 2;
  if (width < 1024) return 4;
  if (width < 1280) return 5;
  return 6;
}

// Calcola slidesToScroll in base a slidesToShow
export function getSlidesToScroll(slidesToShow) {
  return slidesToShow > 3 ? 2 : 1;
}

// Configura la classe dei dots in base alla larghezza dello schermo
export function getDotsClass(width) {
  return width < 1024 ? "slick-dots slick-dots-mobile" : "slick-dots";
}

// Genera le impostazioni complete del carosello
export function getCarouselSettings(width) {
  const slidesToShow = getSlidesToShow(width);
  const slidesToScroll = getSlidesToScroll(slidesToShow);
  const dotsClass = getDotsClass(width);

  const settings = {
    dots: true,
    dotsClass,
    infinite: true,
    speed: 500,
    adaptiveHeight: true, // aiuta il ricalcolo
    slidesToShow,
    slidesToScroll,
    arrows: true,
    swipeToSlide: true,
    // Su mobile/tablet mostra numeri invece di dots con contatore
    ...(width < 1024 && {
      customPaging: (i) => {
        return <div className="slick-number-button">{i + 1}</div>;
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
        const activeIndex = dots.findIndex(
          (dot) =>
            dot.props.className && dot.props.className.includes("slick-active")
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
        const remaining = dots.length - (activeIndex + 2);

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
      },
    }),
  };

  return settings;
}
