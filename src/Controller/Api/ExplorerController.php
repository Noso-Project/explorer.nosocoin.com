<?php
declare(strict_types=1);

namespace App\Controller\Api;

use App\Controller\AppController;
use App\Model\Entity\Block as BlockEntity;
use App\Model\Table\BlocksTable;
use Cake\Core\Configure;
use Noso\Explorer;
use Noso\Explorer\Block;

/**
 * Explorer Controller
 *
 * @method \App\Model\Entity\Explorer[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class ExplorerController extends AppController
{
    private $host = 'localhost';
    private $port = 8078;
    private BlocksTable $table;

    /**
     * Perform a copy from Block to Block Entity
     */
    private function _getFilledBlockEntity(Block $block): BlockEntity
    {
        $blockEntity =                     $this->table->newEmptyEntity();
        $blockEntity->number =             $block->number;
        $blockEntity->hash =               $block->hash;
        $blockEntity->time_end =           $block->timeEnd;
        $blockEntity->time_start =         $block->timeStart;
        $blockEntity->time_total =         $block->timeTotal;
        $blockEntity->last_20 =            $block->last20;
        $blockEntity->total_transactions = $block->totalTransactions;
        $blockEntity->difficulty =         $block->difficulty;
        $blockEntity->target =             $block->target;
        $blockEntity->solution =           $block->solution;
        $blockEntity->last_block_hash =    $block->lastBlockHash;
        $blockEntity->next_difficulty =    $block->nextDifficulty;
        $blockEntity->miner =              $block->miner;
        $blockEntity->fees_paid =          $block->feesPaid;
        $blockEntity->reward =             $block->reward;
        return $blockEntity;
    }

    /**
     * Perform a copy from Block Entity to Block
     */
    private function _getFilledBlock(BlockEntity $blockEntity): Block
    {
        $block = new Block();

        $block->number =               $blockEntity->number;
        $block->hash =                 $blockEntity->hash;
        $block->timeEnd =              $blockEntity->time_end;
        $block->timeStart =            $blockEntity->time_start;
        $block->timeTotal =            $blockEntity->time_total;
        $block->last20 =               $blockEntity->last_20;
        $block->totalTransactions =    $blockEntity->total_transactions;
        $block->difficulty =           $blockEntity->difficulty;
        $block->target =               $blockEntity->target;
        $block->solution =             $blockEntity->solution;
        $block->lastBlockHash =        $blockEntity->last_block_hash;
        $block->nextDifficulty =       $blockEntity->next_difficulty;
        $block->miner =                $blockEntity->miner;
        $block->feesPaid =             $blockEntity->fees_paid;
        $block->reward =               $blockEntity->reward;

        return $block;
    }

    /**
     * Initialization hook method.
     *
     * Use this method to add common initialization code.
     *
     * @return void
     */
    public function initialize(): void
    {
        parent::initialize();

        $this->host = Configure::read('RPC.host');
        $this->port = Configure::read('RPC.port');
        $this->table = new BlocksTable();
    }

    /**
     * Index mainnet
     *
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function mainnet()
    {
        $explorer = new Explorer($this->host, $this->port);
        $mainnet = $explorer->getMainnet();

        if (isset($mainnet)) {
            $code = 200;
            $message = 'Ok';
        } else {
            $code = 500;
            $message = 'Could not retrieve main net data';
            $mainnet = null;
        }

        if($code == 200) {
            $this->set(compact('code', 'message', 'mainnet'));
            $this->viewBuilder()->setOption('serialize', ['code', 'message', 'mainnet']);
        } else {
            $this->set(compact('code', 'message'));
            $this->viewBuilder()->setOption('serialize', ['code', 'message']);
        }
    }

    /**
     * Block method
     *
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function block($blockNumber = null)
    {
        if (isset($blockNumber)) {
            if (is_numeric($blockNumber) and intval($blockNumber >= 0)) {
                $query = $this->table->find(
                    'all',
                    [
                        'conditions'=>['number'=>intval($blockNumber)]
                    ]
                );
                $dbBlock = null; //$query->first();

                if (is_null($dbBlock)) {
                    $explorer = new Explorer($this->host, $this->port);

                    $block = $explorer->getBlock(intval($blockNumber));

                    if (isset($block) && isset($block->valid) && $block->valid) {
                        $code = 200;
                        $message = 'Ok';
                        unset($block->valid);

                        $dbBlock = $this->_getFilledBlockEntity($block);

                        //if (!$this->table->save($dbBlock)) {
                        //    $code = 500;
                        //    $message = 'Error while saving block to database';
                        //    $block = null;
                        //    $this->Flash->error(__('Error while saving block to database'));
                        //}
                    } else {
                        $code = 404;
                        $message = __('Need to provide a valid block');
                        $block = null;
                        $this->Flash->error(__('Need to provide a valid block'));
                    }
                } else {
                    $code = 200;
                    $message = 'Ok';
                    $block = $this->_getFilledBlock($dbBlock);
                    unset($block->valid);
                }
            } else {
                $code = 404;
                $message = __('Need to provide a valid block');
                $block = null;
                $this->Flash->error(__('Need to provide a valid block'));
            }
        } else {
            $code = 400;
            $message = __('Need to provide a block');
            $block = null;
            $this->Flash->error(__('Need to provide a block number'));
        }

        if ($code == 200) {
            $this->set(compact('code', 'message', 'block'));
            $this->viewBuilder()->setOption('serialize', ['code', 'message', 'block']);
        } else {
            $this->set(compact('code', 'message'));
            $this->viewBuilder()->setOption('serialize', ['code', 'message']);
        }
    }

    /**
     * Address method
     *
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function address($address = null)
    {
        $explorer = new Explorer($this->host, $this->port);

        if (isset($address)) {
            $address = $explorer->getAddress($address);
            if (isset($address) && isset($address->valid) && $address->valid) {
                $code = 200;
                $message = 'Ok';
                unset($address->valid);
            } else {
                $code = 404;
                $message = __('Need to provide a valid address');
                $address = null;
                $this->Flash->error(__('Need to provide a valid address'));
            }
        } else {
            $code = 400;
            $message = __('Need to provide an address');
            $address = null;
            $this->Flash->error(__('Need to provide an address'));
        }

        if ($code == 200) {
            $this->set(compact('code', 'message', 'address'));
            $this->viewBuilder()->setOption('serialize', ['code', 'message', 'address']);
        } else {
            $this->set(compact('code', 'message'));
            $this->viewBuilder()->setOption('serialize', ['code', 'message']);
        }
    }

    /**
     * Order method
     *
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function order($order = null)
    {
        $explorer = new Explorer($this->host, $this->port);

        if (isset($order)) {
            $order = $explorer->getOrder($order);
            if (isset($order)) {
                $code = 200;
                $message = 'Ok';
            } else {
                $code = 404;
                $message = __('Need to provide a valid order');
                $order = null;
                $this->Flash->error(__('Need to provide a valid order'));
            }
        } else {
            $code = 400;
            $message = __('Need to provide an order');
            $order = null;
            $this->Flash->error(__('Need to provide an order'));
        }

        if($code == 200) {
            $this->set(compact('code', 'message', 'order'));
            $this->viewBuilder()->setOption('serialize', ['code', 'message', 'order']);
        } else {
            $this->set(compact('code', 'message'));
            $this->viewBuilder()->setOption('serialize', ['code', 'message']);
        }
    }

    /**
     * Block Orders method
     *
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function blockorders($blockNumber = null)
    {
        $explorer = new Explorer($this->host, $this->port);

        if (isset($blockNumber)) {
            if (is_numeric($blockNumber) and intval($blockNumber >= 0)) {
                $orders = $explorer->getBlockOrders(intval($blockNumber));

                if (isset($orders)) {
                    $code = 200;
                    $message = 'Ok';
                    $block = intval($blockNumber);
                } else {
                    $code = 404;
                    $message = __('Need to provide a valid block');
                    $block = null;
                    $orders = null;
                    $this->Flash->error(__('Need to provide a valid block'));
                }
            } else {
                $code = 404;
                $message = __('Need to provide a valid block');
                $block = null;
                $orders = null;
                $this->Flash->error(__('Need to provide a valid block'));
            }
        } else {
            $code = 400;
            $message = __('Need to provide a block');
            $block = null;
            $orders = null;
            $this->Flash->error(__('Need to provide a block'));
        }

        if ($code == 200) {
            $this->set(compact('code', 'message', 'blockNumber', 'orders'));
            $this->viewBuilder()->setOption('serialize', ['code', 'message', 'blockNumber', 'orders']);
        } else {
            $this->set(compact('code', 'message'));
            $this->viewBuilder()->setOption('serialize', ['code', 'message']);
        }
    }
}
