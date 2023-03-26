<?php
    $this->assign('title', __('Block Orders').' - ');
?>
        <main>
            <div class="container px-4 py-5">
                <h2 class="pb-2 border-bottom"><?= __('Block Orders') ?></h2>
                <?php if (isset($orders)): ?>
                <p>Please set the header <em>Accept</em> to <code>application/json</code> or append <code>.json</code> to your URL.</p>
                <?php else: ?>
                <p><?= __('While using {0} an error occured.', [$host]) ?></p>
                <?php endif; ?>
            </div>
        </main>
