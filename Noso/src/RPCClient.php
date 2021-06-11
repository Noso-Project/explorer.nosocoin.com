<?php

declare(strict_types = 1);

namespace Noso;

use Cake\Http\Client as HttpClient;

class RPCClient{
    private $host;
    private $port;
    private $timeout;

    function __construct($host, $port, $timeout){
        $this->host = $host;
        $this->port = $port;
        $this->timeout = $timeout;
    }

    function get(string $method, array $params, int $id){
        $http = new HttpClient();
        $request = [
            "jsonrpc" => "2.0",
            "method" => $method,
            "params" => $params,
            "id" => $id
        ];
        //echo json_encode($request) . "\n";
        $response = $http->post(
            "http://{$this->host}:{$this->port}",
            json_encode($request),
            [
                'timeout' => $this->timeout,
                'redirect' => true,
                'type'=>'json'
            ]
        );
        return $response;
    }
}
