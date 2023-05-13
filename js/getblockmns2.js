const urlParams = new URLSearchParams(window.location.search);
let blockHeight = urlParams.get('blockheight');

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
    const currentHeight = data.result[0].lastblock;
    if (!blockHeight) {
      blockHeight = currentHeight;
      urlParams.set('blockheight', blockHeight);
      const newUrl = `${window.location.origin}${window.location.pathname}?${urlParams.toString()}`;
      window.history.replaceState(null, '', newUrl);
    }

    const tableContainer = document.getElementById('mns-rewards-table');
    if (tableContainer) {
      fetch('https://nosostats.com:8079', {
        method: 'POST',
        headers: {
          'Origin': 'https://nosostats.com'
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
          document.getElementById('node-count').textContent = data.result[0].count;
        })
        .catch(error => console.error(error));
    }
  })
  .catch(error => console.error(error));
