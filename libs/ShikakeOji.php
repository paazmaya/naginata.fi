<?php
/**
 * naginata.fi
 * A class for outputting HTML5 stuff.
 * Let's see how many times the buzzword HTML5 can be repeated.
 */
class ShikakeOji
{
	/**
	 * Current language, defaults to Finnish.
	 */
    public $language = 'fi';

	/**
	 * Application data, decoded from JSON string
	 */
	public $addData;
	
	/**
	 * Current page, as seen in the request url.
	 * Needs to match the ones available in navigation.
	 * Defaults to / as in front page.
	 */
	public $currentPage = '/';
	
	/**
	 * Constructor will load the JSON data and decode it.
	 */
	function __construct($jsonpath)
	{
		$json = file_get_contents($jsonpath);
		$this->appData = json_decode($json, true);
		
		$error = getJsonError();
		if ($error != '')
		{
			echo $error;
		}
	}

	/**
	 * Navigation block for HTML5
	 */
	public function createNavigation() 
	{
		if (!isDataAvailable('navigation'))
		{
			return '<p class="fail">Navigation data missing</p>';
		}
		
		$data = $this->appData['navigation'][$this->language];
		
		$out = '<nav><ul>';
		foreach ($data as $item) 
		{
			// ["/naginata", "Atarashii Naginatado", "Naginata"],
			$out .= '<li';
			if ($this->currentPage == $item['0'])
			{
				$out .= ' class="current"';
			}
			$out .= '><a href="' . $item['0'] . '" title="' . $item['1'] . '">' . $item['2'] . '</a></li>';
		}
		$out .= '</ul></nav>';
		
		return $out;
	}
	
	/**
	 * Article block for HTML5
	 */
	public function createArticle()
	{
		if (!isDataAvailable('article'))
		{
			return '<p class="fail">Article data missing</p>';
		}
		
		$data = $this->appData['article'][$this->language];
		
		// Now check the page
		if (!isset($data[$this->currentPage]))
		{
			return '<p class="fail">Article data for this page missing</p>';
		}
		$data = $data[$this->currentPage]; // supposed to be an array
		
		$out = '';
		
		if (is_array($data))
		{
			foreach($data as $article)
			{
				$out .= '<article>';
				if (is_array($article))
				{
					// There might be specific sections defined...
				}
				else
				{
					$out .= $this->decodeHtml($article);
				}
				$out .= '</article>';
			}
		}
		
		return $out;
	}
	
	/**
	 * Check to see whether a given data scope is available.
	 * 
	 * @param	string	$area
	 * @return	boolean
	 */
	private function isDataAvailable($area)
	{
		if (isset($this->appData) && isset($this->appData[$area]) && isset($this->appData[$area][$this->language])) 
		{
			return true;
		}
		return false;
	}
	
	
	/**
	 * http://www.php.net/manual/en/function.json-last-error.php
	 */
	private function getJsonError()
	{
		switch (json_last_error())
		{
			case JSON_ERROR_NONE:
				return '';
				break;
			case JSON_ERROR_DEPTH:
				return 'Maximum stack depth exceeded';
				break;
			case JSON_ERROR_STATE_MISMATCH:
				return 'Underflow or the modes mismatch';
				break;
			case JSON_ERROR_CTRL_CHAR:
				return 'Unexpected control character found';
				break;
			case JSON_ERROR_SYNTAX:
				return 'Syntax error, malformed JSON';
				break;
			case JSON_ERROR_UTF8:
				return 'Malformed UTF-8 characters, possibly incorrectly encoded';
				break;
			default:
				return 'Unknown error';
				break;
		}
	}
	
	/**
	 * Encode HTML entities for a block of text
	 *
	 * @param	string	$str
	 * @return	string
	 */
	private function encodeHtml($str)
	{
		return htmlentities(trim($str), ENT_QUOTES, 'UTF-8');
	}

	/**
	 * Decode HTML entities from a block of text
	 *
	 * @param	string	$str
	 * @return	string
	 */
	private function decodeHtml($str)
	{
		return html_entity_decode(trim($str), ENT_QUOTES, 'UTF-8');
	}

}
