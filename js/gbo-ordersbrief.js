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



            // Add orders to the table
            const MAX_LENGTH = 10;
            const allOrders = [];
            blockOrders.forEach((blockOrder, index) => {
                const blockNumber = startingBlockHeight - index; // Decrementing block number
                const orders = blockOrder.result[0].orders;

                orders.forEach(order => {
                    const truncatedSender = order.sender.length > MAX_LENGTH ? order.sender.substring(0, 12) + '..' + order.sender.substring(order.sender.length - 5) : order.sender;
                    const truncatedReceiver = order.receiver.length > MAX_LENGTH ? order.receiver.substring(0, 12) + '..' + order.receiver.substring(order.receiver.length - 5) : order.receiver;
                    const truncatedOrderID = order.orderid.length > MAX_LENGTH ? order.orderid.substring(0, 12) + '..' + order.orderid.substring(order.orderid.length - 5) : order.orderid;
                    allOrders.push({
                        blockNumber,
                        orderIDDefault: order.orderid,
                        orderID: truncatedOrderID,
                        timestamp: calculateTimeDifference(order.timestamp),
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
                    blockNumberCell.innerHTML = `Order <a  href="getordersinfo.html?orderid=${order.orderIDDefault}">${order.orderID}</a><br>Amount: ${order.amount.toFixed(8)}<br>${order.timestamp}`;
                    row.appendChild(blockNumberCell);



                    const senderCell = document.createElement('td');
                    senderCell.innerHTML = `From ${order.sender}<br> To <a  href="getaddressbalance.html?address=${order.receiverDefault}">${order.receiver}</a>`;

                    row.appendChild(senderCell);



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

// Function to calculate time difference in minutes
function calculateTimeDifference(orderTimestamp) {
    const currentTime = new Date();
    const orderTime = new Date(orderTimestamp * 1000);
    const timeDifference = currentTime - orderTime;
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    return `${minutesDifference} minutes ago`;
}

// Initial call to compile orders chart with the default time range (e.g., Last hour)
fetchLastBlockNumber().then(lastBlock => {
    compileOrdersChart(lastBlock, 6).catch(error => {
        console.error('Error compiling orders chart:', error);
    });
});
