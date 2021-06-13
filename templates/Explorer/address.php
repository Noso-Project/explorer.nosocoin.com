<?php
    $this->assign('title', __('Address').' - ');
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
                <p><?= __('Something went wrong') ?></p>
                <?php endif; ?>
            </div>
        </main>
