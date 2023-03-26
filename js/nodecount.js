      function loadNodeIpAddressCount() {
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
            const nodeIpAddressCount = ipAddresses.size;

            // Display the unique IP address count on the webpage
            document.getElementById('nodeIpAddressCount').textContent = nodeIpAddressCount;
          })
          .catch(error => console.error(error)); // Handle errors
      }

// Refresh the function every 20 seconds
setInterval(loadPendingOrders, 20000);