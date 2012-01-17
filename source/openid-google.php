<?php
# Logging in with Google accounts requires setting special identity, so this example shows how to do it.

$dir = realpath(__DIR__ . '/../libs/lightopenid/');

require $dir . '/openid.php';


try {
    # Change 'localhost' to your domain name.
    $openid = new LightOpenID('naginata.fi');
    if(!$openid->mode) {
        if(isset($_GET['login'])) {
            $openid->identity = 'https://www.google.com/accounts/o8/id';
			$openid->required = array('contact/email', 'namePerson', 'birthDate', 'person/gender');
            $openid->optional = array('namePerson/friendly');
			$openid->ui = array(
				'openid.ns.ui'   => 'http://specs.openid.net/extensions/ui/1.0',
				'openid.ui.mode' => 'popup',
				'openid.ui.icon' => true
			);
            header('Location: ' . $openid->authUrl());
        }
?>
<form action="?login" method="post">
    <button>Login with Google</button>
</form>
<?php
    } elseif($openid->mode == 'cancel') {
        echo 'User has canceled authentication!';
    } else {
        echo 'User ' . ($openid->validate() ? $openid->identity . ' has ' : 'has not ') . 'logged in.';
		print_r($openid->getAttributes());
    }
} catch(ErrorException $e) {
    echo $e->getMessage();
}

echo '<pre>';
print_r($_GET);
echo '</pre>';

