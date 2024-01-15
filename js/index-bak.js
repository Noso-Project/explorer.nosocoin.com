fetch('http://rpc.nosocoin.com:8078', {
  method: 'POST',
  headers: {
    'Origin': 'http://rpc.nosocoin.com'
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
  let startBlock = blockInfo.lastblock;

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

  const fetchBlocks = async (i) => {
    const response = await fetch('http://rpc.nosocoin.com:8078', {
      method: 'POST',
      headers: {
        'Origin': 'http://rpc.nosocoin.com'
      },
      body: JSON.stringify({
        "jsonrpc": "2.0",
        "method": "getblocksinfo",
        "params": [i],
        "id": 17
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
    return row;
  };

 const fetchBlocksLoop = async (direction) => {
if (direction === 'backward') {
if (startBlock > 15) {
startBlock = startBlock - 15;
} else {
startBlock = 1;
}
} else {
if (startBlock + 15 <= blockInfo.lastblock) {
startBlock = startBlock + 15;
} else {
startBlock = blockInfo.lastblock;
}
}
const blocks = [];
for (let i = startBlock; i > startBlock - 15; i--) {
if (i <= blockInfo.lastblock) { // Check if block number is valid
blocks.push(fetchBlocks(i));
}
}
const fetchedBlocks = await Promise.all(blocks);
tableBody.innerHTML = fetchedBlocks.join('');
};

document.getElementById('backward-btn').addEventListener('click', () => {
fetchBlocksLoop('backward');
});

document.getElementById('forward-btn').addEventListener('click', () => {
fetchBlocksLoop('forward');
});

fetchBlocksLoop(); // Fetch the first 10 blocks
})
.catch(error => console.error(error));