import ParallaxCarousel from "./ParallaxCarousel";

export default function ListMedia({ title, list, action }) {
  if (!list || list.length === 0) {
    return (
      <section className="py-10 text-white text-center">
        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="text-gray-400">Nessun risultato trovato.</p>
      </section>
    );
  }

  return (
    <section className="py-7 text-white w-full max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-4 px-5">
        <h3 className="myh3">{title}</h3>
        {action}
      </div>

      <ParallaxCarousel list={list} />
    </section>
  );
}
