// Function to parse block height from URL parameters
function parseBlockHeightFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('blockheight'));
}

// Function to make RPC call to retrieve current block height
async function getCurrentBlockHeight() {
    const response = await fetch('https://rpc.nosocoin.com:8078', {
        method: 'POST',
        headers: {
            'Origin': 'https://rpc.nosocoin.com'
        },
        body: JSON.stringify({
            "jsonrpc": "2.0",
            "method": "getmainnetinfo",
            "params": [],
            "id": 1
        })
    });

    const data = await response.json();
    if (data.result && data.result.length > 0) {
        return data.result[0].lastblock;
    } else {
        throw new Error('Unable to retrieve current block height');
    }
}

// Function to fetch block information
async function fetchBlockInfo(blockHeight) {
    const response = await fetch('https://rpc.nosocoin.com:8078', {
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
    });

    return response.json();
}

// Function to fetch orders for a given block height
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
            const blockOrderPromises = [];
            for (let i = 0; i < blockInterval; i++) {
                const blockHeight = startingBlockHeight + i; // Adjusted starting block height
                // Asynchronously fetch block orders
                const orderPromise = fetchBlockOrders(blockHeight);
                blockOrderPromises.push(orderPromise);
            }

            // Wait for all order promises to resolve
            const blockOrders = await Promise.all(blockOrderPromises);

            // Process and display the orders
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
                    headerCell.classList.add('priority-1'); // Add priority-1 class to selected headers
                } else {
                    headerCell.classList.add('priority-6'); // Add priority-6 class to the rest
                }
                headerRow.appendChild(headerCell);
            });
            orderTable.appendChild(headerRow);

            // Add orders to the table
            const MAX_LENGTH = 10;
            const allOrders = [];
            blockOrders.forEach((blockOrder, index) => {
                const blockNumber = startingBlockHeight + index; // Adjusted block number
                const orders = blockOrder.result[0].orders;

                orders.forEach(order => {
if (order.fee > 0) {
    const truncatedSender = order.sender.length > MAX_LENGTH ? order.sender.substring(0, 13) + '..' + order.sender.substring(order.sender.length - 5) : order.sender;
    const truncatedReceiver = order.receiver.length > MAX_LENGTH ? order.receiver.substring(0, 13) + '..' + order.receiver.substring(order.receiver.length - 5) : order.receiver;
    const truncatedOrderID = order.orderid.length > MAX_LENGTH ? order.orderid.substring(0, 30) + '..' + order.orderid.substring(order.orderid.length - 5) : order.orderid;
    allOrders.push({
        blockNumber,
        orderIDDefault: order.orderid, // Change orderID to orderIDDefault
        orderID: truncatedOrderID, // Add truncated orderID field
        timestamp: new Date(order.timestamp * 1000).toLocaleString(),
        transfers: order.trfrs.length > MAX_LENGTH ? order.trfrs.substring(0, 15) + '..' : order.trfrs,
        receiver: truncatedReceiver,
        sender: truncatedSender,
        receiverDefault: order.receiver, // Added original receiver value
        senderDefault: order.sender, // Added original sender value
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
                    timestampCell.classList.add('priority-6'); // Add class to timestamp
                    row.appendChild(timestampCell);

                    const transfersCell = document.createElement('td');
                    transfersCell.textContent = order.transfers;
                    transfersCell.classList.add('priority-6'); // Add class to transfers
                    row.appendChild(transfersCell);

                    const senderCell = document.createElement('td');
                    senderCell.innerHTML = `<a target="_blank" href="getaddressbalance.html?address=${order.senderDefault}">${order.sender}</a>`;
                    senderCell.classList.add('priority-1'); // Add class to sender
                    row.appendChild(senderCell);

                    const receiverCell = document.createElement('td');
                    receiverCell.innerHTML = `<a target="_blank" href="getaddressbalance.html?address=${order.receiverDefault}">${order.receiver}</a>`;
                    receiverCell.classList.add('priority-6'); // Add class to receiver
                    row.appendChild(receiverCell);

                    const amountCell = document.createElement('td');
                    amountCell.textContent = order.amount.toFixed(8);
                    amountCell.classList.add('priority-1'); // Add class to amount
                    row.appendChild(amountCell);

                    const feeCell = document.createElement('td');
                    feeCell.textContent = order.fee.toFixed(8);
                    feeCell.classList.add('priority-6'); // Add class to fee
                    row.appendChild(feeCell);

                    const referenceCell = document.createElement('td');
                    referenceCell.textContent = order.reference;
                    referenceCell.classList.add('priority-6'); // Add class to reference
                    row.appendChild(referenceCell);

                    const orderIDCell = document.createElement('td');
                    orderIDCell.innerHTML = `<a target="_blank" href="getordersinfo.html?orderid=${order.orderIDDefault}">${order.orderID}</a>`;
                    orderIDCell.classList.add('priority-6'); // Add class to orderID
                    row.appendChild(orderIDCell);

                    const typeCell = document.createElement('td');
                    typeCell.textContent = order.type;
                    typeCell.classList.add('priority-6'); // Add class to type
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

// Function to handle changes in the time range dropdown
async function handleTimeRangeChange(selectedTimeRange) {
    let blockInterval = 0;
    switch (selectedTimeRange) {
        case 'hour':
            blockInterval = 6; // 6 blocks in an hour
            break;
        case 'day':
            blockInterval = 144; // 144 blocks in a day
            
            break;
        case 'week':
            blockInterval = 1008; // 1008 blocks in a week
            break;
        default:
            console.error('Invalid time range');
            return;
    }

    // Calculate the starting block height based on the current block height
    const currentBlockHeight = await getCurrentBlockHeight();
    const startingBlockHeight = currentBlockHeight - blockInterval;

    compileOrdersChart(startingBlockHeight, blockInterval)
        .then(() => {
            // Optionally handle any post-processing logic here
        })
        .catch(error => {
            console.error('Error compiling orders chart:', error);
        });
}

// Function to handle the search by block number
async function handleBlockSearch(event) {

    event.preventDefault();
    const blockNumberInput = document.getElementById('blockNumberInput');
    const blockNumber = parseInt(blockNumberInput.value);
    if (!isNaN(blockNumber)) {
        // Get the selected time range
        const timeRangeSelect = document.getElementById('timeRange');
        const selectedTimeRange = timeRangeSelect.value;

        let blockInterval = 0;
        switch (selectedTimeRange) {
            case 'hour':
                blockInterval = 6; // 6 blocks in an hour
                break;
            case 'day':
                blockInterval = 144; // 144 blocks in a day
                break;
            case 'week':
                blockInterval = 1008; // 1008 blocks in a week
                break;
            default:
                console.error('Invalid time range');
                return;
        }

        // Calculate the starting block height based on the entered block number
        const startingBlockHeight = blockNumber - blockInterval;

        // Call compileOrdersChart to compile orders based on the calculated starting block height and block interval
        await compileOrdersChart(startingBlockHeight, blockInterval);
    } else {
        console.error('Invalid block number');
    }
}

// Add event listener to the time range dropdown
document.getElementById('timeRange').addEventListener('change', async function () {
    const selectedTimeRange = this.value;
    await handleTimeRangeChange(selectedTimeRange);
});

// Add event listener to the block search form
document.getElementById('blockSearchForm').addEventListener('submit', handleBlockSearch);

// Initial call to compile orders chart with the default time range (e.g., Last hour)
handleTimeRangeChange('hour'); // Initially set to last hour

// Function to prepopulate the search input field with the current block height
async function prepopulateSearchInput() {
    try {
        // Fetch the current block height
        const currentBlockHeight = await getCurrentBlockHeight();

        // Set the value of the search input field
        const blockNumberInput = document.getElementById('blockNumberInput');
        blockNumberInput.value = currentBlockHeight;
    } catch (error) {
        console.error('Error prepopulating search input:', error);
    }
}

// Call the function to prepopulate the search input field when the page loads
prepopulateSearchInput();
