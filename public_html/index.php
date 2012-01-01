<?php
//etag = sha1( naginata.fi + file/page name + last modification time of the given page )
// In case anyone would edit the json, take a backup first which is then supposed to be committed later.

// Remove www from the url and redirect.
if (substr($_SERVER['HTTP_HOST'], 0, 3) == 'www')
{
	$go = 'http://' . substr($_SERVER['HTTP_HOST'], 4) . $_SERVER['REQUEST_URI'];
	header('HTTP/1.1 301 Moved Permanently');
	header('Location: ' . $go);
	exit();
}
session_name('SOFI');
session_start();
if (!isset($_SESSION['fontcounter']))
{
	$_SESSION['fontcounter'] = 0;
}

require '../libs/ShikakeOji.php';

$shio = new ShikakeOji(realpath('../naginata-data.json'));
$shio->useMinification = false;
$shio->useTidy = true;

$shio->checkRequestedLanguage();
$shio->checkRequestedPage();

echo $shio->renderPage();


