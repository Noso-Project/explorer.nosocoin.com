<?php
declare(strict_types=1);

namespace App\Controller;

use App\Model\Entity\Block as BlockEntity;
use App\Model\Table\BlocksTable;
use Cake\Core\Configure;
use Cake\I18n\I18n;
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
    private $lang = 'en';
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

        $lang = $this->request->getParam('lang');
        if (isset($lang)) {
            $this->lang = $lang;
            I18n::setLocale($lang);
        }
    }

    /**
     * Redirect method
     *
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function toen()
    {
        return $this->redirect(['controller'=>'Explorer', 'action'=>'index', 'lang'=>'en'], 301);
    }

    /**
     * Index method
     *
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function index($from = null)
    {

        $explorer = new Explorer($this->host, $this->port);
        $mainnet = $explorer->getMainnet();

        if (isset($mainnet)) {
            if (isset($from)) {
                if ($from>=0 && $from<=$mainnet->lastBlock) {
                    if (($from-10) < 0) {
                        $previous = null;
                    } else {
                        $previous = $from - 10;
                    }
                    if (($from+10) > $mainnet->lastBlock) {
                        $next = null;
                    } else {
                        $next = $from + 10;
                    }
                } else {
                    $from = $mainnet->lastBlock;
                    $previous = $from - 10;
                    $next = null;
                }
            } else {
                $from = $mainnet->lastBlock;
                $previous = $from - 10;
                $next = null;
            }

            $blocks = [];
            for ($index=$from;$index>$from-10;$index--){
                if ($index >= 0) {
                    $blocks[] = $index;
                }
            }
            $blocksInfo = $explorer->getBlocks($blocks);

        } else {
            $blocksInfo = null;
            $previous = null;
            $next = null;
        }

        $this->set(compact('mainnet', 'blocksInfo', 'previous', 'next'));
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
                $dbBlock = null;//$query->first();

                if (is_null($dbBlock)) {
                    $explorer = new Explorer($this->host, $this->port);

                    $block = $explorer->getBlock(intval($blockNumber));

                    if (isset($block) && isset($block->valid) && $block->valid) {
                        unset($block->valid);

                        $dbBlock = $this->_getFilledBlockEntity($block);

                        //if (!$this->table->save($dbBlock)) {
                        //    $this->Flash->error(__('Error while saving block to database'));
                        //}
                    } else {
                        $block = null;
                        $this->Flash->error(__('Need to provide a valid block'));
                    }
                } else {
                    $block = $this->_getFilledBlock($dbBlock);
                }
            } else {
                $block = null;
                $this->Flash->error(__('Need to provide a valid block'));
            }
        } else {
            $block = null;
            $this->Flash->error(__('Need to provide a block number'));
        }

        $this->set(compact('dbBlock', 'block'));
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
                unset($address->valid);
            } else {
                $address = null;
                $this->Flash->error(__('Need to provide a valid address'));
            }
        } else {
            $address = null;
            $this->Flash->error(__('Need to provide an address'));
        }

        $this->set(compact('address'));
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
                // Do nothing
                // The logic negative of the above conditional is ugly
            } else {
                $order = null;
                $this->Flash->error(__('Need to provide a valid order'));
            }
        } else {
            $order = null;
            $this->Flash->error(__('Need to provide an order'));
        }

        $this->set(compact('order'));
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
                    // Do nothing
                    // The logic negative of the above conditional is ugly
                } else {
                    $orders = null;
                    $this->Flash->error(__('Need to provide a valid block'));
                }
            } else {
                $orders = null;
                $this->Flash->error(__('Need to provide a valid block'));
            }
        } else {
            $orders = null;
            $this->Flash->error(__('Need to provide a block'));
        }

        $this->set(compact('orders'));
    }

    /**
     * Block Orders method
     *
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function search($query = null)
    {
        if (isset($query)) {
            if (is_numeric($query)) {

                $query = intval($query);
                return $this->redirect(['action'=>'block', 'lang'=>$this->lang, $query]);

            } elseif (substr($query, 0, 1) == 'N') {

                return $this->redirect(['action'=>'address', 'lang'=>$this->lang, $query]);

            } elseif (substr($query, 0, 2) == 'OR') {

                return $this->redirect(['action'=>'order', 'lang'=>$this->lang, $query]);

            } else {

                return $this->redirect(['action'=>'address', 'lang'=>$this->lang, $query]);

            }
        } else {
            $this->Flash->error(__('Need to provide a query'));
            return $this->redirect(['action'=>'index', 'lang'=>$this->lang]);
        }
    }
}
