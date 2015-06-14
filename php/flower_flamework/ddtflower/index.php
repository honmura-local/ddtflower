<?php
require_once dirname(__FILE__) . '/autoload/ClassLoader.php';

define('BASE_URL','http://localhost/');

$fullDir = dirname(__FILE__);

// オートロード対象ディレクトリを設定
$classLoader = new ClassLoader();
$classLoader->registerDir($fullDir . '/controller');
$classLoader->registerDir($fullDir . '/finder');
$classLoader->registerDir($fullDir . '/routes');
$classLoader->registerDir($fullDir . '/session');


