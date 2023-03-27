let countdownInterval;
let lastCountdownTime;

function fetchCountdown() {
  fetch('https://nosostats.com:49443/api/endOfBlockInUnix')
    .then(response => response.text())
    .then(data => {
      const countdownTime = data.trim() * 1000;
      lastCountdownTime = countdownTime;
      startCountdown();
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function startCountdown() {
  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    const now = Date.now();
    const distance = lastCountdownTime - now;
    const minutes = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    document.getElementById('countdown-timer').innerHTML = `${minutes}m ${seconds}s`;
    if (distance < 0) {
      clearInterval(countdownInterval);
      document.getElementById('countdown-timer').innerHTML = 'Block Created';
      setTimeout(fetchCountdown, 5000);
      setTimeout(startCountdown, 5000);
    }
  }, 1000);
}

fetchCountdown();
