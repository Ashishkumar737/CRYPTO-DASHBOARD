import {
  fetchCoin,
  fetchHistory,
  fetchMarkets
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

const gainersList =
  document.getElementById("gainersList");

const losersList =
  document.getElementById("losersList");

let chart;


// INITIAL LOAD

renderFavorites();
loadMarketWidgets();


// SEARCH COIN

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


// RENDER COIN CARD

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


// FAVORITES

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


// CHART

async function renderChart(coin) {

  try {

    const history =
      await fetchHistory(coin);

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


// TOP GAINERS & LOSERS

async function loadMarketWidgets() {

  try {

    const markets =
      await fetchMarkets();

    const gainers =
      [...markets]
        .sort(
          (a, b) =>
            b.price_change_percentage_24h -
            a.price_change_percentage_24h
        )
        .slice(0, 5);

    const losers =
      [...markets]
        .sort(
          (a, b) =>
            a.price_change_percentage_24h -
            b.price_change_percentage_24h
        )
        .slice(0, 5);

    gainersList.innerHTML =
      gainers.map(
        coin => `
                <li>
                    <span>${coin.name}</span>
                    <span style="color:#00e676">
                        +${coin.price_change_percentage_24h.toFixed(2)}%
                    </span>
                </li>
                `
      ).join("");

    losersList.innerHTML =
      losers.map(
        coin => `
                <li>
                    <span>${coin.name}</span>
                    <span style="color:#ff5252">
                        ${coin.price_change_percentage_24h.toFixed(2)}%
                    </span>
                </li>
                `
      ).join("");

  } catch (error) {

    console.error(
      "Market Widget Error:",
      error
    );

    gainersList.innerHTML =
      "<li>Unable to load gainers</li>";

    losersList.innerHTML =
      "<li>Unable to load losers</li>";
  }
}
/* =========================
   USD TO INR CONVERTER
========================= */

const usdInput =
  document.getElementById("usdInput");

const convertBtn =
  document.getElementById("convertBtn");

const inrResult =
  document.getElementById("inrResult");

if (convertBtn) {

  convertBtn.addEventListener(
    "click",
    () => {

      const usd =
        Number(
          usdInput.value
        );

      if (!usd) {

        inrResult.innerHTML =
          "₹ 0.00";

        return;
      }

      const inr =
        usd * 83.5;

      inrResult.innerHTML =
        `₹ ${inr.toFixed(2)}`;
    }
  );
}


/* =========================
   DARK MODE
========================= */

const themeToggle =
  document.getElementById(
    "themeToggle"
  );

if (themeToggle) {

  themeToggle.addEventListener(
    "click",
    () => {

      document.body.classList.toggle(
        "light-mode"
      );

      localStorage.setItem(
        "theme",
        document.body.classList.contains(
          "light-mode"
        )
          ? "light"
          : "dark"
      );
    }
  );

  const savedTheme =
    localStorage.getItem(
      "theme"
    );

  if (
    savedTheme === "light"
  ) {

    document.body.classList.add(
      "light-mode"
    );
  }
}

setTimeout(() => {

    const themeToggle =
        document.getElementById("themeToggle");

    console.log(themeToggle);

    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            () => {

                document.body.classList.toggle(
                    "light-mode"
                );
            }
        );
    }

}, 1000);
