<?php

declare(strict_types = 1);

namespace Noso\Explorer;

class Address{
    public $valid;
    public $address;
    public $alias;
    public $balance;
    public $incoming;
    public $outgoing;

    private function Formatted(int $noso){
        if ($noso < 0) {
            return "Error: Negative number";
        }
        if ($noso == 0) {
            return '0.00000000';
        }
        if ($noso < 100000000) {
            return '0.' . sprintf('%08d', $noso);
        }
        return  number_format(floatval(substr(strval($noso), 0, strlen(strval($noso)) - 8))) .
            '.' .
            substr(strval($noso), -8);
    }

    public function __get($name) {
        switch ($name) {
            case 'Balance':
                return $this->Formatted($this->balance);
                break;
            case 'Incoming':
                return $this->Formatted($this->incoming);
                break;
            case 'Outgoing':
                return $this->Formatted($this->outgoing);
                break;
        }
    }
}
