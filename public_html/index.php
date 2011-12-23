<?php
$appJson = file_get_contents('../naginata-data.json');
$appData = json_decode($appJson, true);
$lang = 'fi';

//etag = sha1( naginata.fi + file/page name + last modification time of the given page )

echo createNavigation($appData['navigation'][$lang]);


/**
 * Navigation data
 */
function createNavigation($data) 
{
	$out = '<nav><ul>';
	foreach ($data as $item) 
	{
		$out .= '<li><a href="' . $item['0'] . '" title="' . $item['1'] . '">' . $item['2'] . '</a></li>';
	}
	$out .= '</ul></nav>';
	
	return $out;
}

