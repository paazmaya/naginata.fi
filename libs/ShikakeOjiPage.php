<?php
/***************
 * NAGINATA.fi *
 ***************
 * A class for outputting HTML5 stuff.
 * Let's see how many times the buzzword HTML5 can be repeated.
 *
 * http://blog.thenounproject.com/post/7310229014/how-to-properly-attribute-cc-by-a-guest-blog-post-by
 *
 * Usage:
 *  $shih = new ShikakeOjiHyper();
 *  echo $shih->renderHtml($data, $url, $lang);
 */
class ShikakeOjiPage
{

    /**
     * Use Tidy if available.
     * http://www.php.net/manual/en/tidy.examples.php
     * http://tidy.sourceforge.net/docs/quickref.html
     */
    public $useTidy = false;

    /**
     * Is the user logged in?
     * If true, then the userEmail should be one found in the "users" section of App data.
     */
    public $isLoggedIn = false;

    /**
     * Email address of the current user, if any.
     * Be careful, this is used with "isLoggedIn" to validate the user.
     */
    public $userEmail = '';

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
     * The format used with "date()" while writing a log entry.
     */
    public $logDateFormat = 'Y-m-d H:i:s';

    /**
     * Constructor will load the JSON data and decode it as well as
     * check for compression support of the client.
     */
    function __construct()
    {
        // Nothing here...
    }

    /**
     * Render the HTML5 markup by the given data and options.
     */
    public function renderHtml($data, $url, $lang, $config)
    {
        $out = $this->createHtmlPage($data, $url, $lang, $config);

        if ($this->useTidy && extension_loaded('tidy'))
        {
            $conf = array(
                'indent' => true,
                'output-xml' => true,
                'input-xml' => true,
                'wrap' => '1000'
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
     * Create the common head section with style sheet imports.
     *
     * @param    array    $styles    List of source files in "css" folder
     * @return    string
     */
    private function createHtmlPage($data, $url, $lang, $config)
    {
        $head = '';
        foreach($data['navigation'][$lang] as $list)
        {
            if ($url == $list['url'])
            {
                $head = $list;
                break;
            }
        }

        $out = '<!DOCTYPE html>';
        $out .= '<html>';
        $out .= '<head>';
        $out .= '<title>' . $head['header'] . ' - ' . $data['title'][$lang] . '</title>';
        $out .= '<meta charset="utf-8"/>';
        $out .= '<meta name="description" property="og:description" content="' . $head['description'] . '"/>';
        
        // http://ogp.me/
        $out .= '<meta property="og:title" content="' . $head['title'] . '"/>';
        $out .= '<meta property="og:type" content="sports_team"/>'; 
        $out .= '<meta property="og:image" content="http://' . $_SERVER['HTTP_HOST'] . '/img/logo.png"/>';
        $out .= '<meta property="og:url" content="http://' . $_SERVER['HTTP_HOST'] . $url . '"/>';
        $out .= '<meta property="og:site_name" content="' . $head['title'][$lang] . '"/>';
        $out .= '<meta property="og:locale" content="fi_FI"/>'; // language_TERRITORY
        $out .= '<meta property="og:locale:alternate" content="en_GB"/>';
        $out .= '<meta property="og:locale:alternate" content="ja_JP"/>';
        $out .= '<meta property="og:email" content="BUT-NO-SPAM-PLEASE-jukka@naginata.fi"/>';
        $out .= '<meta property="og:country-name" content="Finland"/>';
        
        // https://developers.facebook.com/docs/opengraph/
        $out .= '<meta property="fb:app_id" content="' . $config['facebook']['app_id'] . '"/>'; // A Facebook Platform application ID that administers this page. 
        $out .= '<meta property="fb:admins" content="' . $config['facebook']['admins'] . '"/>';
        
        $out .= '<link rel="author" href="http://paazmaya.com"/>';
        $out .= '<link rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/"/>';
        $out .= '<link rel="shortcut icon" href="/img/favicon.png" type="image/png"/>';
        $out .= '<link rel="apple-touch-icon" href="/img/mobile-logo.png"/>'; // 57x57

        $styles = array(
            'fonts.css',
            'colorbox.css',
            'main.css'
        );
        $base = '/css/';
        
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
        $out .= '<body>';
        

        $out .= '<nav><ul>';
        foreach ($data['navigation'][$lang] as $item)
        {
            // ["/naginata", "Atarashii Naginatado", "Naginata"],
            $out .= '<li';
            if ($url == $item['url'])
            {
                $out .= ' class="current"';
            }
            $out .= '><a href="' . $item['url'] . '" title="' . $item['header'] . '">' . $item['title'] . '</a></li>';
        }
        $out .= '</ul></nav>';
        
        $out .= '<div id="wrapper">';

        $out .= '<div id="logo">';
        // should be only two words
        $out .= '<p>' . $data['title'][$lang] . '</p>';
        $out .= '</div>';
        

        // Now check the page
        if (!isset($data['article'][$lang][$url]))
        {
            return '<p class="fail">Article data for this page missing</p>';
        }
        

        if (is_array($data['article'][$lang][$url]))
        {
            foreach($data['article'][$lang][$url] as $article)
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
                    $out .= self::decodeHtml($article);
                }
                $out .= '</article>';
            }
        }
        
        $out .= '</div>';




        // Comes out as $('footer).data('isLoggedIn') == '1'
        $out .= '<footer data-is-logged-in="' . ($this->isLoggedIn ? 1 : 0) . '" data-user-email="' . $this->userEmail . '">';
        $out .= '<p>';

        foreach ($data['footer'][$lang] as $item)
        {
            // ["http://paazmaya.com", "PAAZMAYA.com", "&copy; Jukka Paasonen"]
            $out .= '<a href="' . $item['0'] . '" title="' . $item['1'] . '">' . $item['2'] . '</a> | ';
        }

        $out .= '<time datetime="' . date('c', $this->dataModified) . '">' . date('j.n.Y G:i', $this->dataModified) . '</time>';
        $out .= '</footer>';

        $base = '/js/';
        
        $scripts = array(
            'jquery.js',
            'jquery.colorbox.js',
            'sendanmaki.js'
        );
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
        if ($this->isLoggedIn)
        {
            if ($this->useMinification)
            {
                $out .= '<script type="text/javascript" src="/js/wymeditor/jquery.wymeditor.min.js"></script>';
            }
            else
            {
                $out .= '<script type="text/javascript" src="/js/wymeditor/jquery.wymeditor.js"></script>';
            }
        }
        $out .= '</body>';
        $out .= '</html>';
        return $out;
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

        file_put_contents($this->minifyLog, implode("\n", $log) . "\n", FILE_APPEND);

        return $wrote;
    }

    /**
     * Minify a single file. Adds ".min" to the filename before the suffix.
     *
     * @param   string  $type    Either js or css
     * @param   string  $file    Name of the file in public_html/[type]/ folder or under it
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
        $base = realpath('../public_html/' . $type) . '/';
        $source = $base . $file;

        // By default, minification has not failed, yet.
        $failed = false;
        
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

        file_put_contents($this->minifyLog, implode("\n", $log) . "\n", FILE_APPEND);

        return ($doMinify && $failed) ? false : $minified;
    }
    
}