    function loadNodeStake() {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                const response = JSON.parse(this.responseText);
                const bestHeight = response.data.bestHeight;
                const nodestake = Math.floor(bestHeight / 100) + 21;
                const nodestakeDiv = document.createElement("div");
                nodestakeDiv.id = "nodestake";
                nodestakeDiv.innerText = nodestake;
                const parentNode = document.getElementById("nodestake-container");
                parentNode.appendChild(nodestakeDiv);
            }
        };
        xhttp.open("GET", "https://nosostats.com:49443/api/dBheightS", true);
        xhttp.send();
    }

    // Refresh the function every 20 seconds
    setInterval(loadNodeStake, 20000);