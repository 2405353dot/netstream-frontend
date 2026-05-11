const KEY = "watchlist";

export const getWatchlist = () => {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
};

export const isInWatchlist = (id) => {
  const list = getWatchlist();
  return list.some((v) => v._id === id);
};

export const toggleWatchlist = (video) => {
  const list = getWatchlist();
  const exists = list.some((v) => v._id === video._id);

  let updated;

  if (exists) {
    updated = list.filter((v) => v._id !== video._id);
  } else {
    updated = [video, ...list];
  }

  localStorage.setItem(KEY, JSON.stringify(updated));
  return !exists;
};