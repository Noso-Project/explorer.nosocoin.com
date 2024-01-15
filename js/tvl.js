    document.addEventListener('DOMContentLoaded', async function() {
      try {
        const livecoinWatchData = await fetchLivecoinWatchData();
        if (livecoinWatchData) {
          const nosoUsdtLastPrice = parseFloat(livecoinWatchData.rate).toFixed(2);

          const responseHeight = await fetch('https://rpc.nosocoin.com:8078', {
            method: 'POST',
            headers: {
              'Origin': 'https://rpc.nosocoin.com'
            },
            body: JSON.stringify({
              "jsonrpc": "2.0",
              "method": "getmainnetinfo",
              "params": [],
              "id": 9
            })
          });

          const dataHeight = await responseHeight.json();
          const currentHeight = dataHeight.result[0].lastblock;

          const responseNodeCount = await fetch('https://rpc.nosocoin.com:8078', {
            method: 'POST',
            headers: {
              'Origin': 'https://rpc.nosocoin.com'
            },
            body: JSON.stringify({
              "jsonrpc": "2.0",
              "method": "getblockmns",
              "params": [currentHeight],
              "id": 10
            })
          });

          const dataNodeCount = await responseNodeCount.json();
          const nodeCount = dataNodeCount.result[0].count;

          const mnCoinsLocked = nodeCount * 10500;
          const nodeReward = dataNodeCount.result[0].reward * 0.00000001;

          const responseSupply = await fetch('https://rpc.nosocoin.com:8078', {
            method: 'POST',
            headers: {
              'Origin': 'https://rpc.nosocoin.com'
            },
            body: JSON.stringify({
              "jsonrpc": "2.0",
              "method": "getmainnetinfo",
              "params": [],
              "id": 11
            })
          });

          const dataSupply = await responseSupply.json();
          const currentSupply = dataSupply.result[0].supply;

          const nodeAroi = (52560 * nodeReward) / 105;
          const nodeAroiUsdt = (52560 * nodeReward) * nosoUsdtLastPrice;
          const totalValueLocked = (mnCoinsLocked * nosoUsdtLastPrice) * 0.000001;
          const nosomcap = currentSupply * nosoUsdtLastPrice;
          const circulating = ((currentSupply / 2100000000000000) * 100).toFixed(2);
          const circulatingFormatted = Math.floor(circulating) + "." + (circulating % 1 * 100).toFixed(0);
          const tvlPercentage = (mnCoinsLocked / currentSupply) * 10000000000;

          const nodeCountElement = document.getElementById('node-count');
          const mnCoinsLockedElement = document.getElementById('mncoinslocked');
          const totalValueLockedElement = document.getElementById('totalvaluelocked');
          const tvlPercentageElement = document.getElementById('tvlpercentage');
          const nosomcapElement = document.getElementById('nosomcap');
          const circulatingElement = document.getElementById('circulating');
          const nodeAroiElement = document.getElementById('node-aroi');
          const nodeRewardElement = document.getElementById('node-reward');
          const nodeAroiUsdtElement = document.getElementById('node-aroi-usdt');

          nodeCountElement.textContent = nodeCount;
          mnCoinsLockedElement.textContent = (mnCoinsLocked / 1000000).toFixed(2) + "M /";
          nodeRewardElement.textContent = nodeReward.toFixed(8);
          nodeAroiElement.textContent = Math.round(nodeAroi).toFixed(0);
          nodeAroiUsdtElement.textContent = Math.round(nodeAroiUsdt).toFixed(0);
          totalValueLockedElement.textContent = "$" + totalValueLocked.toFixed(2) + " M";
          nosomcapElement.textContent = "$" + (nosomcap / 100000000000000).toFixed(2) + " M";
          circulatingElement.textContent = circulatingFormatted + "%";
          tvlPercentageElement.textContent = Math.round(tvlPercentage).toFixed(0) + "%";

        } else {
          console.error("Error fetching LivecoinWatch data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });

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