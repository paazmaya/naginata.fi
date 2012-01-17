<?php
header('Content-type: text/html');

$images = glob('img/*.png');

foreach($images as $img) 
{
	echo '<p>' . $img . '</p>' . "\n";
	$data = file_get_contents($img);
	$base64n = chunk_split(base64_encode($data), 64, "\n");
	$base64 = base64_encode($data);
	$gzip64 = gzcompress($base64, 9);
	$gzip = gzcompress($data, 9);
	echo '<p>binary: ' . filesize($img) . ', data: ' . strlen($data) . ', base64: ' . strlen($base64) . '. 64 Increase: ' . round(strlen($base64) / strlen($data), 2) . '</p>' . "\n";
	echo '<p>base64n: ' . strlen($base64n) . ', gzip: ' . strlen($gzip) . ', gzip64: ' . strlen($gzip64) . '. GZ Increase: ' . round(strlen($gzip64) / strlen($gzip), 2) . '</p>' . "\n";
	echo '<img src="data:image/png;base64,' . $base64 . '" />' . "\n";
	echo '<img src="' . $img . '" />' . "\n";
	echo '<p>' . nl2br($base64n) . '</p>' . "\n";
}


// http://php.net/manual/en/function.base64-encode.php
//




/*


$string = 'Blah';
$encoded = strtr(base64_encode(addslashes(gzcompress(serialize($string),9))), '+/=', '-_,');
$string= unserialize(gzuncompress(stripslashes(base64_decode(strtr($encoded, '-_,', '+/=')))));
*/
 /*
 I have another solution that is simple and elegant.  Create a pseudorandom string of characters.  Then, each time you want to obfuscate your key, append a random substring from the pseudorandom string and use base64 encoding.  When you want to de-obfuscate, convert back from base64.  If the prefix is not in your pseudorandom source, then the value is forged.  Otherwise, strip the prefix and recover your original key. 

The advantages are that the string will look different even for the same key, and encoding and decoding should be extremely fast. 

Here's an example: 
*/

// Call makeCksum once upon landing on the homepage 
function makeCksum() { 
    $str = ""; 
    for ($i=0;$i<32;++$i) 
        $str .= chr(rand(32,126)); 
    $_SESSION['Cksum'] = $str; 
} 

function encode($x) { 
    return base64_encode(substr($_SESSION['Cksum'],rand(0,28),4) . $x); 
} 

function decode($x) { 
    $y = base64_decode($x); 
    if (strpos($_SESSION['Cksum'],substr($y,0,4)) === false) return false; 
    return substr($y,4-strlen($y)); 
} 

