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
  const blockInfo = data.result[0];
  const tableBody = document.getElementById('block-table');
  const blockHeight = blockInfo.lastblock;
  const getTimeAgo = (timestamp) => {
    const secondsAgo = Math.floor((Date.now() / 1000) - timestamp);
    if (secondsAgo < 60) {
      return secondsAgo + ' seconds ago';
    } else if (secondsAgo < 3600) {
      const minutesAgo = Math.floor(secondsAgo / 60);
      return minutesAgo + ' minutes ago';
    } else if (secondsAgo < 86400) {
      const hoursAgo = Math.floor(secondsAgo / 3600);
      return hoursAgo + ' hours ago';
    } else {
      const daysAgo = Math.floor(secondsAgo / 86400);
      return daysAgo + ' days ago';
    }
  };

  const fetchBlockInfo = async (blockHeight) => {
    const response = await fetch('https://api.nosostats.com:8078', {
      method: 'POST',
      headers: {
        'Origin': 'https://api.nosostats.com'
      },
      body: JSON.stringify({
        "jsonrpc": "2.0",
        "method": "getblockinfo",
        "params": [blockHeight],
        "id": 1
      })
    });
    const data = await response.json();
    const block = data.result[0];
    const row = `
      <tr>
        <td><a href="getblockinfo.html?blockheight=${block.number}">${block.number}</a></td>
        <td>${getTimeAgo(block.timeend)}</td>
        <td><a href="getblockorders.html?blockheight=${block.number}">${block.totaltransactions}</a></td>
        <td>${(block.reward * 0.00000001).toFixed(8)}</td>
        <td>${(block.feespaid * 0.00000001).toFixed(8)}</td>
        <td><a href="getaddressbalance.html?address=${block.miner}">${block.miner}</a></td>
      </tr>
    `;
    tableBody.innerHTML = row;
    startCountdown(block.timeend + 600000); // Start countdown for 10 minutes (600,000 ms) after block creation
  };

  const startCountdown = (timestamp) => {
    clearInterval(countdownInterval);
    const countdownTimer = document.getElementById('countdown-timer');
    const distance = timestamp - Date.now();
    countdownTimer.innerHTML = formatDistance(distance);
    countdownInterval = setInterval(() => {
      const distance = timestamp - Date.now();
      countdownTimer.innerHTML = formatDistance(distance);
      if (distance < 0) {
        clearInterval(countdownInterval);
        countdownTimer.innerHTML = 'EXPIRED';
      }
    }, 1000);
  };

  const formatDistance = (distance) => {
const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
const seconds = Math.floor((distance % (1000 * 60)) / 1000);
return ${minutes}m ${seconds}s;
};

const startCountdown = (timestamp) => {
clearInterval(countdownInterval);
const endTime = new Date(timestamp);
countdownInterval = setInterval(() => {
const now = new Date();
const distance = endTime - now;
document.getElementById('countdown-timer').innerHTML = formatDistance(distance);
if (distance < 0) {
clearInterval(countdownInterval);
document.getElementById('countdown-timer').innerHTML = 'EXPIRED';
}
}, 1000);
};

const fetchBlockInfo = async () => {
const response = await fetch('https://api.nosostats.com:8078', {
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
});
const data = await response.json();
const blockInfo = data.result[0];
const startBlock = blockInfo.lastblock - 1; // get the previous block to the latest one
const blockResponse = await fetch('https://api.nosostats.com:8078', {
method: 'POST',
headers: {
'Origin': 'https://api.nosostats.com'
},
body: JSON.stringify({
"jsonrpc": "2.0",
"method": "getblocksinfo",
"params": [startBlock],
"id": 17
})
});
const blockData = await blockResponse.json();
const block = blockData.result[0];
document.getElementById('block-number').innerHTML = block.number;
document.getElementById('block-creator').innerHTML = block.miner;
document.getElementById('block-reward').innerHTML = (block.reward * 0.00000001).toFixed(8);
document.getElementById('block-fees').innerHTML = (block.feespaid * 0.00000001).toFixed(8);
document.getElementById('block-transactions').innerHTML = block.totaltransactions;
startCountdown(block.timeend + 600000); // Start countdown for 10 minutes (600,000 ms) after block creation
};

fetchBlockInfo();