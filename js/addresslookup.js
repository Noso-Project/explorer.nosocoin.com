const form = document.querySelector('#api-form');
const tableBody = document.querySelector('#table-body');
const spinner = document.querySelector('#spinner');

// Get the value of the "addresslookup" parameter from the URL, if present
const urlParams = new URLSearchParams(window.location.search);
const addresslookupParam = urlParams.get('addresslookup');

// If the "addresslookup" parameter is present, set the value of the addresslookup input field to its value and submit the form
if (addresslookupParam) {
  const addresslookupInput = form.querySelector('#addresslookup');
  addresslookupInput.value = addresslookupParam;
  submitForm();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  submitForm();
});

function submitForm() {
  const inputAddresslookup = form.elements['addresslookup'].value;
  const apiUrl = `https://nosostats.com:49443/api/analyzeAddress/${inputAddresslookup}`;

  // Show the spinner while waiting for the API response
  spinner.style.display = 'inline-block';

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    // Clear the existing content of the table body
    tableBody.innerHTML = '';

    // Loop through the data and add a new row for each property
    for (const [key, value] of Object.entries(data)) {
      const row = document.createElement('tr');
      const propCell = document.createElement('td');
      const valueCell = document.createElement('td');

      propCell.textContent = key;

      if (key === 'addresscreatedatblock' || key === 'NosoAddress') {
        // Create a hyperlink to the desired page for the "addresscreatedatblock" and "NosoAddress" fields
        const link = document.createElement('a');
        link.textContent = value;
        link.href = (key === 'addresscreatedatblock') ? `blocklookup.html?blocknumber=${value}` : `addresshistory.html?input-field=${encodeURIComponent(value)}`;
        valueCell.appendChild(link);
      } else if (/^\d{1,10}$/.test(value)) {
        // Check if the value is a number with 10 or fewer digits
        // If so, create a hyperlink to "blocklookup.html"
        const link = document.createElement('a');
        link.textContent = value;
        link.href = `blocklookup.html?blocknumber=${value}`;
        valueCell.appendChild(link);
      } else {
        // If not, just display the value
        valueCell.textContent = value;
      }

      row.appendChild(propCell);
      row.appendChild(valueCell);
      tableBody.appendChild(row);
    }

    // Add the missing fields from the "analyzed" object if present
    if (data.analyzed) {
      for (const [key, value] of Object.entries(data.analyzed)) {
        const row = document.createElement('tr');
        const propCell = document.createElement('td');
        const valueCell = document.createElement('td');

        propCell.textContent = key;

         
          valueCell.textContent = value;
        

        row.appendChild(propCell);
        row.appendChild(valueCell);
        tableBody.appendChild(row);
      }
    }

    // Create a custom row for NosoAddress
    const nosoAddressRow = document.createElement('tr');
    const nosoAddressPropCell = document.createElement('td');
    const nosoAddressValueCell = document.createElement('td');

    nosoAddressPropCell.textContent = 'NosoAddress';

    // Create a hyperlink to "addresshistory.html" for the NosoAddress value
    const link = document.createElement('a');
    link.href = `addresshistory.html?input-field=${encodeURIComponent(inputAddresslookup)}`;
    link.textContent = inputAddresslookup;
    nosoAddressValueCell.appendChild(link);

    nosoAddressRow.appendChild(nosoAddressPropCell);
    nosoAddressRow.appendChild(nosoAddressValueCell);
    tableBody.appendChild(nosoAddressRow);

    // Hide the spinner once the content is rendered on the page
    spinner.style.display = 'none';
  })
  .catch(error => console.error(error));

}

