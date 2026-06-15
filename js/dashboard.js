import { fetchCoin } from "./api.js";

import {
  saveFavorite,
  loadFavorites
} from "./utils.js";

const search =
  document.getElementById("search");

const results =
  document.getElementById("results");

const spinner =
  document.getElementById("spinner");

const favList =
  document.getElementById("favList");


// Load favorites on page start

renderFavorites();


// Search Coin

search.addEventListener(
  "keypress",
  async (e) => {

    if (e.key === "Enter") {

      const coin =
        search.value
          .toLowerCase()
          .trim();

      if (!coin) return;

      spinner.style.display = "flex";

      try {

        const data =
          await fetchCoin(coin);

        renderCoin(data);

      } catch (error) {

        results.innerHTML = `
                    <div class="error">
                        Coin Not Found
                    </div>
                `;
      }

      spinner.style.display = "none";
    }
  }
);


// Render Coin Card

function renderCoin(data) {

  results.innerHTML = `

    <div class="coin-card">

        <img
        src="${data.image.large}"
        alt="${data.name}"
        >

        <h2>
            ${data.name}
        </h2>

        <p>
            Symbol:
            ${data.symbol.toUpperCase()}
        </p>

        <p>
            Price:
            $${data.market_data.current_price.usd}
        </p>

        <p>
            24h Change:
            ${data.market_data.price_change_percentage_24h.toFixed(2)}%
        </p>

        <button id="favBtn">
            ⭐ Add Favorite
        </button>

    </div>

    `;

  document
    .getElementById("favBtn")
    .addEventListener(
      "click",
      () => {

        saveFavorite(data.id);

        renderFavorites();
      }
    );
}


// Render Favorites

function renderFavorites() {

  const favorites =
    loadFavorites();

  favList.innerHTML =
    favorites
      .map(
        coin =>
          `<li>${coin}</li>`
      )
      .join("");
}