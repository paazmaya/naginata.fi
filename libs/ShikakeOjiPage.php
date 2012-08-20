<?php
/***************
 * NAGINATA.fi *
 ***************
 * Juga Paazmaya <olavic@gmail.com>
 * http://creativecommons.org/licenses/by-sa/3.0/
 *
 * A class for outputting HTML5 stuff.
 * Let's see how many times the buzzword HTML5 can be repeated.
 *
 * Usage:
 *  $shih = new ShikakeOjiPage();
 *  echo $shih->renderHtml();
 */
class ShikakeOjiPage
{
	/**
	 * Unix timestamp of the last modification of the given page.
	 * ...assuming there is a page set.
	 */
	public $pageModified = 0;

    /**
     * List of Cascaded Style Sheet files that are minified into one
     * Should be relative to public_html/css/
     */
    public $styles = array(
        'fonts.css',
        'colorbox.css',
        'main.css'
    );

    /**
     * List of Javascript files that are minified into one.
     * Should be relative to public_html/js/
     */
    public $scripts = array(
        'jquery.js', // 1.8.0
        'jquery.colorbox.js', // 1.3.19
        'jquery.swfobject.js', // 1.1.1
        'jquery.outerhtml.js', //
        'sendanmaki.js'
    );

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
     * How will JS and CSS files will be called once minified in to one file per type?
     * If compression is supported, the client will receive the one with gz, and
     * that will be appended to this variable, "gz." that is.
     * For example:
     * naginata.min --> js/naginata.min.js and naginata.min.gz.js
     * --> css/naginata.min.css and css/naginata.min.gz.css
     */
    public $minifiedName = 'naginata.min.';

    /**
     * Log for minification. Entry added every time minification is needed.
     */
    public $minifyLog = '../naginata-minify.log';

    /**
     * CURL log
     */
    public $curlLog = '../naginata-curl.log';

    /**
     * Cache directory
     */
    public $cacheDir = '../cache/';

    /**
     * How long should the 3rd party JSON files be cached?
     * In seconds. (60 * 60 * 24 * 7 * 2) = 2 weeks
     */
    public $cacheInterval;

    /**
     * Special fields to be prosessed in the content. It is always a 3rd party service.
     * [flickr|image id]
     * [youtube|video id]
	 * [local|image name in public_html/img/]
     */
    private $specialFields = array(
        'flickr' => 'renderFlickr',
        'youtube' => 'renderYoutube',
        'vimeo' => 'renderVimeo',
		'local' => 'renderLocalImage'
    );

	/**
	 * Instance of a ShikakeOji class.
	 */
	private $shikakeOji;
	
	/**
	 * Markup for navigation
	 */
	private $navigation;
	
	/**
	 * Data used for the head section
	 */
	private $head;
	
	/**
	 * Id of this page in table naginata_page if any.
	 */
	private $pageId = -1;

    /**
     * Constructor does not do much.
     */
    function __construct($shikakeOji)
    {
		if (!isset($shikakeOji) || !is_object($shikakeOji))
		{
			return false;
		}

		// Must be defined in order to access data and config.
		$this->shikakeOji = $shikakeOji;

        // Calculate interval time for 2 week of seconds.
        $this->cacheInterval = (60 * 60 * 24 * 7 * 2);
		
		// Create navigation for later use
        $navigation = '';
        $sql = 'SELECT * FROM naginata_page WHERE lang = \'' . $this->shikakeOji->language . '\' ORDER BY weight ASC';
        $run = $this->shikakeOji->database->query($sql);
        if ($run)
        {
            while ($res = $run->fetch(PDO::FETCH_ASSOC))
            {
				$navigation .= '<li';
				if ($this->shikakeOji->currentPage == $res['url'])
				{
					$navigation .= ' class="current"';
					$this->head = $res; // head section data
					$this->pageId = $res['id']; // page_id for naginata_article
				}
				$navigation .= '><a href="' . $res['url'] . '" title="' . $res['header'] . '" rel="prefetch">' . $res['title'] . '</a></li>';
            }
        }
		$this->navigation = $navigation;
		
		// Require few libraries
		require $this->shikakeOji->libPath . '/minify/Minify/JS/ClosureCompiler.php';
		require $this->shikakeOji->libPath . '/minify/Minify/CSS/Compressor.php';
    }

    /**
     * Render the HTML5 markup by the appData and options.
     */
    public function renderHtml()
    {
        $out = $this->createHtmlPage();

        if ($this->useTidy && extension_loaded('tidy'))
        {
            $conf = array(
                'indent' => true,
                'output-xml' => true,
                'input-xml' => true,
                'wrap' => '200'
            );

            $tidy = new tidy();
            $tidy->parseString($out, $conf, 'utf8');
            $tidy->cleanRepair();
            return tidy_get_output($tidy);
        }
        else
        {
            return $out;
        }
    }

    /**
     * Render the Modernizr statistics table.
     * http://html5doctor.com/element-index/
     */
    public function renderModernizrTable()
    {
		$data = $this->shikakeOji->appData;
		
		$this->head = array(
			'title' => 'Modernizr Statistics',
			'header' => 'Modernizr Statistics',
			'description' => 'Modernizr Statistics'
		);
		
		$out = $this->createHtmlHead($data['title'][$this->shikakeOji->language]);

        // cache keys, some 70 maybe...
        $sql = 'SELECT * FROM mdrnzr_key ORDER BY title ASC';
        $run = $this->shikakeOji->database->query($sql);
        $keys = $run->fetchAll(PDO::FETCH_ASSOC);

        $out .= '<table class="stats">';
        $out .= '<caption>Total of Modernizr tests: ' . count($keys) . '</caption>';

		$sql = 'SELECT hasthis, COUNT(id) AS total FROM mdrnzr_value WHERE key_id = ? GROUP BY hasthis ORDER BY client_id ASC';
		$pre = $this->shikakeOji->database->prepare($sql);
		
        foreach ($keys as $key)
        {
			$out .= '<tr>';
            $out .= '<th data-key-id="' . $key['id'] . '">' . $key['title'] . '</th>';
			$out .= '<td>';
			$item = $pre->execute(array($key['id']));
			if ($item)
			{
				$rows = $pre->fetchAll(PDO::FETCH_ASSOC);
				$list = array();
				foreach ($rows as $row)
				{
					$list[] = $row['hasthis'] . ' (' . $row['total'] . ')';
				}
				$out .= implode(', ', $list);
			}
			$out .= '</td>';
			$out .= '</tr>';
        }
        $out .= '</table>';
		
        // get all clients. only the latest for same address and useragent
        $sql = 'SELECT COUNT(id) AS counter, useragent FROM mdrnzr_client GROUP BY useragent ORDER BY counter DESC';
        $run = $this->shikakeOji->database->query($sql);
        $agents = $run->fetchAll(PDO::FETCH_ASSOC);
		
		$out .= '<ol>';
		foreach ($agents as $row) 
		{
			$out .= '<li>' . $row['useragent'] . ' (' . $row['counter'] . ')</li>';
		}
		$out .= '</ol>';
		
		$out .= $this->createHtmlFooter($data['footer'][$this->shikakeOji->language]);

        return $out;
    }

    /**
     * Encode HTML entities for a block of text
     *
     * @param     string/array    $str
     * @return    string/array
     */
    public static function encodeHtml($str)
    {
        if (is_array($str))
        {
            foreach($str as $k => $s)
            {
                $str[$k] = self::encodeHtml($s);
            }
            return $str;
        }
        else
        {
            return htmlentities(trim($str), ENT_QUOTES, 'UTF-8');
        }
    }

    /**
     * Decode HTML entities from a block of text
     *
     * @param     string/array    $str
     * @return    string/array
     */
    public static function decodeHtml($str)
    {
        if (is_array($str))
        {
            foreach($str as $k => $s)
            {
                $str[$k] = self::decodeHtml($s);
            }
            return $str;
        }
        else
        {
            return html_entity_decode(trim($str), ENT_QUOTES, 'UTF-8');
        }
    }

    /**
     * Pretty print some JSON
     * http://fi.php.net/manual/en/function.json-encode.php#80339
     *
     * @param    string    $json    A string encoded as JSON
     * @return    string
     */
    public static function jsonPrettyPrint($json)
    {
        $tab = "    ";
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
     * Create the whole HTML5 markup with content specific to this page and login status.
     * http://html5doctor.com/element-index/
     *
     * Remember to validate http://validator.w3.org/
     *
     * @return    string    HTML5 markup
     */
    private function createHtmlPage()
    {
        if (!isset($this->head))
        {
            return '<p class="fail">Navigation data for this page missing</p>';
        }
		
		$data = $this->shikakeOji->appData;
		
        $pdo = $this->shikakeOji->database; // used only twice but anyhow for speed...

		$out = $this->createHtmlHead($data['title'][$this->shikakeOji->language]);


		$latest = 0;
        $sql = 'SELECT content, modified FROM naginata_article WHERE page_id = \'' .
			$this->pageId . '\' AND published = 1 ORDER BY modified DESC LIMIT 1';
        $run = $pdo->query($sql);
        if ($run)
        {
            while ($res = $run->fetch(PDO::FETCH_ASSOC))
			{
				$out .= '<article data-data-modified="' . $res['modified'] . '">';
				$out .= $this->findSpecialFields(self::decodeHtml($res['content']));
				$out .= '</article>';

				$latest = max($latest, $res['modified']);
			}
        }
        else
        {
            return '<p class="fail">Article data for this page missing</p>';
        }

		// Set the latest modification time for header info
		$this->pageModified = $latest;


		$out .= $this->createHtmlFooter($data['footer'][$this->shikakeOji->language]);

        return $out;
    }
	
	/**
	 * Create HTML5 head
	 * $title = $data['title'][$this->shikakeOji->language]
	 */
	private function createHtmlHead($title)
	{
		// None of the OGP items validate, as well as using prefix in html element...
        $out = '<!DOCTYPE html>';
        $out .= '<html lang="' . $this->shikakeOji->language . '"';
		//$out .= ' manifest="applicaton.cache"'; // http://www.html5rocks.com/en/tutorials/appcache/beginner/
		if (strpos($_SERVER['HTTP_USER_AGENT'], 'facebookexternalhit') !== false)
		{
			$out .= ' prefix="og:http://ogp.me/ns#"'; // http://dev.w3.org/html5/rdfa/
		}
		$out .= '>';
        $out .= '<head>';
        $out .= '<meta charset="utf-8"/>';
        $out .= '<title>' . $this->head['header'] . ' | ' . $title . '</title>';
        $out .= '<meta name="description" content="' . $this->head['description'] . '"/>';
        $out .= '<link rel="shortcut icon" href="/img/favicon.png" type="image/png"/>';

		if (strpos($_SERVER['HTTP_USER_AGENT'], 'facebookexternalhit') !== false)
		{
			// http://ogp.me/
			$out .= '<meta property="og:title" content="' . $this->head['title'] . '"/>';
			$out .= '<meta property="og:description" content="' . $this->head['description'] . '"/>';
			$out .= '<meta property="og:type" content="sports_team"/>';
			
			// All the images referenced by og:image must be at least 200px in both dimensions.
			$out .= '<meta property="og:image" content="http://' . $_SERVER['HTTP_HOST'] . '/img/logo-200x200.png"/>';
			
			$out .= '<meta property="og:url" content="http://' . $_SERVER['HTTP_HOST'] . $this->shikakeOji->currentPage . '"/>';
			$out .= '<meta property="og:site_name" content="' . $this->head['title'] . '"/>';
			$out .= '<meta property="og:locale" content="fi_FI"/>'; // language_TERRITORY
			$out .= '<meta property="og:locale:alternate" content="en_GB"/>';
			$out .= '<meta property="og:locale:alternate" content="ja_JP"/>';
			//$out .= '<meta property="og:country-name" content="Finland"/>';

			// https://developers.facebook.com/docs/opengraph/
			$out .= '<meta property="fb:app_id" content="' . $this->shikakeOji->config['facebook']['app_id'] . '"/>'; // A Facebook Platform application ID that administers this page.
			$out .= '<meta property="fb:admins" content="' . $this->shikakeOji->config['facebook']['admins'] . '"/>';
		}

        // http://microformats.org/wiki/rel-license
        $out .= '<link rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/"/>';
        $out .= '<link rel="author" href="http://paazmaya.com"/>';

		// https://developer.apple.com/library/safari/#documentation/appleapplications/reference/safariwebcontent/configuringwebapplications/configuringwebapplications.html
        $out .= '<link rel="apple-touch-icon" href="/img/mobile-logo.png"/>'; // 57x57

        $base = '/css/';

		// CodeMirror only if logged in
		if ($this->shikakeOji->isLoggedIn)
		{
			$out .= '<link rel="stylesheet" href="/js/codemirror/codemirror.';
			if ($this->useMinification)
			{
				$this->minifyFile('css', 'js/codemirror/codemirror.css'); // 2.25
				$out .= 'min.';
			}
			$out .= 'css" type="text/css" media="all" />';
		}
		
        if ($this->useMinification)
        {
            $this->minify('css', $this->styles);
            $out .= '<link rel="stylesheet" href="' . $base . $this->minifiedName . 'css" type="text/css" media="all" />';

            $this->minifyFile('js', 'js/modernizr.js'); // 2.5.3
            $out .= '<script type="text/javascript" src="/js/modernizr.min.js"></script>';
			
        }
        else
        {
            foreach ($this->styles as $css)
            {
                $out .= '<link rel="stylesheet" href="' . $base . $css . '" type="text/css" media="all" />';
            }
            $out .= '<script type="text/javascript" src="/js/modernizr.js"></script>';
        }
        $out .= '</head>';

        $out .= '<body>';
		
		
        $out .= '<nav><ul>' . $this->navigation . '</ul></nav>';

        $out .= '<div id="wrapper">';

        // div#logo tag shall contain all the message data, if needed
        $out .= '<div id="logo"';
        $out .= ' data-login-success="Olet kirjautunut, nyt on hauskaa." data-login-failure="Kirjautuminen meni pieleen, voi pahus."';
        // Check for possible OpenID login try out.
        if (isset($_SESSION['msg-login-success']))
        {
            $out .= ' data-msg-login-success="' . ($_SESSION['msg-login-success'] ? 1 : 0) . '"';
            unset($_SESSION['msg-login-success']);
        }
        $out .= '>';

        // should be only two words
        $out .= '<p>' . $title . '</p>';
        $out .= '</div>';

        $out .= '<header>';
        $out .= '<h1>' . $this->head['header'] . '</h1>';
        $out .= '<p>' . $this->head['description'] . '</p>';
        $out .= '</header>';
		
		return $out;
	}
	
	/**
	 * Create HTML5 footer.
	 * $data = $data['footer'][$this->shikakeOji->language]
	 */
	private function createHtmlFooter($data)
	{
        $out = '</div>';
		
        $out .= '<footer>';
        $out .= '<p>';
		
		// Last modification date
		$data[] = array(
			'url' => 'http://github.com/paazmaya/naginata.fi',
			'alt' => 'Tällä sivulla olevaa sisältöä on muokattu viimeksi ' . date('j.n.Y G:i', $this->pageModified),
			'text' => 'Muokattu viimeksi ' . date('j.n.Y G:i', $this->pageModified)
		);

        $links = array();
        foreach ($data as $item)
        {
			$a = '<a href="' . $item['url'] . '" title="' . $item['alt'] . '"';
			if (isset($item['data']))
			{
				// $(this).data('hover')
				$a .= ' data-hover="' . $item['data'] . '"';
			}
			$a .= '>' . $item['text'] . '</a>';
            $links[] = $a;
        }

        $out .= implode('|', $links);

        // TODO: #contribute text change per login status
        $out .= '</footer>';

        $base = '/js/';
		
		// Include CodeMirror if user logged in
		if ($this->shikakeOji->isLoggedIn)
		{
			$codemirror = array(
				'codemirror.js',
				'util/closetag.js',
				'mode/xml/xml.js',
				'mode/javascript/javascript.js',
				'mode/htmlmixed/htmlmixed.js'
			);
			$combinedName = 'codemirror-set.min.js';
			
			$cmData = '';
			$mtime = 0;
			if (file_exists('js/' . $combinedName))
			{
				$mtime = filemtime('js/' . $combinedName);
			}
			$rebuild = false;
			
			foreach ($codemirror as $code)
			{
				if ($this->useMinification)
				{
					if ($mtime < filemtime('js/codemirror/' . $code))
					{
						$rebuild  = true;
					}
					$cmData .= file_get_contents('js/codemirror/' . $code);
				}
				else
				{
					$out .= '<script src="/js/codemirror/' . $code . '"></script>';
				}
			}
			
			if ($this->useMinification)
			{
				if ($rebuild)
				{
					file_put_contents('js/' . $combinedName, $cmData);
					$this->minifyFile('js', 'js/' . $combinedName);
				}
				$out .= '<script src="/js/' . $combinedName . '"></script>';
			}
			
			
		}

        if ($this->useMinification)
        {
            $this->minify('js', $this->scripts);
            $out .= '<script type="text/javascript" src="' . $base . $this->minifiedName . 'js"></script>';
        }
        else
        {
            foreach($this->scripts as $js)
            {
                $out .= '<script type="text/javascript" src="' . $base . $js . '"></script>';
            }
        }
		

        $out .= '</body>';
        $out .= '</html>';
		
		return $out;
	}

    /**
     * Find and replace all the special fields listed in $this->specialFields
     * and call then the specific "render" method for that 3rd party service
     * @param    string    $str    Content to be searched
     * @return    string    Replaced content, if any
     */
    private function findSpecialFields($str)
    {
        foreach($this->specialFields as $key => $value)
        {
            $search = '/' . preg_quote('[' . $key . '|') . '(.*?)' . preg_quote(']') . '/i';
            $str = preg_replace_callback($search, array($this, $this->specialFields[$key]), $str);
        }
        return $str;
    }
	
	/**
	 * The most simple image rendering option as the image in question
	 * is stored locally at the server.
	 * Also the image is shown as is, no linking to a higher resolution exists.
	 * Hope that the file name is descriptive as it is used for alternative text.
	 */
	private function renderLocalImage($matches)
	{
		$imgDir = '../public_html/img/';
		
        $out = '';
		
		if (isset($matches['1']) && $matches['1'] != '')
        {
			if (file_exists($imgDir . $matches['1']))
			{
				$alt = ucwords(str_replace('-', ' ', substr($matches['1'], 0, strrpos($matches['1'], '.'))));
				$size = getimagesize($imgDir . $matches['1']);
				$out .= '<div class="medialocal" data-key="local|' . $matches['1'] . '"><img src="/img/' . $matches['1'] . '" alt="' . 
					$alt . '" width="' . $size['0'] . '" height="' . $size['1'] . '" /></div>';
			}
		}
		
		return $out;
	}

    /**
     * Get the given Flickr data and render it as image thumbnails.
     * If there is just a single stinr, then it must be an image id.
     * If there are more parameters, separated by commas, then it should be
     * a specific API call with several pictures returned.
     */
    public function renderFlickr($matches)
    {
        $out = '';

        $params = array(
            'api_key' => $this->shikakeOji->config['flickr']['apikey'],
            'format' => 'json', // Always using JSON
            'nojsoncallback' => 1,
            'method' => 'flickr.photos.search'
        );

        if (isset($matches['1']) && $matches['1'] != '')
        {
            $list = explode(',', $matches['1']);

            if (count($list) > 1)
            {
				// Multiple items, thus 'ul.imagelist'
                $params['per_page'] = 63;

                foreach($list as $item)
                {
                    $a = explode('=', $item);
                    if (count($a) == 2)
                    {
                        $params[$a['0']] = $a['1'];
                    }
                }
                ksort($params);
                $cache = $this->cacheDir . 'flickr';
                foreach($params as $k => $v)
                {
                    $cache .= '_' . $k . '-' . $v;
                }
                $cache .= '.json';

                //'user_id' => '14224905@N08',
                //'tags' => 'naginata',
                //'content_type' => 1
            }
            else
            {
                $cache = $this->cacheDir . 'flickr_' . $matches['1'] . '.json';
                $params['method'] = 'flickr.photos.getInfo';
                $params['photo_id'] = $matches['1'];

            }

            $url = 'http://api.flickr.com/services/rest/?' . http_build_query($params, NULL, '&');
            $feed = $this->getDataCache($cache, $url);
            $data = json_decode($feed, true);

            if (!isset($data))
            {
                return '<!-- flickr failed ' . $matches['1'] . ' -->';
            }

            if ($data['stat'] != 'ok')
            {
                return '<!.-- ' . $data['stat'] . ' -->';
            }

            if (count($list) > 1)
            {
                $out .= $this->renderFlickrList($data, $matches['1']);
            }
            else
            {
                // and flickr.photos.getSizes
                $cache = $this->cacheDir . 'flickr_' . $matches['1'] . '_sizes.json';
                $params['method'] = 'flickr.photos.getSizes';
                $url = 'http://api.flickr.com/services/rest/?' . http_build_query($params, NULL, '&');
                $feed = $this->getDataCache($cache, $url);
                $sizes = json_decode($feed, true);

                if (!isset($sizes))
                {
                    return '<!-- flickr sizes failed ' . $matches['1'] . ' -->';
                }


                $out .= $this->renderFlickrSingle($data['photo'], $sizes['sizes']['size']);
            }
        }

        return $out;
    }

    /**
     * Display a single picture from Flickr.
     * http://www.flickr.com/services/api/flickr.photos.getInfo.html
     * http://www.flickr.com/services/api/flickr.photos.getSizes.html
     */
    private function renderFlickrSingle($photo, $sizes)
    {
        // http://microformats.org/wiki/geo
        /*
        if (isset($photo['location']) && isset($photo['location']['latitude']) &&
            isset($photo['location']['longitude']))
        {
            $out .= '<span class="geo">' . $photo['location']['latitude'] 34.854133,
            $photo['location']['longitude']  134.67163,
        }
        */

        $collected = array(
			'id' => $photo['id'],
            'title' => $photo['title']['_content'],
            'description' => '',
            //taken 2011-06-09 20:10:17
            'published' => DateTime::createFromFormat('Y-m-d H:i:s', $photo['dates']['taken'], new DateTimeZone('UTC')),
            'href' => 'http://flickr.com/photos/' . $photo['owner']['nsid'] . '/' . $photo['id'],
            'owner' => $photo['owner']['username'],
            'ownerlink' => 'http://flickr.com/people/' . $photo['owner']['nsid']
        );

        $thumbs = array();

        foreach($sizes as $size)
        {
            if ($size['label'] == 'Small')
            {
                $thumbs[] = array(
                    'width' => $size['width'],
                    'height' => $size['height'],
                    'url' => $size['source']
                );
            }
            else if ($size['label'] == 'Large')
            {
                $collected['inline'] = $size['source'];
                $collected['inlinewidth'] = $size['width'];
                $collected['inlineheight'] = $size['height'];
            }
        }
        $collected['thumbs'] = $thumbs;


        return $this->createMediathumb($collected, 'flickr');
    }

    /**
     * List pictures from Flickr.
     * http://www.flickr.com/services/api/flickr.photos.search.html
     */
    private function renderFlickrList($data, $key)
    {
        if (!isset($data['photos']['photo']))
        {
            return '<!-- no pictures -->';
        }
        $out = '<ul class="imagelist" data-key="flickr|' . $key . '">';
        foreach($data['photos']['photo'] as $photo)
        {
            // http://flic.kr/p/{base58-photo-id}
            $url = 'http://farm' . $photo['farm'] . '.static.flickr.com/' . $photo['server'] . '/' . 
				$photo['id'] . '_' . $photo['secret'];
            $out .= '<li>';
            $out .= '<a href="' . $url . '_b.jpg" data-photo-page="http://www.flickr.com/photos/' . 
				$photo['owner'] . '/' . $photo['id'] . '" title="' . $photo['title'] . '">';
            $out .= '<img src="' . $url . '_s.jpg" alt="' . $photo['title'] . '"/>';
            $out .= '</a>';
            $out .= '</li>';
            /*
            $filename = $this->cacheDir . 'flickr_' . $photo['id'] . '_' . $photo['secret'] . '_s.jpg';
            if (!file_exists($filename))
            {
                $img = file_get_contents($url . '_s.jpg');
                file_put_contents($filename, $img);
            }
            */
        }
        $out .= '</ul>';
        return $out;
    }

    /**
     * Show a link to a Youtube video. Javascript will handle opening it to a colorbox.
     * http://code.google.com/apis/youtube/2.0/developers_guide_php.html
     */
    private function renderYoutube($matches)
    {
        if (isset($matches['1']) && $matches['1'] != '')
        {
            $url = 'http://gdata.youtube.com/feeds/api/videos/' . $matches['1'] . '?alt=json&v=2';
            $cache = $this->cacheDir . 'youtube_' . $matches['1'] . '.json';
            $feed = $this->getDataCache($cache, $url);
            $data = json_decode($feed, true);

            if (!isset($data))
            {
                return '<!-- youtube failed ' . $matches['1'] . ' -->';
            }

            // Get the thumbs for this video
            $thumbs = array(); // store 2 which are 120x90
            foreach($data['entry']['media$group']['media$thumbnail'] as $thumb)
            {
                /*
                $name = $this->cacheDir . 'youtube_' . $matches['1'] . '_' . substr($thumb['url'], strrpos($thumb['url'], '/') + 1);
                if (!file_exists($name))
                {
                    $img = file_get_contents($thumb['url']);
                    file_put_contents($name, $img);
                }
                */
                // Want two thumbs that are 120x90
                if ($thumb['height'] == 90 && count($thumbs) < 2)
                {
                    $thumbs[] = $thumb;
                }
            }

            // Z in the date-time stands for Coordinated Universal Time (UTC)
            $collected = array(
				'id' => $matches['1'],
                'thumbs' => $thumbs,
                'title' => $data['entry']['title']['$t'],
                'description' => '',
                'published' => DateTime::createFromFormat('Y-m-d\TH:i:s.000\Z', $data['entry']['published']['$t'], new DateTimeZone('UTC')),
                'href' => 'http://www.youtube.com/watch?v=' . $matches['1'],
                'inline' => 'http://www.youtube.com/v/' . $matches['1'] . '?version=3&f=videos&app=youtube_gdata',
                'inlineflash' => true,
                'owner' => $data['entry']['author']['0']['name']['$t'],
                'ownerlink' => 'http://youtube.com/' . $data['entry']['author']['0']['name']['$t']
            );


            return $this->createMediathumb($collected, 'youtube');
        }
        return '';
    }

    /**
     * Vimeo video link
     */
    private function renderVimeo($matches)
    {
        if (isset($matches['1']) && $matches['1'] != '')
        {
            $url = 'http://vimeo.com/api/v2/video/' . $matches['1'] . '.json';
            $cache = $this->cacheDir . 'vimeo_' . $matches['1'] . '.json';
            $feed = $this->getDataCache($cache, $url);
            $data = json_decode($feed, true);

            if (!isset($data))
            {
                return '<!-- vimeo failed ' . $matches['1'] . ' -->';
            }

            if (is_array($data))
            {
                $data = $data['0'];
            }

            // Save all thumbnails, just for fun...
            /*
            foreach(array('thumbnail_small', 'thumbnail_medium', 'thumbnail_large') as $size)
            {
                $name = $this->cacheDir . 'vimeo_' . $matches['1'] . '_' . substr($data[$size], strrpos($data[$size], '/') + 1);

                if (!file_exists($name))
                {
                    $img = file_get_contents($data[$size]);
                    file_put_contents($name, $img);
                }
            }
            */

            $collected = array(
				'id' => $matches['1'],
                'thumbs' => array(array(
                    'url' => $data['thumbnail_medium'],
                    'width' => 200,
                    'height' => 150
                )),
                'title' => $data['title'],
                'description' => '',
                // 2009-09-10 13:56:53, http://vimeo.com/forums/topic:47127 what timezone is it?
                'published' => DateTime::createFromFormat('Y-m-d H:i:s', $data['upload_date'], new DateTimeZone('UTC')),
                'href' => 'http://vimeo.com/' . $matches['1'],
                'inline' => 'http://vimeo.com/moogaloop.swf?clip_id=' . $matches['1'],
                'inlinewidth' => $data['width'],
                'inlineheight' => $data['height'],
                'inlineflash' => true,
                'owner' => $data['user_name'],
                'ownerlink' => $data['user_url']
            );

            return $this->createMediathumb($collected, 'vimeo');
        }
        return '';
    }

    /**
     * Create the "mediathumb" figure with the given data.
     * $data = array(
	 *   'id' => '2352525252',
     *   'thumbs' => array(
     *     array(
     *       'url' => $data['thumbnail_medium'],
     *       'width' => 200,
     *       'height' => 150
     *     )
     *   ),
     *   'title' => $data['title'],
     *   'description' => '',
     *   'published' => DateTime::createFromFormat('Y-m-d H:i:s', $data['upload_date'], new DateTimeZone('UTC')),
     *   'href' => 'http://vimeo.com/' . $matches['1'],
     *   'inline' => 'http://vimeo.com/moogaloop.swf?clip_id=' . $matches['1'] . '&amp;autoplay=1',
     *   'inlinewidth' => $data['width'],
     *   'inlineheight' => $data['height'],
     *   'inlineflash' => true,
     *   'owner' => $data['user_name'],
     *   'ownerlink' => $data['user_url']
     * );
     * $service = 'vimeo'
     */
    private function createMediathumb($data, $service)
    {
        $out = '<figure class="mediathumb" data-key="' . $service . '|' . $data['id'] . '">';

        $out .= '<a class="' . $service . '" href="' . self::encodeHtml($data['href']) . '" data-url="' .
            self::encodeHtml($data['inline']) . '" title="' . $data['title'] . '"';

        if (isset($data['inlinewidth']) && isset($data['inlineheight']))
        {
            $out .= ' data-width="' . $data['inlinewidth'] . '" data-height="' . $data['inlineheight'] . '"';
        }
        if (isset($data['inlineflash']) && $data['inlineflash'] === true)
        {
            $out .= ' data-type="flash"';
        }
        $out .= '>';

        // playicon will be shown when the link is hovered. hidden by default.
        $out .= '<span class="playicon"></span>';

        if (isset($data['thumbs']))
        {
            if (is_array($data['thumbs']))
            {
                foreach($data['thumbs'] as $img)
                {
                    $out .= '<img src="' . self::encodeHtml($img['url']) . '" alt="' . $data['title'] . '"';

                    if (isset($img['width']))
                    {
                        $out .= ' width="' . $img['width'] . '"';
                    }
                    if (isset($img['height']))
                    {
                        $out .= ' height="' . $img['height'] . '"';
                    }
                    $out .= '/>';
                }
            }
        }

        $out .= '</a>';

        $out .= '<figcaption';
        if (isset($data['published']) && is_object($data['published']))
        {
            $out .= ' title="Julkaistu ' . date('j.n.Y G:i', $data['published']->getTimestamp()) . '"';
        }
        $out .= '>' . $data['title'] . ' / ';
        $out .= '<a href="' . self::encodeHtml($data['ownerlink']) . '" title="' . ucfirst($service) . ' - ' .
            $data['owner'] . '">' . $data['owner'] . '</a>';
        $out .= '</figcaption>';

        $out .= '</figure>';

        return $out;
    }

    /**
     * Get the cached data if available.
     * Update if needed as based on the cache lifetime setting.
     * @return    string    JSON string
     */
    private function getDataCache($cache, $url)
    {
        $update = true;
        if (file_exists($cache))
        {
            $mtime = filemtime($cache);
            if (time() - $mtime < $this->cacheInterval)
            {
                $update = false;
            }
        }

        if ($update)
        {
            if (extension_loaded('curl'))
            {
                $data = $this->getDataCurl($url);
            }
            else
            {
                // Fall back to slower version...
                $data = file_get_contents($url);
            }
            file_put_contents($cache, self::jsonPrettyPrint($data));
        }
        else
        {
            $data = file_get_contents($cache);
        }

        return $data;
    }

    /**
     * Get data from the given URL by using CURL.
     * @return    string    JSON string
     */
    private function getDataCurl($url)
    {
        $fh = fopen($this->curlLog, 'a');

        $ch = curl_init();
        curl_setopt_array($ch, array(
            CURLOPT_URL => $url,
            CURLOPT_HEADER => false,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FAILONERROR => true,
            CURLOPT_STDERR => $fh,
            CURLOPT_VERBOSE => true,
            CURLOPT_REFERER => 'http://naginata.fi' . $this->shikakeOji->currentPage
        ));

        //curl_setopt($ch, CURLOPT_ENCODING, 'gzip');
        //curl_setopt($ch, CURLOPT_USERAGENT, '');

        $results = curl_exec($ch);
        $headers = curl_getinfo($ch);

        $log = date($this->shikakeOji->logDateFormat) . ' url: ' . $headers['url'] . ', content_type: ' .
            $headers['content_type'] . ', size_download: ' . $headers['size_download'] .
            ' bytes, speed_download: ' . $headers['speed_download'] . "\n";
        fwrite($fh, $log);

        $error_number = (int) curl_errno($ch);
        $error_message = curl_error($ch);

        curl_close($ch);

        fclose($fh);

        // invalid headers
        if (!in_array($headers['http_code'], array(0, 200)))
        {
            //throw new Exception('Bad headercode', (int) $headers['http_code']);
        }

        // are there errors?
        if ($error_number > 0)
        {
            //throw new Exception($error_message, $error_number);
        }

        return $results;
    }

    /**
     * Combines and minifies the given local files.
     * That is if the resulting minified file does not exist yet,
     * nor it is not older than any of the given files.
     *
     * @param string $type    Either js or css
     * @param array $files    List of files location in the public_html/[type]/ folder
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

        $data = array();
        foreach($files as $file)
        {
            $minified = $this->minifyFile($type, $type . '/' . $file);
            if ($minified !== false)
            {
                $data[] = '/* ' . $file . ' */' . "\n" . $minified;
            }
        }

        $outfile = $base . $this->minifiedName . $type;
        $outfilegz = $base . $this->minifiedName . 'gz.' . $type;

        $alldata = implode("\n\n", $data);
        $bytecount = file_put_contents($outfile, $alldata);
        $log[] = date($this->shikakeOji->logDateFormat) . ' outfile: ' . $outfile . ', size: ' . $bytecount;

        if ($bytecount !== false)
        {
            $gz = gzopen($outfilegz, 'wb9');
            gzwrite($gz, $alldata);
            gzclose($gz);
			
            $wrote = true;
            $log[] = date($this->shikakeOji->logDateFormat) . ' outfilegz: ' . $outfilegz . ', size: ' . filesize($outfilegz);
        }

        file_put_contents($this->minifyLog, implode("\n", $log) . "\n", FILE_APPEND);

        return $wrote;
    }

    /**
     * Minify a single file. Adds ".min" to the filename before the suffix.
     *
     * @param   string  $type    Either js or css
     * @param   string  $file    Name of the file in public_html/ folder or under it
     * @return  string/boolean  Minified output or flase if something went wrong
     */
    private function minifyFile($type, $file)
    {
        // Keep log of what has happened and how much the filesizes were reduced.
        $log = array();

        if ($type != 'js' && $type != 'css')
        {
            return false;
        }

        // Absolute path of the given file
        $base = realpath('../public_html') . '/';
        $source = $base . $file;
		$info = pathinfo($source);

        // By default, minification has not failed, yet.
        $failed = false;

        if (file_exists($source))
        {
            $doMinify = true;
            $mtime_src = filemtime($source);

            // If the filename has a ".min" appended in the end, its content is used as such.
            if (substr($info['filename'], -4) == '.min')
            {
                $destination = $source;
                $doMinify = false;
            }
            else
            {
                // Rebuild the name by including ".min" in the end
                $destination = $info['dirname'] . '/' . $info['filename'] . '.min.' . $info['extension'];
            }

            $log[] = date($this->shikakeOji->logDateFormat) . ' source: ' . $source . ', size: ' . filesize($source);

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

                if ($type == 'js')
                {
                    try
                    {
                        $minified = Minify_JS_ClosureCompiler::minify($content);
                    }
                    catch (Exception $error)
                    {
                        $log[] = date($this->shikakeOji->logDateFormat) . ' ERROR: ' . $error->getMessage() . ' while JS source: ' . $source;
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
                        $log[] = date($this->shikakeOji->logDateFormat) . ' ERROR: ' . $error->getMessage() . ' while CSS source: ' . $source;
                        $failed = true;
                    }
                }

                if (!$failed)
                {
                    file_put_contents($destination, $minified);
					
                    $log[] = date($this->shikakeOji->logDateFormat) . ' destination: ' . $destination . ', size: ' . filesize($destination);
                }
            }
        }

        file_put_contents($this->minifyLog, implode("\n", $log) . "\n", FILE_APPEND);

        return ($doMinify && $failed) ? false : $minified;
    }

}
