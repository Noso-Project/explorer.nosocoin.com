// Get the address from the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const address = urlParams.get('address');

fetch('https://api.nosostats.com:8078', {
  method: 'POST',
  headers: {
    'Origin': 'https://api.nosostats.com'
  },
  body: JSON.stringify({
    "jsonrpc": "2.0",
    "method": "getaddressbalance",
    "params": [address],
    "id": 2
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

    // Calculate the values
    const currentBalance = result.balance * 0.00000001;

    // Calculate the adjusted outgoing value based on the condition
    const outgoingValue = (currentBalance >= 10500 && result.outgoing >= 1050000000000)
      ? (result.outgoing * 0.00000001 - 10500).toFixed(8) // Subtract surplus to 10500
      : (result.outgoing * 0.00000001).toFixed(8);

    // Determine whether to show the "Outgoing Noso in Current Block" label
    const showOutgoingBlock = result.outgoing >= 10500;

    // Calculate the value for "Masternode 14 Day Lock"
    const masternodeLockValue = showOutgoingBlock
      ? Math.min(currentBalance, 10500)
      : 0; // Always 0 if "Outgoing Noso in Current Block" is less than 10500

    // Create an array of objects containing the table data
    const tableData = [
      { label: "Exists in Blockchain", value: result.valid },
      { label: "Noso Address", value: `<a href="getaddresshistory.html?address=${result.address}">${result.address}</a>` },
      { label: "Address Alias", value: result.alias },
      { label: "Current Balance", value: currentBalance.toFixed(8) }, // Specify 8 decimal places
      { label: "Incoming Noso in Current Block", value: (result.incoming * 0.00000001).toFixed(8) }, // Specify 8 decimal places
    ];

    // Add "Outgoing Noso in Current Block" row conditionally
    tableData.push({
      label: "Outgoing Noso in Current Block",
      value: outgoingValue,
    });

    // Add "Masternode 14 Day Lock" row conditionally
    if (showOutgoingBlock && masternodeLockValue >= 10500) {
      tableData.push({
        label: "Masternode 14 Day Lock",
        value: masternodeLockValue.toFixed(8),
      });
    }

    // Get a reference to the table element in your HTML
    const table = document.getElementById("addressbalance-table");

    // Create a new row in the table for each item in the tableData array
    tableData.forEach(data => {
      const row = table.insertRow();
      const labelCell = row.insertCell();
      const valueCell = row.insertCell();
      labelCell.innerHTML = data.label;
      valueCell.innerHTML = data.value;
    });

    // Loop through the rows and hide "Masternode 14 Day Lock" if its value is not 10500 or greater
    const rows = table.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const labelCell = row.cells[0];
      const valueCell = row.cells[1];

      if (labelCell.innerText === "Masternode 14 Day Lock") {
        const masternodeValue = parseFloat(valueCell.innerText);
        if (masternodeValue < 10500) {
          row.style.display = "none";
        }
        break; // Stop looping since we found and handled the Masternode row
      }
    }
  })
  .catch(error => {
    console.log(error);
  });
