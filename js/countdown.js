let countdownTimer;

function startCountdown(countdownTime) {
  clearInterval(countdownTimer);
  
  const now = Date.now();
  const distance = countdownTime - now;
  
  if (distance <= 0) {
    document.getElementById('countdown-timer').innerHTML = 'Block Created';
    fetchCountdown();
    return;
  }
  
  const minutes = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  document.getElementById('countdown-timer').innerHTML = `${minutes}m ${seconds}s`;
  
  countdownTimer = setTimeout(() => {
    startCountdown(countdownTime);
  }, 1000);
}

function fetchCountdown() {
  fetch('https://nosostats.com:49443/api/endOfBlockInUnix')
    .then(response => response.text())
    .then(data => {
      const countdownTime = data.trim() * 1000;
      startCountdown(countdownTime);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Call fetchCountdown to start the countdown
fetchCountdown();
