<?php
declare(strict_types=1);

namespace App\Controller;

use Noso\Explorer;

/**
 * Explorer Controller
 *
 * @method \App\Model\Entity\Explorer[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class ExplorerController extends AppController
{
    private $host = '192.210.226.118';
    private $port = 8078;

    /**
     * Index method
     *
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function index()
    {
        $from = $this->request->getParam('id');

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

        $this->set(compact('mainnet', 'blocksInfo', 'previous', 'next', 'blocks'));
    }

    /**
     * Block method
     *
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function block($blockNumber = null)
    {
        $explorer = new Explorer($this->host, $this->port);

        if (isset($blockNumber)) {
            $block = $explorer->getBlock(intval($blockNumber));
            if (isset($block) && isset($block->valid) && $block->valid) {
                // Do nothing
                // The logic negative of then above conditional is ugly
            } else {
                $block = null;
                $this->Flash->error(__('Need to provide a valid block'));
            }
        } else {
            $block = null;
            $this->Flash->error(__('Need to provide a block number'));
        }

        $this->set(compact('block'));
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
                // Do nothing
                // The logic negative of then above conditional is ugly
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
                // The logic negative of then above conditional is ugly
            } else {
                //$order = null;
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
    public function blockorders($block = null)
    {
        $explorer = new Explorer($this->host, $this->port);

        if (isset($block)) {
            $orders = $explorer->getBlockOrders(intval($block));

            if (isset($orders)) {
                // Do nothing
                // The logic negative of then above conditional is ugly
            } else {
                //$order = null;
                $this->Flash->error(__('Need to provide a valid block'));
            }
        } else {
            $orders = null;
            $this->Flash->error(__('Need to provide an block'));
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
                $this->redirect(['action'=>'block', $query]);

            } elseif (substr($query, 0, 1) == 'N') {

                $this->redirect(['action'=>'address', $query]);

            } elseif (substr($query, 0, 2) == 'OR') {

                $this->redirect(['action'=>'order', $query]);

            } else {

                $this->redirect(['action'=>'address', $query]);

            }
        } else {
            $this->Flash->error(__('Need to provide a query'));
            $this->redirect(['action'=>'index']);
        }
    }
}
