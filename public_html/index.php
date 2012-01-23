<?php
/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * http://creativecommons.org/licenses/by-sa/3.0/
 * 
 * main handler
 */

ini_set('error_log', '../naginata-php.log');
ini_set('log_errors', 1);
ini_set('html_errors', 0);

ini_set('date.timezone', 'Europe/Helsinki');
ini_set('date.default_latitude', '60.174306261926034');
ini_set('date.default_longitude', '24.983339309692383');

ini_set('arg_separator.output', '&amp;');

ini_set('mbstring.internal_encoding', 'UTF-8');
mb_internal_encoding('UTF-8');

ini_set('session.referer_check', $_SERVER['HTTP_HOST']);
ini_set('session.gc_maxlifetime', 86400); // default 1440 seconds = 24 min, 86400 sec = 24 h
ini_set('session.cache_expire', 1440); // default 180 minutes = 3 h, 1440 min = 24 h
ini_set('session.cookie_lifetime', 86400);
ini_set('session.hash_function', 1); // default 0 = md5, 1 = sha1

require '../libs/ShikakeOji.php';

$shio = new ShikakeOji(
	realpath('../naginata-data.json'),
	realpath('../naginata-config.json')
);

$shio->removeWwwRedirect();
$shio->output->useMinification = true;
$shio->output->useTidy = false;

$shio->checkRequestedLanguage();
$shio->checkRequestedPage();

echo $shio->renderPage();


