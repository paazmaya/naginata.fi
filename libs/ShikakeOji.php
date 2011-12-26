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
	 * Should be set to the realpath of the json file where app data is stored.
	 */
	public $jsonpath = '';

	/**
	 * Application data, decoded from JSON string
	 */
	public $addData;
	
	/**
	 * Last modification date of the data.
	 * Does not separate per language, just the last edit of anything.
	 */
	public $modified;
	
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
		$this->jsonpath = $jsonpath;
		$this->loadData();
	}

	/**
	 * Create the common head section with style sheet imports.
	 * 
	 * @param	array	$styles	List of source files in "css" folder
	 * @return	string
	 */
	public function createHtmlHeadBody($styles)
	{
		$base = '/css/';
		
		$nav = $this->appData['navigation'][$this->language];
		$title = '';
		foreach($nav as $list)
		{
			if (in_array($this->currentPage, $list))
			{
				$title = $list['2'];
			}
		}
		
		$out = '<!DOCTYPE html>';
		$out .= '<html>';
		$out .= '<head>';
		$out .= '<meta charset="utf-8"/>';
		$out .= '<title>' . $title . ' - Naginata Suomessa</title>';
		$out .= '<link rel="shortcut icon" href="img/favicon.png" type="image/png"/>';
		
		foreach($styles as $css)
		{		
			$out .= '<link rel="stylesheet" href="' . $base . $css . '" type="text/css" media="all" />';
		}
		
		$out .= '<script type="text/javascript" src="js/modernizr.js"></script>';
		
		$out .= '</head>';
		$out .= '<body>';
		return $out;
	}
	
	/**
	 * Create a simple div with logo specific id and text changing per language.
	 * 
	 * @return	string
	 */
	public function createLogo()
	{
		if (!$this->isDataAvailable('title'))
		{
			return '<p class="fail">Title data missing</p>';
		}
	
		$out = '<div id="logo">';
		// should be only two words
		$out .= '<p class="fontdejavu1">' . $this->appData['title'][$this->language] . '</p>';
		$out .= '</div>';
		return $out;
	}
	
	/**
	 * Navigation block for HTML5
	 * 
	 * @return	string
	 */
	public function createNavigation() 
	{
		if (!$this->isDataAvailable('navigation'))
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
	 * 
	 * @return	string
	 */
	public function createArticle()
	{
		if (!$this->isDataAvailable('article'))
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
					/*
					<header>
						<h1>Ajankohtaista</h1>
						<p>Ensimmäiset viittaukset naginataan löytyvät Kojikista, vanhimmasta säilyneestä Japanin historiasta kertovasta kirjasta, 
						jossa sana ”naginata” esiintyy ensimmäisen kerran. Nara-kaudella sen ottivat käyttöön sōhei-soturipapit ja ensimmäiset
						naginatan käytöstä taistelussa (naginatajutsu) kertovat tekstit löytyvät vuonna 1086 kirjoitetussa kirjassa Oshu Gosannenki (”Päiväkirja kolmesta vuodesta Oshussa”).</p>
					</header>
					*/
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
	 * Footer with copyrights, login and edit links.
	 * 
	 * @return	string
	 */
	public function createFooter()
	{
		if (!$this->isDataAvailable('footer'))
		{
			return '<p class="fail">Footer data missing</p>';
		}
		
		$data = $this->appData['footer'][$this->language]; // supposed to be an array of links
		
		$out = '<footer>';
		$out .= '<p>';
		
		foreach ($data as $item) 
		{
			// ["http://paazmaya.com", "PAAZMAYA.com", "&copy; Jukka Paasonen"]
			$out .= '<a href="' . $item['0'] . '" title="' . $item['1'] . '">' . $item['2'] . '</a> | ';
		}
		
		$out .= '<time datetime="' . date('c', $this->modified) . '">' . date('r', $this->modified) . '</time>';
		$out .= '</footer>';
		
		return $out;
	}
	
	/**
	 * Close the body and html tags, including the javascript import that is combined
	 * of all the source files and compressed if supported.
	 * 
	 * @param	array	$scripts	List of source files in "js" folder
	 * @return	string
	 */
	public function createEndBodyJavascript($scripts)
	{
		$base = '/js/';
		$out = '';
		
		foreach($scripts as $js)
		{		
			$out .= '<script type="text/javascript" src="' . $base . $js . '"></script>';	
		}
		$out .= '</body>';
		$out .= '</html>';
		return $out;
	}
	
	private function loadData()
	{
		if ($this->jsonpath != '' && file_exists($this->jsonpath))
		{
			$json = file_get_contents($this->jsonpath);
			$this->appData = json_decode($json, true);
			$this->modified = filemtime($this->jsonpath);
			
			$error = $this->getJsonError();
			if ($error != '')
			{
				echo $error;
			}
		}
		
		// $data = utf8_decode( json_decode($json) );
	}
	
	/**
	 * Save application data to the JSON file storage and update modificatiion date.
	 */
	private function saveData()
	{
		// $json = json_encode( utf8_encode($data) );
		if ($this->jsonpath != '')
		{
			$jsonstring = $this->jsonPrettyPrint(json_encode($this->appData)); // PHP 5.4 onwards JSON_PRETTY_PRINT
			file_put_contents($this->jsonpath, $jsonstring);
			$this->modified = time();
		}
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
	 * @return	string
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
	 * Pretty print some JSON 
	 * http://fi.php.net/manual/en/function.json-encode.php#80339
	 * 
	 * @param	string	$json	A string encoded as JSON
	 * @return	string
	 */
	private function jsonPrettyPrint($json) 
	{ 
		$tab = "  "; 
		$new_json = ""; 
		$indent_level = 0; 
		$in_string = false; 

		$len = strlen($json); 

		for($c = 0; $c < $len; $c++) 
		{ 
			$char = $json[$c]; 
			switch($char) 
			{ 
				case '{': 
				case '[': 
					if(!$in_string) 
					{ 
						$new_json .= $char . "\n" . str_repeat($tab, $indent_level + 1);
						 $indent_level++; 
					} 
					else 
					{ 
						$new_json .= $char; 
					} 
					break; 
				case '}': 
				case ']': 
					if(!$in_string) 
					{ 
						$indent_level--; 
						$new_json .= "\n" . str_repeat($tab, $indent_level) . $char;
					 } 
					else 
					{ 
						$new_json .= $char; 
					} 
					break; 
				case ',': 
					if(!$in_string) 
					{ 
						$new_json .= ",\n" . str_repeat($tab, $indent_level); 
					} 
					else 
					{ 
						$new_json .= $char; 
					} 
					break; 
				case ':': 
					if(!$in_string) 
					{ 
						$new_json .= ": "; 
					} 
					else 
					{ 
						$new_json .= $char; 
					} 
					break; 
				case '"': 
					if($c > 0 && $json[$c-1] != '\\') 
					{ 
						$in_string = !$in_string; 
					} 
				default: 
					$new_json .= $char; 
					break;                    
			} 
		} 

		return $new_json; 
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
