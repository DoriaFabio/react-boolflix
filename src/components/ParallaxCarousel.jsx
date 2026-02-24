import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, animate } from "framer-motion";
import CardMovies from "./CardMovies";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

export default function ParallaxCarousel({ list }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const x = useMotionValue(0);

  // Calcola quante card mostrare in base alla larghezza dello schermo
  useEffect(() => {
    const updateSlidesPerView = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      if (width < 450) setSlidesPerView(1);
      else if (width < 640) setSlidesPerView(2);
      else if (width < 800) setSlidesPerView(3);
      else if (width < 1024) setSlidesPerView(4);
      else if (width > 1550) setSlidesPerView(7);
      else setSlidesPerView(5);
    };

    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);
    return () => window.removeEventListener("resize", updateSlidesPerView);
  }, []);

  const maxIndex = Math.max(0, list.length - slidesPerView);

  // Anima lo scorrimento quando cambia currentIndex
  useEffect(() => {
    const cardWidth = 100 / slidesPerView;
    const targetX = -currentIndex * cardWidth;

    animate(x, targetX, {
      type: "tween",
      duration: 0.4,
      ease: "easeInOut"
    });
  }, [currentIndex, slidesPerView, x]);

  // Gestione click frecce e swipe
  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  // Gestione swipe con threshold e velocity
  // const handleDragEnd = (event, info) => {
  //   const threshold = 50;
  //   const velocity = info.velocity.x;
  //   const offset = info.offset.x;

  //   if (offset < -threshold || velocity < -500) {
  //     if (currentIndex < maxIndex) {
  //       setCurrentIndex(currentIndex + 1);
  //     }
  //   } else if (offset > threshold || velocity > 500) {
  //     if (currentIndex > 0) {
  //       setCurrentIndex(currentIndex - 1);
  //     }
  //   }
  // };

  // Calcola quali dots mostrare in mobile
  const getVisibleDots = () => {
    const totalDots = maxIndex + 1;
    const maxDotsToShow = windowWidth < 640 ? 5 : windowWidth < 1024 ? 8 : 15;

    if (totalDots <= maxDotsToShow) {
      return Array.from({ length: totalDots }, (_, i) => i);
    }

    const half = Math.floor(maxDotsToShow / 2); // numero di dots da mostrare prima e dopo il currentIndex
    let start = Math.max(0, currentIndex - half); 
    let end = Math.min(totalDots, start + maxDotsToShow); 

    if (end === totalDots) {
      start = Math.max(0, end - maxDotsToShow);
    }

    return Array.from({ length: end - start }, (_, i) => start + i);
  };

  const visibleDots = getVisibleDots();
  const totalDots = maxIndex + 1;

  return (
    <div className="relative w-full overflow-hidden py-8">
      {/* Freccia sinistra */}
      {currentIndex > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-black/70 hover:bg-red-600 rounded-full transition-all duration-300 group shadow-xl"
          aria-label="Previous"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <IoChevronBack className="text-white text-2xl" />
        </motion.button>
      )}

      {/* Freccia destra */}
      {currentIndex < maxIndex && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-black/70 hover:bg-red-600 rounded-full transition-all duration-300 group shadow-xl"
          aria-label="Next"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <IoChevronForward className="text-white text-2xl" />
        </motion.button>
      )}

      {/* Carousel container */}
      <div className="overflow-hidden px-16">
        <motion.div
          className="flex"
          style={{
            x: useTransform(x, (value) => `${value}%`)
          }}
        >
          {list.map((media, index) => {
            const relativePosition = index - currentIndex;
            const distance = Math.abs(relativePosition);
            const isVisible = index >= currentIndex - 1 && index < currentIndex + slidesPerView + 1; 

            const isEdgeBlur =
              relativePosition === -1 ||
              relativePosition === slidesPerView;

            return (
              <CarouselCard
                key={media.id}
                media={media}
                index={index}
                distance={distance}
                relativePosition={relativePosition}
                isVisible={isVisible}
                isEdgeBlur={isEdgeBlur}
                slidesPerView={slidesPerView}
              />
            );
          })}
        </motion.div>
      </div>

      {/* Dots indicator con limitazione */}
      <div className="flex justify-center items-center gap-2 mt-6 px-4">
        {visibleDots[0] > 0 && (
          <span className="text-white/50 text-xs">...</span>
        )}
        {visibleDots.map((dotIndex) => (
          <button
            key={dotIndex}
            onClick={() => setCurrentIndex(dotIndex)}
            className={`h-2 rounded-full transition-all duration-300 ${dotIndex === currentIndex
              ? "bg-red-600 w-8"
              : "bg-white/30 w-2 hover:bg-white/50"
              }`}
            aria-label={`Go to slide ${dotIndex + 1}`}
          />
        ))}
        {visibleDots[visibleDots.length - 1] < totalDots - 1 && (
          <span className="text-white/50 text-xs">...</span>
        )}
      </div>
    </div>
  );
}

function CarouselCard({ media, index, distance, isVisible, isEdgeBlur, slidesPerView }) {
  // Animazioni smooth con spring physics
  const scale = useSpring(1, { stiffness: 300, damping: 30 });
  const opacity = useSpring(1, { stiffness: 300, damping: 30 });
  const blur = useSpring(0, { stiffness: 300, damping: 30 });
  const y = useSpring(0, { stiffness: 300, damping: 30 });

  useEffect(() => {
    // Card non visibile (fuori dal range di 1 card a sinistra/destra)
    if (!isVisible) {
      scale.set(0.7);
      opacity.set(0);
      blur.set(4);
      y.set(20);
    } else {
      // Card centrata nel viewport
      if (distance === 0) {
        scale.set(1);
        opacity.set(1);
        blur.set(0);
        y.set(0);
      }
      // Card a distanza 1 (prima card a sinistra o destra)
      else if (distance === 1) {
        scale.set(0.9);
        opacity.set(0.7);
        blur.set(isEdgeBlur ? 8 : 0);
        y.set(10);
      }
      // Card ai bordi
      else {
        scale.set(0.85);
        opacity.set(0.5);
        blur.set(isEdgeBlur ? 8 : 0);
        y.set(15);
      }
    }
  }, [distance, isVisible, isEdgeBlur, scale, opacity, blur, y]);

  const blurValue = useTransform(blur, (value) => `blur(${value}px)`);

  return (
    <motion.div
      style={{
        scale,
        opacity,
        filter: blurValue,
        y,
        flex: `0 0 ${100 / slidesPerView}%`,
        minWidth: 0,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: "easeOut"
      }}
      className="px-2"
      whileHover={distance === 0 ? {
        transition: { duration: 0.3 }
      } : {}}
    >
      <CardMovies media={media} />
    </motion.div>
  );
}
