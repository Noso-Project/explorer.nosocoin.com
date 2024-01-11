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
// Function to make the API call and update the DOM for mn-lock-funds
async function fetchLockFunds() {
  try {
    const response = await fetch('https://api.nosocoin.com/info/locked_supply');
    const mnLockFunds = await response.text();

    if (!isNaN(mnLockFunds)) {
      document.getElementById('mn-lock-funds').innerText = mnLockFunds;
      return mnLockFunds;
    } else {
      throw new Error('mn-lock-funds data not a valid number.');
    }
  } catch (error) {
    console.error('Error fetching mn-lock-funds:', error);
  }
}

// Function to calculate and display mn-lock-count
function displayLockCount(mnLockFunds) {
  const mnLockCount = mnLockFunds / 10500;
  document.getElementById('mn-lock-count').innerText = mnLockCount;

  // Call the function to calculate and display mn-inactive-nodes with a delay
  setTimeout(() => {
    const nodeCount = parseFloat(document.getElementById('node-count').innerText);
    calculateInactiveNodes(mnLockCount, nodeCount);
  }, 500); // You can adjust the delay time (in milliseconds) as needed
}

// Function to calculate and display mn-inactive-nodes
function calculateInactiveNodes(mnLockCount, nodeCount) {
  const mnInactiveNodes = mnLockCount - nodeCount;
  document.getElementById('mn-inactive-nodes').innerText = mnInactiveNodes;
}

// Call the functions when the page loads
fetchLockFunds().then(mnLockFunds => {
  // Call the lock count function after fetching mn-lock-funds
  if (!isNaN(mnLockFunds)) {
    displayLockCount(mnLockFunds);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  let blockHeight = urlParams.get('blockheight');

  // Function to update the URL with the new blockHeight value
  function updateURL(newBlockHeight) {
    urlParams.set('blockheight', newBlockHeight);
    const newUrl = `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }

  // Function to fetch data for a specific blockHeight
  function fetchDataForBlockHeight(blockHeight) {
    const getsupply = document.getElementById('getsupply');
    fetch('https://api.nosostats.com:8078', {
      method: 'POST',
      headers: {
        'Origin': 'https://api.nosostats.com'
      },
      body: JSON.stringify({
        "jsonrpc": "2.0",
        "method": "getblockmns",
        "params": [blockHeight],
        "id": 20
      })
    })
      .then(response => response.json())
      .then(data => {
        const tableContainer = document.getElementById('mns-rewards-table');
        tableContainer.innerHTML = ''; // Clear the table container

        const table = document.createElement('table');
        table.id = 'blockmns-table';
        table.classList.add('styled-table2');
        table.style.width = '600px'; // Set table width
        table.style.float = 'left'; // Align table to the left

        const headerRow = document.createElement('tr');
        const headers = ['Address', 'Reward'];

        headers.forEach(header => {
          const th = document.createElement('th');
          th.textContent = header;
          headerRow.appendChild(th);
        });

        table.appendChild(headerRow);

        data.result.forEach(result => {
          const addresses = result.addresses.split(',');

          addresses.forEach((address, index) => {
            const row = document.createElement('tr');

            const addressCell = document.createElement('td');
            const addressLink = document.createElement('a');
            addressLink.href = `getaddressbalance.html?address=${address}`;
            addressLink.textContent = address;
            addressCell.appendChild(addressLink);
            row.appendChild(addressCell);

            const rewardCell = document.createElement('td');
            rewardCell.textContent = (result.reward * 0.00000001).toFixed(8);
            row.appendChild(rewardCell);

            table.appendChild(row);
          });
        });

        tableContainer.appendChild(table);

        // Set IDs for individual elements
        document.getElementById('total-reward').textContent = (data.result[0].total * 0.00000001).toFixed(8);
        document.getElementById('node-count').textContent = data.result[0].count;
        document.getElementById('node-reward').textContent = (data.result[0].reward * 0.00000001).toFixed(8);
        document.getElementById('node-24hr-reward').textContent = (data.result[0].reward * 0.00000001 * 144).toFixed(0);
        document.getElementById('node-7day-reward').textContent = (data.result[0].reward * 0.00000001 * 1008).toFixed(0);
        document.getElementById('node-30day-reward').textContent = (data.result[0].reward * 0.00000001 * 4320).toFixed(0);
        document.getElementById('node-365day-reward').textContent = (data.result[0].reward * 0.00000001 * 52560).toFixed(0);        

        // Blockheight
        var blockheightElement = document.getElementById('blockheight');
        var blockheightLink = document.createElement("a");
        blockheightLink.href = "getblockinfo.html?blockheight=" + blockHeight;
        blockheightLink.textContent = blockHeight;
        blockheightElement.appendChild(blockheightLink);

        // Node Locked Funds
        const nodeCount = data.result[0].count;
        document.getElementById('node-funds-locked').textContent = parseInt(nodeCount * 10500);

        // Calculate and set the earning-percentage
        const totalReward = parseFloat(data.result[0].total * 0.00000001);
        const activeNodes = parseInt(data.result[0].count);
        const earningPercentage = (totalReward / (totalReward * activeNodes)) * 100;
        document.getElementById('earning-percentage').textContent = earningPercentage.toFixed(2) + '%';

        // Call the function to calculate and display mn-inactive-nodes
        const mnLockCount = parseFloat(document.getElementById('mn-lock-count').innerText);
        calculateInactiveNodes(mnLockCount, nodeCount);

        // Call the function to fetch data for the line chart
        fetchBlockDataForChart();
  // Calculate node rewards in USDT and BTC
  const nosoUsdtLastPriceElement = document.getElementById('noso-usdt-lastPrice');
  const nosoBtcLastPriceElement = document.getElementById('noso-btc-lastPrice');

  if (nosoUsdtLastPriceElement && nosoBtcLastPriceElement) {
    const nosoUsdtLastPrice = parseFloat(nosoUsdtLastPriceElement.textContent);
    const nosoBtcLastPrice = parseFloat(nosoBtcLastPriceElement.textContent);

    const reward = data.result[0].reward * 0.00000001;

    document.getElementById('node-24hr-reward-usdt').textContent = (reward * 144 * nosoUsdtLastPrice).toFixed(2);
    document.getElementById('node-7day-reward-usdt').textContent = (reward * 1008 * nosoUsdtLastPrice).toFixed(2);
    document.getElementById('node-30day-reward-usdt').textContent = (reward * 4320 * nosoUsdtLastPrice).toFixed(2);
    document.getElementById('node-365day-reward-usdt').textContent = (reward * 52560 * nosoUsdtLastPrice).toFixed(2);
    document.getElementById('node-value-usdt').textContent = (10500 * nosoUsdtLastPrice).toFixed(2);

    document.getElementById('node-24hr-reward-btc').textContent = (reward * 144 * nosoBtcLastPrice).toFixed(8);
    document.getElementById('node-7day-reward-btc').textContent = (reward * 1008 * nosoBtcLastPrice).toFixed(8);
    document.getElementById('node-30day-reward-btc').textContent = (reward * 4320 * nosoBtcLastPrice).toFixed(8);
    document.getElementById('node-365day-reward-btc').textContent = (reward * 52560 * nosoBtcLastPrice).toFixed(8);
    document.getElementById('node-value-btc').textContent = (10500 * nosoBtcLastPrice).toFixed(8);   
  } else {
    console.error("Elements 'noso-usdt-lastPrice' or 'noso-btc-lastPrice' not found.");
  }      
      })
      .catch(error => console.error(error));
  
  }



  // Fetch the currentHeight if blockHeight is not available
  if (!blockHeight) {
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
        blockHeight = currentHeight;
        updateURL(blockHeight);
        fetchDataForBlockHeight(blockHeight);
      })
      .catch(error => console.error(error));
  } else {
    // If blockHeight is available in the URL, directly fetch data
    fetchDataForBlockHeight(blockHeight);
  }

  // Handle the "Back" button click
  document.getElementById('backButton').addEventListener('click', () => {
    if (blockHeight) {
      blockHeight = Math.max(1, parseInt(blockHeight) - 1); // Ensure it doesn't go lower than 1
      updateURL(blockHeight);
      fetchDataForBlockHeight(blockHeight);
      location.reload();
    }
  });

  // Handle the "Forward" button click
  document.getElementById('forwardButton').addEventListener('click', () => {
    if (blockHeight) {
      // Fetch the current height
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

          if (blockHeight < currentHeight) {
            blockHeight = parseInt(blockHeight) + 1;
            updateURL(blockHeight);
            fetchDataForBlockHeight(blockHeight);
            location.reload();
          }
        })
        .catch(error => console.error(error));
    }
  });

  // Handle popstate event to fetch and update data when the back/forward button is clicked
  window.addEventListener('popstate', function () {
    blockHeight = urlParams.get('blockheight');
    fetchDataForBlockHeight(blockHeight);
  });

  // Function to fetch data for the past (10x150 = 24hrs) (120x4200 = 30 days) (1200X50400 = 1yr) (2400x100800 = 2yr)
  function fetchBlockDataForChart() {
    const blockIncrement = 3000;
    const totalBlocks = 102800;
    const promises = [];

    // Start fetching from the current block and subtract in increments of 10 until 150 blocks are fetched
    for (let i = 0; i < totalBlocks; i += blockIncrement) {
      const currentBlock = blockHeight - i;

      const promise = fetch('https://api.nosostats.com:8078', {
        method: 'POST',
        headers: {
          'Origin': 'https://api.nosostats.com'
        },
        body: JSON.stringify({
          "jsonrpc": "2.0",
          "method": "getblockmns",
          "params": [currentBlock],
          "id": 21
        })
      })
        .then(response => response.json())
        .then(data => {
          // Process the data for each block and return the relevant information
          const result = data.result[0]; // Assuming you are interested in the first result
          const addresses = result.addresses.split(',');
          return {
            labels: [currentBlock], // Block height for X-axis
            data: [addresses.length], // Count of addresses for Y-axis
          };
        })
        .catch(error => console.error(error));

      promises.push(promise);
    }

    // Once all promises are resolved, update the chart
    Promise.all(promises)
      .then(results => {
        const chartData = {
          labels: [],
          datasets: [{
            // Removed label and legend
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        };

        // Aggregate the results
        results.forEach(result => {
          chartData.labels = chartData.labels.concat(result.labels);
          chartData.datasets[0].data = chartData.datasets[0].data.concat(result.data);
        });

        // Chart Configuration
        const chartConfig = {
          type: 'line',
          data: chartData,
          options: {
            scales: {
              x: {
                type: 'linear',
                position: 'bottom'
              },
              y: {
                type: 'linear',
                position: 'left'
              }
            },
            // Removed legend
            plugins: {
              legend: {
                display: false
              }
            }
          }
        };

        // Get chart container
        const chartContainer = document.getElementById('lineChart').getContext('2d');

        // Create the chart
        new Chart(chartContainer, chartConfig);
      })
      .catch(error => console.error(error));
  }
});

// Function to calculate and display mn-inactive-nodes
document.addEventListener("DOMContentLoaded", function () {
  const mnLockCount = parseFloat(document.getElementById('mn-lock-count').innerText);
  const nodeCount = parseFloat(document.getElementById('node-count').innerText);
  calculateInactiveNodes(mnLockCount, nodeCount);
});
