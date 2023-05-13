const urlParams = new URLSearchParams(window.location.search);
const blockNumber = urlParams.get('blocknumber');

if (!blockNumber) {
  console.error("Block number not specified in URL parameter 'blocknumber'");
} else {
  const apiUrl = `https://nosostats.com:49443/api/blockNumber/${blockNumber}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const apiTable = document.getElementById('blocktxtable');
      const tableBody = apiTable.createTBody();

      data.txsAnalyzed.forEach(tx => {
        console.log(tx);
        const row = tableBody.insertRow();
        const senderCell = row.insertCell();
        const receiverCell = row.insertCell();
        const transferIdCell = row.insertCell();
        const orderIdCell = row.insertCell();
        const orderAmountCell = row.insertCell();
        const orderFeeCell = row.insertCell();
        const referenceCell = row.insertCell();
        const orderTypeCell = row.insertCell();
        const timestampCell = row.insertCell();

        // Add priority classes to td elements
        senderCell.classList.add('priority-1');
        receiverCell.classList.add('priority-2');
        transferIdCell.classList.add('priority-4');
        orderIdCell.classList.add('priority-3');
        orderAmountCell.classList.add('priority-5');
        orderFeeCell.classList.add('priority-6');
        referenceCell.classList.add('priority-7');
        orderTypeCell.classList.add('priority-8');
        timestampCell.classList.add('priority-8');

        if (tx.controlType === "multiInput") {
          let senders = [];
          tx.inputSegment.forEach(segment => {
            if (segment.sender && !senders.includes(segment.sender)) {
              senders.push(segment.sender);
            }
          });
          senderCell.innerHTML = senders.join(", ");
        } else {
          senderCell.innerHTML = tx.inputSegment[0].sender;
        }

        receiverCell.innerHTML = tx.receiver;
        transferIdCell.innerHTML = tx.inputSegment[0].transferId;
        orderIdCell.innerHTML = `<a href="orderlookup.html?orderid=${tx.orderId}">${tx.orderId}</a>`;
        orderAmountCell.innerHTML = (tx.orderAmountInPedro * 0.00000001).toFixed(8);
        orderFeeCell.innerHTML = (tx.orderFeeInPedro * 0.00000001).toFixed(8);
        referenceCell.innerHTML = tx.reference;
        orderTypeCell.innerHTML = tx.orderType;
        timestampCell.innerHTML = tx.timestamp;
      });
    })
    .catch(error => console.error(error));
}
