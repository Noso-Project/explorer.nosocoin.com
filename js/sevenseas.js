    // Define API URL
    const apiUrl = 'https://www.sevenseas.exchange/api/v1/history/NOSO-USDT';

    // Make API request
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Sort data by time
            data.sort((a, b) => a.time - b.time);

            // Create chart options object
            const options = {
                chart: {
                    type: 'candlestick',
                    height: 500,
                    backgroundColor: '#222222'
                },
                title: {
                    text: 'P2P trades | NOSO/USDT',
                    style: {
                        color: '#fbe04d'
                    }
                },
                xAxis: {
                    type: 'datetime',
                    labels: {
                        style: {
                            color: 'white'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: 'Price',
                        style: {
                            color: 'white'
                        }
                    },
                    labels: {
                        style: {
                            color: 'white'
                        }
                    }
                },
                series: [{
                    name: 'Price',
                    data: data.map(d => [d.time, d.price, d.price, d.price, d.price]),
                    upColor: 'green',
                    color: 'red',
                    lineColor: 'yellow',
                    tooltip: {
                        valueDecimals: 2
                    }
                }]
            };

            // Render chart
            Highcharts.stockChart('sevenseas-container', options);
        })
        .catch(error => console.error(error));
