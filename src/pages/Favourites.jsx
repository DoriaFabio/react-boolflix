import { useMemo } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import MediaGrid from "../components/WatchFavGrid";

function Favourites() {
  const { favourites, removeFromFavourites } = useGlobalContext();

  const items = useMemo(() => {
    return [...favourites].sort((a, b) => (b.addedAt ?? 0) - (a.addedAt ?? 0));
  }, [favourites]);

  return (
    <MediaGrid
      title="Favourites"
      emptyMessage="Your favorites list is empty"
      items={items}
      onRemove={removeFromFavourites}
    />
  );
}

export default Favourites;
