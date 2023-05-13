function loadChart() {
  fetch('https://nosostats.com:49443/api/qMnOverLast144')
    .then(response => response.json())
    .then(data => {
      const labels = data.map(entry => entry[0]);
      const values = data.map(entry => entry[1]);

      const ctx = document.getElementById('mn24').getContext('2d');
      const mn24 = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Active Masternodes',
            data: values,
            backgroundColor: 'transparent',
            borderColor: '#fbe04d',
            borderWidth: 1,
            pointRadius: 0.0
          }]
        },
        options: {
          maintainAspectRatio: true,
          scales: {
            xAxes: [{
              display: false
            }],
            yAxes: [{
              ticks: {
                beginAtZero: true,
                fontColor: '#bbb', // set y-axis tick color
        	suggestedMax: 300 // set the initial maximum y-axis limit                
		
              },
              gridLines: {
                color: '#707070', // set horizontal grid lines color
                zeroLineColor: '#fbe04d', // set color of the horizontal line at y = 0'
                
              }
            }]
          },
          legend: {
            display: false
          },
          backgroundColor: '#222222'
        }
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Load chart on page load
loadChart();

// Reload chart every 300 seconds (5 minutes)
setInterval(() => {
  loadChart();
}, 30000);
