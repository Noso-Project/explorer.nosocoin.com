<?php

declare(strict_types = 1);

namespace Noso;

use Noso\RPCClient;
use Noso\Explorer\Block;
use Noso\Explorer\Order;
use Noso\Explorer\Address;
use Noso\Explorer\Mainnet;

class Explorer {
    private $rpc_client;

    function __construct($host, $port){
        $this->rpc_client = new RPCClient($host, $port, 300);
    }

    private function _fetch(string $method, array $params, int $id){
        $response = $this->rpc_client->get($method, $params, $id);
        return $response;
    }

    public function getBlock(int $block){
        try {
            $response = $this->_fetch('getblockinfo', [$block], 1);
            //echo json_encode($response->getJson()) . "\n";
            if ($response->isOk()) {
                $block = $response->getJson();
                if (isset($block['result']) && count($block['result']) > 0) {
                    $block = $block['result'][0];

                    $blockInfo = new Block();

                    $blockInfo->valid =             isset($block['valid'])?$block['valid']:false;
                    $blockInfo->number =            isset($block['number'])?$block['number']:-1;
                    $blockInfo->timeStart =         isset($block['timestart'])?$block['timestart']:-1;
                    $blockInfo->timeEnd =           isset($block['timeend'])?$block['timeend']:-1;
                    $blockInfo->timeTotal =         isset($block['timetotal'])?$block['timetotal']:-1;
                    $blockInfo->last20 =            isset($block['last20'])?$block['last20']:'';
                    $blockInfo->totalTransactions = isset($block['totaltransactions'])?$block['totaltransactions']:-1;
                    $blockInfo->difficulty =        isset($block['difficulty'])?$block['difficulty']:-1;
                    $blockInfo->target =            isset($block['target'])?$block['target']:'';
                    $blockInfo->solution =          isset($block['solution'])?$block['solution']:'';
                    $blockInfo->lastBlockHash =     isset($block['lastblockhash'])?$block['lastblockhash']:'';
                    $blockInfo->nextDifficulty =    isset($block['nextdifficult'])?$block['nextdifficult']:-1;
                    $blockInfo->miner =             isset($block['miner'])?$block['miner']:'';
                    $blockInfo->feesPaid =          isset($block['feespaid'])?$block['feespaid']:-1;
                    $blockInfo->reward =            isset($block['reward'])?$block['reward']:-1;
                    $blockInfo->hash =              isset($block['hash'])?$block['hash']:'';

                    return $blockInfo;
                } else{
                    return null;
                }
            } else {
                return null;
            }
        } catch (\Exception $e){
            return null;
        }
    }

    public function getBlocks(array $blocks){
        try {
            $response = $this->_fetch('getblockinfo', $blocks, 1);
            //echo json_encode($response->getJson()) . "\n";
            if ($response->isOk()) {
                $blocks = $response->getJson();
                if (isset($blocks['result']) && count($blocks['result']) > 0) {
                    $blocks = $blocks['result'];

                    $blocksInfo = [];

                    foreach ($blocks as $block) {
                        $blockInfo = new Block();

                        $blockInfo->valid =             isset($block['valid'])?$block['valid']:false;
                        $blockInfo->number =            isset($block['number'])?$block['number']:-1;
                        $blockInfo->timeStart =         isset($block['timestart'])?$block['timestart']:-1;
                        $blockInfo->timeEnd =           isset($block['timeend'])?$block['timeend']:-1;
                        $blockInfo->timeTotal =         isset($block['timetotal'])?$block['timetotal']:-1;
                        $blockInfo->last20 =            isset($block['last20'])?$block['last20']:'';
                        $blockInfo->totalTransactions = isset($block['totaltransactions'])?$block['totaltransactions']:-1;
                        $blockInfo->difficulty =        isset($block['difficulty'])?$block['difficulty']:-1;
                        $blockInfo->target =            isset($block['target'])?$block['target']:'';
                        $blockInfo->solution =          isset($block['solution'])?$block['solution']:'';
                        $blockInfo->lastBlockHash =     isset($block['lastblockhash'])?$block['lastblockhash']:'';
                        $blockInfo->nextDifficulty =    isset($block['nextdifficult'])?$block['nextdifficult']:-1;
                        $blockInfo->miner =             isset($block['miner'])?$block['miner']:'';
                        $blockInfo->feesPaid =          isset($block['feespaid'])?$block['feespaid']:-1;
                        $blockInfo->reward =            isset($block['reward'])?$block['reward']:-1;
                        $blockInfo->hash =              isset($block['hash'])?$block['hash']:'';

                        $blocksInfo[] = $blockInfo;
                    }


                    return $blocksInfo;
                } else{
                    return null;
                }
            } else {
                return null;
            }
        } catch (\Exception $e){
            return null;
        }
    }

    public function getOrder(string $order){
        try {
            $response = $this->_fetch('getorderinfo', [$order], 1);
            //echo json_encode($response->getJson()) . "\n";
            if ($response->isOk()) {
                $order = $response->getJson();
                if (isset($order['result']) && count($order['result']) > 0) {
                    if ($order['result'][0]['valid']) {
                        $order = $order['result'][0]['order'];

                        $orderInfo = new Order();

                        $orderInfo->orderID =   isset($order['orderid'])?$order['orderid']:'';
                        $orderInfo->block =     isset($order['block'])?$order['block']:-1;
                        $orderInfo->type =      isset($order['type'])?$order['type']:'';
                        $orderInfo->transfers = isset($order['trfrs'])?$order['trfrs']:-1;
                        $orderInfo->timestamp = isset($order['timestamp'])?$order['timestamp']:'';
                        $orderInfo->reference = isset($order['reference'])?$order['reference']:'';
                        $orderInfo->receiver =  isset($order['receiver'])?$order['receiver']:'';
                        $orderInfo->fee =       isset($order['fee'])?$order['fee']:'';
                        $orderInfo->amount =    isset($order['amount'])?$order['amount']:'';

                        return $orderInfo;
                    } else {
                        return null;
                    }
                } else{
                    return null;
                }
            } else {
                return null;
            }
        } catch (\Exception $e){
            return null;
        }
    }

    public function getOrders(array $orders){
        try {
            $response = $this->_fetch('getorderinfo', $orders, 1);
            //echo json_encode($response->getJson()) . "\n";
            if ($response->isOk()) {
                $orders = $response->getJson();
                if (isset($orders['result']) && count($orders['result']) > 0) {
                    $ordersInfo = [];
                    foreach ($orders['result'] as $order) {
                        if ($order['valid']) {
                            $order = $order['order'];

                            $orderInfo = new Order();

                            $orderInfo->orderID =   isset($order['orderid'])?$order['orderid']:'';
                            $orderInfo->block =     isset($order['block'])?$order['block']:-1;
                            $orderInfo->type =      isset($order['type'])?$order['type']:'';
                            $orderInfo->transfers = isset($order['trfrs'])?$order['trfrs']:-1;
                            $orderInfo->timestamp = isset($order['timestamp'])?$order['timestamp']:'';
                            $orderInfo->reference = isset($order['reference'])?$order['reference']:'';
                            $orderInfo->receiver =  isset($order['receiver'])?$order['receiver']:'';
                            $orderInfo->fee =       isset($order['fee'])?$order['fee']:'';
                            $orderInfo->amount =    isset($order['amount'])?$order['amount']:'';

                            $ordersInfo[] = $orderInfo;
                        }
                    }
                    return $orderInfo;
                } else{
                    return null;
                }
            } else {
                return null;
            }
        } catch (\Exception $e){
            return null;
        }
    }

    public function getBlockOrders(int $block){
        try {
            $response = $this->_fetch('getblockorders', [$block], 1);
            echo json_encode($response->getJson()) . "\n";
            if ($response->isOk()) {
                $orders = $response->getJson();
                if (isset($orders['result']) && count($orders['result']) > 0) {
                    $orders = $orders['result'];

                    $ordersInfo = [];
                    foreach ($orders as $order) {
                        $orderInfo = new Order();

                        $orderInfo->valid =     isset($order['valid'])?$order['valid']:false;
                        $orderInfo->orderID =   isset($order['orderid'])?$order['orderid']:'';
                        $orderInfo->block =     isset($order['block'])?$order['block']:-1;
                        $orderInfo->timestamp = isset($order['timestamp'])?$order['timestamp']:'';
                        $orderInfo->reference = isset($order['reference'])?$order['reference']:'';
                        $orderInfo->receiver =  isset($order['receiver'])?$order['receiver']:'';
                        $orderInfo->amount =    isset($order['amount'])?$order['amount']:'';

                        $ordersInfo[] = $orderInfo;
                    }


                    return $ordersInfo;
                } else{
                    return null;
                }
            } else {
                return null;
            }
        } catch (\Exception $e){
            return null;
        }
    }

    public function getPendingOrders(){
        try {
            $response = $this->_fetch('getpendingorders', [$block], 1);
            echo json_encode($response->getJson()) . "\n";
            if ($response->isOk()) {
                $orders = $response->getJson();
                if (isset($orders['result']) && count($orders['result']) > 0) {
                    $orders = $orders['result'];

                    $ordersInfo = [];
                    foreach ($orders as $order) {
                        $orderInfo = new Order();

                        $orderInfo->valid =     isset($order['valid'])?$order['valid']:false;
                        $orderInfo->orderID =   isset($order['orderid'])?$order['orderid']:'';
                        $orderInfo->block =     isset($order['block'])?$order['block']:-1;
                        $orderInfo->timestamp = isset($order['timestamp'])?$order['timestamp']:'';
                        $orderInfo->reference = isset($order['reference'])?$order['reference']:'';
                        $orderInfo->receiver =  isset($order['receiver'])?$order['receiver']:'';
                        $orderInfo->amount =    isset($order['amount'])?$order['amount']:'';

                        $ordersInfo[] = $orderInfo;
                    }


                    return $ordersInfo;
                } else{
                    return null;
                }
            } else {
                return null;
            }
        } catch (\Exception $e){
            return null;
        }
    }

    public function getAddress(string $address){
        try {
            $response = $this->_fetch('getaddressbalance', [$address], 1);
            //echo json_encode($response->getJson()) . "\n";
            if ($response->isOk()) {
                $address = $response->getJson();
                if (isset($address['result']) && count($address['result']) > 0) {
                    $address = $address['result'][0];

                    $addressInfo = new Address();

                    $addressInfo->valid =    isset($address['valid'])?$address['valid']:'';
                    $addressInfo->address =  isset($address['address'])?$address['address']:'';
                    $addressInfo->alias =    isset($address['alias'])?$address['alias']:'';
                    $addressInfo->balance =  isset($address['balance'])?$address['balance']:-1;
                    $addressInfo->incoming = isset($address['incoming'])?$address['incoming']:-1;
                    $addressInfo->outgoing = isset($address['outgoing'])?$address['outgoing']:-1;

                    return $addressInfo;
                } else{
                    return null;
                }
            } else {
                return null;
            }
        } catch (\Exception $e){
            return null;
        }
    }

    public function getMainnet(){
        try {
            $response = $this->_fetch('getmainnetinfo', [], 1);
            //echo json_encode($response->getJson()) . "\n";
            if ($response->isOk()) {
                $mainnet = $response->getJson();
                if (isset($mainnet['result']) && count($mainnet['result']) > 0) {
                    $mainnet = $mainnet['result'][0];

                    $mainnetInfo = new Mainnet();

                    $mainnetInfo->lastBlock =     isset($mainnet['lastblock'])?$mainnet['lastblock']:'';
                    $mainnetInfo->lastBlockHash = isset($mainnet['lastblockhash'])?$mainnet['lastblockhash']:'';
                    $mainnetInfo->headersHash =   isset($mainnet['headershash'])?$mainnet['headershash']:'';
                    $mainnetInfo->summaryHash =   isset($mainnet['sumaryhash'])?$mainnet['sumaryhash']:'';

                    return $mainnetInfo;
                } else{
                    return null;
                }
            } else {
                return null;
            }
        } catch (\Exception $e){
            return null;
        }
    }
}
