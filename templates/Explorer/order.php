<?php
    $this->assign('title', __('Order').' - ');
    $lang=$this->request->getParam('lang');
?>
        <main>
            <div class="container px-4 py-5">
                <h2 class="pb-2 border-bottom"><?= __('Order') ?></h2>
                <?php if ($order): ?>
                <dl>
                    <dt><?= __('Order') ?></dt>
                    <dd class="text-break"><?= h($order->orderID) ?></dd>
                    <dt><?= __('Block') ?></dt>
                    <dd class="text-break"><?= ($order->pending)?__('Pending'):$this->Html->link(
                        ($order->block),
                        [
                            'controller'=>'Explorer',
                            'action'=>'block',
                            'lang'=>$lang,
                            ($order->block)
                        ]
                    ) ?></dd>
                    <dt><?= __('Type') ?></dt>
                    <dd class="text-break"><?= h($order->type) ?></dd>
                    <dt><?= __('Transfers') ?></dt>
                    <dd class="text-break"><?= h($order->transfers) ?></dd>
                    <dt><?= __('Timestamp') ?></dt>
                    <dd class="text-break"><?= h($order->Timestamp) ?></dd>
                    <dt><?= __('Reference') ?></dt>
                    <dd class="text-break"><?= h($order->reference) ?></dd>
                    <dt><?= __('Receiver') ?></dt>
                    <dd class="text-break"><?= $this->Html->link(
                        $order->receiver,
                        ['controller'=>'Explorer','action'=>'address','lang'=>$lang,$order->receiver]
                    ) ?></dd>
                    <dt><?= __('Fee') ?></dt>
                    <dd class="text-break"><?= h($order->Fee) ?></dd>
                    <dt><?= __('Amount') ?></dt>
                    <dd class="text-break"><?= h($order->Amount) ?></dd>
                </dl>
                <?php else: ?>
                <p><?= __('Something went wrong') ?></p>
                <?php endif; ?>
            </div>
        </main>
