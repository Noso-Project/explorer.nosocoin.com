document.addEventListener("DOMContentLoaded", function () {
// Initial fetch to get the currentHeight
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
    if (!blockHeight) {
      blockHeight = currentHeight;
      urlParams.set('blockheight', blockHeight);
      const newUrl = `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`;
      window.history.replaceState(null, '', newUrl);
    }

    fetchDataForBlockHeight(blockHeight);
  })
  .catch(error => console.error(error));


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
        document.getElementById('node-24hr-reward').textContent = (data.result[0].reward * 0.00000001 * 144).toFixed(8);
        document.getElementById('node-7day-reward').textContent = (data.result[0].reward * 0.00000001 * 1008).toFixed(8);
        document.getElementById('node-30day-reward').textContent = (data.result[0].reward * 0.00000001 * 4320).toFixed(8);
 
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
      })
      .catch(error => console.error(error));
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

  // Function to fetch data for the past 150 blocks in increments of 10
  function fetchBlockDataForChart() {
    const blockIncrement = 10;
    const totalBlocks = 150;
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

  // Call the function to fetch data for the line chart
  fetchBlockDataForChart();
});