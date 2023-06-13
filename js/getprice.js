function fetchMarketData() {
  // NOSO-USDT
  const usdtApiUrl = 'https://api.nosocoin.com:3001/api/public/getticker?market=NOSO/USDT';

  fetch(usdtApiUrl)
    .then(response => response.json())
    .then(data => {
      const nosoUsdtLastPrice = data.result.Last;

      document.getElementById('noso-usdt-lastPrice').innerText = ` ${nosoUsdtLastPrice}`;
    })
    .catch(error => console.error(error));

  // NOSO-BTC
  const btcApiUrl = 'https://www.sevenseas.exchange/api/v1/markets/NOSO-BTC';

  fetch(btcApiUrl)
    .then(response => response.json())
    .then(data => {
      const nosoBtcLastPrice = data.lastPrice;
      const nosoBtcTradeVolume = data.volume;

      document.getElementById('noso-btc-lastPrice').innerText = `${nosoBtcLastPrice}`;
      document.getElementById('noso-btc-trade-volume').innerText = `NOSO-BTC Trade Volume: ${nosoBtcTradeVolume}`;
    })
    .catch(error => console.error(error));
}

fetchMarketData();
setInterval(fetchMarketData, 60000);
