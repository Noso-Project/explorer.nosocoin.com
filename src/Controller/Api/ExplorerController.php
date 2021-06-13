<?php
declare(strict_types=1);

namespace App\Controller\Api;

use App\Controller\AppController;
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
     * Index lastblock
     *
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function lastblock()
    {
        $explorer = new Explorer($this->host, $this->port);
        $mainnet = $explorer->getMainnet();

        if (isset($mainnet)) {
            $code = 200;
            $message = 'Ok';
            $lastblock = $mainnet->lastBlock;
        } else {
            $code = 500;
            $message = 'Could not retrieve main net data';
            $lastblock = null;
        }

        $this->set(compact('code', 'message', 'lastblock'));
        $this->viewBuilder()->setOption('serialize', ['code', 'message', 'lastblock']);
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
                $code = 200;
                $message = 'Ok';
                unset($block->valid);
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

        $this->set(compact('code', 'message', 'block'));
        $this->viewBuilder()->setOption('serialize', ['code', 'message', 'block']);
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
            $message = __('Need to provide a address');
            $address = null;
            $this->Flash->error(__('Need to provide an address'));
        }

        $this->set(compact('code', 'message', 'address'));
        $this->viewBuilder()->setOption('serialize', ['code', 'message', 'address']);
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
            $message = __('Need to provide a order');
            $order = null;
            $this->Flash->error(__('Need to provide an order'));
        }

        $this->set(compact('code', 'message', 'order'));
        $this->viewBuilder()->setOption('serialize', ['code', 'message', 'order']);
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
                $code = 200;
                $message = 'Ok';
                $block = intval($block);
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

        $this->set(compact('code', 'message', 'block', 'orders'));
        $this->viewBuilder()->setOption('serialize', ['code', 'message', 'block', 'orders']);
    }
}
