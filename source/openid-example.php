<?php

$dir = realpath(__DIR__ . '/../libs/lightopenid/');

require $dir . '/openid.php';
try {
    # Change 'localhost' to your domain name.
    $openid = new LightOpenID('naginata.fi');
    if(!$openid->mode) {
        if(isset($_POST['openid_identifier'])) {
            $openid->identity = $_POST['openid_identifier'];
            # The following two lines request email, full name, and a nickname
            # from the provider. Remove them if you don't need that data.
            $openid->required = array('contact/email', 'namePerson');
            $openid->optional = array('namePerson/friendly');
            header('Location: ' . $openid->authUrl());
        }
?>
<form action="" method="post">
    OpenID: <input type="text" name="openid_identifier" /> <button>Submit</button>
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

