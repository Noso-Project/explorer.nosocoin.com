// Function to make RPC call to retrieve current block height and pending transactions
async function getCurrentBlockInfo() {
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
    return {
      lastBlock: data.result[0].lastblock,
      pendingTransactions: data.result[0].pending
    };
  } else {
    throw new Error('Unable to retrieve current block height');
  }
}

// Function to parse block height from URL parameters
function parseBlockHeightFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return parseInt(urlParams.get('blockheight'));
}

// Function to fetch block orders for the last 144 blocks
async function fetchBlockOrdersForLast144Blocks() {
  try {
    const currentBlockInfo = await getCurrentBlockInfo();
    const currentBlockHeight = currentBlockInfo.lastBlock;
    const pendingTransactions = currentBlockInfo.pendingTransactions;
    
    const startingBlockHeight = currentBlockHeight - 144;
    const blockOrderPromises = [];
    for (let i = 0; i < 144; i++) {
      const blockHeight = startingBlockHeight - i;
      const orderPromise = fetchBlockOrders(blockHeight);
      blockOrderPromises.push(orderPromise);
    }
    const blockOrders = await Promise.all(blockOrderPromises);
    return { blockOrders, pendingTransactions };
  } catch (error) {
    console.error('Error fetching block orders for the last 144 blocks:', error);
    throw error;
  }
}

// Function to fetch block orders
async function fetchBlockOrders(blockHeight) {
  const response = await fetch('https://rpc.nosocoin.com:8078', {
    method: 'POST',
    headers: {
      'Origin': 'https://rpc.nosocoin.com'
    },
    body: JSON.stringify({
      "jsonrpc": "2.0",
      "method": "getblockorders",
      "params": [blockHeight],
      "id": 18
    })
  });

  return response.json();
}

// Function to calculate movements over 100, 1000, and 10000 based on the last 144 blocks
async function calculateAllMovements() {
  try {
    const { blockOrders, pendingTransactions } = await fetchBlockOrdersForLast144Blocks();

    let movements100 = 0;
    let movements1000 = 0;
    let movements10000 = 0;
    let movements1 = 0;
    let movementssum = 0;

    // Process orders to calculate movements
    blockOrders.forEach((blockOrder, index) => {
      const orders = blockOrder.result[0].orders;
      orders.forEach(order => {
        const amountInBTC = order.amount * 0.00000001; // Convert from Satoshi to BTC
        if (amountInBTC > 100) {
          movements100++;
        }
        if (amountInBTC > 1000) {
          movements1000++;
        }
        if (amountInBTC > 10000) {
          movements10000++;
        }
        if (amountInBTC > 0) {
          movements1++;
        }
        movementssum += amountInBTC;
      });
    });

    // Populate the HTML elements with the calculated values
    document.getElementById('movements100').textContent = movements100;
    document.getElementById('movements1000').textContent = movements1000;
    document.getElementById('movements10000').textContent = movements10000;
    document.getElementById('movements1').textContent = movements1;
    document.getElementById('movementssum').textContent = movementssum.toFixed(8);
    document.getElementById('m-pendings').textContent = pendingTransactions;

  } catch (error) {
    console.error('Error calculating movements:', error);
  }
}

// Call the function to calculate all movements
calculateAllMovements();
