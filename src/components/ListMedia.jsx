// import { useState } from "react";
import CardMovies from "./CardMovies"
import Slider from "react-slick";

export default function ListMedia({ title, list }) {
  if (!list || list.length === 0) {
    return (
      <section className="py-10 text-white text-center">
        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="text-gray-400">Nessun risultato trovato.</p>
      </section>
    );
  }

  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 5,
    speed: 500,
    dots: false,
    slidesToScroll: 2,
    arrows: true,
    swipeToSlide: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 5, slidesToScroll: 2 } },
      { breakpoint: 1024, settings: { slidesToShow: 4, slidesToScroll: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 2, slidesToScroll: 1 } },
    ],
  };


  return (
    <section className="py-7 px-5 text-white">
      <h3 className="myh3 my-3">{title}</h3>
      <div className="grid grid-cols-1 gap-1">
        <Slider {...settings}>
          {list.map((media) => (
            <div key={media.id} className="px-2 flex justify-center">
              <CardMovies media={media} />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
