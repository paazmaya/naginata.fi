<?php

/**
 * Twig PHP Templating Engine 1.4 (github 2011-12-18)
 * Slim PHP 5 Framework 1.5.1.2
 */
require '../libs/Twig/Autoloader.php';
//require '../libs/Slim/Slim.php';
//require '../libs/Views/TwigView.php';

$templatesDir = realpath('../templates');
$twigDirectory = realpath('../libs/Twig');
$twigOptions = array(
	'cache' => '../compilation_cache',
	'debug' => true,
	'strict_variables' => true
);

/**
 * Templating via Twig
 */
Twig_Autoloader::register();
$loader = new Twig_Loader_Filesystem($templatesDir);
$twig = new Twig_Environment($loader, $twigOptions);


echo $twig->render('index.htm');


/**
 * Instantiate the Slim application
 */
 /*
$app = new Slim(array(
    'view' => 'TwigView',
    'log.enable' => true,
	'log.level' => 4,
    'log.path' => realpath('../logs'), // directory
    'debug' => true,
    'templates.path' => $templatesDir
));
*/

/**
 * Define the Slim application routes
 *
 * Here we define several Slim application routes that respond
 * to appropriate HTTP request methods. In this example, the second
 * argument for `Slim::get`, `Slim::post`, `Slim::put`, and `Slim::delete`
 * is an anonymous function.
 */

//GET route
/*
$app->get('/', function () {
	echo $app->render('index.htm', array());
	echo 'Hoplaa' . '$app->getTemplatesDirectory() ' . $app->getTemplatesDirectory();
    //$template = file_get_contents($this->getTemplatesDirectory() . '/index.htm');
    //echo $template;
});
*/
/**
 * Run the Slim application. Last method to be called.
 */
//$app->run();
