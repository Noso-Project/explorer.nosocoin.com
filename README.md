# Blockchain Explorer for NosocCoin

# How to deploy on a LAMP stack

## Introduction

Some assumptions are made:

Regarding the LAMP stack: Ubuntu Server 20.04.

Regarding the paths of this deployment:

- GIT cloned folder: `/var/www/explorer`
- `DocumentRoot` for this Apache virtual host: `/var/www/explorer/webroot`

This deployment depends on having a Noso Wallet node reachable to this Apache instance

### Necessary Apache modules

```bash
$ sudo a2enmod rewrite ssl
$ sudo systemctl restart apache2
```

### Virtual Host config, no SSL

This config file includes a redirect to `HTTPS`.

This file should reside on `/etc/apache2/sites-available` and should be named something like `001-nosoexplorer.conf`

```apache
<VirtualHost *:80>
    ServerName <Your Domain>
    ServerAlias www.<Your Domain>
    ServerAdmin <Your Email>

    Redirect permanent / https://<Your Domain>

    DirectoryIndex index.html index.php
    DocumentRoot /var/www/explorer/webroot

    ErrorLog ${APACHE_LOG_DIR}/error-nosoexplorer.log
    CustomLog ${APACHE_LOG_DIR}/access-nososexplorer.log combined

    <Directory /var/www/explorer/webroot>
        Options FollowSymLinks
        AllowOverride All
    </Directory>

</VirtualHost>
```

To enable this site:  

```bash
$ sudo a2ensite 001-nosoexplorer
$ sudo systemctl reload apache2
```

### Virtual Host config  SSL

This file should reside on `/etc/apache2/sites-available` and should be named something like `001-nosoexplorer-ssl.conf`

```apache
<IfModule mod_ssl.c>
    <VirtualHost *:443>
        ServerName <Your Domain>
        ServerAlias www.<Your Domain>
        ServerAdmin <Your Email>

        DirectoryIndex index.html index.php
        DocumentRoot /var/www/explorer/webroot

        ErrorLog ${APACHE_LOG_DIR}/error-nosoexplorer-ssl.log
        CustomLog ${APACHE_LOG_DIR}/access-nososexplorer-ssl.log combined

        SSLEngine On
        SSLCertificateFile /etc/ssl/nosoexplorer/<Your CERT>.crt
        SSLCertificateKeyFile /etc/ssl/nosoexplorer/<Your CERT>.key
        SSLCertificateChainFile /etc/ssl/nosoexplorer/<Your CERT>.crt

        <Directory /var/www/explorer/webroot>
            Options FollowSymLinks
            AllowOverride All
        </Directory>

    </VirtualHost>
</IfModule>
```

To enable this site:  

```bash
$ sudo a2ensite 001-nosoexplorer-ssl
$ sudo systemctl reload apache2
```

### Necessary PHP modules

```bash
# JSON packege's version may differ
$ sudo apt install php7.4-json php-mysql php-mbstring php-intl
```

There may be some I'm forgetting. I'm sure either `composer` or `CakePHP` will prompt any other that I've missed.

### CakePHP app_local.php config

This file should reside on `/var/www/explorer/config/app_local.php`.

You should fill in the RPC `host`, at least, and the RPC `port` if it's different from the default value.

If you have a Google Analytics `G-` code, please provide that on the Google section. If not, please leave it blank and no code is added to the page.

The values you'll have to change are `USERNAME`, `PASSWORD` and `DATABASE` for the Database. This will be needed when the caching of request is finished being implemented.

```php
<?php
/*
 * Local configuration file to provide any overrides to your app.php configuration.
 * Copy and save this file as app_local.php and make changes as required.
 * Note: It is not recommended to commit files with credentials such as app_local.php
 * into source code version control.
 */
return [
    /*
     * Debug Level:
     *
     * Production Mode:
     * false: No error messages, errors, or warnings shown.
     *
     * Development Mode:
     * true: Errors and warnings shown.
     */
    'debug' => filter_var(env('DEBUG', false), FILTER_VALIDATE_BOOLEAN),

    /*
     * Security and encryption configuration
     *
     * - salt - A random string used in security hashing methods.
     *   The salt value is also used as the encryption key.
     *   You should treat it as extremely sensitive data.
     */
    'Security' => [
        'salt' => env('SECURITY_SALT', '4d6fca7802c7a57629e374284b232711f0ea4b1e2cc080e851987e2aa2431ad0'),
    ],

    /*
     * Connection information used by the ORM to connect
     * to your application's datastores.
     *
     * See app.php for more configuration options.
     */
    'Datasources' => [
        'default' => [
            'host' => 'localhost',
            /*
             * CakePHP will use the default DB port based on the driver selected
             * MySQL on MAMP uses port 8889, MAMP users will want to uncomment
             * the following line and set the port accordingly
             */
            //'port' => 'non_standard_port_number',

            'username' => 'USERNAME',
            'password' => 'PASSWORD',

            'database' => 'DATABASE',
            /*
             * If not using the default 'public' schema with the PostgreSQL driver
             * set it here.
             */
            //'schema' => 'myapp',

            /*
             * You can use a DSN string to set the entire configuration
             */
            'url' => env('DATABASE_URL', null),
        ],

        /*
         * The test connection is used during the test suite.
         */
        'test' => [
            'host' => 'localhost',
            //'port' => 'non_standard_port_number',
            'username' => 'my_app',
            'password' => 'secret',
            'database' => 'test_myapp',
            //'schema' => 'myapp',
            'url' => env('DATABASE_TEST_URL', null),
        ],
    ],

    /*
     * Email configuration.
     *
     * Host and credential configuration in case you are using SmtpTransport
     *
     * See app.php for more configuration options.
     */
    'EmailTransport' => [
        'default' => [
            'host' => 'localhost',
            'port' => 25,
            'username' => null,
            'password' => null,
            'client' => null,
            'url' => env('EMAIL_TRANSPORT_DEFAULT_URL', null),
        ],
    ],

    /*
     * Google analytics
     *
     */
    'Google' => [
        'analytics' => ''
    ],

    /*
     * Explorer Node Configuration
     *
     */
    'RPC' => [
        'host' => 'HOST/IP to RPC Server',
        'port' => 8078
    ],
];
```

## First time install

- `git clone git@github:gcarreno/web-serfs.git`
- `composer install`
- Under `/config` rename `app_local.example.php` to `app_local.php`
- Edit `app_local.php` to reflect your local database
- Make sure there are no DB issues
- `bin/cake migrations migrate`
- If not under `/var/www`, run `bin/cake server`
- Follow link on browser or refresh

## Updating from repository

- `git pull`
- `composer update`
- `bin/cake migrations migrate`
- `bin/cake server` if not under `/var/www`
- Follow link on browser or refresh
