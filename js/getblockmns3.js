/ Initialize Chart.js
const Chart = require('chart.js');

// Initial fetch to get the currentHeight
fetch('https://rpc.nosocoin.com:8078', {
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

// Rest of your code
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
  fetch('https://rpc.nosocoin.com:8078', {
    method: 'POST',
    headers: {
      'Origin': 'https://rpc.nosocoin.com'
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
      document.getElementById('node-funds-locked').textContent = parseInt(data.result[0].count * 10500);

      // Call the function to create the chart
      createNodeCountChart(blockHeight);
    })
    .catch(error => console.error(error));
}

// Function to create the chart
function createNodeCountChart(blockHeight) {
  const chartLabels = [];
  const chartNodeCounts = [];

  // Fetch data for the chart for 14 block heights
  for (let i = blockHeight; i >= Math.max(1, blockHeight - 13); i--) {
    chartLabels.push(i);
    // Replace this with actual node count data for each block height
    // For now, using a placeholder value (replace it with actual data)
    chartNodeCounts.push(i * 1000);
  }

  const ctx = document.getElementById('nodeCountChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: chartLabels,
      datasets: [
        {
          label: 'Node Count',
          data: chartNodeCounts,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// Handle the "Back" button click
document.getElementById('backButton').addEventListener('click', () => {
  if (blockHeight) {
    blockHeight = Math.max(1, parseInt(blockHeight) - 1); // Ensure it doesn't go lower than 1
    updateURL(blockHeight);
    fetchDataForBlockHeight(blockHeight);
  }
});

// Handle the "Forward" button click
document.getElementById('forwardButton').addEventListener('click', () => {
  if (blockHeight) {
    // Fetch the current height
    fetch('https://rpc.nosocoin.com:8078', {
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
    })
      .then(response => response.json())
      .then(data => {
        const currentHeight = data.result[0].lastblock;
        if (blockHeight < currentHeight) {
          blockHeight = parseInt(blockHeight) + 1;
          updateURL(blockHeight);
          fetchDataForBlockHeight(blockHeight);
        }
      })
      .catch(error => console.error(error));
  }
});