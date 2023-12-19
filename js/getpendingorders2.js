function refreshTable() {
  fetch('https://api.nosostats.com:8078', {
    method: 'POST',
    headers: {
      'Origin': 'https://api.nosostats.com'
    },
    body: JSON.stringify({
      "jsonrpc": "2.0",
      "method": "getpendingorders",
      "params": [],
      "id": 14
    })
  })
  .then(response => response.json())
  .then(data => {
    const pendings = data.result[0].pendings;
    const tableBody = document.getElementById('getpendingorders');
    tableBody.innerHTML = ''; // clear existing rows
    pendings.forEach(pending => {
      const [orderID, orderTimestamp, orderType, sender, receiver, orderAmount, orderFee, orderReference] = pending.split(',');
      const senderLink = `<a href="getaddressbalance.html?address=${sender}">${sender}</a>`;
      const receiverLink = `<a href="getaddressbalance.html?address=${receiver}">${receiver}</a>`;
      const orderAmountFormatted = (orderAmount * 0.00000001).toFixed(8);
      const orderFeeFormatted = (orderFee * 0.00000001).toFixed(8);
      const orderIDLink = `<a href="getordersinfo.html?orderid=${orderID}" style="color: #428bca;">${orderID}</a>`;
      const minutesAgo = timeAgo(orderTimestamp);

      const row = `
        <tr>
          <td width="300px"><span style="white-space:nowrap; color: lightgray;"><img src="img/logo_clearbg.png" width="15px">&nbsp;${orderType}&nbsp;&nbsp;${minutesAgo}&nbsp;ago</span><br>
          <span>Order ID:&nbsp;&nbsp;${orderIDLink}</span><br>
          <span>NOSO sent:&nbsp;&nbsp;<font color="gray">${orderAmountFormatted}</font><b>&nbsp;&nbsp;&nbsp;Tx Fee:</b>&nbsp;&nbsp;<font color="gray">${orderFeeFormatted}</font></span><br>
          <span>Sender:&nbsp;&nbsp;${senderLink}</span><br>
          <span>Receiver:&nbsp;&nbsp;${receiverLink}</span><br>
          <span>Order Reference:&nbsp;&nbsp;${orderReference}</span>
          </td>
        </tr>
      `;
      tableBody.insertAdjacentHTML('beforeend', row);
    });
  })
  .catch(error => console.error(error));
}

// Function to convert timestamp to "minutes ago"
function timeAgo(timestamp) {
  const currentDate = new Date();
  const orderDate = new Date(timestamp * 1000); // Assuming timestamp is in seconds

  const timeDifference = currentDate - orderDate;
  const minutesAgo = Math.floor(timeDifference / (1000 * 60));

  return minutesAgo === 0 ? 'just now' : `${minutesAgo} minutes`;
}

refreshTable();
setInterval(refreshTable, 20000); // refresh every 20 seconds
