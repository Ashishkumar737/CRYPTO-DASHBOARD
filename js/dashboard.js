import { fetchCoin } from "./api.js";

const search =
  document.getElementById("search");

const results =
  document.getElementById("results");

search.addEventListener(
  "keypress",
  async (e) => {

    if (e.key === "Enter") {

      const coin =
        search.value
          .toLowerCase()
          .trim();

      if (!coin) return;

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
    }
  }
);

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

    </div>

    `;
}