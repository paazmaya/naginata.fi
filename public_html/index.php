<?php
//etag = sha1( naginata.fi + file/page name + last modification time of the given page )
// In case anyone would edit the json, take a backup first which is then supposed to be committed later.

$shio = new ShikakeOji('../naginata-data.json');
echo $shio->createNavigation();


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
$tidy = new tidy();
$tidy->parseString($html, $config, 'utf8');
$tidy->cleanRepair();
echo tidy_get_output($tidy);

