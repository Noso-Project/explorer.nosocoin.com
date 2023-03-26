<?php
declare(strict_types=1);

use Migrations\AbstractMigration;

class CreateTableBlocks extends AbstractMigration
{
    /**
     * Change Method.
     *
     * More information on this method is available here:
     * https://book.cakephp.org/phinx/0/en/migrations.html#the-change-method
     * @return void
     */
    public function change()
    {
        $blocks = $this->table('blocks');
        $blocks
            ->addColumn('number', 'biginteger', [
                'default' => null,
                'null' => false
            ])
            ->addIndex('number')
            ->addColumn('hash', 'string', [
                'default' => null,
                'limit' => 255,
                'null' => false
            ])
            ->addIndex('hash')
            ->addColumn('time_end', 'biginteger', [
                'default' => null,
                'null' => false
            ])
            ->addColumn('time_start', 'biginteger', [
                'default' => null,
                'null' => false
            ])
            ->addColumn('time_total', 'integer', [
                'default' => null,
                'null' => false
            ])
            ->addColumn('last_20', 'integer', [
                'default' => null,
                'null' => false
            ])
            ->addColumn('total_transactions', 'integer', [
                'default' => null,
                'null' => false
            ])
            ->addColumn('difficulty', 'integer', [
                'default' => null,
                'null' => false
            ])
            ->addColumn('target', 'string', [
                'default' => null,
                'limit' => 255,
                'null' => false
            ])
            ->addColumn('solution', 'string', [
                'default' => null,
                'limit' => 1024,
                'null' => false
            ])
            ->addColumn('last_block_hash', 'string', [
                'default' => null,
                'limit' => 255,
                'null' => false
            ])
            ->addColumn('next_difficulty', 'integer', [
                'default' => null,
                'null' => false
            ])
            ->addColumn('miner', 'string', [
                'default' => null,
                'limit' => 255,
                'null' => false
            ])
            ->addColumn('fees_paid', 'biginteger', [
                'default' => null,
                'null' => false
            ])
            ->addColumn('reward', 'biginteger', [
                'default' => null,
                'null' => false
            ])
            ->addColumn('created', 'datetime', [
                'default' => 'CURRENT_TIMESTAMP'
            ])
            ->addColumn('modified', 'datetime',[
                'default' => 'CURRENT_TIMESTAMP',
                'update' => 'CURRENT_TIMESTAMP()'
            ])
            ->create();
    }
}
