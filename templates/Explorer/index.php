<?php
    $this->assign('title', __('Explorer').' - ');
?>
        <main>
            <div class="container px-4 py-5">
                <?php if(isset($mainnet)): ?>
                <dl>
                    <dt><?= __('Last Block') ?></dt>
                    <dd><?= $mainnet->lastBlock ?></dd>
                    <dt><?= __('Last Block Hash') ?></dt>
                    <dd><?= $mainnet->lastBlockHash ?></dd>
                    <dt><?= __('Headers Hash') ?></dt>
                    <dd><?= $mainnet->headersHash ?></dd>
                    <dt><?= __('Summary Hash') ?></dt>
                    <dd><?= $mainnet->summaryHash ?></dd>
                </dl>
                <?php if (isset($blocksInfo) && count($blocksInfo)>0): ?>
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <td><?= __('Number') ?></td>
                                <td><?= __('Time End') ?></td>
                                <td><?= __('Time Total') ?></td>
                                <td><?= __('Orders') ?></td>
                                <td><?= __('Difficulty') ?></td>
                                <td><?= __('Reward') ?></td>
                                <td><?= __('Fees') ?></td>
                                <td><?= __('Miner') ?></td>
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
                                        $block->number
                                    ]
                                ) ?></td>
                                <td><?= $block->TimeEnd ?></td>
                                <td><?= $block->timeTotal ?>s</td>
                                <td><?= $this->Html->link(
                                    $block->totalTransactions,
                                    [
                                        'controller'=>'Explorer',
                                        'action'=>'blockorders',
                                        $block->number
                                    ]
                                ) ?></td>
                                <td><?= $block->difficulty ?></td>
                                <td><?= $block->Reward ?></td>
                                <td><?= $block->FeesPaid ?></td>
                                <td><?= $this->Html->link(
                                    $block->miner,
                                    [
                                        'controller'=>'Explorer',
                                        'action'=>'address',
                                        $block->miner
                                    ]
                                ) ?></td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                    <div class="paginator">
                        <ul class="pagination">
                            <?php if ($previous): ?>
                            <li><a class="btn btn-primary" href="<?= $this->Url->build('/from') . "/{$previous}" ?>">&lt; previous</a></li>
                            <?php else: ?>
                            <li><a class="btn btn-danger disabled" role="button" aria-disabled="true" href="" onclick="return false;">&lt; previous</a></li>
                            <?php endif; ?>

                            <?php if($next): ?>
                            <li><a class="btn btn-primary" href="<?= $this->Url->build('/from') . "/{$next}" ?>">next &gt;</a></li>
                            <?php else: ?>
                            <li><a class="btn btn-danger disabled" role="button" aria-disabled="true" href="" onclick="return false;">next &gt;</a></li>
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
