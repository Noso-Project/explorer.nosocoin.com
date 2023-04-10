          function fetchMarketData() {
        // NOSO-USDT
        const usdtApiUrl = 'https://www.sevenseas.exchange/api/v1/markets/NOSO-USDT';

        fetch(usdtApiUrl)
            .then(response => response.json())
            .then(data => {

                const nosoUsdtLastPrice = data.lastPrice;
                const nosoUsdtTradeVolume = data.volume;


                document.getElementById('noso-usdt-lastPrice').innerText = ` ${nosoUsdtLastPrice}`;
                document.getElementById('noso-usdt-trade-volume').innerText = `NOSO-USDT Trade Volume: ${nosoUsdtTradeVolume}`;
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