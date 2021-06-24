<?php
    $this->assign('title', __('Block').' - ');
    $lang=$this->request->getParam('lang');
?>
        <main>
            <div class="container px-4 py-5">
                <h2 class="pb-2 border-bottom"><?= __('Block') ?></h2>
                <?php if ($block): ?>
                <dl>
                    <dt><?= __('Number') ?></dt>
                    <dd class="text-break"><?= h($block->number) ?></dd>
                    <dt><?= __('Hash') ?></dt>
                    <dd class="text-break"><?= h($block->hash) ?></dd>
                    <dt><?= __('Time End') ?></dt>
                    <dd class="text-break"><?= h($block->timeEnd) ?></dd>
                    <dt><?= __('Time Start') ?></dt>
                    <dd class="text-break"><?= h($block->timeStart) ?></dd>
                    <dt><?= __('Time Total') ?></dt>
                    <dd class="text-break"><?= h($block->timeTotal) ?>s</dd>
                    <dt><?= __('Last 20') ?></dt>
                    <dd class="text-break"><?= h($block->last20) ?></dd>
                    <dt><?= __('Total Transactions') ?></dt>
                    <dd class="text-break"><?= ($block->totalTransactions > 0)?$this->Html->link(
                        $block->totalTransactions,
                        [
                            'controller'=>'Explorer',
                            'action'=>'blockorders',
                            'lang'=>$lang,
                            $block->number
                        ]
                    ):h($block->totalTransactions) ?></dd>
                    <dt><?= __('Difficulty') ?></dt>
                    <dd class="text-break"><?= h($block->difficulty) ?></dd>
                    <dt><?= __('Target') ?></dt>
                    <dd class="text-break"><?= h($block->target) ?></dd>
                    <dt><?= __('Solution') ?></dt>
                    <dd class="text-break"><?= h($block->solution) ?></dd>
                    <dt><?= __('Last Block Hash') ?></dt>
                    <dd class="text-break"><?= h($block->lastBlockHash) ?></dd>
                    <dt><?= __('Next Difficulty') ?></dt>
                    <dd class="text-break"><?= h($block->nextDifficulty) ?></dd>
                    <dt><?= __('Miner') ?></dt>
                    <dd class="text-break"><?= $this->Html->link(
                        $block->miner,
                        [
                            'controller'=>'Explorer',
                            'action'=>'address',
                            'lang'=>$lang,
                            $block->miner
                        ]
                    ) ?></dd>
                    <dt><?= __('Fees') ?></dt>
                    <dd class="text-break"><?= h($block->FeesPaid) ?></dd>
                    <dt><?= __('Reward') ?></dt>
                    <dd class="text-break"><?= h($block->Reward) ?></dd>
                </dl>
                <?php else: ?>
                <p><?= __('Something went wrong') ?></p>
                <?php endif; ?>
            </div>
            <div class="container"><?php debug($dbBlock) ?></div>
            <div class="container"><?php debug($block) ?></div>
        </main>
