function saveFavorite(id) {

  let favorites =
    JSON.parse(
      localStorage.getItem("favorites")
    ) || [];

  if (!favorites.includes(id)) {
    favorites.push(id);
  }

  localStorage.setItem(
    "favorites",
    JSON.stringify(favorites)
  );
}

function getFavorites() {
  return JSON.parse(
    localStorage.getItem("favorites")
  ) || [];
}