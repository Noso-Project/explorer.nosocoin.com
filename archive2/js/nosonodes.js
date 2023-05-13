      const url = "https://nosostats.com:49443/api/nodeListS";
// Make a GET request to the API endpoint
fetch(url)
  .then(response => response.json()) // Convert response to JSON
  .then(data => {
    // Extract the unique lines based on unique IP addresses
    const uniqueLines = [];
    const uniqueIPs = new Set();
    for (let line of data.data) {
      if (!uniqueIPs.has(line.nodeIp)) {
        uniqueLines.push(line);
        uniqueIPs.add(line.nodeIp);
      }
    }

    // Build the HTML table rows
    let tableRows = '';
    tableRows += `<tr><th class="priority-1">Node Address</th><th class="priority-4">Node IP Address</th><th class="priority-4">Node Listening Port</th><th class="priority-2">Country</th><th class="priority-5">Region</th><th class="priority-6">Node Uptime</th><th class="priority-7">Latitude</th><th class="priority-8">Longitude</th></tr>`;
    for (let line of uniqueLines) {
      tableRows += `<tr><td class="priority-1"><a href="addresslookup.html?addresslookup=${line.nodeAddress}" target=”_blank”>${line.nodeAddress}</a></td><td class="priority-4">${line.nodeIp}</td><td class="priority-4">${line.nodePort}</td><td class="priority-2">${line.countryAbbreviation}</td><td class="priority-5">${line.city}</td><td class="priority-6">${line.continuously\u0391ctive}</td><td class="priority-7">${line.latitude}</td><td class="priority-8">${line.longitude}</td></tr>`;
    }

    // Insert the table rows into the HTML table body
    document.getElementById('uniqueLines').innerHTML = tableRows;
  })
  .catch(error => console.error(error)); // Handle errors  
  

    tableRows += `<tr><th class="priority-1">Node Address</th><th class="priority-4">Node IP Address</th><th class="priority-3">Node Listening Port</th><th class="priority-4">Country</th><th class="priority-5">Region</th><th class="priority-6">Node Uptime</th><th class="priority-7">Latitude</th><th class="priority-8">Longitude</th></tr>`;
    for (let line of uniqueLines) {
      tableRows += `<tr><td class="priority-1"><a href="addresslookup.html?addresslookup=${line.nodeAddress}" target=”_blank”>${line.nodeAddress}</a></td><td class="priority-2">${line.nodeIp}</td><td class="priority-4">${line.nodePort}</td><td class="priority-4">${line.countryAbbreviation}</td><td class="priority-5">${line.city}</td><td class="priority-6">${line.continuously\u0391ctive}</td><td class="priority-7">${line.latitude}</td><td class="priority-8">${line.longitude}</td></tr>`;
    }
    
   
