fetch('https://nosostats.com:49443/api/24hOrdersAmounts')
  .then(response => response.json())
  .then(data => {
    const canvas = document.getElementById('blockorders');
    const parent = canvas.parentNode;
    canvas.style.maxWidth = parent.offsetWidth + "px";
    canvas.style.maxHeight = parent.offsetHeight + "px";

    const ctx = canvas.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(item => item[0]), // block height as x-axis labels
        datasets: [{
          label: 'Orders',
          backgroundColor: '#fbe04d',
          data: data.map(item => item[1]), // ordersonblock values as y-axis data
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          xAxes: [{
            ticks: {
              display: false, // set display to false to hide x-axis labels
            },
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
