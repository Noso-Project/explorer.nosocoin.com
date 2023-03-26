$(function() {
  // extract uri parameter
  const params = new URLSearchParams(window.location.search);
  const blocknumber = params.get('blocknumber');

  $('#block-number-input').val(blocknumber);
  $('#block-number-form').submit(function(event) {
    event.preventDefault(); // Prevent the form from submitting normally
    var blocknumber = $('#block-number-input').val();
    var apiUrl = 'https://nosostats.com:49443/api/blockNumberS/' + blocknumber;

    $.ajax({
      url: apiUrl,
      type: 'GET',
      dataType: 'json',
      success: function(response) {
        displayBlockNumberResults(response);
      },
      error: function(xhr, status, error) {
        console.log('Error:', error);
      }
    });
  });

  if (blocknumber) {
    $('#block-number-form').submit();
  }

	function displayBlockNumberResults(response) {
		var tableHtml = '<table class="styled-table">';
		tableHtml += '<tr><th>Timestamp</th><td>' + response.data.unixTimestamp + '</td></tr>';
		tableHtml += '<tbody><tr><th>Block Number</th><td>' + response.data.blockNumber +'</td></tr>';
		tableHtml += '<tr><th>Block Hash</th><td>' + response.data.blockHash + '</td></tr>';
		tableHtml += '<tr><th>Block Fees</th><td>' + (response.data.blockFees * 0.00000001) + '</td></tr>';
		tableHtml += '<tr><th>Reward</th><td>' + (response.data.blockReward * 0.00000001) + '</td></tr>';

		tableHtml += '<tr><th>Time Start</th><td>' + response.data.timeStart + '</td></tr>';
		tableHtml += '<tr><th>Time End</th><td>' + response.data.timeEnd + '</td></tr>';
		tableHtml += '<tr><th>Time Total</th><td>' + response.data.timeTotal + '</td></tr>';
		tableHtml += '<tr><th>Masternode Count</th><td>' + response.data.mnsQ + '</td></tr>';
		//tableHtml += '<tr><th>Masternode Count</th><td><a target="_blank" href="mnslookup.html?block=' + response.data.blockNumber + '">' + response.data.mnsQ + '</a></td></tr>';
		tableHtml += '<tr><th>Masternode Reward</th><td><a target="_blank" href="mnslookup.html?block=' + response.data.blockNumber + '">' + (response.data.mns.mnsRewardInPedro * 0.00000001) + '</a></td></tr>';

		//tableHtml += '<tr><th>Masternode Reward</th><td>' + response.data.mns.mnsRewardInPedro + '</td></tr>';
		//tableHtml += '<tr><th><a href="masternodes.html">Masternode Addresses</a></th><td>' + response.data.mns.mnsAddresses + '</td></tr>';
	
		tableHtml += '<tr><th>PoS Count</th><td>' + response.data.posQ + '</td></tr>';
		//tableHtml += '<tr><th>PoS Count</th><td><a target="_blank" href="poslookup.html?block=' + response.data.blockNumber + '">' + response.data.posQ + '</a></td></tr>';
	
		 tableHtml += '<tr><th>PoS Reward</th><td><a target="_blank" href="poslookup.html?block=' + response.data.blockNumber + '">' + (response.data.pos.posRewardInPedro * 0.00000001) + '</a></td></tr>';
		//tableHtml += '<tr><th>PoS Reward</th><td>' + response.data.pos.posRewardInPedro + '</td></tr>';
		//tableHtml += '<tr><th>PoS Addresses</th><td>' + response.data.pos.posAddresses + '</td></tr>';
		tableHtml += '<tr><th>Block Orders</th><td><a target="_blank" href="blocktxlookup.html?blocknumber=' + response.data.blockNumber + '">block ' + response.data.blockNumber + " orders" + '</a></td></tr>';	
		//tableHtml += '<tr><th>PoPW Reward</th><td>' + response.data.powRewardInPedro + '</td></tr>';
		
		tableHtml += '<tr><th>PoPW Reward</th><td>' + (response.data.powRewardInPedro * 0.00000001) + '</td></tr>';
		tableHtml += '<tr><th>Block Creator</th><td><a target="_blank" href="popwblockcreator.html?blocknumber=' + response.data.blockNumber + '">block ' + response.data.blockNumber + " creator" +  '</a></td></tr>';
		tableHtml += '<tr><th>Solution</th><td>' + response.data.solution + '</td></tr>';
		tableHtml += '<tr><th>Target Hash</th><td>' + response.data.targetHash + '</td></tr>';
		//tableHtml += '<tr><th>Unique Address</th><td>' + response.data.uniqueAddresesList + '</td></tr>';
		tableHtml += '</tbody></table>';

		$('#block-number-results').html(tableHtml);
  }
});
