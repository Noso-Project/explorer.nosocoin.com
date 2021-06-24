<?php
declare(strict_types=1);

namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * Block Entity
 *
 * @property int $id
 * @property int $number
 * @property string $hash
 * @property int $time_end
 * @property int $time_start
 * @property int $time_total
 * @property int $last_20
 * @property int $total_transactions
 * @property int $difficulty
 * @property string $target
 * @property string $solution
 * @property string $last_block_hash
 * @property int $next_difficulty
 * @property string $miner
 * @property int $fees_paid
 * @property int $reward
 * @property \Cake\I18n\FrozenTime $created
 * @property \Cake\I18n\FrozenTime $modified
 */
class Block extends Entity
{
    /**
     * Fields that can be mass assigned using newEntity() or patchEntity().
     *
     * Note that when '*' is set to true, this allows all unspecified fields to
     * be mass assigned. For security purposes, it is advised to set '*' to false
     * (or remove it), and explicitly make individual fields accessible as needed.
     *
     * @var array
     */
    protected $_accessible = [
        'number' => true,
        'hash' => true,
        'time_end' => true,
        'time_start' => true,
        'time_total' => true,
        'last_20' => true,
        'total_transactions' => true,
        'difficulty' => true,
        'target' => true,
        'solution' => true,
        'last_block_hash' => true,
        'next_difficulty' => true,
        'miner' => true,
        'fees_paid' => true,
        'reward' => true,
        'created' => true,
        'modified' => true,
    ];
}
