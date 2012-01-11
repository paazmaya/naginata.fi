<?php
/**
 * Flickr PHP API class
 * API Documentation: http://www.flickr.com/services/api/
 * Documentation and usage in README file
 *
 * @author Jonas De Smet - Glamorous
 * @date 02.05.2010
 * @copyright Jonas De Smet - Glamorous
 * @version 0.6.1
 * @license BSD http://www.opensource.org/licenses/bsd-license.php
 */

class Flickr
{
	/**
	 * Default constructor
	 *
	 * @return void
	 */
	final private function __construct()
	{
		// This is a static class
	}

	/**
	 * Makes the call to the API
	 *
	 * @param array $params	parameters for the request
	 * @return mixed
	 */
	public static function makeCall($params)
	{

		// check if an API-key is provided
		if(!isset($params['api_key']))
		{
			throw new Exception('API-key must be set');
		}

		// check if a method is provided
		if(!isset($params['method']))
		{
			throw new Exception("Without a method this class can't call the API");
		}

		// Always using JSON
		$params['format'] = 'json';
		$params['nojsoncallback'] = 1;

		$url = 'http://api.flickr.com/services/rest/' . '?' . http_build_query($params, NULL, '&');

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_FAILONERROR, 1);

		$results = curl_exec($ch);
		$headers = curl_getinfo($ch);

		$error_number = (int) curl_errno($ch);
		$error_message = curl_error($ch);

		curl_close($ch);

		// invalid headers
		if(!in_array($headers['http_code'], array(0, 200)))
		{
			throw new Exception('Bad headercode', (int) $headers['http_code']);
		}

		// are there errors?
		if($error_number > 0)
		{
			throw new Exception($error_message, $error_number);
		}

		return $results;
	}
}
