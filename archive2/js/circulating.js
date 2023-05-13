function loadCirculating() {
const xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		const response = JSON.parse(this.responseText);
		const supplyInNOSO = response.data.supplyInNOSO;
		const supplyInNOSOFormatted = (supplyInNOSO / 1000000).toFixed(1) + "M";
		const supplyDividendFormatted = (supplyInNOSO / (21 * 10000)).toFixed(1) + "%";
		document.getElementById("circulating").innerHTML = `${supplyDividendFormatted}`;
	}
};
xhttp.open("GET", "https://nosostats.com:49443/api/supply", true);
xhttp.send();
}
