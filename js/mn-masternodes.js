        document.addEventListener('DOMContentLoaded', function () {
            fetchData();
        });

        function fetchData() {
            const lockedMnsPromise = fetch('https://rpc.nosocoin.com:8078', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "jsonrpc": "2.0",
                    "method": "lockedmns",
                    "params": [],
                    "id": 3
                })
            }).then(response => response.json());

            const masternodesPromise = fetch('https://rpc.nosocoin.com:8078', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "jsonrpc": "2.0",
                    "method": "getmasternodes",
                    "params": [],
                    "id": 3
                })
            }).then(response => response.json());

            Promise.all([lockedMnsPromise, masternodesPromise])
                .then(([lockedMnsData, masternodesData]) => {
                    const combinedData = combineData(lockedMnsData.result[0].lockedmns, masternodesData.result);
                    renderTable(combinedData);
                    renderBlockCount(masternodesData.result[0].block, masternodesData.result.length);
                    renderMasternodesCount(combinedData);
                    makeSortable();
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }

        function combineData(lockedMns, masternodes) {
            const combinedData = [];

            // Map to store addresses and their corresponding data
            const addressMap = new Map();

            // Process lockedMns data
            lockedMns.forEach(masternode => {
                const [address, lockTime] = masternode.split(',');
                addressMap.set(address, {lockedMnsData: masternode, masternodeData: null});
            });

            // Process masternodes data
            masternodes.forEach(entry => {
                const nodes = entry.nodes.split('][').map(node => node.replace('[', '').replace(']', '').split(','));
                nodes.forEach(node => {
                    const address = node[2];
                    const existingData = addressMap.get(address);
                    if (!existingData) {
                        addressMap.set(address, {masternodeData: entry, lockedMnsData: null});
                    } else {
                        // Combine the data
                        existingData.masternodeData = entry;
                        existingData.status = 'Active';
                    }
                });
            });

            // Set status to Inactive for entries with only lockedMns data
            addressMap.forEach(value => {
                if (!value.masternodeData) {
                    value.status = 'Inactive';
                }
                combinedData.push(value);
            });

            return combinedData;
        }

        function renderBlockCount(blockNumber) {
            const blockCount = document.querySelector('#mn-block');
            blockCount.textContent = blockNumber;
        }

        function renderMasternodesCount(data) {
            let activeCount = 0;
            let inactiveCount = 0;
            data.forEach(({ status }) => {
                if (status === 'Active') {
                    activeCount++;
                } else if (status === 'Inactive') {
                    inactiveCount++;
                }
            });

            const mnTotal = document.getElementById('mn-total');
            const mnActive = document.getElementById('mn-active');
            const mnInactive = document.getElementById('mn-inactive');

            mnTotal.textContent = data.length;
            mnActive.textContent = activeCount;
            mnInactive.textContent = inactiveCount;
        }

        function renderTable(data) {
            const tableContainer = document.querySelector('#tableContainer');

            // Render data rows
            data.forEach(({masternodeData, lockedMnsData, status}) => {
                const row = document.createElement('div');
                row.classList.add('row');

                row.innerHTML = `
                    <div class="mn-cell priority-1 address-column"><a href="getaddressbalance.html?address=${lockedMnsData ? lockedMnsData.split(',')[0] : ''}">${lockedMnsData ? lockedMnsData.split(',')[0] : ''}</a></div>
                    <div class="mn-cell priority-1"><a href="mntool.html?mynodes=${lockedMnsData ? lockedMnsData.split(',')[0] : ''}:${masternodeData ? generateIPAddress(masternodeData.nodes, lockedMnsData.split(',')[0]) : ''}"><span class="badge1 ${status === 'Active' ? 'active' : 'inactive'}">${status}</span></a></div>
                    <div class="mn-cell priority-6">${masternodeData ? generateIPAddress(masternodeData.nodes, lockedMnsData.split(',')[0]) : ''}</div>
                    <div class="mn-cell priority-6">${masternodeData ? generateUptime(masternodeData.nodes, lockedMnsData.split(',')[0]) : ''}</div>
                    <div class="mn-cell priority-6">${lockedMnsData ? lockedMnsData.split(',')[1] : ''}</div>
                `;
                tableContainer.appendChild(row);
            });
        }

        function generateIPAddress(nodesString, matchedAddress) {
            const nodes = nodesString.split('][').map(node => node.replace('[', '').replace(']', '').split(','));
            let ipAddress = '';

            // Find IP address matching the matchedAddress
            nodes.forEach(node => {
                const address = node[2];
                if (address === matchedAddress) {
                    ipAddress = `${node[0]}:${node[1]}`;
                }
            });

            return ipAddress;
        }

        function generateUptime(nodesString, matchedAddress) {
            const nodes = nodesString.split('][').map(node => node.replace('[', '').replace(']', '').split(','));
            let uptime = '';

            // Find uptime matching the matchedAddress
            nodes.forEach(node => {
                const address = node[2];
                if (address === matchedAddress) {
                    const uptimeMinutes = parseInt(node[3]) * 10;
                    const days = Math.floor(uptimeMinutes / (60 * 24));
                    const weeks = Math.floor(days / 7);
                    const remainingDays = days % 7;
                    const remainingMinutes = uptimeMinutes % (60 * 24);
                    uptime = `${weeks} Weeks, ${remainingDays} Days, ${Math.floor(remainingMinutes / 60)} Hours`;
                }
            });

            return uptime;
        }

        function makeSortable() {
            const headers = document.querySelectorAll('.sortable');
            headers.forEach(header => {
                header.addEventListener('click', () => {
                    const column = header.dataset.column;
                    const direction = header.classList.contains('sorted-asc') ? 'desc' : 'asc';

                    // Remove sorting classes from all headers
                    headers.forEach(header => {
                        header.classList.remove('sorted-asc', 'sorted-desc');
                        // Remove arrow icons
                        header.innerHTML = header.innerHTML.replace(' ?', '').replace(' ?', '');
                    });

                    // Sort the table
                    sortTable(column, direction);

                    // Add sorting class to the clicked header
                    header.classList.toggle('sorted-asc', direction === 'asc');
                    header.classList.toggle('sorted-desc', direction === 'desc');

                    // Add arrow icon based on sorting direction
                    header.innerHTML += direction === 'asc' ? ' ?' : ' ?';
                });
            });
        }

        function sortTable(column, direction) {
            const tableContainer = document.querySelector('#tableContainer');
            const rows = Array.from(tableContainer.querySelectorAll('.row'));

            // Separate the header row from the sorted rows
            const headerRow = rows.shift();

            const sortedRows = rows.sort((a, b) => {
                const aValue = getCellValue(a, column);
                const bValue = getCellValue(b, column);
                if (column === 'Uptime' || column === 'NodeLockExpire') {
                    return compareStringValues(aValue, bValue, direction);
                } else {
                    return compareStringValues(aValue, bValue, direction);
                }
            });

            tableContainer.innerHTML = ''; // Clear existing content

            // Reinsert the header row
            tableContainer.appendChild(headerRow);

            // Append sorted rows
            sortedRows.forEach(row => {
                tableContainer.appendChild(row);
            });
        }

        function getCellValue(row, column) {
            const cells = Array.from(row.querySelectorAll('.mn-cell')); // Change '.cell' to '.mn-cell'
            const columnIndex = Array.from(row.parentNode.querySelectorAll('.mn-cell')).findIndex(cell => cell.dataset.column === column); // Change '.cell' to '.mn-cell'
            return cells[columnIndex].textContent.trim();
        }

        function compareStringValues(a, b, direction) {
            if (direction === 'asc') {
                return a.localeCompare(b);
            } else {
                return b.localeCompare(a);
            }
        }

function searchTable() {
    var input, filter, table, tr, i, j, txtValueIpAddress, txtValueNodeAddress, match;
    input = document.getElementById("searchInput").value;
    filter = input.toUpperCase().split(',').map(item => item.trim()); // Split by comma and trim spaces
    table = document.getElementById("tableContainer");
    tr = table.getElementsByClassName("row");

    for (i = 0; i < tr.length; i++) {
        tdIpAddress = tr[i].getElementsByTagName("div")[2];
        tdNodeAddress = tr[i].getElementsByTagName("div")[0];
        if (tdIpAddress || tdNodeAddress) {
            txtValueIpAddress = tdIpAddress.textContent || tdIpAddress.innerText;
            txtValueNodeAddress = tdNodeAddress.textContent || tdNodeAddress.innerText;
            match = false;

            for (j = 0; j < filter.length; j++) {
                if (txtValueIpAddress.toUpperCase().indexOf(filter[j]) > -1 || txtValueNodeAddress.toUpperCase().indexOf(filter[j]) > -1) {
                    match = true;
                    break;
                }
            }

            if (match) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}
