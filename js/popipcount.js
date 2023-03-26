      fetch("https://nosostats.com:49443/api/poolStatsV2")
        .then((response) => response.json())
        .then((data) => {
          const numPools = data.length;
          let totalMiners = 0;
          for (let i = 0; i < numPools; i++) {
            totalMiners += parseInt(data[i].Miners);
          }
          const avgMiners = Math.floor(totalMiners / numPools);
          document.getElementById("popipcount").textContent =
            "" + avgMiners;
        })
        .catch((error) => {
          console.error("Error fetching pool stats:", error);
        });