// id's in this script
// gbo-firstblock
// orders-chart
// gbo-lastblock
        
        // Function to fetch last block number
        async function fetchLastBlockNumber() {
            const response = await fetch('https://rpc.nosocoin.com:8078', {
                method: 'POST',
                headers: {
                    'Origin': 'https://rpc.nosocoin.com'
                },
                body: JSON.stringify({
                    "jsonrpc": "2.0",
                    "method": "getmainnetinfo",
                    "params": [],
                    "id": 3
                })
            });

            const data = await response.json();
            return data.result[0].lastblock;
        }

        // Function to parse block height from URL parameters
        function parseBlockHeightFromURL() {
            const urlParams = new URLSearchParams(window.location.search);
            const blockHeight = parseInt(urlParams.get('blockheight'));
            return isNaN(blockHeight) ? null : blockHeight;
        }

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
            const blockOrderPromises = [];
            for (let i = 0; i < blockInterval; i++) {
                const blockHeight = startingBlockHeight - i; // Decrementing block height
                const orderPromise = fetchBlockOrders(blockHeight);
                blockOrderPromises.push(orderPromise);
            }

            const blockOrders = await Promise.all(blockOrderPromises);

            const ordersChart = document.getElementById('orders-chart');
            const existingTable = document.querySelector('.order-table');
            if (existingTable) {
                existingTable.remove(); // Remove existing table if it exists
            }

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
                const blockNumber = startingBlockHeight - index; // Decrementing block number
                const orders = blockOrder.result[0].orders;

                orders.forEach(order => {
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
                });
            });

            // Sort orders by block number in descending order
            allOrders.sort((a, b) => b.blockNumber - a.blockNumber);

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
                    if (order.sender === "COINBASE") {
                        senderCell.innerHTML = `<a target="_blank" href="coinbase.html">${order.sender}</a>`;
                    } else {
                        senderCell.innerHTML = `<a target="_blank" href="getaddressbalance.html?address=${order.senderDefault}">${order.sender}</a>`;
                    }
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

            // Update first and last block divs
            const firstBlockDiv = document.getElementById('gbo-firstblock');
            firstBlockDiv.textContent = `${allOrders.length > 0 ? allOrders[allOrders.length - 1].blockNumber : 'N/A'}`;
            
            const lastBlockDiv = document.getElementById('gbo-lastblock');
            lastBlockDiv.textContent = `- ${allOrders.length > 0 ? allOrders[0].blockNumber : 'N/A'}`;

            // Resolve the Promise once chart is compiled
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

// Function to handle block search
async function searchBlock() {
    const blockHeightInput = document.getElementById('blockHeightInput');
    let blockHeight = parseInt(blockHeightInput.value);
    if (isNaN(blockHeight)) {
        // Fetch last block number if no block is specified
        blockHeight = await fetchLastBlockNumber();
    }
    compileOrdersChart(blockHeight, 20)
        .then(() => {
            // Update URL with the new block height
            history.pushState({}, '', `?blockheight=${blockHeight}`);
        })
        .catch(error => {
            console.error('Error compiling orders chart:', error);
        });
}

// Initial call to compile orders chart with the default time range (e.g., Last hour)
fetchLastBlockNumber().then(lastBlock => {
    compileOrdersChart(lastBlock, 20).catch(error => {
        console.error('Error compiling orders chart:', error);
    });
});

