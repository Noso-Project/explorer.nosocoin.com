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
})
.catch(error => console.error(error));
