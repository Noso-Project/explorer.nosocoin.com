// Function to parse block height from URL parameters
function parseBlockHeightFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return parseInt(urlParams.get('blockheight'));
}

// Function to make RPC call to retrieve current block height
async function getCurrentBlockHeight() {
  const response = await fetch('https://rpc.nosocoin.com:8078', {
    method: 'POST',
    headers: {
      'Origin': 'https://rpc.nosocoin.com'
    },
    body: JSON.stringify({
      "jsonrpc": "2.0",
      "method": "getmainnetinfo",
      "params": [],
      "id": 1
    })
  });

  const data = await response.json();
  if (data.result && data.result.length > 0) {
    return data.result[0].lastblock;
  } else {
    throw new Error('Unable to retrieve current block height');
  }
}

// Function to fetch block information
async function fetchBlockInfo(blockHeight) {
  const response = await fetch('https://rpc.nosocoin.com:8078', {
    method: 'POST',
    headers: {
      'Origin': 'https://rpc.nosocoin.com'
    },
    body: JSON.stringify({
      "jsonrpc": "2.0",
      "method": "getblocksinfo",
      "params": [blockHeight],
      "id": 18
    })
  });

  return response.json();
}

// Variable to store the highest block displayed in the table
let highestBlock = 0;

// Function to navigate to the previous 15 blocks
async function goBack() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    let currentBlock = parseInt(urlParams.get('blockheight'));

    // Calculate the block height for the previous 15 blocks
    let targetBlock = Math.max(currentBlock - 15, 1);

    // Fetch information for the previous 15 blocks
    const previousBlocksData = await Promise.all(
      Array.from({ length: 15 }, (_, i) => fetchBlockInfo(targetBlock + i))
    );

    // Update the table with information for the previous 15 blocks
    updateTable(previousBlocksData.map(data => data.result[0]));

    // Update the URI block height to the highest block in the table
    highestBlock = Math.min(...previousBlocksData.map(data => data.result[0].number));
    window.history.replaceState(null, null, `?blockheight=${highestBlock}`);

    // Update the additional information based on the latest block
    updateAdditionalInfo(previousBlocksData[0].result[0]);
  } catch (error) {
    console.error(error);
  }
}

// Function to navigate to the next 15 blocks
async function goForward() {
  try {
    // Fetch the highest block number currently displayed in the table
    const urlParams = new URLSearchParams(window.location.search);
    let currentBlock = parseInt(urlParams.get('blockheight'));

    // Fetch information for the next 15 blocks starting from the highest block
    const nextBlocksData = await Promise.all(
      Array.from({ length: 15 }, (_, i) => fetchBlockInfo(currentBlock + i + 1))
    );

    // Update the table with information for the next 15 blocks
    updateTable(nextBlocksData.map(data => data.result[0]));

    // Update the URI block height to the highest block in the table
    highestBlock = Math.max(...nextBlocksData.map(data => data.result[0].number));
    window.history.replaceState(null, null, `?blockheight=${highestBlock}`);

    // Update the additional information based on the latest block
    updateAdditionalInfo(nextBlocksData[14].result[0]);
  } catch (error) {
    console.error(error);
  }
}

// Function to update the additional information based on the latest block
async function updateAdditionalInfo(block) {
  document.getElementById('b-blockheight').textContent = block.number;
  document.getElementById('b-transactions').textContent = block.totaltransactions;

  // Calculate b-fees24 and b-coinsminted
  let fees24 = 0;
  let coinsMinted = 0;
  let transactions24 = 0; // Total transactions for the last 144 blocks
  for (let i = 0; i < 144; i++) {
    fees24 += block.feespaid * 0.00000001;
    coinsMinted += block.reward * 0.00000001;
    transactions24 += block.totaltransactions;
  }
  document.getElementById('b-fees24').textContent = fees24.toFixed(8);
  document.getElementById('b-coinsminted').textContent = coinsMinted.toFixed(8);
  document.getElementById('b-transactions24').textContent = transactions24;

  // Calculate time elapsed since the latest block end time
  const latestBlockEndTime = new Date(block.timeend * 1000);
  const currentTime = new Date();
  const timeElapsed = Math.round((currentTime - latestBlockEndTime) / (1000 * 60)); // Convert to minutes and round
  document.getElementById('b-timeelapsed').textContent = timeElapsed + " minutes";
}

// Function to handle fetching block info and populating the table
async function handleBlockInfo() {
  try {
    let blockHeight = parseBlockHeightFromURL();
    let currentBlockData;

    if (!blockHeight) {
      blockHeight = await getCurrentBlockHeight();
      // Update the URL path with the retrieved block height
      window.history.replaceState(null, null, `?blockheight=${blockHeight}`);
    }

    // Fetch information for the current block
    currentBlockData = await fetchBlockInfo(blockHeight);
    highestBlock = currentBlockData.result[0].number; // Update highest block

    // Fetch information for the previous 14 blocks
    const previousBlocksData = await Promise.all(
      Array.from({ length: 14 }, (_, i) => fetchBlockInfo(blockHeight - i - 1))
    );

    // Combine current block data and previous block data
    const blockData = [currentBlockData, ...previousBlocksData];

    // Update the table with information for the current block and the previous 14 blocks
    updateTable(blockData.map(data => data.result[0]));

    // Update the additional information based on the latest block
    updateAdditionalInfo(currentBlockData.result[0]);
  } catch (error) {
    console.error(error);
  }
}

// Function to update the table with block information
function updateTable(blocks) {
  const table = document.getElementById("getblockinfotable");
  const tbody = table.querySelector("tbody");

  // Clear existing content in the table body
  tbody.innerHTML = '';

  // Row headers
  const headers = ['Block Height', 'Start Time', 'End Time', 'Total Transactions', 'Hash', 'Noso Mint Address', 'Coins Minted', 'Fees Paid'];

  // Create row for headers
  const headerRow = document.createElement('tr');
  headerRow.classList.add('header-row');
  headers.forEach((headerText, index) => {
    const headerCell = document.createElement('th');
    headerCell.textContent = headerText;
    if (index === 0 || index === 2 || index === 3) {
      headerCell.classList.add('priority-1');
    } else {
      headerCell.classList.add('priority-6');
    }
    headerRow.appendChild(headerCell);
  });
  tbody.appendChild(headerRow);

  // Sort blocks by block number in descending order
  blocks.sort((a, b) => b.number - a.number);

  // Create table rows for each block
  blocks.forEach(block => {
    const row = document.createElement('tr');
    row.classList.add('data-row');

    // Add table cells for each column
    const cells = [
      `<a href="getblockinfo.html?blockheight=${block.number}" class="${(headers[0] === 'Block Height' || headers[0] === 'End Time' || headers[0] === 'Total Transactions') ? 'priority-1' : 'priority-6'}">${block.number}</a>`,
      new Date(block.timestart * 1000).toLocaleString(),
      `<span class="${(headers[2] === 'Block Height' || headers[2] === 'End Time' || headers[2] === 'Total Transactions') ? 'priority-1' : 'priority-6'}">${new Date(block.timeend * 1000).toLocaleString()}</span>`,
      `<a href="getblockorders.html?blockheight=${block.number}" class="${(headers[3] === 'Block Height' || headers[3] === 'End Time' || headers[3] === 'Total Transactions') ? 'priority-1' : 'priority-6'}">${block.totaltransactions}</a>`,
      block.hash,
      `<a href="getaddressbalance.html?address=${block.miner}">${block.miner}</a>`,
      (block.reward * 0.00000001).toFixed(8),
      (block.feespaid * 0.00000001).toFixed(8)
    ];

    cells.forEach((cellData, index) => {
      const cell = document.createElement('td');
      cell.innerHTML = cellData;
      if (index === 0 || index === 2 || index === 3) {
        cell.classList.add('priority-1');
      } else {
        cell.classList.add('priority-6');
      }
      row.appendChild(cell);
    });

    tbody.appendChild(row);
  });
}

// Call the function to handle block info retrieval and table population
handleBlockInfo();

// Event listeners for navigation buttons
document.getElementById('backward-btn').addEventListener('click', goBack);
document.getElementById('forward-btn').addEventListener('click', goForward);
