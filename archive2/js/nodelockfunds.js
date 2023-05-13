const url = "https://nosostats.com:49443/api/nodeListS";
const marketUrl = "https://www.sevenseas.exchange/api/v1/markets/NOSO-USDT";

// Make a GET request to the API endpoint
fetch(url)
  .then(response => response.text()) // Convert response to text
  .then(data => {
    // Extract the unique IP addresses from the response
    const ipAddresses = new Set(
      data.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g)
    );

    // Count the number of unique IP addresses in the response
    const uniqueIpAddressCount = ipAddresses.size;

    // Multiply the unique IP address count by 10500
    const nodelockedfunds = uniqueIpAddressCount * 10500 / 1000000;

    // Display the formatted nodelockedfunds inside the div with the id "nodelockedfunds"
    const nodelockedfundsElement = document.getElementById('nodelockedfunds');
    nodelockedfundsElement.textContent = nodelockedfunds.toLocaleString('en-US', { maximumFractionDigits: 2 }) + "M /";
    nodelockedfundsElement.style.fontSize = "25px";

    // Get the market price of NOSO from the API endpoint
fetch(marketUrl)
  .then(response => response.json())
  .then(data => {
    // Extract the lastPrice from the API response
    const lastPrice = data.lastPrice;

    // Calculate the nodeTVL by multiplying the nodelockedfunds with the lastPrice
    const nodeTVL = nodelockedfunds * lastPrice;

    // Round the nodeTVL to two decimal places and append "M/USDT" to the end of the string
    const nodeTVLFormatted = nodeTVL.toLocaleString('en-US', { maximumFractionDigits: 2 }) + "M";

    // Display the formatted nodeTVL inside the div with the id "nodeTVL"
    const nodeTVLElement = document.getElementById('nodeTVL');
    nodeTVLElement.textContent = nodeTVLFormatted;
    nodeTVLElement.style.fontSize = "12px";

    // Get the supply2 from the API endpoint
    const supplyUrl = "https://nosostats.com:49443/api/supply";
    fetch(supplyUrl)
      .then(response => response.json())
      .then(data => {
        // Get the supply2 in million NOSO
        const supply2 = data.data.supplyInNOSO / 1000000;

        // Divide nodelockedfunds by supply2 and multiply by 100 to get the percentage
        const percentCoinsLocked = (nodelockedfunds / supply2) * 100;

        // Display the result as a percentage in the div with the id "percentcoinslocked"
        const percentcoinslockedElement = document.getElementById('percentcoinslocked');
        percentcoinslockedElement.textContent = percentCoinsLocked.toLocaleString('en-US', { maximumFractionDigits: 2 }) + "%";
        percentcoinslockedElement.style.fontSize = "12px";
        
        // Multiply supply2 by the lastPrice to get nosomcap value
        const nosomcap = supply2 * lastPrice;

        // Display the nosomcap value inside the div with the id "nosomcap"
        const nosomcapElement = document.getElementById('nosomcap');
        nosomcapElement.textContent = nosomcap.toLocaleString('en-US', { maximumFractionDigits: 2 }) + "M";
        nosomcapElement.style.fontSize = "12px";
      })
      .catch(error => console.error(error)); // Handle errors
  })
  .catch(error => console.error(error)); // Handle errors
})
.catch(error => console.error(error)); // Handle errors