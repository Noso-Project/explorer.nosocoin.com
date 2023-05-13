    document.addEventListener('DOMContentLoaded', function() {
      const nodeCountElement = document.getElementById('node-count');
      const mnCoinsLockedElement = document.getElementById('mncoinslocked');
      const totalValueLockedElement = document.getElementById('totalvaluelocked');
      const tvlPercentageElement = document.getElementById('tvlpercentage');
      const nosomcapElement = document.getElementById('nosomcap');
  const circulatingElement = document.getElementById('circulating');

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
          fetch('https://nosostats.com:8079', {
            method: 'POST',
            headers: {
              'Origin': 'https://nosostats.com'
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

              // Fetch current supply
              fetch('https://nosostats.com:8079', {
                method: 'POST',
                headers: {
                  'Origin': 'https://nosostats.com'
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



                  // Fetch last price
                  fetch('https://www.sevenseas.exchange/api/v1/markets/NOSO-USDT')
                    .then(response => response.json())
                    .then(data => {
                      const lastPrice = data.lastPrice;
                 
 	      // Calculate total value locked
                  const totalValueLocked = (mnCoinsLocked * lastPrice) * .000001;
                  totalValueLockedElement.textContent = "$" + totalValueLocked.toFixed(2) + " M";

                      // Calculate NOSOMCAP
                      const nosomcap = currentSupply * lastPrice;
                      nosomcapElement.textContent = "$" + (nosomcap / 100000000000000).toFixed(2) + " M";

                      // Calculate TVL percentage
                      const tvlPercentage = (mnCoinsLocked / currentSupply) * 10000000000;
                      tvlPercentageElement.textContent = tvlPercentage.toFixed(2) + "%";

	      // Calculate Circulating
	      const circulating = (currentSupply / 21000000) *  .000001;
	      circulatingElement.textContent = circulating.toFixed(2) + "%";

                    })
                    .catch(error => console.error(error));
                })
                .catch(error => console.error(error));
            })
            .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
    });