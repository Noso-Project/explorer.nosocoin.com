<?php
    $this->assign('title', __('API').' - ');
    $domain = $this->request->getEnv('HTTP_HOST');
    $protocol = ($domain=='explorer.nosocoin.com')?'https':'http';
?>
        <main>
            <div class="container px-4 py-5">
                <h2 class="pb-2 border-bottom"><?= __('API') ?></h2>
                <div class="row">
                    <div class="col col-3">
                        <h4>Table of Contents</h4>
                        <ul>
                            <li><a href="#introduction">Introduction</a></li>
                            <li><a href="#mainnet">Main Net</a></li>
                            <li><a href="#block">Block</a></li>
                            <li><a href="#block-orders">Block Orders</a></li>
                            <li><a href="#order">Order</a></li>
                            <li><a href="#address">Address</a></li>
                        </ul>
                    </div>
                    <div class="col">

                        <h3><a name="introduction">Introduction</a></h3>
                        <p>It's very important that you set the the header Accept to <code>application/json</code> or append <code>.json</code> to your URL.</p>
                        <p>Otherwise the system will return an HTML response.</p>
                        <div class="container py-2">
                            <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
                              <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                              </symbol>
                            </svg>
                            <div class="alert alert-danger d-flex align-items-center" role="alert">
                                <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
                                <div>This API is still in Alpha and will change on a regular basis.<br/>Please refer to this page on a regular basis.</div>
                            </div>
                        </div>
                        <h3><a name="mainnet">Main Net</a></h3>
                        <p>Returns the Main Net status.</p>
                        <p>Example with extension:</p>
                        <p><?php
                            $url = $protocol.'://'.$domain.$this->Url->build(
                                [
                                    'controller'=>'Explorer',
                                    'action'=>'mainnet',
                                    'prefix'=>'Api'
                                ]
                            );
                            echo "<a class=\"text-break\" href=\"{$url}.json\" target=\"_blank\">{$url}.json</a>";
                        ?></p>
                        <p>Example using cURL:</p>
                        <pre><code class="language-shell">$ curl \
-H 'Accept: application/json' \
"<?= $url ?>"</code></pre>
                        <p>Resturns:</p>
                        <pre><code class="language-json">{
    "code": 200,
    "message": "Ok",
    "mainnet": {
        "lastBlock": 13236,
        "pending": 6,
        "supply": 67210390730000,
        "lastBlockHash": "564E0BA10FA265FEBFCB51AF9310A940",
        "headersHash": "235E6AF9B671E1AA3A8B7D25604FD4B4",
        "summaryHash": "2861856B17FCAC8E4A4157E5C24ECB20"
    }
}</code></pre>

                        <h3><a name="block">Block</a></h3>
                        <p>Returns a block on the blockchain.</p>
                        <p>Example with extension:</p>
                        <p><?php
                            $url = $protocol.'://'.$domain.$this->Url->build(
                                [
                                    'controller'=>'Explorer',
                                    'action'=>'block',
                                    'prefix'=>'Api',
                                    '666'
                                ]
                            );
                            echo "<a class=\"text-break\" href=\"{$url}.json\" target=\"_blank\">{$url}.json</a>";
                        ?></p>
                        <p>Example using cURL:</p>
                        <pre><code class="language-shell">$ curl \
-H 'Accept: application/json' \
"<?= $url ?>"</code></pre>
                        <p>Resturns:</p>
                        <pre><code class="language-json">{
  "code": 200,
  "message": "Ok",
  "block": {
    "number": 666,
    "timeStart": 1615539692,
    "timeEnd": 1615540374,
    "timeTotal": 682,
    "last20": 587,
    "totalTransactions": 0,
    "difficulty": 84,
    "target": "F6FCE7108",
    "solution": "!!!!!!!!!530887901{...};!!!651726821!!!!\";!!!65",
    "lastBlockHash": "F6FCE71081EB7A05133A2F7214582FAA",
    "nextDifficulty": 84,
    "miner": "NEgcLA1epRw5HgbBGNFiWCLMMWmSCX",
    "feesPaid": 0,
    "reward": 5000000000,
    "hash": "780E4A7F9D5AAA1E94E2CFCECA2D9500"
  }
}</code></pre>
                        <p>Errors:</p>
                        <pre><code class="language-json">{
  "code": 400,
  "message": "Need to provide a block"
}</code></pre>
                        <pre><code class="language-json">{
  "code": 404,
  "message": "Need to provide a valid block"
}</code></pre>

                        <h3><a name="block-orders">Block Orders</a></h3>
                        <p>Returns the orders contained in a block of the blockchain.</p>
                        <p>Example with extension:</p>
                        <p><?php
                            $url = $protocol.'://'.$domain.$this->Url->build(
                                [
                                    'controller'=>'Explorer',
                                    'action'=>'blockorders',
                                    'prefix'=>'Api',
                                    '12000'
                                ]
                            );
                            echo "<a class=\"text-break\" href=\"{$url}.json\" target=\"_blank\">{$url}.json</a>";
                        ?></p>
                        <p>Example using cURL:</p>
                        <pre><code class="language-shell">$ curl \
-H 'Accept: application/json' \
"<?= $url ?>"</code></pre>
                        <p>Resturns:</p>
                        <pre><code class="language-json">{
  "code": 200,
  "message": "Ok",
  "block": 12000,
  "orders": [
    {
      "orderID": "OR3w6l3g3i349eaaqkra8gmcxg0du92jxc7t0y5otp7hsjyxb5b2",
      "block": 12000,
      "pending": false,
      "type": "TRFR",
      "transfers": 1,
      "timestamp": 1622839520,
      "reference": "POOLPAYMENT_DevNosoEU",
      "receiver": "N264UuquNSAUb2EaUis9Znxb6SteKES",
      "fee": 74201,
      "amount": 742018885
    },
    {
      "orderID": "OR51win5vx6b5zpqcqqzvh01liv3vixyxkn8my79796x2yiuj32w",
      "block": 12000,
      "pending": false,
      "type": "TRFR",
      "transfers": 1,
      "timestamp": 1622839520,
      "reference": "POOLPAYMENT_DevNosoEU",
      "receiver": "N3zL5pbJoYwJ28dRhuZGo5pmzL7xcFd",
      "fee": 66713,
      "amount": 667131643
    },
    {
      "orderID": "OR522sxqg2vy4dql4178prt22epupmb37s7bxsrc8t0b55bhd31w",
      "block": 12000,
      "pending": false,
      "type": "TRFR",
      "transfers": 1,
      "timestamp": 1622839520,
      "reference": "POOLPAYMENT_DevNosoEU",
      "receiver": "N2KLx886FLbZMMhFqHAFrgxKqxXvWEF",
      "fee": 23768,
      "amount": 237688938
    }
  ]
}</code></pre>
                        <p>Errors:</p>
                        <pre><code class="language-json">{
  "code": 400,
  "message": "Need to provide a block"
}</code></pre>
                        <pre><code class="language-json">{
  "code": 404,
  "message": "Need to provide a valid block"
}</code></pre>

                        <h3><a name="order">Order</a></h3>
                        <p>Returns an order on the blockchain.</p>
                        <p>Example with extension:</p>
                        <p><?php
                            $url = $protocol.'://'.$domain.$this->Url->build(
                                [
                                    'controller'=>'Explorer',
                                    'action'=>'order',
                                    'prefix'=>'Api',
                                    'OR3w6l3g3i349eaaqkra8gmcxg0du92jxc7t0y5otp7hsjyxb5b2'
                                ]
                            );
                            echo "<a class=\"text-break\" href=\"{$url}.json\" target=\"_blank\">{$url}.json</a>";
                        ?></p>
                        <p>Example using cURL:</p>
                        <pre><code class="language-shell">$ curl \
-H 'Accept: application/json' \
"<?= $url ?>"</code></pre>
                        <p>Resturns:</p>
                        <pre><code class="language-json">{
  "code": 200,
  "message": "Ok",
  "order": {
    "orderID": "OR3w6l3g3i349eaaqkra8gmcxg0du92jxc7t0y5otp7hsjyxb5b2",
    "block": 12000,
    "pending": false,
    "type": "TRFR",
    "transfers": 1,
    "timestamp": 1622839520,
    "reference": "POOLPAYMENT_DevNosoEU",
    "receiver": "N264UuquNSAUb2EaUis9Znxb6SteKES",
    "fee": 74201,
    "amount": 742018885
  }
}</code></pre>
                        <p>Errors:</p>
                        <pre><code class="language-json">{
  "code": 400,
  "message": "Need to provide an order"
}</code></pre>
                        <pre><code class="language-json">{
  "code": 404,
  "message": "Need to provide a valid order"
}</code></pre>

                        <h3><a name="address">Address</a></h3>
                        <p>Returns an address on the blockchain.</p>
                        <p>Example with extension:</p>
                        <p><?php
                            $url = $protocol.'://'.$domain.$this->Url->build(
                                [
                                    'controller'=>'Explorer',
                                    'action'=>'address',
                                    'prefix'=>'Api',
                                    'N2RKVvyf254FFSR7BZgduCkNEbzizE2'
                                ]
                            );
                            echo "<a class=\"text-break\" href=\"{$url}.json\" target=\"_blank\">{$url}.json</a>";
                        ?></p>
                        <p>Example using cURL:</p>
                        <pre><code class="language-shell">$ curl \
-H 'Accept: application/json' \
"<?= $url ?>"</code></pre>
                        <p>Resturns:</p>
                        <pre><code class="language-json">{
  "code": 200,
  "message": "Ok",
  "address": {
    "address": "N2RKVvyf254FFSR7BZgduCkNEbzizE2",
    "alias": "",
    "balance": 70856219430,
    "incoming": 0,
    "outgoing": 6343695395
  }
}</code></pre>
                        <p>Errors:</p>
                        <pre><code class="language-json">{
  "code": 400,
  "message": "Need to provide an address"
}</code></pre>
                        <pre><code class="language-json">{
  "code": 404,
  "message": "Need to provide a valid address"
}</code></pre>

                    </div>
                </div>
            </div>
        </main>
