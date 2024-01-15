// Function to fetch data for a specific blockHeight
function fetchDataForBlockHeights(customBlockHeights) {
  const chartContainer = document.getElementById('chart-container');
  chartContainer.innerHTML = ''; // Clear the chart container

  // Set the width and height of the container div
  chartContainer.style.width = '100%';
  chartContainer.style.maxWidth = '1600px'; // Set a maximum width for the container
  chartContainer.style.height = '0 auto';
  chartContainer.style.display = 'flex';
  chartContainer.style.flexDirection = 'row'; // Display charts side by side
  // chartContainer.style.flexWrap = 'wrap'; // Allow charts to wrap to the next line
  chartContainer.style.margin = '5 auto'; // Center the container horizontally

  // Function to fetch data for a single block height
  function fetchDataForBlockHeight(customBlockHeight) {
    return fetch('https://rpc.nosocoin.com:8078', {
      method: 'POST',
      headers: {
        'Origin': 'https://rpc.nosocoin.com'
      },
      body: JSON.stringify({
        "jsonrpc": "2.0",
        "method": "getblockmns",
        "params": [customBlockHeight],
        "id": 20
      })
    })
      .then(response => response.json());
  }

  // Create an array of promises for fetching data for block heights
  const blockHeightPromises = customBlockHeights.map(customBlockHeight => fetchDataForBlockHeight(customBlockHeight));

  // Fetch data for all block heights concurrently
  Promise.all(blockHeightPromises)
    .then(results => {
      // Create the initial chart with actual data
      chartLine(customBlockHeights, results);

      // Fetch data for the second line chart
      const currentBlock = results[0].result[0].block;
      const blockHeightsForLineChart2 = Array.from({ length: 15 }, (_, index) => currentBlock - (index * 288));
      fetchDataForBlockHeights2(blockHeightsForLineChart2);
    })
    .catch(error => console.error(error));
}

// Function to fetch data for the second line chart
function fetchDataForBlockHeights2(customBlockHeights) {
  // Function to fetch data for a single block height
  function fetchDataForBlockHeight(customBlockHeight) {
    return fetch('https://rpc.nosocoin.com:8078', {
      method: 'POST',
      headers: {
        'Origin': 'https://rpc.nosocoin.com'
      },
      body: JSON.stringify({
        "jsonrpc": "2.0",
        "method": "getblockmns",
        "params": [customBlockHeight],
        "id": 20
      })
    })
      .then(response => response.json());
  }

  // Create an array of promises for fetching data for block heights
  const blockHeightPromises = customBlockHeights.map(customBlockHeight => fetchDataForBlockHeight(customBlockHeight));

  // Fetch data for all block heights concurrently
  Promise.all(blockHeightPromises)
    .then(results => {
      // Create the second line chart with actual data
      chartLine2(customBlockHeights, results);
    })
    .catch(error => console.error(error));
}

function chartLine(customBlockHeights, results) {
  // Dynamically create canvas element
  const canvas = document.createElement('canvas');
  canvas.id = 'lineChart';

  // Append canvas to the specified container
  document.getElementById('chart-container').appendChild(canvas);

  const ctx = canvas.getContext('2d');

  const blockNumbers = customBlockHeights;
  const nodeCounts = results.map(data => data.result[0].count);

  const lineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: blockNumbers,
      datasets: [
        {
          label: 'Past 24 hours',
          data: nodeCounts,
          borderColor: 'rgb(75, 192, 192)',
          fill: false,
        },
      ],
    },
    options: {
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          title: {
            display: true,
            text: 'Height',
          },
          ticks: {
            callback: function(value, index, values) {
              return value.toLocaleString(undefined, { useGrouping: false }); // Remove comma
            },
          },
        },
        y: {
          type: 'linear',
          position: 'left',
          title: {
            display: true,
            text: 'Nodes',
          },
        },
      },
      elements: {
        point: {
          backgroundColor: 'rgba(75, 192, 192, 1)',
        },
      },
      plugins: {
        legend: {
          labels: {
            color: 'white', // Legend text color
          },
        },
      },
      layout: {
        padding: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10,
        },
      },
      responsive: true, // Set to false to prevent resizing the chart
      maintainAspectRatio: true, // Set to false to allow the  to dynamically resize
      backgroundColor: 'rgba(50, 50, 50, 1)', // Dark gray background color
    },
  });
}

function chartLine2(customBlockHeights, results) {
  // Dynamically create canvas element for the second line chart
  const canvas2 = document.createElement('canvas');
  canvas2.id = 'lineChart2';

  // Append canvas to the specified container
  document.getElementById('chart-container').appendChild(canvas2);

  const ctx2 = canvas2.getContext('2d');

  const blockNumbers2 = customBlockHeights;
  const nodeCounts2 = results.map(data => data.result[0].count);

  const lineChart2 = new Chart(ctx2, {
    type: 'line',
    data: {
      labels: blockNumbers2,
      datasets: [
        {
          label: 'Past 30 Days',
          data: nodeCounts2,
          borderColor: 'rgb(255, 99, 132)',
          fill: false,
        },
      ],
    },
    options: {
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          title: {
            display: true,
            text: 'Height',
          },
          ticks: {
            callback: function(value, index, values) {
              return value.toLocaleString(undefined, { useGrouping: false }); // Remove comma
            },
          },
        },
        y: {
          type: 'linear',
          position: 'left',
          title: {
            display: true,
            text: 'Node Count',
          },
        },
      },
      elements: {
        point: {
          backgroundColor: 'rgba(255, 99, 132, 1)',
        },
      },
      plugins: {
        legend: {
          labels: {
            color: 'white', // Legend text color
          },
        },
      },
      layout: {
        padding: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10,
        },
      },
      responsive: true, // Set to false to prevent resizing the chart
      maintainAspectRatio: true, // Set to false to allow the canvas to dynamically resize
    },
  });
}

// Function to handle popstate event and refresh charts
function handlePopState() {
  // Fetch and update charts
  fetchDataForBlockHeights(Array.from({ length: 14 }, (_, index) => customBlockHeight - (index * 10)));
}

// Attach event listener to popstate event
window.addEventListener('popstate', handlePopState);

// Initial fetch to get the currentHeight
const customParams = new URLSearchParams(window.location.search);
let customBlockHeight = customParams.get('blockheight');

if (!customBlockHeight) {
  // If customBlockHeight is not set, fetch the current height
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
      customBlockHeight = data.result[0].lastblock;
      customParams.set('blockheight', customBlockHeight);
      const newUrl = `${window.location.origin}${window.location.pathname}?${customParams.toString()}`;
      window.history.replaceState(null, '', newUrl);

      // Fetch and update charts
      fetchDataForBlockHeights(Array.from({ length: 14 }, (_, index) => customBlockHeight - (index * 10)));
    })
    .catch(error => console.error(error));
} else {
  // If customBlockHeight is already set, fetch and update charts
  fetchDataForBlockHeights(Array.from({ length: 14 }, (_, index) => customBlockHeight - (index * 10)));
}

