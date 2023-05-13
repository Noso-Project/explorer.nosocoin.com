$(document).ready(function(){
	var loader = $('#loader');
	var table = $('#api-table tbody');
	var form = $('#api-form');
	var inputField = $('#input-field');
	var apiUrl = 'http://nosostats.ddns.net:49001/api/addressbasic/';

	form.on('submit', function(event){
		event.preventDefault();
		var inputVal = inputField.val();
		loader.show();
		table.html('');
		$.ajax({
			url: apiUrl + inputVal,
			type: 'GET',
			dataType: 'json',
			timeout: 2400000, // set the timeout to 30 seconds
			success: function(response){
				var data = response.data.data;
				var tableHtml = '';
				$.each(data, function(i, catData){
					var cat = catData.cat;
					$.each(catData.data, function(j, rowData){
						tableHtml += '<tr>';
						tableHtml += '<td class="priority-1">' + cat + '</td>';
						tableHtml += '<td class="priority-1">' + rowData.amount + '</td>';
						tableHtml += '<td class="priority-2"><a href="blocklookup.html?blocknumber=' + rowData.block + '">' + rowData.block + '</a></td>';
						// tableHtml += '<td><a href="addresslookup2.html?input-field=' + rowData.receiveFrom + '">' + rowData.receiveFrom + '</a></td>';
						tableHtml += '<td class="priority-3"><a href="addresslookup.html?addresslookup=' + rowData.receiveFrom + '">' + rowData.receiveFrom + '</a></td>';
						tableHtml += '<td class="priority-4">' + rowData.reference + '</td>';
						tableHtml += '<td class="priority-5">' + rowData.timestamp + '</td>';
						tableHtml += '</tr>';
					});
				});
				table.html(tableHtml);
			},
			error: function(jqXHR, textStatus, errorThrown){
				alert('Error: ' + textStatus + ' - ' + errorThrown);
			},
			complete: function() {
				loader.hide();
			}
		});
	});
});
