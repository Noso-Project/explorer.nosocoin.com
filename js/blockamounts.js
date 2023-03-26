fetch('https://nosostats.com:49443/api/24hOrdersAmounts')
  .then(response => response.json())
  .then(data => {
    const ctx = document.getElementById('blockamounts').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(item => item[0]),
       // labels: data.map(item => ''), // empty labels to hide x-axis labels
        datasets: [{
          label: 'NOSO', // y-axis label
          backgroundColor: '#fbe04d', // bar color
          data: data.map(item => item[2]), // nosoamount values as y-axis data
        }]
      },
      options: {
        responsive: true, // set responsive to true to allow chart to scale up/down to fit container
        maintainAspectRatio: true, // set maintainAspectRatio to true to maintain aspect ratio while scaling
        scales: {
          xAxes: [{
            ticks: {
              callback: function(value, index, values) {
          
              }
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: ''
            }
          }]
        }
      }
    });
  })
  .catch(error => console.error(error));
