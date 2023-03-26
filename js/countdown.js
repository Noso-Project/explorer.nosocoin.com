function fetchCountdown() {
  fetch('https://nosostats.com:49443/api/endOfBlockInUnix')
    .then(response => response.text())
    .then(data => {
      const countdownTime = data.trim() * 1000;
      const now = Date.now();
      const distance = countdownTime - now;
      const minutes = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      document.getElementById('countdown-timer').innerHTML = `${minutes}m ${seconds}s`;
      if (distance < 0) {
        clearInterval(countdownTimer);
        document.getElementById('countdown-timer').innerHTML = 'Block Created';
        // Call fetchCountdown again to refresh the countdown timer
        setTimeout(fetchCountdown, 5000);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Call fetchCountdown every 1 second
fetchCountdown();
setInterval(fetchCountdown, 1000);
