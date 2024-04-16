// Function to fetch block information
async function fetchBlockOrders(blockHeight) {
    const response = await fetch('https://rpc.nosocoin.com:8078', {
        method: 'POST',
        headers: {
            'Origin': 'https://rpc.nosocoin.com'
        },
        body: JSON.stringify({
            "jsonrpc": "2.0",
            "method": "getblockorders",
            "params": [blockHeight],
            "id": 18
        })
    });

    return response.json();
}

async function compileOrdersChart(startingBlockHeight, blockInterval) {
    return new Promise(async (resolve, reject) => {
        try {
            // Fetch orders for the specified block interval
// Fetch orders for the specified block interval
const blockOrderPromises = [];
for (let i = 0; i < blockInterval; i--) {
    const blockHeight = startingBlockHeight - i; // Adjusted block height
    const orderPromise = fetchBlockOrders(blockHeight);
    blockOrderPromises.push(orderPromise);
}

            const blockOrders = await Promise.all(blockOrderPromises);

            const ordersChart = document.getElementById('orders-chart');
            ordersChart.innerHTML = ''; // Clear existing content

            // Create table element
            const orderTable = document.createElement('table');
            orderTable.classList.add('order-table');

            // Create table header
            const headerRow = document.createElement('tr');
            ['Block', 'Timestamp', 'Transfers', 'Sender', 'Receiver', 'Amount', 'Fee', 'Reference', 'Order ID', 'Type'].forEach(headerText => {
                const headerCell = document.createElement('th');
                headerCell.textContent = headerText;
                if (['Block', 'Sender', 'Amount'].includes(headerText)) {
                    headerCell.classList.add('priority-1');
                } else {
                    headerCell.classList.add('priority-6');
                }
                headerRow.appendChild(headerCell);
            });
            orderTable.appendChild(headerRow);

            // Add orders to the table
            const MAX_LENGTH = 10;
            const allOrders = [];
            blockOrders.forEach((blockOrder, index) => {
                const blockNumber = startingBlockHeight + index;
                const orders = blockOrder.result[0].orders;

                orders.forEach(order => {
                    if (order.fee > 0) {
                        const truncatedSender = order.sender.length > MAX_LENGTH ? order.sender.substring(0, 13) + '..' + order.sender.substring(order.sender.length - 5) : order.sender;
                        const truncatedReceiver = order.receiver.length > MAX_LENGTH ? order.receiver.substring(0, 13) + '..' + order.receiver.substring(order.receiver.length - 5) : order.receiver;
                        const truncatedOrderID = order.orderid.length > MAX_LENGTH ? order.orderid.substring(0, 30) + '..' + order.orderid.substring(order.orderid.length - 5) : order.orderid;
                        allOrders.push({
                            blockNumber,
                            orderIDDefault: order.orderid,
                            orderID: truncatedOrderID,
                            timestamp: new Date(order.timestamp * 1000).toLocaleString(),
                            transfers: order.trfrs.length > MAX_LENGTH ? order.trfrs.substring(0, 15) + '..' : order.trfrs,
                            receiver: truncatedReceiver,
                            sender: truncatedSender,
                            receiverDefault: order.receiver,
                            senderDefault: order.sender,
                            amount: order.amount * 0.00000001,
                            fee: order.fee * 0.00000001,
                            reference: order.reference.length > MAX_LENGTH ? order.reference.substring(0, 5) + '..' : order.reference,
                            type: order.type.length > MAX_LENGTH ? order.type.substring(0, 15) + '..' : order.type
                        });
                    }
                });
            });

            // Sort orders by amount in descending order
            allOrders.sort((a, b) => b.amount - a.amount);

            // If there are no orders, display "No coin movements found"
            if (allOrders.length === 0) {
                const noResultsRow = document.createElement('tr');
                const noResultsCell = document.createElement('td');
                
                noResultsCell.textContent = 'No coin movements found';
                noResultsCell.colSpan = 10; // Span across all columns
                noResultsRow.appendChild(noResultsCell);
                orderTable.appendChild(noResultsRow);
            } else {
                // Add sorted orders to the table
                allOrders.forEach(order => {
                    const row = document.createElement('tr');

                    // Add custom labels based on conditions
                    const blockNumberCell = document.createElement('td');
                    const blockNumberLabel = ''; // Set custom label
                    blockNumberCell.innerHTML = `${blockNumberLabel} <a target="_blank" href="getblockinfo.html?blockheight=${order.blockNumber}">${order.blockNumber}</a>`;
                    row.appendChild(blockNumberCell);

                    const timestampCell = document.createElement('td');
                    timestampCell.textContent = order.timestamp;
                    timestampCell.classList.add('priority-6');
                    row.appendChild(timestampCell);

                    const transfersCell = document.createElement('td');
                    transfersCell.textContent = order.transfers;
                    transfersCell.classList.add('priority-6');
                    row.appendChild(transfersCell);

                    const senderCell = document.createElement('td');
                    senderCell.innerHTML = `<a target="_blank" href="getaddressbalance.html?address=${order.senderDefault}">${order.sender}</a>`;
                    senderCell.classList.add('priority-1');
                    row.appendChild(senderCell);

                    const receiverCell = document.createElement('td');
                    receiverCell.innerHTML = `<a target="_blank" href="getaddressbalance.html?address=${order.receiverDefault}">${order.receiver}</a>`;
                    receiverCell.classList.add('priority-6');
                    row.appendChild(receiverCell);

                    const amountCell = document.createElement('td');
                    amountCell.textContent = order.amount.toFixed(8);
                    amountCell.classList.add('priority-1');
                    row.appendChild(amountCell);

                    const feeCell = document.createElement('td');
                    feeCell.textContent = order.fee.toFixed(8);
                    feeCell.classList.add('priority-6');
                    row.appendChild(feeCell);

                    const referenceCell = document.createElement('td');
                    referenceCell.textContent = order.reference;
                    referenceCell.classList.add('priority-6');
                    row.appendChild(referenceCell);

                    const orderIDCell = document.createElement('td');
                    orderIDCell.innerHTML = `<a target="_blank" href="getordersinfo.html?orderid=${order.orderIDDefault}">${order.orderID}</a>`;
                    orderIDCell.classList.add('priority-6');
                    row.appendChild(orderIDCell);

                    const typeCell = document.createElement('td');
                    typeCell.textContent = order.type;
                    typeCell.classList.add('priority-6');
                    row.appendChild(typeCell);

                    orderTable.appendChild(row);
                });
            }

            ordersChart.appendChild(orderTable);

            // Resolve the Promise once chart is compiled
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

// Initial call to compile orders chart with the default time range (e.g., Last hour)
compileOrdersChart(parseBlockHeightFromURL(), 6).catch(error => {
    console.error('Error compiling orders chart:', error);
});
