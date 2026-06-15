const API_URL = "https://api.coingecko.com/api/v3";

export async function fetchCoin(coin = "bitcoin") {

    const response =
        await fetch(`${API_URL}/coins/${coin}`);

    if (!response.ok) {
        throw new Error("Coin not found");
    }

    return await response.json();
}
export async function fetchHistory(
    coin = "bitcoin"
) {

    const response =
        await fetch(
            `${API_URL}/coins/${coin}/market_chart?vs_currency=usd&days=7`
        );

    if (!response.ok) {

        throw new Error(
            "History not found"
        );
    }

    return await response.json();
}
export async function fetchMarkets() {

    const response =
        await fetch(
            `${API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1`
        );

    if (!response.ok) {

        throw new Error(
            "Market data not found"
        );
    }

    return await response.json();
}