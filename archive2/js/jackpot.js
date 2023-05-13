fetch('https://nosostats.com:49443/api/analyzeAddress/NPrjectPrtcRandmJacptE5')
    .then(response => response.json())
    .then(data => {
        const totalBalance = Math.round(data.TotalBalance);
        document.getElementById('jackpot').innerHTML = `${totalBalance}`;
    })
    .catch(error => {
        console.error('Error:', error);
    });