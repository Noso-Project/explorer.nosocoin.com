// Get the block height from the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const blockHeight = urlParams.get('blockheight');

fetch('https://api.nosostats.com:8078', {
  method: 'POST',
  headers: {
    'Origin': 'https://api.nosostats.com'
  },
  body: JSON.stringify({
    "jsonrpc": "2.0",
    "method": "getblockorders",
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
  const tableData = [];

  result.orders.forEach(order => {
    const rowData = {
      label: "Order ID",
      value: `<a href="getordersinfo.html?orderid=${order.orderid}">${order.orderid}</a>`
    };
    tableData.push(rowData);

    const row2Data = {
      label: "Timestamp",
      value: new Date(order.timestamp * 1000).toLocaleString()
    };
    tableData.push(row2Data);

    const row3Data = {
      label: "Type",
      value: order.type
    };
    tableData.push(row3Data);

    const row4Data = {
      label: "Transfers",
      value: order.trfrs
    };
    tableData.push(row4Data);

    const row5Data = {
      label: "Receiver",
      value: `<a href="getaddressbalance.html?address=${order.receiver}">${order.receiver}</a>`
    };
    tableData.push(row5Data);

    const row6Data = {
      label: "Amount",
      value: order.amount * 0.00000001
    };
    tableData.push(row6Data);

    const row7Data = {
      label: "Fee",
      value: order.fee * 0.00000001
    };
    tableData.push(row7Data);

    const row8Data = {
      label: "Reference",
      value: order.reference
    };
    tableData.push(row8Data);

const senderInfoArray = order.sender.split('][');

const row9Data = {
  label: "Sender",
  value: senderInfoArray.map(senderInfo => {
    const [sender, amount, fee] = senderInfo.replace(/[\[\]]/g, '').split(',');
    const adjustedAmount = amount * 0.00000001;
    const adjustedFee = fee * 0.00000001;

    // Include Amount and Fee only when there are multiple sender addresses
    const amountFeeInfo = senderInfoArray.length > 1 ? ` (Amount: ${adjustedAmount}, Fee: ${adjustedFee})` : '';

    return `<a href="getaddressbalance.html?address=${sender}">${sender}</a>${amountFeeInfo}`;
  }).join('<br>')
};

tableData.push(row9Data);





    const row10Data = {
      label: "",
      value: ""
    };
    tableData.push(row10Data);
  });

  // Get a reference to the table element in your HTML
  const table = document.getElementById("orders-table");

  // Create a new row in the table for each item in the tableData array
tableData.forEach(data => {
const row = table.insertRow();
const labelCell = row.insertCell();
const valueCell = row.insertCell();
labelCell.style.width = "80px";
valueCell.style.width = "220px";
labelCell.innerHTML = data.label;
if (data.label === "Order ID") {
    labelCell.style.color = "#fbe04d";
  }
valueCell.innerHTML = data.value;
  });
})
.catch(error => console.error(error));
