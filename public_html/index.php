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
$shio->checkRequestedLanguage();
$shio->checkRequestedPage();

$out = $shio->createHtmlHeadBody(array(
	'fonts.css',
	'colorbox.css',
	'main.css'
));
$out .= $shio->createNavigation();
$out .= '<div id="wrapper">';
$out .= $shio->createLogo();
$out .= $shio->createArticle();
$out .= '</div>';
$out .= $shio->createFooter();
$out .= $shio->createEndBodyJavascript(array(
	'jquery.js',
	'jquery.colorbox.js',
	'wymeditor/jquery.wymeditor.js',
	'naginata.js'
));

echo $out;


// if there would be tidy extension available
// http://www.php.net/manual/en/tidy.examples.php
// http://tidy.sourceforge.net/docs/quickref.html
$config = array(
	'indent' => true,
	'output-xml' => true,
	'input-xml' => true,
	'wrap' => '1000'
);

// Tidy
/*
$tidy = new tidy();
$tidy->parseString($out, $config, 'utf8');
$tidy->cleanRepair();
echo tidy_get_output($tidy);
*/




