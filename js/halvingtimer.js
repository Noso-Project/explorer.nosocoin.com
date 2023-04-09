let halvingTimer;
let timeRemaining;

function updateHalvingTimer() {
  fetch('https://nosostats.com:49443/api/dBheightS')
    .then(response => response.json())
    .then(data => {
      if (data.code === 200) {
        const blockHeight = data.data.bestHeight;
        if (blockHeight < 210000) {
          halvingTimer = 210000 - blockHeight;
        } else if (blockHeight < 420000) {
          halvingTimer = 420000 - blockHeight;
        } else if (blockHeight < 630000) {
          halvingTimer = 630000 - blockHeight;
        } else if (blockHeight < 840000) {
          halvingTimer = 840000 - blockHeight;
        } else if (blockHeight < 1050000) {
          halvingTimer = 1050000 - blockHeight;
        } else if (blockHeight < 1260000) {
          halvingTimer = 1260000 - blockHeight;
        } else if (blockHeight < 1470000) {
          halvingTimer = 1470000 - blockHeight;
        } else if (blockHeight < 1680000) {
          halvingTimer = 1680000 - blockHeight;
        } else if (blockHeight < 1890000) {
          halvingTimer = 1890000 - blockHeight;
        } else if (blockHeight < 2100000) {
          halvingTimer = 2100000 - blockHeight;
        } else {
          halvingTimer = 0;
        }
        timeRemaining = halvingTimer * 600; // Convert to seconds
        const timeRemainingDays = Math.ceil(timeRemaining / (60 * 60 * 24)); // Convert to days
        const timeRemainingMinutes = timeRemaining % (60 * 24); // Get remaining minutes
        const timeRemainingText = `${timeRemainingDays} Days until Next Halving`;
        document.getElementById('halving-timer').textContent = halvingTimer;
        document.getElementById('halving-timer-days').textContent = timeRemainingText;
      }
    })
    .catch(error => console.error(error));
}

// Call updateHalvingTimer() initially
updateHalvingTimer();

// Call updateHalvingTimer() every 10 minutes (600,000 milliseconds)
setInterval(updateHalvingTimer, 600000);
