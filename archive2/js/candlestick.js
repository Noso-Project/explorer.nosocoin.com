        // Define API URL
        const apiUrl = 'https://script.googleusercontent.com/macros/echo?user_content_key=SKm21MdQ0jTiuYocVOSlOd1QJ513hxYkRGnQqySpp8Oaf2eZMGFK8ct7yTiw7skPeJsMu_88w0R_4VkGx2U3MotNEQli2LPxOJmA1Yb3SEsKFZqtv3DaNYcMrmhZHmUMWojr9NvTBuBLhyHCd5hHa8dOZ37bQvLpDqfzIzaxAovTjOTTt0gY3j9Lam-N6hU1-G1inrffEnoWzLsMQoGNHiY0h2tvTRUhpd2rhn-FbteLAT44JOpfDEALmaJ23tE4qJ0tK8yblfjNTb08BaOKao-MU68o_Nwx&lib=MRl1lVzY3QJXnb269PFds4EOpxNO1S_A_';

        // Make API request
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                // Parse date values
                data.forEach(d => {
                    d.Date = Date.parse(d.Date);
                });

                // Sort data by date
                data.sort((a, b) => a.Date - b.Date);

                // Create chart options object
                const options = {
                    chart: {
                        type: 'candlestick',
                        height: 500,
                        backgroundColor: '#222222'
                    },
                    title: {
                        text: 'P2P trades | NOSO/USD',
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
                        data: data.slice(1).map(d => [d.Date, d.open, d.high, d.low, d.close]),
                        upColor: 'green',
                        color: 'red',
                        lineColor: 'yellow',
                        tooltip: {
                            valueDecimals: 2
                        }
                    }]
                };

                // Render chart
                Highcharts.stockChart('chart-container', options);
            })
            .catch(error => console.error(error));