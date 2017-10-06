<?php

require_once(__DIR__ . '/app/init.php');

$kernel = new \Fuga\CommonBundle\Controller\AppController();
$kernel->setContainer($container);

$kernel->run();