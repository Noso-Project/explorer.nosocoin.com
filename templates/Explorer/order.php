<?php
    $this->assign('title', __('Order').' - ');
?>
        <main>
            <div class="container px-4 py-5">
                <h2 class="pb-2 border-bottom"><?= __('Order') ?></h2>
                <?php if ($order): ?>
                <dl>
                    <dt><?= __('Order') ?></dt>
                    <dd class="text-break"><?= $order->orderID ?></dd>
                    <dt><?= __('Block') ?></dt>
                    <dd class="text-break"><?= ($order->pending)?__('Pending'):$order->block ?></dd>
                    <dt><?= __('Type') ?></dt>
                    <dd class="text-break"><?= $order->type ?></dd>
                    <dt><?= __('Transfers') ?></dt>
                    <dd class="text-break"><?= $order->transfers ?></dd>
                    <dt><?= __('Timestamp') ?></dt>
                    <dd class="text-break"><?= $order->Timestamp ?></dd>
                    <dt><?= __('Reference') ?></dt>
                    <dd class="text-break"><?= $order->reference ?></dd>
                    <dt><?= __('Receiver') ?></dt>
                    <dd class="text-break"><?= $this->Html->link(
                        $order->receiver,
                        ['controller'=>'Explorer','action'=>'address',$order->receiver]
                    ) ?></dd>
                    <dt><?= __('Fee') ?></dt>
                    <dd class="text-break"><?= $order->Fee ?></dd>
                    <dt><?= __('Amount') ?></dt>
                    <dd class="text-break"><?= $order->Amount ?></dd>
                </dl>
                <?php else: ?>
                <p><?= __('Something went wrong') ?></p>
                <?php endif; ?>
            </div>
        </main>
