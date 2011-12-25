<?php
//etag = sha1( naginata.fi + file/page name + last modification time of the given page )
// In case anyone would edit the json, take a backup first which is then supposed to be committed later.

require '../libs/ShikakeOji.php';

$shio = new ShikakeOji(realpath('../naginata-data.json'));
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
	'naginata.js'
));

echo $out;


// if there would be tidy extension available
// http://www.php.net/manual/en/tidy.examples.php
// http://tidy.sourceforge.net/docs/quickref.html
$html = 'a chunk of html you created';
$config = array(
	'indent' => true,
	'output-xml' => true,
	'input-xml' => true,
	'wrap' => '1000'
);

// Tidy
/*
$tidy = new tidy();
$tidy->parseString($html, $config, 'utf8');
$tidy->cleanRepair();
echo tidy_get_output($tidy);
*/




