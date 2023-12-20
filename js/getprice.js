async function fetchNosoCoinData() {
  try {
    const response = await fetch("https://api.nosocoin.com/info/price?range=day&interval=1");

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      throw new Error("NosoCoin API request failed");
    }
  } catch (error) {
    console.error("Error fetching NosoCoin data:", error);
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

  const nosoCoinData = await fetchNosoCoinData();
  if (nosoCoinData && nosoCoinData.length > 0) {
    const lastDataPoint = nosoCoinData[nosoCoinData.length - 1];
    const nosoUsdtLastPrice = lastDataPoint.price.toFixed(2); // Round to two decimal places
    nosoUsdtLastPriceElement.textContent = nosoUsdtLastPrice;

    const btcValue = await fetchBTCValue();
    if (btcValue) {
      const nosoValueInUsdt = lastDataPoint.price; // Use the obtained Noso value
      const nosoToBtcValue = (nosoValueInUsdt / btcValue).toFixed(8); // Round to eight decimal places
      nosoBtcLastPriceElement.textContent = nosoToBtcValue;
    } else {
      nosoBtcLastPriceElement.textContent = "Failed to calculate Noso to BTC value.";
    }
  } else {
    nosoUsdtLastPriceElement.textContent = "API Unavailable.";
    nosoBtcLastPriceElement.textContent = "";
  }
}

displayData();
