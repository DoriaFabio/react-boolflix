import Card from "./Card"

export default function ListCard({ title, list }) {
  return (
    <section className="my-4">
      <h3>{title}</h3>
      <div className="row gy-4">
        {list.map((media) => (
          <div className="col-12 col-md-4 col-lg-3" key={media.id}>
            <Card media={media}/>
          </div>
        ))}
      </div>
    </section>
  );
}
