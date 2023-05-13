fetch('http://api.nosostats.com:8078', {
  method: 'POST',
  headers: {
    'Origin': 'http://api.nosostats.com'
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
  const tableBody = document.getElementById('table-body');

  // Create the header row with the LastBlock, Pending, and Supply headers
  let headerRow = `
    <tr>
      <th>Current Height</th>
      <th>Pending Orders</th>
      <th>Current Supply</th>
    </tr>
  `;

  // Create the data row with the values for each property
  let dataRow = `
    <tr>
      <td><a href="getblockinfo.html?blockheight=${result.lastblock}">${result.lastblock}</a></td>
      <td><a href="getpendingorders.html">${result.pending}</a></td>
      <td>${result.supply * 0.00000001}</td>
    </tr>
  `;

  // Remove all existing rows from the table body
  tableBody.innerHTML = '';

  // Append the header row and data row to the table body
  tableBody.insertAdjacentHTML('beforeend', headerRow);
  tableBody.insertAdjacentHTML('beforeend', dataRow);
})
.catch(error => console.error(error));
