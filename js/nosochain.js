// Update the table
fetch('https://nosostats.com:49443/api/last143V2')
	.then(response => response.json())
	.then(data => {
		const tableBody = document.querySelector('#nosochain tbody');

		data.forEach(item => {
			const row = document.createElement('tr');
			const utcDate = moment.utc(item[1]).subtract(3, 'hours');
			row.innerHTML = `
				<td class="priority-1"><a href="blocklookup.html?blocknumber=${item[0]}">${item[0]}</a></td>
				<td class="priority-1">${moment(utcDate).fromNow()}</td>
				<td class="priority-1">${item[2]}</td>
				<td class="priority-6"><a target="_blank" href="blocktxlookup.html?blocknumber=${item[0]}">${item[4]}</a></td>
				<td class="priority-6">${item[5]}</td>
				<td class="priority-3">${item[6]}</td>
				<td class="priority-4">${item[7]}</td>
				<td class="priority-6">${item[8]}</td>
				<td class="priority-4"><a target="_blank" href="mnslookup.html?block=${item[0]}">${item[9]}</a></td>
				<td class="priority-6">${item[10]}</td>
			`;
			tableBody.appendChild(row);
		});
	})
	.catch(error => console.error(error));

// Update the table every 10 seconds
setInterval(() => {
    fetch('https://nosostats.com:49443/api/last143V2')
	.then(response => response.json())
	.then(data => {
		const tableBody = document.querySelector('#nosochain tbody');

		// Clear existing rows
		tableBody.innerHTML = '';

		data.forEach(item => {
			const row = document.createElement('tr');
			const utcDate = moment.utc(item[1]).subtract(3, 'hours');
			row.innerHTML = `
				<td class="priority-1"><a href="blocklookup.html?blocknumber=${item[0]}">${item[0]}</a></td>
				<td class="priority-1">${moment(utcDate).fromNow()}</td>
				<td class="priority-1">${item[2]}</td>
				<td class="priority-6"><a target="_blank" href="blocktxlookup.html?blocknumber=${item[0]}">${item[4]}</a></td>
				<td class="priority-6">${item[5]}</td>
				<td class="priority-3">${item[6]}</td>
				<td class="priority-4">${item[7]}</td>
				<td class="priority-6">${item[8]}</td>
				<td class="priority-4"><a target="_blank" href="mnslookup.html?block=${item[0]}">${item[9]}</a></td>
				<td class="priority-6">${item[10]}</td>
			`;
			tableBody.appendChild(row);
		});
	})
	.catch(error => console.error(error));
}, 10000);
