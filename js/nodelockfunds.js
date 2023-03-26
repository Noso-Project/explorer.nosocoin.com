const url = "https://nosostats.com:49443/api/nodeListS";

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

    // Round the nodelockedfunds to two decimal places and append "M" to the end of the string
    const nodelockedfundsFormatted = nodelockedfunds.toLocaleString('en-US', { maximumFractionDigits: 2 }) + "M /";

    // Display the formatted nodelockedfunds inside the div with the id "nodelockedfunds"
    document.getElementById('nodelockedfunds').textContent = nodelockedfundsFormatted;

    // Get the supply2 from the API endpoint
    const supplyUrl = "https://nosostats.com:49443/api/supply";
    fetch(supplyUrl)
      .then(response => response.json())
      .then(data => {
        // Get the supply2 in million NOSO
        const supply2 = data.data.supplyInNOSO / 1000000;

        // Divide nodelockedfunds by supply2 and multiply by 100 to get the percentage
        const result = (nodelockedfunds / supply2) * 100;

        // Display the result as a percentage in the div with the id "percentcoinslocked"
        document.getElementById('percentcoinslocked').textContent = result.toLocaleString('en-US', { maximumFractionDigits: 2 }) + "%";
      })
      .catch(error => console.error(error)); // Handle errors
  })
  .catch(error => console.error(error)); // Handle errors