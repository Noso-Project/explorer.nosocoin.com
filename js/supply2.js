function loadSupply2() {
	const xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			const response = JSON.parse(this.responseText);
			const supply = response.data.supplyInNOSO / 1000000;
			const formattedSupply = Math.floor(supply * 100) / 100;
			document.getElementById("supply2").innerText = "" + formattedSupply.toFixed(1) + "M";
		}
	};
	xhttp.open("GET", "https://nosostats.com:49443/api/supply", true);
	xhttp.send();
}
