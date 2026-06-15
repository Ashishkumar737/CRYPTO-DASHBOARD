import {
  fetchCoin,
  fetchHistory
} from "./api.js";

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

let chart;


// Initial Load

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

        // STEP 4
        await renderChart(coin);

      } catch (error) {

        console.error(error);

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


// Coin Card

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


// Favorites

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


// Chart Function

async function renderChart(
  coin
) {

  try {

    const history =
      await fetchHistory(
        coin
      );

    const canvas =
      document.getElementById(
        "priceChart"
      );

    if (!canvas) return;

    const ctx =
      canvas.getContext("2d");

    if (chart) {

      chart.destroy();
    }

    chart =
      new Chart(
        ctx,
        {

          type: "line",

          data: {

            labels:
              history.prices.map(
                p =>
                  new Date(
                    p[0]
                  ).toLocaleDateString()
              ),

            datasets: [

              {

                label:
                  `${coin.toUpperCase()} Price (USD)`,

                data:
                  history.prices.map(
                    p => p[1]
                  ),

                borderColor:
                  "#00e5ff",

                borderWidth: 3,

                fill: false,

                tension: 0.4
              }

            ]
          },

          options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

              legend: {

                labels: {

                  color: "white"
                }
              }
            },

            scales: {

              x: {

                ticks: {

                  color: "white"
                }
              },

              y: {

                ticks: {

                  color: "white"
                }
              }
            }
          }
        }
      );

  } catch (error) {

    console.error(
      "Chart Error:",
      error
    );
  }
}