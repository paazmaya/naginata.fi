<?php
//etag = sha1( naginata.fi + file/page name + last modification time of the given page )
// In case anyone would edit the json, take a backup first which is then supposed to be committed later.

ini_set('error_log', realpath('../naginata-php.log'));
ini_set('session.referer_check', $_SERVER['HTTP_HOST']);

require '../libs/ShikakeOji.php';

$shio = new ShikakeOji(realpath('../naginata-data.json'));
$shio->removeWwwRedirect();

if (!isset($_SESSION['fontcounter']))
{
	$_SESSION['fontcounter'] = 0;
}

$shio->useMinification = false;
$shio->useTidy = true;
$shio->loadConfig(realpath('../naginata-config.json'));

$shio->checkRequestedLanguage();
$shio->checkRequestedPage();

echo $shio->renderPage();


