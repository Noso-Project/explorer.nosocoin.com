<?php

declare(strict_types = 1);

namespace Noso\Explorer;

class Order{
    public $orderID;
    public $block;
    public $pending;
    public $type;
    public $transfers;
    public $timestamp;
    public $reference;
    public $receiver;
    public $fee;
    public $amount;

    private function Formatted($noso){
        if ($noso == 0) {
            return '0.00000000';
        }
        if ($noso < 100000000) {
            return '0.' . sprintf('%08d', $noso);
        }
        return  substr(strval($noso), 0, strlen(strval($noso)) - 8) .
            '.' .
            substr(strval($noso), -8);
    }

    private function FormattedDate($timestamp) {
        return gmdate("Y-m-d H:i:s", $timestamp);
    }

    public function __get($name) {
        switch ($name) {
            case 'Fee':
                return $this->Formatted($this->fee);
                break;
            case 'Amount':
                return $this->Formatted($this->amount);
                break;
            case 'Timestamp':
                return $this->FormattedDate($this->timestamp);
                break;
        }
    }
}

