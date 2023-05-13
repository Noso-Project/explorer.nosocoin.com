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
          const table = document.createElement('table');
          table.id = 'blockmns-table';
          table.classList.add('styled-table2');
          table.style.width = '600px'; // Set table width
          table.style.float = 'left'; // Align table to the left
          const headerRow = document.createElement('tr');
          const headers = ['Address', 'Reward'];

          headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
          });

          table.appendChild(headerRow);

          data.result.forEach(result => {
            const addresses = result.addresses.split(',');

            addresses.forEach((address, index) => {
              const row = document.createElement('tr');

              const addressCell = document.createElement('td');
              const addressLink = document.createElement('a');
              addressLink.href = `getaddressbalance.html?address=${address}`;
              addressLink.textContent = address;
              addressCell.appendChild(addressLink);
              row.appendChild(addressCell);

              const rewardCell = document.createElement('td');
              rewardCell.textContent = (result.reward * 0.00000001).toFixed(8);
              row.appendChild(rewardCell);

              table.appendChild(row);
            });
          });

          tableContainer.innerHTML = ''; // Clear the table container
          tableContainer.appendChild(table);

          // Set IDs for individual elements
          document.getElementById('total-reward').textContent = (data.result[0].total * 0.00000001).toFixed(8);
          document.getElementById('node-count').textContent = data.result[0].count;
          document.getElementById('node-reward').textContent = (data.result[0].reward * 0.00000001).toFixed(8);
          document.getElementById('node-24hr-reward').textContent = (data.result[0].reward * 0.00000001 * 144).toFixed(8);
          document.getElementById('blockheight').textContent = blockHeight;
        })
        .catch(error => console.error(error));
    }
  })
  .catch(error => console.error(error));
``
