		$(function() {
			$('#aliaslookupform').submit(function(event) {
				event.preventDefault(); // Prevent the form from submitting normally
				var aliasName = $('#aliaslookup1').val();
				var apiUrl = 'https://nosostats.com:49443/api/aliasFinder/' + aliasName;

				$.ajax({
					url: apiUrl,
					type: 'GET',
					dataType: 'json',
					success: function(response) {
						displayAliasResults(response);
					},
					error: function(xhr, status, error) {
						console.log('Error:', error);
					}
				});
			});

			function displayAliasResults(response) {
				var tableHtml = '<table class="styled-table">';
				tableHtml += '<tbody><tr><th>Alias Name</th><td>' + response.alias +'</td></tr>';
				tableHtml += '<tr><th>Alias Address</th><td><a href="addresslookup.html?addresslookup=' + response.aliasAddress + '">' + response.aliasAddress + '</a></td></tr>';
				tableHtml += '<tr><th>Registered at Block</th><td><a href="blocklookup.html?blocknumber=' + response.aliasRegirteredAtBlock + '">' + response.aliasRegirteredAtBlock  + '</a></td></tr>';
				tableHtml += '</tbody></table>';

				$('#aliassearch').html(tableHtml);
			}

			// Get the URL parameter
			var urlParams = new URLSearchParams(window.location.search);
			var alias = urlParams.get('alias');

			// If an alias is present in the URL, perform the search automatically
			if (alias) {
				$('#aliaslookup1').val(alias);
				$('#aliaslookupform').submit();
			}
		});