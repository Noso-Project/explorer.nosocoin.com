<?php

declare(strict_types = 1);

namespace Noso\Explorer;

class Block{
    public $valid;
    public $number;
    public $timeStart;
    public $timeEnd;
    public $timeTotal;
    public $last20;
    public $totalTransactions;
    public $difficulty;
    public $target;
    public $solution;
    public $lastBlockHash;
    public $nextDifficulty;
    public $miner;
    public $feesPaid;
    public $reward;
    public $hash;

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
            case 'FeesPaid':
                return $this->Formatted($this->feesPaid);
                break;
            case 'Reward':
                return $this->Formatted($this->reward);
                break;
            case 'TimeStart':
                return $this->FormattedDate($this->timeStart);
                break;
            case 'TimeEnd':
                return $this->FormattedDate($this->timeEnd);
                break;
        }
    }
}
