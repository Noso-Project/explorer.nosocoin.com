        async function fetchBlockInfo(blockNumber) {
            const [blockMNS, blockInfo] = await Promise.all([
                fetchBlockMNS(blockNumber),
                fetchBlockTimestamp(blockNumber)
            ]);
            return { blockMNS, blockInfo };
        }

        async function fetchBlockMNS(blockNumber) {
            const response = await fetch('https://rpc.nosocoin.com:8078', {
                method: 'POST',
                headers: {
                    'Origin': 'https://rpc.nosocoin.com',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "jsonrpc": "2.0",
                    "method": "getblockmns",
                    "params": [blockNumber],
                    "id": 1
                })
            });
            const data = await response.json();
            return data.result[0];
        }

        async function fetchBlockTimestamp(blockNumber) {
            const response = await fetch('https://rpc.nosocoin.com:8078', {
                method: 'POST',
                headers: {
                    'Origin': 'https://rpc.nosocoin.com',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "jsonrpc": "2.0",
                    "method": "getblocksinfo",
                    "params": [blockNumber],
                    "id": 2
                })
            });
            const data = await response.json();
            return data.result[0];
        }

        async function createTableFromBlockInfo(blockNumber) {
            const { blockMNS, blockInfo } = await fetchBlockInfo(blockNumber);
            const tableBody = document.getElementById('blockInfoBody');
            tableBody.innerHTML = ''; // Clear previous data

            const timestamp = new Date(blockInfo.timeend * 1000); // Convert Unix timestamp to milliseconds

            blockMNS.addresses.split(',').forEach((address, index) => {
                const row = tableBody.insertRow();
                row.classList.add('order-table-row'); // Add class to row
                row.classList.add(index % 2 === 0 ? 'even' : 'odd'); // Add even/odd class based on index

                const cellBlock = row.insertCell(0);
                const cellTimestamp = row.insertCell(1);
                const cellSender = row.insertCell(2);
                const cellReceiver = row.insertCell(3);
                const cellRewardAmount = row.insertCell(4);
                const cellReference = row.insertCell(5);
                const cellType = row.insertCell(6);

                cellBlock.innerHTML = `<a href="getblockinfo.html?blockheight=${blockInfo.number}" class="block-link">${blockInfo.number}</a>`;
                cellBlock.classList.add('order-table-cell'); // Add class to cell
                cellTimestamp.textContent = formatTimestamp(timestamp);
                cellTimestamp.classList.add('order-table-cell'); // Add class to cell
                cellSender.textContent = "COINBASE";
                cellSender.classList.add('order-table-cell'); // Add class to cell
                cellReceiver.innerHTML = `<a href="getaddressbalance.html?address=${address}" class="address-link">${address}</a>`;
                cellReceiver.classList.add('order-table-cell'); // Add class to cell
                cellRewardAmount.textContent = (blockMNS.reward * 0.00000001).toFixed(8);
                cellRewardAmount.classList.add('order-table-cell'); // Add class to cell
                cellReference.textContent = "Masternode Reward";
                cellReference.classList.add('order-table-cell'); // Add class to cell
                cellType.textContent = "MNS";
                cellType.classList.add('order-table-cell'); // Add class to cell
            });
        }

        function formatTimestamp(timestamp) {
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            };
            return timestamp.toLocaleString('en-US', options);
        }

        // Function to parse block height from URL
        function getBlockHeightFromUrl() {
            const urlParams = new URLSearchParams(window.location.search);
            const blockHeight = urlParams.get('blockheight');
            return blockHeight ? parseInt(blockHeight) : null;
        }

        const defaultBlockNumber = 158302; // Replace with default block number
        const blockNumberFromUrl = getBlockHeightFromUrl();
        const blockNumberToUse = blockNumberFromUrl || defaultBlockNumber;
        createTableFromBlockInfo(blockNumberToUse);