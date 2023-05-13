function loadPendingOrders() {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const response = JSON.parse(this.responseText);
      const pendingOrders = response.data[" pendingOrders"];
      document.getElementById("pendingorders").innerText = pendingOrders;
    }
  };
  xhttp.open("GET", "https://nosostats.com:49443/api/pendingOrders", true);
  xhttp.send();
}

// Refresh the function every 20 seconds
setInterval(loadPendingOrders, 20000);