    const fetchMainnetInfo = () => {
      return fetch('https://rpc.nosocoin.com:8078', {
        method: 'POST',
        headers: {
          'Origin': 'https://rpc.nosocoin.com'
        },
        body: JSON.stringify({
          "jsonrpc": "2.0",
          "method": "getmainnetinfo",
          "params": [],
          "id": 9
        })
      })
        .then(response => response.json())
        .then(data => data.result[0])
        .catch(error => {
          console.error(error);
          throw error;
        });
    };

    const fetchBlock = async (blockNumber) => {
      const response = await fetch('https://rpc.nosocoin.com:8078', {
        method: 'POST',
        headers: {
          'Origin': 'https://rpc.nosocoin.com'
        },
        body: JSON.stringify({
          "jsonrpc": "2.0",
          "method": "getblocksinfo",
          "params": [blockNumber],
          "id": 17
        })
      });
      const data = await response.json();
      const block = data.result[0];
      const blockTime = new Date(block.timeend * 1000);
      return blockTime;
    };

    const startCountdown = (blockTime) => {
      const countdownElement = document.getElementById('countdown');
      const countdownDuration = 10 * 60 * 1000; // 10 minutes

      const countdownTimer = setInterval(() => {
        const now = new Date().getTime();
        const timeRemaining = blockTime.getTime() + countdownDuration - now;

        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        countdownElement.textContent = `${minutes}m ${seconds}s`;

        if (timeRemaining <= 0) {
          clearInterval(countdownTimer);
          countdownElement.textContent = 'Block Created';
          setTimeout(() => {
            countdownElement.textContent = '';
            startCountdownFromLatest();
          }, 5000);
        }
      }, 1000);
    };

    const startCountdownFromLatest = () => {
      fetchMainnetInfo()
        .then(mainnetInfo => {
          const blockNumber = mainnetInfo.lastblock;
          return fetchBlock(blockNumber);
        })
        .then(blockTime => {
          startCountdown(blockTime);
        })
        .catch(error => {
          console.error(error);
        });
    };

    startCountdownFromLatest(); // Start the countdown
