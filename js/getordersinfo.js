// Get the order ID from the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('orderid');
fetch('https://api.nosostats.com:8078', {
  method: 'POST',
  headers: {
    'Origin': 'http://api.nosostats.com'
  },
  body: JSON.stringify({
    "jsonrpc": "2.0",
    "method": "getorderinfo",
    "params": [orderId],
    "id": 9
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

  // Get the order object from the response
  const order = data.result[0].order;

  // Multiply the amount and fee fields by 0.0000001
  order.amount *= 0.00000001;
  order.fee *= 0.00000001;

  // Create an array of objects containing the table data
  const tableData = [
    { label: "Order valid (true or false)", value: data.result[0].valid },
    { label: "Order ID", value: `<a href="getordersinfo.html?orderid=${order.orderid}">${order.orderid}</a>` },
    { label: "Timestamp", value: new Date(order.timestamp * 1000).toLocaleString() },
    { label: "Block", value: `<a href="getblockinfo.html?blockheight=${order.block}">${order.block}</a>` },
    { label: "Type", value: order.type },
    { label: "Transfers", value: order.trfrs },
    { label: "Receiver", value: `<a href="getaddressbalance.html?address=${order.receiver}">${order.receiver}</a>` },
    { label: "Amount", value: order.amount },
    { label: "Fee", value: order.fee },
    { label: "Reference", value: order.reference },
    { label: "Sender", value: `<a href="getaddressbalance.html?address=${order.sender}">${order.sender}</a>` }
  ];

  // Get a reference to the table element in your HTML
  const table = document.getElementById("order-table");

  // Create a new row in the table for each item in the tableData array
  tableData.forEach(data => {
    const row = table.insertRow();
    const labelCell = row.insertCell();
    const valueCell = row.insertCell();
    labelCell.innerHTML = data.label;
    valueCell.innerHTML = data.value;
  });
})
.catch(error => {
  console.error(error);
  alert('Failed to get order information');
});
