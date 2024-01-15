const urlParams = new URLSearchParams(window.location.search);
const blockHeight = urlParams.get('blockheight');
console.log(blockHeight); // log block height from URI

fetch('https://rpc.nosocoin.com:8078', {
  method: 'POST',
  headers: {
    'Origin': 'https://rpc.nosocoin.com'
  },
  body: JSON.stringify({
    "jsonrpc": "2.0",
    "method": "getblocksinfo",
    "params": [blockHeight],
    "id": 18
  })
})
  .then(response => {
    console.log(response); // log response object
    return response.json();
  })
  .then(data => {
    console.log(data); // log parsed data object

    // check if response contains result array
    if (!data.hasOwnProperty('result') || !Array.isArray(data.result)) {
      throw new Error('Invalid response format');
    }

    // Get the result object from the response
    const result = data.result[0];

    // Create an array of objects containing the table data
    const tableData = [
      { label: "Block Height", value: `<a href="getblockinfo.html?blockheight=${result.number}">${result.number}</a>` },
      { label: "Start Time", value: new Date(result.timestart * 1000).toLocaleString() },
      { label: "End Time", value: new Date(result.timeend * 1000).toLocaleString() },
      { label: "Last 20", value: result.last20 },
      { label: "Total Transactions", value: `<a href="getblockorders.html?blockheight=${result.number}">${result.totaltransactions}</a>` },
      { label: "Last Block Hash", value: result.lastblockhash },
      { label: "Target", value: result.target },
      { label: "Solution", value: result.solution },
      { label: "Hash", value: result.hash },
      { label: "Noso Mint Address", value: `<a href="getaddressbalance.html?address=${result.miner}">${result.miner}</a>` },
      { label: "Coins Minted", value: (result.reward * 0.00000001).toFixed(8) },
      { label: "Fees Paid", value: (result.feespaid * 0.00000001).toFixed(8) }
    ];

    // Get a reference to the table element in your HTML
    const table = document.getElementById("getblockinfotable");

    // Create the header row
    const headerRow = table.insertRow();
    const propertyHeader = headerRow.insertCell();
    const valueHeader = headerRow.insertCell();
    propertyHeader.innerHTML = "Property";
    valueHeader.innerHTML = "Value";

    // Clear existing rows in the table, except the header row
    while (table.rows.length > 1) {
      table.deleteRow(1);
    }

    // Create a new row in the table for each item in the tableData array
    tableData.forEach(data => {
      const row = table.insertRow();
      const labelCell = row.insertCell();
      const valueCell = row.insertCell();
      labelCell.innerHTML = data.label;
      valueCell.innerHTML = data.value;
    });
  })
  .catch(error => console.error(error));
