function fetchData() {
  fetch('https://nosostats.com:49443/api/24hOrdersAmounts')
    .then(response => response.json())
    .then(data => {
      const lastAmount = data[data.length - 1][2];
      document.getElementById('lastblockorderamount').textContent = lastAmount;
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

fetchData(); // fetch data initially
// setInterval(fetchData, 30000); // refresh every 10 seconds