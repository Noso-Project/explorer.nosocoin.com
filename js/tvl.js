document.addEventListener('DOMContentLoaded', function() {
  const nodeCountElement = document.getElementById('node-count');
  const mnCoinsLockedElement = document.getElementById('mncoinslocked');
  const totalValueLockedElement = document.getElementById('totalvaluelocked');
  const tvlPercentageElement = document.getElementById('tvlpercentage');
  const nosomcapElement = document.getElementById('nosomcap');
  const circulatingElement = document.getElementById('circulating');
  const nodeAroiElement = document.getElementById('node-aroi');
  const nodeRewardElement = document.getElementById('node-reward');
  const nodeAroiUsdtElement = document.getElementById('node-aroi-usdt');

  // Fetch current block height
  fetch('https://api.nosostats.com:8078', {
    method: 'POST',
    headers: {
      'Origin': 'https://api.nosostats.com'
    },
    body: JSON.stringify({
      "jsonrpc": "2.0",
      "method": "getmainnetinfo",
      "params": [],
      "id": 9
    })
  })
    .then(response => response.json())
    .then(data => {
      const currentHeight = data.result[0].lastblock;

      // Fetch node count for the current block height
      fetch('https://api.nosostats.com:8078', {
        method: 'POST',
        headers: {
          'Origin': 'https://api.nosostats.com'
        },
        body: JSON.stringify({
          "jsonrpc": "2.0",
          "method": "getblockmns",
          "params": [currentHeight],
          "id": 10
        })
      })
        .then(response => response.json())
        .then(data => {
          const nodeCount = data.result[0].count; // Use 'count' property to get the node count
          nodeCountElement.textContent = nodeCount;

          // Calculate locked MN coins
          const mnCoinsLocked = nodeCount * 10500;
          mnCoinsLockedElement.textContent = (mnCoinsLocked / 1000000).toFixed(2) + "M /";

          // Calculate node-reward
          const nodeReward = data.result[0].reward * 0.00000001;
          nodeRewardElement.textContent = nodeReward.toFixed(8);

          // Fetch last price
          fetch('https://api.nosocoin.com:3001/api/public/getticker?market=NOSO/USDT')
            .then(response => response.json())
            .then(data => {
              const lastPrice = data.result.Last;

              // Calculate node-aroi
              const nodeAroi = (52560 * nodeReward) / 105;
              nodeAroiElement.textContent = Math.round(nodeAroi).toFixed(0); // Round to the nearest whole number

              // Calculate node-aroi-usdt
              const nodeAroiUsdt = (52560 * nodeReward) * lastPrice;
              nodeAroiUsdtElement.textContent = Math.round(nodeAroiUsdt).toFixed(0); // Round to the nearest whole number

              // Calculate total value locked
              const totalValueLocked = (mnCoinsLocked * lastPrice) * .000001;
              totalValueLockedElement.textContent = "$" + totalValueLocked.toFixed(2) + " M";

              // Fetch current supply
              fetch('https://api.nosostats.com:8078', {
                method: 'POST',
                headers: {
                  'Origin': 'https://api.nosostats.com'
                },
                body: JSON.stringify({
                  "jsonrpc": "2.0",
                  "method": "getmainnetinfo",
                  "params": [],
                  "id": 11
                })
              })
                .then(response => response.json())
                .then(data => {
                  const currentSupply = data.result[0].supply;

                  // Calculate NOSOMCAP
                  const nosomcap = currentSupply * lastPrice;
                  nosomcapElement.textContent = "$" + (nosomcap / 100000000000000).toFixed(2) + " M";

                  // Calculate Circulating
                  const circulating = ((currentSupply / 2100000000000000) * 100).toFixed(2);
                  const circulatingFormatted = Math.floor(circulating) + "." + (circulating % 1 * 100).toFixed(0);
                  circulatingElement.textContent = circulatingFormatted + "%";

                  // Calculate TVL percentage
                  const tvlPercentage = (mnCoinsLocked / currentSupply) * 10000000000;
                  tvlPercentageElement.textContent = Math.round(tvlPercentage).toFixed(0) + "%"; // Round to the nearest whole number
                })
                .catch(error => console.error(error));
            })
            .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
    });
});
