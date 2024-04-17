// Function to fetch data from API
async function fetchData(url) {
  const response = await fetch(url);
  return response.json();
}

// Function to calculate percentage
function calculatePercentage(balance, circulatingSupply) {
  return ((balance / circulatingSupply) * 100).toFixed(2);
}

// Main function to populate table and perform calculations
async function populateTable() {
  const richlistUrl = 'https://api.nosocoin.com/address/richlist';
  const circulatingSupplyUrl = 'https://api.nosocoin.com/info/circulating_supply';
  const lockedSupplyUrl = 'https://api.nosocoin.com/info/locked_supply';

  const richlistData = await fetchData(richlistUrl);
  const circulatingSupplyData = await fetchData(circulatingSupplyUrl);
  const lockedSupplyData = await fetchData(lockedSupplyUrl);

  const circulatingSupply = circulatingSupplyData;
  const lockedInMasternodes = lockedSupplyData;
  document.getElementById('circulatingsupply').textContent = circulatingSupply;
  document.getElementById('lockedinmasternodes').textContent = lockedInMasternodes;

  const tableBody = document.querySelector('#richlist tbody');
  let top20TotalBalance = 0;

  richlistData.forEach((item, index) => {
    const row = tableBody.insertRow();
    const rankCell = row.insertCell(0);
    rankCell.classList.add('priority-1');
    const addressCell = row.insertCell(1);
    addressCell.classList.add('priority-1');
    const descriptionCell = row.insertCell(2);
    descriptionCell.classList.add('priority-6');
    const balanceCell = row.insertCell(3);
    balanceCell.classList.add('priority-1');
    const percentCell = row.insertCell(4);
    percentCell.classList.add('priority-6');

    rankCell.textContent = index + 1;
    
    // Shrink the address to 5 characters followed by dots and 5 characters
    const shrunkAddress = item.address.substring(0, 10) + ".." + item.address.substring(item.address.length - 8);
    // Create a hyperlink with the shrunk address
    addressCell.innerHTML = `<a target="_blank" href="getaddressbalance.html?address=${item.address}">${shrunkAddress}</a>`;
 
    // Set custom description based on address
    switch (item.address) {
      case "N3VCAvZyhnoFabFTfeWvY7WYoXQQ8FF":
        descriptionCell.textContent = "XeggeX";
        break;
      case "N2ECg31WcrbQkDdK4RKNkv1T3ebBfCH":
        descriptionCell.textContent = "NonKYC";
        break;
      case "N2Xh9dUcsdarJXgx7Q1jusVn8MpLUFh":
        descriptionCell.textContent = "Azbit";
        break;
      case "NpryectdevepmentfundsGE":
        descriptionCell.textContent = "ProjectFunds";
        break;
      case "NPrjectPrtcRandmJacptE5":
        descriptionCell.textContent = "ProjectFunds";
        break;
      case "NNYhLhffXQMTz7a21HXJZv4de2KvDQ":
        descriptionCell.textContent = "ProjectFunds";
        break;
      case "NHrtQrU1mvdf2RvmWsA1KCfsp3XmFR":
        descriptionCell.textContent = "ProjectFunds";
        break;
      case "NevZpWkWUfnUizdALbfD2hn66CktFj":
        descriptionCell.textContent = "ProjectFunds";
        break;
      case "N3sQYxtU9sCioEgpSRay7N8fJoCeF4":
        descriptionCell.textContent = "ProjectFunds";
        break;
      case "N2a7MhwjDLL2uiKg5YU5tGoZDJFpADB":
        descriptionCell.textContent = "ProjectFunds";
        break;
      case "N3o1qPLeznkx86wJwYzChnv81NLJnFn":
        descriptionCell.textContent = "ProjectFunds";
        break;
      case "N4CT62UF673P1dKd9Q28SpGgh9dA89E":
        descriptionCell.textContent = "ProjectFunds";
        break;
      case "N2BeshovTQStyJyH91oReU5JJfFaNEg":
        descriptionCell.textContent = "ProjectFunds";
        break;
      case "N3bvz9SFwbjVY1uh3nqT6zQvMgXJSFu":
        descriptionCell.textContent = "ProjectFunds";
        break;
      case "N9mRoL21bTf2XpCnZXSuC8n1VEVjCr":
        descriptionCell.textContent = "ProjectFunds";
        break;
      default:
        descriptionCell.textContent = "Unknown";
    }

    balanceCell.textContent = item.balance;
    const percent = calculatePercentage(item.balance, circulatingSupply);
    percentCell.textContent = percent + "%";

    // Calculate top 20 total balance
    if (index < 20) {
      top20TotalBalance += item.balance;
    }
  });

  // Populate the richest address and its percentage of circulating supply
  const richestAddress = richlistData[0].address;
  const richestBalance = richlistData[0].balance;
  document.getElementById('richestaddress').textContent = richestAddress;
  
  document.getElementById('topaddressbalance').textContent = Math.round(richestBalance);
  
  document.getElementById('topaddresspercent').textContent = calculatePercentage(richestBalance, circulatingSupply) + "%";

  // Calculate and populate the percentage of circulating supply the top 20 richest addresses hold
  const top20Percentage = calculatePercentage(top20TotalBalance, circulatingSupply);
  document.getElementById('richestaddress20').textContent = top20Percentage + "%";

  // Calculate and populate the percentage of circulating supply locked in masternodes
  const masternodeSupplyPercent = calculatePercentage(lockedInMasternodes, circulatingSupply);
  document.getElementById('masternodesupplypercent').textContent = masternodeSupplyPercent + "%";

  // List of project nodes addresses
  const projectNodesAddresses = [
    "N9mRoL21bTf2XpCnZXSuC8n1VEVjCr",
    "N3bvz9SFwbjVY1uh3nqT6zQvMgXJSFu",
    "N2BeshovTQStyJyH91oReU5JJfFaNEg",
    "N4CT62UF673P1dKd9Q28SpGgh9dA89E",
    "N3o1qPLeznkx86wJwYzChnv81NLJnFn",
    "N2a7MhwjDLL2uiKg5YU5tGoZDJFpADB",
    "N3sQYxtU9sCioEgpSRay7N8fJoCeF4",
    "NevZpWkWUfnUizdALbfD2hn66CktFj",
    "NHrtQrU1mvdf2RvmWsA1KCfsp3XmFR",
    "NNYhLhffXQMTz7a21HXJZv4de2KvDQ"
  ];

  // Fetch balance for each project nodes address and calculate sum
  let projectNodesBalance = 0;
  for (let i = 0; i < projectNodesAddresses.length; i++) {
    const balanceData = await fetchData(`https://api.nosocoin.com/address/balance?address=${projectNodesAddresses[i]}`);
    projectNodesBalance += balanceData.balance;
  }


  document.getElementById('projectnodesbalance').textContent = Math.round(projectNodesBalance);


  // List of project funds addresses
  const projectFundsAddresses = ["NpryectdevepmentfundsGE", "NPrjectPrtcRandmJacptE5"];
  let projectFundsBalance = 0;

  // Fetch balance for each project funds address and calculate sum
  for (let i = 0; i < projectFundsAddresses.length; i++) {
    const balanceData = await fetchData(`https://api.nosocoin.com/address/balance?address=${projectFundsAddresses[i]}`);
    projectFundsBalance += balanceData.balance;
  }

 
  document.getElementById('projectfunds').textContent = Math.round(projectFundsBalance);
  // Sum of project nodes balance and project funds balance
  const totalProjectFunds = projectNodesBalance + projectFundsBalance;
  document.getElementById('totalprojectfunds').textContent = Math.round(totalProjectFunds);


  // Calculate and populate the percentage of circulating supply held by addresses ranked 26-50
  let richestAddress26_50Balance = 0;
  for (let i = 25; i < 50; i++) {
    richestAddress26_50Balance += richlistData[i].balance;
  }
  const richestAddress26_50Percent = calculatePercentage(richestAddress26_50Balance, circulatingSupply);
  document.getElementById('richestaddress26_50').textContent = richestAddress26_50Percent + "%";

  // Calculate and populate the percentage of circulating supply held by addresses ranked 51-75
  let richestAddress51_75Balance = 0;
  for (let i = 50; i < 75; i++) {
    richestAddress51_75Balance += richlistData[i].balance;
  }
  const richestAddress51_75Percent = calculatePercentage(richestAddress51_75Balance, circulatingSupply);
  document.getElementById('richestaddress51_75').textContent = richestAddress51_75Percent + "%";

  // Calculate and populate the percentage of circulating supply held by addresses ranked 76-100
  let richestAddress76_100Balance = 0;
  for (let i = 75; i < 100; i++) {
    richestAddress76_100Balance += richlistData[i].balance;
  }
  const richestAddress76_100Percent = calculatePercentage(richestAddress76_100Balance, circulatingSupply);
  document.getElementById('richestaddress76_100').textContent = richestAddress76_100Percent + "%";

  // Calculate sum of balances for addresses ranked 1-100
  let richestAddress1_100Balance = 0;
  for (let i = 0; i < 100; i++) {
    richestAddress1_100Balance += richlistData[i].balance;
  }
  const richestAddress1_100Percent = calculatePercentage(richestAddress1_100Balance, circulatingSupply);
  document.getElementById('richestaddress1_100').textContent = richestAddress1_100Percent + "%";

  // Calculate remaining circulating supply
  const remainingSupplyPercent = (100 - richestAddress1_100Percent).toFixed(2);
  document.getElementById('remainingsupply').textContent = remainingSupplyPercent + "%";
}

// Call the main function to populate the table and perform calculations
populateTable();