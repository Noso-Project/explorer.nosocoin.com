async function fetchLivecoinWatchData() {
  try {
    const response = await fetch(new Request("https://api.livecoinwatch.com/coins/single"), {
      method: "POST",
      headers: new Headers({
        "content-type": "application/json",
        "x-api-key": "20e72753-31e6-46f4-8ed0-a8e92161b1fc", // Replace with your actual API key
      }),
      body: JSON.stringify({
        currency: "USD",
        code: "NOSO",
        meta: false,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      throw new Error("LivecoinWatch API request failed");
    }
  } catch (error) {
    console.error("Error fetching LivecoinWatch data:", error);
    return null;
  }
}

async function fetchBTCValue() {
  try {
    const response = await fetch('https://tradeogre.com/api/v1/markets');
    if (response.ok) {
      const data = await response.json();
      const btcUsdtAsk = data.find(market => market.hasOwnProperty("BTC-USDT"))["BTC-USDT"]["ask"];
      return btcUsdtAsk;
    } else {
      throw new Error("BTC value fetch request failed");
    }
  } catch (error) {
    console.error("Error fetching BTC value:", error);
    return null;
  }
}

async function displayData() {
  const nosoUsdtLastPriceElement = document.getElementById("noso-usdt-lastPrice");
  const nosoBtcLastPriceElement = document.getElementById("noso-btc-lastPrice");

  const livecoinWatchData = await fetchLivecoinWatchData();
  if (livecoinWatchData) {
    const nosoUsdtLastPrice = livecoinWatchData.rate.toFixed(2); // Round to two decimal places
    nosoUsdtLastPriceElement.textContent = nosoUsdtLastPrice;

    const btcValue = await fetchBTCValue();
    if (btcValue) {
      const nosoValueInUsdt = livecoinWatchData.rate; // Use the obtained Noso value
      const nosoToBtcValue = (nosoValueInUsdt / btcValue).toFixed(8); // Round to eight decimal places
      nosoBtcLastPriceElement.textContent = nosoToBtcValue;
    } else {
      nosoBtcLastPriceElement.textContent = "Failed to calculate Noso to BTC value.";
    }
  } else {
    nosoUsdtLastPriceElement.textContent = "Failed to fetch data from LivecoinWatch API.";
    nosoBtcLastPriceElement.textContent = "";
  }
}

displayData();
