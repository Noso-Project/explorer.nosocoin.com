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

const shortenHash = (hash) => {
    if (hash.length <= 8) return hash; // If the hash is already short, return it as is
    const firstFour = hash.substring(0, 6);
    const lastFour = hash.substring(hash.length - 6);
    const middleDots = '....';
    return firstFour + middleDots + lastFour;
};

const fetchBlocks = async (i) => {
    const response = await fetch('https://rpc.nosocoin.com:8078', {
        method: 'POST',
        headers: {
            'Origin': 'https://rpc.nosocoin.com'
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
    const shortHash = shortenHash(block.hash); // Shorten the block hash
    const row = `
      <tr>
        <td><img src="img/cube.gif" width="50px"></td>
        <td><span>Block <a href="getblockinfo.html?blockheight=${block.number}">${block.number}</a><br>${getTimeAgo(block.timeend)}</span></td>
        <td>Hash <a href="getblockorders.html?blockheight=${block.number}">${shortHash}</a><br><a href="getblockorders.html?blockheight=${block.number}">${block.totaltransactions}</a>
        Transactions in 599 seconds</td>

      </tr>
    `;
    return row;
};

  const fetchBlocksLoop = async (direction) => {
    if (direction === 'backward') {
      if (startBlock > 7) {
        startBlock = startBlock - 7;
      } else {
        startBlock = 1;
      }
    } else {
      if (startBlock + 7 <= blockInfo.lastblock) {
        startBlock = startBlock + 7;
      } else {
        startBlock = blockInfo.lastblock;
      }
    }
    const blocks = [];
    for (let i = startBlock; i > startBlock - 7; i--) {
      if (i <= blockInfo.lastblock) { // Check if block number is valid
        blocks.push(fetchBlocks(i));
      }
    }
   const fetchedBlocks = await Promise.all(blocks);
tableBody.innerHTML = fetchedBlocks.join('');

document.getElementById("currentheight").innerHTML = startBlock + 1; // Set the current height in the HTML element with id="currentheight"
};

document.getElementById('backward-btn').addEventListener('click', () => {
fetchBlocksLoop('backward');
});

document.getElementById('forward-btn').addEventListener('click', () => {
fetchBlocksLoop('forward');
});

fetchBlocksLoop(); // Fetch the first 5 blocks
})
.catch(error => console.error(error));
