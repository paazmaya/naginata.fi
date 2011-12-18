<?php

/**
 * Twig PHP Templating Engine 1.4
 * Slim PHP 5 Framework 1.5.1.2
 */
//require '../libs/Twig/Autoloader.php';
require '../libs/Slim/Slim.php';
require '../libs/Views/TwigView.php';


/**
 * Templating via Twig
 */
//Twig_Autoloader::register();
TwigView::twigDirectory = realpath('../libs/Twig');
TwigView::twigOptions = array(
	'cache' => '../compilation_cache',
);

/*
$loader = new Twig_Loader_Filesystem(realpath('../templates'));
$twig = new Twig_Environment($loader, array(
  'cache' => '../compilation_cache',
));
*/

//echo $twig->render('index.htm', array('name' => 'Fabien'));


/**
 * Instantiate the Slim application
 */
$app = new Slim(array(
    'view' => 'TwigView',
    'log.enable' => true,
	'log.level' => 4,
    'log.path' => realpath('../logs'), // directory
    'debug' => true,
    'templates.path' => realpath('../templates')
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
	echo $app->render('index.htm', array());
	echo 'Hoplaa' . '$app->getTemplatesDirectory() ' . $app->getTemplatesDirectory();
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
