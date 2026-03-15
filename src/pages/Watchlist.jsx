import { useMemo } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import WatchFavGrid from "../components/WatchFavGrid";

function WatchlistPage() {
  const { watchlist, removeFromWatchlist } = useGlobalContext();

  const items = useMemo(() => {
    return [...watchlist].sort((a, b) => (b.addedAt ?? 0) - (a.addedAt ?? 0));
  }, [watchlist]);

  return (
    <WatchFavGrid
      title="Watchlist"
      emptyMessage="Your watchlist is empty"
      items={items}
      onRemove={removeFromWatchlist}
    />
  );
}

export default WatchlistPage;
