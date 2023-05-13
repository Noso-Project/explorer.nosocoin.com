        // Define API URL
        const apiUrl = 'https://script.googleusercontent.com/macros/echo?user_content_key=SKm21MdQ0jTiuYocVOSlOd1QJ513hxYkRGnQqySpp8Oaf2eZMGFK8ct7yTiw7skPeJsMu_88w0R_4VkGx2U3MotNEQli2LPxOJmA1Yb3SEsKFZqtv3DaNYcMrmhZHmUMWojr9NvTBuBLhyHCd5hHa8dOZ37bQvLpDqfzIzaxAovTjOTTt0gY3j9Lam-N6hU1-G1inrffEnoWzLsMQoGNHiY0h2tvTRUhpd2rhn-FbteLAT44JOpfDEALmaJ23tE4qJ0tK8yblfjNTb08BaOKao-MU68o_Nwx&lib=MRl1lVzY3QJXnb269PFds4EOpxNO1S_A_';

        // Make API request
        $.getJSON(apiUrl, function(data) {
            // Get last row of data
            const lastRow = data[data.length - 1];
            // Get close price from last row
            const closePrice = lastRow.close;
            // Display close price in HTML page
            $('#price').text(`${closePrice}`);
        });