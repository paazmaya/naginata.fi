<?php
/**
 * naginata.fi
 * A class for outputting HTML5 stuff.
 * Let's see how many times the buzzword HTML5 can be repeated.
 * 
 * http://blog.thenounproject.com/post/7310229014/how-to-properly-attribute-cc-by-a-guest-blog-post-by
 *
 * Usage:
 *  $shio = new ShikakeOji(realpath('../naginata-data.json'));
 *  $shio->loadConfig(realpath('../naginata-config.json'));
 *  $shio->checkRequestedPage();
 *  echo $shio->renderPage();
 */
class ShikakeOji
{
	/**
	 * Current language, defaults to Finnish.
	 */
    public $language = 'fi';

	/**
	 * Should be set to the realpath of the JSON file where app data is stored.
     * This location is used for storing the moderated versions of the content.
	 */
	public $dataPath = '../naginata-data.json';
	
	/**
	 * Configuration for Emails sending, 3rd party API keys, etc.
	 * See "naginata-config.json.dist" for possible keys.
	 */
	public $config;
	
	/**
	 * Application data, decoded from JSON string which is loaded
     * from $this->dataPath.
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
     * All URLs are starting with forward slash.
	 */
	public $currentPage = '/';

	/**
	 * The format used with "date()" while writing a log entry.
	 */
	public $logDateFormat = 'Y-m-d H:i:s';

	/**
	 * Log for minification. Entry added every time minification is needed.
	 */
	public $redirectLog = '../naginata-redirect.log';

	/**
	 * Use Tidy if available.
	 * http://www.php.net/manual/en/tidy.examples.php
	 * http://tidy.sourceforge.net/docs/quickref.html
	 */
	public $useTidy = false;

	/**
	 * Shall the JS and CSS files minification be done?
	 */
	public $useMinification = true;

	/**
	 * Log for minification. Entry added every time minification is needed.
	 */
	public $minifyLog = '../naginata-minify.log';

	/**
	 * How will JS and CSS files will be called once minified in to one file per type?
	 * If compression is supported, the client will receive the one with gz, and
	 * that will be appended to this variable, "gz." that is.
	 * For example:
	 * naginata.min --> js/naginata.min.js and naginata.min.gz.js
	 * --> css/naginata.min.css and css/naginata.min.gz.css
	 */
	private $minifiedName = 'naginata.min.';

	/**
	 * Client supports compression?
	 * This is checked and set in constructor.
	 */
	private $isCompressionSupported = false;

	/**
	 * Is the page internal, thus only ouputting JSON?
	 * These require user to login via OAuth.
	 */
	private $isInternalPage = false;
    
	/**
	 * Is the user logged in?
     * If true, then the userEmail should be one found in the "users" section of App data.
	 */
	private $isLoggedIn = false;
    
    /**
     * Email address of the current user, if any.
     * Be careful, this is used with "isLoggedIn" to validate the user.
     */
    private $userEmail = '';

	/**
	 * Library path, which is used to find the other libraries included.
	 */
	private $libPath = __DIR__;

	/**
	 * URLs used by the application, not for showing content.
	 * These should be human readable English with dashes.
     * Key is the URL, value is the name of the function to be called.
	 */
	private $appUrls = array(
		'/update-article' => 'pageUpdateArticle',
        '/receive-modernizr-statistics' => 'pageReceiveModernizrStats',
        '/authenticate-user' => 'pageAuthenticateUser'
	);
    
    public static $VERSION = '0.6';

	/**
	 * Constructor will load the JSON data and decode it as well as
	 * check for compression support of the client.
	 */
	function __construct($jsonpath)
	{
        $this->checkSession();
        
		$this->dataPath = $jsonpath;
		$this->loadData();

		if (isset($_SERVER['HTTP_ACCEPT_ENCODING']) && strpos($_SERVER['HTTP_ACCEPT_ENCODING'], 'gzip') !== false)
		{
			$this->isCompressionSupported = true;
			//$this->minifiedName .= 'gz.'; // It might conflict with what Apache is delivering already compressed
		}
	}
	
	/**
	 * Load the given JSON configuration file.
	 */
	public function loadConfig($configPath)
	{
		if (!file_exists($configPath))
		{
			return false;
		}
		$this->config = json_decode(file_get_contents($configPath), true); 
	}
    
    /**
     * Check for all session variables and restart session if needed.
     * Session should not be started elsewhere.
     */
    public function checkSession()
    {
		session_name('SOFI');
        session_start();
        
        $id = sha1($_SERVER['REMOTE_ADDR'] . $_SERVER['HTTP_USER_AGENT'] . 
                $_SERVER['HTTP_ACCEPT'] . $_SERVER['HTTP_ACCEPT_CHARSET'] . 
                $_SERVER['HTTP_ACCEPT_ENCODING'] . $_SERVER['HTTP_ACCEPT_LANGUAGE']);
                
        if (!isset($_SESSION['id']) || $_SESSION['id'] != $id && !isset($_SESSION['id']))
        {
            session_regenerate_id(); // updates the cookie if there is one
            session_destroy();
            unset($_SESSION);
            session_start();
            
            $_SESSION = array(); // not sure if this is needed
            // Must match the REMOTE_ADDR, HTTP_USER_AGENT, ...
            $_SESSION['id'] = $id;
            // Must found from the "users" list if not empty. If empty, not logged in.
            $_SESSION['email'] = '';
        }
        
    }

	/**
	 * Check the $_SERVER['HTTP_ACCEPT_LANGUAGE'] and set
	 * the $this->language variable for one that is found from data.
	 * If nothing is found, default to Finnish.
	 */
	public function checkRequestedLanguage()
	{
		$this->language = 'fi';
	}
	
	/**
	 * Remove "www" prefix from the URL and redirect.
	 */
	public function removeWwwRedirect()
	{
		if (substr($_SERVER['HTTP_HOST'], 0, 3) == 'www')
		{
			$go = 'http://' . substr($_SERVER['HTTP_HOST'], 4) . $_SERVER['REQUEST_URI'];
			header('HTTP/1.1 301 Moved Permanently');
			header('Location: ' . $go);
			exit();
		}
	}

	/**
	 * Check the $_SERVER['REQUEST_URI'] and set
	 * the $this->currentPage variable for one that is found from navigation.
	 * If nothing is matched, redirect to front page.
	 * Matching is done first against application URLs and then content URLs via "nav".
	 */
	public function checkRequestedPage()
	{
		if (!isset($_SERVER['REQUEST_URI']))
		{
			// How come, super variable not set?
			return false;
		}
		if (!isset($this->appData['navigation']))
		{
			return false;
		}

		$url = $_SERVER['REQUEST_URI']; // use as such

		// URLs should only be lowercase, thus check and redirect later
		$lowercase = strtolower($url);

		if (array_key_exists($lowercase, $this->appUrls))
		{
			// Application internal URLs
			$this->currentPage = $lowercase;
			$this->isInternalPage = true;
		}
		else
		{
			// Content
			$found = false;
			$data = $this->appData['navigation'];
			foreach($data as $lang => $nav)
			{
				foreach($nav as $item)
				{
					if ($lowercase == $item['0'])
					{
						$this->currentPage = $lowercase;
						$found = true;

						// How about language? just stick to default for now.
						if ($item['0'] != '/')
						{
							//$this->language = $lang;
						}
					}
				}
			}

			if (!$found)
			{
				$this->redirectTo('/');
			}
			else
			{
				// Was the address found in lowercase?
				if ($this->currentPage != $url)
				{
					$this->redirectTo($this->currentPage);
				}
			}
		}
	}

	/**
	 * Build a regular page with the content as per request.
	 */
	public function renderPage()
	{
		if ($this->isInternalPage)
		{
            // These functions return a string or false on failure.
            $out = call_user_func(array($this, $this->appUrls[$this->currentPage]));
            
			header('Content-type: application/json');
			if ($out !== false)
			{
                return json_encode(array('answer' => 'failed'));
			}
			return json_encode(array('answer' => $out));
		}
		else
		{
			$out = $this->createHtmlHeadBody(array(
				'fonts.css',
				'colorbox.css',
				'main.css'
			));
			$out .= $this->createNavigation();
			$out .= '<div id="wrapper">';
			$out .= $this->createLogo();
			$out .= $this->createArticle();
			$out .= '</div>';
			$out .= $this->createFooter();
			$out .= $this->createEndBodyJavascript(array(
				'jquery.js',
				'jquery.colorbox.js',
				'wymeditor/jquery.wymeditor.js',
				'naginata.js'
			));
		}


		header('Content-type: text/html');
		if ($this->useTidy && extension_loaded('tidy'))
		{
			$config = array(
				'indent' => true,
				'output-xml' => true,
				'input-xml' => true,
				'wrap' => '1000'
			);

			$tidy = new tidy();
			$tidy->parseString($out, $config, 'utf8');
			$tidy->cleanRepair();
			return tidy_get_output($tidy);
		}
		else
		{
			return $out;
		}
	}

	/**
	 * Create the common head section with style sheet imports.
	 *
	 * @param	array	$styles	List of source files in "css" folder
	 * @return	string
	 */
	private function createHtmlHeadBody($styles)
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
		$out .= '<title>' . $title . ' - Naginata Suomessa</title>';
		$out .= '<meta charset="utf-8"/>';
        $out .= '<meta property="og:type" content="sport"/>';
        $out .= '<link rel="author" href="http://paazmaya.com"/>';
        $out .= '<link rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/"/>';
		$out .= '<link rel="shortcut icon" href="/img/favicon.png" type="image/png"/>';
		$out .= '<link rel="apple-touch-icon" href="/img/mobile-logo.png"/>'; // 57x57

		if ($this->useMinification)
		{
			$this->minify('css', $styles);
            $this->minifyFile('js', 'modernizr.js');
			$out .= '<link rel="stylesheet" href="' . $base . $this->minifiedName . 'css" type="text/css" media="all" />';
            $out .= '<script type="text/javascript" src="/js/modernizr.min.js"></script>';
		}
		else
		{
			foreach($styles as $css)
			{
				$out .= '<link rel="stylesheet" href="' . $base . $css . '" type="text/css" media="all" />';
			}
            $out .= '<script type="text/javascript" src="/js/modernizr.js"></script>';
		}
		$out .= '</head>';


		// try out different fonts
		$fonts = array(
			'fontarmata',
			'fontlora'
		);
		$len = count($fonts);
		$_SESSION['fontcounter']++;
		if ($_SESSION['fontcounter'] >= $len)
		{
			$_SESSION['fontcounter'] = 0;
		}

		$font = $fonts[$_SESSION['fontcounter']];


		$out .= '<body class="' . $font . '">';
		return $out;
	}

	/**
	 * Create a simple div with logo specific id and text changing per language.
	 *
	 * @return	string
	 */
	private function createLogo()
	{
		if (!$this->isDataAvailable('title'))
		{
			return '<p class="fail">Title data missing</p>';
		}

		$out = '<div id="logo">';
		// should be only two words
		$out .= '<p>' . $this->appData['title'][$this->language] . '</p>';
		$out .= '</div>';
		return $out;
	}

	/**
	 * Navigation block for HTML5
	 *
	 * @return	string
	 */
	private function createNavigation()
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
	private function createArticle()
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
	private function createFooter()
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

		$out .= '<time datetime="' . date('c', $this->modified) . '">' . date('j.n.Y G:i', $this->modified) . '</time>';
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
	private function createEndBodyJavascript($scripts)
	{
		$base = '/js/';
		$out = '';

		if ($this->useMinification)
		{
			$this->minify('js', $scripts);
			$out .= '<script type="text/javascript" src="' . $base . $this->minifiedName . 'js"></script>';
		}
		else
		{
			foreach($scripts as $js)
			{
				$out .= '<script type="text/javascript" src="' . $base . $js . '"></script>';
			}
		}
		$out .= '</body>';
		$out .= '</html>';
		return $out;
	}

	/**
	 * Load the JSON data if available
	 */
	private function loadData()
	{
		if ($this->dataPath != '' && file_exists($this->dataPath))
		{
			$json = file_get_contents($this->dataPath);
			$this->appData = json_decode($json, true);
			$this->modified = filemtime($this->dataPath);

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
		if ($this->dataPath != '' && $this->isLoggedIn)
		{
			$jsonstring = $this->jsonPrettyPrint(json_encode($this->appData)); // PHP 5.4 onwards JSON_PRETTY_PRINT
			file_put_contents($this->dataPath, $jsonstring);
			$this->modified = time();
		}
	}

	/**
	 * Save JSON data for moderation in the same location as the original
	 */
	private function saveDataModeration()
	{
        if ($this->isLoggedIn)
        {
            $time = date('Y-m-d_H-i-s');
            $path = substr($this->dataPath, 0, strrpos($this->dataPath, '.')) . '.' . $time . '.' . $this->userEmail . '.json';
            $jsonstring = $this->jsonPrettyPrint(json_encode($this->appData)); // PHP 5.4 onwards JSON_PRETTY_PRINT
            file_put_contents($path, $jsonstring);
        }
	}

	/**
	 * There seems to be a request for updating an article.
	 * Checks required data from $_POST and creates a diff.
     * User must be logged in to perform this.
	 *
	 * @return	string/boolean	Diff or false
	 */
	private function pageUpdateArticle()
	{
		$required = array(
			'lang',
			'page',
			'content'
		);
        $received = $this->checkRequiredPost($required);
        if ($received === false || !$this->isLoggedIn)
        {
            return false;
        }
        
		// In app data, under "article", object named by "lang", has object with "page" is an array.
		// $this->appData['article'][$this->language][$this->currentPage];
		if (isset($this->appData['article']) &&
			isset($this->appData['article'][$received['lang']]) &&
			isset($this->appData['article'][$received['lang']][$received['page']]) &&
			is_array($this->appData['article'][$received['lang']][$received['page']]) &&
			count($this->appData['article'][$received['lang']][$received['page']]) > 0)
		{
			// For now just using the first item in the array
			$current = $this->appData['article'][$received['lang']][$received['page']]['0'];

			// Save the data for later moderation
			$this->appData['article'][$received['lang']][$received['page']]['0'] = $received['content'];
			$this->saveDataModeration();

			// Create diff for sending it via email
			$a = explode("\n", $current);
			$b = explode("\n", $received['content']);

			require $this->libPath . '/php-diff/Diff.php';
			require $this->libPath . '/php-diff/Diff/Renderer/Text/Unified.php';

			$diff = new Diff($a, $b);
			$renderer = new Diff_Renderer_Text_Unified;
			$out = $diff->render($renderer);
			return $out;
		}
		return false;
	}
    
    /**
     * Save Modernizr statistics
     */
    private function pageReceiveModernizrStats()
    {
        $required = array(
			'lang',
			'page',
			'content'
		);
        $received = $this->checkRequiredPost($required);
        if ($received === false)
        {
            return false;
        }
    }
    
    /**
     * Try to authenticate the user via OAuth.
     * The email provider should tell if the user is who she/he/it claims to be.
     */
    private function pageAuthenticateUser()
    {
        $required = array(
			'lang',
			'page',
			'content'
		);
        $received = $this->checkRequiredPost($required);
        if ($received === false)
        {
            return false;
        }
        
		require $this->libPath . '/oauth2-php/OAuth2.php';
        
        //$this->isLoggedIn
        //$this->userEmail
    }
    
    /**
     * Check $_POST against the given $required array.
     * @return array/boolean    False if any of the required is missing, else escaped data
     */
    private function checkRequiredPost($required)
    {
		$received = array();
		foreach($required as $r)
		{
			if (isset($_POST[$r]) && $_POST[$r] != '')
			{
				$received[$r] = $this->encodeHtml($_POST[$r]);
			}
		}

		if (count($required) !== count($received))
		{
			return false;
		}
        return $received;
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
	 * Redirect the client to the given URL with 301 HTTP code.
	 * @param	string	$url	Redirect to this URL within this domain
	 */
	private function redirectTo($url)
	{
		$log = date($this->logDateFormat) . ' ' . $_SERVER['REQUEST_URI'] . ' --> ' . $url;
		file_put_contents($this->redirectLog, $log, FILE_APPEND);
		header('HTTP/1.1 301 Moved Permanently');
		header('Location: http://' . $_SERVER['HTTP_HOST']) . $url;
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
	 * Combines and minifies the given local files.
	 * That is if the resulting minified file does not exist yet,
	 * nor it is not older than any of the given files.
	 *
	 * @param string $type	Either js or css
	 * @param array $files	List of files location in the public_html/[type]/ folder
	 * @return boolean True if the resulting file was updated, false is anything was wrong
	 */
	private function minify($type, $files)
	{
		if (!is_array($files) || count($files) == 0)
		{
			return false;
		}
		// Where can those files be found, under type
		$base = realpath('../public_html/' . $type) . '/';

		// Are there newer source files than the single output file?
		$newerexists = false;

		// Return value will be this, did the minified file need an update
		$wrote = false;

		// Keep log of what has happened and how much the filesizes were reduced.
		$log = array();

		if ($type == 'js')
		{
			require_once $this->libPath . '/minify/Minify/JS/ClosureCompiler.php';
		}
		else if ($type == 'css')
		{
			require_once $this->libPath . '/minify/Minify/CSS/Compressor.php';
		}
		else
		{
			return false;
		}

        $data = array();
        foreach($files as $file)
        {
            $minified = $this->minifyFile($type, $file);
            if ($minified !== false)
            {
                $data[] = '/* ' . $file . ' */' . "\n" . $minified;
            }
        }

        $outfile = $base . $this->minifiedName . $type;
        $outfilegz = $base . $this->minifiedName . 'gz.' . $type;
      
        $alldata = implode("\n\n", $data);
        $bytecount = file_put_contents($outfile, $alldata);
        $log[] = date($this->logDateFormat) . ' outfile: ' . $outfile . ', size: ' . $bytecount;

        if ($bytecount !== false)
        {
            $gz = gzopen($outfilegz, 'wb9');
            gzwrite($gz, $alldata);
            gzclose($gz);
            $wrote = true;
            $log[] = date($this->logDateFormat) . ' outfilegz: ' . $outfilegz . ', size: ' . filesize($outfilegz);
        }

		file_put_contents($this->minifyLog, implode("\n", $log), FILE_APPEND);

		return $wrote;
	}
    
    /**
     * Minify a single file. Adds ".min" to the filename before the suffix.
     * 
	 * @param   string  $type	Either js or css
	 * @param   string  $file	Name of the file in public_html/[type]/ folder
	 * @return  string/boolean  Minified output or flase if something went wrong
     */
    private function minifyFile($type, $file)
    {
		// Keep log of what has happened and how much the filesizes were reduced.
		$log = array();
        
        // Absolute path of the given file
        $source = realpath('../public_html/' . $type) . '/' . $file;
        
        if (file_exists($source))
        {
            $doMinify = true;
            $mtime_src = filemtime($source);
            
            $p = explode('.', $file);
            
            // Remove suffix temporarily for the ".min" check
            if (end($p) == $type)
            {
                unset($p[count($p) - 1]);
            }
            
            // If the filename has a ".min" appended in the end, its content is used as such.
            if (end($p) == 'min')
            {
                $destination = $source;
                $doMinify = false;
            }
            else
            {
                // Rebuild the name by including ".min" in the end
                $p[] = 'min';
                $p[] = $type;
                $destination = $base . implode('.', $p);
            }

            $log[] = date($this->logDateFormat) . ' source: ' . $source . ', size: ' . filesize($source);

            $minified = '';
            if (file_exists($destination))
            {
                $mtime_des = filemtime($destination);
                if ($mtime_src <= $mtime_des)
                {
                    $doMinify = false;
                    $minified = file_get_contents($destination);
                }
            }

            if ($doMinify)
            {                    
                $content = file_get_contents($source);
                $failed = false;
                if ($type == 'js')
                {
                    try
                    {
                        $minified = Minify_JS_ClosureCompiler::minify($content);
                    }
                    catch (Exception $error)
                    {
                        $log[] = date($this->logDateFormat) . ' ERROR: ' . $error->getMessage() . ' while JS source: ' . $source;
                        $failed = true;
                    }
                }
                else if ($type == 'css')
                {
                    try
                    {
                        $minified = Minify_CSS_Compressor::process($content);
                    }
                    catch (Exception $error)
                    {
                        $log[] = date($this->logDateFormat) . ' ERROR: ' . $error->getMessage() . ' while CSS source: ' . $source;
                        $failed = true;
                    }
                }
                
                if (!$failed)
                {
                    file_put_contents($destination, $minified);
                    $log[] = date($this->logDateFormat) . ' destination: ' . $destination . ', size: ' . filesize($destination);
                }
            }
        }
        
		file_put_contents($this->minifyLog, implode("\n", $log), FILE_APPEND);
        
        return $failed ? false : $minified;
    }
	
	/**
	 * Send email to the given address with the given content.
	 * Sends a blind copy to the sender address.
	 *
	 * @param string $toMail	Email address of the recipient
	 * @param string $toName	Name of the recipient
	 * @param string $subject	Subject of the mail
	 * @param string $message	Text format of the mail
	 * @return boolean	True if the sending succeeded
	 */
	function sendEmail($toMail, $toName, $subject, $message)
	{
		global $cf;
		require_once $this->libPath . '/phpmailer/class.phpmailer.php';

		$mail = new PHPMailer();
		
		$mail->IsSMTP();
		$mail->Host = $this->config['email']['smtp'];
		$mail->SMTPAuth = true;
		$mail->Username = $this->config['email']['address'];
		$mail->Password = $this->config['email']['password'];

		$sender = 'NAGINATA.fi';
		//mb_internal_encoding('UTF-8');
		$sender = mb_encode_mimeheader($sender, 'UTF-8', 'Q');

		$mail->SetFrom($this->config['email']['address'], $sender);

		$mail->Version = $this->VERSION;

		$mail->AddAddress($toMail, $toName);
		$mail->AddBCC($this->config['email']['address'], $mail->FromName);
		//Content-Language

		$mail->WordWrap = 80;
		$mail->IsHTML(false);
				
		$mail->Subject = $subject;
		$mail->Body = $message;

		return $mail->Send();
		// $mail->ErrorInfo;
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
