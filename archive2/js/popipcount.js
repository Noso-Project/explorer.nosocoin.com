fetch("https://nosostats.com:49443/api/poolStatsV2")
  .then((response) => response.json())
  .then((data) => {
    const numPools = data.length;
    let totalMiners = 0;
    let numValidPools = 0;
    for (let i = 0; i < numPools; i++) {
      const poolMiners = parseInt(data[i].Miners);
      if (poolMiners > 0) {
        totalMiners += poolMiners;
        numValidPools++;
      }
    }
    const avgMiners = numValidPools > 0 ? Math.floor(totalMiners / numValidPools) : 0;
    document.getElementById("popipcount").textContent = "" + avgMiners;
  })
  .catch((error) => {
    console.error("Error fetching pool stats:", error);
  });