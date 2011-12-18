<?php

/**
 * Slim PHP 5 Framework 1.5.1.2
 */
require '../libs/Slim/Slim.php';

/**
 * Instantiate the Slim application
 */
$app = new Slim(array(
    'log.enable' => true,
	'log.level' => 4,
    'log.path' => '../logs', // directory
    'debug' => true,
    'templates.path' => '../templates'
));

/**
 * Define the Slim application routes
 *
 * Here we define several Slim application routes that respond
 * to appropriate HTTP request methods. In this example, the second
 * argument for `Slim::get`, `Slim::post`, `Slim::put`, and `Slim::delete`
 * is an anonymous function.
 */

//GET route
$app->get('/', function () {
	echo 'Hoplaa' . '$this->getTemplatesDirectory() '; // . $this->getTemplatesDirectory();
    //$template = file_get_contents($this->getTemplatesDirectory() . '/index.htm');
    //echo $template;
});

//POST route
$app->post('/post', function () {
    echo 'This is a POST route';
});

//PUT route
$app->put('/put', function () {
    echo 'This is a PUT route';
});

//DELETE route
$app->delete('/delete', function () {
    echo 'This is a DELETE route';
});

/**
 * Run the Slim application. Last method to be called.
 */
$app->run();
