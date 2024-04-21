let halvingTimer;
let timeRemaining;

function updateHalvingTimer(lastBlock) {
  if (lastBlock < 210000) {
    halvingTimer = 210000 - lastBlock;
  } else if (lastBlock < 420000) {
    halvingTimer = 420000 - lastBlock;
  } else if (lastBlock < 630000) {
    halvingTimer = 630000 - lastBlock;
  } else if (lastBlock < 840000) {
    halvingTimer = 840000 - lastBlock;
  } else if (lastBlock < 1050000) {
    halvingTimer = 1050000 - lastBlock;
  } else if (lastBlock < 1260000) {
    halvingTimer = 1260000 - lastBlock;
  } else if (lastBlock < 1470000) {
    halvingTimer = 1470000 - lastBlock;
  } else if (lastBlock < 1680000) {
    halvingTimer = 1680000 - lastBlock;
  } else if (lastBlock < 1890000) {
    halvingTimer = 1890000 - lastBlock;
  } else if (lastBlock < 2100000) {
    halvingTimer = 2100000 - lastBlock;
  } else {
    halvingTimer = 0;
  }
  timeRemaining = halvingTimer * 600; // Convert to seconds
  const timeRemainingDays = Math.ceil(timeRemaining / (60 * 60 * 24)); // Convert to days
  const timeRemainingText = `${timeRemainingDays} `;
  document.getElementById('halving-timer-days').textContent = timeRemainingText; // Update HTML element with days remaining
  const targetDate = new Date(Date.now() + timeRemaining * 1000); // Calculate target date
  console.log("Target Date:", targetDate); // Log target date
  const targetDateFormat = targetDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); // Format target date
  console.log("Formatted Date:", targetDateFormat); // Log formatted date
  document.getElementById('halvingtimerdate').textContent = targetDateFormat; // Update HTML element
  document.getElementById('halving-timer').textContent = halvingTimer;
}

function updateData() {
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
      const result = data.result[0];
      const getBlockInfo = document.getElementById('getblockinfo');
      const getPendingOrders = document.getElementById('getpendingorders2');
      const getSupply = document.getElementById('getsupply');

      // Format the supply value as a decimal with millions represented as '5.4M'
      const supplyInMillions = (parseFloat(result.supply) * 0.00000000000001).toFixed(2);

      // Add 1 to the lastblock value
      const lastBlockPlusOne = parseInt(result.lastblock) + 1;

      // Set the values of each variable to the corresponding data element
      getBlockInfo.innerText = lastBlockPlusOne;
      getPendingOrders.innerText = result.pending;
      getSupply.innerText = supplyInMillions + 'M /';

      // Get a reference to the getsupply2 element
      const getSupply2 = document.getElementById('getsupply2');

      // Set its innerText property to the same value as getSupply, without the '/'
      getSupply2.innerText = getSupply.innerText.replace(' /', '');

      // Update halving timer
      updateHalvingTimer(result.lastblock);
    })
    .catch(error => console.error(error));
}

// Call updateData() initially
updateData();

// Call updateData() every 30 seconds
setInterval(updateData, 30000);
