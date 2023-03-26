// Function to fetch data and create pie chart
function createPieChart() {
  // Fetch data from the API
  fetch('https://nosostats.com:49443/api/newCoinsDistribution')
    .then(response => response.json())
    .then(data => {
      // Extract relevant data from response
      const mnsInNoso = data.mnsInNoso;
      const posInNoso = data.posInNoso;
      const powInNoso = data.powInNoso;

      // Calculate percentages
      const totalBlockReward = 50;
      const mnsPercentage = (mnsInNoso / totalBlockReward) * 100;
      const posPercentage = (posInNoso / totalBlockReward) * 100;
      const powPercentage = (powInNoso / totalBlockReward) * 100;

      // Create pie chart using Chart.js library
      const canvas = document.getElementById('popcoins');
      const parent = canvas.parentNode;
      canvas.style.maxWidth = parent.offsetWidth + "px";
      canvas.style.maxHeight = parent.offsetHeight + "px";

      const popcoinsChart = new Chart(canvas, {
        type: 'pie',
        data: {
          labels: ['Projectfunds', 'Masternodes', 'PoPW'],
          datasets: [{
            label: 'Distribution Percentage',
            borderColor: 'rgba(54, 162, 235, 0.5)',
            borderWidth: 1,

            data: [posPercentage, mnsPercentage, powPercentage],
            backgroundColor: [
              '#3d8cc8',
              '#3dc8bf',
              '#c8b33d'
            ]
          }]
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          legend: {
            display: false
          }
        }
      });
    })
    .catch(error => console.error(error));
}

// Call the function to create the pie chart on page load
createPieChart();

// Refresh the data and pie chart every 300 seconds (5 minutes)
setInterval(() => {
  // Remove the existing chart before fetching new data
  const canvas = document.getElementById('popcoins');
  const parent = canvas.parentNode;
  canvas.remove();

  // Create a new canvas element to hold the refreshed chart
  const newCanvas = document.createElement('canvas');
  newCanvas.id = 'popcoins';
  parent.appendChild(newCanvas);

  // Call the function to create the pie chart with refreshed data
  createPieChart();
}, 300000); // 300 seconds (5 minutes) in milliseconds
