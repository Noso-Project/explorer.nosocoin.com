<?php
use Cake\Core\Configure;

    $https = $this->request->getEnv('HTTPS');
    $protocol = $https == 'on' ? 'https' : 'http';
    $domain = $this->request->getEnv('HTTP_HOST');
    $path = $this->request->getPath();

    $controller = $this->request->getParam('controller');
    $action = $this->request->getParam('action');
    $lang = $this->request->getParam('lang');
    $pass = isset($this->request->getParam('pass')[0])?$this->request->getParam('pass')[0]:null;
    $page = '';
    if ($controller == 'Pages' && $action == 'display') {
        $page = $this->request->getParam('pass')[0];
    }
    $prefix = $this->request->getParam('prefix');

    $g_analytics = Configure::read('Google.analytics');

    $chinese = Configure::read('China.serial');

?><!DOCTYPE html>
<html lang="en">
    <head>
        <!-- <?= $host ?> -->
        <?= $this->Html->charset() ?>

        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title><?= $this->fetch('title') . __('NosoCoin Blockchain Explorer') ?></title>

        <link rel="canonical" href="<?= $protocol ?>://<?= $domain ?><?= $path ?>">

        <?= $this->Html->meta('icon', 'favicon.png') ?>


<?php if (Configure::read('Ads.show')): ?>
        <meta name="propeller" content="e4172e067d4634521a0aadbd3cdc6510">
<?php endif; ?>

        <?= $this->fetch('meta') ?>

        <?= $this->Html->meta('keywords', '​Noso, Coin, Project, PoW, ProofOfWork, CPU, Mining, new, latest, scratch, blockchain, technology, blockexplorer, exchange') ?>

        <?= $this->Html->meta('description', 'On this site you can explore the contents of the Nosocoin blockchain.') ?>

        <meta property="og:title" content="NosoCoin Blockchain Explorer">
        <meta property="og:type" content="website">
        <meta property="og:description" content="On this site you can explore the contents of the Nosocoin blockchain.">
        <!--
        <meta property="og:url" content="/">
        -->

        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">


        <?php if ($prefix == 'Api' && $page == 'home'): ?>

        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.0.1/styles/default.min.css">

        <?php endif; ?>

        <?= $this->Html->css('explorer-nosocoin') ?>

        <?= $this->fetch('css') ?>

        <?php if ($prefix == 'Api' && $page == 'home'): ?>

        <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.0.1/highlight.min.js"></script>
        <style>
            pre code {
                border-left: 2px solid #f28d1a;
            }
        </style>

        <?php endif; ?>

        <?php if (!empty($g_analytics)): ?>
        <!-- Global site tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=<?= $g_analytics ?>"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '<?= $g_analytics ?>');
        </script>
        <?php endif; ?>

        <script type="application/ld+json">{
            "@context": "http://schema.org",
            "@type": "Organization",
            "name": "nosocoin",
            "url": "/",
            "logo": "img/N3256x256.png"
        }</script>

        <script>
            // Search function
            function doSearch(){
                let query = document.getElementById('query').value;
                if (query.length > 0) {
                    window.location.href = '<?= $this->Url->build("/{$lang}/search") ?>/'+query;
                }
                return false;
            }

<?php if ($prefix == 'Api' && $page == 'home'): ?>
            // Syntax highlighting
            hljs.highlightAll();
<?php endif; ?>

        </script>

        <?= $this->fetch('script') ?>

    </head>
<!--
    Translation Team:
        Chinese: YZ
        French: Fury
        German: Fechi92, Grumpi
        Romanian: niko666
        Vietnamese: f04ever
        Spanish: NosoDevTeam
        Greek: Siou
        Danish: nightraven
        Indonesian: Tuns
        Hungarian: Hohokam621
        Hindi(India): vishnoor
        Italian: EminDemiri
        Turkish: onur2x
        Ukrainian: WELS
        Portuguese: Gustavo 'Gus' Carreno
-->
    <body class="d-flex flex-column">

<?php if (Configure::read('Ads.show')): ?>
        <script src="//oackoubs.com/4/4803412" type="text/javascript" />
<?php endif; ?>

        <header class="p-3 bg-dark text-white">
            <div class="container">
                <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                    <?= $this->Html->link(
                        $this->Html->image(
                            'N3256x256.png',
                            ['class'=>'bi me-2', 'width'=>'40', 'height'=>'40', 'alt'=>'NosoCoin']
                        ),
                        ['controller'=>'Explorer', 'action'=>'index', 'lang'=>$this->request->getParam('lang'), 'prefix'=>false],
                        ['class'=>'d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none', 'escape'=>false]
                    ) ?>

                    <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                        <li class="nav-item"><?php
                            $css_class = ($controller == 'Explorer' && $action == 'index')?'text-warning':'text-white';
                            echo $this->Html->link(
                                __('Home'),
                                ['controller'=>'Explorer', 'action'=>'index', 'lang'=>$this->request->getParam('lang'), 'prefix'=>false],
                                ['class'=>'nav-link px-2 '. $css_class]
                            ) ?></li>
                        <li class="nav-item"><?php
                            $css_class = ($page == 'home' || ($controller=='Explorer' && $prefix=='Api' ))?'text-warning':'text-white';
                            echo $this->Html->link(
                                __('API'),
                                ['controller'=>'Pages', 'action'=>'display', 'prefix'=>'Api', 'home'],
                                ['class'=>'nav-link px-2 '. $css_class]
                            ) ?></li>
                    </ul>

                    <form class="col-5 mb-3 mb-lg-0 me-lg-3" onsubmit="return doSearch()">
                        <input id="query" name="query" type="search" class="form-control form-control-dark" placeholder="<?= __('Block') ?>,<?= __('Order') ?>,<?= __('Address') ?>,<?= __('Alias') ?>" aria-label="Search">
                    </form>

                    <div class="text-end">
                        <a href="https://nosocoin.com" class="text-white px-1" target="_blank"><svg class="svg-icon" viewBox="0 0 496 512">
                            <path fill="currentColor" d="M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-96c-28.6-67.9-86.5-120.4-158-141.6 24.4 33.8 41.2 84.7 50 141.6h108zM177.2 18.4C105.8 39.6 47.8 92.1 19.3 160h108c8.7-56.9 25.5-107.8 49.9-141.6zM487.4 192H372.7c2.1 21 3.3 42.5 3.3 64s-1.2 43-3.3 64h114.6c5.5-20.5 8.6-41.8 8.6-64s-3.1-43.5-8.5-64zM120 256c0-21.5 1.2-43 3.3-64H8.6C3.2 212.5 0 233.8 0 256s3.2 43.5 8.6 64h114.6c-2-21-3.2-42.5-3.2-64zm39.5 96c14.5 89.3 48.7 152 88.5 152s74-62.7 88.5-152h-177zm159.3 141.6c71.4-21.2 129.4-73.7 158-141.6h-108c-8.8 56.9-25.6 107.8-50 141.6zM19.3 352c28.6 67.9 86.5 120.4 158 141.6-24.4-33.8-41.2-84.7-50-141.6h-108z"></path>
                        </svg></a>
                        <a href="https://twitter.com/NosoProject" class="text-white px-1" target="_blank"><svg class="svg-icon" viewBox="0 0 496 512">
                            <path fill="currentColor" d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path>
                        </svg></a>
                        <a href="https://discord.gg/96P9wtmYzp" class="text-white px-1" target="_blank"><svg class="svg-icon" viewBox="0 0 496 512">
                            <path fill="currentColor" d="M297.216 243.2c0 15.616-11.52 28.416-26.112 28.416-14.336 0-26.112-12.8-26.112-28.416s11.52-28.416 26.112-28.416c14.592 0 26.112 12.8 26.112 28.416zm-119.552-28.416c-14.592 0-26.112 12.8-26.112 28.416s11.776 28.416 26.112 28.416c14.592 0 26.112-12.8 26.112-28.416.256-15.616-11.52-28.416-26.112-28.416zM448 52.736V512c-64.494-56.994-43.868-38.128-118.784-107.776l13.568 47.36H52.48C23.552 451.584 0 428.032 0 398.848V52.736C0 23.552 23.552 0 52.48 0h343.04C424.448 0 448 23.552 448 52.736zm-72.96 242.688c0-82.432-36.864-149.248-36.864-149.248-36.864-27.648-71.936-26.88-71.936-26.88l-3.584 4.096c43.52 13.312 63.744 32.512 63.744 32.512-60.811-33.329-132.244-33.335-191.232-7.424-9.472 4.352-15.104 7.424-15.104 7.424s21.248-20.224 67.328-33.536l-2.56-3.072s-35.072-.768-71.936 26.88c0 0-36.864 66.816-36.864 149.248 0 0 21.504 37.12 78.08 38.912 0 0 9.472-11.52 17.152-21.248-32.512-9.728-44.8-30.208-44.8-30.208 3.766 2.636 9.976 6.053 10.496 6.4 43.21 24.198 104.588 32.126 159.744 8.96 8.96-3.328 18.944-8.192 29.44-15.104 0 0-12.8 20.992-46.336 30.464 7.68 9.728 16.896 20.736 16.896 20.736 56.576-1.792 78.336-38.912 78.336-38.912z"></path>
                        </svg></a>
                        <a href="https://t.me/nosocoin" class="text-white px-1" target="_blank"><svg class="svg-icon" viewBox="0 0 496 512">
                            <path fill="currentColor" d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.7 10.1l7.4-104.9 190.9-172.5c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z"></path>
                        </svg></a>
                        <a href="https://bitcointalk.org/index.php?topic=5305226.0" class="text-white px-1" target="_blank"><svg class="svg-icon" viewBox="0 0 496 512">
                            <path fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zm-141.651-35.33c4.937-32.999-20.191-50.739-54.55-62.573l11.146-44.702-27.213-6.781-10.851 43.524c-7.154-1.783-14.502-3.464-21.803-5.13l10.929-43.81-27.198-6.781-11.153 44.686c-5.922-1.349-11.735-2.682-17.377-4.084l.031-.14-37.53-9.37-7.239 29.062s20.191 4.627 19.765 4.913c11.022 2.751 13.014 10.044 12.68 15.825l-12.696 50.925c.76.194 1.744.473 2.829.907-.907-.225-1.876-.473-2.876-.713l-17.796 71.338c-1.349 3.348-4.767 8.37-12.471 6.464.271.395-19.78-4.937-19.78-4.937l-13.51 31.147 35.414 8.827c6.588 1.651 13.045 3.379 19.4 5.006l-11.262 45.213 27.182 6.781 11.153-44.733a1038.209 1038.209 0 0 0 21.687 5.627l-11.115 44.523 27.213 6.781 11.262-45.128c46.404 8.781 81.299 5.239 95.986-36.727 11.836-33.79-.589-53.281-25.004-65.991 17.78-4.098 31.174-15.792 34.747-39.949zm-62.177 87.179c-8.41 33.79-65.308 15.523-83.755 10.943l14.944-59.899c18.446 4.603 77.6 13.717 68.811 48.956zm8.417-87.667c-7.673 30.736-55.031 15.12-70.393 11.292l13.548-54.327c15.363 3.828 64.836 10.973 56.845 43.035z"></path>
                        </svg></a>
                        <a href="https://github.com/Noso-Project" class="text-white px-1" target="_blank"><svg class="svg-icon" viewBox="0 0 496 512">
                            <path fill="currentColor" d="M186.1 328.7c0 20.9-10.9 55.1-36.7 55.1s-36.7-34.2-36.7-55.1 10.9-55.1 36.7-55.1 36.7 34.2 36.7 55.1zM480 278.2c0 31.9-3.2 65.7-17.5 95-37.9 76.6-142.1 74.8-216.7 74.8-75.8 0-186.2 2.7-225.6-74.8-14.6-29-20.2-63.1-20.2-95 0-41.9 13.9-81.5 41.5-113.6-5.2-15.8-7.7-32.4-7.7-48.8 0-21.5 4.9-32.3 14.6-51.8 45.3 0 74.3 9 108.8 36 29-6.9 58.8-10 88.7-10 27 0 54.2 2.9 80.4 9.2 34-26.7 63-35.2 107.8-35.2 9.8 19.5 14.6 30.3 14.6 51.8 0 16.4-2.6 32.7-7.7 48.2 27.5 32.4 39 72.3 39 114.2zm-64.3 50.5c0-43.9-26.7-82.6-73.5-82.6-18.9 0-37 3.4-56 6-14.9 2.3-29.8 3.2-45.1 3.2-15.2 0-30.1-.9-45.1-3.2-18.7-2.6-37-6-56-6-46.8 0-73.5 38.7-73.5 82.6 0 87.8 80.4 101.3 150.4 101.3h48.2c70.3 0 150.6-13.4 150.6-101.3zm-82.6-55.1c-25.8 0-36.7 34.2-36.7 55.1s10.9 55.1 36.7 55.1 36.7-34.2 36.7-55.1-10.9-55.1-36.7-55.1z"></path>
                        </svg></a>
                    </div>
                </div>
            </div>
        </header>
<?php if ($prefix != 'Api'): ?>
        <div class="container px-2 py-1 text-end">
            <?= $this->Html->link(
                $this->Html->image(
                    'gb.svg',
                    ['class'=>'flag px-1', 'alt'=>'English']
                ),
                (empty($pass)?['controller'=>$controller, 'action'=>$action, 'lang'=>'en']:['controller'=>$controller, 'action'=>$action, 'lang'=>'en', $pass]),
                ['title'=>'English', 'escape'=>false]
            ) ?>

            <?= $this->Html->link(
                $this->Html->image(
                    'cn.svg',
                    ['class'=>'flag px-1', 'alt'=>'中文']
                ),
                (empty($pass)?['controller'=>$controller, 'action'=>$action, 'lang'=>'zh']:['controller'=>$controller, 'action'=>$action, 'lang'=>'zh', $pass]),
                ['title'=>'中文','escape'=>false]
            ) ?>

            <?= $this->Html->link(
                $this->Html->image(
                    'fr.svg',
                    ['class'=>'flag px-1', 'alt'=>'Fran&ccedil;ais']
                ),
                (empty($pass)?['controller'=>$controller, 'action'=>$action, 'lang'=>'fr']:['controller'=>$controller, 'action'=>$action, 'lang'=>'fr', $pass]),
                ['title'=>'Fran&ccedil;ais', 'escape'=>false]
            ) ?>

            <?= $this->Html->link(
                $this->Html->image(
                    'de.svg',
                    ['class'=>'flag px-1', 'alt'=>'Deutsch']
                ),
                (empty($pass)?['controller'=>$controller, 'action'=>$action, 'lang'=>'de']:['controller'=>$controller, 'action'=>$action, 'lang'=>'de', $pass]),
                ['title'=>'Deutsch','escape'=>false]
            ) ?>

            <?= $this->Html->link(
                $this->Html->image(
                    'ro.svg',
                    ['class'=>'flag px-1', 'alt'=>'Română']
                ),
                (empty($pass)?['controller'=>$controller, 'action'=>$action, 'lang'=>'ro']:['controller'=>$controller, 'action'=>$action, 'lang'=>'ro', $pass]),
                ['title'=>'Română', 'escape'=>false]
            ) ?>

            <?= $this->Html->link(
                $this->Html->image(
                    'vn.svg',
                    ['class'=>'flag px-1', 'alt'=>'Việt Nam']
                ),
                (empty($pass)?['controller'=>$controller, 'action'=>$action, 'lang'=>'vn']:['controller'=>$controller, 'action'=>$action, 'lang'=>'vn', $pass]),
                ['title'=>'Việt Nam', 'escape'=>false]
            ) ?>

            <?= $this->Html->link(
                $this->Html->image(
                    'es.svg',
                    ['class'=>'flag px-1', 'alt'=>'Español']
                ),
                (empty($pass)?['controller'=>$controller, 'action'=>$action, 'lang'=>'es']:['controller'=>$controller, 'action'=>$action, 'lang'=>'es', $pass]),
                ['title'=>'Español', 'escape'=>false]
            ) ?>

            <?= $this->Html->link(
                $this->Html->image(
                    'gr.svg',
                    ['class'=>'flag px-1', 'alt'=>'Ελληνικά']
                ),
                (empty($pass)?['controller'=>$controller, 'action'=>$action, 'lang'=>'gr']:['controller'=>$controller, 'action'=>$action, 'lang'=>'gr', $pass]),
                ['title'=>'Ελληνικά', 'escape'=>false]
            ) ?>

            <?= $this->Html->link(
                $this->Html->image(
                    'dk.svg',
                    ['class'=>'flag px-1', 'alt'=>'Dansk']
                ),
                (empty($pass)?['controller'=>$controller, 'action'=>$action, 'lang'=>'dk']:['controller'=>$controller, 'action'=>$action, 'lang'=>'dk', $pass]),
                ['title'=>'Dansk', 'escape'=>false]
            ) ?>

            <?= $this->Html->link(
                $this->Html->image(
                    'id.svg',
                    ['class'=>'flag px-1', 'alt'=>'Bahasa Indonesia']
                ),
                (empty($pass)?['controller'=>$controller, 'action'=>$action, 'lang'=>'id']:['controller'=>$controller, 'action'=>$action, 'lang'=>'id', $pass]),
                ['title'=>'Bahasa Indonesia', 'escape'=>false]
            ) ?>

            <?= $this->Html->link(
                $this->Html->image(
                    'hu.svg',
                    ['class'=>'flag px-1', 'alt'=>'Magyar']
                ),
                (empty($pass)?['controller'=>$controller, 'action'=>$action, 'lang'=>'hu']:['controller'=>$controller, 'action'=>$action, 'lang'=>'hu', $pass]),
                ['title'=>'Magyar', 'escape'=>false]
            ) ?>

            <?= $this->Html->link(
                $this->Html->image(
                    'in.svg',
                    ['class'=>'flag px-1', 'alt'=>'हिंदी']
                ),
                (empty($pass)?['controller'=>$controller, 'action'=>$action, 'lang'=>'in']:['controller'=>$controller, 'action'=>$action, 'lang'=>'in', $pass]),
                ['title'=>'हिंदी', 'escape'=>false]
            ) ?>

            <?= $this->Html->link(
                $this->Html->image(
                    'it.svg',
                    ['class'=>'flag px-1', 'alt'=>'Italiano']
                ),
                (empty($pass)?['controller'=>$controller, 'action'=>$action, 'lang'=>'it']:['controller'=>$controller, 'action'=>$action, 'lang'=>'it', $pass]),
                ['title'=>'Italiano', 'escape'=>false]
            ) ?>

            <?= $this->Html->link(
                $this->Html->image(
                    'tr.svg',
                    ['class'=>'flag px-1', 'alt'=>'Türkçe']
                ),
                (empty($pass)?['controller'=>$controller, 'action'=>$action, 'lang'=>'tr']:['controller'=>$controller, 'action'=>$action, 'lang'=>'tr', $pass]),
                ['title'=>'Türkçe', 'escape'=>false]
            ) ?>

            <?= $this->Html->link(
                $this->Html->image(
                    'ua.svg',
                    ['class'=>'flag px-1', 'alt'=>'Українська']
                ),
                (empty($pass)?['controller'=>$controller, 'action'=>$action, 'lang'=>'ua']:['controller'=>$controller, 'action'=>$action, 'lang'=>'ua', $pass]),
                ['title'=>'Українська', 'escape'=>false]
            ) ?>

            <?= $this->Html->link(
                $this->Html->image(
                    'pt.svg',
                    ['class'=>'flag px-1', 'alt'=>'Portugu&ecirc;s']
                ),
                (empty($pass)?['controller'=>$controller, 'action'=>$action, 'lang'=>'pt']:['controller'=>$controller, 'action'=>$action, 'lang'=>'pt', $pass]),
                ['title'=>'Portugu&ecirc;s', 'escape'=>false]
            ) ?>

        </div>
<?php if (Configure::read('Ads.show')): ?>
            <div class="container text-center py-2">
<?php if ($controller == 'Explorer' && $action == 'index'): ?>
                <?= Configure::read('Ads.codes.0')."\n" ?>
<?php else: ?>
                <?= Configure::read('Ads.codes.1')."\n" ?>
<?php endif; // Switch page ads ?>
            </div>
<?php endif; // Show Ads ?>
<?php endif; // Prefix != API ?>

        <?= $this->Flash->render() ?>
        <?= $this->fetch('content') ?>

<?php if (Configure::read('Ads.show')): ?>
            <div class="container text-center py-2">
<?php if ($controller == 'Explorer' && $action == 'index'): ?>
                <?= Configure::read('Ads.codes.1')."\n" ?>
<?php else: ?>
                <?= Configure::read('Ads.codes.0')."\n" ?>
<?php endif; // Switch page ads ?>
            </div>
<?php endif; // Show Ads ?>

        <?php if (!empty($chinese)): ?>
        <div class="container">
             <a target="_blank"
             href="https://beian.miit.gov.cn/#/Integrated/index"
             class="text-decoration-none"
             style="font-size: 10px;">
             备案号：苏ICP备19014705号-1</a>
             <a target="_blank"
             href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=<?= $chinese ?>"
             class="text-decoration-none"
             style="font-size: 10px;">
                 <?= $this->Html->image(
                    'chinese-seal.png'
                 ) ?>苏公网安备<?= $chinese ?>号
            </a>
        </div>
        <?php endif; ?>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>

    </body>
</html>
