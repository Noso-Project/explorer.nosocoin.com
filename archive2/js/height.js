function loadBestHeight() {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const response = JSON.parse(this.responseText);
      const bestHeight = response.data.bestHeight;
      document.getElementById("bestheight").innerText = " " + bestHeight;

      // Check if the nodestake div element exists
      let nodestakeDiv = document.getElementById("nodestake");
      if (!nodestakeDiv) {
        // If it doesn't exist, create a new one
        nodestakeDiv = document.createElement("div");
        nodestakeDiv.id = "nodestake";
        document.body.appendChild(nodestakeDiv);
      }

      // Update the nodestake content
      const nodestake = Math.floor(bestHeight / 100) + 21;
      nodestakeDiv.innerText = nodestake;
    }
  };
  xhttp.open("GET", "https://nosostats.com:49443/api/dBheightS", true);
  xhttp.send();
}
// Refresh the function every 10 seconds
setInterval(loadBestHeight, 10000);
