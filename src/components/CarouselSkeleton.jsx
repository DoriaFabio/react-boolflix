export default function CarouselSkeleton({ count = 6 }) {
  return (
    <section className="py-7 w-full max-w-[1600px] mx-auto px-5">
      {/* Titolo skeleton */}
      <div className="h-7 w-48 bg-neutral-700 rounded-full mb-6 animate-pulse" />

      {/* Card skeleton */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="w-full rounded-2xl bg-neutral-800 animate-pulse"
            style={{ aspectRatio: "1/1.5" }}
          />
        ))}
      </div>
    </section>
  );
}
