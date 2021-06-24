<?php
    $this->assign('title', __('Home').' - ');
    $lang=$this->request->getParam('lang');
?>
        <main>
            <div class="container px-4 py-5">
                <?php if(isset($mainnet)): ?>
                <div class="row">
                    <div class="col">
                        <dl>
                            <dt><?= __('Last Block') ?></dt>
                            <dd><?= h($mainnet->lastBlock) ?></dd>
                        </dl>
                    </div>
                    <div class="col">
                        <dl>
                            <dt><?= __('Pending Orders') ?></dt>
                            <dd><?= h($mainnet->pending) ?></dd>
                        </dl>
                    </div>
                    <div class="col">
                        <dl>
                            <dt><?= __('Supply') ?></dt>
                            <dd><?= h($mainnet->Supply) ?></dd>
                        </dl>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <dl>
                            <dt><?= __('Last Block Hash') ?></dt>
                            <dd class="text-break"><?= h($mainnet->lastBlockHash) ?></dd>
                        </dl>
                    </div>
                    <div class="col">
                        <dl>
                            <dt><?= __('Headers Hash') ?></dt>
                            <dd class="text-break"><?= h($mainnet->headersHash) ?></dd>
                        </dl>
                    </div>
                    <div class="col">
                        <dl>
                            <dt><?= __('Summary Hash') ?></dt>
                            <dd class="text-break"><?= h($mainnet->summaryHash) ?></dd>
                        </dl>
                    </div>
                </div>
                <?php if (isset($blocksInfo) && count($blocksInfo)>0): ?>
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th><?= __('Number') ?></th>
                                <th><?= __('Time End') ?></th>
                                <th><?= __('Time Total') ?></th>
                                <th><?= __('Orders') ?></th>
                                <th><?= __('Difficulty') ?></th>
                                <th><?= __('Reward') ?></th>
                                <th><?= __('Fees') ?></th>
                                <th><?= __('Miner') ?></th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach($blocksInfo as $block): ?>
                            <tr>
                                <td><?= $this->Html->link(
                                    $block->number,
                                    [
                                        'controller'=>'Explorer',
                                        'action'=>'block',
                                        'lang'=>$lang,
                                        $block->number
                                    ]
                                ) ?></td>
                                <td><?= h($block->TimeEnd) ?></td>
                                <td><?= h($block->timeTotal) ?>s</td>
                                <td><?= ($block->totalTransactions > 0)?$this->Html->link(
                                    $block->totalTransactions,
                                    [
                                        'controller'=>'Explorer',
                                        'action'=>'blockorders',
                                        'lang'=>$lang,
                                        $block->number
                                    ]
                                ):h($block->totalTransactions) ?></td>
                                <td><?= h($block->difficulty) ?></td>
                                <td><?= h($block->Reward) ?></td>
                                <td><?= h($block->FeesPaid) ?></td>
                                <td><?= $this->Html->link(
                                    $block->miner,
                                    [
                                        'controller'=>'Explorer',
                                        'action'=>'address',
                                        'lang' => $lang,
                                        $block->miner
                                    ]
                                ) ?></td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                    <div class="paginator">
                        <ul class="pagination">
                            <?php if (isset($previous)): ?>
                            <li><a class="btn btn-primary" href="<?= $this->Url->build('/'.$lang.'/from') . "/{$previous}" ?>">&lt; <?= __('previous') ?></a></li>
                            <?php else: ?>
                            <li><a class="btn btn-danger disabled" role="button" aria-disabled="true" href="" onclick="return false;">&lt; <?= __('previous') ?></a></li>
                            <?php endif; ?>

                            <?php if(isset($next)): ?>
                            <li><a class="btn btn-primary" href="<?= $this->Url->build('/'.$lang.'/from') . "/{$next}" ?>"><?= __('next') ?> &gt;</a></li>
                            <?php else: ?>
                            <li><a class="btn btn-danger disabled" role="button" aria-disabled="true" href="" onclick="return false;"><?= __('next') ?> &gt;</a></li>
                            <?php endif; ?>
                        </ul>
                    </div>
                </div>
                <?php else: ?>
                <p><?= __('No blocks') ?></p>
                <?php endif; ?>
            </div>
                <?php else: ?>
                <p><?= __('Something went wrong') ?></p>
                <?php endif; ?>
        </main>
