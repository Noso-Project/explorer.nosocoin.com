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
        $explorer = new Explorer($this->host, $this->port);
        $mainnet = $explorer->getMainnet();
        $blocks = [];

        for ($index=$mainnet->lastBlock;$index>$mainnet->lastBlock-10;$index--){
            $blocks[] = $index;
        }
        $blocksInfo = $explorer->getBlocks($blocks);

        $this->set(compact('mainnet', 'blocksInfo'));
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
}
