// Load favorites from LocalStorage

export function loadFavorites() {

    return JSON.parse(
        localStorage.getItem("favorites")
    ) || [];
}


// Save favorite coin

export function saveFavorite(coin) {

    const favorites =
        loadFavorites();

    if (!favorites.includes(coin)) {

        favorites.push(coin);

        localStorage.setItem(
            "favorites",
            JSON.stringify(favorites)
        );
    }
}


// Remove favorite coin (future use)

export function removeFavorite(coin) {

    let favorites =
        loadFavorites();

    favorites =
        favorites.filter(
            fav => fav !== coin
        );

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );
}


// Check favorite status

export function isFavorite(coin) {

    const favorites =
        loadFavorites();

    return favorites.includes(coin);
}


// Clear all favorites (future use)

export function clearFavorites() {

    localStorage.removeItem(
        "favorites"
    );
}