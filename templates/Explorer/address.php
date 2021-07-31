<?php
    $this->assign('title', __('Address').' - ');
    $lang=$this->request->getParam('lang');
?>
        <main>
            <div class="container px-4 py-5">
                <h2 class="pb-2 border-bottom"><?= __('Address') ?></h2>
                <?php if ($address): ?>
                <dl>
                    <dt><?= __('Address') ?></dt>
                    <dd class="text-break"><?= h($address->address) ?></dd>
                    <?php if ($address->alias): ?>
                    <dt><?= __('Alias') ?></dt>
                    <dd class="text-break"><?= h($address->alias) ?></dd>
                    <?php endif; ?>
                    <dt><?= __('Incoming') ?></dt>
                    <dd class="text-break"><?= h($address->Incoming) ?></dd>
                    <dt><?= __('Outgoing') ?></dt>
                    <dd class="text-break"><?= h($address->Outgoing) ?></dd>
                    <dt><?= __('Balance') ?></dt>
                    <dd class="text-break"><?= h($address->Balance) ?></dd>
                </dl>
                <?php else: ?>
                <p><?= __('While using {0} an error occured.', [$host]) ?></p>
                <?php endif; ?>
            </div>
        </main>
