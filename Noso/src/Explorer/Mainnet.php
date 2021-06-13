<?php

declare(strict_types = 1);

namespace Noso\Explorer;

class Mainnet{
    public $lastBlock;
    public $pending;
    public $supply;
    public $lastBlockHash;
    public $headersHash;
    public $summaryHash;

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
            case 'Supply':
                return $this->Formatted($this->supply);
                break;
        }
    }
}
