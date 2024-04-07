async function fetchNosoUsdtPrice() {
  try {
    const response = await fetch("https://api.nosocoin.com/info/price?range=day&interval=1");
    if (response.ok) {
      const data = await response.json();
      return data[0].price; // Assuming the first element contains the latest price
    } else {
      throw new Error("Failed to fetch NOSO/USDT price");
    }
  } catch (error) {
    console.error("Error fetching NOSO/USDT price:", error);
    return null;
  }
}

async function fetchNosoBtcPrice() {
  try {
    const response = await fetch('https://tradeogre.com/api/v1/markets');
    if (response.ok) {
      const data = await response.json();
      const btcUsdtAsk = data.find(market => market.hasOwnProperty("BTC-USDT"))["BTC-USDT"]["ask"];
      const nosoUsdtPrice = await fetchNosoUsdtPrice();
      const nosoBtcPrice = (nosoUsdtPrice / btcUsdtAsk).toExponential(4); // Calculate NOSO/BTC price and convert to scientific notation with 4 decimal places
      return nosoBtcPrice;
    } else {
      throw new Error("Failed to fetch NOSO/BTC price");
    }
  } catch (error) {
    console.error("Error fetching NOSO/BTC price:", error);
    return null;
  }
}


document.addEventListener("DOMContentLoaded", async function () {
  const nosoUsdtPriceElement = document.getElementById("noso-usdt-price");
  const nosoBtcPriceElement = document.getElementById("noso-btc-price");
const nosoUsdtPrice = await fetchNosoUsdtPrice();
if (nosoUsdtPrice !== null) {
  const nosoUsdtLastPrice = parseFloat(nosoUsdtPrice); // Assigning the fetched price for further use
  nosoUsdtPriceElement.innerText = nosoUsdtLastPrice.toFixed(2); // Format Noso/USDT value to display only two decimal places
} else {
  nosoUsdtPriceElement.innerText = "Failed to fetch NOSO/USDT price.";
}


  const nosoBtcPrice = await fetchNosoBtcPrice();
  if (nosoBtcPrice !== null) {
    nosoBtcPriceElement.innerText = nosoBtcPrice;
    const nosoBtcLastPrice = parseFloat(nosoBtcPrice); // Assigning the fetched price for further use
  } else {
    nosoBtcPriceElement.innerText = "Failed to fetch NOSO/BTC price.";
  }

  // Call the functions to calculate rewards and values when prices are fetched
  calculateRewardsAndValues();
});
// Function to make the API call and update the DOM for mn-lock-funds
async function fetchLockFunds() {
  try {
    const response = await fetch('https://api.nosocoin.com/info/locked_supply');
    const mnLockFunds = await response.text();

    if (!isNaN(mnLockFunds)) {
      const formattedMnLockFunds = parseFloat((parseInt(mnLockFunds) / 1000000).toFixed(1));
      document.getElementById('mn-lock-funds').innerText = formattedMnLockFunds + 'M';
      return mnLockFunds;
    } else {
      throw new Error('mn-lock-funds data not a valid number.');
    }
  } catch (error) {
    console.error('Error fetching mn-lock-funds:', error);
  }
}


// Call the fetchLockFunds function
fetchLockFunds();

async function calculateRewardsAndValues() {
  const reward = parseFloat(document.getElementById('node-reward').innerText);

  // Retrieve the fetched prices from the elements
  const nosoUsdtLastPrice = parseFloat(document.getElementById('noso-usdt-price').textContent);
  const nosoBtcLastPrice = parseFloat(document.getElementById('noso-btc-price').textContent);

  // Calculations using NOSO/USDT price
  document.getElementById('node-24hr-reward-usdt').textContent = (reward * 144 * nosoUsdtLastPrice).toFixed(2);
  document.getElementById('node-7day-reward-usdt').textContent = (reward * 1008 * nosoUsdtLastPrice).toFixed(2);
  document.getElementById('node-30day-reward-usdt').textContent = (reward * 4320 * nosoUsdtLastPrice).toFixed(2);
  document.getElementById('node-365day-reward-usdt').textContent = (reward * 52560 * nosoUsdtLastPrice).toFixed(2);
  document.getElementById('node-value-usdt').textContent = (10500 * nosoUsdtLastPrice).toFixed(2);

  // Calculations using NOSO/BTC price
// Calculate and set the values for BTC-related IDs

document.getElementById('node-24hr-reward-btc').textContent = (reward * 144 * nosoBtcLastPrice).toExponential(4);
document.getElementById('node-7day-reward-btc').textContent = (reward * 1008 * nosoBtcLastPrice).toExponential(4);
document.getElementById('node-30day-reward-btc').textContent = (reward * 4320 * nosoBtcLastPrice).toExponential(4);
document.getElementById('node-365day-reward-btc').textContent = (reward * 52560 * nosoBtcLastPrice).toExponential(4);
document.getElementById('node-value-btc').textContent = (10500 * nosoBtcLastPrice).toExponential(4);

}

// Function to update the URL with the new blockHeight value
function updateURL(newBlockHeight) {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set('blockheight', newBlockHeight);
  const newUrl = `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`;
  window.history.replaceState(null, '', newUrl);
}

// Function to fetch data for a specific blockHeight
async function fetchDataForBlockHeight(blockHeight) {
  try {
    // Subtract 1 from the blockHeight
    blockHeight -= 1;

    const response = await fetch('https://rpc.nosocoin.com:8078', {
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
    });
    const data = await response.json();

    // Set IDs for individual elements
    document.getElementById('total-reward').innerText = (data.result[0].total * 0.00000001).toFixed(8);
    document.getElementById('node-count').innerText = data.result[0].count;
    document.getElementById('node-reward').innerText = (data.result[0].reward * 0.00000001).toFixed(8);
    
    const reward = parseFloat(data.result[0].reward * 0.00000001);

    // Update node rewards with whole numbers
    document.getElementById('node-24hr-reward').innerText = Math.ceil(reward * 144);
    document.getElementById('node-7day-reward').innerText = Math.ceil(reward * 1008);
    document.getElementById('node-30day-reward').innerText = Math.ceil(reward * 4320);
    document.getElementById('node-365day-reward').innerText = Math.ceil(reward * 52560);

    // Blockheight
    const blockheightElement = document.getElementById('blockheight');
    const blockheightLink = document.createElement("a");
    blockheightLink.href = "getblockinfo.html?blockheight=" + blockHeight;
    blockheightLink.textContent = blockHeight;
    blockheightElement.appendChild(blockheightLink);


// Node Locked Funds
const nodeCount = data.result[0].count;
const nodeFundsLocked = parseFloat((nodeCount * 10500) / 1000000).toFixed(1);
document.getElementById('node-funds-locked').innerText = nodeFundsLocked + 'M';



    // Calculate and set the earning-percentage
    const totalReward = parseFloat(data.result[0].total * 0.00000001);
    const activeNodes = parseInt(data.result[0].count);
    const earningPercentage = (totalReward / (totalReward * activeNodes)) * 100;
    document.getElementById('earning-percentage').innerText = earningPercentage.toFixed(2) + '%';


    // Call the function to calculate and display mn-inactive-nodes
    const mnLockCount = parseFloat(document.getElementById('mn-lock-count').innerText);
    calculateInactiveNodes(mnLockCount, nodeCount);

    // Call the function to fetch data for the line chart
    fetchBlockDataForChart();
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  let blockHeight = urlParams.get('blockheight');

  // Fetch the currentHeight if blockHeight is not available
  if (!blockHeight) {
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
        blockHeight = currentHeight;
        updateURL(blockHeight);
        fetchDataForBlockHeight(blockHeight);
      })
      .catch(error => console.error(error));
  } else {
    // If blockHeight is available in the URL, directly fetch data
    fetchDataForBlockHeight(blockHeight);
  }
});
