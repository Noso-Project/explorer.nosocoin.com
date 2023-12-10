$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const inputVal = urlParams.get('address');
    const limitVal = urlParams.get('limit') || 10;
    const offsetInput = $('#offsetInput');
    const tableContainer = $('#api-table');

    if (inputVal) {
        const loader = $('#loader');
        const tableBody = $('#api-table-body');

        function makeApiRequest(offsetVal) {
            const apiUrl = 'https://api.nosocoin.com/transactions/history?address=' + inputVal + '&limit=' + limitVal + '&offset=' + offsetVal;

            loader.show();
            tableBody.html('');

            $.ajax({
                url: apiUrl,
                type: 'GET',
                dataType: 'json',
                timeout: 3000000,
                success: function (response) {
                    const inbound = response.inbound;
                    const outbound = response.outbound;

                    function appendTransaction(transaction, type) {
                        const transactionDiv = $('<div class="table-row"></div>');
                        transactionDiv.append($('<div class="cell priority-1"></div>').html('<a href="getordersinfo.html?orderid=' + transaction.order_id + '">' + transaction.order_id + '</a>'));
                        transactionDiv.append($('<div class="cell priority-1"></div>').text(transaction.amount));
                        transactionDiv.append($('<div class="cell priority-4"></div>').html('<a href="getblockinfo.html?blockheight=' + transaction.block_id + '">' + transaction.block_id + '</a>'));
                        transactionDiv.append($('<div class="cell priority-4"></div>').text(type));
                        transactionDiv.append($('<div class="cell priority-4"></div>').html('<a href="getaddressbalance.html?address=' + (type === 'Inbound' ? transaction.sender : transaction.receiver) + '">' + (type === 'Inbound' ? transaction.sender : transaction.receiver) + '</a>'));

                        transactionDiv.append($('<div class="cell priority-1"></div>').text(transaction.timestamp));

                        tableBody.append(transactionDiv);
                    }

                    $.each(inbound, function (i, transaction) {
                        appendTransaction(transaction, 'Inbound');
                    });

                    $.each(outbound, function (i, transaction) {
                        appendTransaction(transaction, 'Outbound');
                    });
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error: ' + textStatus + ' - ' + errorThrown);
                },
                complete: function () {
                    loader.hide();
                }
            });
        }

        $('#submitBtn').on('click', function () {
            const offsetVal = offsetInput.val() || 0;
            makeApiRequest(offsetVal);
        });

        makeApiRequest(0);
    }
});

$(document).ajaxStart(function () {
    $('#loader').show();
});

$(document).ajaxStop(function () {
    $('#loader').hide();
});
