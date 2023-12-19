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
    const container = document.getElementById('getpendingorders');
    container.innerHTML = ''; // clear existing content

    // Add a counter to limit the number of displayed orders
    let orderCounter = 0;

    pendings.forEach(pending => {
      // Continue the loop even if the maximum number of orders has been reached
      if (orderCounter >= 3) {
        return; // Skip the current iteration if the maximum number is reached
      }

      const [orderID, orderTimestamp, orderType, sender, receiver, orderAmount, orderFee, orderReference] = pending.split(',');
      const senderLink = `<a href="getaddressbalance.html?address=${sender}" style="color: #428bca;">${sender}</a>`;
      const receiverLink = `<a href="getaddressbalance.html?address=${receiver}" style="color: #428bca;">${receiver}</a>`;
      const orderAmountFormatted = (orderAmount * 0.00000001).toFixed(8);
      const orderFeeFormatted = (orderFee * 0.00000001).toFixed(8);

      const orderIDLink = `<a href="getordersinfo.html?orderid=${orderID}" style="color: #428bca;">${orderID}</a>`;
      const minutesAgo = timeAgo(orderTimestamp);
      const timestampDisplay = `<span style="color: lightgray;"> ${minutesAgo} minute(s) ago</span>`;

      const divContainer = document.createElement('div');
      divContainer.classList.add('order-container');

      const divLeft = document.createElement('div');
      divLeft.classList.add('left-column');
      divLeft.innerHTML = `
        <br><span style="white-space:nowrap; color: lightgray;"><img src="img/logo_clearbg.png" width="14px">&nbsp;&nbsp;${orderType}&nbsp;&nbsp;${minutesAgo}&nbsp;minute(s)&nbsp;ago</span><br>
        
      `;
      divContainer.appendChild(divLeft);

      const divRight = document.createElement('div');
      divRight.classList.add('right-column');
      divRight.innerHTML = `
        <span style="color: lightgray;">OrderID:&nbsp;&nbsp;${orderIDLink}</span>
        <span style="color: lightgray;">Amount:&nbsp;&nbsp;<b>${orderAmountFormatted}&nbsp;&nbsp;TxFee:&nbsp;&nbsp;<b>${orderFeeFormatted}</b></b></span>
        <span style="color: lightgray;">Sender:&nbsp;&nbsp;${senderLink}</span>
        <span style="color: lightgray;">Receiver:&nbsp;&nbsp;${receiverLink}</span>
        <span style="color: lightgray;">Reference:&nbsp;&nbsp;${orderReference}</span><br>        
        <hr style="border: 1px solid #222222; width: 420px;" >
      `;
      divContainer.appendChild(divRight);

      container.appendChild(divContainer);

      // Increment the order counter
      orderCounter++;
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

  return minutesAgo;
}

refreshTable();
setInterval(refreshTable, 20000); // refresh every 20 seconds
